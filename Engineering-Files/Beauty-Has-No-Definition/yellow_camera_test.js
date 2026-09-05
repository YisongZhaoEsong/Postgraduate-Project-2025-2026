// This is a separate Yellow System webcam test file.
// It checks whether the trained Yellow System model can classify live webcam input.
// The Yellow System uses the labels natural and not_natural.
// Its preset focuses on naturalness, softness and minimal visual style.
// In this project, not_natural only means the image does not match
// the Yellow System preset. It does not mean the person is not beautiful.

let video;
let yellowBrain;

let yellowModelReady = false;
let yellowIsClassifying = false;

let yellowLabel = "waiting";
let yellowConfidence = 0;

let statusText = "Loading Yellow System model...";

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
  // a neuralNetwork can use input features to return a class label.
  // This also connects to EMI Week 5 because the image becomes numerical inputs.
  yellowBrain = ml5.neuralNetwork(options);

  // This loads the trained Yellow System model so the webcam features can
  // be classified as natural or not_natural.
  yellowBrain.load("models/yellow/yellow_system_model.json", yellowModelLoaded);
}

function draw() {
  background(30);

  fill(255);
  noStroke();

  textSize(28);
  text("Yellow System Webcam Test", 40, 50);

  textSize(15);
  text("Yellow System judges whether the live image is natural or not_natural.", 40, 85);
  text("Features: brightness, saturation, contrast, colour difference", 40, 110);

  // The live webcam image is drawn onto the canvas here.
  // This is the same basic idea I learned from the p5.js Video Capture example.
  image(video, 40, 150, 320, 240);

  textSize(18);
  text(statusText, 400, 170);

  textSize(26);
  text("YELLOW SYSTEM RESULT", 400, 230);

  textSize(36);
  text(yellowLabel, 400, 285);

  textSize(18);
  text("Confidence: " + nf(yellowConfidence, 1, 2), 400, 325);

  textSize(13);
  text("This is only a Yellow model test. It does not replace the face yet.", 400, 365);

  // The model is only called every 60 frames so it does not classify too frequently.
  if (yellowModelReady === true && yellowIsClassifying === false && frameCount % 60 === 0) {
    classifyYellowCamera();
  }
}

function yellowModelLoaded() {
  yellowModelReady = true;
  statusText = "Yellow System model loaded.";
}

// This function gets the current webcam frame, extracts four image features,
// checks that there are four values, and sends them to the Yellow classifier.
function classifyYellowCamera() {
  yellowIsClassifying = true;

  let currentImage = video.get();
  let features = getImageFeatures(currentImage);

  if (features.length === 4) {
    yellowBrain.classify(features, gotYellowResult);
  } else {
    yellowIsClassifying = false;
  }
}

// This receives the classification result from ml5 and stores the label
// and confidence so they can be displayed on the canvas.
function gotYellowResult(error, results) {
  yellowIsClassifying = false;

  if (Array.isArray(error)) {
    results = error;
    error = null;
  }

  if (error) {
    console.log(error);
    yellowLabel = "error";
    yellowConfidence = 0;
    return;
  }

  if (results && results.length > 0) {
    yellowLabel = results[0].label;
    yellowConfidence = results[0].confidence;
  }
}

// I used the p5.Image loadPixels() reference to understand this part.
// loadPixels() allows me to read RGB values from the image.
// This follows the idea from The Coding Train Pose Classifier tutorial:
// extracted numerical values can be used as input features for a classifier.
// Here I use image features instead of pose values.
function getImageFeatures(img) {
  let smallImage = img.get();
  // The image is resized to 64 x 64 so the feature calculation stays consistent.
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
  // This connects to EMI Week 3 because stable input values help the model run smoothly.
  let inputValues = [
    averageBrightness / 255,
    averageSaturation,
    contrast / 255,
    averageColourDifference / 765
  ];

  return inputValues;
}
