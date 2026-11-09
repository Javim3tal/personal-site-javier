// Shared helpers. Expectations are derived from content/content.js, so editing
// copy never breaks a test — only a broken renderer, layout or behaviour does.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const base = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..', '..');

/** Load window.SITE_CONTENT the same way the browser does (a classic script). */
function loadContent() {
  const code = fs.readFileSync(path.join(ROOT, 'content', 'content.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: 'content.js' });
  return sandbox.window.SITE_CONTENT;
}

const content = loadContent();

/** Sections in DOM order, as listed in docs/SPEC.md Contract 3. */
const SECTIONS = ['home', 'about', 'expertise', 'experience', 'projects', 'certifications', 'contact'];

/**
 * `page` fixture that records console errors, uncaught exceptions and failed
 * same-origin requests. Every test fails if any of them happened.
 */
const test = base.test.extend({
  page: async ({ page, baseURL }, use) => {
    const errors = [];
    const origin = new URL(baseURL).origin;
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('requestfailed', (req) => {
      if (req.url().startsWith(origin)) errors.push(`requestfailed: ${req.url()} (${req.failure()?.errorText})`);
    });
    page.on('response', (res) => {
      if (res.url().startsWith(origin) && res.status() >= 400) errors.push(`HTTP ${res.status()}: ${res.url()}`);
    });
    await use(page);
    base.expect(errors, 'no console errors, exceptions or broken same-origin requests').toEqual([]);
  }
});

module.exports = { test, expect: base.expect, content, SECTIONS, ROOT };
