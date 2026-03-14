// src/js/main.js
// Minimal JS — only what the base template needs.
// Add feature-specific scripts as separate modules per project.

// ============================================================
// THEME TOGGLE
// ============================================================

window.toggleTheme = function () {
  const html    = document.documentElement;
  const current = html.dataset.theme;
  const next    = current === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  localStorage.setItem("theme", next);
};

// ============================================================
// MOBILE MENU
// ============================================================

window.toggleMenu = function (button) {
  const menu      = document.getElementById("mobile-menu");
  const isOpen    = button.getAttribute("aria-expanded") === "true";
  const nextState = !isOpen;

  button.setAttribute("aria-expanded", String(nextState));
  menu.hidden      = !nextState;
  menu.setAttribute("aria-hidden", String(!nextState));

  // Swap aria-label
  const site = document.querySelector("[data-site-language]");
  // Labels are set inline in the template via data attributes if needed
};

// ============================================================
// SKIP LINK — make it visible on focus (CSS handles most of this,
// but we ensure #main receives focus correctly)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      const main = document.getElementById("main");
      if (main) {
        main.focus();
        main.scrollIntoView();
      }
    });
  }
});
