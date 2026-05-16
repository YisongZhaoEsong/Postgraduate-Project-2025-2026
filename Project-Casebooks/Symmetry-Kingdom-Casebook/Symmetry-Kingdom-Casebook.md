## Symmetry Kingdom Casebook - Teamwork

***Embodied Interaction； Gamified Experiences； Interactive Systems***

## LLM Use Disclaimer
During the project development process, our team primarily completed the code by referencing relevant tutorials and consulting with our instructor when we encountered technical challenges. The entire project primarily relied on existing learning resources and team collaboration, without utilizing AI tools for code generation.

## Project Overview

***Video Display - https://youtu.be/2ZF1r5V5jsI***

Our team members include (Qiuye Zhu, Yisong Zhao, and Yifei Ni), and we decided to modify Pong.
In this project, we place the classic game Pong within a narrative framework titled “Symmetry Kingdom” and reconstruct its control logic based on this framework.

<img width="10000" height="3970" alt="dddf9f8b-bd08-4e91-acaf-9604f707492c" src="https://github.com/user-attachments/assets/29bd2c4f-8824-4858-80b9-aac49ae16d39" />

<img width="10000" height="3970" alt="571bf6d6-5951-4c4d-bd47-6b2954243853" src="https://github.com/user-attachments/assets/dbe1e5c0-49e2-4a69-b577-f22c35f14e4d" />

Through this game, we aim to make players aware that systems and rules which appear stable and fair are actually designed and maintained orders. The formulation and alteration of rules are often closely tied to the interests and will of those in power and decision-makers.

The story goes like this...
In the Kingdom of Symmetry, every match was flawless.
The ball obeyed its angles. Force grew in perfect proportion. Up was always up.
People believed this was the law of nature.
They had never seen the one who wrote the rules.

Until one day, the King spoke —
The ball no longer bounced, it fell.
Some called it an accident.
But then another decree: 
Up became down. 
The harder you pushed, the slower you moved.

Doubt began to spread.
Perhaps the world had never run on its own.
Perhaps rules were never natural—
only maintained by power.

### In order to translate this narrative into playable game mechanics, we made three core modifications to the foundation of Pong.
1. We completely reversed the original “up means up” control logic. In other words, when the player moves their hand upward, the screen moves downward; when the hand moves downward, the screen moves upward instead.
2. We have adjusted the ball's motion calculation method. The ball no longer moves exactly according to the original physics-based bounce rules but instead shows deviations within a certain range. This deviation is not entirely random; it is controlled by an internally adjustable setting—the “Scale Knob.” This parameter determines the maximum amount of deviation or variation allowed for the ball.
3. To make the game more engaging, we've introduced the obstacle feature. These objects will move up and down in the center of the game area, enhancing the overall playability.

### Through such changes, we have formed this narrative logic
 Symmetric Kingdom: Originally governed by stable rules → After the king's command → Rules changed → Players forced to adapt → Game continues
 
Through this mechanism, we are not merely increasing the game's difficulty, but simulating a process where “rules are interpreted and altered.” Directions can be redefined, physical laws can be fine-tuned, and players must continue competing under the current rules.\
This allows players to realize: rules are not necessarily fair; they often shift according to the interests of those in positions of power and authority.


### Storyboard

**To help players better understand the game’s interaction and narrative process, we created a storyboard.**

**Step 1:**

After clicking “Start”, the game’s narrative is presented to the player.

<img width="568" height="320" alt="1e47e609-531b-4dd5-8989-21874fa64cf7" src="https://github.com/user-attachments/assets/64c27a9d-d319-4150-9049-9ffee07278ba" />

<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/19ca62b3-c52a-4e9d-8dcc-a3f26f3fb468" />


**Step 2:**

Then, The King will issue a command, and the rules of the game will change based on the original system.

<img width="568" height="320" alt="a6c81453-b56c-44e2-b684-f918d954691c" src="https://github.com/user-attachments/assets/13d526d6-8728-47e8-8f88-2f4bb9d8ac9a" />



