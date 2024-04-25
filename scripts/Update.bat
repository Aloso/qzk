@echo off
chcp 1252
cls

echo Änderungen am Code werden abgerufen.
echo:
call git pull || (
  echo: && echo FEHLER! Falls du den Code lokal bearbeitet hast, speichere die Änderungen oder mache sie mit `git reset` rückgängig. && echo: && pause && goto :EOF
)

cls
IF NOT EXIST "%APPDATA%\npm\pnpm" (
  echo pnpm wird installiert... && call npm install -g pnpm
)

echo Abhängigkeiten werden installiert...
call pnpm install || (
  cls && echo Abhängigkeiten werden installiert... && call %APPDATA%\npm\pnpm install
)

cls
echo Abhängigkeiten wurden installiert.
echo:

cls
echo Änderungen wurden abgerufen. Die Website kann jetzt gestartet werden.
echo:

Hilfe.bat update

:EOF