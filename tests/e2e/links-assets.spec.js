// CV download, external link safety and that every local file the page uses exists.
const { test, expect, content } = require('./fixtures');

test.describe('links and assets', () => {
  test('CV links download a real PDF', async ({ page, request }) => {
    await page.goto('./');
    const cvLinks = page.locator(`a[href="${content.person.cvUrl}"]`);
    expect(await cvLinks.count()).toBeGreaterThanOrEqual(2); // hero + contact
    for (const a of await cvLinks.all()) await expect(a).toHaveAttribute('download', '');

    const res = await request.get(content.person.cvUrl);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/pdf');
    const body = await res.body();
    expect(body.subarray(0, 5).toString()).toBe('%PDF-');
  });

  test('CV click triggers a download', async ({ page, isMobile }) => {
    test.skip(isMobile, 'mobile browsers open PDFs instead of downloading');
    await page.goto('./');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#home .hero__actions a.btn--primary').click()
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('external links open in a new tab safely', async ({ page }) => {
    await page.goto('./');
    const external = page.locator('main a[href^="http"]');
    expect(await external.count()).toBeGreaterThan(0);
    for (const a of await external.all()) {
      await expect(a).toHaveAttribute('target', '_blank');
      await expect(a).toHaveAttribute('rel', /noopener/);
    }
  });

  test('only safe link schemes are used', async ({ page }) => {
    await page.goto('./');
    const hrefs = await page.locator('a[href]').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
    for (const h of hrefs) expect(h, h).toMatch(/^(https?:|mailto:|#|[\w.-])/);
    for (const h of hrefs) expect(h, `${h} must be relative (GitHub Pages sub-path)`).not.toMatch(/^\/(?!\/)/);
  });

  test('every local file referenced by the page exists', async ({ page, request, baseURL }) => {
    await page.goto('./');
    const urls = await page.evaluate(() => {
      const attrs = [
        ...[...document.querySelectorAll('link[href]')].map((n) => n.href),
        ...[...document.querySelectorAll('script[src], img[src]')].map((n) => n.src),
        ...[...document.querySelectorAll('a[href]')].map((n) => n.href)
      ];
      return [...new Set(attrs.map((u) => u.split('#')[0]))];
    });
    const origin = new URL(baseURL).origin;
    const local = urls.filter((u) => u.startsWith(origin));
    expect(local.length).toBeGreaterThan(3);
    for (const u of local) {
      const res = await request.get(u);
      expect(res.status(), u).toBe(200);
    }
  });

  test('link-preview image exists at the advertised size', async ({ page, request }) => {
    await page.goto('./');
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    const local = new URL(og).pathname.replace(/^\//, '');
    const res = await request.get(local);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
    const buf = await res.body();
    // PNG IHDR: width at byte 16, height at byte 20.
    expect([buf.readUInt32BE(16), buf.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  test('JSON-LD is valid and matches the content', async ({ page }) => {
    await page.goto('./');
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe(content.person.name);
    expect(data.sameAs).toContain(content.person.linkedin);
  });
});
