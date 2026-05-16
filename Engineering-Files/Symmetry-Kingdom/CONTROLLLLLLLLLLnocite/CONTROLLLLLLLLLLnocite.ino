//MPU-6050 code Learn from： https://www.youtube.com/watch?v=wTfSfhjhAU0&t=16s
//led effect Learn from：https://www.youtube.com/watch?v=NmleOEQ3YUc
//led 灯珠设置：https://projecthub.arduino.cc/Murrayman/excel-for-ws2812-rgb-led-array-animations-4f43fa

#include "Wire.h" // Communicate with I2C devices.

const int MPU_ADDR = 0x68; // Define I2C address

//Data read by the sensor
int16_t accelerometer_x, accelerometer_y, accelerometer_z; // variables for accelerometer raw data
int16_t gyro_x, gyro_y, gyro_z; // variables for gyro raw data
int16_t temperature; // variables for temperature data

//Define pins and LED arrays
#define LED_LB 4
#define LED_RB 5
#define LED_RT 6
#define LED_LT 7
#define WS2812_pin 8
#define numberOfLEDs 64 // total number of RGB LEDs [256]
byte RGB[192]; //for color
int h=0;

//converts int16 to string and they will have the same length
char tmp_str[7]; 
char* convert_int16_to_str(int16_t i) { 
  sprintf(tmp_str, "%6d", i);
  return tmp_str;
}

//An RGB declaration(function to drive LEDs)
void RGB_update(int LED, byte RED, byte GREEN, byte BLUE);

//Insert the two-dimensional coordinates into the array of the light strip.
void mapLEDXY(int x, int y, byte RED, byte  GREEN, byte BLUE) {
  int RGBlocation = 0; 
 RGBlocation = x + y * 8; 
 
  RGB[RGBlocation * 3] = BLUE;
  RGB[RGBlocation * 3 + 1] = RED;
  RGB[RGBlocation * 3 + 2] = GREEN;
}
//clear
void clearLEDs() {
  memset(RGB, 0, sizeof(RGB));
}

//Create an upward arrow icon
void upArrow() {
  clearLEDs();
  mapLEDXY(0,3,255,255,255);mapLEDXY(0,4,255,255,255);mapLEDXY(1,2,255,255,255);mapLEDXY(1,3,255,255,255);mapLEDXY(2,1,255,255,255);mapLEDXY(2,2,255,255,255);mapLEDXY(3,0,255,255,255);mapLEDXY(3,1,255,255,255);mapLEDXY(3,2,255,255,255);mapLEDXY(3,3,255,255,255);mapLEDXY(3,4,255,255,255);mapLEDXY(3,5,255,255,255);mapLEDXY(3,6,255,255,255);mapLEDXY(3,7,255,255,255);\
mapLEDXY(4,0,255,255,255);mapLEDXY(4,1,255,255,255);mapLEDXY(4,2,255,255,255);mapLEDXY(4,3,255,255,255);mapLEDXY(4,4,255,255,255);mapLEDXY(4,5,255,255,255);mapLEDXY(4,6,255,255,255);mapLEDXY(4,7,255,255,255);mapLEDXY(5,1,255,255,255);mapLEDXY(5,2,255,255,255);mapLEDXY(6,2,255,255,255);mapLEDXY(6,3,255,255,255);mapLEDXY(7,3,255,255,255);mapLEDXY(7,4,255,255,255);
  RGB_update(-1, 0, 0, 0);

}

//Create a down arrow icon
void downArrow() {
  clearLEDs();
  mapLEDXY(0,3,255,255,255);mapLEDXY(0,4,255,255,255);mapLEDXY(1,4,255,255,255);mapLEDXY(1,5,255,255,255);mapLEDXY(2,5,255,255,255);mapLEDXY(2,6,255,255,255);mapLEDXY(3,0,255,255,255);mapLEDXY(3,1,255,255,255);mapLEDXY(3,2,255,255,255);mapLEDXY(3,3,255,255,255);mapLEDXY(3,4,255,255,255);mapLEDXY(3,5,255,255,255);mapLEDXY(3,6,255,255,255);mapLEDXY(3,7,255,255,255);\
  mapLEDXY(4,0,255,255,255);mapLEDXY(4,1,255,255,255);mapLEDXY(4,2,255,255,255);mapLEDXY(4,3,255,255,255);mapLEDXY(4,4,255,255,255);mapLEDXY(4,5,255,255,255);mapLEDXY(4,6,255,255,255);mapLEDXY(4,7,255,255,255);mapLEDXY(5,5,255,255,255);mapLEDXY(5,6,255,255,255);mapLEDXY(6,4,255,255,255);mapLEDXY(6,5,255,255,255);mapLEDXY(7,3,255,255,255);mapLEDXY(7,4,255,255,255);
  RGB_update(-1, 0, 0, 0);

}

