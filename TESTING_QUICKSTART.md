# Quick Start: E2E Testing

## Running Tests (Headless Mode)

Due to the `&` character in the directory name, use the PowerShell script:

### Windows PowerShell

```powershell
# Run all tests in headless mode
.\run-tests-headless.ps1

# Run tests with dev server
.\run-tests.ps1
```

### Command Line (Alternative)

If you rename the directory to remove `&`, you can use npm scripts:

```bash
# Run all tests (headless)
npm run test:e2e

# Run with visible browser
npm run test:e2e:headed

# Interactive UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Mobile devices
npm run test:e2e:mobile

# View report
npm run test:e2e:report
```

## Quick Test Commands

### Using Node Directly (Workaround for & in path)

```powershell
# Run all tests
node node_modules/@playwright/test/cli.js test

# Run specific test file
node node_modules/@playwright/test/cli.js test e2e/01-basic-navigation.spec.ts

# Run in headed mode
node node_modules/@playwright/test/cli.js test --headed

# Run specific project
node node_modules/@playwright/test/cli.js test --project=chromium

# Show report
node node_modules/@playwright/test/cli.js show-report
```

## Install Browsers

```powershell
# Install all browsers
node node_modules/@playwright/test/cli.js install

# Install specific browser
node node_modules/@playwright/test/cli.js install chromium
node node_modules/@playwright/test/cli.js install firefox
node node_modules/@playwright/test/cli.js install webkit

# Install with system dependencies
node node_modules/@playwright/test/cli.js install --with-deps
```

## Test Structure

```
e2e/
├── 01-basic-navigation.spec.ts      ✅ Page loading & navigation
├── 02-translation-system.spec.ts    ✅ Language switching (EN/ES)
├── 03-settings-modal.spec.ts        ✅ Settings interactions
├── 04-lesson-content.spec.ts        ✅ Lesson rendering
├── 05-performance.spec.ts           ✅ Performance metrics
├── 06-visual-components.spec.ts     ✅ Three.js & 3D visuals
└── 07-github-integration.spec.ts    ✅ GitHub Pages & PWA
```

## What Gets Tested

### ✅ Navigation
- Homepage loading
- Menu interactions
- Responsive design
- Mobile viewport

### ✅ Translation System
- English ↔ Spanish switching
- localStorage persistence
- Chrome Translation API
- Manual locales fallback

### ✅ Settings Modal
- Open/close functionality
- Escape key handling
- Click outside to close
- Language controls

### ✅ Lessons
- Curriculum display
- Markdown rendering
- Code highlighting
- Quiz interactions

### ✅ Performance
- Load time < 10s
- First Contentful Paint < 3s
- No console errors
- Service worker
- Accessibility

### ✅ Visualizations
- Three.js rendering
- Canvas interactions
- Mermaid diagrams
- Memory management

### ✅ GitHub Integration
- Static asset loading
- PWA manifest
- Service worker
- Cache headers

## Debugging

### View Test Results

```powershell
# Open HTML report
node node_modules/@playwright/test/cli.js show-report
```

### Run Single Test

```powershell
# Run specific file
node node_modules/@playwright/test/cli.js test e2e/02-translation-system.spec.ts
```

### Debug Mode

```powershell
# Step through tests
node node_modules/@playwright/test/cli.js test --debug
```

### UI Mode

```powershell
# Interactive testing
node node_modules/@playwright/test/cli.js test --ui
```

## CI/CD

### GitHub Actions

Tests run automatically on push/PR:

```yaml
- name: Install Playwright
  run: npm ci && npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

### Test Output

- ✅ **Screenshots** on failure → `test-results/`
- ✅ **Videos** on failure → `test-results/`
- ✅ **Traces** on retry → `test-results/`
- ✅ **HTML Report** → `playwright-report/`

## Headless vs Headed

### Headless (Default)
- ✅ Faster execution
- ✅ No UI overhead
- ✅ Ideal for CI/CD
- ✅ Runs on servers

```powershell
node node_modules/@playwright/test/cli.js test
```

### Headed (Visual)
- 👁️ See browser actions
- 🐛 Easier debugging
- ⏱️ Slower execution

```powershell
node node_modules/@playwright/test/cli.js test --headed
```

## Tips

1. **Start dev server first** if running tests manually
2. **Use PowerShell scripts** for convenience
3. **Check test-results/** folder for failure artifacts
4. **Run single tests** when debugging specific issues
5. **Use --headed** mode to watch tests execute

## Documentation

Full documentation: [docs/E2E_TESTING.md](./docs/E2E_TESTING.md)
