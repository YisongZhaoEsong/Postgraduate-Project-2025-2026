// Main sketch for Beauty Has No Definition.
// This file connects the webcam, FaceMesh, image feature extraction,
// trained ml5 classifiers, replacement images and the final interface.
// I used the p5.js, ml5.js, FaceMesh, MediaPipe and Coding Train
// learning resources listed in my README to understand each technical part,
// then adapted those ideas for my own three-system project.

let video;
let faceMesh;
let faces = [];

let yellowRefImages = [];
let blueRefImages = [];
let blackRefImages = [];

let yellowRefImgs = [];
let blueRefImgs = [];
let blackRefImgs = [];

let yellowRefPaths = [
  "data/yellow/natural/yellow_natural_01.png",
  "data/yellow/natural/yellow_natural_02.png",
  "data/yellow/natural/yellow_natural_03.png",
  "data/yellow/natural/yellow_natural_04.png",
  "data/yellow/natural/yellow_natural_05.png"
];

let blueRefPaths = [
  "data/blue/expressive/blue_expressive_01.png",
  "data/blue/expressive/blue_expressive_02.png",
  "data/blue/expressive/blue_expressive_03.png",
  "data/blue/expressive/blue_expressive_04.png",
  "data/blue/expressive/blue_expressive_05.png"
];

let blackRefPaths = [
  "assets/black_refs/black_ref_1.png",
  "assets/black_refs/black_ref_2.png",
  "assets/black_refs/black_ref_3.png",
  "assets/black_refs/black_ref_4.png",
  "assets/black_refs/black_ref_5.png"
];

let bgSparkles = [];
let bgGlowDots = [];
let bgStarLines = [];

let leftPortraitX = 70;
let leftPortraitY = 85;
let leftPortraitW = 340;
let leftPortraitH = 700;
let leftCropBiasX = 0.3;

let blueBrain;
let blueModelReady = false;
let blueIsClassifying = false;
let blueLabel = "waiting";
let blueConfidence = 0;
let blueStatusText = "Loading Blue System model...";

let yellowBrain;
let yellowModelReady = false;
let yellowIsClassifying = false;
let yellowLabel = "waiting";
let yellowConfidence = 0;
let yellowStatusText = "Loading Yellow System model...";

let stableYellowLabel = "waiting";
let stableYellowConfidence = 0;

let yellowLastFace;
let yellowFaceHold = 0;

let blackEye1;
let blackEye2;
let blackNose;
let blackMouth;

let blueEye1;
let blueEye2;
let blueNose;
let blueMouth;

let yellowEye1;
let yellowEye2;
let yellowNose;
let yellowMouth;

let options = {
  maxFaces: 1,
  refineLandmarks: false,
  flipHorizontal: false
};

let faceX = 120;
let faceY = 80;
let faceW = 460;
let faceH = 650;

let topSystem = 1;
let middleSystem = 2;
let bottomSystem = 3;

let activeSystem = 1;
// activeSystem uses the existing internal system numbers:
// 1 = Black
// 2 = Blue
// 3 = Yellow

let demoSystem = "black";

let averageEyeRatio = 0;
let noseRatio = 0;
let mouthRatio = 0;

let blackEyeState = "INACTIVE";
let blackEyeJudgement = "WAITING";

let blackNoseState = "INACTIVE";
let blackNoseJudgement = "WAITING";

let blackMouthState = "INACTIVE";
let blackMouthJudgement = "WAITING";

let eyeThreshold = 2.6;
let strongEyeThreshold = 2.2;

let noseThreshold = 1.55;
let mouthThreshold = 30.0;

function preload() {
  // The ml5.js FaceMesh Keypoints example, The Coding Train Face Mesh
  // tutorial and MediaPipe Face Landmarker docs helped me understand
  // that FaceMesh can find landmark points for the eyes, nose and mouth.
  faceMesh = ml5.faceMesh(options);
  loadRightPanelReferenceImages();

  blackEye1 = loadImage("assets/black/eye1.png");
  blackEye2 = loadImage("assets/black/eye2.png");
  blackNose = loadImage("assets/black/nose.png");
  blackMouth = loadImage("assets/black/mouth.png");

  blueEye1 = loadImage("assets/blue/eye1.png");
  blueEye2 = loadImage("assets/blue/eye2.png");
  blueNose = loadImage("assets/blue/nose.png");
  blueMouth = loadImage("assets/blue/mouth.png");

  yellowEye1 = loadImage("assets/yellow/eye1.png");
  yellowEye2 = loadImage("assets/yellow/eye2.png");
  yellowNose = loadImage("assets/yellow/nose.png");
  yellowMouth = loadImage("assets/yellow/mouth.png");
}

function loadRightPanelReferenceImages() {
  yellowRefImgs = [];
  blueRefImgs = [];
  blackRefImgs = [];

  for (let i = 0; i < yellowRefPaths.length; i++) {
    yellowRefImgs.push(loadImage(yellowRefPaths[i]));
  }

  for (let i = 0; i < blueRefPaths.length; i++) {
    blueRefImgs.push(loadImage(blueRefPaths[i]));
  }

  for (let i = 0; i < blackRefPaths.length; i++) {
    blackRefImgs.push(loadImage(blackRefPaths[i]));
  }
}

function setup() {
  createCanvas(1500, 900);
  initRefinedAtmosphere();

  // I learned this camera setup from the p5.js Video Capture example.
  // createCapture(VIDEO) starts the live webcam, and video.hide() hides
  // the HTML video because I draw the camera feed onto the canvas myself.
  video = createCapture(VIDEO);
  video.size(faceW, faceH);
  video.hide();

  // This connects FaceMesh to the live webcam stream. The ml5 FaceMesh
  // example helped me understand using detectStart() with a callback
  // function so the newest face keypoints are saved in gotFaces().
  faceMesh.detectStart(video, gotFaces);

  // The ml5.js documentation and ml5.js Learn helped me set up this
  // browser-based neuralNetwork classifier. The Blue model uses 4 input
  // features and then loads the trained model files.
  let blueOptions = {
    inputs: 4,
    outputs: 2,
    task: "classification"
  };

  blueBrain = ml5.neuralNetwork(blueOptions);

  let blueModelInfo = {
    model: "models/blue/blue_system_model.json",
    metadata: "models/blue/model_meta.json",
    weights: "models/blue/blue_system_model.weights.bin"
  };

  blueBrain.load(blueModelInfo, blueModelLoaded);

  // The Yellow model follows the same basic ml5.js classification structure
  // as the Blue model: 4 input features are sent into a trained classifier.
  let yellowOptions = {
    inputs: 4,
    outputs: 2,
    task: "classification"
  };

  yellowBrain = ml5.neuralNetwork(yellowOptions);

  let yellowModelInfo = {
    model: "models/yellow/yellow_system_model.json",
    metadata: "models/yellow/model_meta.json",
    weights: "models/yellow/yellow_system_model.weights.bin"
  };

  yellowBrain.load(yellowModelInfo, yellowModelLoaded);

  textFont("Courier New");
  textAlign(LEFT, TOP);
}

function draw() {
  if (blueModelReady === true && blueIsClassifying === false && frameCount % 60 === 0) {
    classifyBlueCamera();
  }

  if (yellowModelReady === true && yellowIsClassifying === false && frameCount % 60 === 0) {
    classifyYellowCamera();
  }

  drawNewBeautyErrorInterface();
}

// gotFaces() receives the current FaceMesh results from ml5.
// I keep them in the faces array so the rest of the sketch can use
// the detected facial keypoints for drawing and measuring features.
function gotFaces(results) {
  faces = results;
}

function blueModelLoaded() {
  blueModelReady = true;
  blueStatusText = "Blue System model loaded.";
}

function yellowModelLoaded() {
  yellowModelReady = true;
  yellowStatusText = "Yellow System model loaded.";
}

// This follows the basic ml5.js browser machine learning workflow I studied.
// It takes the current webcam frame, extracts 4 image features, and sends
// those values to the trained Blue System classifier.
function classifyBlueCamera() {
  blueIsClassifying = true;

  let currentImage = video.get();
  let blueFeatures = getBlueImageFeatures(currentImage);

  if (blueFeatures.length === 4) {
    blueBrain.classify(blueFeatures, gotBlueResult);
  } else {
    blueIsClassifying = false;
  }
}

