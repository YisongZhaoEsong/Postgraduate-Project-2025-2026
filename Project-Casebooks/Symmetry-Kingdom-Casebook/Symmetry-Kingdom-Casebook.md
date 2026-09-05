## Symmetry Kingdom Casebook - Teamwork

***Embodied Interaction； Gamified Experiences； Interactive Systems***

## LLM Use Disclaimer
During the project development process, our team primarily completed the code by referencing relevant tutorials and consulting with our instructor when we encountered technical challenges. The entire project primarily relied on existing learning resources and team collaboration, without utilizing AI tools for code generation.

## Project Overview

***Video Display - https://youtu.be/2ZF1r5V5jsI***

Our team members include (Qiuye Zhu, Yisong Zhao, and Yifei Ni), and we decided to modify Pong.
In this project, we place the classic game Pong within a narrative framework titled “Symmetry Kingdom” and reconstruct its control logic based on this framework.

<img width="3224" height="1280" alt="e40c3bb8f019166b76cf7ef447da619a" src="https://github.com/user-attachments/assets/67fd2688-e0d5-4a38-935c-a9b65d1af31f" />

<img width="3224" height="1280" alt="00fbfb114444c5ae977402e178cdf339" src="https://github.com/user-attachments/assets/28370c94-50a2-4565-92c4-842375be9706" />

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

<img width="568" height="320" alt="1e47e609-531b-4dd5-8989-21874fa64cf7" src="https://github.com/user-attachments/assets/1e096054-abc1-4a9d-b173-b3197336fc92" />

<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/627d71cd-2cdf-4788-a2d5-ca8ce83d7110" />

**Step 2:**

Then, The King will issue a command, and the rules of the game will change based on the original system.

<img width="568" height="320" alt="a6c81453-b56c-44e2-b684-f918d954691c" src="https://github.com/user-attachments/assets/de42cdd0-5fc1-4411-859b-118d4f3e674d" />

The King announces:
“Now I order the addition of obstacles that block the ball’s trajectory.”

This means that the original control rule has changed.
Before, when the player moved their hand up, the paddle moved up; when the player moved down, the paddle moved down.
**Now the system reverses the control: when the player moves their hand down, the paddle moves up.**

<img width="1194" height="512" alt="image" src="https://github.com/user-attachments/assets/6619b89f-8c97-4e9e-b94d-3e378532e0bc" />



The game continues based on both the king’s new rules and the original rules - when the player moves their hand down, the paddle moves up... hand moves up, paddle moves down

<img width="426" height="240" alt="5621acd5-8613-47f2-93f9-fc9737d6e31e" src="https://github.com/user-attachments/assets/8ad7b25f-4a38-48af-9545-016baa95e9fe" />





**Step 3:**

Then, the king said:

<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/469ba909-8027-4776-9d13-0dbfb87c5142" />



So, There is an obstacle in the middle.

<img width="420" height="240" alt="5月15日(2)" src="https://github.com/user-attachments/assets/0b29b8bb-4c33-4ca1-9f56-fe68578b5111" />

**Step 4:**

The other two king’s commands will also appear as the game progresses.

<img width="2148" height="924" alt="image" src="https://github.com/user-attachments/assets/8fda9508-ffd1-4a7e-94f3-359ca6eb7b3b" />

<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/49d5c065-a01a-4138-8862-90e6dac2f587" />

**Step 5:**

The game is played between the player and an AI opponent. The first to reach five points wins.

After completing the game, players begin to realise that the so-called “rules” are actually determined by the king’s commands. We aim to make players aware that systems and rules which appear stable and fair are in fact designed and maintained orders. The formulation and alteration of these rules are often closely tied to the interests and intentions of those in power.

<img width="2219" height="1233" alt="image" src="https://github.com/user-attachments/assets/9d0050b8-dd28-40ab-b463-f5767c6da47f" />



## Design Documentation
### Conceptual Structure：
We transitioned from keyboard-based controls to hand gesture control to avoid limiting interaction to traditional button inputs. Players control the game using sensors attached to their hands. The system utilizes the MPU-6050 to detect hand tilt angles, transmitting this data to Unity via an Arduino. Simultaneously, LEDs on the back of the hand visually display the detected direction in real-time, making input actions visible. This design requires players to maintain continuous hand posture for control, emphasizing physical engagement and motion-based control over simple button presses.


