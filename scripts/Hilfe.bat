@echo off

set is_install=0
set is_update=0
set is_iou=0
IF "%1" == "install" set is_install=1 && set is_iou=1
IF "%1" == "update" set is_update=1 && set is_iou=1

IF NOT %is_iou%==1 chcp 1252 && cls

echo Scripte:
echo:
IF NOT %is_iou%==1 echo   Installation  Muss das erste Mal vor dem Starten ausgeführt werden.
IF NOT %is_iou%==1 echo:
echo   Start         Öffnet die Website im Browser.
echo                 Es werden noch nicht veröffentlichte Inhalte angezeigt.
echo:
IF NOT %is_update%==1 echo   Update        Bringt die Website auf den neuesten Stand.
IF NOT %is_update%==1 echo                 Dies ist NICHT nach Änderungen in Contentful nötig, nur
IF NOT %is_update%==1 echo                 nach Code-Änderungen.
IF NOT %is_update%==1 echo:
echo   Test          Prüft die Website auf Fehler
echo                 Dabei werden zum Beispiel ungültige Links erkannt.
echo:

pause