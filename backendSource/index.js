const WebSocket = require('ws');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://iot.office.kibu.hu:1883')
const wss = new WebSocket.Server({ port: 8080 });
let gws=undefined

//TO-DO:
//redőny nyitás-zárás
//manuális, automatika
    var Neumann_SmartRoom_Livingroom_Temperature;
    var Neumann_SmartRoom_Livingroom_Humidity;
    var Neumann_SmartRoom_Livingroom_Ambient;
    var Neumann_SmartRoom_Livingroom_Smoke;
    var Neumann_SmartRoom_Livingroom_Motion;
    var Neumann_SmartRoom_Frontyard_Temperature;
    var Neumann_SmartRoom_Frontyard_Humidity;
    var Neumann_SmartRoom_Frontyard_Ambient;
    var Neumann_SmartRoom_Frontyard_Motion;
    var Neumann_SmartRoom_Frontyard_Grass;
    var Neumann_SmartRoom_Frontyard_Rain;

    var Neumann_SmartRoom_Livingroom_Heater; //thermostat
    var Neumann_SmartRoom_Livingroom_heater; //fűtőszál
    var Neumann_SmartRoom_Livingroom_Window;
    var Neumann_SmartRoom_Livingroom_Shades;

wss.on('connection', function connection(ws) {
    console.log('connected');
    gws=ws;

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        var res = message.split(";");
        //console.log(res[0]);
        //console.log(res[1]);
        
        //client.publish(res[0], res[1]);
        switch (res[0]) {
        case "Neumann/SmartRoom/Livingroom/Lamp/1":
            client.publish(res[0],res[1]);
            break;

        case "Neumann/SmartRoom/Livingroom/Lamp/2":
            client.publish(res[0], res[1]);
            break;

        case "Neumann/SmartRoom/Livingroom/Cooler":
            client.publish(res[0], res[1]);
            break;

        case "Neumann/SmartRoom/Livingroom/Window":
          Neumann_SmartRoom_Livingroom_Window=parseInt(res[1]);
          if (Neumann_SmartRoom_Livingroom_Shades>1) {
            console.log("warning 1");
          }
          else if (Neumann_SmartRoom_Livingroom_Shades==0) {
            client.publish(res[0],res[1]);
          }
            break;

        case "Neumann/SmartRoom/Livingroom/Shades":
          Neumann_SmartRoom_Livingroom_Shades=parseInt(res[1]);
          console.log(Neumann_SmartRoom_Livingroom_Shades==0);
          if (Neumann_SmartRoom_Livingroom_Window==0) {
            client.publish(res[0],res[1]);
          }
          else if (Neumann_SmartRoom_Livingroom_Window>=1) {
            console.log("no can do");
          }

            break;

        case "Neumann/SmartRoom/Livingroom/Mood":
            console.log(res);
            var db1=res[1].slice(0,1);
            var red=res[1].slice(1,3);
            var green=res[1].slice(3,5);
            var blue=res[1].slice(5,7);
            
            var RED=parseInt(red,16);
            var GREEN=parseInt(green,16);
            var BLUE=parseInt(blue,16);
            
            if (RED==255) {
              console.log("piros");

            }
            if (GREEN==255) {
              console.log("zöld");

            }
            if (BLUE==255) {
              console.log("kék");

            }
            if (RED==0&&GREEN==0&&BLUE==0) {
              console.log("kikapcsolva");
            }

            //client.publish(res[0], res[1]);
            client.publish("Neumann/SmartRoom/Livingroom/Mood/R", RED.toString());
            client.publish("Neumann/SmartRoom/Livingroom/Mood/G", GREEN.toString());
            client.publish("Neumann/SmartRoom/Livingroom/Mood/B", BLUE.toString());
            break;

        case "Neumann/SmartRoom/Frontyard/Doorlock":
            client.publish(res[0], res[1]);
            break;

        case "Neumann/SmartRoom/Frontyard/Sprinkler":
            if ("Neumann/SmartRoom/Frontyard/Grass" == 0) {
                client.publish(res[0], res[1]);
            }
            break;

            case "Neumann/SmartRoom/Livingroom/heater":
              client.publish(res[0], res[1]);
            break;

        case "Neumann/SmartRoom/Livingroom/Heater":
            Neumann_SmartRoom_Livingroom_Heater=parseInt(res[1]);
            break;
        default:
            console.log("Topic nem létezik");
            var noTopicMessage = {
              "message": "Topic nem letezik"
            };
            ws.send(JSON.stringify(noTopicMessage));
    }
    });

    //ws.send('something');
});


//Neumann/SmartRoom/


//Évi, fent
//mqtt
//Bence, lent



client.on('connect', function () {
    client.subscribe("Neumann/SmartRoom/Livingroom/Temperature");
    client.subscribe("Neumann/SmartRoom/Livingroom/Humidity");
    client.subscribe('Neumann/SmartRoom/Livingroom/Ambient');
    client.subscribe('Neumann/SmartRoom/Livingroom/Smoke');
    client.subscribe('Neumann/SmartRoom/Livingroom/Motion');
    client.subscribe('Neumann/SmartRoom/Frontyard/Temperature');
    client.subscribe('Neumann/SmartRoom/Frontyard/Humidity');
    client.subscribe('Neumann/SmartRoom/Frontyard/Ambient');
    client.subscribe('Neumann/SmartRoom/Frontyard/Motion');
    client.subscribe('Neumann/SmartRoom/Frontyard/Grass');
    client.subscribe('Neumann/SmartRoom/Frontyard/Rain');
    client.subscribe('Neumann/SmartRoom/Livingroom/Mood');
})