function gotBlueResult(error, results) {
  blueIsClassifying = false;

  if (Array.isArray(error)) {
    results = error;
    error = null;
  }

  if (error) {
    console.log(error);
    blueLabel = "error";
    blueConfidence = 0;
    return;
  }

  if (results && results.length > 0) {
    let rawLabel = results[0].label;
    let rawConfidence = results[0].confidence;

    if (rawLabel === "expressive" && rawConfidence > 0.95) {
      blueLabel = "expressive";
      blueConfidence = rawConfidence;
    } else {
      blueLabel = "not_expressive";
      blueConfidence = rawConfidence;
    }
  }
}

// These Blue replacement functions use FaceMesh keypoints to place collage
// images back onto the detected face. The ml5 FaceMesh example and MediaPipe
// landmark docs helped me understand how eye, nose and mouth points can guide this.
function drawBlueReplacement() {
  if (faces.length > 0 && demoSystem === "blue" && blueLabel === "not_expressive") {
    let face = faces[0];

    drawBlueEyes(face.keypoints);

    let noseTop = face.keypoints[6];
    let noseTip = face.keypoints[1];
    let noseLeft = face.keypoints[98];
    let noseRight = face.keypoints[327];

    replaceBlueNose(noseTop, noseTip, noseLeft, noseRight);
    drawBlueMouth(face.keypoints);
  }
}

// Places the Blue eye images by using the eye landmark positions from FaceMesh.
function drawBlueEyes(keypoints) {
  let leftA = keypoints[33];
  let leftB = keypoints[133];

  let rightA = keypoints[362];
  let rightB = keypoints[263];

  let leftX = faceX + (leftA.x + leftB.x) / 2;
  let leftY = faceY + (leftA.y + leftB.y) / 2;

  let rightX = faceX + (rightA.x + rightB.x) / 2;
  let rightY = faceY + (rightA.y + rightB.y) / 2;

  let leftW = dist(leftA.x, leftA.y, leftB.x, leftB.y);
  let rightW = dist(rightA.x, rightA.y, rightB.x, rightB.y);

  imageMode(CENTER);

  image(blueEye1, leftX, leftY, leftW * 1.8, leftW * 1.0);
  image(blueEye2, rightX, rightY, rightW * 1.8, rightW * 1.0);

  imageMode(CORNER);
}

// Places the Blue nose image using the nose landmark points from the detected face.
function replaceBlueNose(pTop, pTip, pLeft, pRight) {
  let topX = faceX + pTop.x;
  let topY = faceY + pTop.y;
  let tipX = faceX + pTip.x;
  let tipY = faceY + pTip.y;
  let leftX = faceX + pLeft.x;
  let leftY = faceY + pLeft.y;
  let rightX = faceX + pRight.x;
  let rightY = faceY + pRight.y;

  let centreX = (leftX + rightX) / 2;
  let centreY = (topY + tipY) / 2;

  let noseW = dist(leftX, leftY, rightX, rightY);
  let noseH = dist(topX, topY, tipX, tipY);

  imageMode(CENTER);
  image(blueNose, centreX, centreY, noseW * 2.4, noseH * 2.4);
  imageMode(CORNER);
}

// Places the Blue mouth image using mouth keypoints from FaceMesh.
function drawBlueMouth(keypoints) {
  let leftPoint = keypoints[61];
  let rightPoint = keypoints[291];
  let topPoint = keypoints[13];
  let bottomPoint = keypoints[14];

  let centreX = faceX + (leftPoint.x + rightPoint.x) / 2;
  let centreY = faceY + (topPoint.y + bottomPoint.y) / 2;

  let mouthW = dist(leftPoint.x, leftPoint.y, rightPoint.x, rightPoint.y);

  let drawW = mouthW * 2.8;
  let drawH = mouthW * 1.4;

  imageMode(CENTER);
  image(blueMouth, centreX, centreY, drawW, drawH);
  imageMode(CORNER);
}

// The Black System uses FaceMesh landmark points instead of a trained classifier.
// This eye test measures eye proportions and uses simple rule-based judgement.
// If the feature does not fit the preset, it draws collage-style replacement images.
function drawBlackEyeTest() {
  blackEyeState = "INACTIVE";
  blackEyeJudgement = "WAITING";

  if (faces.length > 0 && demoSystem === "black") {
    blackEyeState = "ACTIVE";

    let face = faces[0];

    let leftEyeLeft = face.keypoints[33];
    let leftEyeRight = face.keypoints[133];
    let leftEyeTop = face.keypoints[159];
    let leftEyeBottom = face.keypoints[145];

    let rightEyeLeft = face.keypoints[362];
    let rightEyeRight = face.keypoints[263];
    let rightEyeTop = face.keypoints[386];
    let rightEyeBottom = face.keypoints[374];

    let leftEyeWidth = dist(leftEyeLeft.x, leftEyeLeft.y, leftEyeRight.x, leftEyeRight.y);
    let rightEyeWidth = dist(rightEyeLeft.x, rightEyeLeft.y, rightEyeRight.x, rightEyeRight.y);

    let leftEyeHeight = dist(leftEyeTop.x, leftEyeTop.y, leftEyeBottom.x, leftEyeBottom.y);
    let rightEyeHeight = dist(rightEyeTop.x, rightEyeTop.y, rightEyeBottom.x, rightEyeBottom.y);

    let leftRatio = leftEyeWidth / leftEyeHeight;
    let rightRatio = rightEyeWidth / rightEyeHeight;

    averageEyeRatio = (leftRatio + rightRatio) / 2;

    drawEyeGuide(leftEyeLeft, leftEyeRight, leftEyeTop, leftEyeBottom);
    drawEyeGuide(rightEyeLeft, rightEyeRight, rightEyeTop, rightEyeBottom);

    if (averageEyeRatio >= eyeThreshold) {
      blackEyeJudgement = "FIT";
    } else if (averageEyeRatio >= strongEyeThreshold) {
      blackEyeJudgement = "NOT FIT - EYE 1";
      replaceEye(leftEyeLeft, leftEyeRight, leftEyeTop, leftEyeBottom, blackEye1);
      replaceEye(rightEyeLeft, rightEyeRight, rightEyeTop, rightEyeBottom, blackEye1);
    } else {
      blackEyeJudgement = "NOT FIT - EYE 2";
      replaceEye(leftEyeLeft, leftEyeRight, leftEyeTop, leftEyeBottom, blackEye2);
      replaceEye(rightEyeLeft, rightEyeRight, rightEyeTop, rightEyeBottom, blackEye2);
    }
  }
}

// This Black System nose test also uses FaceMesh points and simple ratios
// instead of ml5 model classification.
function drawBlackNoseTest() {
  blackNoseState = "INACTIVE";
  blackNoseJudgement = "WAITING";

  if (faces.length > 0 && demoSystem === "black") {
    blackNoseState = "ACTIVE";

    let face = faces[0];

    let noseTop = face.keypoints[6];
    let noseTip = face.keypoints[1];
    let noseLeft = face.keypoints[98];
    let noseRight = face.keypoints[327];

    let noseLength = dist(noseTop.x, noseTop.y, noseTip.x, noseTip.y);
    let noseWidth = dist(noseLeft.x, noseLeft.y, noseRight.x, noseRight.y);

    noseRatio = noseLength / noseWidth;

    drawNoseGuide(noseTop, noseTip, noseLeft, noseRight);

    if (noseRatio >= noseThreshold) {
      blackNoseJudgement = "FIT";
    } else {
      blackNoseJudgement = "NOT FIT";
      replaceNose(noseTop, noseTip, noseLeft, noseRight);
    }
  }
}

// This Black System mouth test measures mouth proportions from FaceMesh
// landmarks and then uses a rule-based preset decision.
function drawBlackMouthTest() {
  blackMouthState = "INACTIVE";
  blackMouthJudgement = "WAITING";

  if (faces.length > 0 && demoSystem === "black") {
    blackMouthState = "ACTIVE";

    let face = faces[0];

    let mouthLeft = face.keypoints[78];
    let mouthRight = face.keypoints[308];
    let mouthTop = face.keypoints[13];
    let mouthBottom = face.keypoints[14];

    let mouthWidth = dist(mouthLeft.x, mouthLeft.y, mouthRight.x, mouthRight.y);
    let mouthHeight = dist(mouthTop.x, mouthTop.y, mouthBottom.x, mouthBottom.y);

    mouthRatio = mouthWidth / mouthHeight;

    drawMouthGuide(mouthLeft, mouthRight, mouthTop, mouthBottom);

    if (mouthRatio >= mouthThreshold) {
      blackMouthJudgement = "FIT";
    } else {
      blackMouthJudgement = "NOT FIT";
      replaceMouth(mouthLeft, mouthRight, mouthTop, mouthBottom);
    }
  }
}

