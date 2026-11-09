// Mobile menu (below 896px): open, close by link, Escape and outside click.
const { test, expect } = require('./fixtures');

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  const header = (page) => page.locator('.site-header');
  const toggle = (page) => page.locator('.nav-toggle');

  test('starts closed with the toggle shown', async ({ page }) => {
    await expect(toggle(page)).toBeVisible();
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle(page)).toHaveAttribute('aria-label', 'Open menu');
    await expect(page.locator('.nav__link').first()).toBeHidden();
  });

  test('opens, navigates and closes after choosing a link', async ({ page }) => {
    await toggle(page).click();
    await expect(header(page)).toHaveClass(/is-open/);
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle(page)).toHaveAttribute('aria-label', 'Close menu');
    await expect(page.locator('.nav__link')).toHaveCount(6);
    for (const a of await page.locator('.nav__link').all()) await expect(a).toBeVisible();

    await page.locator('.nav__link[href="#projects"]').click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(header(page)).not.toHaveClass(/is-open/);
    await expect(page.locator('#projects-title')).toBeInViewport();
  });

  test('toggle button closes it again', async ({ page }) => {
    await toggle(page).click();
    await expect(header(page)).toHaveClass(/is-open/);
    await toggle(page).click();
    await expect(header(page)).not.toHaveClass(/is-open/);
  });

  test('Escape closes it and returns focus to the toggle', async ({ page, isMobile }) => {
    test.skip(isMobile, 'needs a keyboard');
    await toggle(page).click();
    await page.keyboard.press('Escape');
    await expect(header(page)).not.toHaveClass(/is-open/);
    await expect(toggle(page)).toBeFocused();
  });

  test('clicking outside closes it', async ({ page }) => {
    await toggle(page).click();
    await expect(header(page)).toHaveClass(/is-open/);
    await page.mouse.click(200, 800);
    await expect(header(page)).not.toHaveClass(/is-open/);
  });

  test('widening to desktop closes it', async ({ page }) => {
    await toggle(page).click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(header(page)).not.toHaveClass(/is-open/);
    await expect(toggle(page)).toBeHidden();
    await expect(page.locator('.nav')).toBeVisible();
  });
});
