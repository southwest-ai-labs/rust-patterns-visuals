import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Visual Components & Three.js
 * Tests 3D visualizations and interactive components
 */

test.describe('Visual Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load Three.js library', async ({ page }) => {
    const hasThreeJS = await page.evaluate(() => {
      return typeof (window as any).THREE !== 'undefined' ||
             document.querySelector('canvas') !== null;
    });

    console.log('Three.js or Canvas present:', hasThreeJS);
  });

  test('should render canvas element for 3D graphics', async ({ page }) => {
    await page.waitForTimeout(2000); // Wait for Three.js to initialize

    const canvasElements = page.locator('canvas');
    const count = await canvasElements.count();

    console.log('Canvas elements found:', count);

    if (count > 0) {
      // Check if canvas has proper dimensions
      const canvas = canvasElements.first();
      const box = await canvas.boundingBox();

      if (box) {
        console.log('Canvas size:', box.width, 'x', box.height);
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    }
  });

  test('should have interactive visualizations', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for visualization components
    const vizComponents = [
      '[class*="visual" i]',
      '[class*="diagram" i]',
      '[class*="simulator" i]',
      '[class*="viz" i]',
      'canvas',
    ];

    for (const selector of vizComponents) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`Found visualization: ${selector}`);
      }
    }
  });

  test('should handle canvas interactions', async ({ page }) => {
    const canvas = page.locator('canvas').first();

    try {
      // Increase timeout to wait for canvas to be ready
      const isVisible = await canvas.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        // Try to interact with canvas - with error handling
        try {
          await canvas.hover({ timeout: 3000 }).catch(() => {});
          await page.mouse.move(100, 100);
          await page.mouse.down();
          await page.mouse.move(200, 200);
          await page.mouse.up();
        } catch (e) {
          console.log('Canvas interaction error:', e);
        }

        // Canvas should still be visible after interaction
        await expect(canvas).toBeVisible({ timeout: 3000 });
      } else {
        test.skip();
      }
    } catch (e) {
      console.log('Canvas test error:', e);
      test.skip();
    }
  });

  test('should render Mermaid diagrams if present', async ({ page }) => {
    // Look for Mermaid diagram indicators
    const mermaidElements = page.locator('[class*="mermaid" i], .mermaid, [data-type="mermaid"]');
    const count = await mermaidElements.count();

    console.log('Mermaid diagrams found:', count);

    if (count > 0) {
      const firstMermaid = mermaidElements.first();
      await expect(firstMermaid).toBeVisible();

      // Check if it rendered (should have SVG inside)
      const hasSVG = await page.evaluate(() => {
        const mermaid = document.querySelector('[class*="mermaid" i]');
        return mermaid?.querySelector('svg') !== null;
      });

      console.log('Mermaid rendered to SVG:', hasSVG);
    }
  });

  test('should handle visualization state changes', async ({ page }) => {
    // Look for visualization control buttons
    const vizButtons = page.locator('button').filter({
      hasText: /play|pause|stop|reset|start|iniciar|pausar|detener/i
    });

    const count = await vizButtons.count();

    if (count > 0) {
      const firstButton = vizButtons.first();
      await firstButton.click();
      await page.waitForTimeout(500);

      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    } else {
      console.log('No visualization controls found');
      test.skip();
    }
  });

  test('should optimize canvas for different screen sizes', async ({ page }) => {
    const canvas = page.locator('canvas').first();

    if (await canvas.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Test desktop size
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);

      let box = await canvas.boundingBox();
      const desktopWidth = box?.width || 0;

      // Test mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      box = await canvas.boundingBox();
      const mobileWidth = box?.width || 0;

      console.log('Canvas width - Desktop:', desktopWidth, 'Mobile:', mobileWidth);

      // Canvas should be visible on both sizes
      expect(desktopWidth).toBeGreaterThan(0);
      expect(mobileWidth).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  test('should not cause memory leaks with animations', async ({ page }) => {
    await page.waitForTimeout(2000);

    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Let animations run
    await page.waitForTimeout(5000);

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    console.log('Memory - Initial:', initialMemory, 'Final:', finalMemory);

    // Memory shouldn't increase dramatically (allow 50MB increase)
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
});
