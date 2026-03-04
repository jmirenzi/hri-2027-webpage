/*
 * HRI 2027 — Custom JavaScript
 */

// ── Dark mode toggle ─────────────────────────────────────────────────────────

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
    if (btn) btn.textContent = theme === 'dark' ? '☀' : '⏾';
  }

  function injectButton() {
    const btn = document.createElement('button');
    btn.id = 'hri-theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.textContent = getTheme() === 'dark' ? '☀' : '⏾';
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-bs-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
    document.body.appendChild(btn);
  }

  applyTheme(getTheme());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();


// ── Variable font hero animation ─────────────────────────────────────────────
// Matches the words array to DOM order of .hero-title .vf-word elements.
// Adjust the axes ranges below to match your design intent.

(function () {
  const config = {
    cycleInterval:      3,    // seconds between auto-randomize
    gravityStrength:    0.4,  // pulls wght/wdth toward mean so words don't diverge too wildly
    transitionDuration: 1200  // ms — keep in sync with CSS transition duration
  };

  // One entry per word, in DOM order.
  // Ranges should match the font's actual axis limits — Roboto Flex limits below.
  const words = [
    {
      text: 'Empowering',
      axes: {
        wght: { current: 659, min: 100,  max: 900  },
        wdth: { current: 110, min: 75,   max: 151  },
        slnt: { current: -9.7, min: -20, max: 0    },
        GRAD: { current: 99,  min: -200, max: 150  },
        opsz: { current: 54,  min: 8,   max: 144  }
      }
    },
    {
      text: 'Society',
      axes: {
        wght: { current: 817, min: 100,  max: 900  },
        wdth: { current: 90,  min: 75,   max: 151  },
        slnt: { current: -0.4, min: -20, max: 0    },
        GRAD: { current: -81, min: -200, max: 150  },
        opsz: { current: 98,  min: 8,   max: 144  }
      }
    }
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function average(values) {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  function applyStyles(elements) {
    elements.forEach((el, i) => {
      const w = words[i];
      if (!w) return;
      const ax = w.axes;
      el.style.fontVariationSettings =
        '"wght" ' + ax.wght.current.toFixed(1) +
        ', "wdth" ' + ax.wdth.current.toFixed(1) +
        ', "slnt" ' + ax.slnt.current.toFixed(2) +
        ', "GRAD" ' + ax.GRAD.current.toFixed(1) +
        ', "opsz" ' + ax.opsz.current.toFixed(1);
    });
  }

  function randomize(elements) {
    // Randomize all axes for all words
    words.forEach(w => {
      Object.values(w.axes).forEach(axis => {
        axis.current = axis.min + Math.random() * (axis.max - axis.min);
      });
    });

    // Gravity: pull wght and wdth toward the mean to keep words visually cohesive
    if (config.gravityStrength > 0 && words.length >= 2) {
      ['wght', 'wdth'].forEach(key => {
        const values = words.map(w => w.axes[key].current);
        const avg = average(values);
        words.forEach(w => {
          const axis = w.axes[key];
          const diff = axis.current - avg;
          const threshold = key === 'wght' ? 200 : 40;
          if (Math.abs(diff) > threshold) {
            axis.current = clamp(
              axis.current - diff * config.gravityStrength,
              axis.min, axis.max
            );
          }
        });
      });
    }

    applyStyles(elements);
  }

  function init() {
    const elements = document.querySelectorAll('.hero-title .vf-word');
    if (elements.length === 0) return; // not on homepage

    // Initial state after font is ready
    document.fonts.ready.then(() => {
      setTimeout(() => randomize(elements), 100);
    });

    // Auto-cycle
    setInterval(() => randomize(elements), config.cycleInterval * 1000);

    // Click to randomize
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.addEventListener('click', () => randomize(elements));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();