// Draws the eye measurement guide so I can see which FaceMesh landmarks
// the Black System is using for the eye ratio.
function drawEyeGuide(pLeft, pRight, pTop, pBottom) {
  let x1 = faceX + pLeft.x;
  let y1 = faceY + pLeft.y;
  let x2 = faceX + pRight.x;
  let y2 = faceY + pRight.y;
  let x3 = faceX + pTop.x;
  let y3 = faceY + pTop.y;
  let x4 = faceX + pBottom.x;
  let y4 = faceY + pBottom.y;

  let centreX = (x1 + x2) / 2;
  let centreY = (y3 + y4) / 2;

  stroke(0, 255, 120);
  strokeWeight(2);
  line(x1, y1, x2, y2);
  line(x3, y3, x4, y4);

  noFill();
  ellipse(centreX, centreY, dist(x1, y1, x2, y2) + 20, dist(x3, y3, x4, y4) + 20);

  noStroke();
  fill(0, 255, 120);
  circle(x1, y1, 5);
  circle(x2, y2, 5);
  circle(x3, y3, 5);
  circle(x4, y4, 5);
}

// If the eye result does not fit the Black System preset, this places
// a collage-style eye replacement image over the measured landmark area.
function replaceEye(pLeft, pRight, pTop, pBottom, eyeImage) {
  let x1 = faceX + pLeft.x;
  let y1 = faceY + pLeft.y;
  let x2 = faceX + pRight.x;
  let y2 = faceY + pRight.y;
  let x3 = faceX + pTop.x;
  let y3 = faceY + pTop.y;
  let x4 = faceX + pBottom.x;
  let y4 = faceY + pBottom.y;

  let centreX = (x1 + x2) / 2;
  let centreY = (y3 + y4) / 2;

  let eyeW = dist(x1, y1, x2, y2);
  let eyeH = dist(x3, y3, x4, y4);

  imageMode(CENTER);
  image(eyeImage, centreX, centreY, eyeW * 2.2, eyeH * 3.2);
  imageMode(CORNER);
}

// Draws the nose guide from FaceMesh points so the nose measurement is visible.
function drawNoseGuide(pTop, pTip, pLeft, pRight) {
  let topX = faceX + pTop.x;
  let topY = faceY + pTop.y;
  let tipX = faceX + pTip.x;
  let tipY = faceY + pTip.y;
  let leftX = faceX + pLeft.x;
  let leftY = faceY + pLeft.y;
  let rightX = faceX + pRight.x;
  let rightY = faceY + pRight.y;

  stroke(0, 255, 120);
  strokeWeight(2);
  line(topX, topY, tipX, tipY);
  line(leftX, leftY, rightX, rightY);

  noStroke();
  fill(0, 255, 120);
  circle(topX, topY, 5);
  circle(tipX, tipY, 5);
  circle(leftX, leftY, 5);
  circle(rightX, rightY, 5);
}

// If the nose does not fit the Black System preset, this draws the
// collage-style replacement nose image using the same landmark area.
function replaceNose(pTop, pTip, pLeft, pRight) {
  let topX = faceX + pTop.x;
  let topY = faceY + pTop.y;
  let tipX = faceX + pTip.x;
  let tipY = faceY + pTip.y;
  let leftX = faceX + pLeft.x;
  let leftY = faceY + pLeft.y;
  let rightX = faceX + pRight.x;
  let rightY = faceY + pRight.y;

  let centreX = (leftX + rightX) / 2;
  let centreY = (topY + tipY) / 2;

  let noseW = dist(leftX, leftY, rightX, rightY);
  let noseH = dist(topX, topY, tipX, tipY);

  imageMode(CENTER);
  image(blackNose, centreX, centreY, noseW * 2.4, noseH * 2.4);
  imageMode(CORNER);
}

// Draws the mouth guide from FaceMesh points so the mouth ratio can be checked.
function drawMouthGuide(pLeft, pRight, pTop, pBottom) {
  let leftX = faceX + pLeft.x;
  let leftY = faceY + pLeft.y;
  let rightX = faceX + pRight.x;
  let rightY = faceY + pRight.y;
  let topX = faceX + pTop.x;
  let topY = faceY + pTop.y;
  let bottomX = faceX + pBottom.x;
  let bottomY = faceY + pBottom.y;

  stroke(0, 255, 120);
  strokeWeight(2);
  line(leftX, leftY, rightX, rightY);
  line(topX, topY, bottomX, bottomY);

  noStroke();
  fill(0, 255, 120);
  circle(leftX, leftY, 5);
  circle(rightX, rightY, 5);
  circle(topX, topY, 5);
  circle(bottomX, bottomY, 5);
}

// If the mouth does not fit the Black System preset, this places the
// collage-style mouth replacement image over the detected mouth area.
function replaceMouth(pLeft, pRight, pTop, pBottom) {
  let leftX = faceX + pLeft.x;
  let leftY = faceY + pLeft.y;
  let rightX = faceX + pRight.x;
  let rightY = faceY + pRight.y;
  let topX = faceX + pTop.x;
  let topY = faceY + pTop.y;
  let bottomX = faceX + pBottom.x;
  let bottomY = faceY + pBottom.y;

  let centreX = (leftX + rightX) / 2;
  let centreY = (topY + bottomY) / 2;

  let mouthW = dist(leftX, leftY, rightX, rightY);
  let mouthH = dist(topX, topY, bottomX, bottomY);

  imageMode(CENTER);
  image(blackMouth, centreX, centreY, mouthW * 2.4, mouthH * 18.0);
  imageMode(CORNER);
}

function drawSystem(systemNumber, x, y, w, h) {
  noStroke();

  if (systemNumber === 1) {
    fill(0, 0, 0, 90);
    rect(x, y, w, h);

    fill(255);
    textSize(14);
    text("BLACK SYSTEM", x + 15, y + 25);
    textSize(12);
    text("Structured and sharp features are beauty", x + 15, y + 45);
  }

  if (systemNumber === 2) {
    fill(50, 90, 255, 90);
    rect(x, y, w, h);

    fill(255);
    textSize(14);
    text("BLUE SYSTEM", x + 15, y + 25);
    textSize(12);
    text("Individuality is beauty", x + 15, y + 45);
  }

  if (systemNumber === 3) {
    fill(255, 220, 70, 110);
    rect(x, y, w, h);

    fill(255);
    textSize(14);
    text("YELLOW SYSTEM", x + 15, y + 25);
    textSize(12);
    text("Softness and naturalness are beauty", x + 15, y + 45);
  }
}

function drawLines() {
  stroke(255);
  strokeWeight(1);
  noFill();

  rect(faceX, faceY, faceW, faceH);

  line(faceX, faceY + faceH / 3, faceX + faceW, faceY + faceH / 3);
  line(faceX, faceY + faceH / 3 * 2, faceX + faceW, faceY + faceH / 3 * 2);
}

