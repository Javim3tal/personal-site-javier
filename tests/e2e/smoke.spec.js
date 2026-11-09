// The page loads cleanly and renders every section from content.js.
const { test, expect, content, SECTIONS } = require('./fixtures');

test.describe('smoke', () => {
  test('loads with title, description and a single h1 with the name', async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveTitle(content.meta.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', content.meta.description);
    await expect(page.locator('html')).toHaveAttribute('lang', content.meta.lang);
    await expect(page.locator('html')).toHaveClass(/\bjs\b/);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(content.person.name);
    await expect(page.locator('.site-header .brand')).toHaveText(content.person.name);
  });

  test('renders every section, in order, with a heading', async ({ page }) => {
    await page.goto('./');
    const ids = await page.locator('main > section[id]').evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(SECTIONS);

    for (const id of SECTIONS.slice(1)) {
      const section = page.locator(`#${id}`);
      await expect(section, `#${id} is shown`).toBeVisible();
      await expect(section.locator('h2.section__title')).toHaveCount(1);
      await expect(section).toHaveAttribute('aria-labelledby', `${id}-title`);
    }
  });

  test('hero shows tagline, CTAs, location, availability and stats', async ({ page }) => {
    await page.goto('./');
    const hero = page.locator('#home');
    await expect(hero.locator('.hero__eyebrow')).toHaveText(content.hero.eyebrow);
    await expect(hero.locator('.hero__tagline')).toHaveText(content.hero.headline);
    await expect(hero.locator('.hero__lead')).toHaveText(content.hero.lead);
    await expect(hero.locator('.hero__location')).toHaveText(content.person.location);
    await expect(hero.locator('.hero__availability')).toHaveText(content.person.availability);

    const ctas = hero.locator('.hero__actions a.btn');
    await expect(ctas).toHaveText(content.hero.ctas.map((c) => c.label));
    await expect(ctas.first()).toHaveClass(/btn--primary/);

    const stats = hero.locator('ul.stats > li.stat');
    await expect(stats).toHaveCount(content.stats.length);
    await expect(stats.locator('.stat__value')).toHaveText(content.stats.map((s) => s.value));
  });

  test('footer shows the current year and name', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('[data-year]')).toHaveText(String(new Date().getFullYear()));
    await expect(page.locator('footer [data-name]')).toHaveText(content.person.name);
  });

  test('never publishes a phone number', async ({ page }) => {
    await page.goto('./');
    const html = await page.content();
    // Spanish mobile/landline formats, with or without +34 and separators.
    expect(html).not.toMatch(/(?:\+34[\s.-]?)?\b[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/);
    expect(html).not.toMatch(/href="tel:/i);
  });
});
