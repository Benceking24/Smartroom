const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
let gws=undefined

wss.on('connection', function connection(ws) {
    console.log('connected');
    gws=ws;
    ws.on("error",function(){
      console.log("error");
    })

    wss.on('message', function incoming(message) {
        console.log('received: %s', message);
        var res = message.split(";");
        });

});