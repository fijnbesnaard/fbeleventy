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

`npm start` runs three processes in parallel:
- **`dev:11ty`** — Eleventy with live reload
- **`dev:css`** — PostCSS watching `src/css/main.css` → `public/css/main.css`
- **`dev:cms`** — Local backend proxy (enables CMS content saving to local filesystem)

---

## Project structure

```
animated-offscreen-menus/     ← Standalone HTML demos for all 3 menu variants
src/
├── _data/
│   ├── site.json      ← Global site config (title, URL, menuVariant, author…)
│   ├── nav.json       ← Navigation items (label + url)
│   └── i18n.js        ← Translation strings per locale (nl / en)
├── _includes/
│   ├── layouts/
│   │   ├── base.njk         ← Root HTML, SEO meta, Open Graph, loads variant CSS/JS
│   │   ├── page.njk         ← Generic full-width page — content defines its own containers
│   │   └── post.njk         ← Blog post
│   └── partials/
│       ├── header--slide.njk     ← Menu variant: slide in from left
│       ├── header--overlay.njk   ← Menu variant: full-screen overlay with stagger
│       ├── header--clippath.njk  ← Menu variant: circular clip-path reveal
│       ├── footer.njk
│       └── components/
│           └── button.njk        ← Nunjucks macros (copy from catalog)
├── content/
│   ├── pages/         ← CMS-managed pages (.md)
│   └── posts/         ← Blog posts (.md)
├── css/
│   ├── main.css       ← PostCSS entry point (@layer declarations + @imports)
│   ├── tokens/        ← Design tokens (colors, typography, spacing, layout)
│   └── layers/
│       ├── reset.css
│       ├── base.css
│       ├── layout.css
│       ├── components.css      ← Aggregator: @imports one file per component
│       ├── components/
│       │   └── button.css      ← One file per component (copy from catalog)
│       ├── utilities.css
│       ├── header.css          ← Header shell, hamburger toggle (shared by all variants)
│       ├── menu--slide.css     ← Menu variant styles (passthrough copied, not PostCSS)
│       ├── menu--overlay.css
│       └── menu--clippath.css
├── fonts/             ← Self-hosted font files (.woff2)
├── js/
│   ├── main.js            ← Theme toggle, skip link
│   ├── menu--slide.js     ← Menu variant open/close logic
│   ├── menu--overlay.js
│   ├── menu--clippath.js
│   └── components/        ← Optional component JS (copy from catalog)
└── static/
    ├── admin/
    │   ├── index.html ← Sveltia CMS entry point
    │   └── config.yml ← CMS collection definitions
    └── icons/         ← SVG icons (used via {% svg "name" %} shortcode)
```

---

## Per-project setup checklist

- [ ] Update `src/_data/site.json` — title, URL, author, locale
- [ ] Set `menuVariant` in `src/_data/site.json` — `"slide"`, `"overlay"`, or `"clippath"`
- [ ] Update nav items in `src/_data/nav.json`
- [ ] Update `src/static/admin/config.yml` — repo name, branch
- [ ] Add font files to `src/fonts/`, uncomment `@font-face` in `base.css`
- [ ] Update font family names in `tokens/typography.css`
- [ ] Replace brand colors in `tokens/colors.css`
- [ ] Add OG default image at `src/static/images/og-default.jpg`
- [ ] Add favicon files to `src/static/`
- [ ] Set `language` and `locale` in `site.json` (remove unused i18n locales if single-language)

---

## Menu variants

Three off-canvas navigation styles are included. Pick one per project by setting `menuVariant` in `src/_data/site.json`:

```json
"menuVariant": "slide"
```

| Value | Style | Description |
|---|---|---|
| `"slide"` | Slide in from left | Full-viewport dark panel slides in using `translateX`. Large type, animated underline on hover. |
| `"overlay"` | Full-screen overlay | Fades in with a subtle background "bloom" (`scale(1.04 → 1)`). Nav items stagger up on entrance. Optional two-column layout with a side column. |
| `"clippath"` | Circular reveal | Expands from the toggle button center via `clip-path: circle()`. Items slide up with stagger; arrow glyphs appear on hover. |

**What changes when you switch:**

- `base.njk` dynamically includes `partials/header--{variant}.njk`
- `base.njk` loads `css/layers/menu--{variant}.css` via a `<link>` tag
- `base.njk` loads `js/menu--{variant}.js` as an ES module

No other files need to be touched.

