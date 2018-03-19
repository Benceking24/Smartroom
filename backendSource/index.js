const WebSocket = require('ws');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://iot.office.kibu.hu:1883')//iot.office.kibu.hu
const wss = new WebSocket.Server({ port: 8080 });
let gws=undefined

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

    var Neumann_SmartRoom_Livingroom_Heater=0; //fűtőszál,1=on, 0=off
    var Neumann_SmartRoom_Livingroom_heater=22; //thermostat hőmérséklete
    var Neumann_SmartRoom_Livingroom_Window=0;
    var Neumann_SmartRoom_Livingroom_Shades=0;
    var Neumann_SmartRoom_Frontyard_Doorlock=0;
    var Neumann_SmartRoom_Frontyard_Sprinkler;
	var Neumann_SmartRoom_Livingroom_Cooler=0;
	
	var Neumann_SmartRoom_Livingroom_Heater_button=0;
	var Neumann_SmartRoom_Livingroom_Cooler_button=0;

	var manuallamp=false; //false=automatika on
	var manualshades=false; //true=manuális mód
	var manualtemp=false;
	var manualsprinkler=false;
	var manualwindow=false;
	
	var manlamp=0;
	var manshades=0;
	var mantemp=0;
	var mansprink=0; 
	var manwindow=0;
	
	function lampbool(){
		if(manuallamp==true){
			manlamp++;
			if(manlamp>=10){
				manuallamp=false;
			}
		}
	}
	setInterval(lampbool,10000);
	
	function shadebool(){
		if(manualshades==true){
			manshades++;
			if(manshades>=10){
				manualshades=false;
			}
		}
	}
	setInterval(shadebool, 10000);
	
	function tempbool(){
		if(manualtemp==true){
			mantemp++;
			if(mantemp>=10){
				manualtemp=false;
			}
		}
	}
	setInterval(tempbool,10000);
	
	function sprinklerbool(){
		if(manualsprinkler==true){
			mansprink++;
			console.log(mansprink);
			if(mansprink>=10){
				manualsprinkler=false;
			}
		}
	}
	setInterval(sprinklerbool,10000);
	
	function windowbool(){
		if(manualwindow==true){
			manwindow++;
			if(manwindow>=10){
				manualwindow=false;
			}
		}
	}
	setInterval(windowbool,10000);
    

wss.on('connection', function connection(ws) {
    console.log('connected');
    gws=ws;
    ws.on("error",function(){
      console.log("error");
    })

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        var res = message.split(";");
        //console.log(res[0]);
        //console.log(res[1]);
        
        //client.publish(res[0], res[1]);
        switch (res[0]) {
        case "Neumann/SmartRoom/Livingroom/Lamp/1":
            client.publish(res[0],res[1]);
			manuallamp=true;
            break;

        case "Neumann/SmartRoom/Livingroom/Lamp/2":
            client.publish(res[0], res[1]);
			manuallamp=true;
            break;

        case "Neumann/SmartRoom/Livingroom/Cooler":
			Neumann_SmartRoom_Livingroom_Cooler=parseInt(res[1]);
      if (Neumann_SmartRoom_Livingroom_Heater==0) {
        client.publish(res[0],res[1]);
      }
      else{
        console.log("hűtés on != fűtés")
      }
			/*Neumann_SmartRoom_Livingroom_Cooler_button=res[1];
			if(Neumann_SmartRoom_Livingroom_Heater_button==1 && Neumann_SmartRoom_Livingroom_Cooler_button==1){
				console.log("A fűtés be van kapcsolva, nem lehet hűteni.");
			}
			else{
				if(Neumann_SmartRoom_Livingroom_Cooler==1){
					manualtemp=true;
					console.log("hűtés manuális mód");
					client.publish("Neumann/SmartRoom/Livingroom/Cooler", "1");
					client.publish("Neumann/SmartRoom/Livingroom/Heater", "0");
				}
				else{
					manualtemp=false;
					console.log("hűtés automata mód");
				}
			}*/
            break;

        case "Neumann/SmartRoom/Livingroom/Window":
          Neumann_SmartRoom_Livingroom_Window=parseInt(res[1]);
          if (Neumann_SmartRoom_Livingroom_Shades==0) {
            client.publish(res[0],res[1]);
			manualwindow=true;
          }
          else if (Neumann_SmartRoom_Livingroom_Shades>=1) {
            console.log("Az ablakot nem lehet kinyitni");
          }
            break;

        case "Neumann/SmartRoom/Livingroom/Shades":
          Neumann_SmartRoom_Livingroom_Shades=parseInt(res[1]);
		  manualshades=true;
          if (Neumann_SmartRoom_Livingroom_Window==0) {
            client.publish(res[0],res[1]);
          }
          else if (Neumann_SmartRoom_Livingroom_Window>=1) {
            console.log("A redőnyt nem lehet lehúzni");
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
            Neumann_SmartRoom_Frontyard_Doorlock=parseInt(res[1]);
            client.publish(res[0], res[1]);
            break;

        case "Neumann/SmartRoom/Frontyard/Sprinkler":
            Neumann_SmartRoom_Frontyard_Sprinkler=parseInt(res[1]);
			manualsprinkler=true;
            client.publish(res[0],res[1]);
            break;

        case "Neumann/SmartRoom/Livingroom/Heater":
			   Neumann_SmartRoom_Livingroom_Heater=parseInt(res[1]);
      if (Neumann_SmartRoom_Livingroom_Cooler==0) {
        client.publish(res[0],res[1]);
      }
      else{
        console.log("hűtés on, !=fűtés");
      }
			/*console.log("fűtés gomb megnyomva "+Neumann_SmartRoom_Livingroom_Heater_button);
			if(Neumann_SmartRoom_Livingroom_Cooler_button==1 && Neumann_SmartRoom_Livingroom_Heater_button==1){
				console.log("A hűtés be van kapcsolva, nem lehet fűteni.");
			}
			else{
				if(Neumann_SmartRoom_Livingroom_Heater_button==1){
					client.publish("Neumann/SmartRoom/Livingroom/Cooler", "0");
					client.publish("Neumann/SmartRoom/Livingroom/Heater", "1");
					manualtemp=true;
					console.log("fűtés manuális mód");
				}
				else{
					manualtemp=false;
					console.log("fűtés automatán működik");
				}
			}*/
            break;

        case "Neumann/SmartRoom/Livingroom/heater":
            Neumann_SmartRoom_Livingroom_heater=parseInt(res[1]);
            break;
        default:
            console.log("Topic nem létezik");
            var noTopicMessage = {
              "message": "Topic nem letezik"
            };
            ws.send(JSON.stringify(noTopicMessage));
    }
    });

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
//client.subscribe('Neumann/SmartRoom/Livingroom/Mood');
})


