Clear-Host
$Host.UI.RawUI.WindowTitle = "Xanghay - Starting Application..."

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🚀 XANGHAY - STARTING APPLICATION" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Starting application..." -ForegroundColor Cyan
Write-Host "   - Frontend (Vite dev server)" -ForegroundColor White
Write-Host "   - Backend (Java JAR)" -ForegroundColor White
Write-Host "   - Opening browser automatically" -ForegroundColor White
Write-Host ""

try {
    npm run start-app
} catch {
    Write-Host ""
    Write-Host "❌ Error starting application!" -ForegroundColor Red
    Write-Host "Check if Java is installed and backend JAR exists." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 