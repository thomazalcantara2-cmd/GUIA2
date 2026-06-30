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

  // ── 2c. Mobile: move the back-navigation pill into a fixed bottom dock ──
  // On touch the page is scaled to fit, so a header pill renders tiny and
  // often sits inside the swipe tap-zones; a single fixed pill anchored to
  // the screen's own bottom (in the empty space left by the page-fit) is
  // bigger, consistent, and always reachable. Desktop keeps the per-page
  // header pill (see styles.css for the matching touch-only show/hide).
  if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    const dock = document.createElement('a');
    dock.className = 'btn-index-dock';
    dock.href = '#';
    document.body.appendChild(dock);

    const syncDock = (sec) => {
      if (!sec) return;
      const label = sec.getAttribute('data-label') || '';
      const id = sec.id || '';
      if (sec.classList.contains('page-cover') || id === 'slide-select') {
        dock.style.display = 'none';
        return;
      }
      dock.style.display = '';
      if (/[ÍI]ndice/i.test(label)) {
        dock.innerHTML = '<span aria-hidden="true">↩</span> Escolher Flat';
        dock.onclick = (e) => { e.preventDefault(); jumpTo(1); };
      } else {
        dock.innerHTML = '<span aria-hidden="true">↩</span> Índice';
        dock.onclick = (e) => { e.preventDefault(); jumpTo(getTocIndex()); };
      }
    };

    syncDock(document.querySelector('section.page[data-deck-active]'));
    if (deck) {
      deck.addEventListener('slidechange', (e) => syncDock(e.detail && e.detail.slide));
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
