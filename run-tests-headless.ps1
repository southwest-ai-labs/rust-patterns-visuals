# run-tests-headless.ps1
# Script to run Playwright E2E tests in headless mode

$ErrorActionPreference = "Stop"

Write-Host "🧪 Running Playwright E2E Tests (Headless Mode)..." -ForegroundColor Cyan

Set-Location "e:\scripts-python\rust-patterns-&-visuals"

# Check if Playwright is installed
if (-not (Test-Path "node_modules/@playwright/test")) {
    Write-Host "❌ Playwright not installed. Installing..." -ForegroundColor Red
    npm install
}

# Check if browsers are installed
Write-Host "📦 Checking Playwright browsers..." -ForegroundColor Yellow
node node_modules/@playwright/test/cli.js install --with-deps chromium

Write-Host "`n🧪 Running tests in headless mode..." -ForegroundColor Cyan
node node_modules/@playwright/test/cli.js test --project=chromium --reporter=list

$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Some tests failed (exit code: $exitCode)" -ForegroundColor Red
}

Write-Host "`n📊 View detailed report:" -ForegroundColor Cyan
Write-Host "   node node_modules/@playwright/test/cli.js show-report" -ForegroundColor Gray

Exit $exitCode
