@echo off
chcp 1252
cls

echo Lasse dieses Fenster offen, solange du die Website verwendest.
echo:
call npm run dev -- --open
