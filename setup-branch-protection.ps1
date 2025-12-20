# setup-branch-protection.ps1
# Script to configure GitHub repository with CLI

$ErrorActionPreference = "Stop"

Write-Host "🔐 Configuring GitHub Repository..." -ForegroundColor Cyan

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI not installed. Install from: https://cli.github.com/" -ForegroundColor Red
    exit 1
}

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated. Run: gh auth login" -ForegroundColor Red
    exit 1
}

Write-Host "✅ GitHub CLI authenticated" -ForegroundColor Green

$owner = "southwest-ai-labs"
$repo = "rust-patterns-visuals"

# Enable GitHub Pages (if not already enabled)
Write-Host "`n📄 Checking GitHub Pages status..." -ForegroundColor Yellow
gh api -X PUT "/repos/$owner/$repo/pages" `
  -f source='{"branch":"master","path":"/"}' `
  2>$null

# Enable branch protection for master
Write-Host "`n🛡️ Setting up branch protection for master..." -ForegroundColor Yellow
gh api -X PUT "/repos/$owner/$repo/branches/master/protection" `
  -f required_status_checks='{"strict":true,"contexts":["build-and-test"]}' `
  -f enforce_admins=false `
  -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' `
  -f restrictions=null `
  -f allow_force_pushes=false `
  -f allow_deletions=false

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Branch protection enabled" -ForegroundColor Green
} else {
    Write-Host "⚠️ Branch protection may already be configured" -ForegroundColor Yellow
}

# Enable Discussions
Write-Host "`n💬 Enabling Discussions..." -ForegroundColor Yellow
gh api -X PATCH "/repos/$owner/$repo" `
  -f has_discussions=true

Write-Host "✅ Discussions enabled" -ForegroundColor Green

# Enable Issues
Write-Host "`n📋 Enabling Issues..." -ForegroundColor Yellow
gh api -X PATCH "/repos/$owner/$repo" `
  -f has_issues=true

Write-Host "✅ Issues enabled" -ForegroundColor Green

# Set repository topics
Write-Host "`n🏷️ Setting repository topics..." -ForegroundColor Yellow
gh api -X PUT "/repos/$owner/$repo/topics" `
  -f names='["rust","typescript","react","vite","three-js","education","learning-platform","patterns","pwa","github-pages","e2e-testing","playwright","translation","i18n"]'

Write-Host "✅ Topics set" -ForegroundColor Green

# Enable vulnerability alerts
Write-Host "`n🔒 Enabling security features..." -ForegroundColor Yellow
gh api -X PUT "/repos/$owner/$repo/vulnerability-alerts"
gh api -X PUT "/repos/$owner/$repo/automated-security-fixes"

Write-Host "✅ Security features enabled" -ForegroundColor Green

Write-Host "`n✅ Repository configuration complete!" -ForegroundColor Green
Write-Host "`n📊 Repository status:" -ForegroundColor Cyan
gh repo view "$owner/$repo"

Write-Host "`n🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Push code: git push origin master" -ForegroundColor Gray
Write-Host "   2. CI/CD will automatically deploy to GitHub Pages" -ForegroundColor Gray
Write-Host "   3. View site: https://$owner.github.io/$repo/" -ForegroundColor Gray
