// This file trains the Yellow System classifier.
// The Yellow System uses two labels: natural and not_natural.
// It trains with 20 natural images and 20 not_natural images.
// Its aesthetic preset focuses on naturalness, softness and minimal visual style.
// The label not_natural only means the image does not match
// the Yellow System preset. It does not mean the image is not beautiful.

let brain;

let naturalImages = [];
let notNaturalImages = [];

let statusText = "Loading Yellow System dataset...";
let trainingFinished = false;

let testLabel = "waiting";
let testConfidence = 0;

let currentEpoch = 0;
let currentLoss = 0;

// preload() loads the natural and not_natural images before training starts.
// The Yellow System follows a similar technical structure to the Blue System,
// but it uses a different dataset and a different aesthetic meaning.
function preload() {
  for (let i = 1; i <= 20; i++) {
    let numberText = makeTwoDigits(i);

    naturalImages.push(loadImage("data/yellow/natural/yellow_natural_" + numberText + ".png"));
    notNaturalImages.push(loadImage("data/yellow/not_natural/yellow_not_natural_" + numberText + ".png"));
  }
}

function setup() {
  createCanvas(900, 620);
  textFont("Arial");

  // The ml5.js documentation helped me understand how to create a neuralNetwork.
  // This model uses four input features and two output labels.
  let options = {
    inputs: 4,
    outputs: 2,
    task: "classification",
    debug: true
  };

  brain = ml5.neuralNetwork(options);

  // Each image is converted into feature values and added to the classifier
  // with its natural or not_natural label.
  addTrainingImages();

  // ml5 normalises the input values before training.
  // This connects to EMI Week 3 because normalised data can help optimisation.
  brain.normalizeData();

  // The Yellow model trains for 80 epochs with a batch size of 8.
  let trainingOptions = {
    epochs: 80,
    batchSize: 8
  };

  statusText = "Training Yellow System model...";

  // This starts the Yellow System training process.
  brain.train(trainingOptions, whileTraining, finishedTraining);
}

function draw() {
  background(30);

  fill(255);
  noStroke();

  textSize(28);
  text("Yellow System Training Test", 40, 50);

  textSize(15);
  text("Dataset: natural 20 images / not_natural 20 images", 40, 85);
  text("Features: brightness, saturation, contrast, colour difference", 40, 110);

  textSize(16);
  text(statusText, 40, 155);

  textSize(15);
  text("Epoch: " + currentEpoch, 40, 190);
  text("Loss: " + nf(currentLoss, 1, 4), 40, 215);

  textSize(16);
  text("Test result: " + testLabel + " / confidence: " + nf(testConfidence, 1, 2), 40, 250);

  textSize(13);
  text("Press S after training to save the model.", 40, 285);

  drawPreviewImages();
}

// This follows the idea from The Coding Train Pose Classifier tutorial:
// extracted numerical values can be used as input features for a classifier.
// Here I use image features instead of pose values.
function addTrainingImages() {
  for (let i = 0; i < naturalImages.length; i++) {
    let features = getImageFeatures(naturalImages[i]);
    brain.addData(features, { label: "natural" });
  }

  for (let i = 0; i < notNaturalImages.length; i++) {
    let features = getImageFeatures(notNaturalImages[i]);
    brain.addData(features, { label: "not_natural" });
  }
}

// whileTraining() shows the current epoch and loss while the model is learning.
function whileTraining(epoch, loss) {
  currentEpoch = epoch;

  if (loss && loss.loss) {
    currentLoss = loss.loss;
  }
}

// finishedTraining() runs when the model has finished learning from the Yellow dataset.
// After that it does a quick test using one natural image.
function finishedTraining() {
  trainingFinished = true;
  statusText = "Yellow System training finished.";

  let testFeatures = getImageFeatures(naturalImages[0]);
  brain.classify(testFeatures, gotTestResult);
}

// gotTestResult() stores the result label and confidence after the quick test.
function gotTestResult(error, results) {
  if (Array.isArray(error)) {
    results = error;
    error = null;
  }

  if (error) {
    console.log(error);
    testLabel = "error";
    testConfidence = 0;
    return;
  }

  if (results && results.length > 0) {
    testLabel = results[0].label;
    testConfidence = results[0].confidence;
  }
}

// Pressing S saves the trained Yellow System model.
function keyPressed() {
  if (key === "s" || key === "S") {
    if (trainingFinished === true) {
      brain.save("yellow_system_model");
    }
  }
}

// I used the p5.Image loadPixels() reference to understand this step.
// loadPixels() lets me read the RGB values from the image, then the image
// values become four inputs for the classifier.
function getImageFeatures(img) {
  let smallImage = img.get();
  // The image is resized to 64 x 64 so every training image is measured the same way.
  smallImage.resize(64, 64);
  // loadPixels() reads RGB pixel data into smallImage.pixels.
  smallImage.loadPixels();

  let totalBrightness = 0;
  let totalSaturation = 0;
  let totalColourDifference = 0;

  let brightnessValues = [];

  for (let i = 0; i < smallImage.pixels.length; i += 4) {
    let r = smallImage.pixels[i];
    let g = smallImage.pixels[i + 1];
    let b = smallImage.pixels[i + 2];

    // Brightness is calculated from the average of the red, green and blue values.
    let brightnessValue = (r + g + b) / 3;

    let maxValue = max(r, g, b);
    let minValue = min(r, g, b);

    let saturationValue = 0;

    // Saturation is estimated from the range between the strongest and weakest RGB channel.
    if (maxValue > 0) {
      saturationValue = (maxValue - minValue) / maxValue;
    }

    // Colour difference compares how far the RGB channels are from each other.
    let colourDifference = abs(r - g) + abs(g - b) + abs(b - r);

    totalBrightness += brightnessValue;
    totalSaturation += saturationValue;
    totalColourDifference += colourDifference;

    brightnessValues.push(brightnessValue);
  }

  let pixelCount = brightnessValues.length;

  let averageBrightness = totalBrightness / pixelCount;
  let averageSaturation = totalSaturation / pixelCount;
  let averageColourDifference = totalColourDifference / pixelCount;

  let contrast = 0;

  // Contrast checks how far each brightness value is from the average brightness.
  for (let i = 0; i < brightnessValues.length; i++) {
    contrast += abs(brightnessValues[i] - averageBrightness);
  }

  contrast = contrast / pixelCount;

  // The four final values are normalised and used as classifier inputs.
  // This connects to EMI Week 5 because the visual image is represented as numbers.
  let inputValues = [
    averageBrightness / 255,
    averageSaturation,
    contrast / 255,
    averageColourDifference / 765
  ];

  return inputValues;
}

// This displays a small preview of the Yellow training dataset.
function drawPreviewImages() {
  let previewX = 40;
  let previewY = 330;
  let previewSize = 55;

  for (let i = 0; i < 10; i++) {
    image(naturalImages[i], previewX + i * 65, previewY, previewSize, previewSize);
  }

  fill(255);
  textSize(12);
  text("natural preview", previewX, previewY + 75);

  let secondY = previewY + 110;

  for (let i = 0; i < 10; i++) {
    image(notNaturalImages[i], previewX + i * 65, secondY, previewSize, previewSize);
  }

  fill(255);
  textSize(12);
  text("not_natural preview", previewX, secondY + 75);
}

// makeTwoDigits() keeps file names consistent, like 01, 02 and 10.
function makeTwoDigits(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return "" + number;
  }
}