//Turn off the lights
void turnOff(){
  clearLEDs();
  RGB_update(-1, 0, 0, 0);
}

//Initialization phase
void setup() {
  Serial.begin(9600);
  pinMode(LED_LB,OUTPUT);
  pinMode(LED_RB,OUTPUT);
  pinMode(LED_RT,OUTPUT);
  pinMode(LED_LT,OUTPUT);
  digitalWrite(LED_LB,LOW);
  digitalWrite(LED_RB,LOW);
  digitalWrite(LED_RT,LOW);
  digitalWrite(LED_LT,LOW);


  Wire.begin();
  // Begins a transmission to the I2C slave (GY-521 board)
  Wire.beginTransmission(MPU_ADDR); 
  // PWR_MGMT_1 register
  Wire.write(0x6B); 
  // set to zero (wakes up the MPU-6050)
  Wire.write(0); 
  Wire.endTransmission(true);
  //WS2812
  pinMode(WS2812_pin, OUTPUT);
  turnOff();

}
void loop() {
  Wire.beginTransmission(MPU_ADDR);
  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.write(0x3B); 
  // the parameter indicates that the Arduino will send a restart. As a result, the connection is kept active.
  Wire.endTransmission(true); 
  // request a total of 7*2=14 registers
  Wire.requestFrom(MPU_ADDR, 14); 
  if(Wire.available()<14 ) return;
  
  // two registers are read and stored in the same variable
  accelerometer_x = Wire.read()<<8 | Wire.read(); // reading registers: 0x3B (ACCEL_XOUT_H) and 0x3C (ACCEL_XOUT_L)
  accelerometer_y = Wire.read()<<8 | Wire.read(); // reading registers: 0x3D (ACCEL_YOUT_H) and 0x3E (ACCEL_YOUT_L)
  accelerometer_z = Wire.read()<<8 | Wire.read(); // reading registers: 0x3F (ACCEL_ZOUT_H) and 0x40 (ACCEL_ZOUT_L)
  temperature = Wire.read()<<8 | Wire.read(); // reading registers: 0x41 (TEMP_OUT_H) and 0x42 (TEMP_OUT_L)
  gyro_x = Wire.read()<<8 | Wire.read(); // reading registers: 0x43 (GYRO_XOUT_H) and 0x44 (GYRO_XOUT_L)
  gyro_y = Wire.read()<<8 | Wire.read(); // reading registers: 0x45 (GYRO_YOUT_H) and 0x46 (GYRO_YOUT_L)
  gyro_z = Wire.read()<<8 | Wire.read(); // reading registers: 0x47 (GYRO_ZOUT_H) and 0x48 (GYRO_ZOUT_L)
  
  // print out data
  Serial.print(convert_int16_to_str(accelerometer_x));
  Serial.print('\t');

  Serial.print(convert_int16_to_str(accelerometer_y));
  Serial.print('\t');
  Serial.print(convert_int16_to_str(accelerometer_z));
  Serial.print('\t');
  Serial.print(convert_int16_to_str(gyro_x));
  Serial.print('\t');
  Serial.print(convert_int16_to_str(gyro_y));
  Serial.print('\t');
  Serial.print(convert_int16_to_str(gyro_z));
  Serial.println();
  
 // Make a judgment based on the direction of inclination.
 if(accelerometer_y<-3000){
   digitalWrite(LED_LB,HIGH);
   digitalWrite(LED_RB,HIGH);
   digitalWrite(LED_RT,LOW);
   digitalWrite(LED_LT,LOW);

   upArrow();

 } else if(accelerometer_y > 3000){
   digitalWrite(LED_LB,LOW);
   digitalWrite(LED_RB,LOW);
   digitalWrite(LED_RT,HIGH);
   digitalWrite(LED_LT,HIGH);

   downArrow() ;

 }else if ( accelerometer_x > 3000 ){
   digitalWrite(LED_LB,LOW);
   digitalWrite(LED_RB,HIGH);
   digitalWrite(LED_RT,HIGH);
   digitalWrite(LED_LT,LOW);

   turnOff();
   
}else if ( accelerometer_x < -3000){
   digitalWrite(LED_LB,HIGH);
   digitalWrite(LED_RB,LOW);
   digitalWrite(LED_RT,LOW);
   digitalWrite(LED_LT,HIGH);

   turnOff();

}else{
   digitalWrite(LED_LB,LOW);
   digitalWrite(LED_RB,LOW);
   digitalWrite(LED_RT,LOW);
   digitalWrite(LED_LT,LOW);

   turnOff();


 }
  // delay
  delay(1000);
}

