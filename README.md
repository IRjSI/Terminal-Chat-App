# TCP Chat Application

## Requirements
- net → For creating the TCP server and client sockets.
- readline → For taking user input in the terminal.

## Server Setup

#### Create Server
```js
const server = net.createServer((socket) => {
    // Handle new client connection
});
```

#### Start Listening
```js
server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
```

## Client Setup

#### Create and Connect Client
```js
const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log(`Connected to server at ${HOST}:${PORT}`);
});
```

## Data Flow

1. Client connects
    - Server’s connection callback runs.
    - Push the new socket into the clients[] array.

2. Client writes data (client.write("Hello"))
    - Server’s socket.on("data") event fires.

3. Server broadcasts

    - Inside on("data"), server loops through clients[].
    - Calls clients[i].write(...) for each connected client.

4. Client receives data
    - Client’s client.on("data") handler fires and prints the broadcasted message.

## Using readline for Input
```js
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What is your name? ", (name) => {
    client.connect(PORT, HOST, () => {
        rl.on("line", (input) => {
            client.write(`${name}: ${input}`); // Send typed message
        });
    });
});
```

## Server Receiving & Broadcasting
```js
socket.on("data", (data) => {
    console.log(`Received from client ${socket.remotePort}: ${data.toString()}`);

    // Broadcast to all clients
    for (let i = 0; i < clients.length; i++) {
        clients[i].write(
            `New message from ${socket.remotePort}: ${data.toString()}`
        );
    }
});
```

## Client Receiving
```js
client.on("data", (data) => {
    console.log(`Received from server: ${data.toString()}`);
});
```

## Summary
- Write from client → triggers server’s `on("data")`.
- Write from server → triggers client’s `on("data")`.
- Broadcasting works by looping over all connected sockets and writing to each.
- `Readline` allows interactive input so multiple clients can chat in real time.