// I used the p5.Image loadPixels() reference to understand this feature step.
// The image is resized, RGB values are read from smallImage.pixels, and
// brightness, saturation, contrast and colour difference become the 4 inputs.
function getBlueImageFeatures(img) {
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

    let brightnessValue = (r + g + b) / 3;

    let maxValue = max(r, g, b);
    let minValue = min(r, g, b);

    let saturationValue = 0;

    if (maxValue > 0) {
      saturationValue = (maxValue - minValue) / maxValue;
    }

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

function drawText() {
  fill(255);
  noStroke();

  textSize(26);
  text("Beauty Error", faceX, 40);

  textSize(12);
  text("Press 1 = Black System | Press 2 = Yellow System | Press 3 = Blue System", faceX, 755);

  if (faces.length > 0) {
    text("Eye: " + blackEyeState + " / " + blackEyeJudgement + " / ratio " + nf(averageEyeRatio, 1, 2), faceX, 780);
    text("Nose: " + blackNoseState + " / " + blackNoseJudgement + " / ratio " + nf(noseRatio, 1, 2), faceX, 805);
    text("Mouth: " + blackMouthState + " / " + blackMouthJudgement + " / ratio " + nf(mouthRatio, 1, 2), faceX, 830);
  } else {
    text("No face detected yet.", faceX, 785);
  }

  text("Blue System: " + blueLabel, faceX, 875);
  text("Confidence: " + nf(blueConfidence, 1, 2), faceX, 900);

  text("Yellow System: " + yellowLabel, faceX, 930);
  text("Yellow Confidence: " + nf(yellowConfidence, 1, 2), faceX, 955);
}

// Keys 1, 2 and 3 let the user switch between the Black, Yellow and Blue systems.
function keyPressed() {
  if (key === "1") {
    demoSystem = "black";
  }

  if (key === "2") {
    demoSystem = "yellow";
  }

  if (key === "3") {
    demoSystem = "blue";
  }
}

function getActiveSystemName() {
  if (demoSystem === "black") {
    return "BLACK SYSTEM";
  } else if (demoSystem === "yellow") {
    return "YELLOW SYSTEM";
  } else if (demoSystem === "blue") {
    return "BLUE SYSTEM";
  }

  return "SYSTEM";
}

function getActiveSystemDescription() {
  if (demoSystem === "black") {
    return "Structured and sharp features are beauty";
  } else if (demoSystem === "yellow") {
    return "Softness and naturalness are beauty";
  } else if (demoSystem === "blue") {
    return "Individuality and expression are beauty";
  }

  return "Beauty preset";
}

// This uses the same structure as the Blue classifier, but sends the current
// webcam image features to the trained Yellow System model instead.
function classifyYellowCamera() {
  yellowIsClassifying = true;

  let currentImage = video.get();
  let yellowFeatures = getYellowImageFeatures(currentImage);

  if (yellowFeatures.length === 4) {
    yellowBrain.classify(yellowFeatures, gotYellowResult);
  } else {
    yellowIsClassifying = false;
  }
}

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
    if (results[0].confidence > 0.55) {
      stableYellowLabel = results[0].label;
      stableYellowConfidence = results[0].confidence;
    }

    yellowLabel = stableYellowLabel;
    yellowConfidence = stableYellowConfidence;
  }
}

// This repeats the p5.Image loadPixels() feature extraction idea for Yellow.
// It reads RGB pixels from the resized webcam image and calculates brightness,
// saturation, contrast and colour difference for the classifier inputs.
function getYellowImageFeatures(img) {
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

    let brightnessValue = (r + g + b) / 3;

    let maxValue = max(r, g, b);
    let minValue = min(r, g, b);

    let saturationValue = 0;

    if (maxValue > 0) {
      saturationValue = (maxValue - minValue) / maxValue;
    }

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

// Yellow replacement functions also use FaceMesh keypoints to place images
// onto the detected face. This part is connected to the ml5 FaceMesh and
// MediaPipe landmark idea of using points for eyes, nose and mouth.
function drawYellowReplacement(face) {
  if (!face) {
    return;
  }

  if (demoSystem !== "yellow") {
    return;
  }

  if (stableYellowLabel !== "not_natural") {
    return;
  }

  let keypoints = face.keypoints;

  drawYellowEyes(keypoints);
  drawYellowNose(keypoints);
  drawYellowMouth(keypoints);
}

// Places the Yellow eye images by reading the eye landmark positions.
function drawYellowEyes(keypoints) {
  let leftA = keypoints[33];
  let leftB = keypoints[133];

  let rightA = keypoints[362];
  let rightB = keypoints[263];

  let leftX = faceX + (leftA.x + leftB.x) / 2;
  let leftY = faceY + (leftA.y + leftB.y) / 2;

  let rightX = faceX + (rightA.x + rightB.x) / 2;
  let rightY = faceY + (rightA.y + rightB.y) / 2;

  let leftW = dist(leftA.x, leftA.y, leftB.x, leftB.y);
  let rightW = dist(rightA.x, rightA.y, rightB.x, rightB.y);

  imageMode(CENTER);

  image(yellowEye1, leftX, leftY, leftW * 1.8, leftW * 1.0);
  image(yellowEye2, rightX, rightY, rightW * 1.8, rightW * 1.0);

  imageMode(CORNER);
}

// Places the Yellow nose image using nose keypoints from the detected face.
function drawYellowNose(keypoints) {
  let topPoint = keypoints[6];
  let tipPoint = keypoints[1];
  let leftPoint = keypoints[98];
  let rightPoint = keypoints[327];

  let centreX = faceX + (leftPoint.x + rightPoint.x) / 2;
  let centreY = faceY + (topPoint.y + tipPoint.y) / 2;

  let noseW = dist(leftPoint.x, leftPoint.y, rightPoint.x, rightPoint.y);
  let noseH = dist(topPoint.x, topPoint.y, tipPoint.x, tipPoint.y);

  imageMode(CENTER);

  image(yellowNose, centreX, centreY, noseW * 2.1, noseH * 2.4);

  imageMode(CORNER);
}

// Places the Yellow mouth image using mouth keypoints from FaceMesh.
function drawYellowMouth(keypoints) {
  let leftPoint = keypoints[61];
  let rightPoint = keypoints[291];
  let topPoint = keypoints[13];
  let bottomPoint = keypoints[14];

  let centreX = faceX + (leftPoint.x + rightPoint.x) / 2;
  let centreY = faceY + (topPoint.y + bottomPoint.y) / 2;

  let mouthW = dist(leftPoint.x, leftPoint.y, rightPoint.x, rightPoint.y);

  imageMode(CENTER);

  image(yellowMouth, centreX, centreY, mouthW * 2.2, mouthW * 1.0);

  imageMode(CORNER);
}


// Technical Test 14: Dynamic ML-driven Background
// Beginner-friendly p5.js version
// No extra library, no static image, no segmentation


function initDynamicPresetBackground() {
  initBlueBackgroundParticles();
  initYellowBackgroundOrbs();
}

function drawDynamicPresetBackground() {
  // Safety check: if setup did not initialise the arrays, initialise them here.
  if (bgBlueParticles.length === 0 || bgYellowOrbs.length === 0) {
    initDynamicPresetBackground();
  }

  background(14);

  let sectionH = height / 3;

  // Follow the existing system order if these variables already exist.
  // System 1 = Black, System 2 = Blue, System 3 = Yellow.
  let safeTopSystem = 1;
  let safeMiddleSystem = 2;
  let safeBottomSystem = 3;

  if (typeof topSystem !== 'undefined') {
    safeTopSystem = topSystem;
  }

  if (typeof middleSystem !== 'undefined') {
    safeMiddleSystem = middleSystem;
  }

  if (typeof bottomSystem !== 'undefined') {
    safeBottomSystem = bottomSystem;
  }

  drawPresetBackgroundSection(safeTopSystem, 0, sectionH, 0);
  drawPresetBackgroundSection(safeMiddleSystem, sectionH, sectionH, 1);
  drawPresetBackgroundSection(safeBottomSystem, sectionH * 2, sectionH, 2);

  drawProjectionScanLines();
  drawSubtleNoiseDots();
}

function drawPresetBackgroundSection(systemNumber, yStart, sectionH, sectionIndex) {
  if (systemNumber === 1) {
    drawBlackDynamicBackground(yStart, sectionH, sectionIndex);
  } else if (systemNumber === 2) {
    drawBlueDynamicBackground(yStart, sectionH, sectionIndex);
  } else if (systemNumber === 3) {
    drawYellowDynamicBackground(yStart, sectionH, sectionIndex);
  }
}


// System 1: Black System Background
// structured / measured / cold / scanning


function drawBlackDynamicBackground(yStart, sectionH, sectionIndex) {
  noStroke();
  fill(18, 18, 18);
  rect(0, yStart, width, sectionH);

  // Slight moving grid
  stroke(120, 120, 120, 55);
  strokeWeight(1);

  for (let x = 0; x < width; x += 42) {
    let move = sin(frameCount * 0.015 + x * 0.02 + sectionIndex) * 5;
    line(x + move, yStart, x - move, yStart + sectionH);
  }

  for (let y = yStart; y < yStart + sectionH; y += 26) {
    line(0, y, width, y);
  }

  // Central measuring axis
  stroke(230, 230, 230, 110);
  line(width / 2, yStart, width / 2, yStart + sectionH);

  // Moving scan line
  let scanY = yStart + (frameCount * 2.2 + sectionIndex * 60) % sectionH;
  stroke(255, 255, 255, 90);
  line(0, scanY, width, scanY);

  // Measurement circles
  noFill();
  stroke(180, 180, 180, 80);
  let cx = width / 2;
  let cy = yStart + sectionH / 2;
  let pulse = sin(frameCount * 0.03) * 8;

  ellipse(cx, cy, 140 + pulse, 140 + pulse);
  ellipse(cx, cy, 220 - pulse, 220 - pulse);

  // Sharp structure lines
  stroke(210, 210, 210, 65);
  line(cx - 110, cy - 60, cx + 110, cy + 60);
  line(cx + 110, cy - 60, cx - 110, cy + 60);
}


// System 2: Blue System Background
// expressive / individual / emotional / unstable


function initBlueBackgroundParticles() {
  bgBlueParticles = [];

  for (let i = 0; i < 45; i++) {
    let particle = {
      x: random(width),
      y: random(height),
      size: random(5, 18),
      speedX: random(-0.7, 0.7),
      speedY: random(-0.4, 0.4),
      offset: random(1000)
    };

    bgBlueParticles.push(particle);
  }
}

function drawBlueDynamicBackground(yStart, sectionH, sectionIndex) {
  noStroke();
  fill(12, 22, 60);
  rect(0, yStart, width, sectionH);

  let strength = getSafeBlueStrength();

  // If Blue System thinks the participant is not expressive,
  // the background becomes slightly more active.
  let extraMovement = 1;

  if (typeof blueLabel !== 'undefined') {
    if (blueLabel === 'not_expressive') {
      extraMovement = 1.8;
    }
  }

  // Blue particles
  noStroke();

  for (let i = 0; i < bgBlueParticles.length; i++) {
    let p = bgBlueParticles[i];

    p.x += p.speedX * extraMovement;
    p.y += p.speedY * extraMovement;

    let floating = sin(frameCount * 0.02 + p.offset) * 0.4;
    p.y += floating;

    // Keep particles inside this section
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < yStart) p.y = yStart + sectionH;
    if (p.y > yStart + sectionH) p.y = yStart;

    let alphaValue = map(strength, 0, 1, 45, 145);
    fill(70, 135, 255, alphaValue);
    ellipse(p.x, p.y, p.size, p.size);

    fill(160, 190, 255, alphaValue * 0.35);
    ellipse(p.x, p.y, p.size * 2.2, p.size * 2.2);
  }

  // Flowing expression lines
  noFill();
  strokeWeight(2);

  stroke(90, 160, 255, 120);
  beginShape();
  for (let x = 0; x <= width + 20; x += 20) {
    let y = yStart + sectionH * 0.45;
    let wave = sin(frameCount * 0.035 + x * 0.018 + sectionIndex) * 24;
    curveVertex(x, y + wave);
  }
  endShape();

  stroke(130, 110, 255, 95);
  beginShape();
  for (let x = 0; x <= width + 20; x += 20) {
    let y = yStart + sectionH * 0.62;
    let wave = sin(frameCount * 0.028 + x * 0.015 + 10) * 18;
    curveVertex(x, y + wave);
  }
  endShape();

  // Simple glitch bars, only sometimes
  if (frameCount % 45 < 8) {
    noStroke();
    fill(80, 130, 255, 45);
    let barY = yStart + random(sectionH);
    rect(0, barY, width, random(4, 12));
  }
}

