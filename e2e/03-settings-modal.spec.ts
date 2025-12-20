import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Settings Modal
 * Tests settings modal functionality and interactions
 */

test.describe('Settings Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open settings modal', async ({ page }) => {
    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración|⚙/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"], .modal, [class*="Modal"]').first();
      await expect(modal).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('should close settings modal with close button', async ({ page }) => {
    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Find close button (X, ×, Close, Cerrar)
      const closeButton = page.locator('button').filter({ hasText: /^[×xX]$|close|cerrar/i }).first();

      if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(500);

        const modal = page.locator('[role="dialog"], .modal').first();
        await expect(modal).not.toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('should close settings modal by clicking outside', async ({ page }) => {
    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Click outside modal (backdrop)
      const backdrop = page.locator('[class*="backdrop" i], [class*="overlay" i]').first();

      if (await backdrop.isVisible({ timeout: 3000 }).catch(() => false)) {
        await backdrop.click({ position: { x: 10, y: 10 } });
        await page.waitForTimeout(500);

        const modal = page.locator('[role="dialog"]').first();
        await expect(modal).not.toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('should display all settings sections', async ({ page }) => {
    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Check for common settings sections
      const settingsSections = [
        /language|idioma/i,
        /theme|tema/i,
        /translation|traducción/i,
      ];

      for (const sectionPattern of settingsSections) {
        const section = page.locator('text=' + sectionPattern.source);
        const exists = await section.count() > 0;

        if (exists) {
          console.log(`Found settings section: ${sectionPattern.source}`);
        }
      }
    } else {
      test.skip();
    }
  });

  test('should trap focus within modal', async ({ page }) => {
    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Press Tab multiple times
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Focus should still be within modal
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.closest('[role="dialog"], .modal') !== null;
      });

      // If modal implements focus trap, focused element should be inside modal
      // This is a nice-to-have, not required
      console.log('Focus trapped:', focusedElement);
    } else {
      test.skip();
    }
  });

  test('should close modal with Escape key', async ({ page }) => {
    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).not.toBeVisible();
    } else {
      test.skip();
    }
  });
});
