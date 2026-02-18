# AgriComply Unified Run Script
# Starts Node backend (5000) + Flask (5001) - single website with chatbot + AI
# Open http://localhost:5001

$root = $PSScriptRoot
$nodeDir = Join-Path $root "AgriComply-AI-main\server"
$pythonExe = Join-Path $root ".venv\Scripts\python.exe"

Write-Host "Starting AgriComply..." -ForegroundColor Green

# Start Node (auth, vault, growth, compliance)
$nodeProc = Start-Process -FilePath "node" -ArgumentList "app.js" -WorkingDirectory $nodeDir -PassThru -WindowStyle Normal

# Start Flask (chat, AI, frontend)
Start-Sleep -Seconds 1
$flaskProc = Start-Process -FilePath $pythonExe -ArgumentList "app.py" -WorkingDirectory $root -PassThru -WindowStyle Normal

Start-Sleep -Seconds 2
Write-Host ""
Write-Host "AgriComply is running!" -ForegroundColor Green
Write-Host "  Open: http://localhost:5001" -ForegroundColor Cyan
Write-Host "  - Dashboard, Growth, Vault, Compliance, Loan Calculator" -ForegroundColor Gray
Write-Host "  - Chatbot - click chat icon in navbar" -ForegroundColor Gray
Write-Host ""
Write-Host "Two console windows are open. Close them to stop the servers." -ForegroundColor Yellow
