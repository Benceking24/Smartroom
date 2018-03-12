var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.office.kibu.hu:1883')

client.on('connect', function () {
client.subscribe('Neumann/SmartRoom/Frontyard/Ambient');
client.subscribe('Neumann/SmartRoom/Livingroom/Window');
client.subscribe('Neumann/SmartRoom/Livingroom/Smoke');
})
 
client.on('message', function (topic, message) {

  console.log(message);
  console.log(topic);
  if(topic=="Neumann/SmartRoom/Frontyard/Ambient"&&message==0){
    client.publish("Neumann/SmartRoom/Livingroom/Lamp/2","0");
  }
  else if(topic=="Neumann/SmartRoom/Frontyard/Ambient"&&message==1){
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2","1");
  }

    //2 szenzoros
 /* if ((topic == "Neumann/SmartRoom/Frontyard/Ambient" && message == 0) && (topic == "Neumann/SmartRoom/Livingroom/Ambient" && message == 0)) {
      client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "1");
      client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "1");
  }
  else if ((topic == "Neumann/SmartRoom/Frontyard/Ambient" && message == 1) && (topic == "Neumann/SmartRoom/Livingroom/Ambient" && message == 0)) {
      client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
      client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
  }*/

//ablak
var ablak
if (topic=='Neumann/SmartRoom/Livingroom/Shades'&&message>=98) {
  console.log("A redőny le van húzva")
}
else{
  client.publish("Neumann/SmartRoom/Livingroom/Window","")
}



//Redõny

//client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    console.log(topic)
    if (topic=='Neumann/SmartRoom/Frontyard/Ambient'&& message==1) {
      client.publish('Neumann/SmartRoom/Livingroom/Shades','100')
    }
    else if (topic == 'Neumann/SmartRoom/Livingroom/Shades' && message >= 2) {
        console.log("A redõny le van húzva")
    }
    else if (topic == 'Neumann/SmartRoom/Livingroom/Shades' && message <= 2) {
        client.publish("Neumann/SmartRoom/Livingroom/Window","")
    }


//Tûz

//client.on('message', function (topic, message) {

    console.log(message.toString());
    console.log(topic);
    if (topic == "Neumann/SmartRoom/Livingroom/Smoke" && message == 0) {
        
    }
    else if (topic == "Neumann/SmartRoom/Livingroom/Smoke" && message == 1) {
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Heater", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler", "100");
        client.publish("Neumann/SmartRoom/Frontyard/Doorlock", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
    }
})


//alapkód
/*var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
    client.subscribe('presence')
    client.publish('presence', 'Hello mqtt')
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
})*/