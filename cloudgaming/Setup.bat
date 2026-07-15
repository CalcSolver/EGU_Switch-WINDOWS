@echo off
title EGU Engine Setup Wizard
cls
echo ====================================================
echo 🎮 EGU ENGINE FIRST-TIME INSTALLATION WIZARD
echo ====================================================
echo.
echo Please keep this window open while we configure your host files.
echo.
echo [1/3] Approving background script execution limits...
call npm install-scripts approve electron
call npm install-scripts approve robotjs
call npm install-scripts approve sharp
echo.
echo [2/3] Downloading system frameworks...
call npm install --foreground-scripts
echo.
echo [3/3] Compiling interface hardware bridges...
call npm rebuild robotjs --build-from-source
echo.
echo ====================================================
echo ✅ SETUP COMPLETED SUCCESSFULLY!
echo You can now close this window and open 'run.bat'.
echo ====================================================
pause
