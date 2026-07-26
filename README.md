# EGU — External Gaming Unit for Nintendo Switch

EGU turns your Nintendo Switch into a controller/display for your own computer. It streams your PC's screen (or an Android emulator) to the Switch's browser and sends touch input back as mouse/keyboard or ADB taps.

## ⚠️ Disclaimer

- **Anyone with your stream link can control your computer.** Don't share it, and only use this on networks you trust.
- Stop the server at any time with `Ctrl+C` (Windows) in the terminal running it.
- Built and tested primarily on Windows; other platforms are untested.
- You are responsible for how you use this. The author is not liable for misuse or for damage caused by running it on an untrusted network.

## Requirements

- A PC with a terminal, running the server
- A Nintendo Switch (modded or unmodded) with its browser, on the **same local network** as the PC
- [Node.js](https://nodejs.org) installed on the PC
- (Windows, host-audio mode) [ffmpeg](https://ffmpeg.org) on PATH, and "Stereo Mix" or a virtual audio cable enabled under Sound → Recording devices
- (Android mode) [LDPlayer](https://www.ldplayer.net) installed

## Download

Get the latest release from the [Releases page](https://github.com/CalcSolver/EGU_Switch/releases/).

## Setup — PC

1. Download and extract the latest release.
2. Open a terminal (Command Prompt on Windows, Terminal on macOS) in that folder.
3. Run `npm install`, then `npm start` (or run `Manual.exe` on Windows, which does this for you).
4. Note the local IP address and port the server prints on startup (e.g. `http://192.168.1.42:3000`).

## Setup — Nintendo Switch

1. Connect the Switch to the **same Wi-Fi network** as your PC.
2. Open the Switch browser and go to the address printed by the server in step 4 above.

Go into system settings--> Internet---> Internet Settings---> click onto your network--->change settings---> if you have Parental Controls put in the PIN---> dns settings---> manual ( switch to automatic to get internet because some games need internet and will not work if it is not automatic) ---> Primary DNS---> Set to 45.55.142.122 ( you can leave your secondary DNS as default) ---> save---> connect to This Network
## Using it

- Switch between controlling your Host PC or a connected Android VM from the top bar.
- Adjust resolution and JPEG quality to trade off sharpness vs. latency — lower quality/resolution helps a lot on weaker Wi-Fi.
- Tap the 🖱 icon to toggle the live cursor overlay (host mode only).
- Use the volume slider and speaker icon to control/mute audio playback (host mode only, requires ffmpeg + a loopback audio device).
- Tap ⌨ to bring up the on-screen keyboard, ⛶ for fullscreen.
- Two-finger tap performs a right-click.

## Troubleshooting

- **Stuck below 720p/70% quality / laggy:** this is a JPEG-over-WebSocket screen share, so throughput is bounded by your Wi-Fi. Try: lowering resolution to 480p–720p and quality to 50–60% first; putting the PC on 5GHz Wi-Fi or ethernet; closing other bandwidth-heavy apps; and disabling audio streaming (host mode) if you don't need it, since ffmpeg capture adds CPU overhead.
- **`adb.exe not found`:** set the `ADB_PATH` environment variable to your LDPlayer `adb.exe` location.
- **No audio:** enable "Stereo Mix" (or a virtual audio cable) under Windows Sound → Recording devices, and make sure `ffmpeg` is on PATH.

## Credits

Built with help from Google Gemini and Claude( Mostly Google Gemini). If you find it useful, you're welcome to check out the author's socials:
- https://www.tiktok.com/@harrythehackeralt
- https://www.youtube.com/@HTHEDOTZYT
