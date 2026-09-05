// This file compares two feature sets for the Yellow System.
// The Yellow System uses the labels natural and not_natural.
// Its preset focuses on naturalness, softness and minimal visual style.
// Experiment 1 uses brightness and saturation.
// Experiment 2 uses brightness, saturation, contrast and colour difference.
// I made this test to decide which feature set works better for the Yellow classifier.
// In this project, not_natural only means the image does not match
// the Yellow System preset. It does not mean the image is not beautiful.

let naturalImages = [];
let notNaturalImages = [];

let experimentOneBrain;
let experimentTwoBrain;

let experimentOneStatus = "Waiting to train";
let experimentTwoStatus = "Waiting to train";

let experimentOneEpoch = "-";
let experimentTwoEpoch = "-";

let experimentOneLoss = "training not started";
let experimentTwoLoss = "training not started";

let naturalCount = 20;
let notNaturalCount = 20;
let totalImages = 40;

let trainingOptions = {
  epochs: 80,
  batchSize: 8
};

// preload() loads 20 natural images and 20 not_natural images before the sketch starts.
function preload() {
  for (let i = 1; i <= 20; i++) {
    let numberText = makeTwoDigits(i);

    naturalImages.push(loadImage("data/yellow/natural/yellow_natural_" + numberText + ".png"));
    notNaturalImages.push(loadImage("data/yellow/not_natural/yellow_not_natural_" + numberText + ".png"));
  }
}

function setup() {
  createCanvas(980, 650);
  textFont("Arial");

  // Experiment 1 uses 2 input features: brightness and saturation.
  let experimentOneOptions = {
    inputs: 2,
    outputs: 2,
    task: "classification",
    debug: false
  };

  // Experiment 2 uses 4 input features, adding contrast and colour difference.
  let experimentTwoOptions = {
    inputs: 4,
    outputs: 2,
    task: "classification",
    debug: false
  };

  // This follows the ml5.js classification workflow I learned from the documentation:
  // create a neuralNetwork, add data, normalise it, and train the classifier.
  experimentOneBrain = ml5.neuralNetwork(experimentOneOptions);
  experimentTwoBrain = ml5.neuralNetwork(experimentTwoOptions);

  // The same Yellow dataset is added to both models, but each model receives
  // a different feature set so I can compare the losses fairly.
  addTrainingImages(experimentOneBrain, getExperimentOneFeatures);
  addTrainingImages(experimentTwoBrain, getExperimentTwoFeatures);

  // normalizeData() lets ml5 normalise the input values before training.
  // This connects to EMI Week 3 because normalised inputs can help optimisation.
  experimentOneBrain.normalizeData();
  experimentTwoBrain.normalizeData();

  // The two experiments are trained one after another so their losses can be compared.
  trainExperimentOne();
}

// The drawing functions on this page only display the dataset summary,
// experiment settings and final loss values.
function draw() {
  background(248, 246, 238);

  drawTitle();
  drawDatasetSummary();

  drawExperimentCard(
    40,
    215,
    "Experiment 1",
    "brightness, saturation",
    experimentOneStatus,
    experimentOneEpoch,
    experimentOneLoss
  );

  drawExperimentCard(
    510,
    215,
    "Experiment 2",
    "brightness, saturation, contrast, colour difference",
    experimentTwoStatus,
    experimentTwoEpoch,
    experimentTwoLoss
  );

  drawNote();
}

// Experiment 1 trains first with the 2-feature input.
function trainExperimentOne() {
  experimentOneStatus = "Training with 2 input features";
  experimentOneBrain.train(trainingOptions, whileTrainingExperimentOne, finishedTrainingExperimentOne);
}

// Experiment 2 trains after Experiment 1 finishes, using the 4-feature input.
function trainExperimentTwo() {
  experimentTwoStatus = "Training with 4 input features";
  experimentTwoBrain.train(trainingOptions, whileTrainingExperimentTwo, finishedTrainingExperimentTwo);
}

// This follows the idea from The Coding Train Pose Classifier tutorial:
// extracted numerical values can be used as input features for a classifier.
// Here I use image features instead of pose values.
function addTrainingImages(brain, featureFunction) {
  for (let i = 0; i < naturalImages.length; i++) {
    let features = featureFunction(naturalImages[i]);
    brain.addData(features, { label: "natural" });
  }

  for (let i = 0; i < notNaturalImages.length; i++) {
    let features = featureFunction(notNaturalImages[i]);
    brain.addData(features, { label: "not_natural" });
  }
}

