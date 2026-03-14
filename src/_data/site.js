// src/_data/site.js
// Global site data — available in all templates as {{ site.* }}
// Override per-project before launch.

export default {
  title:       "Site Title",
  description: "Site description for SEO and Open Graph.",
  url:         "https://example.com",  // no trailing slash
  language:    "nl",                   // primary language
  locale:      "nl_NL",               // Open Graph locale
  author: {
    name:  "Studio Fijnbesnaard",
    email: "hallo@studiofijnbesnaard.nl",
    url:   "https://studiofijnbesnaard.nl",
  },
  social: {
    // Add handles as needed per project
    // twitter: "@handle",
    // instagram: "@handle",
  },
  themeColor: "#2979f5",  // Browser chrome color (matches --color-brand-500)
};
