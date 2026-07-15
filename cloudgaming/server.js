const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const robot = require('robotjs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { 
    transports: ['websocket'],
    cors: { origin: "*" }
});

// Serve your public assets (index.html, manual.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

let activeServerInstance = null;
let streamInterval = null;

// Handle Switch/iPad/Client Connection Pipeline
io.on('connection', (socket) => {
    console.log('🎮 Client linked to system input pipeline!');

    // Handle incoming screen coordinates mapping to real host mouse actions
    socket.on('mouse-move', (data) => {
        try {
            if (data && typeof data.x === 'number' && typeof data.y === 'number') {
                robot.moveMouse(data.x, data.y);
            }
        } catch (err) {
            console.error("Failed to execute mouse-move:", err.message);
        }
    });

    socket.on('mouse-click', () => {
        try {
            robot.mouseClick();
        } catch (err) {
            console.error("Failed to execute mouse-click:", err.message);
        }
    });

    socket.on('mouse-down', () => {
        try {
            robot.mouseToggle("down");
        } catch (err) {
            console.error("Failed to execute mouse-down:", err.message);
        }
    });

    socket.on('mouse-up', () => {
        try {
            robot.mouseToggle("up");
        } catch (err) {
            console.error("Failed to execute mouse-up:", err.message);
        }
    });

    // Handle Keyboard Mapping Toggles
    socket.on('key-down', (data) => {
        try {
            if (data && data.key) {
                robot.keyToggle(data.key.toLowerCase(), "down");
            }
        } catch (err) {
            console.error("Failed key-down:", err.message);
        }
    });

    socket.on('key-up', (data) => {
        try {
            if (data && data.key) {
                robot.keyToggle(data.key.toLowerCase(), "up");
            }
        } catch (err) {
            console.error("Failed key-up:", err.message);
        }
    });

    // Simulate screen frames (replace this mock loop with your actual desktop capture stream)
    streamInterval = setInterval(() => {
        // Send a dummy frame down the pipe (you will plug your actual grabber loop here)
        socket.emit('screen-frame', Buffer.alloc(0)); 
    }, 1000 / 30); // 30 FPS Stream loop

    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected.');
        if (streamInterval) clearInterval(streamInterval);
    });
});

function startServer() {
    const lockFilePath = path.join(__dirname, 'server.gitignore');

    // 1. Guard check: Make sure server.gitignore exists
    if (!fs.existsSync(lockFilePath)) {
        console.log("🛑 Blocked: server.gitignore is missing! Creating a safety lock.");
        fs.writeFileSync(lockFilePath, 'No', 'utf8');
        throw new Error("server.gitignore file created but initialized to 'No'. Put 'Yes' inside to allow startup.");
    }

    // 2. Read contents of server.gitignore
    const runPermission = fs.readFileSync(lockFilePath, 'utf8').trim();
    if (runPermission.toLowerCase() !== 'yes') {
        throw new Error("Execution Denied: server.gitignore does not contain 'Yes'.");
    }

    // 3. Start hosting
    if (!activeServerInstance) {
        activeServerInstance = server.listen(3000, () => {
            console.log('✅ EGU Stream server running on http://localhost:3000');
        });
    }
}

function stopServer() {
    if (activeServerInstance) {
        activeServerInstance.close(() => {
            console.log('🛑 EGU Stream server went offline.');
        });
        activeServerInstance = null;
    }
    if (streamInterval) {
        clearInterval(streamInterval);
    }
}

module.exports = { startServer, stopServer };