### Interation and Design
**· Arduino (made by Yisong ZHAO, Yifei Ni)**

In the early stages of interaction design, we first conducted simple code tests using several small LED lights. By illuminating lights at different positions, we verified whether sensor data could be read correctly. \
//MPU-6050 code reading tutorial source:https://www.youtube.com/watch?v=wTfSfhjhAU0&t=16s

<img width="1649" height="956" alt="image" src="https://github.com/user-attachments/assets/b9a37ff4-25dc-4631-b12e-d286a16cc561" />



During testing, we found that while individual LEDs can provide basic visual feedback, directional expression remains insufficiently clear and the overall effect is relatively simple. However, we successfully connected up, down, left, and right data to the LED lights.

<img width="426" height="240" alt="b075eeee-38cc-4405-85b3-d782e726187c" src="https://github.com/user-attachments/assets/37866d3b-c074-4605-b618-eb1b9758a1a9" /> 
<img width="426" height="240" alt="9c70ce35-4203-4b7b-bfb2-88a9b43821e6" src="https://github.com/user-attachments/assets/49accea8-3cbd-42e1-b6b8-7832a8b7c1e5" />



To enhance directional information clarity and improve visual presentation, we ultimately chose to use an RGB LED dot matrix to replace individual LEDs. This allows changes in hand movements to be displayed in a more direct and dynamic way. To achieve this effect, we employed an 8×8 WS2812 RGB LED dot matrix module (totaling 64 LEDs) and connected it to an Arduino. Since the LED matrix requires stable data and power connections, we first connected the module's power (5V), ground (GND), and data input pins to corresponding wires. We then connected the data lines to the Arduino's digital output pins, completing the hardware setup.

<img width="4032" height="2268" alt="image" src="https://github.com/user-attachments/assets/e9eb50d8-64d7-42d8-906d-65c2a81b16bd" />


After completing the hardware connections, we began designing patterns within the dot matrix. To more conveniently control the position and color of each LED, we referenced relevant tutorials and used an Excel plugin to set the RGB values for each point within the grid. This approach allowed us to first sketch the directional arrow pattern in the table, then copy the generated code into the Arduino program. Not only did this enable more intuitive pattern design, but it also allowed us to quickly adjust the arrow's shape and display effect. Ultimately, the LED dot matrix can display different arrows based on the tilt direction of the wrist, providing clear visual feedback of the player's movements.
// WS2812 RGB LED Array tutorial: https://projecthub.arduino.cc/Murrayman/excel-for-ws2812-rgb-led-array-animations-4f43fa

<img width="2559" height="1467" alt="image" src="https://github.com/user-attachments/assets/b6d6ad04-ac91-47e2-a863-e5a8a5af7a32" />



**-Up arrow-**

<img width="2559" height="1467" alt="image" src="https://github.com/user-attachments/assets/be249fe5-8fac-49cc-9629-82f643ec913f" />


**-Down arrow-**

<img width="426" height="240" alt="62c380f7-3d4d-4c24-bf9c-80b00acfbf6f" src="https://github.com/user-attachments/assets/46632a08-14a1-4ce9-b9c0-76850b02506e" />


**-Final Effect Display**





**· Connect Arduino to Unity (made by Yifei Ni)**

I connected the Arduino to Unity using serial communication: the Arduino sends sensor data, Unity sets the COM port and serial rate, and then a Paddle script reads the data to control object movement.

<img width="2048" height="537" alt="image" src="https://github.com/user-attachments/assets/091e7ed6-e377-46e2-b063-8f7ffe5bb7cd" />




**· Unity (Qiuye Zhu，Yisong Zhao)**\
Our team modified Unity's three layers:\
1.Input Layer: The original game used keyboard input to control the platform, while we switched to Arduino input, using wrist movements up and down to control the platform.\
2.Rule Layer: While the original game features fixed and stable rules, we introduced the concept of a RuleManager based on the theme that rules are human-made. This system randomly alters rules during gameplay—such as making the ball move unpredictably, inverting platform controls, or adding obstacles—so players cannot predict when rules will change.

<img width="1755" height="1011" alt="image" src="https://github.com/user-attachments/assets/3d8f0be7-2aa7-4630-9b1c-fb189a718540" />



