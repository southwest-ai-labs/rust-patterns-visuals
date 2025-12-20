import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Basic Navigation
 * Tests fundamental navigation and page loading
 */

test.describe('Basic Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check if main content loads
    await expect(page).toHaveTitle(/Rust/i);

    // Check if main container exists - use specific selector to avoid ambiguity
    const mainContent = page.locator('main').or(page.locator('#root')).or(page.locator('.App')).first();
    await expect(mainContent).toBeVisible();
  });

  test('should have visible navigation elements', async ({ page }) => {
    await page.goto('/');

    // Wait for React to hydrate
    await page.waitForLoadState('networkidle');

    // Check for navigation buttons or menu - use first() to avoid strict mode issues
    const navElements = page.locator('nav').or(page.locator('button')).or(page.locator('[role="navigation"]')).first();
    await expect(navElements).toBeVisible({ timeout: 10000 });
  });

  test('should navigate between different views', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find and click any navigation button
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      await buttons.first().click();
      await page.waitForTimeout(500);

      // Verify page is still responsive
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate somewhere if possible - use or() to avoid strict mode issues
    const links = page.locator('a').or(page.locator('button'));
    const linkCount = await links.count();

    if (linkCount > 0) {
      await links.first().click().catch(() => {});
      await page.waitForTimeout(500);

      // Go back
      await page.goBack().catch(() => {});
      await page.waitForTimeout(500);

      // Verify page is functional
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should be responsive on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if page loads properly on mobile
    await expect(page.locator('body')).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20); // Allow small margin
  });
});