The King announces:
“Now I order the addition of obstacles that block the ball’s trajectory.”

This means that the original control rule has changed.
Before, when the player moved their hand up, the paddle moved up; when the player moved down, the paddle moved down.
**Now the system reverses the control: when the player moves their hand down, the paddle moves up.**

<img width="1194" height="512" alt="image" src="https://github.com/user-attachments/assets/96396f5e-f10f-4abf-ae0b-3cd329fec95d" />


The game continues based on both the king’s new rules and the original rules - when the player moves their hand down, the paddle moves up... hand moves up, paddle moves down

<img width="426" height="240" alt="5621acd5-8613-47f2-93f9-fc9737d6e31e" src="https://github.com/user-attachments/assets/d80cc679-3f4d-4fa6-94a2-6f714760a39b" />




**Step 3:**

Then, the king said:

<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/9399b649-e5c5-4995-92ae-bf829baf9621" />


So, There is an obstacle in the middle.


<img width="420" height="240" alt="5月15日(1)" src="https://github.com/user-attachments/assets/d119e6ec-9f40-4b4c-a400-c356826cad6d" />




**Step 4:**

The other two king’s commands will also appear as the game progresses.

<img width="2148" height="924" alt="image" src="https://github.com/user-attachments/assets/da12cbf6-cacc-4552-a67f-3f4683f683b9" />

<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/1d614dfe-d318-46c5-b529-93898e218bd4" />


**Step 5:**

The game is played between the player and an AI opponent. The first to reach five points wins.

After completing the game, players begin to realise that the so-called “rules” are actually determined by the king’s commands. We aim to make players aware that systems and rules which appear stable and fair are in fact designed and maintained orders. The formulation and alteration of these rules are often closely tied to the interests and intentions of those in power.

<img width="5712" height="3213" alt="b38faed7-2e08-463b-b6db-f93b020b9e85 (1)" src="https://github.com/user-attachments/assets/67167576-cfd4-46f5-b1c0-5012855c3b21" />


## Design Documentation
### Conceptual Structure：
We transitioned from keyboard-based controls to hand gesture control to avoid limiting interaction to traditional button inputs. Players control the game using sensors attached to their hands. The system utilizes the MPU-6050 to detect hand tilt angles, transmitting this data to Unity via an Arduino. Simultaneously, LEDs on the back of the hand visually display the detected direction in real-time, making input actions visible. This design requires players to maintain continuous hand posture for control, emphasizing physical engagement and motion-based control over simple button presses.


### Interation and Design
**· Arduino (made by Yisong ZHAO, Yifei Ni)**

In the early stages of interaction design, we first conducted simple code tests using several small LED lights. By illuminating lights at different positions, we verified whether sensor data could be read correctly. \
//MPU-6050 code reading tutorial source:https://www.youtube.com/watch?v=wTfSfhjhAU0&t=16s

<img width="1649" height="956" alt="image" src="https://github.com/user-attachments/assets/50768f18-6d3a-49f0-8dd7-236260a15d98" />


During testing, we found that while individual LEDs can provide basic visual feedback, directional expression remains insufficiently clear and the overall effect is relatively simple. However, we successfully connected up, down, left, and right data to the LED lights.

<img width="426" height="240" alt="image" src="https://github.com/user-attachments/assets/ba2f3ed9-f37e-47b4-9bd6-73c9dcf4cb98" />

<img width="426" height="240" alt="image" src="https://github.com/user-attachments/assets/160346b0-6e89-472a-b9d0-57ece442efd6" />

To enhance directional information clarity and improve visual presentation, we ultimately chose to use an RGB LED dot matrix to replace individual LEDs. This allows changes in hand movements to be displayed in a more direct and dynamic way. To achieve this effect, we employed an 8×8 WS2812 RGB LED dot matrix module (totaling 64 LEDs) and connected it to an Arduino. Since the LED matrix requires stable data and power connections, we first connected the module's power (5V), ground (GND), and data input pins to corresponding wires. We then connected the data lines to the Arduino's digital output pins, completing the hardware setup.