3.Gameplay Layer: To enhance the game's appeal, we've introduced obstacles that move vertically at the center of the screen, thereby increasing the game's playability.

<img width="1919" height="1031" alt="image" src="https://github.com/user-attachments/assets/740357c3-b625-44d6-854f-bb7cf2b08ebc" />

<img width="718" height="308" alt="image" src="https://github.com/user-attachments/assets/acc78254-c738-4349-8475-7b9a98603e8d" />


Making Process in Unity

<img width="1919" height="1034" alt="image" src="https://github.com/user-attachments/assets/6c49b16d-40ce-4b49-bbe6-726dbb6a792f" />

<img width="1919" height="1005" alt="image" src="https://github.com/user-attachments/assets/145e0ee3-8d6a-4b0d-aaa8-ec18c0ea8a0d" />


**· UI Design (Yisong Zhao，Qiuye Zhu)**
We used Figma to design the game’s UI visuals

<img width="2256" height="1280" alt="image" src="https://github.com/user-attachments/assets/e746a6c5-948c-422c-856c-07f2984f9467" />


After entering the game, players first see the game's start screen, which briefly introduces the gameplay

<img width="1161" height="660" alt="image" src="https://github.com/user-attachments/assets/d9f75c16-0fa5-4869-abcb-9cfdb274f271" />


After clicking START, the game's background story (the mentioned fairy tale) appears, giving players a brief understanding of the game's concept.

<img width="1162" height="662" alt="image" src="https://github.com/user-attachments/assets/94898134-9e53-4065-bcd4-d137c3a31fee" />

<img width="2049" height="596" alt="image" src="https://github.com/user-attachments/assets/661a79f2-48ac-4ea4-9e6b-e9bb1996f187" />


Press the SPACE or left-click the mouse to begin the game.

Meanwhile, during gameplay, rules will randomly change. When changes occur, UI prompts will appear to alert players to upcoming rule alterations, allowing them to experience directly how the rules are human-made.

<img width="1194" height="512" alt="image" src="https://github.com/user-attachments/assets/0531029a-8c33-42c0-b20d-074672919889" />


<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/3eba31c4-71ea-491d-b7de-541355102575" />

<img width="2154" height="924" alt="image" src="https://github.com/user-attachments/assets/d89e0310-ca99-4665-97d7-c71aeb781e9c" />


**· 3D printing (made by Yisong ZHAO)**

By 3D printing the shell and integrating a strap structure, we created a wearable interactive device that directly translates the player's hand movements into game controls.

<img width="2029" height="1255" alt="image" src="https://github.com/user-attachments/assets/b48db524-527c-4ad5-9c71-46ff21e65a62" />

<img width="2560" height="1389" alt="image" src="https://github.com/user-attachments/assets/d5cf47f2-ba81-416a-8191-9c3cd562cdc0" />

<img width="2276" height="1280" alt="image" src="https://github.com/user-attachments/assets/442a8699-6013-41f2-bc57-6f41ede834ff" />


## 💥 User test

### Testing Plan

**Before testing, I planned to test the game with five participants**

