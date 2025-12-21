# GitHub Pages Deployment Guide

## Current Setup

- **Repository**: https://github.com/southwest-ai-labs/rust-patterns-visuals
- **GitHub Pages URL**: https://southwest-ai-labs.github.io/rust-patterns-visuals/
- **Source Branch**: `main`
- **Deployment Branch**: `gh-pages`

## Workflow Configuration

The deployment is handled by GitHub Actions workflow: `.github/workflows/deploy_pages.yml`

### Automated Deployment
The workflow is triggered automatically on every push to `main` branch:

```yaml
on:
  push:
    branches: 
      - main
  workflow_dispatch:
```

### Build Process
1. Checkout code from `main`
2. Setup Node.js 20
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Upload `dist/` artifacts to GitHub Pages
6. Deploy automatically

## Verify Deployment Status

### Via GitHub Web UI
1. Go to: https://github.com/southwest-ai-labs/rust-patterns-visuals/actions
2. Look for the "Deploy to GitHub Pages" workflow
3. Check the latest run status
4. If successful, site updates at: https://southwest-ai-labs.github.io/rust-patterns-visuals/

### Via Command Line
```bash
# Check if gh-pages branch exists
git branch -a | grep gh-pages

# Check gh-pages branch commits
git log -10 gh-pages --oneline

# Check deployment history
git log --all --graph --decorate --oneline | head -20
```

## Troubleshooting

### If workflow fails:
1. Check GitHub Actions logs: https://github.com/southwest-ai-labs/rust-patterns-visuals/actions
2. Common issues:
   - `npm install` failures (check internet connection in runner)
   - Build errors (check TypeScript compilation)
   - Missing `dist/` directory (verify build output)

### If GitHub Pages doesn't update:
1. Verify GitHub Pages settings: Settings > Pages > Build and deployment
2. Source should be: "Deploy from a branch"
3. Branch should be: `gh-pages` with `/root` folder

### Manual Deployment (if needed)
```bash
# Build locally
npm run build

# Deploy using subtree split
git push origin $(git subtree split --prefix=dist HEAD):gh-pages --force

# Or create temp directory
mkdir -p /tmp/gh-pages && cp -R dist/* /tmp/gh-pages/
cd /tmp/gh-pages
git init && git add . && git commit -m "Manual deploy"
git remote add origin https://github.com/southwest-ai-labs/rust-patterns-visuals.git
git push origin HEAD:gh-pages --force
```

## Configuration Files

- **vite.config.ts**: Base path set to `/rust-patterns-visuals/`
- **package.json**: Homepage set to `https://southwest-ai-labs.github.io/rust-patterns-visuals`
- **.github/workflows/deploy_pages.yml**: Automated deployment workflow

## API Configuration

The app uses Google Gemini API with client-side key storage:
- API key is prompted in modal on first use
- Stored in browser's localStorage as `gemini_api_key`
- No secrets committed to repository

Last Updated: December 21, 2025
