// text-size.js — A-/A+ control that scales all guide text, placed in
// every page's header right next to the language flags.
// Every font-size in styles.css (and inline in guia-3-flats.html) is
// written as calc(Npx * var(--text-scale, 1)), so changing this one CSS
// variable on <html> resizes the whole guide's text at once. Persisted
// across pages/sessions via localStorage. Runs after i18n.js so the
// flag groups it inserts next to already exist.
(() => {
  'use strict';

  const STEPS = [0.9, 1, 1.1, 1.2, 1.3];
  const DEFAULT_INDEX = 1; // 1.0
  const STORAGE_KEY = 'guia-text-scale-idx';

  let idx = DEFAULT_INDEX;
  try {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!isNaN(saved) && saved >= 0 && saved < STEPS.length) idx = saved;
  } catch (e) {}

  const groups = [];

  const apply = () => {
    document.documentElement.style.setProperty('--text-scale', String(STEPS[idx]));
    groups.forEach(({ decBtn, incBtn }) => {
      decBtn.disabled = idx === 0;
      incBtn.disabled = idx === STEPS.length - 1;
    });
    try { localStorage.setItem(STORAGE_KEY, String(idx)); } catch (e) {}
  };

  const dec = () => { if (idx > 0) { idx -= 1; apply(); } };
  const inc = () => { if (idx < STEPS.length - 1) { idx += 1; apply(); } };

  function makeGroup() {
    const g = document.createElement('div');
    g.className = 'text-size-inline';
    g.setAttribute('data-noncommentable', '');

    const decBtn = document.createElement('button');
    decBtn.type = 'button';
    decBtn.className = 'text-size-btn text-size-btn--dec';
    decBtn.setAttribute('aria-label', 'Diminuir letra');
    decBtn.textContent = 'A−';
    decBtn.addEventListener('click', dec);

    const incBtn = document.createElement('button');
    incBtn.type = 'button';
    incBtn.className = 'text-size-btn text-size-btn--inc';
    incBtn.setAttribute('aria-label', 'Aumentar letra');
    incBtn.textContent = 'A+';
    incBtn.addEventListener('click', inc);

    g.append(decBtn, incBtn);
    groups.push({ decBtn, incBtn });
    return g;
  }

  function insertControls() {
    document.querySelectorAll('.hdr-right, .cover-top-right').forEach((container) => {
      if (container.closest('.top-dock')) return;
      if (container.querySelector('.text-size-inline')) return;
      const flags = container.querySelector('.lang-flags');
      const group = makeGroup();
      if (flags) flags.insertAdjacentElement('afterend', group);
      else container.appendChild(group);
    });
  }

  function init() {
    insertControls();
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
