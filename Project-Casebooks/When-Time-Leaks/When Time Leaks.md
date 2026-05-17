

## Final Project

### 💥 LLM Use Disclaimer

I confirm that I did not use any Large Language Model (LLM) tools for the development of the project’s concept, design decisions, coding logic or written content. All ideas, interaction design, and the full code implementation were created independently.

I used ChatGPT only in two limited ways:

To confirm occasional English vocabulary choices when I was unsure which term was the most accurate or professional.

To check my completed code for minor details such as punctuation or BUG errors after the logic and structure had already been fully written by me.

No LLM tools were used to generate code, create ideas, write sections of the project, or make design decisions. Apart from the two uses listed above, the entire project was produced without AI assistance.

Public transcript link:

https://chatgpt.com/share/6930396b-ff10-8012-9a58-3233675e6363

https://chatgpt.com/share/69303957-11bc-8012-b84f-27390c9017b8

<img width="1916" height="1280" alt="image" src="https://github.com/user-attachments/assets/06bd521b-5753-4695-9134-b6416aea3e08" />



### 💥 Project Description
💥 **Concept**

In life, we often encounter moments that we want to hold on to. However, the more we try to keep time from slipping away, the more we become aware of pressure, tension, sadness or reluctance ... 
For example, we hope to do the best in an important exam within a limited amount of time, or we try to maintain a relationship and remain in a moment that is about to pass...
Therefore, this project is created from that feeling. I want the user to experience how the more we try to grasp time, the more urgent and upset it becomes.

💥 **Interaction**

When the user shakes the pendulum, the tilt sensor activates the peristaltic pump and the liquid begins to flow, symbolising the arrival of emotion or time itself. Pressing the pressure sensor makes the liquid speed up and the sound grow stronger, showing that the more we try to hold on to time, the more anxious we become. When there is no interaction and the pendulum becomes still, the liquid stops, creating a calm state where time flows naturally. By pressing the button, the liquid flows out of the pendulum, making the whole experience cyclical.

### 💥 Demo Video https://youtu.be/NJDFdZ1kznE

Video. 1 *When Time leaks* (2025)

### 💥 Images of Final Prototype
💥 **Hardware**

This is the hardware connection diagram, showing both the digital and the physical one.


<img width="1437" height="870" alt="image" src="https://github.com/user-attachments/assets/ac0da6a4-a89a-4add-82eb-1d5767bb0ccc" />

Fig. 1 *Digital Circuit Diagram* (2025)

<img width="2442" height="1620" alt="image" src="https://github.com/user-attachments/assets/ac8c2198-85fa-4878-97d2-ce769a3e81b0" />

Fig. 2 *Physical Circuit* (2025)


💥 **Final Display**

The following images show the final interactive installation in its static display.

<img width="1916" height="1280" alt="image" src="https://github.com/user-attachments/assets/adeb1a42-0cec-45a3-abb7-f37a04664f59" />

<img width="1920" height="1280" alt="image" src="https://github.com/user-attachments/assets/98253445-7c69-455d-85c6-dfe318c24242" />

<img width="1888" height="1280" alt="image" src="https://github.com/user-attachments/assets/e58a63ef-31e8-407d-831c-14a9d6c1d83b" />


<img width="889" height="1329" alt="image" src="https://github.com/user-attachments/assets/730d40ae-f7c7-4e93-9110-2dbad9a71b84" />



<img width="2106" height="1402" alt="image" src="https://github.com/user-attachments/assets/94b6948b-2506-42fb-bf50-6e3748d7dcc6" />

<img width="2115" height="1418" alt="image" src="https://github.com/user-attachments/assets/d3c38b0a-5260-42eb-bb54-71b092c3df44" />


### 💥 All Code Files


💥 **Main Part of Final Coding**

**Pin setup**

````
SoftwareSerial mp3(10, 11); // RX Pin10   TX Pin11
DFRobotDFPlayerMini player;

// different pin connect

int tiltPin = 2; // tilt sensor
int fsrPin = A0; // fsr pressure sensor
int pulPin = 6; // drive model pul+
int dirPin = 7; // drive model dir+
int btnPin = 8; // button
````

**Pull up the input**

