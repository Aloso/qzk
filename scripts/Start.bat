@echo off
chcp 1252 && cls

cd internal
call update.bat
echo Lasse dieses Fenster offen, solange du die Website verwendest.
echo:
call npm run dev -- --open
