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
- `readline` allows interactive input so multiple clients can chat in real time.

---

# Upgrade to Websocket server

## Server Setup

```js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
	ws.on('error', console.error);
	
	ws.on('message', function message(data) {
		console.log('received on server: %s', data);
	});
	
	ws.send('seed');
});
```

## Client Setup

```js
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('error', console.error);

ws.on('open', function open() {
	console.log('received on client: %s',);
});

ws.on('message', function message(data) {
	ws.send(`asdasda ${data}`);
});
```

## Broadcasting:


1. Make a clients array to store every client that joined the server.
2. When any client sends message the server's `onmessage` event gets fired and the message is broadcasted to everyone in the group.

```js
// server
ws.on('message', function message(data) {
	console.log('received on server: %s - 5', data);
	// broadcast this message to everyone in the group
	for (let i = 0; i < clients.length; i++) {
		clients[i].send(`::${data} recieved from ${ws.id}::`);
	}
});
```

3. To take input in terminal use `readline`
```js
// client
ws.on('open', function open() {
	console.log('joined');
	r1.on('line', (input) => {
		ws.send(input); // send terminal input to server
	});
});
```

4. To take the name as input on start and store it in, we will use map as <ws, name>
```js
//server
ws.on('message', function message(data) {
	// data comes as Buffer, convert it to string then parse it to JSON
	let parsed;
	parsed = JSON.parse(data.toString());
	if (parsed.type === "register") {
		// Save client name
		clients.set(ws, parsed.name);
		ws.send(`✅ Registered as ${parsed.name}`);
		return;
	}

	if (parsed.type === "chat") {
		const name = clients.get(ws) || "Unknown";
		const message = `${name}: ${parsed.message}`;
		// broadcast this message to everyone in the group
		for (let client of clients.keys()) {
			if (client.readyState === ws.OPEN) {
				client.send(message);
			}
		}
	}
});
```

```js
// client
let username = null;
ws.on('open', function open() {
	console.log('joined');
	rl.question("Enter your name: ", (name) => {
		username = name.trim();
		ws.send(JSON.stringify({ type: "register", name: username }));
		console.log(`Welcome ${username}! Start typing your messages...`);
	});
	rl.on('line', (input) => {
		// send data as string
		ws.send(JSON.stringify({ type: "chat", message: input })); 
	});
});
```