client.on('message', function (topic, message) {
    //console.log(message);     
    console.log(topic.toString());
    console.log(message.toString());
    var values={
      "topic":topic.toString(), 
      "message":message.toString()
    }
    if (gws!==undefined) {
      gws.send(JSON.stringify(values));
    }




    switch(topic){
      case "Neumann/SmartRoom/Livingroom/Temperature":
        Neumann_SmartRoom_Livingroom_Temperature=parseInt(message);
        console.log(Neumann_SmartRoom_Livingroom_Temperature);
        break;

      case "Neumann/SmartRoom/Livingroom/Humidity":
        Neumann_SmartRoom_Livingroom_Humidity=parseInt(message);
        console.log(Neumann_SmartRoom_Livingroom_Humidity);
        break;

      case "Neumann/SmartRoom/Livingroom/Ambient":
        Neumann_SmartRoom_Livingroom_Ambient=parseInt(message);
        console.log(Neumann_SmartRoom_Livingroom_Ambient);
        break;

      case "Neumann/SmartRoom/Livingroom/Smoke":
        Neumann_SmartRoom_Livingroom_Smoke=parseInt(message);
        break;

      case "Neumann/SmartRoom/Livingroom/Motion":
        Neumann_SmartRoom_Livingroom_Motion=parseInt(message);
        break;

      case "Neumann/SmartRoom/Frontyard/Temperature":
        Neumann_SmartRoom_Frontyard_Temperature=parseInt(message);
        break;

      case "Neumann/SmartRoom/Frontyard/Humidity":
        Neumann_SmartRoom_Frontyard_Humidity=parseInt(message);
        break;

      case "Neumann/SmartRoom/Frontyard/Ambient":
        Neumann_SmartRoom_Frontyard_Ambient=parseInt(message);
        console.log(Neumann_SmartRoom_Frontyard_Ambient);
        break;

      case "Neumann/SmartRoom/Frontyard/Motion":
        Neumann_SmartRoom_Frontyard_Motion=parseInt(message);
        break;

      case "Neumann/SmartRoom/Frontyard/Grass":
        Neumann_SmartRoom_Frontyard_Grass=parseInt(message);
        break;

      case "Neumann/SmartRoom/Frontyard/Rain":
        Neumann_SmartRoom_Frontyard_Rain=parseInt(message);
        break;
    }
    
    //client.publish(res[0]+res[1]);
    //webkliens
    //source:https://www.w3schools.com/jsref/jsref_switch.asp



    //---------------------------------------automatizáció-------------------------------------------
    


    function Autolamp() {
      //console.log("hello!");
      if (Neumann_SmartRoom_Livingroom_Ambient == 0&&Neumann_SmartRoom_Frontyard_Ambient == 0) {
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "1");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "1");
        //console.log("Lámpák ok felkapcsolva");
      }
    }
    setInterval(Autolamp, 10000);

    function Autoshades() {
      if (Neumann_SmartRoom_Livingroom_Ambient == 0&&Neumann_SmartRoom_Frontyard_Ambient == 1) {
        client.publish("Neumann/SmartRoom/Livingroom/Shades", "100");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
        console.log("fényes van, redőny felhúzva, lámpák kikapcsolva");
      }
    }
    setInterval(Autoshades,10000);

    function Autotemp(){
      if (Neumann_SmartRoom_Livingroom_Heater==Neumann_SmartRoom_Livingroom_Temperature) {
        client.publish("Neumann/SmartRoom/Livingroom/Heater","0");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler","0");
        console.log("Megfelelő hőmérséklet");
      }

      if (Neumann_SmartRoom_Livingroom_Heater<Neumann_SmartRoom_Livingroom_Temperature) {
        client.publish("Neumann/SmartRoom/Livingroom/Heater","0");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler","1");
        console.log("Hűtés bekapcsolva");
      }

      if (Neumann_SmartRoom_Livingroom_Heater>Neumann_SmartRoom_Livingroom_Temperature) {
        client.publish("Neumann/SmartRoom/Livingroom/Heater","1");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler","0");
        console.log("Fűtés bekapcsolva");
      }
    }
    setInterval(Autotemp,10000);

    if (Neumann_SmartRoom_Livingroom_Window==0) {
      client.publish("Neumann/SmartRoom/Livingroom/Shades", Neumann_SmartRoom_Livingroom_Shades);
    }

    if (topic == "Neumann/SmartRoom/Frontyard/Grass" && message == "0") {
        client.publish("Neumann/SmartRoom/Frontyard/Sprinkler", "1");
        console.log("locsolás on");
    }

    function Autosprinkler() {
      if (Neumann_SmartRoom_Frontyard_Grass == 1 || Neumann_SmartRoom_Frontyard_Rain == 1) {
      client.publish("Neumann/SmartRoom/Frontyard/Sprinkler", "0");
      console.log("locsolás off");
      }
    }
    setInterval(Autosprinkler,10000);
    
    if (topic == "Neumann/SmartRoom/Livingroom/Motion" && message == "1") {
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Shades", "0");
        for (var i = 0; i < topic == "Neumann/SmartRoom/Livingroom/Motion" && message == "1" ; i++) {
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
        console.log("Füst");
    }


    //távollét
    /*if (true) {
        client.publish("Neumann/SmartRoom/Frontyard/Doorlock", "1");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Shades", "0");
    }*/

    /*switch(homerseklet){
      case hom=="Neumann/SmartRoom/Livingroom/Temperature":
        client.publish("Neumann/SmartRoom/Livingroom/Heater","0");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler","0");
      case hom>"Neumann/SmartRoom/Livingroom/Temperature":
        client.publish("Neumann/SmartRoom/Livingroom/Heater","1");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler","0");
      case hom<"Neumann/SmartRoom/Livingroom/Temperature":
        client.publish("Neumann/SmartRoom/Livingroom/Heater","0");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler","1");
    }*/
})