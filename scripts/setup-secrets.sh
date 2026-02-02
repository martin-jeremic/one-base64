#!/bin/bash
# Setup GitHub Secrets for VS Code Marketplace Publishing
# This script creates the VSCE_PAT secret needed for publishing to VS Code Marketplace
#
# Prerequisites:
# 1. Install GitHub CLI: https://cli.github.com/
# 2. Authenticate: gh auth login
# 3. Have your VS Code Personal Access Token ready
#
# Usage:
#   chmod +x scripts/setup-secrets.sh
#   ./scripts/setup-secrets.sh

echo "GitHub Secrets Setup Script"
echo "==========================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "✗ GitHub CLI is not installed or not in PATH"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

gh_version=$(gh --version | head -1)
echo "✓ GitHub CLI found: $gh_version"

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "✗ Not authenticated with GitHub CLI"
    echo "Run: gh auth login"
    exit 1
fi

echo ""
echo "Getting your VS Code Personal Access Token..."
echo "Steps:"
echo "1. Go to: https://dev.azure.com/ (NOT Azure DevOps organizations)"
echo "2. Click on your profile icon (top right)"
echo "3. Select 'Personal access tokens'"
echo "4. Click '+ New Token'"
echo "5. Name: 'VS Code Marketplace'"
echo "6. Organization: 'All accessible organizations'"
echo "7. Scopes: 'Full access' OR select 'Marketplace > Manage'"
echo "8. Create and copy the token (you won't see it again)"
echo ""
echo "Alternative: https://marketplace.visualstudio.com/manage/publishers"
echo ""





read -sp "Paste your VSCE_PAT token: " token
echo ""

if [ -z "$token" ]; then
    echo "✗ Token cannot be empty"
    exit 1
fi

echo ""
echo "Creating GitHub secret 'VSCE_PAT'..."

if echo "$token" | gh secret set VSCE_PAT; then
    echo "✓ Secret 'VSCE_PAT' created successfully!"
else
    echo "✗ Failed to create secret"
    exit 1
fi

echo ""
echo "✓ Setup complete!"
echo ""
echo "Your VS Code extension can now be published to the marketplace."
echo "Trigger the publish workflow from GitHub Actions when ready."
