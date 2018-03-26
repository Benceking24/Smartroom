const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
let gws=undefined
var toggle = false;


function toggleVal(){
        if(toggle){toggle=false;}else{toggle=true;}
            var values={
      "topic":"Neumann/SmartRoom/Livingroom/Lamp/2", 
      "message":toggle
    }
    if (gws!==undefined) {
      gws.send(JSON.stringify(values));
    }
}

wss.on('connection', function connection(ws) {
    console.log('connected');
    gws=ws;
    ws.on("error",function(){
      console.log("error");
    })
            
    setInterval(toggleVal,10000);

    wss.on('message', function incoming(message) {
        console.log('received: %s', message);
        var res = message.split(";");
    });

});