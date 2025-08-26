const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log("server started - 1");

    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received on server: %s - 5', data);
    });

    ws.send('seed');
});