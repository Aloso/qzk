@echo off
chcp 1252 && cls

cd internal
call update.bat
echo Website wird auf Fehler getestet...

call npm run build -- --logLevel warn && (
  cls && echo Super! Die Website funktioniert.
) || (
  echo: && echo ---------------------------------------- && echo: && echo Es sind Fehler aufgetreten. && echo TIPP: Suche nach einer Zeile, die mit "Error:" beginnt.
)

echo:
pause
