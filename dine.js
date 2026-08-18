// dine.js — data-driven rendering for the "Onde Comer?" restaurant cards.
// Cards are described in restaurants.json (photo, map, order) plus
// content.json (translatable name/description/address, referenced by eid,
// same system i18n.js already uses). This lets /editor.html add, edit or
// remove restaurants without anyone touching guia-3-flats.html by hand.
(() => {
  'use strict';

  const RESTAURANTS_URL = 'restaurants.json';
  const CONTENT_URL = 'content.json';
  let RESTAURANTS = [];

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  // Name/desc/addr text may contain the editor's Bold <b> tag — sanitized
  // there before ever reaching content.json, so trusted here the same way
  // i18n.js trusts it. Plain-text attributes (alt, aria-label) still need
  // the tags stripped out first.
  function stripTags(s) {
    return String(s == null ? '' : s).replace(/<[^>]*>/g, '');
  }

  function flipHint(extraClass) {
    return '<div class="gbi-dine-flip-hint' + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true">'
      + '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M17 2.1l4 4-4 4M3 12.6v-2a4 4 0 0 1 4-4h14M7 21.9l-4-4 4-4M21 11.4v2a4 4 0 0 1-4 4H3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  }

  function textFor(content, eid, lang) {
    const entry = eid && content[eid];
    if (!entry) return '';
    return entry[lang] || entry.pt || '';
  }

  function cardHTML(r, content, lang) {
    const name = textFor(content, r.nameEid, lang);
    const since = r.sinceEid ? textFor(content, r.sinceEid, lang) : '';
    const desc = textFor(content, r.descEid, lang);
    const addr = textFor(content, r.addrEid, lang);
    return (
      '<div class="gbi-dine-card" tabindex="0" role="button" aria-pressed="false" data-rid="' + escapeHtml(r.id) + '" aria-label="Ver endereço e mapa de ' + escapeHtml(stripTags(name)) + '">'
      + '<div class="gbi-dine-flip">'
      + '<div class="gbi-dine-face gbi-dine-front">'
      + '<img class="gbi-dine-img" src="' + escapeHtml(r.img) + '" alt="' + escapeHtml(stripTags(name)) + '" loading="lazy" decoding="async">'
      + '<div class="gbi-dine-name"><span data-eid="' + escapeHtml(r.nameEid) + '">' + name + '</span>'
      + (r.sinceEid ? '<span class="gbi-dine-since"><span data-eid="' + escapeHtml(r.sinceEid) + '">' + since + '</span></span>' : '')
      + '</div>'
      + '<div class="gbi-dine-desc"><span data-eid="' + escapeHtml(r.descEid) + '">' + desc + '</span></div>'
      + '<div class="gbi-dine-addr"><span data-eid="' + escapeHtml(r.addrEid) + '">' + addr + '</span></div>'
      + flipHint()
      + '</div>'
      + '<div class="gbi-dine-face gbi-dine-back">'
      + '<div class="gbi-dine-map" data-map-src="' + escapeHtml(r.mapSrc) + '"></div>'
      + flipHint('gbi-dine-flip-hint--back')
      + '</div>'
      + '</div>'
      + '</div>'
    );
  }

  // Same flip-to-map behavior app.js used to wire onto the static cards —
  // moved here since these cards no longer exist at app.js's run time.
  function wireFlip(card) {
    const mapEl = card.querySelector('.gbi-dine-map');
    const loadMap = () => {
      if (!mapEl || mapEl.querySelector('iframe')) return;
      const src = mapEl.getAttribute('data-map-src');
      if (!src) return;
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      mapEl.appendChild(iframe);
    };
    const toggle = () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      if (flipped) loadMap();
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }

  function render(container, content, lang) {
    container.innerHTML = RESTAURANTS.map((r) => cardHTML(r, content, lang)).join('');
    container.querySelectorAll('.gbi-dine-card').forEach(wireFlip);
  }

  async function fetchJSON(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('dine.js: failed to load ' + url, e);
    }
    return null;
  }

  let lastContainer = null;
  let lastContent = {};
  let lastLang = 'pt';

  function rerender() {
    if (lastContainer) render(lastContainer, lastContent, lastLang);
  }

  async function init() {
    const container = document.querySelector('.gbi-dine');
    if (!container) return;
    lastContainer = container;

    const [restaurants, content] = await Promise.all([
      fetchJSON(RESTAURANTS_URL),
      fetchJSON(CONTENT_URL),
    ]);
    RESTAURANTS = restaurants || [];
    lastContent = content || {};

    try { lastLang = localStorage.getItem('guia-lang') || 'pt'; } catch (e) {}
    rerender();

    // Keep in sync with the flag switcher (i18n.js dispatches this on apply()).
    document.addEventListener('guia-lang-changed', (e) => {
      lastLang = (e.detail && e.detail.lang) || 'pt';
      if (window.__guiaI18n) lastContent = window.__guiaI18n.getContent();
      rerender();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Exposed so /editor.html can add/edit/remove restaurants and see the
  // result immediately, without waiting for a redeploy to pick up the
  // freshly-committed restaurants.json.
  window.__guiaDine = {
    getRestaurants: () => RESTAURANTS,
    setRestaurants: (list) => { RESTAURANTS = list || []; rerender(); },
    setContent: (content) => { lastContent = content || {}; rerender(); },
  };
})();