**Customising a variant:**

Each variant owns three files — edit only those for the chosen variant:

```
src/_includes/partials/header--{variant}.njk  ← HTML structure, nav links
src/css/layers/menu--{variant}.css            ← All animation and colour styles
src/js/menu--{variant}.js                     ← Open/close logic
```

The toggle button's structure (size, bar dimensions, hamburger → cross animation) is shared across all variants in `src/css/layers/header.css`.

**Toggle button placement:**

The `.menu-toggle` button is rendered **outside** the `<header>` element (between `</header>` and the `<nav>` overlay). This is intentional: `<header>` has `position: sticky` with a `z-index`, which creates a stacking context that would cap the toggle's own `z-index` — making it disappear behind the open menu. Placing it outside `<header>` gives it a root-level stacking context so `z-index: 1000` works as expected.

**Toggle state:**

The JS modules set both `aria-expanded="true"` on the button and add the `.is-active` class. The CSS in `header.css` uses `.is-active` for the hamburger → cross animation.

**Reference demos:**

The original standalone HTML demos are in `animated-offscreen-menus/` — useful for previewing animations or prototyping changes before integrating.

---

## CSS architecture

### Pipeline

PostCSS processes only `src/css/main.css` → `public/css/main.css`. It resolves all `@import` statements (via `postcss-import`) and applies autoprefixer. In production, cssnano minifies the output.

The **menu variant CSS files** (`menu--*.css`) are **not** imported into `main.css`. They are passthrough copied by Eleventy directly to `public/css/layers/` and loaded via a `<link>` tag in `base.njk`. They do not go through PostCSS.

### Layers

Cascade order (lowest → highest specificity):

| Layer         | File                       | Purpose                                     |
| ------------- | -------------------------- | ------------------------------------------- |
| `reset`       | layers/reset.css           | Normalize browser defaults                         |
| `base`        | layers/base.css            | Raw element styles + fonts                  |
| `tokens`      | tokens/\*.css              | Custom property definitions                 |
| `layout`      | layers/layout.css          | Container widths, gutter, grid tokens; `.container` class |
| `components`  | layers/components.css      | UI components                               |
| `utilities`   | layers/utilities.css       | Single-purpose helpers                      |
| `header`      | layers/header.css          | Header shell, hamburger toggle button       |
| *(unlayered)* | layers/menu--{variant}.css | Active menu variant — overrides all layers  |

The menu variant CSS is unlayered (loaded via `<link>`, not `@import`), so it naturally overrides any layered styles without needing higher specificity selectors.

### Key custom properties (header.css)

| Property | Default | Purpose |
|---|---|---|
| `--toggle-size` | `48px` | Width and height of the hamburger button |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Easing for bar animations |
| `--menu-visible` | *(project-specific)* | Breakpoint at which desktop nav shows and toggle hides — update both the variable and the `@media` query to match |
| `--header-height` | `64px` | Used for layout calculations |

---

## Component library workflow

Components are kept in the **[studio-components](../studio-components)** catalog repo (sibling directory) and copied into projects as needed. The starter is intentionally lean — only the button component is included by default.

### Folder structure

Each component lives in three places:

```
src/
├── css/layers/components/
│   └── button.css          ← component styles (imported in components.css)
├── _includes/components/
│   └── button.njk          ← Nunjucks macro
└── js/components/
    └── (component.js)      ← optional, only when JS is needed
```

### Adding a component from the catalog

1. Copy the component files into the three folders above
2. Register the CSS in `components.css`:
   ```css
   @import "components/card.css";
   ```
3. Use the macro in templates:
   ```njk
   {% from "components/card.njk" import card %}
   {{ card({ title: "Project", body: "Description" }) }}
   ```
4. If the component has a JS file, load it where needed — either globally in `base.njk` or per-page in `{% block scripts %}`:
   ```njk
   {% block scripts %}
     <script type="module" src="/js/components/accordion.js"></script>
   {% endblock %}
   ```

### Using the button (included by default)

```njk
{% from "components/button.njk" import button %}

{{ button({ label: "Contact us", url: "/contact/", variant: "primary" }) }}
{{ button({ label: "Learn more", url: "/about/",   variant: "ghost" }) }}
{{ button({ label: "Submit",                        variant: "primary", size: "lg" }) }}
```

Renders as an `<a>` when `url` is set, `<button>` otherwise.

### Building a new component

Follow this structure so it can be copied back to the catalog:

