// Every item in content.js reaches the page (and as plain text, never HTML).
const { test, expect, content } = require('./fixtures');

test.describe('content rendering', () => {
  test.beforeEach(async ({ page }) => { await page.goto('./'); });

  test('about paragraphs', async ({ page }) => {
    await expect(page.locator('#about-title')).toHaveText(content.about.title);
    await expect(page.locator('#about p.about__text')).toHaveText(content.about.paragraphs);
  });

  test('expertise cards with icons and items', async ({ page }) => {
    const cards = page.locator('#expertise .expertise > article.card');
    await expect(cards).toHaveCount(content.expertise.length);
    await expect(cards.locator('.card__title')).toHaveText(content.expertise.map((x) => x.title));
    for (const [i, x] of content.expertise.entries()) {
      const card = cards.nth(i);
      await expect(card.locator(`svg.icon--${x.icon}`)).toHaveAttribute('aria-hidden', 'true');
      await expect(card.locator('.card__list > li')).toHaveText(x.items);
    }
  });

  test('experience timeline and earlier roles', async ({ page }) => {
    const items = page.locator('#experience ol.timeline > li.timeline__item');
    await expect(items).toHaveCount(content.experience.length);
    await expect(items.locator('.timeline__company-name')).toHaveText(content.experience.map((j) => j.company));

    const roles = content.experience.flatMap((j) => j.roles);
    await expect(page.locator('#experience .timeline__title')).toHaveText(roles.map((r) => r.title));
    await expect(page.locator('#experience .timeline__dates')).toHaveText(roles.map((r) => `${r.start} – ${r.end}`));

    const earlier = content.earlierExperience || [];
    await expect(page.locator('#experience li.earlier__item')).toHaveCount(earlier.length);
    if (earlier.length) await expect(page.locator('#experience .earlier__company')).toHaveText(earlier.map((e) => e.company));
  });

  test('project cards with status labels', async ({ page }) => {
    const cards = page.locator('#projects article.project-card');
    const projects = content.projects.length ? content.projects : [{}, {}, {}];
    await expect(cards).toHaveCount(projects.length);

    const labels = { placeholder: 'Coming soon', wip: 'In progress' };
    for (const [i, p] of content.projects.entries()) {
      const card = cards.nth(i);
      const status = labels[p.status] ? p.status : 'live';
      await expect(card).toHaveAttribute('data-status', status);
      await expect(card.locator('.project-card__title')).toHaveText(p.title);
      if (labels[status]) await expect(card.locator('.project-card__status')).toHaveText(labels[status]);
      else await expect(card.locator('.project-card__status')).toHaveCount(0);
      await expect(card.locator('.tag')).toHaveText(p.tags || []);
      if (p.image) await expect(card.locator('img')).toHaveJSProperty('complete', true);
    }
  });

  test('certification groups and items', async ({ page }) => {
    const groups = page.locator('#certifications .cert-group');
    await expect(groups).toHaveCount(content.certifications.length);
    await expect(groups.locator('.cert-group__title')).toHaveText(content.certifications.map((g) => g.group));
    for (const [i, g] of content.certifications.entries()) {
      await expect(groups.nth(i).locator('.cert__name')).toHaveText(g.items.map((c) => c.name));
    }
  });

  test('contact card with email, LinkedIn and CV buttons', async ({ page }) => {
    const card = page.locator('#contact .contact-card');
    await expect(card.locator('.contact-card__text')).toHaveText(content.contact.text);
    const { email, linkedin, github, cvUrl } = content.person;

    await expect(card.locator('a.btn--primary')).toHaveAttribute('href', `mailto:${email}`);
    await expect(card.locator('.contact-card__email a')).toHaveText(email);
    await expect(card.locator(`a.btn[href="${linkedin}"]`)).toBeVisible();
    await expect(card.locator(`a.btn[href="${cvUrl}"]`)).toBeVisible();
    await expect(card.locator('a.btn', { hasText: 'GitHub' })).toHaveCount(github ? 1 : 0);
  });

  test('content is rendered as text, not parsed as HTML', async ({ page }) => {
    // Nothing in main should be a <script>, <iframe> or inline event handler.
    await expect(page.locator('main script, main iframe, main [onerror], main [onclick]')).toHaveCount(0);
  });
});
