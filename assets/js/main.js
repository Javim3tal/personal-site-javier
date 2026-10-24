/*
 * main.js — renders window.SITE_CONTENT (docs/SPEC.md Contract 1) into the
 * DOM/classes of Contract 3. Vanilla ES2020, no dependencies, no modules.
 * All data is written with createElement/textContent — never innerHTML.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'theme';
  var MOBILE_QUERY = '(max-width: 895.98px)'; // keep in sync with base.css
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in window;

  /* ------------------------------------------------------------------ */
  /* Icons: 24x24, stroke currentColor, aria-hidden. Static shapes only. */
  /* ------------------------------------------------------------------ */
  var ICONS = {
    team: [
      ['path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }],
      ['circle', { cx: '9', cy: '7', r: '4' }],
      ['path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }],
      ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]
    ],
    data: [
      ['ellipse', { cx: '12', cy: '5', rx: '9', ry: '3' }],
      ['path', { d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' }],
      ['path', { d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' }]
    ],
    ai: [
      ['path', { d: 'M12 3l1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8z' }],
      ['path', { d: 'M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z' }],
      ['path', { d: 'M5.5 15.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z' }]
    ],
    quality: [
      ['path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }],
      ['path', { d: 'M9 12l2 2 4-4' }]
    ],
    code: [
      ['polyline', { points: '16 18 22 12 16 6' }],
      ['polyline', { points: '8 6 2 12 8 18' }]
    ],
    mail: [
      ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }],
      ['path', { d: 'M22 6l-10 7L2 6' }]
    ],
    linkedin: [
      ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z' }],
      ['rect', { x: '2', y: '9', width: '4', height: '12' }],
      ['circle', { cx: '4', cy: '4', r: '2' }]
    ],
    github: [
      ['path', { d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' }]
    ],
    download: [
      ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
      ['polyline', { points: '7 10 12 15 17 10' }],
      ['line', { x1: '12', y1: '15', x2: '12', y2: '3' }]
    ],
    external: [
      ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }],
      ['polyline', { points: '15 3 21 3 21 9' }],
      ['line', { x1: '10', y1: '14', x2: '21', y2: '3' }]
    ],
    sun: [
      ['circle', { cx: '12', cy: '12', r: '5' }],
      ['path', { d: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' }]
    ],
    moon: [
      ['path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }]
    ],
    menu: [
      ['path', { d: 'M3 6h18M3 12h18M3 18h18' }]
    ],
    close: [
      ['path', { d: 'M18 6L6 18M6 6l12 12' }]
    ]
  };

  function icon(name) {
    var shapes = ICONS[name];
    if (!shapes) return null;
    var svg = doc.createElementNS(SVG_NS, 'svg');
    var attrs = {
      'class': 'icon icon--' + name,
      viewBox: '0 0 24 24',
      width: '24',
      height: '24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
      focusable: 'false'
    };
    Object.keys(attrs).forEach(function (k) { svg.setAttribute(k, attrs[k]); });
    shapes.forEach(function (s) {
      var node = doc.createElementNS(SVG_NS, s[0]);
      Object.keys(s[1]).forEach(function (k) { node.setAttribute(k, s[1][k]); });
      svg.appendChild(node);
    });
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                       */
  /* ------------------------------------------------------------------ */
  function str(v) {
    return (typeof v === 'string' || typeof v === 'number') ? String(v).trim() : '';
  }

  function arr(v) {
    return Array.isArray(v) ? v.filter(function (x) { return x !== null && x !== undefined && x !== ''; }) : [];
  }

  function strings(v) {
    return arr(v).map(str).filter(Boolean);
  }

  function obj(v) {
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  }

  /** Create an element with optional class and plain-text content. */
  function el(tag, cls, text) {
    var node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null && text !== '') node.textContent = String(text);
    return node;
  }

  function append(parent) {
    for (var i = 1; i < arguments.length; i++) {
      var child = arguments[i];
      if (child) parent.appendChild(child);
    }
    return parent;
  }

  /** Allow http(s), mailto, tel-free relative paths and in-page anchors only. */
  function safeHref(u) {
    var s = str(u);
    if (!s) return '';
    if (/^(https?:|mailto:)/i.test(s)) return s;
    if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return ''; // javascript:, data:, tel:, etc.
    if (/^\/\//.test(s)) return '';               // protocol-relative
    return s;                                     // relative path or #anchor
  }

  function isExternal(href) {
    if (!/^https?:/i.test(href)) return false;
    try {
      return new URL(href, window.location.href).host !== window.location.host;
    } catch (e) {
      return true;
    }
  }

  /** Build a link; external links open in a new tab with rel="noopener". */
  function link(href, cls, label, iconName, iconAfter) {
    var h = safeHref(href);
    if (!h) return null;
    var a = el('a', cls);
    a.setAttribute('href', h);
    var ic = iconName ? icon(iconName) : null;
    var text = el('span', null, label);
    if (ic && !iconAfter) a.appendChild(ic);
    a.appendChild(text);
    if (ic && iconAfter) a.appendChild(ic);
    if (isExternal(h)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      var note = el('span', 'sr-only', ' (opens in a new tab)');
      a.appendChild(note);
    } else if (/\.pdf$/i.test(h) && !/^#/.test(h)) {
      a.setAttribute('download', '');
    }
    return a;
  }

  function sectionHead(id, eyebrow, title, lead) {
    if (!str(title) && !str(eyebrow)) return null;
    var head = el('div', 'section__head reveal');
    append(head, str(eyebrow) ? el('p', 'section__eyebrow', str(eyebrow)) : null);
    if (str(title)) {
      var h2 = el('h2', 'section__title', str(title));
      h2.id = id + '-title';
      head.appendChild(h2);
    }
    append(head, str(lead) ? el('p', 'section__lead', str(lead)) : null);
    return head;
  }

  function getSection(id) {
    var section = doc.getElementById(id);
    if (!section) return null;
    var container = section.querySelector('.container');
    if (!container) {
      container = el('div', 'container');
      section.appendChild(container);
    }
    return { section: section, container: container };
  }

  /** Replace a section's content, or hide it (and its nav link) when empty. */
  function fill(id, nodes, headingId) {
    var s = getSection(id);
    if (!s) return;
    var content = nodes.filter(Boolean);
    s.container.textContent = '';
    if (!content.length) {
      s.section.hidden = true;
      var navLink = doc.querySelector('.nav__link[href="#' + id + '"]');
      if (navLink) navLink.hidden = true;
      return;
    }
    s.section.hidden = false;
    content.forEach(function (n) { s.container.appendChild(n); });
    if (headingId && doc.getElementById(headingId)) {
      s.section.setAttribute('aria-labelledby', headingId);
    }
  }

  function tags(list) {
    var items = strings(list);
    if (!items.length) return null;
    var ul = el('ul', 'tags');
    ul.setAttribute('aria-label', 'Tags');
    items.forEach(function (t) { ul.appendChild(el('li', 'tag', t)); });
    return ul;
  }

  function bulletList(cls, list) {
    var items = strings(list);
    if (!items.length) return null;
    var ul = el('ul', cls);
    items.forEach(function (t) { ul.appendChild(el('li', null, t)); });
    return ul;
  }

  function dateRange(start, end) {
    var s = str(start), e = str(end);
    if (s && e) return s + ' – ' + e;
    return s || e;
  }

  /* ------------------------------------------------------------------ */
  /* Section renderers                                                   */
  /* ------------------------------------------------------------------ */
  function renderMeta(meta, person) {
    var title = str(meta.title);
    var description = str(meta.description);
    var lang = str(meta.lang);
    if (lang) root.setAttribute('lang', lang);
    if (title) {
      doc.title = title;
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    var ogImage = safeHref(meta.ogImage);
    if (ogImage) {
      var abs = ogImage;
      try { abs = new URL(ogImage, window.location.href).href; } catch (e) { /* keep relative */ }
      setMeta('property', 'og:image', abs);
      setMeta('name', 'twitter:image', abs);
    }

    var name = str(person.name);
    if (name) {
      var brand = doc.querySelector('.site-header .brand');
      if (brand) brand.textContent = name;
      doc.querySelectorAll('[data-name]').forEach(function (n) { n.textContent = name; });
    }
  }

  function setMeta(attr, key, value) {
    var m = doc.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!m) {
      m = doc.createElement('meta');
      m.setAttribute(attr, key);
      doc.head.appendChild(m);
    }
    m.setAttribute('content', value);
  }

  function renderHero(hero, person, stats) {
    var nodes = [];
    // Recruiters must see the name first: h1 = person.name; the headline is a tagline.
    var name = str(person.name);
    var tagline = str(hero.headline);

    if (str(hero.eyebrow)) nodes.push(el('p', 'hero__eyebrow', str(hero.eyebrow)));
    if (name || tagline) {
      var h1 = el('h1', 'hero__title', name || tagline);
      h1.id = 'home-title';
      nodes.push(h1);
    }
    if (name && tagline) nodes.push(el('p', 'hero__tagline', tagline));
    if (str(hero.lead)) nodes.push(el('p', 'hero__lead', str(hero.lead)));

    var ctas = arr(hero.ctas).map(obj).filter(function (c) { return str(c.label); }).map(function (c) {
      var kind = c.kind === 'primary' ? 'btn--primary' : 'btn--ghost';
      return link(c.href, 'btn ' + kind, str(c.label));
    }).filter(Boolean);
    if (ctas.length) {
      var actions = el('div', 'hero__actions');
      ctas.forEach(function (a) { actions.appendChild(a); });
      nodes.push(actions);
    }

    var location = str(person.location);
    var availability = str(person.availability);
    if (location || availability) {
      var meta = el('p', 'hero__meta');
      if (location) meta.appendChild(el('span', 'hero__location', location));
      if (availability) {
        var av = el('span', 'hero__availability');
        var dot = el('span', 'status-dot');
        dot.setAttribute('aria-hidden', 'true');
        append(av, dot, doc.createTextNode(availability));
        meta.appendChild(av);
      }
      nodes.push(meta);
    }

    var statItems = arr(stats).map(obj).filter(function (s) { return str(s.value) || str(s.label); });
    if (statItems.length) {
      var list = el('ul', 'stats');
      list.setAttribute('aria-label', 'Key figures');
      statItems.forEach(function (s) {
        var li = el('li', 'stat reveal');
        append(li,
          str(s.value) ? el('span', 'stat__value', str(s.value)) : null,
          str(s.label) ? el('span', 'stat__label', str(s.label)) : null);
        list.appendChild(li);
      });
      nodes.push(list);
    }

    var s = getSection('home');
    if (!s) return;
    s.container.textContent = '';
    nodes.forEach(function (n) { s.container.appendChild(n); });
  }

  function renderAbout(about) {
    var paragraphs = strings(about.paragraphs);
    if (!paragraphs.length) { fill('about', []); return; }
    var body = el('div', 'about__body reveal');
    paragraphs.forEach(function (p) { body.appendChild(el('p', 'about__text', p)); });
    fill('about', [sectionHead('about', 'About', str(about.title) || 'About'), body], 'about-title');
  }

  function renderExpertise(list) {
    var items = arr(list).map(obj).filter(function (x) { return str(x.title) || str(x.summary) || strings(x.items).length; });
    if (!items.length) { fill('expertise', []); return; }
    var grid = el('div', 'grid grid--3 expertise');
    items.forEach(function (x) {
      var card = el('article', 'card reveal');
      var ic = icon(str(x.icon));
      if (ic) {
        var wrap = el('span', 'card__icon');
        wrap.appendChild(ic);
        card.appendChild(wrap);
      }
      append(card,
        str(x.title) ? el('h3', 'card__title', str(x.title)) : null,
        str(x.summary) ? el('p', 'card__text', str(x.summary)) : null,
        bulletList('card__list', x.items));
      grid.appendChild(card);
    });
    fill('expertise', [sectionHead('expertise', 'Expertise', 'Areas of expertise'), grid], 'expertise-title');
  }

  function renderExperience(list, earlierList) {
    var jobs = arr(list).map(obj).filter(function (j) { return str(j.company) || arr(j.roles).length; });
    var nodes = [];

    if (jobs.length) {
      var ol = el('ol', 'timeline');
      jobs.forEach(function (j) {
        var li = el('li', 'timeline__item reveal');
        if (str(j.company) || str(j.location)) {
          var company = el('h3', 'timeline__company');
          if (str(j.company)) company.appendChild(el('span', 'timeline__company-name', str(j.company)));
          if (str(j.location)) company.appendChild(el('span', 'timeline__location', str(j.location)));
          li.appendChild(company);
        }
        arr(j.roles).map(obj).forEach(function (r) {
          var dates = dateRange(r.start, r.end);
          var highlights = bulletList('timeline__highlights', r.highlights);
          if (!str(r.title) && !dates && !highlights) return;
          var role = el('div', 'timeline__role');
          append(role,
            str(r.title) ? el('h4', 'timeline__title', str(r.title)) : null,
            dates ? el('p', 'timeline__dates', dates) : null,
            highlights);
          li.appendChild(role);
        });
        ol.appendChild(li);
      });
      nodes.push(ol);
    }

    var earlier = arr(earlierList).map(obj).filter(function (e) { return str(e.company) || str(e.title); });
    if (earlier.length) {
      var heading = el('h3', 'earlier__heading reveal', 'Earlier experience');
      heading.id = 'earlier-title';
      var ul = el('ul', 'earlier');
      ul.setAttribute('aria-labelledby', 'earlier-title');
      earlier.forEach(function (e) {
        var item = el('li', 'earlier__item reveal');
        var dates = dateRange(e.start, e.end);
        append(item,
          str(e.title) ? el('p', 'earlier__title', str(e.title)) : null,
          str(e.company) ? el('p', 'earlier__company', str(e.company)) : null,
          dates ? el('p', 'earlier__dates', dates) : null,
          str(e.summary) ? el('p', 'earlier__summary', str(e.summary)) : null);
        ul.appendChild(item);
      });
      nodes.push(heading, ul);
    }

    if (!nodes.length) { fill('experience', []); return; }
    fill('experience', [sectionHead('experience', 'Experience', 'Professional experience')].concat(nodes), 'experience-title');
  }

  var STATUS_LABELS = { placeholder: 'Coming soon', wip: 'In progress', live: 'Live' };
  var PLACEHOLDER_PROJECT = {
    title: 'New project',
    summary: 'A new Data & AI engineering project is on its way.',
    tags: [],
    status: 'placeholder',
    links: {},
    image: ''
  };

  function renderProjects(list) {
    var projects = arr(list).map(obj).filter(function (p) { return str(p.title) || str(p.summary); });
    if (!projects.length) projects = [PLACEHOLDER_PROJECT, PLACEHOLDER_PROJECT, PLACEHOLDER_PROJECT];

    var grid = el('div', 'grid grid--3 projects');
    projects.forEach(function (p) {
      var status = STATUS_LABELS[str(p.status)] ? str(p.status) : 'live';
      var card = el('article', 'project-card reveal');
      card.setAttribute('data-status', status);

      var img = safeHref(p.image);
      if (img) {
        var media = el('div', 'project-card__media');
        var image = el('img');
        image.setAttribute('src', img);
        image.setAttribute('alt', str(p.title) ? 'Screenshot of ' + str(p.title) : '');
        image.setAttribute('loading', 'lazy');
        image.setAttribute('decoding', 'async');
        media.appendChild(image);
        card.appendChild(media);
      }

      if (status !== 'live') card.appendChild(el('p', 'project-card__status', STATUS_LABELS[status]));
      append(card,
        str(p.title) ? el('h3', 'project-card__title', str(p.title)) : null,
        str(p.summary) ? el('p', 'project-card__text', str(p.summary)) : null,
        tags(p.tags));

      var links = obj(p.links);
      var anchors = [
        link(links.demo, 'link', 'Live demo', 'external', true),
        link(links.repo, 'link', 'Source code', 'github', false),
        link(links.writeup, 'link', 'Write-up', 'external', true)
      ].filter(Boolean);
      if (anchors.length) {
        var wrap = el('div', 'project-card__links');
        anchors.forEach(function (a) { wrap.appendChild(a); });
        card.appendChild(wrap);
      }
      grid.appendChild(card);
    });
    fill('projects', [sectionHead('projects', 'Projects', 'Selected projects'), grid], 'projects-title');
  }

  function renderCertifications(list) {
    var groups = arr(list).map(obj).filter(function (g) { return arr(g.items).length; });
    if (!groups.length) { fill('certifications', []); return; }
    var grid = el('div', 'grid grid--3 certs');
    groups.forEach(function (g) {
      var items = arr(g.items).map(obj).filter(function (i) { return str(i.name); });
      if (!items.length) return;
      var group = el('div', 'cert-group reveal');
      append(group,
        str(g.group) ? el('h3', 'cert-group__title', str(g.group)) : null,
        str(g.issuer) ? el('p', 'cert-group__issuer', str(g.issuer)) : null);
      var ul = el('ul', 'cert-list');
      items.forEach(function (i) {
        var li = el('li', 'cert');
        append(li,
          el('span', 'cert__name', str(i.name)),
          str(i.date) ? el('span', 'cert__date', str(i.date)) : null);
        ul.appendChild(li);
      });
      group.appendChild(ul);
      grid.appendChild(group);
    });
    if (!grid.children.length) { fill('certifications', []); return; }
    fill('certifications', [sectionHead('certifications', 'Certifications', 'Certifications & training'), grid], 'certifications-title');
  }

  function renderContact(contact, person) {
    var email = str(person.email);
    var buttons = [
      email ? link('mailto:' + email, 'btn btn--primary', 'Email me', 'mail') : null,
      link(person.linkedin, 'btn btn--ghost', 'LinkedIn', 'linkedin'),
      link(person.github, 'btn btn--ghost', 'GitHub', 'github'),
      link(person.cvUrl, 'btn btn--ghost', 'Download CV', 'download')
    ].filter(Boolean);
    var text = str(contact.text);
    if (!buttons.length && !text) { fill('contact', []); return; }

    var card = el('div', 'contact-card reveal');
    append(card, text ? el('p', 'contact-card__text', text) : null);
    if (buttons.length) {
      var actions = el('div', 'contact-card__actions');
      buttons.forEach(function (b) { actions.appendChild(b); });
      card.appendChild(actions);
    }
    if (email) {
      var line = el('p', 'contact-card__email');
      append(line, link('mailto:' + email, 'link', email));
      card.appendChild(line);
    }
    fill('contact', [sectionHead('contact', 'Contact', str(contact.title) || 'Get in touch'), card], 'contact-title');
  }

  function renderFooter() {
    var year = String(new Date().getFullYear());
    doc.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = year; });
  }

  /* ------------------------------------------------------------------ */
  /* Theme toggle                                                        */
  /* ------------------------------------------------------------------ */
  function storedTheme() {
    try {
      var t = window.localStorage.getItem(THEME_KEY);
      return (t === 'light' || t === 'dark') ? t : null;
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function syncThemeColor() {
    var meta = doc.head.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    var bg = getComputedStyle(root).getPropertyValue('--color-bg').trim();
    if (bg) meta.setAttribute('content', bg);
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var btn = doc.querySelector('.theme-toggle');
    if (btn) {
      var dark = theme === 'dark';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', 'Dark theme');
      btn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.textContent = '';
      append(btn, icon(dark ? 'sun' : 'moon'));
    }
    syncThemeColor();
  }

  function initTheme() {
    applyTheme(storedTheme() || systemTheme());
    var btn = doc.querySelector('.theme-toggle');
    if (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { window.localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
        applyTheme(next);
      });
    }
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!storedTheme()) applyTheme(systemTheme()); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Header: mobile menu + active link                                   */
  /* ------------------------------------------------------------------ */
  function initMenu() {
    var header = doc.querySelector('.site-header');
    var toggle = doc.querySelector('.nav-toggle');
    var nav = doc.querySelector('.nav');
    if (!header || !toggle || !nav) return;

    function setOpen(open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.textContent = '';
      append(toggle, icon(open ? 'close' : 'menu'));
    }

    toggle.hidden = false;
    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    doc.addEventListener('click', function (e) {
      if (!header.classList.contains('is-open')) return;
      // composedPath() is captured at dispatch time, so it still holds the header
      // even when the clicked icon was swapped out (detached) by the toggle handler.
      var path = e.composedPath ? e.composedPath() : [];
      var inside = path.length ? path.indexOf(header) !== -1 : header.contains(e.target);
      if (!inside) setOpen(false);
    });
    if (window.matchMedia) {
      var mq = window.matchMedia(MOBILE_QUERY);
      var onChange = function () { if (!mq.matches) setOpen(false); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  function initActiveLink() {
    if (!hasIO) return;
    var links = Array.prototype.slice.call(doc.querySelectorAll('.nav__link[href^="#"]'));
    if (!links.length) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sections = Array.prototype.slice.call(doc.querySelectorAll('main section[id]'));

    function setActive(id) {
      links.forEach(function (a) {
        var on = a === byId[id];
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }

    // A thin band across the middle of the viewport: the section crossing it is "current".
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -54% 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                    */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var items = Array.prototype.slice.call(doc.querySelectorAll('.reveal:not(.is-visible)'));
    if (!items.length) return;
    if (!hasIO || reducedMotion) {
      items.forEach(function (n) { n.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (n) { observer.observe(n); });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function render(data) {
    var person = obj(data.person);
    renderMeta(obj(data.meta), person);
    renderHero(obj(data.hero), person, data.stats);
    renderAbout(obj(data.about));
    renderExpertise(data.expertise);
    renderExperience(data.experience, data.earlierExperience);
    renderProjects(data.projects);
    renderCertifications(data.certifications);
    renderContact(obj(data.contact), person);
  }

  function init() {
    initTheme();
    initMenu();
    renderFooter();

    var data = window.SITE_CONTENT;
    if (!data || typeof data !== 'object') {
      console.warn('[site] window.SITE_CONTENT is missing; showing the static skeleton only.');
    } else {
      render(data);
      // Re-apply a deep link (e.g. /#experience) now that sections have content.
      if (window.location.hash.length > 1) {
        var target = doc.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (target) {
          target.scrollIntoView();
          // Web fonts can reflow the page after this; land on the target again once they are in.
          if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { target.scrollIntoView(); });
        }
      }
    }

    initActiveLink();
    initReveal();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