![image](https://git.arts.ac.uk/user-attachments/assets/a8ffbebe-07c2-4b03-a688-e7ce8901b852)

This mix offered familiar and objective perspectives.

**Then, I plan to use informal observation and semi-structured interviews.**

| Observation                                          | Semi-structured Interview                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1. Whether they knew how to control the game         | 1. Did you notice any changes to the rules during the game?                        |
| 2. Which parts of the game caused frequent confusion | 2. What do you think the King or the rule changes represent?                       |
| 3. At what stage they failed or chose to quit        | 3. Which part of the experience felt confusing, frustrating, or could be improved? |
|                                                      | 4. Then free to talk                                                               |

**Why I use this two methods:**

They helped me understand the user experience from different angles. 

Observation allowed me to record real-time behaviour. This was important because participants might forget details after playing. 

The semi-structured interview helped me ask key questions while keeping the conversation natural. If the interview structure was too rigid, participants might feel bored or less willing to share honestly, which would make it harder to collect useful feedback.

**I will observe participants on site and record my observations through written notes. For the interviews, I will audio-record the conversations with participants’ permission, so I can translate, review and listen back to their responses later.**

### Testing Observations

![image](https://git.arts.ac.uk/user-attachments/assets/abfdc6a3-4ab7-4b10-afbe-9454ef7203d9)

![image](https://git.arts.ac.uk/user-attachments/assets/0d433caa-181e-48ab-b824-034b0252fd13)



| Tester                                                                  | What I observed                                                                                                                             | Feedback from the interview                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Participant A: a local friend who tested the game during the exhibition | After a short trial, he understood the forearm control, but when the King’s command appeared, he paused, and the gameplay felt interrupted. | He noticed the rule changes and, after reading the project description, understood the connection between the King and real-world rule-makers. However, the pause made the gameplay feel less continuous.                                                         |
| Participant B: an exhibition visitor                                    | At first, he was not fully used to the wearable control, and after the first rule change, he quickly lost points and lost the game.         | He felt that the rule changes happened too quickly, before he had fully adapted, and that the game ended too early. He also mentioned that the Arduino wearable device felt slightly delayed.                                                                     |
| Participant C: one member of a married couple at the exhibition         | He reached game over quite early, but still showed interest in continuing the experience.                                                   | He understood that the King was controlling the rules and could connect this to real-world rule-makers. However, he also felt that ending too early reduced the chance to experience later rule changes.                                                          |
| Participant D: a friend outside UAL CCI                                 | She had a smooth experience at the beginning, but as more rule changes appeared, her understanding of the rules became less stable.         | She felt that the obstacle should only appear after being introduced by the King’s command, otherwise it became confusing. She also mentioned that sometimes she could not remember the current rule, and that the Arduino wearable device felt slightly delayed. |
| Participant E: a friend outside UAL CCI                                 | Because this was a rule-changing Pong game, I observed that he also needed time to adapt at the beginning.                                  | He noticed the rule changes and understood the meaning of power behind them. However, he felt that there were too many changing elements, which created an information load and made it difficult to remember the current rule.                                   |

![image](https://git.arts.ac.uk/user-attachments/assets/b38fb7f3-ad12-443f-ac07-e7cc70c780ce)

![image](https://git.arts.ac.uk/user-attachments/assets/2cfea94f-bb91-47f3-8952-66d2c6fdce93)

![image](https://git.arts.ac.uk/user-attachments/assets/0e49fb56-1605-4074-9dc6-7fe71ed45292)


**Overall, testing showed that participants could understand the project’s core idea: rules can be made and changed by those with power. However, interruptions, sudden rule changes, early game over and too much rule information weakened the experience. Therefore, I needed to make the gameplay flow smoother and the rule reminders clearer, so players could better experience and understand the work. Based on this, I made the following changes.**


### Revision Plan

**Based on user feedback, I made the following six changes.**

| Testing Feedback                                                | My Revision                                                                                                                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rule changes happened too suddenly.                             | Added 30 seconds of normal Pong and longer transition timing.                                                                                                   |
| Users forgot active rules.                                      | Added a small rule reminder on screen.                                                                                                                          |
| Rule messages interrupted gameplay.                             | Changed click-to-continue into a 5-second automatic pause.                                                                                                      |
| Users lost too early but still wanted to continue playing.      | Added a continue-or-quit choice with one extra life.                                                                                                            |
| Obstacle appeared too early and caused confusion.               | Hid the obstacle until the King’s final command.                                                                                                                |
| Some users felt a slight delay in the Arduino wearable control. | Investigated the issue and found that the delay was caused by a hardware limitation. Therefore, no change was made in this iteration. |

**Overall**, the testing showed that participants could understand the project’s **core concept**: rules are made and changed by those in power. However, interruptions during gameplay, difficulty adapting to rule changes, early game over, and unclear rule information all weakened the overall experience. When players felt anxious or overloaded, they focused more on surviving the game than reflecting on its deeper meaning. Therefore, I needed to improve the **smoothness of the gameplay flow** and make the **rule reminders** clearer, so players could better experience, so that they can understand and reflect my research question more deeply.

Through this process, I realised that **practice-based research** should respond to users’ real experiences, rather than only following the designer’s original intention. We should not design only from the designer’s perspective, but practise **human-centred design**, using design methods to translate user feedback into specific improvements within the interactive work. By improving the **interactive experience**, players can understand the research question through a more immersive process. This kind of **bodily participation** and **gamified experience** can leave a stronger impression than simply explaining the research question through text or video, and can encourage deeper reflection.


##  File: 
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


