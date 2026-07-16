const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const robot = require('robotjs');
const path = require('path');
const { execSync } = require('child_process');

app.use(express.static(path.join(__dirname, 'public')));

// Fetch native Windows monitor dimensions
const screenSize = robot.getScreenSize();

// Helper function to pull the Windows Tailscale adapter IP via PowerShell
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
    console.log('📱 iPad Connected to Windows Stream Engine!');
    
    // Map percentages from iPad screen directly to Windows display coordinates
    socket.on('mouse-move', (data) => {
        const targetX = Math.min(Math.max(data.x * screenSize.width, 0), screenSize.width);
        const targetY = Math.min(Math.max(data.y * screenSize.height, 0), screenSize.height);
        robot.moveMouse(targetX, targetY);
    });

    socket.on('mouse-click', () => {
        robot.mouseClick();
    });

    socket.on('disconnect', () => {
        console.log('📱 iPad Disconnected');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Windows Server running on port ${PORT}`);
    console.log(`🖥️ Desktop Resolution Detected: ${screenSize.width}x${screenSize.height}`);
    console.log(`=================================================`);

    // Output Tailscale connection link if active
    const tsIP = getTailscaleIP();
    if (tsIP) {
        console.log(`🔒 SECURE TAILSCALE CONNECTION DETECTED!`);
        console.log(`🔗 iPad Link: http://${tsIP}:${PORT}`);
    } else {
        console.log(`⚠️ Tailscale IP not found.`);
        console.log(`💡 Verify that the Tailscale app is running and active on this PC.`);
    }
    console.log(`=================================================`);
});
