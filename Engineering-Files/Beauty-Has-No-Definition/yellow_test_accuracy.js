// This file evaluates the already-trained Yellow System model.
// It uses unseen test images, so I can check how the classifier
// responds to images that were not used during training.
// The Yellow System uses the labels natural and not_natural.
// In this project, not_natural only means the image does not match
// the Yellow System preset. It does not mean the image is not beautiful.

let yellowBrain;

let testItems = [];
let testImages = [];
let testResults = [];

let modelReady = false;
let evaluationStarted = false;
let evaluationFinished = false;

let statusText = "Loading Yellow System model...";
let correctCount = 0;
let currentIndex = 0;

// preload() loads 5 natural test images and 5 not_natural test images.
// These are used after training, which connects to EMI Week 3 because
// I am checking the model on separate evaluation images.
function preload() {
  for (let i = 1; i <= 5; i++) {
    let numberText = makeTwoDigits(i);
    let imagePath = "data/yellow_test/yellow_test_natural_" + numberText + ".png";

    testItems.push({
      path: imagePath,
      label: getTrueLabelFromFilename(imagePath)
    });
  }

  for (let i = 1; i <= 5; i++) {
    let numberText = makeTwoDigits(i);
    let imagePath = "data/yellow_test/yellow_test_not_natural_" + numberText + ".png";

    testItems.push({
      path: imagePath,
      label: getTrueLabelFromFilename(imagePath)
    });
  }

  for (let i = 0; i < testItems.length; i++) {
    testImages.push(loadImage(testItems[i].path));
  }
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
  // the image has to be represented as numerical input values.
  yellowBrain = ml5.neuralNetwork(options);
  // The ml5.js documentation helped me understand how to load a trained model
  // and classify new input data.
  yellowBrain.load("models/yellow/yellow_system_model.json", yellowModelLoaded);
}

function draw() {
  background(248, 246, 238);

  drawHeader();
  drawSummary();
  drawResultsTable();
  drawNote();
}

function yellowModelLoaded() {
  modelReady = true;
  statusText = "Yellow System model loaded. Evaluating test images...";
  startEvaluation();
}

// Evaluation starts after the trained Yellow model has loaded.
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

// This classifies the test images one by one so each result can be saved.
function classifyNextTestImage() {
  if (currentIndex >= testItems.length) {
    evaluationFinished = true;
    statusText = "Evaluation finished.";
    return;
  }

  let features = getImageFeatures(testImages[currentIndex]);

  // The classifier only runs when the four feature values are available.
  if (features.length === 4) {
    yellowBrain.classify(features, gotTestResult);
  }
}

// This part compares the predicted label with the true label,
// then counts and saves whether the result is correct or wrong.
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

// The true label is read from the image file name.
function getTrueLabelFromFilename(filename) {
  if (filename.indexOf("not_natural") !== -1) {
    return "not_natural";
  }

  if (filename.indexOf("natural") !== -1) {
    return "natural";
  }

  return "unknown";
}

// I used the p5.Image loadPixels() reference to understand this feature step.
// The image is resized, RGB values are read, and four feature values are created.
// This also follows the idea from The Coding Train Pose Classifier tutorial:
// extracted numerical values can be used as input features for a classifier.
function getImageFeatures(img) {
  let smallImage = img.get();
  // The image is resized to 64 x 64 so every test image is measured consistently.
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

    // Brightness is calculated from the average of red, green and blue.
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
  let inputValues = [
    averageBrightness / 255,
    averageSaturation,
    contrast / 255,
    averageColourDifference / 765
  ];

  return inputValues;
}

function drawHeader() {
  fill(25);
  noStroke();
  textSize(30);
  text("Yellow System Test Set Accuracy", 40, 38);

  fill(75);
  textSize(14);
  text("Model path: models/yellow/yellow_system_model.json", 40, 74);
  text("Test image folder: data/yellow_test", 40, 96);
  text("Features: brightness, saturation, contrast, colour difference", 40, 118);
}

// drawSummary() displays the current status, accuracy and correct prediction count.
function drawSummary() {
  fill(255);
  stroke(218, 204, 158);
  strokeWeight(1);
  rect(40, 150, 960, 102);

  noStroke();
  fill(30);
  textSize(16);
  text("Labels: natural / not_natural", 60, 170);

  fill(70);
  textSize(13);
  text(statusText, 60, 198);
  text("Total test images: " + testItems.length, 60, 222);

  let accuracy = 0;

  if (testItems.length > 0) {
    accuracy = correctCount / testItems.length * 100;
  }

  fill(20);
  textSize(30);
  text(nf(accuracy, 1, 1) + "%", 790, 168);

  fill(70);
  textSize(13);
  text("Final test accuracy", 792, 204);
  text(correctCount + " / " + testItems.length + " correct predictions", 792, 226);
}

// drawResultsTable() displays the per-image evaluation results.
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
  text("Image path", x + 16, y + 12);
  text("True label", x + 430, y + 12);
  text("Predicted label", x + 585, y + 12);
  text("Confidence", x + 735, y + 12);
  text("Result", x + 860, y + 12);

  for (let i = 0; i < testItems.length; i++) {
    let rowY = y + rowH + i * rowH;

    if (i % 2 === 0) {
      fill(255);
    } else {
      fill(238, 234, 218);
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
// save, or overwrite the Yellow System model files.
function drawNote() {
  fill(45);
  noStroke();
  textSize(14);
  text("This page only evaluates the already-trained Yellow System model. It does not retrain, save, or overwrite model files.", 40, 720);
}

// makeTwoDigits() keeps file names consistent, like 01, 02 and 10.
function makeTwoDigits(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return "" + number;
  }
}
