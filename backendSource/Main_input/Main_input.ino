#include<ESP8266WiFi.h>
#include<PubSubClient.h>
#include<DHT.h>
#define DHTTYPE DHT22

//======  GPIO  ======//
#define Livingroom_TempHum_PIN 16 // D0 16
#define Livingroom_Ambient_PIN 5  // D1 5
#define Livingroom_Smoke_PIN 4    // D2 4
#define Livingroom_Motion_PIN 0   // D3 0
#define Frontyard_Doorlock_PIN 2  // D4 2
#define Frontyard_TempHum_PIN 14  // D5 14 
#define Frontyard_Ambient_PIN 12   // D6 12
#define Frontyard_Motion_PIN 13   // D7 13
#define Frontyard_Dumpster_PIN 15 // D8 15
// RX 3
// TX 1
#define Frontyard_Grass_PIN 9     // SD2 9
#define Frontyard_Rain_PIN 10     // SD3 10

//======  Nappali változók  ======//
int Livingroom_Temperature;
float Livingroom_Humidity;
bool Livingroom_Ambient;
bool Livingroom_Smoke;
bool Livingroom_Motion;

int Livingroom_Temperature_Interval = 1000;
int Livingroom_Humidity_Interval = 500;
int Livingroom_Ambient_Interval = 1000;
int Livingroom_Smoke_Interval = 500;
int Livingroom_Motion_Interval = 1000;

unsigned long Livingroom_Temperature_Milis = 0;
unsigned long Livingroom_Humidity_Milis = 0;
unsigned long Livingroom_Ambient_Milis  = 0;
unsigned long Livingroom_Smoke_Milis = 0;
unsigned long Livingroom_Motion_Milis = 0;

//======  Bejárat változók  ======//
int Frontyard_Temperature;
int Frontyard_Humidity;
bool Frontyard_Ambient;
bool Frontyard_Motion;

int Frontyard_Temperature_Interval = 500;
int Frontyard_Humidity_Interval = 1000;
int Frontyard_Ambient_Interval = 500;
int Frontyard_Motion_Interval = 1000;

unsigned long Frontyard_Temperature_Milis = 0;
unsigned long Frontyard_Humidity_Milis = 0;
unsigned long Frontyard_Ambient_Milis = 0;
unsigned long Frontyard_Motion_Milis = 0;

//======  Konfiguráció  ======//
const char* ssid = "kibu-guest";
const char* password = "raday30";
const char* mqtt_server = "192.168.1.20";
const int mqttPort = 1883;
const char* mqttUser = "Smartroom";
const char* mqttPassword = "kibu";

DHT Livingroom_dht(Livingroom_TempHum_PIN,DHTTYPE);
DHT Frontyard_dht(Frontyard_TempHum_PIN,DHTTYPE);
WiFiClient wifiClient;
PubSubClient client(wifiClient);
unsigned long currentMilis = 0;
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

  if(strTopic == "Config_Intervals"){
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
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "SmartroomInputESP-";
    clientId += String(random(0xffff), HEX);
      if (client.connect(clientId.c_str())) {
        Serial.println("connected");
      }
      else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        Serial.println(" try again in 5 seconds");
        delay(5000);
      }
  }
}



//======  Beltéri szenzorok kiolvasása  ======//
void Livingroom_Temperature_Read(){
    Livingroom_Temperature = Livingroom_dht.readTemperature();
    client.publish("Livingroom/Temperature", String(Livingroom_Temperature).c_str(), true);
}

void Livingroom_Humidity_Read(){
    Livingroom_Humidity = Livingroom_dht.readHumidity();
    client.publish("Livingroom/Humidity", String(Livingroom_Humidity).c_str(), true );
}
  
void Livingroom_Ambient_Read(){
    Livingroom_Ambient = digitalRead(Livingroom_Ambient_PIN);
    //0 ha világos, 1 ha sötét
    if(Livingroom_Ambient==1){
      client.publish("Livingroom/Ambient","0");
    }
    else if(Livingroom_Ambient==0){
      client.publish("Livingroom/Ambient","1");
    } 
} 

void Livingroom_Smoke_Read(){
    Livingroom_Smoke = digitalRead(Livingroom_Smoke_PIN);
    client.publish("Livingroom/Smoke", String(Livingroom_Smoke).c_str(), true);
}
  
