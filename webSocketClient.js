const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ws = new WebSocket('ws://localhost:8080');

ws.on('error', console.error);

let username = null;
ws.on('open', function open() {
    console.log('joined');
    
    rl.question("Enter your name: ", (name) => {
        username = name.trim();
        ws.send(JSON.stringify({ type: "register", name: username }));
        console.log(`Welcome ${username}! Start typing your messages...`);
    });
    
    rl.on('line', (input) => {
        ws.send(JSON.stringify({ type: "chat", message: input })); // send terminal input to server
    });
});

ws.on('message', function message(data) {
    console.log("", data.toString());
});