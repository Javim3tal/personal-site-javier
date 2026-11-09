// Light/dark theme: system default, toggle, persistence.
const { test, expect } = require('./fixtures');

for (const scheme of ['light', 'dark']) {
  test(`follows the system preference (${scheme}) when nothing is stored`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
    await expect(page.locator('.theme-toggle')).toHaveAttribute('aria-pressed', scheme === 'dark' ? 'true' : 'false');
  });
}

test('toggle switches theme, updates colours and persists across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./');
  const html = page.locator('html');
  const toggle = page.locator('.theme-toggle');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await expect(toggle).toBeVisible();
  await expect(html).toHaveAttribute('data-theme', 'light');
  const lightBg = await bg();

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle.locator('svg.icon--sun')).toHaveCount(1);
  await expect.poll(bg).not.toBe(lightBg);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
  const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', themeColor);

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(toggle.locator('svg.icon--moon')).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
});

test('stored choice wins over the system preference', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
