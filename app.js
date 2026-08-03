// app.js — interactive behaviors for the welcome guide
// - Inject SVG decorations into [data-deco] slots
// - TOC click → jump to slide
// - Copy buttons (code, password)
// - WhatsApp links
// - Map button placeholder

(() => {
  // ── 1. Inject decorations ────────────────────────────────────────────
  document.querySelectorAll('[data-deco]').forEach((el) => {
    const name = el.getAttribute('data-deco');
    if (window.Deco && window.Deco[name]) {
      el.innerHTML = window.Deco[name]({ width: '100%', height: '100%' });
    }
  });

  // ── 2. Wait for deck-stage to be ready, then bind TOC ────────────────
  const deck = document.querySelector('deck-stage');

  function jumpTo(idx) {
    if (deck && typeof deck.goTo === 'function') {
      deck.goTo(idx);
    }
  }

  // ── 1b. Hide the deck's built-in bottom overlay ─────────────────────────
  // deck-stage.js ships a generic hover-controls bar (prev, page count,
  // divider, Reset) inside its shadow DOM. The top-dock's own prev/next
  // arrows (below) now cover navigation at every breakpoint, so the whole
  // built-in bar is redundant — hide it here rather than editing the
  // shared component.
  if (deck && deck.shadowRoot) {
    const overlay = deck.shadowRoot.querySelector('.overlay');
    if (overlay) overlay.style.display = 'none';
  }

  const isTouch = !!(window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches);

  document.querySelectorAll('[data-jump]').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Do NOT preventDefault — preserves the href as a real anchor link
      // so PDF export generates proper internal navigation links.
      const idx = parseInt(el.getAttribute('data-jump'), 10);
      if (!isNaN(idx)) jumpTo(idx);
    });
  });

  // ── 2b. Flat selection + "Voltar ao índice" button on every page ──
  const FLAT_TOCS = { '201': 2, '202': 3, '301': 4 };
  let selectedFlat = localStorage.getItem('dimare-flat') || '201';
  function getTocIndex() { return FLAT_TOCS[selectedFlat] || 2; }

  // The other two flats' TOC/info/wifi pages stay in the deck (so direct
  // links and the PDF export still work) but are marked data-deck-skip so
  // prev/next/arrow-key/tap navigation steps straight over them — browsing
  // after picking a flat only shows that flat's own pages in sequence.
  const FLAT_TOC_IDS = { '201': 'slide-toc-201', '202': 'slide-toc-202', '301': 'slide-toc-301' };
  const FLAT_WIFI_IDS = { '201': 'slide-wifi-201', '202': 'slide-wifi-202', '301': 'slide-wifi-301' };
  function applyFlatSkip() {
    Object.keys(FLAT_TOC_IDS).forEach((f) => {
      const isSelected = f === selectedFlat;
      [FLAT_TOC_IDS[f], FLAT_WIFI_IDS[f]].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (isSelected) el.removeAttribute('data-deck-skip');
        else el.setAttribute('data-deck-skip', '');
      });
    });
  }
  applyFlatSkip();

  // Flat selection buttons (flat-pick-btn on slide-select)
  document.querySelectorAll('[data-select-flat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedFlat = btn.getAttribute('data-select-flat');
      localStorage.setItem('dimare-flat', selectedFlat);
      applyFlatSkip();
      jumpTo(FLAT_TOCS[selectedFlat]);
    });
  });

  document.querySelectorAll('section.page').forEach((sec) => {
    const label = sec.getAttribute('data-label') || '';
    const id = sec.id || '';
    // Skip: cover, flat select page, all 3 TOC pages, and the internal
    // content pages (.rc-page) — those carry their own "MENU" button in
    // their gbi-hdr markup (wired up below), so no injected .btn-index.
    if (
      sec.classList.contains('page-cover') ||
      id === 'slide-select' ||
      sec.classList.contains('rc-page') ||
      /[ÍI]ndice/i.test(label)
    ) return;

    const makeBtn = () => {
      const b = document.createElement('a');
      b.className = 'btn-index';
      b.href = '#slide-select';
      b.innerHTML = '<span aria-hidden="true">↩</span> Retornar ao menu';
      b.addEventListener('click', (e) => { e.preventDefault(); jumpTo(getTocIndex()); });
      return b;
    };

    const hdr = sec.querySelector('.hdr');
    if (hdr) {
      const pg = hdr.querySelector('.hdr-pg');
      const right = document.createElement('div');
      right.className = 'hdr-right';
      const btn = makeBtn();
      if (pg) { hdr.insertBefore(right, pg); right.appendChild(btn); right.appendChild(pg); }
      else { hdr.appendChild(btn); }
    } else {
      const btn = makeBtn();
      btn.classList.add('btn-index-float');
      sec.appendChild(btn);
    }
  });

  // ── 2c-2. Mobile: full-bleed cover photo ────────────────────────────────
  // The cover slide's photo lives inside the scaled page canvas, so on a
  // phone (canvas fit to width, centred, shorter than the viewport) it
  // shows letterboxed with cream gaps above/below. This overlay — real
  // screen px, outside the canvas — paints the same image edge-to-edge
  // across the whole screen while the cover slide is active, with a
  // tap-anywhere "Acessar o Guia" affordance.
  // New cover has its own full-bleed layout (photo + white body with the
  // flat-selection buttons) — skip the legacy fullbleed overlay entirely.
  if (isTouch && !document.querySelector('.page-cover .cover-v2-bg')) {
    const coverBleed = document.createElement('a');
    coverBleed.className = 'cover-fullbleed';
    coverBleed.href = '#slide-select';
    coverBleed.setAttribute('aria-label', 'Acessar o Guia');
    coverBleed.addEventListener('click', (e) => { e.preventDefault(); jumpTo(1); });
    document.body.appendChild(coverBleed);

    const syncCoverBleed = (sec) => {
      if (!sec) return;
      coverBleed.style.display = sec.classList.contains('page-cover') ? 'block' : 'none';
    };

    syncCoverBleed(document.querySelector('section.page[data-deck-active]'));
    if (deck) {
      deck.addEventListener('slidechange', (e) => syncCoverBleed(e.detail && e.detail.slide));
    }
  }

  // The bare strips above/below the canvas on mobile aren't uncovered —
  // deck-stage's own shadow-DOM .stage element (fixed, full viewport)
  // paints them with its letterbox colour (cream, #FBF6EC). The cover's
  // body is white, so that cream shows as a mismatched gap. Since the
  // letterbox lives inside deck-stage's shadow root, an outer overlay
  // can never paint over it — flip its background colour directly
  // instead while the cover slide is active.
  if (isTouch && deck && deck.shadowRoot) {
    const stageElForBg = deck.shadowRoot.querySelector('.stage');
    if (stageElForBg) {
      const syncCoverFill = (sec) => {
        if (!sec) return;
        stageElForBg.style.background = sec.classList.contains('page-cover') ? '#ffffff' : '';
      };

      syncCoverFill(document.querySelector('section.page[data-deck-active]'));
      if (deck) {
        deck.addEventListener('slidechange', (e) => syncCoverFill(e.detail && e.detail.slide));
      }
    }
  }

  // ── 2d. Top dock — bigger logo / language / back-to-menu ────────────────
  // The in-page header (logo, flags) is scaled down with the rest of the
  // page canvas and reads too small once the canvas is shrunk to fit, so
  // this overlay (real screen px, untouched by deck-stage's transform)
  // carries an enlarged logo, the language flags, and a direct way back
  // to the menu instead. Shown at every breakpoint.
  let topDock = null;
  {
    topDock = document.createElement('div');
    topDock.className = 'top-dock';

    const logo = document.createElement('img');
    logo.className = 'top-dock-logo';
    logo.src = 'logo-dimare.png';
    logo.alt = 'Di Maré Porto Residence';

    const right = document.createElement('div');
    right.className = 'top-dock-right';

    const flagsSlot = document.createElement('div');
    flagsSlot.className = 'top-dock-flags';

    const topIndexBtn = document.createElement('a');
    topIndexBtn.className = 'top-dock-index';
    topIndexBtn.href = '#';
    topIndexBtn.innerHTML = '<span aria-hidden="true">↩</span> Retornar ao menu';

    right.append(flagsSlot, topIndexBtn);
    topDock.append(logo, right);
    document.body.appendChild(topDock);

    // On iOS Safari the strip behind the status bar/address bar (outside
    // our own page) is tinted by the browser using this meta tag, not by
    // anything we can paint. Each page family opens on a different top
    // color (índice: bright cyan photo; páginas internas: teal header
    // gradient; cover/menu: navy), so that strip otherwise reads as a
    // mismatched band. Swapping the tag per page gives the illusion the
    // page's own background runs all the way to the top.
    const themeColorMeta = document.getElementById('meta-theme-color');
    const setThemeColor = (color) => {
      if (themeColorMeta) themeColorMeta.setAttribute('content', color);
    };

    // Every page family now carries its own in-page header (índice pages
    // and the internal content pages, .rc-page, both got a dedicated
    // redesign) — the floating top-dock has no page left to show on, so
    // it's kept only as a helper for language-flag injection/theme-color
    // and always stays hidden.
    const syncDocks = (sec) => {
      if (!sec) return;
      const label = sec.getAttribute('data-label') || '';
      const isToc = /[ÍI]ndice/i.test(label);
      const isInternal = sec.classList.contains('rc-page');
      setThemeColor(isToc ? '#00337A' : isInternal ? '#0047AB' : '#0047AB');
      topDock.style.visibility = 'hidden';
    };

    syncDocks(document.querySelector('section.page[data-deck-active]'));
    if (deck) {
      deck.addEventListener('slidechange', (e) => syncDocks(e.detail && e.detail.slide));
    }
  }

  // ── 2e. Desktop: align the dock overlays to the visible canvas ─────────
  // On touch the canvas fills the viewport width, so the dock's CSS
  // (left/right: 0) already hugs the real page edges. On desktop the
  // canvas is scaled to fit both dimensions and centred with letterboxing
  // on the sides, so the dock is instead measured against the canvas's
  // own rendered box (read from deck-stage's shadow DOM) rather than the
  // full — much wider — browser window.
  if (!isTouch && deck && deck.shadowRoot && topDock) {
    const canvasEl = deck.shadowRoot.querySelector('.canvas');
    const alignDocksToCanvas = () => {
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const inset = 16;
      topDock.style.left = (rect.left + inset) + 'px';
      topDock.style.right = (window.innerWidth - rect.right + inset) + 'px';
      topDock.style.top = rect.top + 'px';
    };
    alignDocksToCanvas();
    window.addEventListener('resize', alignDocksToCanvas);
    // The canvas re-fits asynchronously (fonts/images loading, etc.) —
    // a couple of delayed re-checks catch layout settling after load.
    setTimeout(alignDocksToCanvas, 250);
    setTimeout(alignDocksToCanvas, 1000);
  }

  // ── 2f. Mobile: drop the page to the bottom of the screen ──────────────
  // Touch fits the canvas to the viewport's width only, so on most phones
  // (taller/narrower than the fixed A4-ish canvas) it doesn't reach the
  // full viewport height — deck-stage centres it, leaving an empty cream
  // strip both above and below. The strip above is already covered by
  // the top-dock; bottom-anchoring the canvas instead of centring it
  // moves that same empty space entirely above the page (further hidden
  // behind/around the top-dock) so the page itself runs flush to the
  // bottom edge, with no bare strip below it. Skipped once the page is
  // tall enough to need its own scroll (deck-stage's "stage-scroll"),
  // since that mode anchors to the top by design.
  if (isTouch && deck && deck.shadowRoot) {
    const stageEl = deck.shadowRoot.querySelector('.stage');
    const canvasElForAnchor = deck.shadowRoot.querySelector('.canvas');
    const baseDesignHeight = parseFloat(deck.getAttribute('height')) || 1123;

    const getCanvasScale = () => {
      if (!canvasElForAnchor) return 1;
      const m = getComputedStyle(canvasElForAnchor).transform;
      if (!m || m === 'none') return 1;
      const match = m.match(/matrix\(([^,]+),/);
      return match ? parseFloat(match[1]) || 1 : 1;
    };

    const applyStageAnchor = () => {
      if (!stageEl) return;
      const scrolling = stageEl.classList.contains('stage-scroll');
      const active = document.querySelector('section.page[data-deck-active]');
      const isScrollablePage = !!(active && active.classList.contains('page-scrollable'));
      // Always top-anchor so the canvas starts flush with the screen top
      // (right behind the top-dock) instead of floating at the bottom with
      // a large cream gap between the header and the page content.
      stageEl.style.alignItems = scrolling ? '' : 'flex-start';
      // The canvas's layout box is its full unscaled (794×1123) size —
      // align-items positions that box, then `transform: scale()` shrinks
      // it from transform-origin. Both must pivot from the same edge.
      if (canvasElForAnchor) {
        canvasElForAnchor.style.transformOrigin = scrolling ? '' : 'top center';
      }
      // Expose the top-dock height (screen px → design px) as a CSS var so
      // page content can push itself below the fixed dock. Recomputed on
      // every call because resize/orientation changes alter both the dock
      // height (safe-area-inset-top) and the canvas scale.
      const scale = getCanvasScale();
      if (topDock && scale > 0) {
        const dockH = topDock.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--dock-clearance', Math.ceil(dockH / scale) + 'px');
      }
      // A scrollable page's canvas is also stretched (in un-scaled design
      // px) so its scaled height exactly matches the viewport — otherwise
      // the fixed 794×1123 aspect leaves a bare gap below a short device
      // frame, wasted space the reader can't scroll into since it isn't
      // part of the page's own content.
      if (canvasElForAnchor && !scrolling) {
        if (isScrollablePage) {
          const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          canvasElForAnchor.style.height = (vh / scale) + 'px';
        } else {
          canvasElForAnchor.style.height = baseDesignHeight + 'px';
        }
      }
    };
    applyStageAnchor();
    window.addEventListener('resize', applyStageAnchor);
    if (deck) deck.addEventListener('slidechange', applyStageAnchor);
    setTimeout(applyStageAnchor, 250);
    setTimeout(applyStageAnchor, 1000);
  }

  // ── 3. Copy buttons ──────────────────────────────────────────────────
  document.querySelectorAll('[data-copy], [data-copy-id]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      let text = btn.getAttribute('data-copy');
      const id = btn.getAttribute('data-copy-id');
      if (id) {
        const el = document.getElementById(id);
        if (el) text = el.innerText.trim();
      }
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for non-https
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
      }
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1600);
    });
  });

  // ── 4. WhatsApp links — phone hardcoded directly in href on each .ftr-wpp ─

  // ── 5. Map button placeholder ────────────────────────────────────────
  document.querySelectorAll('[data-action="map"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Aberto';
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1600);
    });
  });

  // ── 6. Índice: saudação por horário (Bom dia / Boa tarde / Boa noite) ──
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  document.querySelectorAll('[data-greeting]').forEach((el) => {
    el.textContent = `${greeting}, seja bem-vindo(a)`;
  });
  document.querySelectorAll('[data-greeting-full]').forEach((el) => {
    el.textContent = `${greeting}, seja muito bem-vindo(a)!`;
  });

  // ── 7. Páginas internas: botão "MENU" (cabeçalho e rodapé) volta ao índice ─
  document.querySelectorAll('.gbi-menu-btn, .gbi-footer-menu-btn:not(.gbi-footer-menu-btn--wpp)').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); jumpTo(getTocIndex()); });
  });

  // ── 8. Cartões de conferência do check-out: marca visual ao concluir ───
  document.querySelectorAll('.gbi-check-item input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      cb.closest('.gbi-check-item').classList.toggle('is-checked', cb.checked);
    });
  });
})();