<img width="4032" height="2268" alt="image" src="https://github.com/user-attachments/assets/a48af469-65a4-4a61-836f-a85671e690e4" />


After completing the hardware connections, we began designing patterns within the dot matrix. To more conveniently control the position and color of each LED, we referenced relevant tutorials and used an Excel plugin to set the RGB values for each point within the grid. This approach allowed us to first sketch the directional arrow pattern in the table, then copy the generated code into the Arduino program. Not only did this enable more intuitive pattern design, but it also allowed us to quickly adjust the arrow's shape and display effect. Ultimately, the LED dot matrix can display different arrows based on the tilt direction of the wrist, providing clear visual feedback of the player's movements.
// WS2812 RGB LED Array tutorial: https://projecthub.arduino.cc/Murrayman/excel-for-ws2812-rgb-led-array-animations-4f43fa

<img width="2559" height="1467" alt="image" src="https://github.com/user-attachments/assets/6ac45d3a-12f0-4b87-98b0-9e289e939e0a" />

**-Up arrow-**

<img width="2559" height="1467" alt="image" src="https://github.com/user-attachments/assets/1fa5b131-4149-43ea-a309-7d80eaa67080" />

**-Down arrow-**

<img width="428" height="240" alt="5月15日" src="https://github.com/user-attachments/assets/db06a6c4-605a-42da-8f93-4a9bffeed938" />

**-Final Effect Display**





**· Connect Arduino to Unity (made by Yifei Ni)**

I connected the Arduino to Unity using serial communication: the Arduino sends sensor data, Unity sets the COM port and serial rate, and then a Paddle script reads the data to control object movement.

<img width="2048" height="537" alt="image" src="https://github.com/user-attachments/assets/3d8f685a-0bea-4073-97f9-dd97462b2f9d" />



**· Unity (Qiuye Zhu，Yisong Zhao)**\
Our team modified Unity's three layers:\
1.Input Layer: The original game used keyboard input to control the platform, while we switched to Arduino input, using wrist movements up and down to control the platform.\
2.Rule Layer: While the original game features fixed and stable rules, we introduced the concept of a RuleManager based on the theme that rules are human-made. This system randomly alters rules during gameplay—such as making the ball move unpredictably, inverting platform controls, or adding obstacles—so players cannot predict when rules will change.

<img width="1755" height="1011" alt="image" src="https://github.com/user-attachments/assets/3df9b49e-27d0-42fe-b4d0-cf6e49d05097" />


3.Gameplay Layer: To enhance the game's appeal, we've introduced obstacles that move vertically at the center of the screen, thereby increasing the game's playability.

<img width="1919" height="1031" alt="image" src="https://github.com/user-attachments/assets/5ec0f123-4818-4dbe-a82f-93934d9f5665" />

<img width="718" height="308" alt="image" src="https://github.com/user-attachments/assets/74023b23-89ca-4aaa-b749-cb211d069c80" />

Making Process in Unity

<img width="1919" height="1034" alt="image" src="https://github.com/user-attachments/assets/3c1ed63f-017e-48ce-a1bd-30d44a26e2a8" />

<img width="1919" height="1005" alt="image" src="https://github.com/user-attachments/assets/b0bba7f2-fc6e-48b0-a64d-5cadc98360a5" />

**· UI Design (Yisong Zhao，Qiuye Zhu)**
We used Figma to design the game’s UI visuals

<img width="2256" height="1280" alt="image" src="https://github.com/user-attachments/assets/cc8adbd7-cff5-46e8-9b0a-cea17870041e" />

After entering the game, players first see the game's start screen, which briefly introduces the gameplay

<img width="1161" height="660" alt="image" src="https://github.com/user-attachments/assets/2d55fa33-b46d-4ee3-8d09-a9783c37ab1f" />

After clicking START, the game's background story (the mentioned fairy tale) appears, giving players a brief understanding of the game's concept.

<img width="1162" height="662" alt="image" src="https://github.com/user-attachments/assets/1795b4e4-471b-468a-bb03-d743c36a3b92" />

