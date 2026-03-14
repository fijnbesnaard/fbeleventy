// src/_data/i18n.js
// Translation strings — add a key block per supported language.
// Usage in templates: {{ i18n[locale].nav.home }}
// The active locale is set per-page via front matter: locale: nl

export default {
  nl: {
    nav: {
      home:    "Home",
      about:   "Over ons",
      contact: "Contact",
      blog:    "Blog",
    },
    footer: {
      rights:    "Alle rechten voorbehouden",
      builtBy:   "Gemaakt door",
    },
    aria: {
      skipToMain:   "Naar hoofdinhoud",
      openMenu:     "Menu openen",
      closeMenu:    "Menu sluiten",
      toggleTheme:  "Thema wisselen",
    },
    post: {
      publishedOn:  "Gepubliceerd op",
      readMore:     "Lees meer",
      backToBlog:   "Terug naar blog",
    },
  },

  en: {
    nav: {
      home:    "Home",
      about:   "About",
      contact: "Contact",
      blog:    "Blog",
    },
    footer: {
      rights:    "All rights reserved",
      builtBy:   "Built by",
    },
    aria: {
      skipToMain:   "Skip to main content",
      openMenu:     "Open menu",
      closeMenu:    "Close menu",
      toggleTheme:  "Toggle theme",
    },
    post: {
      publishedOn:  "Published on",
      readMore:     "Read more",
      backToBlog:   "Back to blog",
    },
  },
};
