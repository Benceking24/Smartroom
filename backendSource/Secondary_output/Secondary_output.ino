#include<ESP8266WiFi.h>
#include<PubSubClient.h>
#include <Servo.h>
#include <Stepper.h>

//======  GPIO  ======//
#define Frontyard_Sprinkler_PIN 16// D0 16
#define Livingroom_Shades_1_PIN 5// D1 5
#define Livingroom_Shades_2_PIN 4// D2 4
#define Livingroom_Shades_3_PIN 0// D3 0
#define Livingroom_Shades_4_PIN 2// D4 2
#define Frontyard_Doorlock_PIN 14// D5 14 
// D6 12
// D7 13
// D8 15
// RX 3
// TX 1
// SD2 9
// SD3 10

//======  Nappali változók  ======//  
int Livingroom_Shades;

//======  Bejárat változók  ======//
bool Frontyard_Doorlock;
bool Frontyard_Sprinkler;
const int stepsPerRevolution = 48;
int stepCount = 0;
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
Servo servo;
Stepper stepper(stepsPerRevolution, Livingroom_Shades_1_PIN, Livingroom_Shades_2_PIN, Livingroom_Shades_3_PIN, Livingroom_Shades_4_PIN);
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
    Serial.println("value==0");
    Serial.println(value==0);
    Serial.println("value==1");
    Serial.println(value==1);

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
void servoMove (int destination, int PIN_Number){
  servo.attach(PIN_Number);
  servo.write(destination);
}

void servo_Update(int destination, int PIN_Number) {
  if (currentMilis - servo_Milis >= servo_Interval) {
      servoMove(destination, PIN_Number);
    servo_Milis += servo_Interval;
  }
}

//======  MQTT Callback  ======//
void callback(char* topic, byte* payload, unsigned int length) {
   //DEBUG MODE
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    }
    Serial.println();

  payload[length] = '\0';
  String strTopic = String((char*)topic);
  msg = (char*)payload;

  if(strTopic == "Neumann/SmartRoom/Livingroom/Shades"){
      int destination = map(atoi(msg),0,100,0,48);
      int neededStep;
      if(stepCount<destination){neededStep=stepCount-destination;}
      else if(stepCount>destination){neededStep=destination-stepCount;}
      stepper.step(neededStep);            
  }
  else if(strTopic == "Neumann/SmartRoom/Frontyard/Doorlock"){
      if(msg[0]=='0'){
                    Frontyard_Doorlock = 15;
              }
              else if( msg[0]=='1'){
                  Frontyard_Doorlock=165;
                }
                    servo_Update(Frontyard_Doorlock,Frontyard_Doorlock_PIN);

  }
  else if(strTopic == "Neumann/SmartRoom/Frontyard/Sprinkler"){
      if(msg[0]=='0'){msg[0]='1';}else if(msg[0]=='1'){msg[0]='0';}
      Frontyard_Sprinkler = msg[0];
      Bool_Toggle(Frontyard_Sprinkler_PIN, msg);
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
      client.subscribe("Neumann/SmartRoom/Livingroom/Shades");   
      client.loop();
      client.subscribe("Neumann/SmartRoom/Frontyard/Sprinkler");
      client.loop();
      client.subscribe("Neumann/SmartRoom/Frontyard/Doorlock");
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
  pinMode(Frontyard_Sprinkler_PIN, OUTPUT);
  pinMode(Livingroom_Shades_1_PIN, OUTPUT);
  pinMode(Livingroom_Shades_2_PIN, OUTPUT);
  pinMode(Livingroom_Shades_3_PIN, OUTPUT);
  pinMode(Livingroom_Shades_4_PIN, OUTPUT);
  pinMode(Frontyard_Doorlock_PIN, OUTPUT);
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
