// src/js/menu--clippath.js
// Menu variant: Clip-Path Circular Reveal

const toggle  = document.getElementById('menu-toggle');
const overlay = document.getElementById('nav-overlay');
let isOpen    = false;

// Keep clip-path origin locked to the toggle button's center, even on resize
function updateOrigin() {
  const rect = toggle.getBoundingClientRect();
  const cx   = Math.round(rect.left + rect.width  / 2);
  const cy   = Math.round(rect.top  + rect.height / 2);
  document.documentElement.style.setProperty('--origin-x', cx + 'px');
  document.documentElement.style.setProperty('--origin-y', cy + 'px');
}

updateOrigin();
window.addEventListener('resize', updateOrigin, { passive: true });

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

const supportsScrollbarGutter = CSS.supports('scrollbar-gutter', 'stable');

function openMenu() {
  updateOrigin(); // recalculate in case viewport changed
  if (!supportsScrollbarGutter) {
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
  }
  document.body.classList.add('menu-open');
  toggle.classList.add('is-active');
  toggle.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');
  isOpen = true;
  // Slight delay so the clip-path animation has started before focus moves
  const firstLink = overlay.querySelector('a');
  if (firstLink) setTimeout(() => firstLink.focus(), 100);
}

function closeMenu() {
  document.body.classList.remove('menu-open');
  if (!supportsScrollbarGutter) {
    document.body.style.paddingRight = '';
  }
  toggle.classList.remove('is-active');
  toggle.setAttribute('aria-expanded', 'false');
  overlay.setAttribute('aria-hidden', 'true');
  isOpen = false;
  toggle.focus();
}

toggle.addEventListener('click', () => {
  isOpen ? closeMenu() : openMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen) closeMenu();
});

overlay.querySelectorAll('ul a').forEach(link => {
  link.addEventListener('click', closeMenu);
});
