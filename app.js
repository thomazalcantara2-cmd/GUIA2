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
    // Skip: cover, flat select page, and all 3 TOC pages
    if (
      sec.classList.contains('page-cover') ||
      id === 'slide-select' ||
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
  if (isTouch) {
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

    // ── Bottom dock — WhatsApp button in real screen px (not inside scaled canvas)
    const wppIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
    const bottomDock = document.createElement('div');
    bottomDock.className = 'bottom-dock';
    const wppBtn = document.createElement('a');
    wppBtn.className = 'ftr-wpp';
    wppBtn.href = 'https://wa.me/5581863595​64';
    wppBtn.target = '_blank';
    wppBtn.innerHTML = `${wppIcon} Falar com o anfitrião`;
    bottomDock.appendChild(wppBtn);
    document.body.appendChild(bottomDock);

    const syncBottomDock = (sec) => {
      if (!sec) return;
      const hide = sec.classList.contains('page-cover') || sec.id === 'slide-select';
      bottomDock.style.visibility = hide ? 'hidden' : '';
    };
    syncBottomDock(document.querySelector('section.page[data-deck-active]'));
    if (deck) deck.addEventListener('slidechange', (e) => syncBottomDock(e.detail && e.detail.slide));
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

    const syncDocks = (sec) => {
      if (!sec) return;
      const label = sec.getAttribute('data-label') || '';
      const id = sec.id || '';
      if (sec.classList.contains('page-cover') || id === 'slide-select') {
        topDock.style.visibility = 'hidden';
        return;
      }
      topDock.style.visibility = '';
      if (/[ÍI]ndice/i.test(label)) {
        topIndexBtn.innerHTML = '<span aria-hidden="true">↩</span> Escolher Flat';
        topIndexBtn.onclick = (e) => { e.preventDefault(); jumpTo(1); };
      } else {
        topIndexBtn.innerHTML = '<span aria-hidden="true">↩</span> Retornar ao menu';
        topIndexBtn.onclick = (e) => { e.preventDefault(); jumpTo(getTocIndex()); };
      }
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
})();