// Experiment 1 only uses brightness and saturation.
// This is the simpler feature representation, which connects to EMI Week 5.
function getExperimentOneFeatures(img) {
  let features = getYellowFeatureData(img);

  return [
    features.brightness,
    features.saturation
  ];
}

// Experiment 2 uses brightness, saturation, contrast and colour difference.
// This tests whether the richer feature set works better for the Yellow classifier.
function getExperimentTwoFeatures(img) {
  let features = getYellowFeatureData(img);

  return [
    features.brightness,
    features.saturation,
    features.contrast,
    features.colourDifference
  ];
}

// I used the p5.Image loadPixels() reference to understand this part.
// loadPixels() lets me read RGB pixel values from each training image.
// The RGB values are then turned into input features for the classifier.
function getYellowFeatureData(img) {
  let smallImage = img.get();
  // The image is resized to 64 x 64 so each image is measured consistently.
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

  // The final values are normalised before being used as classifier inputs.
  return {
    brightness: averageBrightness / 255,
    saturation: averageSaturation,
    contrast: contrast / 255,
    colourDifference: averageColourDifference / 765
  };
}

// This training callback records the current epoch and loss for Experiment 1.
function whileTrainingExperimentOne(epoch, loss) {
  experimentOneEpoch = epoch;

  if (loss && typeof loss.loss === "number") {
    experimentOneLoss = loss.loss.toFixed(4);
  }
}

// When Experiment 1 finishes, the second experiment starts.
function finishedTrainingExperimentOne() {
  experimentOneStatus = "Finished";

  if (experimentOneLoss === "training not started") {
    experimentOneLoss = "not reported";
  }

  trainExperimentTwo();
}

// This training callback records the current epoch and loss for Experiment 2.
function whileTrainingExperimentTwo(epoch, loss) {
  experimentTwoEpoch = epoch;

  if (loss && typeof loss.loss === "number") {
    experimentTwoLoss = loss.loss.toFixed(4);
  }
}

// This marks Experiment 2 as finished after training is complete.
function finishedTrainingExperimentTwo() {
  experimentTwoStatus = "Finished";

  if (experimentTwoLoss === "training not started") {
    experimentTwoLoss = "not reported";
  }
}

// This drawing function displays the title and the main experiment description.
function drawTitle() {
  fill(30);
  noStroke();
  textSize(30);
  text("Yellow System Feature Comparison", 40, 42);

  fill(80);
  textSize(14);
  text("Same Yellow System dataset, same training settings, different input feature sets.", 40, 78);
}

// This draws the dataset summary so I can see the labels, image count and training settings.
function drawDatasetSummary() {
  fill(255);
  stroke(218, 204, 158);
  strokeWeight(1);
  rect(40, 112, 900, 72);

  noStroke();
  fill(30);
  textSize(16);
  text("Dataset labels: natural / not_natural", 60, 134);

  fill(80);
  textSize(13);
  text("Images used: " + totalImages + " total", 60, 160);
  text("natural: " + naturalCount + " images", 265, 160);
  text("not_natural: " + notNaturalCount + " images", 455, 160);
  text("Training: " + trainingOptions.epochs + " epochs, batch size " + trainingOptions.batchSize, 710, 160);
}

// This card displays one experiment's feature list, status, epoch and final loss.
function drawExperimentCard(x, y, title, features, statusText, epochText, lossText) {
  fill(255);
  stroke(218, 204, 158);
  strokeWeight(1);
  rect(x, y, 430, 285);

  noStroke();
  fill(35);
  textSize(22);
  text(title, x + 24, y + 24);

  fill(90);
  textSize(13);
  text("Feature list", x + 24, y + 68);

  fill(20);
  textSize(15);
  text(features, x + 24, y + 92, 372, 56);

  fill(90);
  textSize(13);
  text("Status", x + 24, y + 154);

  fill(20);
  textSize(15);
  text(statusText, x + 24, y + 178);

  fill(90);
  textSize(13);
  text("Current epoch", x + 24, y + 218);

  fill(20);
  textSize(15);
  text(epochText, x + 24, y + 242);

  fill(90);
  textSize(13);
  text("Final loss", x + 235, y + 218);

  fill(20);
  textSize(24);
  text(lossText, x + 235, y + 236);
}

// This file only compares feature choices and does not save or overwrite the Yellow model.
function drawNote() {
  fill(35);
  noStroke();
  textSize(14);
  text("Note: this experiment only compares feature choices. It is not the final saved Yellow System model.", 40, 555);

  fill(90);
  textSize(12);
  text("No model is saved or overwritten from this page.", 40, 582);
}

// makeTwoDigits() keeps file names consistent, like 01, 02 and 10.
function makeTwoDigits(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return "" + number;
  }
}