````
  pinMode(tiltPin, INPUT_PULLUP); // Pull-up: shake ts = high 
  pinMode(btnPin, INPUT_PULLUP); // Pull-up: press button = low 
  pinMode(pulPin, OUTPUT); // pul controls pump activation 
  pinMode(dirPin, OUTPUT); // dir controls direction

  Serial.begin(115200); 

  mp3.begin(9600); //baud rate: 9600
// Check whether the DFPlayer is working correctly
  if (!player.begin(mp3)) {
    Serial.println("dfplayer err");
    while (1);
  }

  player.volume(10); //set 10 at beginning
  player.play(1); //Play files from SD card 

  digitalWrite(dirPin, HIGH); // Let the pump run forward first
````
**Button**

````
  // push button, reverse pumping of liquid flow
  if (b == LOW) {
    timing = false;
    digitalWrite(dirPin, LOW);

    int r = 400; // speed 
    digitalWrite(pulPin, HIGH); // high
    delayMicroseconds(r); // wait
    digitalWrite(pulPin, LOW); // low
    delayMicroseconds(r); //wait

    return;
  }
````
**FSR Pressure Sensor**

````
 if (!timing && t == HIGH) {
    timing = true;
    startTime = millis();
    Serial.println("tiltsensor start 10 sec");
  }

  // during 10 sec (detail set)
  if (timing) {
// if exceeds 10 seconds
    if (millis() - startTime >= 10000) {
// turn off
      timing = false; 
      digitalWrite(pulPin, LOW);
// sound become smallll
      player.volume(5);
      return;
    }
  // making sure the pump move
    digitalWrite(dirPin, HIGH);
````
**Peristaltic pump speed**

````
    int d = map(f, 0, 1023, 2000, 50); //more pressure, more speed
    if (d < 50) d = 50; // the lowest speed
    if (d > 3000) d = 3000; // but it is not very slow

    digitalWrite(pulPin, HIGH); //same as up, high
    delayMicroseconds(d); // wait
    digitalWrite(pulPin, LOW); // low
    delayMicroseconds(d); // wait
````
**More pressure, more sound**

````
// sound & pressure
    int v = map(f, 0, 1023, 5, 28); // more pressure, more sound
    if (v < 10) v = 10; // from 10 to 28
    if (v > 28) v = 28;
    player.volume(v);
````

💥 **Whole Final Coding**

<img width="2754" height="1594" alt="image" src="https://github.com/user-attachments/assets/84f83344-aa6d-4ecc-9ebe-049e08778edb" />

<img width="2706" height="1405" alt="image" src="https://github.com/user-attachments/assets/dd4ae53c-a0ab-4ac1-a95d-e4bff7b55021" />

<img width="2672" height="1374" alt="image" src="https://github.com/user-attachments/assets/94ac6f6c-dda3-4dd9-80dc-12a02a24963f" />


Fig. 3,4,5 *Final Coding* (2025)

````
#include <SoftwareSerial.h>
#include <DFRobotDFPlayerMini.h>

SoftwareSerial mp3(10, 11); // RX Pin10   TX Pin11
DFRobotDFPlayerMini player;

// different pin connect

int tiltPin = 2; // tilt sensor
int fsrPin = A0; // fsr pressure sensor
int pulPin = 6; // drive model pul+
int dirPin = 7; // drive model dir+
int btnPin = 8; // button

// recording the timing

unsigned long startTime = 0;
bool timing = false;

void setup() {

  pinMode(tiltPin, INPUT_PULLUP); // Pull-up: shake ts = high 
  pinMode(btnPin, INPUT_PULLUP); // Pull-up: press button = low 
  pinMode(pulPin, OUTPUT); // pul controls pump activation 
  pinMode(dirPin, OUTPUT); // dir controls direction

  Serial.begin(115200); 

  mp3.begin(9600); //baud rate: 9600
// Check whether the DFPlayer is working correctly
  if (!player.begin(mp3)) {
    Serial.println("dfplayer err");
    while (1);
  }

  player.volume(10); //set 10 at beginning
  player.play(1); //Play files from SD card 

  digitalWrite(dirPin, HIGH); // Let the pump run forward first
}

void loop() {
// read tilt, button as well as fsr pressure...

  int t = digitalRead(tiltPin);
  int b = digitalRead(btnPin);
  int f = analogRead(fsrPin);

  // push button, reverse pumping of liquid flow
  if (b == LOW) {
    timing = false;
    digitalWrite(dirPin, LOW);

    int r = 400; // speed 
    digitalWrite(pulPin, HIGH); // high
    delayMicroseconds(r); // wait
    digitalWrite(pulPin, LOW); // low
    delayMicroseconds(r); //wait

    return;
  }

  // shake the tiltsensor, pump begins to move 10 sec

  if (!timing && t == HIGH) {
    timing = true;
    startTime = millis();
    Serial.println("tiltsensor start 10 sec");
  }

  // during 10 sec (detail set)
  if (timing) {
// if exceeds 10 seconds
    if (millis() - startTime >= 10000) {
// turn off
      timing = false; 
      digitalWrite(pulPin, LOW);
// sound become smallll
      player.volume(5);
      return;
    }
  // making sure the pump move
    digitalWrite(dirPin, HIGH);

  // pump speed
    int d = map(f, 0, 1023, 2000, 50); //more pressure, more speed
    if (d < 50) d = 50; // the lowest speed
    if (d > 3000) d = 3000; // but it is not very slow

    digitalWrite(pulPin, HIGH); //same as up, high
    delayMicroseconds(d); // wait
    digitalWrite(pulPin, LOW); // low
    delayMicroseconds(d); // wait

    // sound & pressure
    int v = map(f, 0, 1023, 5, 28); // more pressure, more sound
    if (v < 10) v = 10; // from 10 to 28
    if (v > 28) v = 28;
    player.volume(v);
  // serial
    Serial.print("run fsr ");
    Serial.println(f);

    return;
  }

  // making the pump stop working if there is not interactive
  digitalWrite(pulPin, LOW);

  // the sound just 5
  player.volume(5);
  // Serial
  Serial.println("wait tiltsensor");
}
````





### 💥 Background Research & Inspiration

💥 **Tech Study**

On the technical side, the sound interaction used in this project was something I had never learned before, so I had to study the DFPlayer, the speaker and the FSR pressure sensor on my own. During this process, a YouTube creator’s tutorials (not only this link but also several of his other videos) were extremely helpful. His explanations helped me understand the wiring, the library and the logic behind the sound control, and eventually allowed me to complete this part of the project.

https://www.youtube.com/watch?v=P42ICrgAtS4

💥 **About Theme**

My inspiration comes from my everyday life. I noticed that the more I try to hold on to a particular moment, the faster it seems to disappear, and the process often fills me with mixed emotions. A farewell （Fig. 6) or an important exam （Fig. 7) makes this feeling especially clear. As the moment slips away, a sense of urgency around time begins to grow quietly in the background, shaping both the mood and the experience.

