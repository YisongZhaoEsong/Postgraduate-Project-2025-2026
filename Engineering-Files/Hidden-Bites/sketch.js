// Map system built with Mappa.js / Leaflet, adapted from official documentation

let mappa;
let myMap;
let myCanvas;

let pixelFont;
let infoFont;

function preload() {
  pixelFont = loadFont("PressStart2P-Regular.ttf");
  infoFont = loadFont("Jost-Bold.ttf");
}

const options = {
  lat: 41.805,
  lng: 123.432,
  zoom: 14,
  style: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

let scene = 0;

let score = 0;
let timeLeft = 30;
let pick = -1;
let hoverId = -1;
let feedStep = 0;

let note = "";
let noteTime = 0;

let c1, c2, c3;
let shops = [];

function setup() {
  myCanvas = createCanvas(1600, 900);

  mappa = new Mappa("Leaflet");
  myMap = mappa.tileMap(options);
  myMap.overlay(myCanvas);

  c1 = color("#4FFC4F");
  c2 = color("#60F4C8");
  c3 = color("#7105FB");

  makeShops();

  for (let s of shops) {
    s.visualType = random(["green", "purple"]);
  }
}

function draw() {
  clear();

  if (scene == 0) {
    drawStart();
  } else if (scene == 1) {
    drawGame();
  } else if (scene == 2) {
    drawEnd();
  }

  if (noteTime > 0) {
    drawNote();
    noteTime--;
  }
}

function usePixel() {
  textFont(pixelFont);
}

function useInfo() {
  textFont(infoFont);
}

function drawStart() {
  fill(0, 165);
  rect(0, 0, width, height);

  noFill();
  stroke(c3);
  strokeWeight(2);
  rect(60, 60, width - 120, height - 120);

  noStroke();
  textAlign(CENTER, CENTER);

  usePixel();
  fill(255);
  textStyle(BOLD);
  textSize(30);
  text("HIDDEN BITES", width / 2, 165);

  useInfo();
  textStyle(NORMAL);
  fill(c2);
  textSize(20);
  text("Scan pizza and enter the city map", width / 2, 220);

  drawPizza(width / 2, height / 2 + 30, 300);

  noFill();
  stroke(c2);
  strokeWeight(2);
  ellipse(width / 2, height / 2 + 28, 350 + sin(frameCount * 0.05) * 12);

}

function drawMiniPizza(x, y, s) {

  noStroke();
  fill(186, 118, 48);
  circle(x, y, s);

  fill(255, 210, 95);
  circle(x, y, s * 0.8);

  fill(235, 120, 70);
  circle(x, y, s * 0.68);

  fill(255, 220, 120);
  circle(x, y, s * 0.58);

  fill(190, 55, 55);
  circle(x - s * 0.16, y - s * 0.08, s * 0.11);
  circle(x + s * 0.12, y - s * 0.13, s * 0.11);
  circle(x + s * 0.14, y + s * 0.08, s * 0.11);
  circle(x - s * 0.08, y + s * 0.16, s * 0.11);
  circle(x, y, s * 0.10);

  fill(40);
  circle(x - s * 0.02, y - s * 0.17, s * 0.05);
  circle(x + s * 0.18, y - s * 0.02, s * 0.05);
  circle(x - s * 0.15, y + s * 0.05, s * 0.05);

  fill(90, 190, 90);
  rectMode(CENTER);
  rect(x - s * 0.2, y - s * 0.2, s * 0.05, s * 0.03, 2);
  rect(x + s * 0.2, y + s * 0.16, s * 0.05, s * 0.03, 2);
  rect(x + s * 0.03, y + s * 0.22, s * 0.05, s * 0.03, 2);

  rectMode(CORNER);

  stroke(245, 180, 90, 180);
  strokeWeight(1.2);
  line(x, y, x, y - s * 0.28);
  line(x, y, x + s * 0.24, y + s * 0.12);
  line(x, y, x - s * 0.22, y + s * 0.16);

  noStroke();
}

function drawGame() {
  hoverId = -1;

  if (frameCount % 180 == 0) {
    feedStep++;
  }

  if (frameCount % 60 == 0 && timeLeft > 0) {
    timeLeft--;
  }

  drawMapTint();
  drawTopBar();
  drawLegend();
  drawFeedPanel();
  drawAllShops();
  drawBottomBar();
  drawMiniProgress();

  if (pick >= 0) {
    drawInfoCard(shops[pick]);
  }

  if (timeLeft <= 0) {
    scene = 2;
  }
}

function drawEnd() {
  fill(0, 185);
  rect(0, 0, width, height);

  noFill();
  stroke(c3);
  strokeWeight(2);
  rect(70, 70, width - 140, height - 140);

  noStroke();
  textAlign(CENTER, CENTER);

  usePixel();
  fill(255);
  textStyle(BOLD);
  textSize(24);

  if (score > 10) {
    text("YOU WIN", width / 2, 180);
  } else {
    text("TIME OVER", width / 2, 180);
  }

  usePixel();
  textStyle(NORMAL);
  fill(c2);
  textSize(12);
  text("SCORE " + score, width / 2, 230);

  useInfo();
  fill(255);
  textSize(18);
  if (score > 10) {
    text("You found more local pizza places than viral traps.", width / 2, 285);
  } else {
    text("The platform feed shaped too many of your choices.", width / 2, 285);
  }

  fill(180);
  textSize(15);
  text("Target score: above 10", width / 2, 320);

  drawButton(width / 2 - 130, height - 155, 260, 52, c2, "RESTART");
}

function drawMapTint() {
  noStroke();
  fill(0, 34);
  rect(0, 0, 1080, height);

  fill(10, 12, 18, 235);
  rect(1080, 0, 520, height);
}

function drawTopBar() {
  noStroke();
  fill(10, 12, 18, 228);
  rect(88, 18, 965, 68);

  textAlign(LEFT, CENTER);

  usePixel();
  fill(255);
  textStyle(BOLD);
  textSize(16);
  text("HIDDEN BITES", 114, 42);

  useInfo();
  textStyle(NORMAL);
  fill(c2);
  textSize(13);
  text("Find local pizza, avoid viral traps", 114, 66);

  usePixel();
  fill(255);
  textAlign(RIGHT, CENTER);
  textSize(17);
  text("TIME " + timeLeft, 922, 42);

  fill(c1);
  text("SCORE " + score, 1070, 42);
}

function drawLegend() {
  let x = 88;
  let y = 98;

  noStroke();
  fill(10, 12, 18, 228);
  rect(x, y, 430, 130);

  drawLegendMark(x + 34, y + 28, 0);

  useInfo();
  fill("#4FFC4F");
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(20);
  text("Commercial, Tourist districts", x + 66, y + 28);

  drawLegendMark(x + 34, y + 69, 1);
  text("Old Town districts", x + 66, y + 67);

  noStroke();
  fill(255);
  ellipse(x + 34, y + 108, 20, 20);
  fill(255);
  text("Tourists / Crowd", x + 66, y + 104);
}

function drawLegendMark(x, y, mode) {
  noFill();
  strokeWeight(3);

  if (mode == 0) {
    stroke(c1);
    ellipse(x, y, 28, 28);
    noStroke();
    fill(c2);
    ellipse(x, y, 16, 16);
  } else {
    stroke(c3);
    ellipse(x, y, 28, 28);
    noStroke();
    fill(c3);
    ellipse(x, y, 16, 16);
  }
}

function drawFeedPanel() {
  usePixel();
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text("PLATFORM FEED", 1105, 48);

  let hotList = [];
  for (let i = 0; i < shops.length; i++) {
    if (shops[i].feed > 0) {
      hotList.push(shops[i]);
    }
  }

  for (let i = 0; i < 3; i++) {
    let s = hotList[(feedStep + i) % hotList.length];

    let x = 1105;
    let y = 92 + i * 166;
    let w = 455;
    let h = 138;

    noStroke();
    fill(18, 21, 28, 242);
    rect(x, y, w, h);

    fill(c1);
    rect(x, y, 8, h);

    useInfo();
    fill(255);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(20);
    text(s.name, x + 20, y + 14);

    usePixel();
    fill(c2);
    textStyle(NORMAL);
    textSize(9);
    text("TRENDING NOW", x + 20, y + 48);

    useInfo();
    fill(180);
    textStyle(NORMAL);
    textSize(13);
    text("Comments: " + s.com, x + 20, y + 74);
    text("Area: " + s.zone, x + 20, y + 98);
    text(s.tip1, x + 20, y + 120);

    noFill();
    stroke(c3);
    strokeWeight(2);
    rect(x + 340, y + 24, 78, 78);

    noStroke();
    fill(c2);
    ellipse(x + 379, y + 63, 30 + sin(frameCount * 0.035 + i) * 4);

    usePixel();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(8);
    text("HOT", x + 379, y + 63);
  }
}

function drawAllShops() {
  for (let i = 0; i < shops.length; i++) {
    drawOneShop(shops[i], i);
  }
}

function drawOneShop(s, i) {
  let p = myMap.latLngToPixel(s.lat, s.lng);
  s.px = p.x;
  s.py = p.y;

  let pulse = sin(frameCount * 0.05 + i) * 2;

  if (dist(mouseX, mouseY, p.x, p.y) < 36) {
    hoverId = i;
  }

  if (s.visualType == "green") {
    noFill();
    stroke(c1);
    strokeWeight(3);
    ellipse(p.x, p.y, 80 + pulse, 80 + pulse);

    noStroke();
    fill(c2);
    ellipse(p.x, p.y, 50, 50);

    drawMiniPizza(p.x, p.y, 45);
  } else {
    noFill();
    stroke(c3);
    strokeWeight(3);
    ellipse(p.x, p.y, 80 + pulse, 80 + pulse);

    noStroke();
    fill(c3);
    ellipse(p.x, p.y, 50, 50);

    drawMiniPizza(p.x, p.y, 45);
  }

  if (hoverId == i) {
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(p.x, p.y, 84, 84);
  }

  if (pick == i) {
    noFill();
    stroke(255);
    strokeWeight(3);
    ellipse(p.x, p.y, 96, 96);
  }

  if (s.done) {
    fill(0, 150);
    noStroke();
    ellipse(p.x, p.y, 40);
  }

  drawArtCloud(s, p.x, p.y, i);
}

function drawArtCloud(s, x, y, id) {
  let pts = [];
  let n = s.cloud;

  for (let i = 0; i < n; i++) {
    let a = map(i, 0, n, 0, TWO_PI);
    let r1 = s.up ? 70 : 60;
    let r2 = s.up ? 118 : 86;
    let r = map(i % 4, 0, 3, r1, r2);
    let move = sin(frameCount * 0.02 + id + i) * 3;

    let px = x + cos(a) * (r + move);
    let py = y + sin(a) * (r + move);

    pts.push([px, py]);
  }

  stroke(255, 70);
  strokeWeight(1);
  for (let i = 0; i < pts.length - 1; i++) {
    if (i % 2 == 0) {
      line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    }
  }

  noStroke();
  fill(255);
  for (let i = 0; i < pts.length; i++) {
    ellipse(pts[i][0], pts[i][1], 8, 8);
  }
}

function drawBottomBar() {
  noStroke();
  fill(10, 12, 18, 225);
  rect(0, 836, 1080, 44);

  useInfo();
  fill(180);
  textAlign(LEFT, CENTER);
  textSize(14);
  text("Click a restaurant. Read the clues. Pick local places. Viral places reduce your score.", 20, 858);
}

function drawMiniProgress() {
  let checked = 0;
  for (let i = 0; i < shops.length; i++) {
    if (shops[i].done) {
      checked++;
    }
  }

  let x = 1105;
  let y = 580;
  let w = 455;
  let h = 72;

  noStroke();
  fill(18, 21, 28, 242);
  rect(x, y, w, h);

  usePixel();
  fill(255);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(10);
  text("GAME PROGRESS", x + 18, y + 12);

  useInfo();
  textStyle(NORMAL);
  fill(180);
  textSize(14);
  text("Checked: " + checked + " / " + shops.length, x + 18, y + 30);
  text("Target score: above 10", x + 18, y + 45);

  noStroke();
  fill(40);
  rect(x + 300, y + 42, 120, 12);

  fill(c1);
  let barW = map(checked, 0, shops.length, 0, 120);
  rect(x + 300, y + 42, barW, 12);

  fill(255, 60);
  let glowX = x + 300 + (frameCount % 120);
  rect(glowX, y + 42, 14, 12);
}

function drawInfoCard(s) {
  let x = 1105;
  let y = 670;
  let w = 455;
  let h = 170;

  noStroke();
  fill(18, 21, 28, 245);
  rect(x, y, w, h);

  useInfo();
  fill(255);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  text(s.name, x + 18, y + 16);

  fill(c2);
  textSize(14);
  text("Area: " + s.zone, x + 18, y + 48);

  fill(255);
  textSize(14);
  text("Comments: " + s.com, x + 18, y + 72);

  fill(180);
  text("Clue 1: " + s.tip1, x + 18, y + 100);
  text("Clue 2: " + s.tip2, x + 18, y + 122);

  if (!s.done) {
    drawButton(x + 320, y + 30, 120, 34, c3, "PICK THIS SHOP");
    drawButton(x + 320, y + 80, 120, 34, c3, "CLOSE");
  } else {
    fill(c1);
    textSize(14);
    text("Already checked", x + 18, y + 145);
  }
}

function drawPizza(x, y, s) {
  noStroke();
  fill(245, 210, 120);
  circle(x, y, s);

  fill(255, 190, 80);
  circle(x, y, s - 24);

  fill(220, 70, 70);
  circle(x - 28, y - 12, 18);
  circle(x + 20, y - 26, 18);
  circle(x + 24, y + 18, 18);
  circle(x - 16, y + 24, 18);

  fill(c1);
  circle(x + 3, y - 3, 10);
  fill(c2);
  circle(x - 8, y - 30, 10);
  fill(c3);
  circle(x + 34, y - 1, 10);

  stroke(150, 110, 50);
  strokeWeight(2);
  line(x, y, x + s * 0.35, y - s * 0.1);
  line(x, y, x - s * 0.25, y - s * 0.28);
  line(x, y, x - s * 0.1, y + s * 0.34);
}

function drawButton(x, y, w, h, cc, txt) {
  noFill();
  stroke(cc);
  strokeWeight(2);
  rect(x, y, w, h);

  line(x, y, x + 12, y);
  line(x, y, x, y + 12);
  line(x + w, y, x + w - 12, y);
  line(x + w, y, x + w, y + 12);
  line(x, y + h, x + 12, y + h);
  line(x, y + h, x, y + h - 12);
  line(x + w, y + h, x + w - 12, y + h);
  line(x + w, y + h, x + w, y + h - 12);

  fill(cc);
  noStroke();

  usePixel();
  textAlign(CENTER, CENTER);
  textSize(8);

  if (cc == c1) {
    fill(0);
  } else {
    fill(255);
  }

  text(txt, x + w / 2, y + h / 2);
}

function drawNote() {
  noStroke();
  fill(0, 180);
  rect(width / 2 - 180, 30, 360, 46);

  usePixel();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(25);
  text(note, width / 2, 53);
}

function mouseClicked() {
  if (scene == 0) {
    if (dist(mouseX, mouseY, width / 2, height / 2 - 10) < 90 || overBox(width / 2 - 130, height / 2 + 170, 260, 52)) {
      scene = 1;
      timeLeft = 30;
      score = 0;
      pick = -1;
    }
  } else if (scene == 1) {
    if (pick >= 0) {
      if (overBox(1425, 700, 120, 34)) {
        chooseShop();
        return;
      }
      if (overBox(1425, 750, 120, 34)) {
        pick = -1;
        return;
      }
    }

    for (let i = 0; i < shops.length; i++) {
      let d = dist(mouseX, mouseY, shops[i].px, shops[i].py);
      if (d < 42) {
        pick = i;
        return;
      }
    }
  } else if (scene == 2) {
    if (overBox(width / 2 - 130, height - 155, 260, 52)) {
      resetGame();
    }
  }
}

function overBox(x, y, w, h) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  }
  return false;
}

