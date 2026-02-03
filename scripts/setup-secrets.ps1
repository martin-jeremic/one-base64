# Setup GitHub Secrets for VS Code Marketplace Publishing
# This script creates the VSCE_PAT secret needed for publishing to VS Code Marketplace
#
# Prerequisites:
# 1. Install GitHub CLI: https://cli.github.com/
# 2. Authenticate: gh auth login
# 3. Have your VS Code Personal Access Token ready
#
# Usage:
#   .\scripts\setup-secrets.ps1

Write-Host "GitHub Secrets Setup Script" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# Check if gh CLI is installed
try {
    $ghVersion = gh --version | Select-Object -First 1
    Write-Host "[OK] GitHub CLI found: $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] GitHub CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Install from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
try {
    gh auth status | Out-Null
} catch {
    Write-Host "[ERROR] Not authenticated with GitHub CLI" -ForegroundColor Red
    Write-Host "Run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Getting your VS Code Personal Access Token..." -ForegroundColor Cyan
Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://dev.azure.com/ (NOT Azure DevOps organizations)"
Write-Host "2. Click on your profile icon (top right)"
Write-Host "3. Select 'Personal access tokens'"
Write-Host "4. Click '+ New Token'"
Write-Host "5. Name: 'VS Code Marketplace'"
Write-Host "6. Organization: 'All accessible organizations'"
Write-Host "7. Scopes: 'Full access' OR select 'Marketplace > Manage'"
Write-Host "8. Create and copy the token (you won't see it again)"
Write-Host ""
Write-Host "Alternative: https://marketplace.visualstudio.com/manage/publishers" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "Paste your VSCE_PAT token"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "[ERROR] Token cannot be empty" -ForegroundColor Red
    exit 1
}


Write-Host ""
Write-Host "Creating GitHub secret 'VSCE_PAT'..." -ForegroundColor Cyan

try {
    # Create the secret using GitHub CLI
    $token | gh secret set VSCE_PAT
    Write-Host "[OK] Secret 'VSCE_PAT' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create secret" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""
Write-Host "[OK] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your VS Code extension can now be published to the marketplace." -ForegroundColor Cyan
Write-Host "Trigger the publish workflow from GitHub Actions when ready." -ForegroundColor Cyan