<img width="1082" height="602" alt="image" src="https://github.com/user-attachments/assets/d0d98020-a214-4986-87b6-e59d20fa7d40" />


Fig. 6 *A farewell* (2025)

<img width="1179" height="588" alt="image" src="https://github.com/user-attachments/assets/2774815d-6022-40e7-ac51-eada5ffb1887" />


Fig. 7 *A exam* (2025)

During the early inspiration stage, Olafur Eliasson’s work played an important role, especially Breathing Earth Sphere (Fig. 8). His frequent use of light, water and mist to express “the flow of time” and “emotional tension” made a strong impression on me. It reminded me that I also needed a material element to convey the idea of time. This is why I chose flowing liquid in my installation. When the liquid speeds up, it represents the pressure of both emotion and time increasing at the same moment.

<img width="1805" height="1920" alt="image" src="https://github.com/user-attachments/assets/2edc8235-4bbb-43c6-979e-70cdbf692f04" />


Fig.8 *Breathing Earth Sphere* (2024)

Therefore, I decided to use liquid as the main medium to express the flow and urgency of time. I used the tilt sensor as the input to control the liquid entering the system, because its interaction feels similar to the movement of a pendulum. This helps the participant sense the idea of time shifting or flowing. I then used the FSR pressure sensor to control the speed of the liquid. When the participant applies pressure to the sensor, they also physically feel that pressure, which becomes a way to communicate the emotional tension that comes with time passing.

