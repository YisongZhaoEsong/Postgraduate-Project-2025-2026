// This file compares two feature sets for the Blue System.
// Experiment 1 uses brightness and saturation.
// Experiment 2 uses brightness, saturation, contrast and colour difference.
// I made this test to decide which feature set works better for the classifier.

let experimentImages = [];
let experimentLabels = [];

let experimentOneBrain;
let experimentTwoBrain;

let experimentOneStatus = "Waiting to train";
let experimentTwoStatus = "Waiting to train";

let experimentOneLoss = "training not started";
let experimentTwoLoss = "training not started";

let experimentOneEpoch = "-";
let experimentTwoEpoch = "-";

let expressiveCount = 20;
let notExpressiveCount = 20;
let totalExperimentImages = 40;

let trainingOptions = {
  epochs: 80,
  batchSize: 8
};

// preload() loads the Blue System dataset images before the sketch starts.
// I keep each image with its label so the same dataset can be used in both experiments.
function preload() {
  for (let i = 1; i <= 20; i++) {
    let number = nf(i, 2);

    let expressivePath = "data/blue/expressive/blue_expressive_" + number + ".png";
    let notExpressivePath = "data/blue/not_expressive/blue_not_expressive_" + number + ".png";

    experimentImages.push(loadImage(expressivePath));
    experimentLabels.push("expressive");

    experimentImages.push(loadImage(notExpressivePath));
    experimentLabels.push("not_expressive");
  }
}

function setup() {
  createCanvas(980, 680);
  textFont("Arial");

  let experimentOneOptions = {
    inputs: 2,
    outputs: 2,
    task: "classification",
    debug: false
  };

  let experimentTwoOptions = {
    inputs: 4,
    outputs: 2,
    task: "classification",
    debug: false
  };

  // Experiment 1 uses 2 input features, and Experiment 2 uses 4 input features.
  // The ml5.js documentation and ml5.js Learn helped me understand how these
  // input counts need to match the feature values I add to each classifier.
  experimentOneBrain = ml5.neuralNetwork(experimentOneOptions);
  experimentTwoBrain = ml5.neuralNetwork(experimentTwoOptions);

  // The same Blue dataset is added to both classifiers, but each one receives
  // a different feature set so I can compare the training loss fairly.
  addExperimentData(experimentOneBrain, getExperimentOneFeatures);
  addExperimentData(experimentTwoBrain, getExperimentTwoFeatures);

  // normalizeData() lets ml5 normalise the input values before training.
  // This connects to EMI Week 3 because normalised inputs can make training easier.
  experimentOneBrain.normalizeData();
  experimentTwoBrain.normalizeData();

  // The two models are trained one after another so I can compare their losses.
  trainExperimentOne();
}

// These drawing functions only display the experiment results on screen.
// They do not change the training data or the model settings.
function draw() {
  background(245);

  drawTitle();
  drawDatasetSummary();
  drawExperimentCard(
    40,
    210,
    "Experiment 1",
    "brightness, saturation",
    experimentOneStatus,
    experimentOneEpoch,
    experimentOneLoss
  );
  drawExperimentCard(
    510,
    210,
    "Experiment 2",
    "brightness, saturation, contrast, colour difference",
    experimentTwoStatus,
    experimentTwoEpoch,
    experimentTwoLoss
  );
  drawNote();
}

// Experiment 1 trains first using only the 2-feature input.
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
function addExperimentData(brain, featureFunction) {
  for (let i = 0; i < experimentImages.length; i++) {
    let features = featureFunction(experimentImages[i]);
    let label = experimentLabels[i];

    brain.addData(features, { label: label });
  }
}

// Experiment 1 only uses brightness and saturation.
// This is the simpler feature representation, which connects to EMI Week 5.
function getExperimentOneFeatures(img) {
  let featureData = getBlueFeatureData(img);

  return [
    featureData.brightness,
    featureData.saturation
  ];
}

// Experiment 2 uses brightness, saturation, contrast and colour difference.
// I made this version to test whether a richer feature representation works better.
function getExperimentTwoFeatures(img) {
  let featureData = getBlueFeatureData(img);

  return [
    featureData.brightness,
    featureData.saturation,
    featureData.contrast,
    featureData.colourDifference
  ];
}

// I used the p5.Image loadPixels() reference to understand this part.
// loadPixels() lets me read RGB pixel values from each training image.
// These RGB values are turned into input features for the Blue System classifiers.
function getBlueFeatureData(img) {
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

    // Brightness is the average of the red, green and blue values.
    let brightnessValue = (r + g + b) / 3;

    let maxValue = max(r, g, b);
    let minValue = min(r, g, b);

    let saturationValue = 0;

    // Saturation is estimated from the distance between the strongest and weakest RGB channel.
    if (maxValue > 0) {
      saturationValue = (maxValue - minValue) / maxValue;
    }

    // Colour difference compares the RGB channels against each other.
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

  // These final feature values are normalised so they are easier for the classifier to use.
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

// When Experiment 1 finishes, the second experiment starts so the two losses
// can be compared after the same training settings.
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

// This marks Experiment 2 as finished after its training callback is complete.
function finishedTrainingExperimentTwo() {
  experimentTwoStatus = "Finished";

  if (experimentTwoLoss === "training not started") {
    experimentTwoLoss = "not reported";
  }
}

// The drawing functions below only show the experiment title and results.
function drawTitle() {
  fill(20);
  noStroke();
  textSize(30);
  text("Blue System Feature Comparison", 40, 42);

  textSize(14);
  fill(70);
  text("Same Blue System dataset, same training settings, different input feature sets.", 40, 78);
}

// This draws the dataset summary so I can quickly see what labels and settings were used.
function drawDatasetSummary() {
  fill(255);
  stroke(210);
  strokeWeight(1);
  rect(40, 112, 900, 70);

  noStroke();
  fill(30);
  textSize(16);
  text("Dataset labels: expressive / not_expressive", 60, 132);

  textSize(13);
  fill(80);
  text("Images used: " + totalExperimentImages + " total", 60, 158);
  text("expressive: " + expressiveCount + " images", 270, 158);
  text("not_expressive: " + notExpressiveCount + " images", 470, 158);
  text("Training: " + trainingOptions.epochs + " epochs, batch size " + trainingOptions.batchSize, 720, 158);
}

// This card displays one experiment's feature list, status, epoch and loss.
function drawExperimentCard(x, y, title, features, statusText, epochText, lossText) {
  fill(255);
  stroke(205);
  strokeWeight(1);
  rect(x, y, 430, 300);

  noStroke();
  fill(35);
  textSize(22);
  text(title, x + 24, y + 24);

  fill(85);
  textSize(13);
  text("Feature list", x + 24, y + 70);

  fill(20);
  textSize(15);
  text(features, x + 24, y + 94, 370, 60);

  fill(85);
  textSize(13);
  text("Status", x + 24, y + 158);

  fill(20);
  textSize(15);
  text(statusText, x + 24, y + 182);

  fill(85);
  textSize(13);
  text("Current epoch", x + 24, y + 222);

  fill(20);
  textSize(15);
  text(epochText, x + 24, y + 246);

  fill(85);
  textSize(13);
  text("Final loss", x + 235, y + 222);

  fill(20);
  textSize(24);
  text(lossText, x + 235, y + 240);
}

// This final note reminds me that this page is only for comparing feature choices.
function drawNote() {
  fill(30);
  noStroke();
  textSize(14);
  text("Note: this experiment only compares feature choices. It is not the final saved Blue System model.", 40, 560);

  fill(95);
  textSize(12);
  text("No model is saved from this page.", 40, 588);
}
