const WebSocket = require('ws');
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.office.kibu.hu:1883')
const wss = new WebSocket.Server({ port: 8080 });

//TO-DO
//mindenre helyileg változókat leírni
//switchcase kimenet, megnézni, hogy létezik-e
//ajtó, redőny nyitás-zárás
//manuális, automatika



wss.on('connection', function connection(ws) {
	console.log('connected');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
   	var res=message.split(";")
   	console.log(res[0]);
	console.log(res[1]);
	client.publish(res[0],res[1]);
  });
 
  //ws.send('something');
});







//Évi, fent
//mqtt
//Bence, lent


client.on('connect', function () {
client.subscribe('Neumann/SmartRoom/Frontyard/Ambient');
client.subscribe('Neumann/SmartRoom/Livingroom/Window');
client.subscribe('Neumann/SmartRoom/Livingroom/Smoke');
})

client.on('message', function (topic, message) {

  console.log(message);
  console.log(topic);
  //client.publish(res[0]+res[1]);

  if(topic=="Neumann/SmartRoom/Frontyard/Livingroom/Lamp/2"&&message==0){
    client.publish("Neumann/SmartRoom/Livingroom/Lamp/2","0");
  }
  else if(topic=="Neumann/SmartRoom/Frontyard/Livingroom/Lamp/2"&&message==1){
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2","1");
  }
})