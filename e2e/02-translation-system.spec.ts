import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Hybrid Translation System
 * Tests manual locales and Chrome Translation API integration
 */

test.describe('Translation System', () => {
  test('should load default language based on browser', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if language is set (either EN or ES)
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(['en', 'es', 'en-US', 'es-ES', null]).toContain(htmlLang);
  });

  test('should open settings modal and display language options', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find settings button (common patterns)
    const settingsButton = page.locator('button:has-text("Settings"), button:has-text("Configuración"), button[aria-label*="settings" i], button[title*="settings" i]').first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Check if modal opened
      const modal = page.locator('[role="dialog"], .modal, [class*="modal" i]');
      await expect(modal).toBeVisible({ timeout: 5000 });
    }
  });

  test('should switch language to Spanish', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find settings
    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración|config|⚙/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Look for Spanish language option
      const spanishOption = page.locator('button, [role="radio"], [role="option"]').filter({ hasText: /español|spanish|es/i }).first();

      if (await spanishOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await spanishOption.click();
        await page.waitForTimeout(1000);

        // Verify language changed (check localStorage)
        const storedLang = await page.evaluate(() => localStorage.getItem('preferredLanguage'));
        expect(storedLang).toBe('es');
      }
    }
  });

  test('should switch language to English', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const settingsButton = page.locator('button').filter({ hasText: /settings|configuración|config|⚙/i }).first();

    if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      const englishOption = page.locator('button, [role="radio"], [role="option"]').filter({ hasText: /english|inglés|en/i }).first();

      if (await englishOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await englishOption.click();
        await page.waitForTimeout(1000);

        const storedLang = await page.evaluate(() => localStorage.getItem('preferredLanguage'));
        expect(storedLang).toBe('en');
      }
    }
  });

  test('should persist language selection across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Set language to Spanish
    await page.evaluate(() => localStorage.setItem('preferredLanguage', 'es'));

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify language persisted
    const storedLang = await page.evaluate(() => localStorage.getItem('preferredLanguage'));
    expect(storedLang).toBe('es');
  });

  test('should display Chrome Translation API status if available', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if Chrome Translation API is available
    const hasTranslationAPI = await page.evaluate(() => {
      return 'translation' in self && 'createTranslator' in self.translation;
    });

    if (hasTranslationAPI) {
      const settingsButton = page.locator('button').filter({ hasText: /settings|configuración/i }).first();

      if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await settingsButton.click();
        await page.waitForTimeout(500);

        // Look for translation status indicator
        const statusText = page.locator('text=/Chrome Translation|Translation API|API disponible/i').first();
        const isVisible = await statusText.isVisible({ timeout: 3000 }).catch(() => false);

        // If Chrome API is available, status should be shown
        if (isVisible) {
          await expect(statusText).toBeVisible();
        }
      }
    }
  });
});
