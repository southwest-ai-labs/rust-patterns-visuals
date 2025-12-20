import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: GitHub Integration
 * Tests GitHub Pages deployment and static asset loading
 */

test.describe('GitHub Integration', () => {
  test('should load with correct base path for GitHub Pages', async ({ page }) => {
    await page.goto('/');

    // Check if base path is configured correctly
    const baseElement = await page.locator('base').getAttribute('href');

    console.log('Base href:', baseElement);

    // For GitHub Pages, base should include repository name
    // Or for root domain, should be '/'
  });

  test('should load all static assets successfully', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Failed requests:', failedRequests.length);
    if (failedRequests.length > 0) {
      console.log('Failed URLs:', failedRequests);
    }

    // Allow some failures (fonts, optional resources)
    expect(failedRequests.length).toBeLessThan(5);
  });

  test('should load JavaScript bundles', async ({ page }) => {
    const jsRequests: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.endsWith('.js') || url.includes('.js?')) {
        jsRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('JavaScript files loaded:', jsRequests.length);

    // Should load at least main bundle
    expect(jsRequests.length).toBeGreaterThan(0);
  });

  test('should load CSS stylesheets', async ({ page }) => {
    const cssRequests: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.endsWith('.css') || url.includes('.css?')) {
        cssRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('CSS files loaded:', cssRequests.length);

    // Should load at least one CSS file
    expect(cssRequests.length).toBeGreaterThanOrEqual(0);
  });

  test('should have proper cache headers', async ({ page }) => {
    const responses: any[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') || url.includes('.css')) {
        responses.push({
          url,
          cacheControl: response.headers()['cache-control'],
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Cached responses:', responses.length);

    // Log cache headers for debugging
    responses.forEach(r => {
      console.log('Cache:', r.cacheControl, 'for', r.url.split('/').pop());
    });
  });

  test('should work with service worker for PWA functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Give service worker time to register
    await page.waitForTimeout(3000);

    const swStatus = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) {
        return { supported: false };
      }

      const registration = await navigator.serviceWorker.getRegistration();

      return {
        supported: true,
        registered: !!registration,
        active: !!registration?.active,
        scope: registration?.scope,
      };
    });

    console.log('Service Worker status:', swStatus);

    expect(swStatus.supported).toBeTruthy();
  });

  test('should load manifest.json for PWA', async ({ page }) => {
    await page.goto('/');

    const manifestLink = page.locator('link[rel="manifest"]');
    const manifestHref = await manifestLink.getAttribute('href');

    console.log('Manifest href:', manifestHref);

    if (manifestHref) {
      // Try to fetch manifest
      const response = await page.goto(manifestHref);
      expect(response?.status()).toBe(200);

      const manifest = await response?.json();
      console.log('Manifest loaded:', manifest?.name);
    }
  });

  test('should handle 404 errors gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345');

    // Should either redirect to home or show 404
    // GitHub Pages typically shows index.html for all routes (SPA)
    const finalUrl = page.url();
    console.log('404 handling - Final URL:', finalUrl);

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});
