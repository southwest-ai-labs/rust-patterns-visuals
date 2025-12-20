# E2E Testing Documentation

## Overview

This project uses **Playwright** for End-to-End (E2E) testing. Playwright is a modern testing framework that supports multiple browsers and provides excellent support for headless testing.

## Test Structure

```
e2e/
├── 01-basic-navigation.spec.ts      # Basic page loading and navigation
├── 02-translation-system.spec.ts    # Hybrid translation system tests
├── 03-settings-modal.spec.ts        # Settings modal interactions
├── 04-lesson-content.spec.ts        # Lesson loading and rendering
├── 05-performance.spec.ts           # Performance metrics and accessibility
├── 06-visual-components.spec.ts     # Three.js and 3D visualizations
└── 07-github-integration.spec.ts    # GitHub Pages and PWA functionality
```

## Running Tests

### Headless Mode (Default - CI/CD)

Run all tests in headless mode across all configured browsers:

```bash
npm run test:e2e
```

This is the **recommended mode for CI/CD** and automated testing. Tests run faster and don't require a display.

### Headed Mode (See the Browser)

Run tests with visible browser windows:

```bash
npm run test:e2e:headed
```

Useful for debugging and seeing exactly what the tests are doing.

### Interactive UI Mode

Launch Playwright's interactive UI for debugging:

```bash
npm run test:e2e:ui
```

Features:
- Watch tests run in real-time
- Pause and step through tests
- Inspect DOM states
- View network requests

### Debug Mode

Run tests in debug mode with Playwright Inspector:

```bash
npm run test:e2e:debug
```

Allows you to:
- Set breakpoints
- Step through test code
- Inspect page state
- Record actions

### Browser-Specific Tests

Run tests on specific browsers:

```bash
# Chromium only
npm run test:e2e:chromium

# Firefox only
npm run test:e2e:firefox

# WebKit (Safari) only
npm run test:e2e:webkit

# Mobile browsers
npm run test:e2e:mobile
```

### View Test Report

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

## Test Coverage

### 1. Basic Navigation (`01-basic-navigation.spec.ts`)

Tests fundamental page functionality:
- Homepage loading
- Navigation elements visibility
- View transitions
- Browser back/forward navigation
- Responsive design on mobile viewports

### 2. Translation System (`02-translation-system.spec.ts`)

Tests the hybrid translation system:
- Default language detection
- Language switching (EN ↔ ES)
- Settings modal language controls
- Language persistence in localStorage
- Chrome Translation API integration
- Translation status indicators

### 3. Settings Modal (`03-settings-modal.spec.ts`)

Tests settings modal interactions:
- Opening/closing modal
- Close button functionality
- Click-outside-to-close behavior
- Escape key to close
- Focus trap implementation
- Settings sections visibility

### 4. Lesson Content (`04-lesson-content.spec.ts`)

Tests lesson functionality:
- Curriculum display
- Lesson loading and rendering
- Markdown content rendering
- Code syntax highlighting
- Lesson navigation
- Quiz interactions
- Progress indicators

### 5. Performance (`05-performance.spec.ts`)

Tests performance metrics:
- Page load time (< 10s)
- First Contentful Paint (< 3s)
- Console errors detection
- Page metadata (title, lang, viewport)
- Network failure handling
- Keyboard navigation
- Service worker support
- Cumulative Layout Shift (< 0.5)

### 6. Visual Components (`06-visual-components.spec.ts`)

Tests 3D visualizations:
- Three.js library loading
- Canvas rendering
- Interactive visualizations
- Canvas interactions (mouse events)
- Mermaid diagram rendering
- Visualization controls
- Responsive canvas sizing
- Memory leak prevention

### 7. GitHub Integration (`07-github-integration.spec.ts`)

Tests deployment and PWA features:
- GitHub Pages base path
- Static asset loading
- JavaScript bundle loading
- CSS stylesheet loading
- Cache headers
- Service worker registration
- PWA manifest.json
- 404 error handling

## Configuration

### Playwright Config (`playwright.config.ts`)

Key settings:
- **Test Directory**: `./e2e`
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Base URL**: `http://localhost:3000`
- **Screenshots**: Only on failure
- **Videos**: Retain on failure
- **Traces**: On first retry

### Browser Projects

Tests run on:
- ✅ Desktop Chrome
- ✅ Desktop Firefox
- ✅ Desktop Safari (WebKit)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## Best Practices

### Writing Tests

1. **Use descriptive test names**:
   ```typescript
   test('should switch language to Spanish', async ({ page }) => {
     // ...
   });
   ```

2. **Wait for network idle**:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Use robust selectors**:
   ```typescript
   // Good - semantic
   const button = page.locator('button[aria-label="Settings"]');

   // Avoid - fragile
   const button = page.locator('.btn-123');
   ```

4. **Handle optional elements**:
   ```typescript
   if (await element.isVisible({ timeout: 5000 }).catch(() => false)) {
     await element.click();
   } else {
     test.skip();
   }
   ```

### Debugging Failed Tests

1. **Check screenshots**: `test-results/` folder contains screenshots on failure
2. **View traces**: Use `npx playwright show-trace trace.zip`
3. **Run in headed mode**: See browser interactions
4. **Use debug mode**: Step through test code
5. **Check console output**: Tests log useful debugging info

## CI/CD Integration

### GitHub Actions

Add to `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## Headless Testing

Playwright runs in **headless mode by default**, meaning browsers run without a visible UI. This is ideal for:

- ✅ CI/CD pipelines
- ✅ Automated testing
- ✅ Faster execution
- ✅ Resource efficiency
- ✅ Running on servers without display

To force headless mode explicitly:

```bash
# Already headless by default
npm run test:e2e

# To see browsers (headed mode)
npm run test:e2e:headed
```

## Troubleshooting

### Tests timing out

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60 * 1000, // 60 seconds
```

### Elements not found

Add explicit waits:
```typescript
await page.waitForSelector('button', { timeout: 10000 });
```

### Network issues

Check base URL matches dev server:
```typescript
baseURL: 'http://localhost:3000',
```

### Browser installation issues

Reinstall browsers:
```bash
npx playwright install --with-deps
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## Contributing

When adding new features:
1. Write corresponding E2E tests
2. Run tests locally before committing
3. Ensure tests pass in CI/CD
4. Update this documentation if needed

## Test Maintenance

- **Review tests monthly**: Ensure they still match current UI
- **Update selectors**: As UI changes, update test selectors
- **Add new tests**: For new features or bug fixes
- **Remove obsolete tests**: For deprecated features
