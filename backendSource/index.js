const WebSocket = require('ws');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://iot.office.kibu.hu:1883')
const wss = new WebSocket.Server({ port: 8080 });

//TO-DO:
//mindenre helyileg változókat leírni
//switchcase kimenet, megnézni, hogy létezik-e
//ajtó, redőny nyitás-zárás
//manuális, automatika


wss.on('connection', function connection(ws) {
    console.log('connected');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        var res = message.split(";");
        console.log(res[0]);
        console.log(res[1]);
        client.publish(res[0], res[1]);
    });

    //ws.send('something');
});


//Neumann/SmartRoom/


var Neumann_SmartRoom_Livingroom_Lamp_1;
var Neumann_SmartRoom_Livingroom_Lamp_2;
var Neumann_SmartRoom_Livingroom_Cooler;
var Neumann_SmartRoom_Livingroom_Window;
var Neumann_SmartRoom_Livingroom_Heater;
var Neumann_SmartRoom_Livingroom_Shades;
var Neumann_SmartRoom_Livingroom_Mood_R;
var Neumann_SmartRoom_Livingroom_Mood_G;
var Neumann_SmartRoom_Livingroom_Mood_B;
var Neumann_SmartRoom_Frontyard_Doorlock;
var Neumann_SmartRoom_Frontyard_Sprinkler;



//Évi, fent
//mqtt
//Bence, lent


client.on('connect', function () {
    client.subscribe("Neumann/SmartRoom/Livingroom/Temperature");
    client.subscribe("Neumann/SmartRoom/Livingroom/Humidity");
    client.subscribe('Neumann/SmartRoom/Frontyard/Ambient');
    client.subscribe('Neumann/SmartRoom/Livingroom/Smoke');
    client.subscribe('Neumann/SmartRoom/Livingroom/Motion');
    client.subscribe('Neumann/SmartRoom/Frontyard/Temperature');
    client.subscribe('Neumann/SmartRoom/Frontyard/Humidity');
    client.subscribe('Neumann/SmartRoom/Frontyard/Ambient');
    client.subscribe('Neumann/SmartRoom/Frontyard/Motion');
    client.subscribe('Neumann/SmartRoom/Frontyard/Grass');
    client.subscribe('Neumann/SmartRoom/Frontyard/Rain');
})

client.on('message', function (topic, message) {

    console.log(message);
    console.log(topic);
    //client.publish(res[0]+res[1]);

    //webkliens

    switch (res[0]) {
        case "Neumann/SmartRoom/Livingroom/Lamp/1":
            client.publish("res[0],res[1]");
            break;

        case "Neumann/SmartRoom/Livingroom/Lamp/2":
            client.publish("res[0]", "res[1]");
            break;

        case "Neumann/SmartRoom/Livingroom/Cooler":
            client.publish("res[0]", "res[1]");
            break;

        case "Neumann/SmartRoom/Livingroom/Window":
            if ("Neumann/SmartRoom/Livingroom/Shades" >= 95) {
                client.publish("res[0]", "res[1]");
            }
            else {
                console.log("A redőny le van húzva");
                //ws.send("A redőny le van húzva")
            }
            break;

        case "Neumann/SmartRoom/Livingroom/Heater":
            client.publish("res[0]", "res[1]");
            break;

        case "Neumann/SmartRoom/Livingroom/Shades":
            if ("Neumann/SmartRoom/Livingroom/Window"<=5) {
                client.publish("res[0]", "res[1]");
            }
            client.publish("res[0]", "res[1]");
            break;

        case "Neumann/SmartRoom/Livingroom/Mood/R":
            client.publish("res[0]", "res[1]");
            client.publish("Neumann/SmartRoom/Livingroom/Mood/G", "0");
            client.publish("Neumann/SmartRoom/Livingroom/Mood/B", "0");
            break;

        case "Neumann/SmartRoom/Livingroom/Mood/G":
            client.publish("res[0]", "res[1]");
            client.publish("Neumann/SmartRoom/Livingroom/Mood/R", "0");
            client.publish("Neumann/SmartRoom/Livingroom/Mood/B", "0");
            break;

        case "Neumann/SmartRoom/Livingroom/Mood/B":
            client.publish("res[0]", "res[1]");
            client.publish("Neumann/SmartRoom/Livingroom/Mood/G", "0");
            client.publish("Neumann/SmartRoom/Livingroom/Mood/R", "0");
            break;

        case "Neumann/SmartRoom/Frontyard/Doorlock":
            client.publish("res[0]", "res[1]");
            break;

        case "Neumann/SmartRoom/Frontyard/Sprinkler":
            if ("Neumann/SmartRoom/Frontyard/Grass" == 0) {
                client.publish("res[0]", "res[1]");
            }
            break;
        default:
            console.log("Topic nem létezik");
            ws.send("Topic nem létezik");
    }
    //source:https://www.w3schools.com/jsref/jsref_switch.asp

    //automatizáció

    if (topic == "Neumann/SmartRoom/Frontyard/Livingroom/Lamp/2" && message == 0) {
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
    }
    else if (topic == "Neumann/SmartRoom/Frontyard/Livingroom/Lamp/2" && message == 1) {
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "1");
    }

    if ((topic == "Neumann/SmartRoom/Livingroom/Ambient" && message == 0) && (topic == "Neumann/SmartRoom/Frontyard/Ambient" && message == 1)) {
        client.publish("Neumann/SmartRoom/Livingroom/Shades", "100");
    }

    if (topic == "Neumann/SmartRoom/Frontyard/Grass" && message == "0") {
        client.publish("Neumann/SmartRoom/Frontyard/Sprinkler", "1");
    }

    if (topic == "Neumann/SmartRoom/Livingroom/Motion" && message == "1") {
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Shades", "0");
        for (var i = 0; i < topic == "Neumann/SmartRoom/Livingroom/Motion" && message == "0" ; i++) {
            client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "1");
            client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "1");
            client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
            client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
        }
        console.log("A riasztó riaszt.");
    }

    if (topic =="Neumann/SmartRoom/Livingroom/Smoke" && message=="1") {
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Heater", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler", "100");
        client.publish("Neumann/SmartRoom/Frontyard/Doorlock", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
    }
    //távollét
    if (true) {
        client.publish("Neumann/SmartRoom/Frontyard/Doorlock", "1");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Shades", "0");
    }
})