// text-size.js — floating A-/A+ control that scales all guide text.
// Every font-size in styles.css (and inline in guia-3-flats.html) is
// written as calc(Npx * var(--text-scale, 1)), so changing this one CSS
// variable on <html> resizes the whole guide's text at once. Persisted
// across pages/sessions via localStorage.
(() => {
  'use strict';

  const STEPS = [0.85, 0.92, 1, 1.1, 1.2, 1.32, 1.45];
  const DEFAULT_INDEX = 2; // 1.0
  const STORAGE_KEY = 'guia-text-scale-idx';

  let idx = DEFAULT_INDEX;
  try {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!isNaN(saved) && saved >= 0 && saved < STEPS.length) idx = saved;
  } catch (e) {}

  const apply = () => {
    document.documentElement.style.setProperty('--text-scale', String(STEPS[idx]));
    decBtn.disabled = idx === 0;
    incBtn.disabled = idx === STEPS.length - 1;
    try { localStorage.setItem(STORAGE_KEY, String(idx)); } catch (e) {}
  };

  const dock = document.createElement('div');
  dock.className = 'text-size-dock';
  dock.setAttribute('data-noncommentable', '');

  const decBtn = document.createElement('button');
  decBtn.type = 'button';
  decBtn.className = 'text-size-btn text-size-btn--dec';
  decBtn.setAttribute('aria-label', 'Diminuir letra');
  decBtn.textContent = 'A−';
  decBtn.addEventListener('click', () => {
    if (idx > 0) { idx -= 1; apply(); }
  });

  const incBtn = document.createElement('button');
  incBtn.type = 'button';
  incBtn.className = 'text-size-btn text-size-btn--inc';
  incBtn.setAttribute('aria-label', 'Aumentar letra');
  incBtn.textContent = 'A+';
  incBtn.addEventListener('click', () => {
    if (idx < STEPS.length - 1) { idx += 1; apply(); }
  });

  dock.append(decBtn, incBtn);

  const init = () => {
    document.body.appendChild(dock);
    apply();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