function getSafeBlueStrength() {
  let strength = 0.5;

  if (typeof blueConfidence !== 'undefined') {
    if (!isNaN(blueConfidence)) {
      strength = constrain(blueConfidence, 0, 1);
    }
  }

  return strength;
}


// System 3: Yellow System Background
// soft / natural / minimal / calm / breathing


function initYellowBackgroundOrbs() {
  bgYellowOrbs = [];

  for (let i = 0; i < 22; i++) {
    let orb = {
      x: random(width),
      y: random(height),
      size: random(45, 130),
      speed: random(0.003, 0.011),
      offset: random(1000)
    };

    bgYellowOrbs.push(orb);
  }
}

function drawYellowDynamicBackground(yStart, sectionH, sectionIndex) {
  noStroke();
  fill(55, 48, 26);
  rect(0, yStart, width, sectionH);

  let strength = getSafeYellowStrength();

  // If Yellow System thinks the participant is not natural,
  // the soft correction layer becomes more visible.
  let correctionAlpha = 1;

  if (typeof yellowLabel !== 'undefined') {
    if (yellowLabel === 'not_natural') {
      correctionAlpha = 1.5;
    }
  }

  for (let i = 0; i < bgYellowOrbs.length; i++) {
    let o = bgYellowOrbs[i];

    let moveX = sin(frameCount * o.speed + o.offset + sectionIndex) * 22;
    let moveY = cos(frameCount * o.speed + o.offset) * 12;

    let currentX = o.x + moveX;
    let currentY = o.y + moveY;

    // Keep the orb visually connected to this section.
    if (currentY < yStart - 80 || currentY > yStart + sectionH + 80) {
      currentY = yStart + random(sectionH);
    }

    let alphaValue = map(strength, 0, 1, 24, 75) * correctionAlpha;

    fill(255, 221, 125, alphaValue);
    ellipse(currentX, currentY, o.size, o.size);

    fill(255, 245, 195, alphaValue * 0.55);
    ellipse(currentX, currentY, o.size * 0.48, o.size * 0.48);
  }

  // Breathing light layer
  let breath = map(sin(frameCount * 0.025), -1, 1, 18, 42);
  noStroke();
  fill(255, 230, 150, breath);
  rect(0, yStart, width, sectionH);

  // Soft horizontal waves
  stroke(255, 230, 155, 38);
  strokeWeight(1);

  for (let y = yStart; y < yStart + sectionH; y += 24) {
    let wave = sin(frameCount * 0.018 + y * 0.025) * 7;
    line(0, y + wave, width, y + wave);
  }
}

function getSafeYellowStrength() {
  let strength = 0.5;

  if (typeof yellowConfidence !== 'undefined') {
    if (!isNaN(yellowConfidence)) {
      strength = constrain(yellowConfidence, 0, 1);
    }
  }

  return strength;
}


// Global projection texture
// Makes the whole interface feel like a live projection / screen


function drawProjectionScanLines() {
  stroke(255, 255, 255, 16);
  strokeWeight(1);

  for (let y = 0; y < height; y += 7) {
    line(0, y, width, y);
  }
}

function drawSubtleNoiseDots() {
  noStroke();

  for (let i = 0; i < 70; i++) {
    let x = random(width);
    let y = random(height);
    let a = random(8, 24);

    fill(255, 255, 255, a);
    rect(x, y, 1, 1);
  }
}


// Minimal black interface / no advanced animation


// This draws the final interface layout: the left live portrait, centre
// portrait, right system information panel and bottom instruction/status text.
function drawNewBeautyErrorInterface() {
  background(0);

  drawRefinedBackground();

  // Left portrait: vertical panel, not square
  drawLeftPortraitPanel(leftPortraitX, leftPortraitY, leftPortraitW, leftPortraitH);

  // Keep centre panel unchanged
  drawCentreMainPanel(435, 85, 600, 700);

  // Keep right panel unchanged
  drawRightInfoPanel(1070, 100, 330, 680);

  // Keep bottom status unchanged
  drawBottomStatus(435, 805);
}


// Background


function drawMinimalInterfaceBackground() {
  drawRefinedBackground();
}


// STAR ATMOSPHERE ENHANCEMENT PATCH
// Stronger starry background, still minimal


function initRefinedAtmosphere() {
  bgSparkles = [];
  bgGlowDots = [];
  bgStarLines = [];

  // fewer, softer dust-like particles
  for (let i = 0; i < 95; i++) {
    bgSparkles.push({
      x: random(width),
      y: random(height),
      size: random(1.0, 2.2),
      alphaBase: random(18, 45),
      speed: random(0.004, 0.015),
      phase: random(TWO_PI),
      tintType: floor(random(3)) // 0 white, 1 blue, 2 yellow
    });
  }

  // fewer and smaller glow dots
  for (let i = 0; i < 12; i++) {
    bgGlowDots.push({
      x: random(width),
      y: random(height),
      size: random(45, 120),
      alphaBase: random(5, 14),
      speed: random(0.002, 0.008),
      phase: random(TWO_PI),
      tintType: floor(random(3))
    });
  }

  // softer flowing lines
  for (let i = 0; i < 4; i++) {
    bgStarLines.push({
      yBase: random(height * 0.18, height * 0.85),
      amp: random(8, 18),
      speed: random(0.003, 0.01),
      phase: random(TWO_PI),
      colorType: floor(random(3))
    });
  }
}

function drawRefinedBackground() {
  //drawAmbientGlowDots();
  drawFloatingStarLines();
  drawSparkleField();
}

