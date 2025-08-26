const net = require("net");
const readline = require('readline');
const PORT = 3000;
const HOST = "127.0.0.1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket();

rl.question('What is your name? ', (name) => {
    client.connect(PORT, HOST, () => {
        // Send typed messages to server
        rl.on("line", (input) => {
            client.write(`${input}`);
        });
    });

    // Handle data received from the server
    client.on('data', (data) => {
        console.log(`Received from server: ${data.toString()}`);
    });

    // Handle connection closure
    client.on('close', () => {
        console.log('Connection closed');
    });

    // Handle errors
    client.on('error', (err) => {
        console.error(`Client error: ${err.message}`);
    });
})