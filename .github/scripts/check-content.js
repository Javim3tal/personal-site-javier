/* CI check for content/content.js against docs/SPEC.md "Contract 1 — content data".
   Run from the repo root: node .github/scripts/check-content.js */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var root = process.cwd();
var file = path.join(root, 'content', 'content.js');
var errors = [];

function fail(msg) { errors.push(msg); }

// 1. The file runs as a classic script and assigns window.SITE_CONTENT.
var sandbox = { window: {} };
try {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: 'content/content.js' });
} catch (e) {
  console.error('content/content.js does not run: ' + e.message);
  process.exit(1);
}
var c = sandbox.window.SITE_CONTENT;
if (!c || typeof c !== 'object') {
  console.error('content/content.js must assign an object to window.SITE_CONTENT');
  process.exit(1);
}

// 2. Top-level shape.
var objects = ['meta', 'person', 'hero', 'about', 'contact'];
var arrays = ['stats', 'expertise', 'experience', 'earlierExperience', 'projects', 'certifications'];
objects.forEach(function (k) {
  if (!c[k] || typeof c[k] !== 'object' || Array.isArray(c[k])) fail(k + ' must be an object');
});
arrays.forEach(function (k) {
  if (!Array.isArray(c[k])) fail(k + ' must be an array');
});

// 3. Enumerated values.
var icons = ['team', 'data', 'ai', 'quality', 'code'];
(c.expertise || []).forEach(function (x, i) {
  if (x.icon && icons.indexOf(x.icon) < 0) fail('expertise[' + i + '].icon "' + x.icon + '" is not one of ' + icons.join(', '));
});
var statuses = ['live', 'wip', 'placeholder'];
(c.projects || []).forEach(function (p, i) {
  if (p.status && statuses.indexOf(p.status) < 0) fail('projects[' + i + '].status "' + p.status + '" is not one of ' + statuses.join(', '));
});

// 4. Every string is plain text, and every relative file path exists.
function walk(v, where) {
  if (typeof v === 'string') {
    if (/<\/?[a-z!][^>]*>/i.test(v)) fail(where + ' contains HTML; content must be plain text');
    var isRelativeFile = /^[\w.-]+(\/[\w.-]+)*\.[a-z0-9]+$/i.test(v) && v.indexOf('/') > 0;
    if (isRelativeFile && !fs.existsSync(path.join(root, v))) fail(where + ' points to a missing file: ' + v);
  } else if (Array.isArray(v)) {
    v.forEach(function (x, i) { walk(x, where + '[' + i + ']'); });
  } else if (v && typeof v === 'object') {
    Object.keys(v).forEach(function (k) { walk(v[k], where ? where + '.' + k : k); });
  }
}
walk(c, '');

if (errors.length) {
  errors.forEach(function (e) { console.error('✖ ' + e); });
  console.error(errors.length + ' problem(s) in content/content.js');
  process.exit(1);
}
console.log('✔ content/content.js is valid (' + Object.keys(c).length + ' sections)');
