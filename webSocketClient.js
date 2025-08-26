const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('error', console.error);

ws.on('open', function open() {
    console.log('joined - 3');
});

ws.on('message', function message(data) {
    ws.send(`asdasda ${data} message sent - 4`);
});