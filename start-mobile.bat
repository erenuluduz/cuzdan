@echo off
title Butce & Net Varlik - Mobil Sunucu (Expo)
set PATH=C:\Program Files\nodejs;%PATH%

echo ========================================================
echo   Butce & Net Varlik Mobil Uygulama Baslatiliyor...
echo ========================================================
echo.
echo [1/2] Web sunucusu arka planda baslatiliyor (Port 3000)...
start /b "WebServer" node server.js

echo [2/2] Expo mobil gelistirme sunucusu baslatiliyor...
echo.
echo iPhone'unuzdan Expo Go uygulamasini acip
echo ekrana gelecek QR kodu kameranizla tarayiniz.
echo.
cd mobile
npx.cmd expo start --lan
pause
