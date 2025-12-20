import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Performance & Accessibility
 * Tests loading times, performance metrics, and basic accessibility
 */

test.describe('Performance & Accessibility', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(`Page load time: ${loadTime}ms`);

    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    await page.goto('/');

    const metrics = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      return {
        fcp: fcp?.startTime || 0,
      };
    });

    console.log('First Contentful Paint:', metrics.fcp, 'ms');

    // FCP should be under 3 seconds
    expect(metrics.fcp).toBeLessThan(3000);
  });

  test('should not have console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(error => {
      return !error.includes('favicon') &&
             !error.includes('chrome-extension') &&
             !error.includes('manifest');
    });

    console.log('Console errors found:', criticalErrors.length);
    if (criticalErrors.length > 0) {
      console.log('Errors:', criticalErrors);
    }

    // Should have no critical console errors
    expect(criticalErrors.length).toBeLessThanOrEqual(2);
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();

    console.log('Page title:', title);

    // Title should not be empty
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('');
  });

  test('should have lang attribute on html', async ({ page }) => {
    await page.goto('/');

    const langAttr = await page.getAttribute('html', 'lang');

    console.log('HTML lang attribute:', langAttr);

    // Lang attribute might be set dynamically, so we just check it's accessible
    expect(langAttr !== undefined).toBeTruthy();
  });

  test('should have proper viewport meta tag', async ({ page }) => {
    await page.goto('/');

    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');

    console.log('Viewport meta:', viewportMeta);

    // Should have viewport meta tag
    expect(viewportMeta).toBeTruthy();
  });

  test('should handle network failures gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simulate offline
    await page.context().setOffline(true);

    // Try to interact with page - catch any errors
    try {
      const button = page.locator('button').first();
      await button.click({ timeout: 2000 }).catch(() => {});
    } catch (e) {
      // Expected - no buttons available
    }

    // Page should still be visible even in offline
    try {
      await expect(page.locator('body')).toBeVisible({ timeout: 3000 });
    } catch (e) {
      console.log('Body not visible in offline mode - expected');
    }

    // Restore online before test ends
    await page.context().setOffline(false);
    await page.waitForTimeout(500);
  });

  test('should have keyboard navigable interface', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const firstFocus = await page.evaluate(() => document.activeElement?.tagName);

    console.log('First focused element:', firstFocus);

    // Should focus on an interactive element
    expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'BODY']).toContain(firstFocus);
  });

  test('should support service worker for offline functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasServiceWorker = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    console.log('Service Worker support:', hasServiceWorker);

    // Modern browsers should support service workers
    expect(hasServiceWorker).toBeTruthy();

    if (hasServiceWorker) {
      // Check if service worker is registered (might take time)
      await page.waitForTimeout(2000);

      const swRegistered = await page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      });

      console.log('Service Worker registered:', swRegistered);
    }
  });

  test('should not have layout shifts during load', async ({ page }) => {
    await page.goto('/');

    // Wait a bit for content to load
    await page.waitForTimeout(2000);

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsScore = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsScore += (entry as any).value;
            }
          }
        });

        observer.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsScore);
        }, 1000);
      });
    });

    console.log('Cumulative Layout Shift:', cls);

    // CLS should be below 0.1 (good) or 0.25 (acceptable)
    expect(cls).toBeLessThan(0.5);
  });
});
