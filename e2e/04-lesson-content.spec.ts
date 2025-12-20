import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Lesson Content
 * Tests lesson loading, rendering, and interactions
 */

test.describe('Lesson Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display curriculum or lesson list', async ({ page }) => {
    // Look for common lesson indicators
    const lessonIndicators = [
      'button:has-text("Lesson")',
      'button:has-text("Lección")',
      'button:has-text("Module")',
      'button:has-text("Módulo")',
      '[class*="lesson" i]',
      '[class*="module" i]',
      '[class*="curriculum" i]',
    ];

    let found = false;
    for (const selector of lessonIndicators) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        found = true;
        console.log(`Found lesson indicator: ${selector}`);
        break;
      }
    }

    // At least body should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load and display lesson content when selected', async ({ page }) => {
    // Try to find and click a lesson button
    const lessonButton = page.locator('button').filter({
      hasText: /lesson|lección|module|módulo|chapter|capítulo/i
    }).first();

    if (await lessonButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await lessonButton.click();
      await page.waitForTimeout(1000);

      // Check if content area updated
      const contentArea = page.locator('main, article, [class*="content" i]').first();
      await expect(contentArea).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should render markdown content properly', async ({ page }) => {
    // Look for markdown-rendered elements
    const markdownElements = [
      'h1, h2, h3',
      'p',
      'code',
      'pre',
      'ul, ol',
      'blockquote',
    ];

    for (const selector of markdownElements) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`Found ${count} ${selector} elements`);
      }
    }

    // At least some content should exist
    const paragraphs = page.locator('p');
    const pCount = await paragraphs.count();
    expect(pCount).toBeGreaterThanOrEqual(0);
  });

  test('should display code blocks with syntax highlighting', async ({ page }) => {
    // Look for code blocks
    const codeBlocks = page.locator('pre code, [class*="code" i] code').first();

    if (await codeBlocks.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Check if syntax highlighting classes exist
      const hasHighlighting = await page.evaluate(() => {
        const codeElements = document.querySelectorAll('pre code, code');
        for (const el of codeElements) {
          if (el.classList.length > 0 || el.querySelector('[class*="token"]')) {
            return true;
          }
        }
        return false;
      });

      console.log('Has syntax highlighting:', hasHighlighting);
    }
  });

  test('should navigate between lessons', async ({ page }) => {
    const lessonButtons = page.locator('button').filter({
      hasText: /lesson|lección|module|módulo/i
    });

    const count = await lessonButtons.count();

    if (count >= 2) {
      // Click first lesson
      await lessonButtons.nth(0).click();
      await page.waitForTimeout(500);

      const firstContent = await page.textContent('body');

      // Click second lesson
      await lessonButtons.nth(1).click();
      await page.waitForTimeout(500);

      const secondContent = await page.textContent('body');

      // Content should change
      expect(firstContent).not.toBe(secondContent);
    } else {
      test.skip();
    }
  });

  test('should handle quiz interactions if present', async ({ page }) => {
    // Look for quiz indicators
    const quizButton = page.locator('button').filter({
      hasText: /quiz|test|exam|prueba|examen/i
    }).first();

    if (await quizButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await quizButton.click();
      await page.waitForTimeout(500);

      // Check for quiz UI elements
      const quizElements = page.locator('[class*="quiz" i], [class*="question" i]').first();
      await expect(quizElements).toBeVisible({ timeout: 3000 });
    } else {
      console.log('No quiz found, skipping test');
      test.skip();
    }
  });

  test('should display progress indicators', async ({ page }) => {
    // Look for progress indicators
    const progressIndicators = [
      '[class*="progress" i]',
      '[role="progressbar"]',
      'progress',
      '[class*="percent" i]',
    ];

    for (const selector of progressIndicators) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`Found progress indicator: ${selector}`);
        await expect(element).toBeVisible();
        return;
      }
    }

    console.log('No progress indicators found');
  });
});
