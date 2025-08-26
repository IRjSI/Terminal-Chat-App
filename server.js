const net = require("net");
const PORT = 3000;
const HOST = "127.0.0.1";

const clients = [];

const server = net.createServer((socket) => {
    clients.push(socket);
    
    console.log(`client ${socket.remotePort} connected`)
    socket.on("data", (data) => {
        console.log(`Received from client: ${data.toString()}`);
        // Echo the data back to the client
        for (let i = 0; i < clients.length; i++) {
            clients[i].write(`new message from ${socket.remotePort}: ${data.toString()}`);
        }
    });

    socket.on("end", () => {
        console.log(`Client disconnected from ${socket.remoteAddress}:${socket.remotePort}`);
    });

    socket.on("error", (err) => {
        console.error(`Socket error: ${err.message}`);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${PORT} for ${HOST}`);
});

server.on('error', (err) => {
    console.log(err);
});