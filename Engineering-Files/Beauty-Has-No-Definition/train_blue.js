// This file trains the Blue System classifier.
// The dataset has two labels: expressive and not_expressive.
// It uses 20 expressive images and 20 not_expressive images,
// so I can create my own trained model for the Blue System.

let brain;

let trainingImages = [];
let trainingLabels = [];

let statusText = "Loading blue dataset...";
let trainingText = "";
let resultText = "";

let totalImages = 40;
let modelReady = false;

// preload() loads the Blue System training images and their labels
// before the training starts.
function preload() {
  for (let i = 1; i <= 20; i++) {
    let number = nf(i, 2);

    let expressivePath = "data/blue/expressive/blue_expressive_" + number + ".png";
    let notExpressivePath = "data/blue/not_expressive/blue_not_expressive_" + number + ".png";

    trainingImages.push(loadImage(expressivePath));
    trainingLabels.push("expressive");

    trainingImages.push(loadImage(notExpressivePath));
    trainingLabels.push("not_expressive");
  }
}

function setup() {
  createCanvas(900, 620);
  textFont("Arial");

  // The ml5.js documentation helped me understand how to create a neuralNetwork.
  // This Blue model uses four input features and two output labels.
  let options = {
    inputs: 4,
    outputs: 2,
    task: "classification",
    debug: true
  };

  brain = ml5.neuralNetwork(options);

  // Each image is converted into feature values and added to the classifier
  // together with its expressive or not_expressive label.
  addTrainingData();

  // ml5 normalises the input values before training.
  // This connects to EMI Week 3 because normalised data can help optimisation.
  brain.normalizeData();

  // The model trains for 80 epochs with a batch size of 8.
  let trainingOptions = {
    epochs: 80,
    batchSize: 8
  };

  statusText = "Training Blue System model...";
  // This starts the training process using the options above.
  brain.train(trainingOptions, whileTraining, finishedTraining);
}

function draw() {
  background(30);

  fill(255);
  noStroke();

  textSize(28);
  text("Blue System Training Test", 40, 50);

  textSize(15);
  text("Dataset: expressive 20 images / not_expressive 20 images", 40, 90);
  text("Features: brightness, saturation, contrast, colour difference", 40, 115);

  textSize(16);
  text(statusText, 40, 160);
  text(trainingText, 40, 190);
  text(resultText, 40, 220);

  textSize(13);
  text("Press S after training to save the model.", 40, 255);

  drawDatasetPreview();
}

// This follows the idea from The Coding Train Pose Classifier tutorial:
// extracted numerical values can be used as input features for a classifier.
// Here I use image features instead of pose values.
function addTrainingData() {
  for (let i = 0; i < trainingImages.length; i++) {
    let features = getImageFeatures(trainingImages[i]);
    let label = trainingLabels[i];

    brain.addData(features, { label: label });
  }
}

// I used the p5.Image loadPixels() reference to understand this part.
// The image is resized, RGB values are read, and four feature values are created.
// This connects to EMI Week 5 because the image needs to become input features.
function getImageFeatures(img) {
  let smallImage = img.get();
  smallImage.resize(64, 64);
  smallImage.loadPixels();

  let totalBrightness = 0;
  let totalSaturation = 0;
  let totalColourDifference = 0;

  let brightnessValues = [];

  for (let i = 0; i < smallImage.pixels.length; i += 4) {
    let r = smallImage.pixels[i];
    let g = smallImage.pixels[i + 1];
    let b = smallImage.pixels[i + 2];

    // Brightness is calculated from the average of red, green and blue.
    let brightnessValue = (r + g + b) / 3;

    let maxValue = max(r, g, b);
    let minValue = min(r, g, b);

    let saturationValue = 0;

    // Saturation is estimated from the range between the strongest and weakest RGB channel.
    if (maxValue > 0) {
      saturationValue = (maxValue - minValue) / maxValue;
    }

    // Colour difference compares how different the RGB channels are from each other.
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

  let inputValues = [
    averageBrightness / 255,
    averageSaturation,
    contrast / 255,
    averageColourDifference / 765
  ];

  return inputValues;
}

// whileTraining() shows the current epoch and loss while the model is learning.
function whileTraining(epoch, loss) {
  trainingText = "Epoch: " + epoch + " / Loss: " + loss.loss.toFixed(4);
}

// finishedTraining() runs when the model has finished learning from the dataset.
// After that it does a quick test using one training image.
function finishedTraining() {
  statusText = "Blue System training finished.";
  trainingText = "The model has learned expressive / not_expressive from the 40 images.";
  modelReady = true;

  testModel();
}

// This quick test checks that the trained model can return a label and confidence.
function testModel() {
  let testImage = trainingImages[0];
  let testFeatures = getImageFeatures(testImage);

  brain.classify(testFeatures, gotResult);
}

function gotResult(error, results) {
  if (error) {
    resultText = "Test error.";
    console.log(error);
    return;
  }

  resultText = "Test result: " + results[0].label + " / confidence: " + nf(results[0].confidence, 1, 2);
}

// This preview only helps me see some of the training images on screen.
function drawDatasetPreview() {
  let x = 40;
  let y = 300;
  let w = 80;
  let h = 80;

  for (let i = 0; i < 10; i++) {
    image(trainingImages[i], x + i * 84, y, w, h);
  }

  fill(255);
  textSize(12);
  text("Small preview of training images", 40, 400);
}

// Pressing S saves the trained Blue System model files.
function keyPressed() {
  if (key === "s" || key === "S") {
    if (modelReady === true) {
      brain.save("blue_system_model");
    }
  }
}