void Livingroom_Motion_Read(){
    Livingroom_Motion = digitalRead(Livingroom_Motion_PIN);
    if(Livingroom_Motion==1){
      client.publish("Livingroom/Ambient","1");
    }
    else if(Livingroom_Motion==0){
      client.publish("Livingroom/Ambient","0");
    } 
} 

//======  Kültéri szenzorok kiolvasása  ======//
void Frontyard_Temperature_Read(){
    Frontyard_Temperature = Frontyard_dht.readTemperature();
    client.publish("Frontyard/Temperature", String(Frontyard_Temperature).c_str(), true);
}

void Frontyard_Humidity_Read(){
    Frontyard_Humidity = Frontyard_dht.readHumidity();
    client.publish("Frontyard/Humidity", String(Frontyard_Humidity).c_str(), true );
}
  
void Frontyard_Ambient_Read(){
    Frontyard_Ambient = digitalRead(Frontyard_Ambient_PIN);
    //0 ha világos, 1 ha sötét
    if(Frontyard_Ambient==1){
      client.publish("Frontyard/Ambient","0");
    }
    else if(Frontyard_Ambient==0){
      client.publish("Frontyard/Ambient","1");
    } 
} 
  
void Frontyard_Motion_Read(){
    Frontyard_Motion = digitalRead(Frontyard_Motion_PIN);
    if(Frontyard_Motion==1){
      client.publish("Frontyard/Ambient","1");
    }
    else if(Frontyard_Motion==0){
      client.publish("Frontyard/Ambient","0");
    } 
} 

//====== Beltéri időzítők  ======//
void Livingroom_Temperature_Update(){
  if(currentMilis - Livingroom_Temperature_Milis >= Livingroom_Temperature_Interval){
    Livingroom_Temperature_Read();
    Livingroom_Temperature_Milis += Livingroom_Temperature_Interval;
  }
}

void Livingroom_Humidity_Update(){
  if(currentMilis - Livingroom_Humidity_Milis >= Livingroom_Humidity_Interval){
    Livingroom_Humidity_Read();
    Livingroom_Humidity_Milis += Livingroom_Humidity_Interval;
  }
}

void Livingroom_Ambient_Update(){
  if(currentMilis - Livingroom_Ambient_Milis >= Livingroom_Ambient_Interval){
    Livingroom_Ambient_Read();
    Livingroom_Ambient_Milis += Livingroom_Ambient_Interval;
  }
}

void Livingroom_Smoke_Update(){
  if(currentMilis - Livingroom_Smoke_Milis >= Livingroom_Smoke_Interval){
    Livingroom_Smoke_Read();
    Livingroom_Smoke_Milis += Livingroom_Smoke_Interval;
  }
}

void Livingroom_Motion_Update(){
  if(currentMilis - Livingroom_Motion_Milis >= Livingroom_Motion_Interval){
    Livingroom_Motion_Read();
    Livingroom_Motion_Milis += Livingroom_Motion_Interval;
  }
}

//====== Kültéri időzítők  ======//
void Frontyard_Temperature_Update(){
  if(currentMilis - Frontyard_Temperature_Milis >= Frontyard_Temperature_Interval){
    Frontyard_Temperature_Read();
    Frontyard_Temperature_Milis += Frontyard_Temperature_Interval;
  }
}

void Frontyard_Humidity_Update(){
  if(currentMilis - Frontyard_Humidity_Milis >= Frontyard_Humidity_Interval){
    Frontyard_Humidity_Read();
    Frontyard_Humidity_Milis += Frontyard_Humidity_Interval;
  }
}

void Frontyard_Ambient_Update(){
  if(currentMilis - Frontyard_Ambient_Milis >= Frontyard_Ambient_Interval){
    Frontyard_Ambient_Read();
    Frontyard_Ambient_Milis += Frontyard_Ambient_Interval;
  }
}

void Frontyard_Motion_Update(){
  if(currentMilis - Frontyard_Motion_Milis >= Frontyard_Motion_Interval){
    Frontyard_Motion_Read();
    Frontyard_Motion_Milis += Livingroom_Motion_Interval;
  }
}



//======  Fő futás  ======//
void setup() {
  setup_wifi();
  client.setServer(mqtt_server,mqttPort);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {reconnect();}
  client.loop();
  Livingroom_Temperature_Update();
  Livingroom_Humidity_Update();
  Livingroom_Ambient_Update();
  Livingroom_Smoke_Update();
  Livingroom_Motion_Update();
  Frontyard_Temperature_Update();
  Frontyard_Humidity_Update();
  Frontyard_Ambient_Update();
  Frontyard_Motion_Update();
}
