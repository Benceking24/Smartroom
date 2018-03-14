#include<ESP8266WiFi.h>
#include<PubSubClient.h>
#include <Servo.h>

//======  GPIO  ======//
#define Livingroom_Lamp_1_PIN 16// D0 16
#define Livingroom_Lamp_2_PIN 5// D1 5
#define Livingroom_Cooler_PIN 4// D2 4
#define Livingroom_Heater_PIN 0// D3 0
#define Livingroom_Window_L_PIN 2// D4 2
#define Livingroom_Window_R_PIN 14// D5 14 
#define Livingroom_Mood_R_PIN 12// D6 12
#define Livingroom_Mood_G_PIN 13// D7 13
#define Livingroom_Mood_B_PIN 15// D8 15
// RX 3
// TX 1
// SD2 9
// SD3 10

//======  Nappali változók  ======//  
bool Livingroom_Lamp_1;
bool Livingroom_Lamp_2;
bool Livingroom_Cooler;
int Livingroom_Window;
int Livingroom_Heater;
int Livingroom_Shades;
int Livingroom_Mood_R;
int Livingroom_Mood_G;
int Livingroom_Mood_B;
unsigned long currentMilis = 0;
unsigned long servo_Milis = 0;
int servo_Interval = 1000;

//======  Konfiguráció  ======//
//const char* ssid = "kibu-guest";
const char* ssid = "kibu";
//const char* ssid = "SmartRoom";
//const char* password = "kiburaday30";
const char* password = "acdcabbaedda2";
//const char* password = "almakamion";
//const char* mqtt_server = "192.168.80.1";
const char* mqtt_server = "iot.office.kibu.hu";
const int mqttPort = 1883;
const char* mqttUser = "";
const char* mqttPassword = "";
bool debug_mode = false;

WiFiClient wifiClient;
PubSubClient client(wifiClient);
Servo servoL;
Servo servoR;
long lastMsg = 0;
char* msg;
int value = 0;

//======  Wifi  ======//
void setup_wifi() {
  Serial.print("Connecting to: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//======  Kimenetek feldolgozása  ======//
void Bool_Toggle(int PIN_Number,char* message){
    int value = message[0]-'0';

    if(value==0){
        digitalWrite(PIN_Number, HIGH);
      }
      else if(value==1){
        digitalWrite(PIN_Number, LOW);
      }
}
      
void Value_Change(int PIN_Number, char* message){
    int value = atoi(message);
    analogWrite(PIN_Number, map(value,0,255,0,1024));
}

void ErrorStream(char* ErrorDescription){
    client.publish("Config_Error",ErrorDescription);
}

//======  Servo timing  ======//
void servoMove (int destination, int L_PIN_Number, int R_PIN_Number){
  servoL.attach(L_PIN_Number);
  servoL.write(destination);
  servoR.attach(R_PIN_Number);
  servoR.write(180-destination);
}

void servo_Update(int destination, int L_PIN_Number, int R_PIN_Number) {
  if (currentMilis - servo_Milis >= servo_Interval) {
      servoMove(destination,L_PIN_Number,R_PIN_Number);
    servo_Milis += servo_Interval;
  }
}

//======  MQTT Callback  ======//
void callback(char* topic, byte* payload, unsigned int length) {
   /*DEBUG MODE
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    }
    Serial.println();*/

  payload[length] = '\0';
  String strTopic = String((char*)topic);
  msg = (char*)payload;

  if(strTopic == "Neumann/SmartRoom/Livingroom/Lamp/1"){
      if(msg[0]=='0'){msg[0]='1';}else if(msg[0]=='1'){msg[0]='0';}
      Livingroom_Lamp_1 = msg[0];
      Bool_Toggle(Livingroom_Lamp_1_PIN, msg);
  }
  else if(strTopic == "Neumann/SmartRoom/Livingroom/Lamp/2"){
      
      if(msg[0]=='0'){msg[0]='1';}else if(msg[0]='1'){msg[0]='0';}
      Livingroom_Lamp_2 = msg[0];
      Bool_Toggle(Livingroom_Lamp_2_PIN, msg);
  }
  else if(strTopic == "Neumann/SmartRoom/Livingroom/Cooler"){
      Bool_Toggle(Livingroom_Cooler_PIN, msg);
      Livingroom_Cooler = msg;
  }
  else if(strTopic == "Neumann/SmartRoom/Livingroom/Heater"){
      Bool_Toggle(Livingroom_Heater_PIN, msg);
      Livingroom_Heater = msg[0]-'0';
  }
  else if(strTopic == "Neumann/SmartRoom/Livingroom/Window"){
      if(msg[0]=='0'){
              Livingroom_Window = 15;
        }
        else if( msg[0]=='1'){
            Livingroom_Window=165;
          }
              servo_Update(Livingroom_Window,Livingroom_Window_L_PIN,Livingroom_Window_R_PIN);
  }
  else if(strTopic == "Neumann/SmartRoom/Livingroom/Mood/R"){
      Value_Change(Livingroom_Mood_R_PIN, msg);
      Livingroom_Mood_R = msg[0]-'0';
  }
  else if(strTopic == "Neumann/SmartRoom/Livingroom/Mood/G"){
      Value_Change(Livingroom_Mood_G_PIN, msg);
      Livingroom_Mood_G = msg[0]-'0';
  }
  else if(strTopic == "Neumann/SmartRoom/Livingroom/Mood/B"){
      Value_Change(Livingroom_Mood_B_PIN, msg);
      Livingroom_Mood_B = msg[0]-'0';
  }
  else{
    Serial.println("Unknown topic: ");
    Serial.print(strTopic);
    Serial.println("Value: ");
    Serial.println(msg); 
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "SmartroomOutputESP-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe("Neumann/SmartRoom/Livingroom/Lamp/1");   
      client.loop();
      client.subscribe("Neumann/SmartRoom/Livingroom/Lamp/2");
      client.loop();
      client.subscribe("Neumann/SmartRoom/Livingroom/Cooler");
      client.loop();
      client.subscribe("Neumann/SmartRoom/Livingroom/Heater");
      client.loop();
      client.subscribe("Neumann/SmartRoom/Livingroom/Window");
      client.loop();
      client.subscribe("Neumann/SmartRoom/Livingroom/Mood/R");
      client.loop();
      client.subscribe("Neumann/SmartRoom/Livingroom/Mood/G");
      client.loop();
      client.subscribe("Neumann/SmartRoom/Livingroom/Mood/B");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
//======  Fő futás  ======//
void setup() {
  Serial.begin(9600);
  pinMode(Livingroom_Lamp_1_PIN, OUTPUT);
  pinMode(Livingroom_Lamp_2_PIN, OUTPUT);
  pinMode(Livingroom_Cooler_PIN, OUTPUT);
  pinMode(Livingroom_Heater_PIN, OUTPUT);
  pinMode(Livingroom_Window_L_PIN, OUTPUT);
  pinMode(Livingroom_Window_R_PIN, OUTPUT);
  pinMode(Livingroom_Mood_R_PIN, OUTPUT);
  pinMode(Livingroom_Mood_G_PIN, OUTPUT);
  pinMode(Livingroom_Mood_B_PIN, OUTPUT);
  setup_wifi();
  client.setServer(mqtt_server,mqttPort);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
    }
  client.loop();
  currentMilis = millis();
}