client.on('message', function (topic, message) {
    //console.log(message);     
    console.log(topic.toString()+" "+message.toString());
    var values={
      "topic":topic.toString(), 
      "message":message.toString()
    }
    if (gws!==undefined) {
      gws.send(JSON.stringify(values));
    }


    switch(topic){
      case "Neumann/SmartRoom/Livingroom/Temperature":
        Neumann_SmartRoom_Livingroom_Temperature=message;
        Neumann_SmartRoom_Livingroom_Temperature=Math.round(Neumann_SmartRoom_Livingroom_Temperature,1);
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
    
    /*function ask(question, format, callback) {
 var stdin = process.stdin, stdout = process.stdout;
 
 stdin.resume();
 stdout.write(question + ": ");
 
 stdin.once('data', function(data) {
   data = data.toString().trim();
 
   if (format.test(data)) {
     callback(data);
   } else {
     stdout.write("It should match: "+ format +"\n");
     ask(question, format, callback);
   }
 });

}
ask("1=hőmérő adatátírás, 0=Visszaállítás", /.+/, function(name) {
  
  ask("temp", /^.+$/, function(Temp) {
    if (name=="1") {
    client.unsubscribe("Neumann/SmartRoom/Livingroom/Temperature");
    Neumann_SmartRoom_Livingroom_Temperature=Temp;
    function autoincrement(){
            if (Neumann_SmartRoom_Livingroom_Heater==1) {
              Neumann_SmartRoom_Livingroom_Temperature++;
            }
    }
    setInterval(autoincrement, 5000);
    
	
	
    }
        else if (name="0") {
        client.subscribe("Neumann/SmartRoom/Livingroom/Temperature");
    }
    Temp=parseInt(Temp);
    console.log("jelszó: ", name);
    console.log("hőm:", Temp);

  });
});*/


    /*function debughom() {
        client.unsubscribe("Neumann/SmartRoom/Livingroom/Temperature");
        Neumann_SmartRoom_Livingroom_Temperature+=5;
      console.log(Neumann_SmartRoom_Livingroom_Temperature+" németország");
        setTimeout(function () {
          client.subscribe("Neumann/SmartRoom/Livingroom/Temperature");
          console.log("feliratkozva");
        }
        ,10000);
    }
    setInterval(debughom,30000);*/

    setInterval(function () {
        client.unsubscribe("Neumann/SmartRoom/Livingroom/Temperature");
        var Temp=Neumann_SmartRoom_Livingroom_Temperature;
        Neumann_SmartRoom_Livingroom_Temperature+=5;
      console.log(Neumann_SmartRoom_Livingroom_Temperature+" németország");
        setTimeout(function () {
          client.subscribe("Neumann/SmartRoom/Livingroom/Temperature");
          console.log("feliratkozva");
          Neumann_SmartRoom_Livingroom_Temperature=Temp;
          /*switch(topic){
          case "Neumann/SmartRoom/Livingroom/Temperature":
          Neumann_SmartRoom_Livingroom_Temperature=message;
          Neumann_SmartRoom_Livingroom_Temperature=Math.round(Neumann_SmartRoom_Livingroom_Temperature,1);
          console.log(Neumann_SmartRoom_Livingroom_Temperature);
          break;}*/
        }
        ,10000);
    },15000)

    function Autolamp() {
      if (Neumann_SmartRoom_Livingroom_Ambient == 0&&Neumann_SmartRoom_Frontyard_Ambient == 0) {
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "1");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "1");
        console.log("Lámpák felkapcsolva");
      }
    }
    setInterval(Autolamp, 10000);
    //TODO
    //setInterval-okat feltételbe tenni
    //pl lampoverwrite
    //default=false
    //false=nem overwrite
    //true=overwrite
    //ha a kliens felkapcsolva a lámpát, akkor az automatka funkció megáll
    //de egy idő műlva újraindul -- globális változó pl : n000 --> n másodperc múlva újraindul
    //a true-t false-ra állítja
    //unsub a kiválasztott csatornákról

    function Autoshades() {
		if(manualshades==false){
			if (Neumann_SmartRoom_Livingroom_Ambient == 0&&Neumann_SmartRoom_Frontyard_Ambient == 1) {
			client.publish("Neumann/SmartRoom/Livingroom/Shades", "100");
			client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
			client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
			console.log("fényes van, redőny felhúzva, lámpák kikapcsolva");
			}
		}
    }
    setInterval(Autoshades,10000);

    function Autotemp(){
		if(manualtemp==false){
		  if (Neumann_SmartRoom_Livingroom_heater+1<Neumann_SmartRoom_Livingroom_Temperature) {
			client.publish("Neumann/SmartRoom/Livingroom/Heater","0");
			client.publish("Neumann/SmartRoom/Livingroom/Cooler","1");
			Neumann_SmartRoom_Livingroom_Heater=0;
			console.log("Hűtés bekapcsolva");
			console.log(Neumann_SmartRoom_Livingroom_Temperature);
		  }
		  else{
			if (Neumann_SmartRoom_Livingroom_heater-1>Neumann_SmartRoom_Livingroom_Temperature) {
				client.publish("Neumann/SmartRoom/Livingroom/Heater","1");
				client.publish("Neumann/SmartRoom/Livingroom/Cooler","0");
				Neumann_SmartRoom_Livingroom_Heater=1;
				console.log("Fűtés bekapcsolva");
				console.log(Neumann_SmartRoom_Livingroom_Temperature);
			}
			else{
				client.publish("Neumann/SmartRoom/Livingroom/Heater","0");
				client.publish("Neumann/SmartRoom/Livingroom/Cooler","0");
				Neumann_SmartRoom_Livingroom_Heater=0;
				console.log("Megfelelő hőmérséklet");
				console.log(Neumann_SmartRoom_Livingroom_Temperature);
			}
		  }
		}
    }
    setInterval(Autotemp,10000);

    if (Neumann_SmartRoom_Livingroom_Window==0) {
      client.publish("Neumann/SmartRoom/Livingroom/Shades", Neumann_SmartRoom_Livingroom_Shades);
    }


    /*if (topic == "Neumann/SmartRoom/Frontyard/Grass" && message == "0") {
        client.publish("Neumann/SmartRoom/Frontyard/Sprinkler", "1");
        console.log("locsolás on");
    }*/

    function Autosprinkler() {
		if(manualsprinkler==false){
			if (Neumann_SmartRoom_Frontyard_Grass == 1 || Neumann_SmartRoom_Frontyard_Rain == 1) {
				client.publish("Neumann/SmartRoom/Frontyard/Sprinkler", "0");
				console.log("locsolás off");
			}

			if (Neumann_SmartRoom_Frontyard_Grass == 0) {
				client.publish("Neumann/SmartRoom/Frontyard/Sprinkler", "1");
				console.log("locsolás on");
          
			}
		}
    }
    setInterval(Autosprinkler,10000);

    function Autoriaszto() {
      if (Neumann_SmartRoom_Frontyard_Doorlock==1 && Neumann_SmartRoom_Livingroom_Motion==1) {
          client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
          client.publish("Neumann/SmartRoom/Livingroom/Shades", "0");
          console.log("A riasztó riaszt");
          setInterval(function(){ 
            console.log("on");
            client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "1");
          }, 3000);
          setTimeout(function (){
            setInterval(function(){ 
              console.log("off");
              client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
            }, 3000);
          }, 1000);
            
      }
    }
    setInterval(Autoriaszto,10000);

    function tavollet() {
      if (Neumann_SmartRoom_Frontyard_Doorlock==1) {
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Mood/R", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Mood/G", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Mood/B", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Shades", "0");
      }
    }
    setInterval(tavollet,10000);

    function Autofust() {
      if (Neumann_SmartRoom_Livingroom_Smoke==1) {
        client.publish("Neumann/SmartRoom/Livingroom/Window", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Heater", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Cooler", "100");
        client.publish("Neumann/SmartRoom/Frontyard/Doorlock", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/1", "0");
        client.publish("Neumann/SmartRoom/Livingroom/Lamp/2", "0");
        console.log("Füst");
      }
    }
    setInterval(Autofust,10000);
    
})