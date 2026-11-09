// Header navigation, deep links, active link and skip link.
const { test, expect, SECTIONS } = require('./fixtures');

const NAV_SECTIONS = SECTIONS.slice(1);

test.describe('navigation', () => {
  test('every nav link points to a rendered section', async ({ page }) => {
    await page.goto('./');
    const hrefs = await page.locator('.nav__link').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(NAV_SECTIONS.map((id) => `#${id}`));
    for (const id of NAV_SECTIONS) await expect(page.locator(`#${id}`)).not.toBeHidden();
  });

  test('desktop: clicking a nav link scrolls to its section and marks it active', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop header only');
    await page.goto('./');
    await expect(page.locator('.nav')).toBeVisible();
    await expect(page.locator('.nav-toggle')).toBeHidden();

    for (const id of ['experience', 'certifications', 'about']) {
      await page.locator(`.nav__link[href="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}-title`)).toBeInViewport();
      await expect(page.locator(`.nav__link[href="#${id}"]`)).toHaveAttribute('aria-current', 'location');
      await expect(page.locator('.nav__link[aria-current]')).toHaveCount(1);
    }
  });

  test('deep link lands on the section after rendering', async ({ page }) => {
    await page.goto('./#certifications');
    await expect(page.locator('#certifications-title')).toBeInViewport();
  });

  test('skip link is the first tab stop and moves focus to main', async ({ page, browserName, isMobile }) => {
    test.skip(isMobile, 'keyboard navigation');
    test.skip(browserName === 'webkit', 'Safari skips links on Tab unless "Press Tab to highlight each item" is on');
    await page.goto('./');
    await page.keyboard.press('Tab');
    const skip = page.locator('a.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  test('reveal animations make content visible as it scrolls in', async ({ page }) => {
    await page.goto('./');
    const card = page.locator('#contact .contact-card');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-visible/);
    await expect(card).toHaveCSS('opacity', '1');
  });

  test('reduced motion shows everything immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.locator('.reveal:not(.is-visible)')).toHaveCount(0);
  });
});
