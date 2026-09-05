// This file evaluates the already-trained Blue System model.
// It uses unseen test images, so I can check how the classifier
// responds to images that were not used during training.
// I made this page to measure the Blue System test set accuracy.

let brain;

let testItems = [];
let testImages = [];
let testResults = [];

let modelReady = false;
let evaluationStarted = false;
let evaluationFinished = false;

let statusText = "Loading Blue System model...";
let correctCount = 0;
let currentIndex = 0;

// preload() loads 5 expressive and 5 not_expressive test images.
// These images are separate from the training set, which connects to
// EMI Week 3 because I am checking how the trained model performs after training.
function preload() {
  for (let i = 1; i <= 5; i++) {
    let number = nf(i, 2);
    let path = "data/blue_test/blue_test_expressive_" + number + ".png";

    testItems.push({
      path: path,
      label: getTrueLabelFromFilename(path)
    });
  }

  for (let i = 1; i <= 5; i++) {
    let number = nf(i, 2);
    let path = "data/blue_test/blue_test_not_expressive_" + number + ".png";

    testItems.push({
      path: path,
      label: getTrueLabelFromFilename(path)
    });
  }

  for (let i = 0; i < testItems.length; i++) {
    testImages.push(loadImage(testItems[i].path));
  }
}

// The true label is taken from the file name, so each test image can be
// compared against the label it is supposed to have.
function getTrueLabelFromFilename(filename) {
  if (filename.indexOf("not_expressive") !== -1) {
    return "not_expressive";
  }

  if (filename.indexOf("expressive") !== -1) {
    return "expressive";
  }

  return "unknown";
}

function setup() {
  createCanvas(1040, 760);
  textFont("Arial");

  let options = {
    inputs: 4,
    outputs: 2,
    task: "classification"
  };

  // The classifier uses four input features: brightness, saturation,
  // contrast and colour difference. This connects to EMI Week 5 because
  // the model depends on how the image is represented as input values.
  brain = ml5.neuralNetwork(options);
  // The ml5.js documentation helped me understand how to load a trained model
  // and classify new input data with it.
  brain.load("models/blue/blue_system_model.json", blueModelLoaded);
}

function draw() {
  background(244);

  drawHeader();
  drawSummary();
  drawResultsTable();
  drawNote();
}

function blueModelLoaded() {
  modelReady = true;
  statusText = "Blue System model loaded. Evaluating test images...";
  startEvaluation();
}

// The evaluation starts once the trained Blue model has loaded.
function startEvaluation() {
  if (evaluationStarted === true) {
    return;
  }

  evaluationStarted = true;
  currentIndex = 0;
  correctCount = 0;
  testResults = [];

  classifyNextTestImage();
}

// This classifies the unseen test images one by one instead of all at once.
function classifyNextTestImage() {
  if (currentIndex >= testItems.length) {
    evaluationFinished = true;
    statusText = "Evaluation finished.";
    return;
  }

  let features = getImageFeatures(testImages[currentIndex]);
  brain.classify(features, gotTestResult);
}

// This part compares the predicted label with the true label,
// then saves whether the result is correct or wrong.
function gotTestResult(error, results) {
  if (Array.isArray(error)) {
    results = error;
    error = null;
  }

  let trueLabel = testItems[currentIndex].label;
  let predictedLabel = "error";
  let confidence = 0;

  if (error) {
    console.log(error);
  } else if (results && results.length > 0) {
    predictedLabel = results[0].label;
    confidence = results[0].confidence;
  }

  let isCorrect = predictedLabel === trueLabel;

  if (isCorrect) {
    correctCount++;
  }

  testResults.push({
    path: testItems[currentIndex].path,
    trueLabel: trueLabel,
    predictedLabel: predictedLabel,
    confidence: confidence,
    correct: isCorrect
  });

  currentIndex++;
  classifyNextTestImage();
}

// I used the p5.Image loadPixels() reference to understand this feature step.
// The image is resized, RGB values are read, and four feature values are created.
// This also follows the idea from The Coding Train Pose Classifier tutorial:
// extracted numerical values can be used as inputs for an ml5 classifier.
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

    // Brightness is calculated from the average of the red, green and blue values.
    let brightnessValue = (r + g + b) / 3;

    let maxValue = max(r, g, b);
    let minValue = min(r, g, b);

    let saturationValue = 0;

    // Saturation is estimated from the range between the strongest and weakest RGB channel.
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

  // Contrast checks how far each pixel brightness is from the average brightness.
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

// This drawing function shows the page title and the model/test set details.
function drawHeader() {
  fill(25);
  noStroke();
  textSize(30);
  text("Blue System Test Set Accuracy", 40, 38);

  fill(75);
  textSize(14);
  text("Model: models/blue/blue_system_model.json", 40, 74);
  text("Test images: data/blue_test", 40, 96);
  text("Features: brightness, saturation, contrast, colour difference", 40, 118);
}

// drawSummary() displays the current evaluation status and total accuracy.
function drawSummary() {
  fill(255);
  stroke(205);
  strokeWeight(1);
  rect(40, 150, 960, 102);

  noStroke();
  fill(30);
  textSize(16);
  text("Labels: expressive / not_expressive", 60, 170);

  fill(70);
  textSize(13);
  text(statusText, 60, 198);
  text("Images used: " + testItems.length + " unseen test images", 60, 222);

  let accuracy = 0;

  if (testItems.length > 0) {
    accuracy = correctCount / testItems.length * 100;
  }

  fill(20);
  textSize(30);
  text(nf(accuracy, 1, 1) + "%", 790, 168);

  fill(70);
  textSize(13);
  text("Accuracy", 792, 204);
  text(correctCount + " / " + testItems.length + " correct", 792, 226);
}

// drawResultsTable() shows the result for each test image, including the
// true label, prediction, confidence and whether it was correct.
function drawResultsTable() {
  let x = 40;
  let y = 292;
  let rowH = 38;

  fill(35);
  noStroke();
  textSize(18);
  text("Per-image Evaluation", x, y - 34);

  fill(30);
  rect(x, y, 960, rowH);

  fill(255);
  textSize(12);
  text("Image", x + 16, y + 12);
  text("True label", x + 430, y + 12);
  text("Prediction", x + 585, y + 12);
  text("Confidence", x + 735, y + 12);
  text("Result", x + 860, y + 12);

  for (let i = 0; i < testItems.length; i++) {
    let rowY = y + rowH + i * rowH;

    if (i % 2 === 0) {
      fill(255);
    } else {
      fill(235);
    }

    noStroke();
    rect(x, rowY, 960, rowH);

    let result = testResults[i];
    let predictedLabel = "waiting";
    let confidenceText = "-";
    let resultText = "-";

    if (result) {
      predictedLabel = result.predictedLabel;
      confidenceText = nf(result.confidence, 1, 2);
      resultText = result.correct ? "correct" : "wrong";
    }

    fill(35);
    textSize(12);
    text(testItems[i].path, x + 16, rowY + 12);
    text(testItems[i].label, x + 430, rowY + 12);
    text(predictedLabel, x + 585, rowY + 12);
    text(confidenceText, x + 735, rowY + 12);

    if (result && result.correct) {
      fill(20, 125, 75);
    } else if (result) {
      fill(180, 55, 45);
    } else {
      fill(100);
    }

    text(resultText, x + 860, rowY + 12);
  }
}

// This page only evaluates the trained model. It does not retrain,
// save, or overwrite the Blue System model files.
function drawNote() {
  fill(45);
  noStroke();
  textSize(14);
  text("Note: this page only evaluates the already-trained Blue System model. It does not retrain, save, or overwrite model files.", 40, 720);
}