//Send the color to the WS2812
void RGB_update(int LED, byte RED, byte GREEN, byte BLUE) {
  // LED is the LED number starting with 0
  // RED, GREEN, BLUE is the brightness 0..255 setpoint for that LED
  //local variables here to speed up pinWrites
  byte ExistingPort, WS2812pinHIGH;

  if (LED >= 0) { //map the REG GREEN BLUE Values into the RGB[] array
    RGB[LED * 3] = GREEN;
    RGB[LED * 3 + 1] = RED;
    RGB[LED * 3 + 2] = BLUE;
  }

 //kill the interrupts while we send the bit stream out...
  noInterrupts();
  // save the status of the entire PORT B - let's us write to the entire port without messing up the other pins on that port
  ExistingPort = PORTB; 
   //this gives us a byte we can use to set the whole PORTB with the WS2812 pin HIGH
  WS2812pinHIGH = PORTB | 1;
  //total bytes in the LED string
  int bitStream = numberOfLEDs * 3;

  //This for loop runs through all of the bits (8 at a time) to set the WS2812 pin ON/OFF times
  for (int i = bitStream - 1; i >= 0; i--) {

    //bit 7  first, set the pin HIGH - it always goes high regardless of a 0/1
    PORTB = WS2812pinHIGH;

    //here's the tricky part, check if the bit in the byte is high/low then right that status to the pin
    // (RGB[i] & B10000000) will strip away the other bits in RGB[i], so here we'll be left with B10000000 or B00000000
    // then it's easy to check if the bit is high or low by AND'ing that with the bit mask ""&& B10000000)"" this gives 1 or 0
    // if it's a 1, we'll OR that with the Existing port, thus keeping the pin HIGH, if 0 the pin is written LOW
    PORTB = ((RGB[i] & B10000000) && B10000000) | ExistingPort;
    //these are NOPS - these let us delay clock cycles for more precise timing
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    //okay, here we know we have to be LOW regardless of the 0/1 bit state
    PORTB = ExistingPort;
    //minimum LOW time for pin regardless of 0/1 bit state
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");


    // then do it again
    PORTB = WS2812pinHIGH;//bit 6
    PORTB = ((RGB[i] & B01000000) && B01000000) | ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    PORTB = ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");

    PORTB = WS2812pinHIGH;//bit 5
    PORTB = ((RGB[i] & B00100000) && B00100000) | ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    PORTB = ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");

    PORTB = WS2812pinHIGH;//bit 4
    PORTB = ((RGB[i] & B00010000) && B00010000) | ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    PORTB = ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");

    PORTB = WS2812pinHIGH;//bit 3
    PORTB = ((RGB[i] & B00001000) && B00001000) | ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    PORTB = ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");

    PORTB = WS2812pinHIGH;//bit 2
    PORTB = ((RGB[i] & B00000100) && B00000100) | ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    PORTB = ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");

    PORTB = WS2812pinHIGH;//bit 1
    PORTB = ((RGB[i] & B00000010) && B00000010) | ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    PORTB = ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");

    PORTB = WS2812pinHIGH;//bit 0
    __asm__("nop\n\t");//on this last bit, the check is much faster, so had to add a NOP here
    PORTB = ((RGB[i] & B00000001) && B00000001) | ExistingPort;
    __asm__("nop\n\t""nop\n\t""nop\n\t""nop\n\t""nop\n\t");
    PORTB = ExistingPort;//the FOR Loop uses clock cycles that we can use instead of the NOPS
  }

  interrupts();//enable the interrupts
}