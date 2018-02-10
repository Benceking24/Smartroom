#include<ESP8266WiFi.h>
#include<PubSubClient.h>
#include<DHT.h>
#define DHTTYPE DHT22

//======  Nappali változók  ======//
int Livingroom_Temperature;
float Livingroom_Humidity;
bool Livingroom_Ambient;
bool Livingroom_Smoke;
bool Livingroom_Motion;

int Livingroom_Temperature_Interval;
int Livingroom_Humidity_Interval;
int Livingroom_Ambient_Interval;
int Livingroom_Smoke_Interval;
int Livingroom_Motion_Interval;

//======  Bejárat változók  ======//
int Frontyard_Temperature;
int Frontyard_Humidity;
bool Frontyard_Ambient;
bool Frontyard_Motion;

int Frontyard_Temperature_Interval;
int Frontyard_Humidity_Interval;
int Frontyard_Ambient_Interval;
int Frontyard_Motion_Interval;

//======  GPIO  ======//
#define Livingroom_TempHum_PIN 16 // D0 16
#define Livingroom_Ambient_PIN 5  // D1 5
#define Livingroom_Smoke_PIN 4    // D2 4
#define Livingroom_Motion_PIN 0   // D3 0
#define Frontyard_Doorlock_PIN 2  // D4 2
#define Frontyard_TempHum_PIN 14  // D5 14 
#define Frontyard_Ambient_PIN 5   // D6 12
#define Frontyard_Motion_PIN 13   // D7 13
#define Frontyard_Dumpster_PIN 15 // D8 15
// RX 3
// TX 1
#define Frontyard_Grass_PIN 9     // SD2 9
#define Frontyard_Rain_PIN 10     // SD3 10

//======  Konfiguráció  ======//
const char* ssid = "kibu-guest";
const char* password = "raday30";
const char* mqtt_server = "192.168.1.20";
const int mqttPort = 1883;
const char* mqttUser = "Smartroom";
const char* mqttPassword = "kibu";

DHT dht(Livingroom_TempHum_PIN,DHTTYPE);
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

  if(strTopic == "Config/Intervals"){
        /*Tömböt nem tudok mqtt-n küldeni csak kódolással és dekódolással
         *Adat folyam falytája? 
        Livingroom_Temperature_Interval;
        Livingroom_Humidity_Interval;
        Livingroom_Ambient_Interval;
        Livingroom_Smoke_Interval;
        Livingroom_Motion_Interval;*/
  }
  else{
    Serial.println("Unknown topic: ");
    Serial.print(strTopic);
    Serial.println("Value: ");
    Serial.println((char*)payload); 
  }

  if (strTopic == "audio/home/bedroom/title") {
    Serial.println("Found a title update");
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "SmartroomInputESP-";
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


//======  Szenzorok kiolvasása  ======//
void Livingroom_TemperatureRead(){
    Livingroom_Temperature = dht.readTemperature();
    client.publish("Livingroom/Temperature", String(Livingroom_Temperature).c_str(), true);
}

void Livingroom_HumidityRead(){
    Livingroom_Humidity = dht.readHumidity();
    client.publish("Livingroom/Humidity", String(Livingroom_Humidity).c_str(), true );
}
  
void Livingroom_AmbientRead(){
    Livingroom_Ambient = digitalRead(Livingroom_Ambient_PIN);
    //0 ha világos, 1 ha sötét
    if(Livingroom_Ambient==1){
      client.publish("Livingroom/Ambient","0");
    }
    else if(Livingroom_Ambient==0){
      client.publish("Livingroom/Ambient","1");
    } 
} 

void Livingroom_SmokeRead(){
    Livingroom_Smoke = digitalRead(Livingroom_Smoke_PIN);
    client.publish("Livingroom/Smoke", String(Livingroom_Smoke).c_str(), true);
}
  
void Livingroom_MotionRead(){
    Livingroom_Motion = digitalRead(Livingroom_Motion_PIN);
    if(Livingroom_Motion==1){
      client.publish("Livingroom/Ambient","1");
    }
    else if(Livingroom_Motion==0){
      client.publish("Livingroom/Ambient","0");
    } 
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
