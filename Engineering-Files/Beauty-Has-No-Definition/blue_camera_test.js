// Separate Blue System webcam test file.
// I use this file to check if the trained Blue System model can work
// with live webcam input before using it in the full final sketch.

let video;
let brain;

let modelReady = false;
let isClassifying = false;

let blueLabel = "waiting";
let blueConfidence = 0;

let statusText = "Loading Blue System model...";

function setup() {
  createCanvas(900, 620);
  textFont("Arial");

  // This camera setup is based on the p5.js Video Capture example.
  // createCapture(VIDEO) starts the webcam, and video.hide() hides
  // the HTML video element because I draw the video onto the canvas myself.
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  let options = {
    inputs: 4,
    outputs: 2,
    task: "classification"
  };

  // This follows the basic ml5.js browser-based classification workflow.
  // The ml5.js documentation and ml5.js Learn helped me understand how
  // a neuralNetwork can take input values and return a class label.
  // The Coding Train Pose Classifier tutorial also helped me understand
  // the idea of sending numerical values into an ml5 classifier.
  brain = ml5.neuralNetwork(options);

  // This loads the trained Blue System model so the webcam features can
  // be classified as expressive or not_expressive.
  brain.load("models/blue/blue_system_model.json", blueModelLoaded);
}

function draw() {
  background(30);

  fill(255);
  noStroke();

  textSize(28);
  text("Blue System Webcam Test", 40, 50);

  textSize(15);
  text("Blue System judges whether the live image is expressive or not_expressive.", 40, 85);
  text("Features: brightness, saturation, contrast, colour difference", 40, 110);

  // The live webcam image is drawn onto the canvas here.
  // This is the same basic idea I learned from the p5.js Video Capture example.
  image(video, 40, 150, 320, 240);

  textSize(18);
  text(statusText, 400, 170);

  textSize(26);
  text("BLUE SYSTEM RESULT", 400, 230);

  textSize(36);
  text(blueLabel, 400, 285);

  textSize(18);
  text("Confidence: " + nf(blueConfidence, 1, 2), 400, 325);

  textSize(13);
  text("This is only a Blue model test. It does not replace the face yet.", 400, 365);

  // The model is only called every 60 frames so it does not classify too often.
  if (modelReady === true && isClassifying === false && frameCount % 60 === 0) {
    classifyCamera();
  }
}

function blueModelLoaded() {
  modelReady = true;
  statusText = "Blue System model loaded.";
}

// This function gets the current webcam frame, extracts four image features,
// and sends those feature values into the Blue System classifier.
function classifyCamera() {
  isClassifying = true;

  let currentImage = video.get();
  let features = getImageFeatures(currentImage);

  brain.classify(features, gotBlueResult);
}

// This receives the classification result from ml5 and stores the label
// and confidence so they can be shown on the canvas.
function gotBlueResult(error, results) {
  isClassifying = false;

  if (error) {
    console.log(error);
    blueLabel = "error";
    blueConfidence = 0;
    return;
  }

  if (results && results.length > 0) {
    blueLabel = results[0].label;
    blueConfidence = results[0].confidence;
  }
}

// I used the p5.Image loadPixels() reference to understand this part.
// loadPixels() allows me to read RGB values from an image, and then I
// adapted those pixel values into simple image features for the classifier.
function getImageFeatures(img) {
  let smallImage = img.get();
  // The image is resized to 64 x 64 so the feature calculation stays small
  // and consistent each time the webcam frame is checked.
  smallImage.resize(64, 64);
  // loadPixels() reads the RGB pixel data into smallImage.pixels.
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

  // Contrast checks how far each pixel brightness is from the average brightness.
  for (let i = 0; i < brightnessValues.length; i++) {
    contrast += abs(brightnessValues[i] - averageBrightness);
  }

  contrast = contrast / pixelCount;

  // These four final values are normalised and used as the classifier inputs.
  // In this file, I adapted the Coding Train classifier idea by using image
  // features instead of pose values.
  let inputValues = [
    averageBrightness / 255,
    averageSaturation,
    contrast / 255,
    averageColourDifference / 765
  ];

  return inputValues;
}
