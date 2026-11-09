// Responsive layout, no-JS fallback and automated accessibility checks.
const { test, expect, content } = require('./fixtures');
const { test: baseTest } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('layout', () => {
  for (const width of [360, 768, 1024, 1440]) {
    test(`no horizontal scroll at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'viewport widths are covered on desktop engines');
      await page.setViewportSize({ width, height: 900 });
      await page.goto('./');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('header stays visible while scrolling', async ({ page }) => {
    await page.goto('./');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('.site-header .brand')).toBeInViewport();
  });
});

// Plain Playwright test: without JS the console/request listeners are irrelevant.
baseTest.describe('without JavaScript', () => {
  baseTest.use({ javaScriptEnabled: false });

  baseTest('shows the noscript fallback with name and CV link', async ({ page }) => {
    await page.goto('./');
    const fallback = page.locator('.noscript-fallback');
    await expect(fallback.locator('h1')).toHaveText(content.person.name);
    await expect(fallback.locator(`a[href="${content.person.cvUrl}"]`)).toBeVisible();
    await expect(fallback.locator(`a[href="mailto:${content.person.email}"]`)).toBeVisible();
  });
});

test.describe('accessibility (axe)', () => {
  for (const scheme of ['light', 'dark']) {
    test(`no WCAG A/AA violations in ${scheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.goto('./');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`);
      expect(summary).toEqual([]);
    });
  }
});
