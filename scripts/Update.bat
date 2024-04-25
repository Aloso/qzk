@echo off
chcp 1252
cls

echo �nderungen am Code werden abgerufen.
echo:
call git pull || (
  echo: && echo FEHLER! Falls du den Code lokal bearbeitet hast, speichere die �nderungen oder mache sie mit `git reset` r�ckg�ngig. && echo: && pause && goto :EOF
)

cls
IF NOT EXIST "%APPDATA%\npm\pnpm" (
  echo pnpm wird installiert... && call npm install -g pnpm
)

echo Abh�ngigkeiten werden installiert...
call pnpm install || (
  cls && echo Abh�ngigkeiten werden installiert... && call %APPDATA%\npm\pnpm install
)

cls
echo Abh�ngigkeiten wurden installiert.
echo:

cls
echo �nderungen wurden abgerufen. Die Website kann jetzt gestartet werden.
echo:

Hilfe.bat update

:EOF