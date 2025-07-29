# Script PowerShell para configurar Google Calendar
# Execute: .\setup-google-calendar.ps1

Write-Host "`n🚀 Configuração do Google Calendar" -ForegroundColor Green
Write-Host "=====================================`n" -ForegroundColor Green

Write-Host "📋 Antes de continuar, certifique-se de que você:" -ForegroundColor Yellow
Write-Host "1. ✅ Criou um projeto no Google Cloud Console" -ForegroundColor White
Write-Host "2. ✅ Habilitou a API do Google Calendar" -ForegroundColor White
Write-Host "3. ✅ Criou credenciais OAuth 2.0 para aplicação web" -ForegroundColor White
Write-Host "4. ✅ Adicionou http://localhost:3001 nas origens JavaScript autorizadas" -ForegroundColor White
Write-Host "`nSe ainda não fez isso, consulte o arquivo GOOGLE_CALENDAR_SETUP.md`n" -ForegroundColor Cyan

$proceed = Read-Host "Deseja continuar com a configuração? (s/n)"
if ($proceed -ne 's' -and $proceed -ne 'sim') {
    Write-Host "`n❌ Configuração cancelada." -ForegroundColor Red
    exit
}

Write-Host "`n📝 Insira suas credenciais do Google Calendar:`n" -ForegroundColor Yellow

# Solicita Client ID
do {
    $clientId = Read-Host "🔑 Client ID (deve terminar com .apps.googleusercontent.com)"
    if (-not $clientId.EndsWith(".apps.googleusercontent.com")) {
        Write-Host "❌ Client ID inválido. Deve terminar com .apps.googleusercontent.com" -ForegroundColor Red
    }
} while (-not $clientId.EndsWith(".apps.googleusercontent.com"))

# Solicita API Key
do {
    $apiKey = Read-Host "🔐 API Key (mínimo 20 caracteres)"
    if ($apiKey.Length -lt 20) {
        Write-Host "❌ API Key muito curta. Verifique se copiou corretamente." -ForegroundColor Red
    }
} while ($apiKey.Length -lt 20)

Write-Host "`n⚙️ Configurando credenciais..." -ForegroundColor Yellow

try {
    # Caminho para o arquivo google-calendar.js
    $filePath = Join-Path $PSScriptRoot "public\js\google-calendar.js"
    
    if (-not (Test-Path $filePath)) {
        throw "Arquivo google-calendar.js não encontrado em $filePath"
    }
    
    # Lê o arquivo atual
    $fileContent = Get-Content $filePath -Raw
    
    # Substitui as credenciais
    $fileContent = $fileContent -replace "this\.CLIENT_ID = 'SEU_CLIENT_ID_AQUI\.apps\.googleusercontent\.com';", "this.CLIENT_ID = '$clientId';"
    $fileContent = $fileContent -replace "this\.API_KEY = 'SUA_API_KEY_AQUI';", "this.API_KEY = '$apiKey';"
    
    # Salva o arquivo atualizado
    Set-Content $filePath $fileContent -Encoding UTF8
    
    Write-Host "`n✅ Credenciais configuradas com sucesso!" -ForegroundColor Green
    Write-Host "`n🎯 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Recarregue a página do sistema (http://localhost:3001)" -ForegroundColor White
    Write-Host "2. Clique em '📅 Conectar Google Calendar'" -ForegroundColor White
    Write-Host "3. Faça login com sua conta Google" -ForegroundColor White
    Write-Host "4. Autorize o aplicativo" -ForegroundColor White
    Write-Host "5. Comece a criar tarefas com notificações!" -ForegroundColor White
    
    Write-Host "`n📚 Para mais informações, consulte GOOGLE_CALENDAR_SETUP.md" -ForegroundColor Cyan
    
    # Pergunta se deseja abrir o navegador
    $openBrowser = Read-Host "`nDeseja abrir o sistema no navegador agora? (s/n)"
    if ($openBrowser -eq 's' -or $openBrowser -eq 'sim') {
        Start-Process "http://localhost:3001"
    }
    
} catch {
    Write-Host "`n❌ Erro ao configurar credenciais: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n🔧 Configuração manual:" -ForegroundColor Yellow
    Write-Host "1. Abra o arquivo: public\js\google-calendar.js" -ForegroundColor White
    Write-Host "2. Substitua 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com' por: $clientId" -ForegroundColor White
    Write-Host "3. Substitua 'SUA_API_KEY_AQUI' por: $apiKey" -ForegroundColor White
}

Write-Host "`nPressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")