echo �nderungen am Code werden abgerufen...
echo:
call git pull || (
  echo: && echo FEHLER! Falls du den Code lokal bearbeitet hast, speichere die �nderungen oder mache sie mit 'git reset' r�ckg�ngig. && echo: && pause && exit
)
cls

where /q pnpm
IF ERRORLEVEL 1 (
    echo pnpm wird heruntergeladen... && call npm install -g pnpm && cls
)

echo Abh�ngigkeiten werden heruntergeladen...
call pnpm install
cls
