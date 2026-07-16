const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { InputSimulation, ScreenManager } = require('@lucyus/actionify');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

app.use(express.static(path.join(__dirname, 'public')));

// Fetch native Windows monitor dimensions safely
let screenWidth = 1920;
let screenHeight = 1080;
try {
    const screens = ScreenManager.getScreens();
    if(screens && screens.length > 0) {
        screenWidth = screens[0].width;
        screenHeight = screens[0].height;
    }
} catch (e) {}

// Network Scan: Grab Local Wi-Fi/Ethernet IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let name in interfaces) {
        for (let iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal && !name.toLowerCase().includes('tailscale')) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// Network Scan: Grab Tailscale IP via PowerShell
function getTailscaleIP() {
    try {
        const command = 'powershell -Command "(Get-NetIPAddress -InterfaceAlias *tailscale* -AddressFamily IPv4).IPAddress"';
        const ip = execSync(command, { encoding: 'utf8' }).trim();
        return ip || null;
    } catch (error) {
        return null;
    }
}

io.on('connection', (socket) => {
    console.log('\x1b[36m%s\x1b[0m', '📱 [CONNECTED] iPad hooked into Stream Engine!');
    
    socket.on('mouse-move', (data) => {
        const targetX = Math.round(Math.min(Math.max(data.x * screenWidth, 0), screenWidth));
        const targetY = Math.round(Math.min(Math.max(data.y * screenHeight, 0), screenHeight));
        InputSimulation.mouseMove(targetX, targetY);
    });

    socket.on('mouse-click', () => {
        InputSimulation.mouseLeftClick();
    });

    socket.on('disconnect', () => {
        console.log('\x1b[31m%s\x1b[0m', '📱 [DISCONNECTED] iPad left the stream.');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    const localIP = getLocalIP();
    const tsIP = getTailscaleIP();
    
    console.clear();
    console.log(`\x1b[35m=====================================================\x1b[0m`);
    console.log(`   🕹️  ⚡ EGU CLOUD GAMING STREAM CONTROLLER ⚡  🕹️`);
    console.log(`\x1b[35m=====================================================\x1b[0m`);
    console.log(` 🖥️  [HOST STATUS]   🟢 Windows Core Engine Active`);
    console.log(` 📊  [RESOLUTION]    ${screenWidth}x${screenHeight} (Native Widescreen)`);
    console.log(` 📡  [PORT BINDS]    Local Port: ${PORT}`);
    console.log(`\x1b[35m=====================================================\x1b[0m`);
    console.log(` 🌐  [OPTION 1: LOCAL WI-FI NETWORK]`);
    console.log(`     👉 iPad Link: \x1b[4m\x1b[36mhttp://${localIP}:${PORT}\x1b[0m`);
    console.log(`     (Best for devices connected to the same home router)`);
    console.log(`\x1b[35m-----------------------------------------------------\x1b[0m`);
    
    if (tsIP) {
        console.log(` 🔒  [OPTION 2: SECURE TAILSCALE NETWORK]`);
        console.log(`     👉 iPad Link: \x1b[4m\x1b[32mhttp://${tsIP}:${PORT}\x1b[0m`);
        console.log(`     (Best for playing over Cellular Data / Outside home)`);
    } else {
        console.log(` 🔒  [OPTION 2: TAILSCALE NETWORK]`);
        console.log(`     ⚠️  Tailscale offline. Start application for remote link.`);
    }
    console.log(`\x1b[35m=====================================================\x1b[0m`);
    console.log(` 🚀 Waiting for iPad connection requests... \n`);
});
