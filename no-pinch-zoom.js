// no-pinch-zoom.js — best-effort JS-level block for pinch-zoom and
// double-tap-zoom gestures. The viewport meta tag alone
// (user-scalable=no) is silently ignored by modern iOS Safari and
// recent Android Chrome for accessibility reasons, so this adds a
// second layer: cancel any multi-touch move (pinch) and any second tap
// that lands within 300ms of the previous one (double-tap-zoom).
// Not a 100% guarantee on every browser/OS combo, but catches most.
(() => {
  'use strict';

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  ['gesturestart', 'gesturechange', 'gestureend'].forEach((type) => {
    document.addEventListener(type, (e) => e.preventDefault());
  });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
})();
