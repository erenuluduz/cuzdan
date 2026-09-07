@echo off
chcp 65001 >nul
title Bütçe ve Net Varlık Takip Programı

echo ========================================================
echo        BÜTÇE VE NET VARLIK TAKİP UYGULAMASI
echo ========================================================
echo.
echo Uygulama yerel web sunucusu üzerinde başlatılıyor...
echo Tarayıcınız otomatik olarak açılacaktır.
echo.
echo Adres: http://localhost:3000
echo.
echo Programı kapatmak için bu pencereyi kapatabilirsiniz.
echo ========================================================
echo.

start "" "http://localhost:3000"
python -m http.server 3000
