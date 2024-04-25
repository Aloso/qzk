@echo off
chcp 1252
cls

IF NOT EXIST "%APPDATA%\npm\pnpm" (
  echo pnpm wird installiert... && call npm install -g pnpm
)

echo Abhängigkeiten werden installiert...
call pnpm install || (
  cls && echo Abhängigkeiten werden installiert... && call %APPDATA%\npm\pnpm install
)

cls
echo Abhängigkeiten wurden installiert. Die Website kann jetzt gestartet werden.
echo:

Hilfe.bat install