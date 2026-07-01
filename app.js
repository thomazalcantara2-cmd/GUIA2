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
  const FLAT_INFO_IDS = { '201': 'slide-5', '202': 'slide-6', '301': 'slide-7' };
  const FLAT_WIFI_IDS = { '201': 'slide-wifi-201', '202': 'slide-wifi-202', '301': 'slide-wifi-301' };
  function applyFlatSkip() {
    Object.keys(FLAT_TOC_IDS).forEach((f) => {
      const isSelected = f === selectedFlat;
      [FLAT_TOC_IDS[f], FLAT_INFO_IDS[f], FLAT_WIFI_IDS[f]].forEach((id) => {
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

  // ── 2c. Nav dock — prev / next arrows, top-right below the top-dock ────
  // Side tap-zones (swipe-like navigation) are disabled (deck-stage.js):
  // they kept intercepting real buttons/links sitting in the side thirds
  // (index grid, header pills). Real screen px, same overlay pattern as
  // the top-dock — shown at every breakpoint (see "2e" below for the
  // desktop alignment step).
  let navDock = null;
  {
    navDock = document.createElement('div');
    navDock.className = 'nav-dock';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'nav-arrow';
    prevBtn.setAttribute('aria-label', 'Página anterior');
    prevBtn.innerHTML = '<span aria-hidden="true">‹</span>';
    prevBtn.addEventListener('click', () => { if (deck && deck.prev) deck.prev(); });

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'nav-arrow';
    nextBtn.setAttribute('aria-label', 'Próxima página');
    nextBtn.innerHTML = '<span aria-hidden="true">›</span>';
    nextBtn.addEventListener('click', () => { if (deck && deck.next) deck.next(); });

    navDock.append(prevBtn, nextBtn);
    document.body.appendChild(navDock);
  }

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
  }

  // ── 2d. Top dock — bigger logo / language / back-to-menu ────────────────
  // The in-page header (logo, flags) is scaled down with the rest of the
  // page canvas and reads too small once the canvas is shrunk to fit, so
  // this overlay (real screen px, untouched by deck-stage's transform)
  // carries an enlarged logo, the language flags, and a direct way back
  // to the menu instead. Shown at every breakpoint, together with the
  // nav-dock's arrows.
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
        if (navDock) navDock.style.visibility = 'hidden';
        return;
      }
      topDock.style.visibility = '';
      // The "Recepção & Acesso" hero photo runs edge-to-edge behind the
      // dock, and the prev/next arrows would sit right on top of its
      // title — drop just the arrows there, keep the logo/menu button.
      if (navDock) navDock.style.visibility = sec.classList.contains('rc-page') ? 'hidden' : '';
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
  // (left/right: 16px) already hugs the real page edges. On desktop the
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
      const leftPx = rect.left + inset;
      const rightPx = (window.innerWidth - rect.right) + inset;
      const topPx = rect.top + 14;
      topDock.style.left = leftPx + 'px';
      topDock.style.right = rightPx + 'px';
      topDock.style.top = topPx + 'px';
      if (navDock) {
        navDock.style.right = rightPx + 'px';
        navDock.style.top = (topPx + 66) + 'px';
      }
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
    const applyStageAnchor = () => {
      if (!stageEl) return;
      const scrolling = stageEl.classList.contains('stage-scroll');
      // A page that scrolls internally (.page-scrollable, e.g. "Recepção
      // & Acesso") reads better anchored to the top too — its own content
      // starts right under the top-dock instead of behind extra bottom
      // slack the reader would never otherwise see without scrolling up.
      const active = document.querySelector('section.page[data-deck-active]');
      const anchorTop = scrolling || (active && active.classList.contains('page-scrollable'));
      stageEl.style.alignItems = anchorTop ? (scrolling ? '' : 'flex-start') : 'flex-end';
      // The canvas's layout box is its full unscaled (794×1123) size —
      // align-items positions that box, then `transform: scale()` shrinks
      // it from transform-origin. Anchoring an edge without also pivoting
      // the scale from that same edge leaves the shrunk page floating in
      // the wrong place (still centred on the oversized box), so both
      // need to move together.
      if (canvasElForAnchor) {
        canvasElForAnchor.style.transformOrigin = scrolling ? '' : (anchorTop ? 'top center' : 'bottom center');
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

  // ── 4. WhatsApp links — derive wa.me URL from the phone text in the element ─
  document.querySelectorAll('[data-wpp]').forEach((el) => {
    el.setAttribute('href', '#');
    el.addEventListener('click', (e) => {
      e.preventDefault();
      // Try to extract a phone from the same element
      const m = el.innerText.match(/[\d\s\-\(\)]{8,}/);
      if (!m) return;
      const num = m[0].replace(/\D/g, '');
      if (num.length >= 10) {
        const wa = `https://wa.me/55${num}`;
        window.open(wa, '_blank');
      }
    });
  });

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