<img width="2049" height="596" alt="image" src="https://github.com/user-attachments/assets/d524696b-6d64-4cc6-a479-fefc6beda7f3" />

Press the SPACE or left-click the mouse to begin the game.

Meanwhile, during gameplay, rules will randomly change. When changes occur, UI prompts will appear to alert players to upcoming rule alterations, allowing them to experience directly how the rules are human-made.

<img width="1194" height="512" alt="image" src="https://github.com/user-attachments/assets/89c3faac-e178-46ad-ab77-54746339f8ed" />

<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/03c837f8-fe36-4187-aba7-9c1aa921309a" />

<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/f871dfaa-09a5-4d88-b6d6-2dfa06b53370" />

**· 3D printing (made by Yisong ZHAO)**

By 3D printing the shell and integrating a strap structure, we created a wearable interactive device that directly translates the player's hand movements into game controls.

<img width="2029" height="1255" alt="image" src="https://github.com/user-attachments/assets/ffa1f88f-e616-4cce-bedb-9e8240fbde07" />

<img width="2560" height="1389" alt="image" src="https://github.com/user-attachments/assets/3ec18340-2156-48c3-947d-da9978a5465b" />

<img width="2276" height="1280" alt="image" src="https://github.com/user-attachments/assets/969a177c-63ec-4e9b-a273-d95ccbf87d1f" />

##  User feedback
During the demo, many students played the game and provided feedback:
1. The gameplay mechanics felt somewhat confusing (so we changed the original approach of no in-game prompts and sudden rule changes to include UI prompts before rule adjustments, improving the player experience).
2. The ball's movement trajectory was too fast (we've adjusted the relevant parameters by modifying the ball's maximum speed value:
public float maxBallSpeed = 30f; changed to public float maxBallSpeed = 20f;)
3. Some students didn't fully grasp our original game concept (initially, our theory centered on whether rules are inherently correct? We then refined the game's core idea, shifting from the divergent concept that rules can be altered to the convergent focus that rule creation and modification are often closely tied to the interests and intentions of those in power and decision-makers).

##  Critical reflection: 

##  File: 
· Excel for LED Pattern Settings Plugin: https://github.com/YisongZhaoEsong/Hidden-Bites/blob/main/LED_Utility.xlsm
· Arduino File: https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/CONTROLLLLLLLLLLnocite/CONTROLLLLLLLLLLnocite.ino \
· SerialController: https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/Assets/Scripts/SerialController.cs \
· 3D printing File: https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/led.3mf \
· Unity Center partition: https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/Assets/Scripts/MiddlePaddleMover.cs \
· Unity Rule Change UI: https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/Assets/Scripts/RuleManager.cs & https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/Assets/Scripts/RuleUI.cs \
· Unity Paddle moves up and down in reverse: https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/Assets/Scripts/Player/Paddle.cs \
· Unity Ball moves randomly: https://git.arts.ac.uk/y-ni0320251/TeamWork-CCI/blob/main/Assets/Scripts/World/Ball.cs 

All Project Assets and Development Repository: https://github.com/YisongZhaoEsong/Symmetry-Kingdom.git

##  Reference:
Schoeffler, M. (2017) Tutorial: Gyroscope and Accelerometer (GY-521/MPU6050) with Arduino | UATS A&S #12. YouTube. Available at: https://www.youtube.com/watch?v=wTfSfhjhAU0&t=16s (Accessed: 20 February 2026). 

Hacktuber (n.d.) $1 Aliexpress 8x8 RGB LED Matrix with WS2812B is AWESOME! YouTube. Available at: https://www.youtube.com/watch?v=NmleOEQ3YUc (Accessed: 20 February 2026).

Murray, M. (2021) Excel for WS2812 RGB LED Array Animations. Arduino Project Hub. Available at: https://projecthub.arduino.cc/Murrayman/excel-for-ws2812-rgb-led-array-animations-4f43fa (Accessed: 17 February 2026).


