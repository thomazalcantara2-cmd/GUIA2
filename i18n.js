// i18n.js — language switcher (PT · EN · ES) for the Di Maré guest guide.
// Flags at top-right swap every translatable string in place. Choice persists.
// Text content is loaded at runtime from content.json, keyed by data-eid
// attributes placed on <span> elements throughout the page. This lets the
// editor (see /editor.html) update guest-facing copy without touching code.
(() => {
  'use strict';

  const CONTENT_URL = 'content.json';
  let CONTENT = {};

  // Style presets the editor's sidebar can apply to an editable span
  // ("Título" / "Texto"), matching whatever the real title/body text looks
  // like on the page the span is actually on — read live via
  // getComputedStyle rather than duplicated here, so it can never drift out
  // of sync with the page's real design.
  const STYLE_REF_SELECTORS = {
    title: '.gbi-page-title, .cv3-title, .gbv-flat-title',
    text: '.gbi-lead, .gbi-list-text, .cv3-select-sub',
  };
  function findStyleRef(kind, el) {
    const scope = el.closest('[data-document-role="page"]') || document;
    return scope.querySelector(STYLE_REF_SELECTORS[kind]) || document.querySelector(STYLE_REF_SELECTORS[kind]);
  }
  function applyTextStyle(el, kind) {
    if (!kind) { el.removeAttribute('style'); return; }
    const ref = findStyleRef(kind, el);
    if (!ref || ref === el) return;
    const cs = getComputedStyle(ref);
    el.style.fontFamily = cs.fontFamily;
    el.style.fontWeight = cs.fontWeight;
    el.style.fontStyle = cs.fontStyle;
    el.style.color = cs.color;
    el.style.letterSpacing = cs.letterSpacing;
    el.style.fontSize = cs.fontSize;
  }

  function apply(lang) {
    document.querySelectorAll('[data-eid]').forEach((el) => {
      const entry = CONTENT[el.dataset.eid];
      if (!entry) return;
      const text = entry[lang] || entry.pt || '';
      // Text may contain a handful of safe inline tags (currently just <b>)
      // added via the editor's Bold button — sanitized there before ever
      // reaching content.json, so it's trusted here the same way the rest
      // of this page's own markup is.
      el.innerHTML = text;
      applyTextStyle(el, entry.style);
    });
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang);
    document.querySelectorAll('.lang-flag').forEach((b) => {
      const isActive = b.dataset.lang === lang;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      // Hide the flag of the currently active language; show all others.
      b.style.display = isActive ? 'none' : '';
    });
    try { localStorage.setItem('guia-lang', lang); } catch (e) {}
    // Lets independently-rendered widgets (e.g. dine.js's restaurant cards,
    // built from restaurants.json instead of static HTML) react to language
    // switches without i18n.js needing to know they exist.
    document.dispatchEvent(new CustomEvent('guia-lang-changed', { detail: { lang } }));
  }

  const META = [
    ['br', 'Português', 'pt'],
    ['us', 'English', 'en'],
    ['es', 'Español', 'es'],
  ];
  const FLAGS = {
    br: '<svg viewBox="0 0 28 20"><rect width="28" height="20" fill="#009B3A"/><polygon points="14,2.5 25.5,10 14,17.5 2.5,10" fill="#FEDF00"/><circle cx="14" cy="10" r="4.4" fill="#002776"/></svg>',
    us: '<svg viewBox="0 0 28 20"><rect width="28" height="20" fill="#fff"/>' +
        [0,2,4,6,8,10,12].map((i) => `<rect y="${i*(20/13)}" width="28" height="${20/13}" fill="#B22234"/>`).join('') +
        `<rect width="12" height="${20/13*7}" fill="#3C3B6E"/>` +
        '<g fill="#fff">' + [[2,2.4],[5,2.4],[8,2.4],[3.5,5.2],[6.5,5.2],[9.5,5.2]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="0.7"/>`).join('') + '</g></svg>',
    es: '<svg viewBox="0 0 28 20"><rect width="28" height="20" fill="#AA151B"/><rect y="5" width="28" height="10" fill="#F1BF00"/></svg>',
  };

  function makeGroup() {
    const g = document.createElement('div');
    g.className = 'lang-flags';
    g.setAttribute('data-noncommentable', '');
    META.forEach(([flag, label, lang]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-flag';
      b.dataset.lang = lang;
      b.title = label;
      b.setAttribute('aria-label', label);
      b.innerHTML = FLAGS[flag];
      b.addEventListener('click', () => apply(b.dataset.lang));
      g.appendChild(b);
    });
    return g;
  }

  function buildBar() {
    // One flag group per page, beside the "Índice" button in the header.
    document.querySelectorAll('section.page').forEach((sec) => {
      if (sec.querySelector('.lang-flags')) return;
      const g = makeGroup();

      const right = sec.querySelector('.hdr-right');
      if (right) { right.insertBefore(g, right.firstChild); return; }

      const hdr = sec.querySelector('.hdr');
      if (hdr) {
        const pg = hdr.querySelector('.hdr-pg');
        if (pg) hdr.insertBefore(g, pg); else hdr.appendChild(g);
        return;
      }

      const fl = sec.querySelector('.btn-index-float');
      if (fl) {
        const wrap = document.createElement('div');
        wrap.className = 'lang-float';
        fl.parentNode.insertBefore(wrap, fl);
        wrap.appendChild(g);
        wrap.appendChild(fl);
        return;
      }

      const ct = sec.querySelector('.cover-top');
      if (ct) {
        const stamp = ct.querySelector('.cover-stamp');
        const wrap = document.createElement('div');
        wrap.className = 'cover-top-right';
        ct.insertBefore(wrap, stamp || null);
        wrap.appendChild(g);
        if (stamp) wrap.appendChild(stamp);
      }
    });
  }

  function buildTopDockFlags() {
    // Populates the mobile top-dock's flag slot (app.js) — a single
    // persistent group living outside the page canvas, vs. one group
    // per page inserted by buildBar().
    const slot = document.querySelector('.top-dock-flags');
    if (!slot || slot.querySelector('.lang-flags')) return;
    slot.appendChild(makeGroup());
  }

  async function loadContent() {
    try {
      const res = await fetch(CONTENT_URL, { cache: 'no-store' });
      if (res.ok) CONTENT = await res.json();
    } catch (e) {
      console.error('i18n: failed to load content.json', e);
    }
  }

  async function init() {
    await loadContent();
    buildBar();
    buildTopDockFlags();
    let saved = 'pt';
    try { saved = localStorage.getItem('guia-lang') || 'pt'; } catch (e) {}
    apply(saved);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Exposed so the editor (editor.html) can re-apply the current language
  // immediately after saving, without a full page reload.
  window.__guiaI18n = {
    apply, getContent: () => CONTENT, setContent: (c) => { CONTENT = c; },
    applyStyle: applyTextStyle,
  };
})();
