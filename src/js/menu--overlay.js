// src/js/menu--overlay.js
// Menu variant: Full-Screen Overlay with Stagger

const toggle  = document.getElementById('menu-toggle');
const overlay = document.getElementById('nav-overlay');
let isOpen    = false;

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

const supportsScrollbarGutter = CSS.supports('scrollbar-gutter', 'stable');

function openMenu() {
  if (!supportsScrollbarGutter) {
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
  }
  document.body.classList.add('menu-open');
  toggle.classList.add('is-active');
  overlay.classList.add('is-open');
  toggle.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');
  isOpen = true;
  const firstLink = overlay.querySelector('a');
  if (firstLink) firstLink.focus();
}

function closeMenu() {
  document.body.classList.remove('menu-open');
  if (!supportsScrollbarGutter) {
    document.body.style.paddingRight = '';
  }
  toggle.classList.remove('is-active');
  overlay.classList.remove('is-open');
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

overlay.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});
