@echo off
chcp 1252
cls

IF NOT EXIST "%APPDATA%\npm\pnpm" (
  echo pnpm wird installiert... && call npm install -g pnpm
)

echo Abh�ngigkeiten werden installiert...
call pnpm install || (
  cls && echo Abh�ngigkeiten werden installiert... && call %APPDATA%\npm\pnpm install
)

cls
echo Abh�ngigkeiten wurden installiert. Die Website kann jetzt gestartet werden.
echo:

Hilfe.bat install