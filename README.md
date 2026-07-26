## **DISCLAIMER**:
-*If someone gets your link, they can control your computer*\
-You can turn it off by using the control.html
# EXTERNAL GAMING UNIT FOR THE NINTENDO SWITCH
-External Gaming Unit is a folder that lets you play external games, hence the name, you can connect it up to your computer and control your computer from your nintendo switch
  # DEPENDENCIES
 - Nintendo Switch modded/ non-modded
 - laptop/ macbook or device with a terminal
 # Download:
 https://github.com/CalcSolver/EGU_Switch/releases/
 
 <img width="4032" height="3024" alt="IMG_0881" src="https://github.com/user-attachments/assets/79ed0ac9-4337-460e-93dd-de51fe3be234" />
 # INTRUCTIONS FOR PC/LAPTOP
1. Download the lastest update of the folder
2. Open Windows Command Prompt or Apple's Terminal
3. Run the Manual.exe and follow the intructions
## INTRUCTIONS FOR NINTENDO
1. open system settings
2. open internet settings
3. click on your network name
4. click change settings
5. go to dns settings and change it to manual mode
6. type 045.055.142.122
7. save
8. connect to this network
# NOTICES:
- To stop EGU simply open Terminal or Command Prompt and do ctr c or cmd c
- This is has only been tested on Windows Command Prompt
- It is not my fault if someone hacks your system and controls your device
- Use with care
- This was built with Google Gemini so it will make mistakes
- Internet for nintendo games will not work until you change dns settings back to automatic
# DONATION:
If you enjoy this software, feel free to subscribe and follow to my socials

# EGU Cloud Gaming Server

Low-latency LAN screen streaming + remote control, built for viewing/controlling
from an iPad/iPhone browser. Two modes, switchable live from the top bar:

- **Host PC** — streams your primary display, input goes through RobotJS
- **Android VM** — streams a running Android emulator (tested against LDPlayer)
  via ADB, input goes through `adb shell input tap/swipe/keyevent/text`

## 1. Install

```bat
npm install
```

> **RobotJS note:** it's a native addon (needs node-gyp + a C++ toolchain on
> Windows — Visual Studio Build Tools with "Desktop development with C++").
> It installs cleanly on Node 18 LTS. If `npm install` fails on newer Node
> versions, switch to Node 18 with nvm-windows, or swap in a maintained fork
> (e.g. `@jitsi/robotjs`) in `package.json` — the API used here is unchanged.

## 2. Run

```bat
run.bat
```

which just does `npm start` (`node server.js`). Server listens on
`http://<your-pc-ip>:3000` — open that URL from Safari on the iPad, same Wi-Fi.

## 3. Android VM / LDPlayer setup

1. Start LDPlayer and boot into Android.
2. Find its ADB port: LDPlayer's multi-instance manager shows it, or just run:
   ```
   adb connect 127.0.0.1:5555
   adb devices
   ```
   Instance 0 is normally `5555`, instance 1 is `5557`, etc.
3. If your port isn't 5555, set it before starting the server:
   ```bat
   set ANDROID_SERIAL=127.0.0.1:5557
   run.bat
   ```
4. In the web UI, tap **Android VM** in the mode switcher.

The server auto-runs `adb connect` on mode switch and reads the device
resolution via `adb shell wm size`, so touch coordinates map correctly
regardless of the emulator's resolution.

## 4. Performance notes (read this)

- **Host mode** captures via RobotJS at up to 20 fps and is genuinely low
  latency on a wired LAN.
- **Android mode** captures via `adb exec-out screencap -p`, which is the
  simplest reliable way to grab frames with zero extra native dependencies —
  but it's a screenshot pipe, not a video codec. Expect roughly **8–12 fps**
  and higher latency than Mode A, especially over Wi-Fi. If you need
  60fps/H.264-grade Android streaming, that requires swapping the capture
  layer for `scrcpy`'s H.264 stream + a client-side decoder (e.g.
  Broadway.js/WebCodecs) — a materially bigger project than screencap polling,
  and not something this server does today.
- Android input is gesture-based: quick taps become `input tap`, drags become
  `input swipe` computed from touch-down → touch-up distance/duration.
  There's no true "held drag" over ADB the way there is with RobotJS on the
  host — that's an ADB/Android limitation, not a bug here.

## 5. Config

All tunables are at the top of `server.js` (`CONFIG` object): port, adb path,
android serial, target fps per mode, and the three resolution presets.

## 6. Files

- `server.js` — Express + Socket.io backend, capture pipeline, input routing
- `public/index.html` — mobile/iPad client (mode switch, resolution/quality,
  ping meter, fullscreen, virtual keyboard trigger, D-pad + action overlay,
  touch-to-mouse)
- `package.json` — dependencies + `npm start`
