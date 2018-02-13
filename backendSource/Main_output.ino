#include<ESP8266WiFi.h>
#include<PubSubClient.h>

//======  GPIO  ======//
#define Livingroom_Lamp_1_PIN 16// D0 16
#define Livingroom_Lamp_2_PIN 5// D1 5
#define Livingroom_Cooler_PIN 4// D2 4
#define Livingroom_Heater_PIN 0// D3 0
#define Livingroom_Window_PIN 2// D4 2
#define Livingroom_Shades_PIN 14// D5 14 
#define Livingroom_Mood_R_PIN 12// D6 12
#define Livingroom_Mood_G_PIN 13// D7 13
#define Livingroom_Mood_B_PIN 15// D8 15
// RX 3
// TX 1
#define Frontyard_Doorlock_PIN 9// SD2 9
#define Frontyard_Sprinkler_PIN 10// SD3 10

//======  Nappali változók  ======//
bool Livingroom_Lamp_1;
bool Livingroom_Lamp_2;
bool Livinroom_Cooler;
bool Livingroom_Window;
int Livingroom_Heater;
int Livingroom_Shades;
int Livingroom_Mood_R;
int Livingroom_Mood_G;
int Livingroom_Mood_B;


//======  Bejárat változók  ======//
bool Frontyard_DoorLock;
bool Frontyard_Sprinkler;

//======  Konfiguráció  ======//
const char* ssid = "kibu-guest";
const char* password = "raday30";
const char* mqtt_server = "192.168.1.20";
const int mqttPort = 1883;
const char* mqttUser = "Smartroom";
const char* mqttPassword = "kibu";

WiFiClient wifiClient;
PubSubClient client(wifiClient);
long lastMsg = 0;
char* msg;
int value = 0;
//void GetIntervals(){}

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

//======  MQTT Callback  ======//
void callback(char* topic, byte* payload, unsigned int length) {
  /* DEBUG MODE
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

  if(strTopic == "Livingroom_Lamp_1"){
      Bool_Toggle(Livingroom_Lamp_1_PIN, payload);
      Livingroom_Lamp_1 = payload;
  }
  else if(strTopic == "Livingroom_Lamp_2"){
      Bool_Toggle(Livingroom_Lamp_2_PIN, payload);
      Livingroom_Lamp_2 = payload;
  }
  else if(strTopic == "Livingroom_Cooler"){
      Bool_Toggle(Livingroom_Cooler_PIN, payload);
      Livingroom_Cooler = payload;
  }
  else if(strTopic == "Livingroom_Heater"){
      Value_Change(Livingroom_Heater_PIN, payload);
      Livingroom_Heater = payload;
  }
  else if(strTopic == "Livingroom_Window"){
      Bool_Toggle(Livingroom_Window_PIN, payload);
      Livingroom_Window = payload;
  }
  else if(strTopic == "Livingroom_Shades"){
      Value_Change(Livingroom_Shades_PIN, payload);
      Livingroom_Shades = payload;
  }
  else if(strTopic == "Livingroom_Mood_R"){
      Value_Change(Livingroom_Mood_R_PIN, payload);
      Livingroom_Mood_R = payload;
      
  else if(strTopic == "Livingroom_Mood_G"){
      Value_Change(Livingroom_Mood_G_PIN, payload);
      Livingroom_Mood_G = payload;
  }
  else if(strTopic == "Livingroom_Mood_B"){
      Value_Change(Livingroom_Mood_B_PIN, payload);
      Livingroom_Mood_B = payload;
  }
  else if(strTopic == "Frontayrd_Doorlock"){
      Bool_Toggle(Frontayrd_Doorlock_PIN, payload);
      Frontayrd_Doorlock = payload;
  }
  else if(strTopic == "Frontayrd_Sprinkler"){
      Bool_Toggle(Frontayrd_Sprinkler_PIN, payload);
      Frontayrd_Sprinkler = payload;
  }
  else{
    Serial.println("Unknown topic: ");
    Serial.print(strTopic);
    Serial.println("Value: ");
    Serial.println((char*)payload); 
  }

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "SmartroomOutputESP-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}


//======  Kimenetek feldolgozása  ======//
void Bool_Toggle(int PIN_Number,int value){
    if(value==0){
        digitalWrite(PIN_Number, LOW);
      }
      else if(value==1){
        digitalWrite(PIN_Number, HIGH);
      }
}
      
void Value_Change(int PIN_Number, int value){
    if(value<255 && value>0){
        digitalWrite(PIN_Number, value);
    }
}

void ErrorStream(string ErrorDescription){
    client.publish("Config_Error",ErrorDescription);
}

//======  Fő futás  ======//
void setup() {
  setup_wifi();
  //client.setServer(mqtt_server,mqttPort);
  //client.setCallback(callback);
}

void loop() {
  //if (!client.connected()) {reconnect();}
  //client.loop();
}