function drawSparkleField() {
  noStroke();

  for (let i = 0; i < bgSparkles.length; i++) {
    let s = bgSparkles[i];
    let a = s.alphaBase + sin(frameCount * s.speed + s.phase) * 8;

    if (s.tintType === 0) {
      fill(255, 255, 255, a);
    } else if (s.tintType === 1) {
      fill(130, 160, 255, a * 0.55);
    } else {
      fill(255, 220, 140, a * 0.5);
    }

    ellipse(s.x, s.y, s.size, s.size);
  }
}

function drawAmbientGlowDots() {
  noStroke();

  for (let i = 0; i < bgGlowDots.length; i++) {
    let g = bgGlowDots[i];
    let a = g.alphaBase + sin(frameCount * g.speed + g.phase) * 3;
    let currentSize = g.size + sin(frameCount * g.speed + g.phase) * 4;

    if (g.tintType === 0) {
      fill(255, 255, 255, a);
    } else if (g.tintType === 1) {
      fill(90, 130, 255, a * 0.55);
    } else {
      fill(255, 215, 110, a * 0.5);
    }

    ellipse(g.x, g.y, currentSize, currentSize);
  }
}

function drawFloatingStarLines() {
  noFill();
  strokeWeight(1);

  for (let i = 0; i < bgStarLines.length; i++) {
    let l = bgStarLines[i];

    if (l.colorType === 0) {
      stroke(255, 255, 255, 16);
    } else if (l.colorType === 1) {
      stroke(110, 150, 255, 16);
    } else {
      stroke(255, 215, 125, 14);
    }

    beginShape();
    for (let x = 0; x <= width; x += 35) {
      let y = l.yBase + sin(frameCount * l.speed + x * 0.008 + l.phase) * l.amp;
      curveVertex(x, y);
    }
    endShape();
  }
}

function drawStarGlint(x, y, s, a, tintType) {
  if (tintType === 0) {
    stroke(255, 255, 255, a);
  } else if (tintType === 1) {
    stroke(135, 180, 255, a * 0.9);
  } else {
    stroke(255, 225, 145, a * 0.85);
  }

  strokeWeight(1);

  line(x - s, y, x + s, y);
  line(x, y - s, x, y + s);

  strokeWeight(0.8);
  line(x - s * 0.55, y - s * 0.55, x + s * 0.55, y + s * 0.55);
  line(x + s * 0.55, y - s * 0.55, x - s * 0.55, y + s * 0.55);
}


// Left portrait panel


// This is the left live portrait and detection view. It shows the webcam
// image and the FaceMesh overlay so the detection part is visible.
function drawLeftPortraitPanel(x, y, w, h) {
  // only draw one clean portrait area
  drawSoftPortraitVideo(x, y, w, h);

  // keep FaceMesh overlay
  drawFaceOverlayInBox(x, y, w, h);

  // keep only subtle corner markers, no extra frame
  drawPortraitCornerMarks(x, y, w, h);

  // label
  fill(170);
  noStroke();
  textSize(11);
  text("LIVE PORTRAIT / DETECTION VIEW", x, y + h + 14);
}

function drawBottomFade(x, y, w, h) {
  noStroke();

  for (let i = 0; i < 30; i++) {
    let fadeY = y + h - 150 + i * 5;
    let alphaValue = map(i, 0, 29, 0, 210);
    fill(0, 0, 0, alphaValue);
    rect(x, fadeY, w, 6);
  }
}

function drawPortraitCornerMarks(x, y, w, h) {
  stroke(255, 255, 255, 80);
  strokeWeight(1);
  noFill();

  line(x, y, x + 24, y);
  line(x, y, x, y + 24);

  line(x + w - 24, y, x + w, y);
  line(x + w, y, x + w, y + 24);

  line(x, y + h - 24, x, y + h);
  line(x, y + h, x + 24, y + h);

  line(x + w - 24, y + h, x + w, y + h);
  line(x + w, y + h - 24, x + w, y + h);
}

// The p5.js Video Capture example helped me understand drawing the live
// camera feed onto the canvas after the webcam has been captured.
function drawSoftPortraitVideo(x, y, w, h) {
  if (typeof video === "undefined" || !video) {
    fill(25);
    noStroke();
    rect(x, y, w, h);
    return;
  }

  let crop = getLeftPortraitCrop(w, h);

  drawingContext.save();
  drawingContext.filter = "grayscale(100%) contrast(108%) brightness(95%)";

  image(
    video,
    x,
    y,
    w,
    h,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh
  );

  drawingContext.restore();

  // bottom fade only
  noStroke();
  let g = drawingContext.createLinearGradient(0, y + h * 0.68, 0, y + h);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.88)");
  drawingContext.fillStyle = g;
  rect(x, y, w, h);
}

function getLeftPortraitCrop(boxW, boxH) {
  let srcW = video.width;
  let srcH = video.height;

  if (video.elt) {
    if (video.elt.videoWidth > 0) srcW = video.elt.videoWidth;
    if (video.elt.videoHeight > 0) srcH = video.elt.videoHeight;
  }

  let srcRatio = srcW / srcH;
  let boxRatio = boxW / boxH;

  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;

  if (srcRatio > boxRatio) {
    // crop left and right
    sw = srcH * boxRatio;
    sx = (srcW - sw) * leftCropBiasX;
    sx = constrain(sx, 0, srcW - sw);
  } else {
    // crop top and bottom
    sh = srcW / boxRatio;
    sy = (srcH - sh) / 2;
  }

  return {
    sx: sx,
    sy: sy,
    sw: sw,
    sh: sh
  };
}


// Centre main panel


// This centre panel is the main portrait area where the current system
// overlay and replacement images are shown.
function drawCentreMainPanel(x, y, w, h) {
  drawPanelFrame(x, y, w, h);

  // live video
  drawVideoInBox(x, y, w, h, false);
  drawCentreSilkAtmosphere(x, y, w, h);
  drawActiveSystemOverlay(x, y, w, h);
  drawCentreSparkles(x, y, w, h);

  drawCurrentReplacementsInBox(x, y, w, h);
}

function drawCentreSilkAtmosphere(x, y, w, h) {
  noStroke();

  fill(60, 90, 190, 26);
  ellipse(x + w * 0.58, y + h * 0.35, w * 0.85, h * 0.38);

  fill(255, 230, 150, 14);
  ellipse(x + w * 0.43, y + h * 0.70, w * 0.70, h * 0.30);

  noFill();
  strokeWeight(1);

  for (let i = 0; i < 4; i++) {
    stroke(160, 190, 255, 34);
    beginShape();
    for (let px = x - 30; px <= x + w + 30; px += 60) {
      let py = y + h * 0.28 + i * 42;
      let wave = sin(frameCount * 0.012 + px * 0.015 + i) * 18;
      curveVertex(px, py + wave);
    }
    endShape();
  }
}

function drawCentreSparkles(x, y, w, h) {
  noStroke();

  for (let i = 0; i < 34; i++) {
    let px = x + (i * 47 + frameCount * 0.12) % w;
    let py = y + (i * 73 + sin(frameCount * 0.018 + i) * 16) % h;
    let alphaValue = map(sin(frameCount * 0.03 + i), -1, 1, 30, 115);

    fill(255, 255, 255, alphaValue);
    ellipse(px, py, 1.6, 1.6);

    fill(120, 170, 255, alphaValue * 0.28);
    ellipse(px, py, 6, 6);
  }
}

function drawCurrentReplacementsInBox(x, y, w, h) {
  if (typeof video === "undefined" || !video) {
    return;
  }

  if (video.width === 0 || video.height === 0) {
    return;
  }

  push();
  translate(x, y);
  scale(w / video.width, h / video.height);

  let oldFaceX = faceX;
  let oldFaceY = faceY;

  faceX = 0;
  faceY = 0;

  drawBlackEyeTest();
  drawBlackNoseTest();
  drawBlackMouthTest();
  drawBlueReplacement();

  if (faces.length > 0) {
    let face = faces[0];
    yellowLastFace = face;
    yellowFaceHold = 10;

    drawYellowReplacement(face);
  }

  if (faces.length === 0 && yellowLastFace && yellowFaceHold > 0) {
    drawYellowReplacement(yellowLastFace);
    yellowFaceHold = yellowFaceHold - 1;
  }

  faceX = oldFaceX;
  faceY = oldFaceY;

  pop();
}


// Right panel


