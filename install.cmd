@echo off
setlocal
title Web File Launcher - Install
echo Web File Launcher - qu4nh
echo.
set "launcherLog=%TEMP%\WebFileLauncher-install.log"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -File "%~dp0native-host\install.ps1" > "%launcherLog%" 2>&1
set "launcherResult=%ERRORLEVEL%"
type "%launcherLog%"
echo.
if "%launcherResult%"=="0" (
  echo Installation completed. Load the extension folder in Chrome or Edge.
) else (
  echo Installation failed. Send the error displayed above for diagnosis.
  echo Windows security policies have not been changed.
)
echo Log saved to: "%launcherLog%"
echo.
echo Press any key to close this window.
pause >nul
exit /b %launcherResult%
