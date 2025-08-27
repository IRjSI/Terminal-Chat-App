const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

wss.on('connection', function connection(ws) {
    console.log("server started");
    
    ws.on('error', console.error);

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

    ws.send('seed - 3');
});