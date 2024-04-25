echo Änderungen am Code werden abgerufen...
echo:
call git pull || (
  echo: && echo FEHLER! Falls du den Code lokal bearbeitet hast, speichere die Änderungen oder mache sie mit 'git reset' rückgängig. && echo: && pause && exit
)
cls

where /q pnpm
IF ERRORLEVEL 1 (
    echo pnpm wird heruntergeladen... && call npm install -g pnpm && cls
)

echo Abhängigkeiten werden heruntergeladen...
call pnpm install
cls