At the same time, the sound becomes louder as the pressure increases. The audio I used is a recording of storm and wind that I captured while hiking (Fig. 9). The noise from that moment created a strong emotional response for me, and that experience inspired me to include it in my installation. By using this sound, participants can feel a similar emotional shift through hearing, creating a more immersive and multisensory interactive experience.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2c1c5224-aa73-46be-ab06-2ff03bd7bc5e" />



Fig.9 *During My Hiking to Record the Rainstorm and Wind Sound* (2025)


### 💥 Sketches, Diagrams, and Design Documents
💥 **Sketch**

After deciding how I wanted to express my concept, I began sketching the structure of the installation. I wanted it to feel abstract, but not to the point where the audience might struggle to understand the idea. If the form becomes too abstract or too artistic, the participant may not fully grasp the intention behind it. For this reason, I decided to design a new type of pendulum. I built a frame using metal rods and placed a pendulum inside. The pendulum is a hollow, transparent sphere, with a small opening at the top so the liquid can flow in. This allows the participant to sense the moment when the liquid begins to enter, creating the impression that time itself has started to move (Fig. 10).

<img width="1342" height="867" alt="image" src="https://github.com/user-attachments/assets/4c2e169a-644d-4a6b-86fb-4bc437b6ef9f" />

Fig. 10 *Sketch* (2025)

💥 **Tech**

After finalising the visual direction, I moved on to the wiring and coding stage. I began assembling the electronic components and testing the interaction step by step. The following video (video 2) documents part of this process, including the circuit setup and the behaviour of each sensor during testing.




https://github.com/user-attachments/assets/ade9b9e5-ab30-4fa9-b465-0a63e35bd4c4


Video. 2 *The Tech Progress* (2025)

💥 **Building**


After resolving the technical elements, I began building the physical installation and bringing the concept into its final form (video 3). 



https://github.com/user-attachments/assets/3e2f8524-f397-42c5-a225-11706ccdf983


Video. 3 *Build. 1* (2025）



Final, I completed the final film and photo of my project on the first floor of the Camberwell campus. I then edited the footage.

<img width="1675" height="1279" alt="image" src="https://github.com/user-attachments/assets/5ffff3ef-ed25-4922-ba35-e3384a22bd09" />



Fig. 11, 12 *During the photogrph and cutting* (2025)












### 💥 REFLECTING

In this project, I used the techniques learned in Weeks 1, 2 and 4, together with the skills I studied on my own, to complete my interactive installation. Through this project, and through my studies at UAL this term, I feel that I have grown a lot both technically and in my critical thinking.

In terms of thinking, I began to understand more deeply the relationship between technology and art. I believe this came from the weekly reading tasks. Through constant reading, I became clearer about what interaction design really is, how it serves users, and how to ensure that a piece of work can include different groups and support their experiences. I also realised that coding is not only a scientific skill. It can also be a form of artistic expression. These ideas have shaped the way I approached this installation.

Compared with before, I am less focused on whether something looks impressive. Now, I care more about whether my work can encourage reflection, whether it can respond to users’ needs and how my code can carry my critical thinking. I also hope to make the behaviour of the code more expressive, so that users can have a stronger experience. The readings influenced me quietly, and I can feel this change in the way I create.

On the technical side, I worked with a wider range of inputs and outputs, and learned practical skills such as soldering and 3D printing. These tools allowed me to express my ideas more freely, without being limited by technical barriers. This improvement became very clear in my final project. I moved beyond the simple input methods I used before. By using a tilt sensor and an FSR pressure sensor, I made the interaction more playful. The addition of sound also created a multisensory experience.

During the making process, I also encountered some issues. During the presentation, the professor suggested adding a reset button, because without it, the water in the installation would eventually fill the container. This would mean that after a few users, the installation could no longer function. I added an external button to allow the pump to reverse and reset the system. This was something I had not considered before, and I think it is an important part of my reflection. In future projects, I will pay more attention to this kind of issue, to make sure that my installations can be used repeatedly.

### 💥 REFERENCE

Indrek (2019) *DfPlayer Mini Module - Play MP3 Files With an Arduino (Step-by-step Guide).* Available at: https://www.youtube.com/watch?v=P42ICrgAtS4 (Accessed: 3 December 2025).

O, Eliasson. (2024) *Breathing earth sphere.* Available at: https://olafureliasson.net/ (Accessed: 3 December 2025).