// This right panel shows the information blocks for the three beauty systems
// and the current order of the stacked systems.
function drawRightInfoPanel(x, y, w, h) {
  // Strong black panel for readability
  noStroke();
  fill(0, 0, 0, 230);
  rect(x - 20, y - 20, w + 40, h + 40);

  drawSystemInfoBlock(
    x,
    y,
    w,
    "YELLOW SYSTEM",
    "Soft, natural, clean beauty preset",
    "yellow"
  );

  drawDividerWithDot(x, y + 185, w - 8);

  drawSystemInfoBlock(
    x,
    y + 220,
    w,
    "BLACK SYSTEM",
    "Structured, sharp, 3D beauty preset",
    "black"
  );

  drawDividerWithDot(x, y + 405, w - 8);

  drawSystemInfoBlock(
    x,
    y + 440,
    w,
    "BLUE SYSTEM",
    "Individual, expressive beauty preset",
    "blue"
  );

  // Current order section
  fill(150);
  noStroke();
  textSize(10);
  text("CURRENT ORDER", x, y + h - 78);

  let topName = getSystemData(getSafeSystemValue("top")).name;
  let middleName = getSystemData(getSafeSystemValue("middle")).name;
  let bottomName = getSystemData(getSafeSystemValue("bottom")).name;

  fill(220);
  textSize(10);
  text("TOP: " + topName, x, y + h - 58);
  text("MID: " + middleName, x, y + h - 40);
  text("BOT: " + bottomName, x, y + h - 22);
}


// Bottom status text

// This bottom area keeps the keyboard instructions, FaceMesh detection status,
// and the Blue and Yellow classifier result text.
function drawBottomStatus(x, y) {
  fill(255);
  noStroke();
  textSize(11);

  text("Press 1 = Black System | Press 2 = Yellow System | Press 3 = Blue System", x, y);

  if (typeof faces !== "undefined" && faces.length > 0) {
    text("Face detected.", x, y + 22);
  } else {
    text("No face detected yet.", x, y + 22);
  }

  let blueText = "Blue System: waiting";
  let blueConfText = "Confidence: 0.00";

  if (typeof blueLabel !== "undefined") {
    blueText = "Blue System: " + blueLabel;
  }
  if (typeof blueConfidence !== "undefined" && !isNaN(blueConfidence)) {
    blueConfText = "Confidence: " + nf(blueConfidence, 1, 2);
  }

  let yellowText = "Yellow System: waiting";
  let yellowConfText = "Yellow Confidence: 0.00";

  if (typeof yellowLabel !== "undefined") {
    yellowText = "Yellow System: " + yellowLabel;
  }
  if (typeof yellowConfidence !== "undefined" && !isNaN(yellowConfidence)) {
    yellowConfText = "Yellow Confidence: " + nf(yellowConfidence, 1, 2);
  }

  fill(220);
  let resultTextX = width - 560;
  let resultTextY = 815;
  textAlign(LEFT);
  text(blueText + " / " + blueConfText, resultTextX, resultTextY);
  text(yellowText + " / " + yellowConfText, resultTextX, resultTextY + 26);
}


// Generic panel frame
function drawPanelFrame(x, y, w, h) {
  noFill();
  stroke(255, 255, 255, 180);
  strokeWeight(1.2);
  rect(x, y, w, h);

  // small corner marks
  stroke(255, 255, 255, 100);
  line(x, y, x + 18, y);
  line(x, y, x, y + 18);

  line(x + w - 18, y, x + w, y);
  line(x + w, y, x + w, y + 18);

  line(x, y + h - 18, x, y + h);
  line(x, y + h, x + 18, y + h);

  line(x + w - 18, y + h, x + w, y + h);
  line(x + w, y + h - 18, x + w, y + h);
}
// Video drawing

function drawVideoInBox(x, y, w, h, useGray) {
  if (typeof video === "undefined" || !video) {
    fill(30);
    noStroke();
    rect(x, y, w, h);
    fill(120);
    textSize(14);
    text("VIDEO NOT READY", x + 20, y + 20);
    return;
  }

  push();

  if (useGray) {
    drawingContext.save();
    drawingContext.filter = "grayscale(100%) contrast(110%)";
    image(video, x, y, w, h);
    drawingContext.restore();
  } else {
    image(video, x, y, w, h);
  }

  pop();
}

// Face overlay in left panel

function drawFaceOverlayInBox(x, y, w, h) {
  if (typeof faces === "undefined" || faces.length === 0) return;
  if (!faces[0].keypoints) return;

  let pts = faces[0].keypoints;

  let leftEyeA = getMappedPoint(pts, 33, x, y, w, h);
  let leftEyeB = getMappedPoint(pts, 133, x, y, w, h);
  let rightEyeA = getMappedPoint(pts, 362, x, y, w, h);
  let rightEyeB = getMappedPoint(pts, 263, x, y, w, h);

  let noseTop = getMappedPoint(pts, 168, x, y, w, h);
  let noseMid = getMappedPoint(pts, 1, x, y, w, h);
  let noseBottom = getMappedPoint(pts, 2, x, y, w, h);

  let mouthLeft = getMappedPoint(pts, 61, x, y, w, h);
  let mouthRight = getMappedPoint(pts, 291, x, y, w, h);
  let mouthTop = getMappedPoint(pts, 0, x, y, w, h);
  let mouthBottom = getMappedPoint(pts, 17, x, y, w, h);

  let chin = getMappedPoint(pts, 152, x, y, w, h);

  stroke(120, 180, 255, 180);
  strokeWeight(1.2);
  noFill();

  // eye boxes
  drawMiniBoxBetween(leftEyeA, leftEyeB, 10);
  drawMiniBoxBetween(rightEyeA, rightEyeB, 10);

  // nose line
  if (noseTop && noseBottom) {
    line(noseTop.x, noseTop.y, noseBottom.x, noseBottom.y);
  }

  // mouth box
  if (mouthLeft && mouthRight && mouthTop && mouthBottom) {
    rect(
      mouthLeft.x,
      mouthTop.y,
      mouthRight.x - mouthLeft.x,
      mouthBottom.y - mouthTop.y
    );
  }

  // centre line
  if (noseTop && chin) {
    line(noseTop.x, noseTop.y - 40, chin.x, chin.y + 18);
  }

  // points
  drawOverlayPoint(leftEyeA);
  drawOverlayPoint(leftEyeB);
  drawOverlayPoint(rightEyeA);
  drawOverlayPoint(rightEyeB);
  drawOverlayPoint(noseTop);
  drawOverlayPoint(noseMid);
  drawOverlayPoint(noseBottom);
  drawOverlayPoint(mouthLeft);
  drawOverlayPoint(mouthRight);
  drawOverlayPoint(mouthTop);
  drawOverlayPoint(mouthBottom);
  drawOverlayPoint(chin);
}

function getMappedPoint(pointsArray, index, boxX, boxY, boxW, boxH) {
  if (!pointsArray[index]) return null;
  if (typeof video === "undefined" || !video) return null;

  let crop = getLeftPortraitCrop(boxW, boxH);

  let px = pointsArray[index].x;
  let py = pointsArray[index].y;

  let mappedX = map(px, crop.sx, crop.sx + crop.sw, boxX, boxX + boxW);
  let mappedY = map(py, crop.sy, crop.sy + crop.sh, boxY, boxY + boxH);

  return {
    x: mappedX,
    y: mappedY
  };
}

function drawMiniBoxBetween(a, b, pad) {
  if (!a || !b) return;

  let x = min(a.x, b.x) - pad;
  let y = min(a.y, b.y) - pad * 0.5;
  let w = abs(b.x - a.x) + pad * 2;
  let h = pad * 2;

  rect(x, y, w, h);
}

function drawOverlayPoint(p) {
  if (!p) return;

  fill(120, 180, 255, 200);
  noStroke();
  ellipse(p.x, p.y, 4, 4);
}
// Centre panel system overlays
function drawActiveSystemOverlay(x, y, w, h) {
  noStroke();

  if (demoSystem === "black") {
    // Black System overlay
    fill(80, 80, 80, 70);
  } else if (demoSystem === "yellow") {
    // Yellow System overlay
    fill(255, 220, 90, 70);
  } else if (demoSystem === "blue") {
    // Blue System overlay
    fill(90, 120, 255, 70);
  } else {
    fill(180, 180, 180, 70);
  }

  rect(x, y, w, h);

  fill(255);
  noStroke();
  textSize(16);
  text("CURRENT SYSTEM: " + getActiveSystemName(), x + 18, y + 16);

  textSize(11);
  text(getActiveSystemDescription(), x + 18, y + 48);
}

