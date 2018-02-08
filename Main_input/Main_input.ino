#include<ESP8266WiFi.h>
#include<PubSubClient.h>
#include<DHT.h>

//======  Nappali változók  ======//
int Livingroom_Temperature;
int Livingroom_Humidity;
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

WiFiClient wifiClient;
PubSubClient client(wifiClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void GetIntervals(){
  client.Subscribe
}

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
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
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
/*void Livingroom_Temperature(){
    
}
void Livingroom_Humidity()
void Livingroom_Ambient()
void Livingroom_Smoke()
void Livingroom_Motiom()*/

void setup() {
  setup_wifi();
  //client.setServer(mqtt_server,1883);
  //client.setCallback(callback);
}

void loop() {
  //if (!client.connected()) {reconnect();}
  //client.loop();
}
