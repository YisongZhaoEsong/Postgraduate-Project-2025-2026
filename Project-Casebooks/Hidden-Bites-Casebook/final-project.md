# Final Project of Critical Coding - Hidden Bites

*Author: Yisong ZHAO (25009492)*

*Website Link: https://git.arts.ac.uk/pages/y-zhao0320256/CriticalCodingFinalProjectVideo_YisongZHAO25009492/*

*Video Link: https://ual.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=3e1229f2-9f33-45af-9d1a-b412015a76f4*

*Source Code Link: https://github.com/YisongZhaoEsong/Hidden-Bites.git*

<img width="2583" height="1290" alt="image" src="https://github.com/user-attachments/assets/0ef16f42-4495-4892-867a-5aaae4176211" />


## 🟩 Project Description:

### 🟪 What is this?

This project, *Hidden Bites*, is an interactive map-based game developed using JavaScript. It explores how platform recommendation systems influence people’s choices when selecting restaurants. The project takes the form of a critical interactive experience, where users are asked to identify whether a restaurant is a “viral” platform-driven location or a genuinely good local food spot. The intended experience is both critical and Playful, encouraging users to learn how to discover better food choices through gameplay.

The game begins with an AR interaction, where users scan a pizza image（clicking the website link, the pizza image can be found on the second page.） to enter the system. Once activated, a city map (based on Shenyang) is generated, displaying a series of restaurants. Each restaurant is represented through visualised data, including crowd density, comment levels, and location context. Players are given 30 seconds to judge each restaurant based on these visual cues. Choosing a local restaurant earns five points, while selecting a viral restaurant deducts five points, and score over 10 to win.

### 🟪 How was this made?

### 🟪 **1. Wireframe & Sketch**

I created sketches and low-fidelity wireframes for the game to establish the core UI design and interaction logic.

<img width="3362" height="1290" alt="image" src="https://github.com/user-attachments/assets/381b77f6-4ed0-40e9-86c9-28c8ce6832fe" />


Fig *Wireframe*

### 🟪 **2. Coding**

🟦 **I first decided on the two fonts I wanted to use in the UI: Jost and PressStart2P, to create a balance between readability and a game-like visual style.**

🟦 **Then, following the method introduced in class, I used Mappa.js with Leaflet to integrate a real-world map into the p5.js canvas. In the options object, latitude and longitude define the map centre, while zoom controls the visible scale of the city area. The map tiles are loaded through a dark CartoDB/OpenStreetMap style. I then used latLngToPixel() to convert each restaurant’s latitude and longitude into screen positions, so that the restaurant points could be placed directly on the map.**

````
mappa = new Mappa("Leaflet");
myMap = mappa.tileMap(options);
myMap.overlay(myCanvas);
````
Mappa = connects p5.js to real-world maps

Leaflet = mapping system (underlying layer)

````
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
````
options.lat / options.lng → map center (Shenyang City)

shop.lat / shop.lng → restaurant location

zoom → zoom level

style → tile URL / map tile style


**The Mappa.js library was downloaded from its official repository and is used to connect p5.js with the Leaflet mapping system.**


***Reference Link:***

***https://mappa.js.org/docs/getting-started.html***

***https://leafletjs.com/***

***https://github.com/cvalenzuela/Mappa***


🟦 **Data information**

To simulate the difference between viral restaurants and local food spots,  I set up eight restaurants in the game. Each restaurant incorporates the characteristics of viral restaurants and local food spots from my initial concept, and I categorised them as either viral restaurants or local food spots based on their respective tendencies.

````
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
````
🟦 **Visualisation & Interaction**

I used latLngToPixel() to convert geographic coordinates into screen positions, and visual elements such as circles, icons, and text are drawn dynamically to represent different characteristics.

User interaction is handled through mouse input. When the player clicks on a restaurant, the system checks whether the selection is correct and updates the score accordingly.

````
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
````
For Visualisation

<img width="3362" height="1290" alt="image" src="https://github.com/user-attachments/assets/bda02bfc-9d00-49ac-a932-1b0b10669da3" />



Fig *Coding*

🟦 **AR Entry & Web Integration**

To create a more interactive entry point, I introduced an AR-based starting interface using MindAR and A-Frame.

