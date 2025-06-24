@echo off
REM Remove Electron build, rebuild, and start Electron for the project

REM Remove Electron build output (adjust path if needed)
echo Removing Electron build output...
if exist .\.build\electron rmdir /s /q .\.build\electron

REM Run Electron build
echo Building Electron...
npm run electron

REM Start Electron (adjust command if needed)
echo Starting Electron...
call .\scripts\code.bat
