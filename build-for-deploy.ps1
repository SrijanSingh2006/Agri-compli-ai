# Build AgriComply client for production deployment
# Uses /api and /chat (same-origin) so Flask can serve and proxy everything

$clientDir = "AgriComply-AI-main\client"
$env:VITE_API_BASE_URL = "/api"
$env:VITE_CHATBOT_API_URL = "/chat"
$env:VITE_CHATBOT_PAGE_URL = "/chatbot-ui.html"

Set-Location $clientDir
npm run build
Set-Location ..\..

Write-Host "Build complete. dist is ready for deployment." -ForegroundColor Green