function chooseShop() {
  let s = shops[pick];

  if (!s.done) {
    s.done = true;

    if (s.type == "local") {
      score += 5;
      note = "GOOD PICK +5";
    } else {
      score -= 5;
      note = "VIRAL TRAP -5";
    }

    noteTime = 80;
  }

  pick = -1;
}

function resetGame() {
  scene = 0;
  score = 0;
  timeLeft = 30;
  pick = -1;
  feedStep = 0;

  for (let i = 0; i < shops.length; i++) {
    shops[i].done = false;
  }
}

function makeShops() {
  shops = [
    {
      name: "Melt One",
      lat: 41.8065,
      lng: 123.3900,
      type: "viral",
      cloud: 16,
      up: true,
      com: 26,
      feed: 9,
      zone: "Commercial, Tourist",
      tip1: "Bright sign and photo wall",
      tip2: "Long line, mostly visitors",
      done: false
    },
    {
      name: "Sun Slice",
      lat: 41.8015,
      lng: 123.4100,
      type: "viral",
      cloud: 14,
      up: true,
      com: 18,
      feed: 8,
      zone: "Commercial, Tourist",
      tip1: "Appears often in platform feed",
      tip2: "Strong design, unclear taste",
      done: false
    },
    {
      name: "Sky Cheese",
      lat: 41.8095,
      lng: 123.4290,
      type: "viral",
      cloud: 16,
      up: true,
      com: 22,
      feed: 8,
      zone: "Commercial, Tourist",
      tip1: "Near scenic area",
      tip2: "High exposure and heavy promotion",
      done: false
    },
    {
      name: "Old Yard",
      lat: 41.7895,
      lng: 123.4050,
      type: "local",
      cloud: 8,
      up: false,
      com: 6,
      feed: 1,
      zone: "Old Town",
      tip1: "Since 1986, family run",
      tip2: "Simple front, many locals",
      done: false
    },
    {
      name: "1988 Pan",
      lat: 41.7888,
      lng: 123.4200,
      type: "local",
      cloud: 6,
      up: false,
      com: 2,
      feed: 0,
      zone: "Old Town",
      tip1: "No strong online exposure",
      tip2: "Regular customers from nearby",
      done: false
    },
    {
      name: "North Alley",
      lat: 41.8220,
      lng: 123.4365,
      type: "local",
      cloud: 7,
      up: false,
      com: 4,
      feed: 0,
      zone: "Old Town",
      tip1: "Hidden in a narrow lane",
      tip2: "Few comments, good local word of mouth",
      done: false
    },
    {
      name: "Brick Oven",
      lat: 41.7975,
      lng: 123.4450,
      type: "local",
      cloud: 7,
      up: false,
      com: 3,
      feed: 0,
      zone: "Old Town",
      tip1: "Old brick wall and handmade dough",
      tip2: "Almost invisible on platforms",
      done: false
    },
    {
      name: "Lane Corner",
      lat: 41.827,
      lng: 123.4155,
      type: "local",
      cloud: 7,
      up: false,
      com: 5,
      feed: 0,
      zone: "Old Town",
      tip1: "Hidden in a side street",
      tip2: "Mostly known by nearby locals",
      done: false
    },
    {
      name: "Glow Slice",
      lat: 41.8147,
      lng: 123.4120,
      type: "viral",
      cloud: 15,
      up: true,
      com: 20,
      feed: 8,
      zone: "Commercial, Tourist",
      tip1: "Bright window and busy check-ins",
      tip2: "Strong platform exposure near the center",
      done: false
    }
  ];
}