function drawSystemSectionOverlay(systemNumber, x, y, w, h) {
  let sys = getSystemData(systemNumber);

  noStroke();
  fill(sys.r, sys.g, sys.b, sys.a);
  rect(x, y, w, h);

  if (systemNumber === 1) {
    drawBlackSoftAtmosphere(x, y, w, h);
  }

  if (systemNumber === 2) {
    drawBlueSoftAtmosphere(x, y, w, h);
  }

  if (systemNumber === 3) {
    drawYellowSoftAtmosphere(x, y, w, h);
  }

  fill(255);
  textSize(16);
  text(sys.name, x + 18, y + 16);

  textSize(11);
  text(sys.desc, x + 18, y + 48);
}

function drawBlueSoftAtmosphere(x, y, w, h) {
  noStroke();

  // soft natural flowing lines
  noFill();
  strokeWeight(2);

  stroke(115, 150, 255, 28);
  beginShape();
  for (let px = 0; px <= w; px += 22) {
    let py = y + h * 0.74 + sin(frameCount * 0.012 + px * 0.014) * 14;
    curveVertex(x + px, py);
  }
  endShape();

  stroke(255, 255, 255, 12);
  beginShape();
  for (let px = 0; px <= w; px += 22) {
    let py = y + h * 0.67 + sin(frameCount * 0.010 + px * 0.012 + 1.2) * 10;
    curveVertex(x + px, py);
  }
  endShape();

  stroke(100, 130, 230, 14);
  beginShape();
  for (let px = 0; px <= w; px += 22) {
    let py = y + h * 0.80 + sin(frameCount * 0.011 + px * 0.011 + 2.1) * 9;
    curveVertex(x + px, py);
  }
  endShape();
}

function drawYellowSoftAtmosphere(x, y, w, h) {
  noStroke();

  // subtle warm dust
  for (let i = 0; i < 18; i++) {
    let px = x + random(w);
    let py = y + random(h);

    fill(255, 225, 150, 8);
    ellipse(px, py, random(2, 5), random(2, 5));
  }


}

function drawBlackSoftAtmosphere(x, y, w, h) {
  // sparse structural lines
  stroke(255, 255, 255, 10);
  strokeWeight(1);

  for (let i = 0; i < 5; i++) {
    let px1 = x + random(w);
    let py1 = y + random(h);
    let px2 = x + random(w);
    let py2 = y + random(h);
    line(px1, py1, px2, py2);
  }

  // a few dim dots only
  noStroke();
  for (let i = 0; i < 8; i++) {
    let px = x + random(w);
    let py = y + random(h);
    fill(255, 255, 255, 8);
    ellipse(px, py, random(1.5, 3), random(1.5, 3));
  }
}

function getSafeSystemValue(positionName) {
  if (positionName === "top") {
    if (typeof topSystem !== "undefined") return topSystem;
    return 1;
  }

  if (positionName === "middle") {
    if (typeof middleSystem !== "undefined") return middleSystem;
    return 2;
  }

  if (positionName === "bottom") {
    if (typeof bottomSystem !== "undefined") return bottomSystem;
    return 3;
  }

  return 1;
}

function getSystemData(systemNumber) {
  if (systemNumber === 1) {
    return {
      name: "BLACK SYSTEM",
      desc: "Structured and sharp features are beauty",
      r: 120,
      g: 120,
      b: 120,
      a: 60
    };
  }

  if (systemNumber === 2) {
    return {
      name: "BLUE SYSTEM",
      desc: "Individuality is beauty",
      r: 90,
      g: 120,
      b: 255,
      a: 72
    };
  }

  if (systemNumber === 3) {
    return {
      name: "YELLOW SYSTEM",
      desc: "Softness and naturalness are beauty",
      r: 255,
      g: 220,
      b: 90,
      a: 72
    };
  }

  return {
    name: "SYSTEM",
    desc: "Beauty preset",
    r: 180,
    g: 180,
    b: 180,
    a: 60
  };
}
// Right info blocks
function drawSystemInfoBlock(x, y, w, title, desc, type) {
  fill(255);
  noStroke();
  textSize(15);
  text(title, x, y);

  fill(210);
  textSize(11);
  drawWrappedText(desc, x, y + 28, w - 18, 15, 2);

  if (type === "yellow") {
    drawReferenceImageRow(x, y + 88, w - 10, 58, yellowRefImgs, "yellow");
  } else if (type === "blue") {
    drawReferenceImageRow(x, y + 88, w - 10, 58, blueRefImgs, "blue");
  } else if (type === "black") {
    drawReferenceImageRow(x, y + 88, w - 10, 58, blackRefImgs, "black");
  }
}

function drawDividerWithDot(x, y, w) {
  stroke(255, 255, 255, 62);
  strokeWeight(1);
  line(x, y, x + w, y);

  let dotX = x + w / 2;

  noStroke();
  fill(255, 255, 255, 160);
  ellipse(dotX, y, 5, 5);

  fill(255, 255, 255, 38);
  ellipse(dotX, y, 18, 18);
}

function drawReferenceImageRow(x, y, totalW, h, imgArray, type) {
  let gap = 6;
  let count = 5;
  let boxW = (totalW - gap * (count - 1)) / count;

  for (let i = 0; i < count; i++) {
    let bx = x + i * (boxW + gap);

    // dark base box
    noStroke();
    fill(20);
    rect(bx, y, boxW, h);

    if (imgArray && imgArray[i]) {
      drawImageCover(imgArray[i], bx, y, boxW, h);
    } else {
      // fallback colour if an image path is wrong
      if (type === "yellow") {
        fill(170, 135, 60);
      } else if (type === "blue") {
        fill(55, 95, 155);
      } else if (type === "black") {
        fill(70, 70, 70);
      } else {
        fill(80);
      }

      rect(bx, y, boxW, h);

      fill(255, 180);
      textSize(9);
      text("REF", bx + 8, y + h / 2 - 4);
    }

    // subtle border
    noFill();
    stroke(255, 255, 255, 55);
    strokeWeight(1);
    rect(bx, y, boxW, h);
  }
}

function drawImageCover(img, x, y, w, h) {
  if (!img || img.width === 0 || img.height === 0) {
    return;
  }

  let imgRatio = img.width / img.height;
  let boxRatio = w / h;

  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }

  image(img, x, y, w, h, sx, sy, sw, sh);
}

function drawWrappedText(str, x, y, maxW, lineH, maxLines) {
  let words = str.split(" ");
  let line = "";
  let linesDrawn = 0;

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";

    if (textWidth(testLine) > maxW && i > 0) {
      text(line, x, y + linesDrawn * lineH);
      line = words[i] + " ";
      linesDrawn++;

      if (linesDrawn >= maxLines) {
        return;
      }
    } else {
      line = testLine;
    }
  }

  if (linesDrawn < maxLines) {
    text(line, x, y + linesDrawn * lineH);
  }
}

function drawInfoDivider(x, y, w, type) {
  stroke(255, 255, 255, 62);
  strokeWeight(1);
  line(x, y, x + w, y);

  let dotX = x + w / 2;

  noStroke();

  if (type === "yellow") {
    fill(255, 225, 120, 160);
  } else if (type === "blue") {
    fill(120, 170, 255, 160);
  } else {
    fill(220, 220, 220, 150);
  }

  ellipse(dotX, y, 5, 5);

  if (type === "yellow") {
    fill(255, 225, 120, 45);
  } else if (type === "blue") {
    fill(120, 170, 255, 45);
  } else {
    fill(220, 220, 220, 36);
  }

  ellipse(dotX, y, 18, 18);
}

function drawReferencePlaceholderRow(x, y, totalW, h, type) {
  let gap = 8;
  let boxW = (totalW - gap * 4) / 5;

  for (let i = 0; i < 5; i++) {
    let bx = x + i * (boxW + gap);

    noStroke();

    if (type === "yellow") {
      fill(120 + i * 15, 100 + i * 10, 50, 255);
    } else if (type === "blue") {
      fill(40, 70 + i * 15, 120 + i * 20, 255);
    } else {
      fill(70);
    }

    rect(bx, y, boxW, h);

    fill(255, 180);
    textSize(10);
    text("REF", bx + 10, y + 22);
  }
}

function drawBlackPlaceholderBox(x, y, w, h) {
  noFill();
  stroke(255, 255, 255, 80);
  rect(x, y, w, h);

  fill(180);
  noStroke();
  textSize(12);
  text("REFERENCE TO BE ADDED", x + 18, y + 44);
}
