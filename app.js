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

  // Flat selection buttons (flat-pick-btn on slide-select)
  document.querySelectorAll('[data-select-flat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedFlat = btn.getAttribute('data-select-flat');
      localStorage.setItem('dimare-flat', selectedFlat);
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
      b.innerHTML = '<span aria-hidden="true">↩</span> Índice';
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

  // ── 2c. Mobile: bottom nav dock — prev / back-to-index / next ──────────
  // Side tap-zones (swipe-like navigation) are disabled (deck-stage.js):
  // they kept intercepting real buttons/links sitting in the side thirds
  // (index grid, header pills). Touch navigation is explicit buttons
  // instead, anchored to the screen's own bottom (in the empty space the
  // page-fit leaves there). Desktop is untouched — arrow keys / the
  // per-page header pill still work there (see styles.css for the
  // touch-only show/hide).
  if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    const navDock = document.createElement('div');
    navDock.className = 'nav-dock';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'nav-arrow';
    prevBtn.setAttribute('aria-label', 'Página anterior');
    prevBtn.innerHTML = '<span aria-hidden="true">‹</span>';
    prevBtn.addEventListener('click', () => { if (deck && deck.prev) deck.prev(); });

    const indexBtn = document.createElement('a');
    indexBtn.className = 'btn-index-dock';
    indexBtn.href = '#';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'nav-arrow';
    nextBtn.setAttribute('aria-label', 'Próxima página');
    nextBtn.innerHTML = '<span aria-hidden="true">›</span>';
    nextBtn.addEventListener('click', () => { if (deck && deck.next) deck.next(); });

    navDock.append(prevBtn, indexBtn, nextBtn);
    document.body.appendChild(navDock);

    const syncDock = (sec) => {
      if (!sec) return;
      const label = sec.getAttribute('data-label') || '';
      const id = sec.id || '';
      if (sec.classList.contains('page-cover') || id === 'slide-select') {
        indexBtn.style.visibility = 'hidden';
        return;
      }
      indexBtn.style.visibility = '';
      if (/[ÍI]ndice/i.test(label)) {
        indexBtn.innerHTML = '<span aria-hidden="true">↩</span> Escolher Flat';
        indexBtn.onclick = (e) => { e.preventDefault(); jumpTo(1); };
      } else {
        indexBtn.innerHTML = '<span aria-hidden="true">↩</span> Índice';
        indexBtn.onclick = (e) => { e.preventDefault(); jumpTo(getTocIndex()); };
      }
    };

    syncDock(document.querySelector('section.page[data-deck-active]'));
    if (deck) {
      deck.addEventListener('slidechange', (e) => syncDock(e.detail && e.detail.slide));
    }
  }

  // ── 2d. Mobile: top dock — bigger logo / language / back-to-index ──────
  // The in-page header (logo, flags) is scaled down with the rest of the
  // page canvas and reads too small on phones. This overlay (real screen
  // px, untouched by deck-stage's fit-to-width transform) puts an
  // enlarged logo, the language flags, and a direct way back to the
  // index at the very top of the screen — mirroring the bottom nav dock.
  if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    const topDock = document.createElement('div');
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
    topIndexBtn.innerHTML = '<span aria-hidden="true">↩</span> Índice';

    right.append(flagsSlot, topIndexBtn);
    topDock.append(logo, right);
    document.body.appendChild(topDock);

    const syncTopDock = (sec) => {
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
        topIndexBtn.innerHTML = '<span aria-hidden="true">↩</span> Índice';
        topIndexBtn.onclick = (e) => { e.preventDefault(); jumpTo(getTocIndex()); };
      }
    };

    syncTopDock(document.querySelector('section.page[data-deck-active]'));
    if (deck) {
      deck.addEventListener('slidechange', (e) => syncTopDock(e.detail && e.detail.slide));
    }
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
