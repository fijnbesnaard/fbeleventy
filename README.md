# Eleventy Starter — Studio Fijnbesnaard

Starter template for small and medium websites.
Stack: Eleventy 3 · Sveltia CMS · PostCSS · Nunjucks

---

## Quick start

```bash
npm install
npm start
```

Site runs at `http://localhost:8080`
CMS admin at `http://localhost:8080/admin/`

---

## Project structure

```
src/
├── _data/
│   ├── site.js        ← Global site config (title, URL, author)
│   └── i18n.js        ← Translation strings per locale
├── _includes/
│   ├── layouts/
│   │   ├── base.njk   ← Root HTML, SEO, Open Graph
│   │   ├── page.njk   ← Standard content page
│   │   └── post.njk   ← Blog post
│   └── partials/
│       ├── header.njk
│       └── footer.njk
├── content/
│   ├── pages/         ← CMS-managed pages (.md)
│   └── posts/         ← Blog posts (.md)
├── css/
│   ├── main.css       ← Entry point (@layer declarations + imports)
│   ├── tokens/        ← Design tokens (colors, type, spacing, layout)
│   └── layers/        ← reset · base · layout · components · utilities
├── fonts/             ← Self-hosted font files (.woff2)
├── js/
│   └── main.js        ← Theme toggle, mobile menu, skip link
└── static/
    ├── admin/
    │   ├── index.html ← Sveltia CMS entry point
    │   └── config.yml ← CMS collection definitions
    └── icons/         ← SVG icons (used via {% svg "name" %} shortcode)
```

---

## Per-project setup checklist

- [ ] Update `src/_data/site.js` — title, URL, author, locale
- [ ] Update `src/static/admin/config.yml` — repo name, branch
- [ ] Add font files to `src/fonts/`, uncomment `@font-face` in `base.css`
- [ ] Update font family names in `tokens/typography.css`
- [ ] Replace brand colors in `tokens/colors.css`
- [ ] Add OG default image at `src/static/images/og-default.jpg`
- [ ] Add favicon files to `src/static/`
- [ ] Update nav items in `partials/header.njk` (or move to `_data/nav.js`)
- [ ] Set `language` and `locale` in `site.js` (remove unused i18n locales if single-language)

---

## CSS architecture

Layers (in cascade order, lowest to highest specificity):

| Layer        | File                        | Purpose                        |
|--------------|-----------------------------|--------------------------------|
| `reset`      | layers/reset.css            | Normalize browser defaults     |
| `base`       | layers/base.css             | Raw element styles + fonts     |
| `tokens`     | tokens/*.css                | Custom property definitions    |
| `layout`     | layers/layout.css           | Container, grid, section       |
| `components` | layers/components.css       | UI components                  |
| `utilities`  | layers/utilities.css        | Single-purpose helpers         |

---

## Dark mode

Dark mode respects `prefers-color-scheme` by default, and can be toggled manually. The theme is saved to `localStorage`.

- Toggle button is in the header partial
- `data-theme="dark"` / `data-theme="light"` is set on `<html>`
- Override semantic color tokens in `tokens/colors.css` under `[data-theme="dark"]`

---

## i18n

Translations live in `src/_data/i18n.js`.
Set `locale: nl` (or `en`) in each page's front matter.
Use `{{ i18n[locale].nav.home }}` in templates.

For multi-language content, Sveltia CMS uses `i18n.structure: multiple_folders`,
creating `/nl/` and `/en/` content subfolders automatically.

---

## Deployment

Works with any static host. Netlify recommended for Sveltia CMS Git backend.

**Build command:** `npm run build`
**Output directory:** `public`
