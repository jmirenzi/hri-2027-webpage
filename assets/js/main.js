/*
 * HRI 2027 — Custom JavaScript
 */

// ── Dark mode toggle button ──────────────────────────────────────────────────
// Injects a floating button that manually overrides system preference.
// Uses localStorage to persist the user's choice across pages.

(function () {
  const STORAGE_KEY = 'hri-theme';

  function getTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('hri-theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function injectButton() {
    const btn = document.createElement('button');
    btn.id = 'hri-theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.textContent = getTheme() === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-bs-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
    document.body.appendChild(btn);
  }

  // Apply saved preference immediately (overrides the system-preference default
  // set inline in header.html) then inject the button once DOM is ready.
  applyTheme(getTheme());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();