```
my-component/
├── my-component.css   ← only semantic tokens, no raw values
├── my-component.njk   ← macro with documented parameters
└── my-component.js    ← only if JS is needed (ES module, self-contained)
```

Rule: **a component should work by itself** — drop in the three files, add the import, and it works with no other changes.

### Sending a component back to the catalog

When a component built on a project is mature enough to reuse:
1. Copy the three files back to the catalog repo
2. Remove any project-specific hardcoding (replace with token references or macro parameters)
3. Add usage examples to the component file header

---

## Layout and containers

Use `.container` to centre content and apply the responsive gutter automatically:

```html
<!-- Standard width (960px) -->
<div class="container">...</div>

<!-- Narrow — long-form text, articles, forms (640px) -->
<div class="container container--narrow">...</div>

<!-- Wide — galleries, dashboards (1280px) -->
<div class="container container--wide">...</div>

<!-- Full bleed — no container; background goes edge to edge -->
<section class="bg-subtle">
  <div class="container">content still constrained inside</div>
</section>
```

The gutter (`padding-inline`) is responsive automatically:

| Breakpoint | Gutter |
|---|---|
| Mobile (default) | 16px (`--space-4`) |
| Tablet (768px+) | 32px (`--space-8`) |
| Desktop (1024px+) | 48px (`--space-12`) |

Container widths are set via tokens in `layers/layout.css` (`--width-narrow`, `--width-default`, `--width-wide`) and can be adjusted there.

---

## JavaScript

The project uses ES modules throughout (`"type": "module"` in `package.json`).

| File | Purpose |
|---|---|
| `main.js` | `window.toggleTheme()` (called by the theme toggle button via `onclick`), skip link focus management |
| `menu--{variant}.js` | Self-contained module: attaches open/close listeners to `#menu-toggle` and `#nav-overlay`, handles Escape key, scrollbar-gutter fallback |

Menu JS modules use `document.getElementById` — the IDs `menu-toggle` and `nav-overlay` must be present in the active header partial.

---

## Dark mode

Dark mode respects `prefers-color-scheme` by default and can be toggled manually. The theme is saved to `localStorage` and applied before first paint (inline script in `base.njk`) to prevent flash.

- `data-theme="dark"` / `data-theme="light"` is set on `<html>`
- Theme toggle button is in each header partial, calls `window.toggleTheme()`
- Override semantic color tokens in `tokens/colors.css` under `[data-theme="dark"]`

---

## i18n

Translations live in `src/_data/i18n.js`.
Set `locale: nl` (or `en`) in each page's front matter.
Use `{{ i18n[locale].aria.openMenu }}` in templates.

For multi-language content, Sveltia CMS uses `i18n.structure: multiple_folders`,
creating `/nl/` and `/en/` content subfolders automatically.

---

## Cloudinary (media library)

Cloudinary is pre-configured as the media library for Sveltia CMS. Images uploaded via the CMS are stored in Cloudinary — not in the Git repo.

**`src/static/admin/config.yml`** already contains:
```yaml
media_library:
  name: cloudinary
  config:
    cloud_name: djkbyv665
    api_key: 467429173567316
```

Per-project setup:
- Replace `cloud_name` and `api_key` with the client's Cloudinary credentials
- The API secret stays server-side — Sveltia handles auth via its widget

**Note:** `eleventyImageTransformPlugin` is intentionally NOT used. It would re-download and re-optimise Cloudinary images at build time (double-optimisation). Use Cloudinary's own URL transforms (`f_auto,q_auto,w_800`) directly in image URLs instead.

---

## Local CMS editing (dev)

`local_backend: true` is enabled in `config.yml` by default. This lets the CMS write content files to your local filesystem during development (via the backend proxy), without needing GitHub credentials.

**Start the local backend proxy:**

```bash
npm start
```

`npm start` runs three processes in parallel:
- **`dev:11ty`** — Eleventy with live reload
- **`dev:css`** — PostCSS watching `src/css/main.css` → `public/css/main.css`
- **`dev:cms`** — `@sveltia/cms-backend-proxy` (enables local content saving)

CMS admin at `http://localhost:8080/admin/`

**Before going live:** comment out `local_backend: true` in `src/static/admin/config.yml`. The CMS will then use the GitHub backend (requires GitHub OAuth on your host).

---

## Deployment

Works with any static host. Netlify recommended for Sveltia CMS Git backend.

**Build command:** `npm run build`
**Output directory:** `public`
