# run-tests.ps1
# Script to run Playwright E2E tests (workaround for & in directory name)

$ErrorActionPreference = "Stop"

Write-Host "🧪 Running Playwright E2E Tests..." -ForegroundColor Cyan

# Change to project directory
Set-Location "e:\scripts-python\rust-patterns-&-visuals"

# Check if node_modules exists
if (-not (Test-Path "node_modules/@playwright/test")) {
    Write-Host "❌ Playwright not installed. Run: npm install" -ForegroundColor Red
    exit 1
}

# Start dev server in background
Write-Host "🚀 Starting dev server..." -ForegroundColor Yellow
$devServer = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -NoNewWindow

# Wait for server to start
Write-Host "⏳ Waiting for dev server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Dev server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Dev server failed to start" -ForegroundColor Red
    Stop-Process -Id $devServer.Id -Force
    exit 1
}

# Run Playwright tests
Write-Host "`n🧪 Running E2E tests..." -ForegroundColor Cyan
try {
    node node_modules/@playwright/test/cli.js test --reporter=list
    $testExitCode = $LASTEXITCODE
} catch {
    Write-Host "❌ Tests failed with error: $_" -ForegroundColor Red
    $testExitCode = 1
}

# Stop dev server
Write-Host "`n🛑 Stopping dev server..." -ForegroundColor Yellow
Stop-Process -Id $devServer.Id -Force

# Exit with test exit code
if ($testExitCode -eq 0) {
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Some tests failed" -ForegroundColor Red
}

Exit $testExitCode
