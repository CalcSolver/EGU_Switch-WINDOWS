const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const robot = require('robotjs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { 
    transports: ['websocket'],
    cors: { origin: "*" }
});

// Serve everything inside the public folder automatically
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('🎮 Client linked to host controller pipeline.');

    socket.on('mouse-move', (data) => {
        try {
            if (data && typeof data.x === 'number' && typeof data.y === 'number') {
                robot.moveMouse(data.x, data.y);
            }
        } catch (err) {}
    });

    socket.on('mouse-click', () => {
        try { robot.mouseClick(); } catch (err) {}
    });

    socket.on('key-down', (data) => {
        try { if (data && data.key) robot.keyToggle(data.key.toLowerCase(), "down"); } catch (err) {}
    });

    socket.on('key-up', (data) => {
        try { if (data && data.key) robot.keyToggle(data.key.toLowerCase(), "up"); } catch (err) {}
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n====================================================`);
    console.log(`🚀 EGU STREAM ENGINE IS NOW ONLINE`);
    console.log(`🌐 Playing locally: http://localhost:${PORT}`);
    console.log(`====================================================\n`);
});
