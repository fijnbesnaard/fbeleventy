// src/js/main.js
// Shared utilities loaded on every page.
// Menu open/close logic lives in the active menu variant module (js/menu--*.js).

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
// SKIP LINK
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