The AR page (index.html) allows users to scan a pizza image. Once the image is recognised, the system triggers a transition to the main game interface.

````
target.addEventListener("targetFound", () => {
  window.location.href = "game.html";
});
````

**This interaction was adapted from the official MindAR documentation and modified to fit the structure of my project.**

***Reference Link:***

***https://hiukim.github.io/mind-ar-js-doc/quick-start/overview***

<img width="1815" height="680" alt="image" src="https://github.com/user-attachments/assets/36728154-28f7-40e9-9ca8-0f570a8057de" />


Fig *AR entry making*

🟦 **Game Page Setup**

The main game (game.html) is built using p5.js and Mappa.js. I structured the page by importing the required libraries and linking it to the sketch file, where all visual and interaction logic is implemented.

```
<script src="p5.js"></script>
<script src="mappa.js"></script>
<script src="sketch.js"></script>
````
This separation allows the AR interaction and the game system to remain independent, while still being connected through a simple navigation flow.

**Final, I made the the initial game.**

<img width="3039" height="1710" alt="image" src="https://github.com/user-attachments/assets/f77a6edf-0724-4cd3-9e9f-9fc0c80c3877" />


Fig *the initial game*

### 🟪 **3. User Feedback & Coding Change**

**After building the initial version of the game, I conducted user testing with a small group of participants, gathered their feedback, and made revisions accordingly.**

🟦 **First，users said that once the game started, it didn’t feel related to food at all, as there were no food elements in the interface. In response, I revised the original design by incorporating pizza-related visuals, making the overall interface feel more clearly connected to food.**

````
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
````

🟦 **Then, some users mentioned that the platform recommendation panel on the right was updating too slowly, so I reduced the refresh interval from five seconds to three seconds.**

````
function drawGame() {
  hoverId = -1;

  if (frameCount % 180 == 0) {
    feedStep++;
  }

  if (frameCount % 60 == 0 && timeLeft > 0) {
    timeLeft--;
  }
````
**I've fixed these issues and completed the final project.**

### 🟪 Why did I made this?

The motivation behind this project comes from personal experience. I noticed that many highly recommended restaurants on platforms such as TikTok and Xiaohongshu often prioritise visual presentation and online visibility over food quality. In contrast, many local restaurants with excellent food remain unnoticed due to a lack of digital exposure. This led me to question how digital platforms shape our perception and choices.

Through this project, I aim to critically reflect on platform-driven visibility and consumer behaviour, revealing how digital platforms subtly shape people’s choices and consumption behaviours. while also helping users improve their ability to identify worthwhile restaurants in real life. 

## 🟩 Project Images

<img width="3362" height="1290" alt="image" src="https://github.com/user-attachments/assets/1d60a5f6-b0c7-4802-9e25-ec11856fc477" />

<img width="6077" height="3419" alt="image" src="https://github.com/user-attachments/assets/e9416072-ecb0-4fe5-b05b-5c31cdf65221" />

<img width="3362" height="1290" alt="image" src="https://github.com/user-attachments/assets/40888313-e35d-4a1b-8309-a4b051990b47" />

Fig. *Final Display*

## 🟩 Reference

Mappa.js (2026) Getting Started. Available at: https://mappa.js.org/docs/getting-started.html
 (Accessed: 13 March 2026).

Leaflet (2026) Leaflet — an open-source JavaScript library for interactive maps. Available at: https://leafletjs.com/
 (Accessed: 13 March 2026).

Valenzuela, C. (2026) Mappa (GitHub repository). Available at: https://github.com/cvalenzuela/Mappa
 (Accessed: 13 March 2026).

Hiukim (2026) MindAR.js Documentation: Quick Start Overview. Available at: https://hiukim.github.io/mind-ar-js-doc/quick-start/overview
 (Accessed: 11 March 2026).

EqualStreetNames (2026) Madrid Equal Street Names Map. Available at: https://madrid.equalstreetnames.eu/en/index.html#13.95/40.44635/-3.70261
 (Accessed: 11 March 2026).

Wikipedia (2026) Midnight Rescue!. Available at: https://en.wikipedia.org/wiki/Midnight_Rescue
! (Accessed: 11 March 2026).

Niantic (2026) Pokémon GO. Available at: https://pokemongo.com/
 (Accessed: 11 March 2026).


## 🟩 More Details about This Project (Including Background, User Research, Secondary Research, Case Study, Interaction flow)


images/image_009.png




## 🟩 Background

### 🟪 Inspiration

In the daily life, I often find myself choosing restaurants that are recommended on platforms such as TikTok and Xiaohongshu. These places usually have high ratings and stylish interiors, making them look very attractive. However, the actual experience is often not as good as expected. In contrast, some local restaurants with excellent food are difficult to discover because they lack platform promotion, and people rarely choose to visit them. This led me to think more critically: what factors are actually influencing our choices when selecting restaurants, and how can we truly discover places that are genuinely good?

<img width="2868" height="1290" alt="image" src="https://github.com/user-attachments/assets/f8bdca8b-7902-4abc-950c-c5d96fb53974" />


Fig *Research*

### 🟪 Problem Analysis

<img width="3208" height="1443" alt="image" src="https://github.com/user-attachments/assets/352cfef6-e7bf-49c9-9796-6d4a92fb97b2" />


Fig Imformation Design by author*

After conducting research, I found that people’s choices are largely influenced by platform recommendation systems. Many viral restaurants try to gain more exposure by encouraging customers to leave high ratings, sometimes offering small rewards such as free drinks. At the same time, they often collaborate with food bloggers and influencers to promote their restaurants on platforms like TikTok and Xiaohongshu. As a result, these restaurants tend to invest more effort in marketing and visibility rather than in the quality of the food itself.

In contrast, some long-established local restaurants with excellent cooking skills struggle to gain online attention. Because the owners may not be familiar with platform promotion or lack marketing resources, these restaurants rarely appear in recommendation feeds and mainly rely on regular local customers who already know about them.

### 🟪 Conclusion

To respond to this issue, I decided to design an interactive map game using JavaScript. In the game, users need to judge restaurants based on their visual features and information cues, in order to identify the difference between viral restaurants and local food spots. Through this process, they are guided towards discovering small local places that may offer genuinely good food but are rarely recommended by platforms. By turning this into a playful experience, the project encourages users to rethink how they search for good restaurants, while also critiquing the weaknesses of platform recommendation systems and viral restaurant culture. More importantly, it reflects on how digital platforms subtly shape people’s choices and consumption habits.

## 🟩 Research

I decided to start by analysing the differences between viral restaurants and local food spots on digital platforms, helping users understand how these two types of restaurants are represented online. To explore this issue further, I first conducted user research, focusing on people’s own experiences and perspectives when choosing where to eat.

### 🟪 User Research


<img width="3209" height="1290" alt="image" src="https://github.com/user-attachments/assets/829daf94-f364-4065-821f-ca837b80edcd" />


Fig *User Research*

🟦 **Conclusion of user research**

1. Users commonly felt that restaurants with very stylish interiors or visually appealing designs are sometimes less likely to have good food.
2. They also noticed that restaurants recommended by locals are usually reliable, while places mainly visited by tourists often lead to disappointing experiences.

### 🟪 Secondary Research

To gain a deeper understanding of the issue, I then began searching for more information online, and then found the following information.

<img width="3209" height="1290" alt="image" src="https://github.com/user-attachments/assets/7f494f8d-c7b7-48e1-b99c-f68edad9c6b5" />


Fig *Secondary Research*

### 🟪 Conclusion of Resaerch

**Therefore, through both user research and secondary research, we identified the six differences above between viral restaurants and local food spots**

## 🟩 Case Study

### 🟪 EqualStreetNames

EqualStreetNames is a project that visualises the gender distribution of street names through a map. It transforms data into visual information on the map, allowing users to more easily understand hidden gender inequalities within urban space while browsing.

**This inspired me to use visualised information in my map interface to reveal hidden data patterns.**

<img width="2868" height="1290" alt="image" src="https://github.com/user-attachments/assets/f51f711d-588c-45bb-adf3-537426919c7c" />


Fig *Case Study - EqualStreetNames*

### 🟪 Midnight Rescue!

Midnight Rescue! is an educational game in which players collect clues and make decisions within a limited time to find the correct answer. The time pressure encourages quick thinking and decision-making, helping to improve learning outcomes.

**This inspired me to introduce a time limit into my game interaction, allowing players to quickly judge restaurant information within a short period, thereby supporting learning through gameplay.**

<img width="3209" height="1290" alt="image" src="https://github.com/user-attachments/assets/d2fe110b-bd6f-440a-9c30-402686d7c212" />


Fig *Case Study - Midnight Rescue!*

### 🟪 Pokémon GO

Pokémon GO is an AR game that combines the classic series with AR, allowing players to catch Pokémon in the real world.

**It’s given me the idea to use AR to enhance the user experience.**

<img width="3209" height="1290" alt="image" src="https://github.com/user-attachments/assets/a2fe1e5d-4d8f-4e2b-bbb0-ba14a1288133" />


Fig *Case Study - Pokémon GO*

## 🟩 Idea

**Based on the key findings from the case studies and research, I translated the differences between viral restaurants and local food restaurants into visual features, and applied these within the interactive map-based game I am developing:**

<img width="3209" height="1290" alt="image" src="https://github.com/user-attachments/assets/5f9e3695-7528-4191-b891-46055003dab8" />


Fig *Idea*

### 🟪 Interaction flow

**🟦 The player first scans a pizza.**

<img width="1000" height="1000" alt="image" src="https://github.com/user-attachments/assets/55a35676-820e-49f6-9238-8bf63c846158" />


Fig *The pizza for scan （clicking the website link, the pizza image can be found on the second page.）*



**🟦 Once the system recognises it successfully, the game generates a city map showing the distribution of different pizza restaurants, along with their visualised information features.**

<img width="426" height="240" alt="720ac7f8-bca4-43ee-8d85-9bfe34b3b41d" src="https://github.com/user-attachments/assets/a7bc7fd3-24be-41c6-ba37-ef1fb61f65b9" />

<img width="3362" height="1290" alt="image" src="https://github.com/user-attachments/assets/947b29e7-a6ac-4f6e-8a2f-b6c36fa08182" />


Fig *Interaction - scan a pizza, start the game*

**🟦 After the game begins, the player has 30 seconds to judge, based on these visual cues, whether each restaurant is an viral restaurants or a local food restaurants.**


<img width="3525" height="1290" alt="image" src="https://github.com/user-attachments/assets/08e3ff84-5131-4a97-90a3-54355f76a90b" />


Fig *Interaction - visual cues*

**Let’s take a quick look at the information included here.**

**First**, you can see the platform’s recommended restaurants—similar to what you’d find on social media. While most of these are viral spots, a few may actually be local gems, so you’ll need to make your own judgement. 

**Second**, when you select a restaurant, additional details appear to help you decide. 

**Third**, the screen shows the crowd distribution around each restaurant. 

**Finally**, colour is used to indicate location: green represents restaurants in tourist or commercial areas, while purple indicates those in older neighbourhoods.

**🟦 Choosing a viral restaurant results in a 5-point deduction, while choosing a local eatery earns 5 points.** 


<img width="404" height="240" alt="a2fbdd02-c18e-4c70-a378-5a85fdb3a854" src="https://github.com/user-attachments/assets/70fd0cf3-da92-4ec0-b9e2-1c012044de6e" />

Fig *Interaction - earn 5 points*

<img width="404" height="240" alt="38d43a92-b2ee-4f40-b91e-0b7be814c384" src="https://github.com/user-attachments/assets/551b720b-e469-467c-a56d-9497aa734e68" />

Fig *Interaction - deducte 5 points*

**🟦 At the end of the 30 seconds, if the player’s score is above 10, they win and move on to the next round of food exploration.** **（In the current version of the project, only the pizza category has been developed.）**


<img width="404" height="240" alt="78d937ac-ca06-481e-823e-8c8d8986f93a" src="https://github.com/user-attachments/assets/11d116ef-b9aa-4bd3-945f-bc0161ff75b5" />

<img width="3362" height="1290" alt="image" src="https://github.com/user-attachments/assets/7576228d-4a58-4b35-92b0-00776f96c6e2" />


Fig *Interaction - win or fail*








































