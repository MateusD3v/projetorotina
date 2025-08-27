@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo 🚀 Configuração Automática do Google Calendar
echo =============================================
echo.
echo Este script irá configurar automaticamente as credenciais
echo do Google Calendar no seu sistema de tarefas.
echo.
echo Escolha uma opção:
echo.
echo [1] Configurar usando PowerShell (Recomendado)
echo [2] Configurar usando Node.js
echo [3] Abrir guia manual (GOOGLE_CALENDAR_SETUP.md)
echo [4] Sair
echo.
set /p choice=Digite sua escolha (1-4): 

if "%choice%"=="1" goto powershell
if "%choice%"=="2" goto nodejs
if "%choice%"=="3" goto manual
if "%choice%"=="4" goto exit

echo Opção inválida!
pause
goto exit

:powershell
echo.
echo Executando configuração via PowerShell...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0setup-google-calendar.ps1"
goto end

:nodejs
echo.
echo Executando configuração via Node.js...
echo.
node "%~dp0setup-google-calendar.js"
goto end

:manual
echo.
echo Abrindo guia manual...
start "" "%~dp0GOOGLE_CALENDAR_SETUP.md"
echo.
echo O arquivo GOOGLE_CALENDAR_SETUP.md foi aberto.
echo Siga as instruções detalhadas para configurar manualmente.
pause
goto exit

:end
echo.
echo ✅ Configuração concluída!
echo.
echo 💡 Dicas:
echo - Recarregue a página do sistema (http://localhost:3001)
echo - Clique em "📅 Conectar Google Calendar"
echo - Faça login e autorize o aplicativo
echo.
set /p open=Deseja abrir o sistema no navegador? (s/n): 
if /i "%open%"=="s" start "" "http://localhost:3001"

:exit
echo.
echo Obrigado por usar o sistema!
pause