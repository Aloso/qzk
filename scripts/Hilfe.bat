@echo off

set is_install=0
set is_update=0
set is_iou=0
IF "%1" == "install" set is_install=1 && set is_iou=1
IF "%1" == "update" set is_update=1 && set is_iou=1

IF NOT %is_iou%==1 chcp 1252 && cls

echo Scripte:
echo:
IF NOT %is_iou%==1 echo   Installation  Muss das erste Mal vor dem Starten ausgef�hrt werden.
IF NOT %is_iou%==1 echo:
echo   Start         �ffnet die Website im Browser.
echo                 Es werden noch nicht ver�ffentlichte Inhalte angezeigt.
echo:
IF NOT %is_update%==1 echo   Update        Bringt die Website auf den neuesten Stand.
IF NOT %is_update%==1 echo                 Dies ist NICHT nach �nderungen in Contentful n�tig, nur
IF NOT %is_update%==1 echo                 nach Code-�nderungen.
IF NOT %is_update%==1 echo:
echo   Test          Pr�ft die Website auf Fehler
echo                 Dabei werden zum Beispiel ung�ltige Links erkannt.
echo:

pause