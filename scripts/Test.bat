@echo off
chcp 1252
cls

echo Website wird auf Fehler gepr�ft...

call npm run build -- --logLevel warn && (
  cls && echo Super! Die Website funktioniert.
) || (
  echo: && echo ---------------------------------------- && echo: && echo Es sind Fehler aufgetreten. && echo TIPP: Suche nach einer Zeile, die mit "Error:" anf�ngt.
)

echo:
pause
