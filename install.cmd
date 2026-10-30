@echo off
setlocal
title Web File Launcher - Install
echo Web File Launcher - qu4nh
echo.
set "launcherLog=%TEMP%\WebFileLauncher-install.log"
"%~dp0native-host\WebFileLauncher.Host.exe" --install > "%launcherLog%" 2>&1
set "launcherResult=%ERRORLEVEL%"
type "%launcherLog%"
echo.
if "%launcherResult%"=="0" (
  echo Installation completed. Load the extension folder in Chrome or Edge.
) else (
  echo Installation failed. Send the error displayed above for diagnosis.
  echo Check that the ZIP is fully extracted and .NET Framework 4.6+ is available.
  echo Smart App Control or organizational policy may block unsigned executables.
  echo Windows security policies have not been changed.
)
echo Log saved to: "%launcherLog%"
echo.
echo Press any key to close this window.
pause >nul
exit /b %launcherResult%
