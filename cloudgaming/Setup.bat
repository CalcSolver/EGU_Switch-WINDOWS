@echo off
cd /d "%~dp0"
echo 🧹 Cleaning out old module files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
echo 📦 Fetching clean Windows packages...
cmd /c npm install
echo --------------------------------------
echo ✅ Windows Setup Complete!
echo --------------------------------------
pause
