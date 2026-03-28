# New project setup — fbeleventy

Step-by-step guide for setting up a new client project using fbeleventy as a starter template.

---

## 1. Create accounts

Use the client's dedicated email address for each service.

- [ ] **GitHub** — [github.com](https://github.com) → Sign up → verify email
- [ ] **Netlify** — [netlify.com](https://netlify.com) → Sign up with GitHub (links the accounts)
- [ ] **Cloudinary** — [cloudinary.com](https://cloudinary.com) → Sign up → note down:
  - Cloud name
  - API key
  *(API secret stays server-side — never put it in config files)*

---

## 2. Create the GitHub repo from the template

1. Go to `github.com/fijnbesnaard/fbeleventy`
2. Click **Use this template → Create a new repository**
3. Set owner to the client's GitHub account
4. Name the repo (e.g. `client-sitename`)
5. Set visibility (private recommended) → **Create repository**

---

## 3. Clone and run the setup script

```bash
git clone https://github.com/[client]/[repo].git
cd [repo]
node setup.js
```

The setup script will prompt for all project details and automatically patches:
- `src/_data/site.json` — title, URL, author, locale, menu variant
- `src/static/admin/config.yml` — GitHub repo, Cloudinary credentials
- `eleventy.config.js` — RSS feed metadata

After the script completes:

```bash
npm install
npm start
```

- Site: `http://localhost:8080`
- CMS: `http://localhost:8080/admin/`

---

## 4. Manual setup (not automated)

These require files or design decisions — handle them per project:

- [ ] **Fonts** — add `.woff2` files to `src/fonts/`, uncomment `@font-face` in `base.css`, update family names in `tokens/typography.css`
- [ ] **Brand colors** — update `src/css/tokens/colors.css`
- [ ] **Favicon** — add favicon files to `src/static/`
- [ ] **OG image** — add `src/static/images/og-default.jpg`
- [ ] **Nav items** — update `src/_data/nav.json` (or use the CMS)
- [ ] **Menu variant** — verify the variant set during setup looks right; adjust CSS/JS per variant if needed
- [ ] **i18n** — if single-language, simplify `src/_data/i18n.js` and remove unused locale from `config.yml`

---

## 5. Connect Netlify

1. Netlify dashboard → **Add new site → Import an existing project → GitHub**
2. Authorize Netlify on the client's GitHub account
3. Select the repo → set build settings:
   - Build command: `npm run build`
   - Publish directory: `public`
4. Click **Deploy site** — Netlify assigns a `.netlify.app` URL

**Enable Git Gateway for the CMS:**

1. Site settings → **Identity → Enable Identity**
2. Identity → **Services → Enable Git Gateway**
3. Identity → Registration → set to **Invite only**

---

## 6. Point the domain (when ready)

1. Netlify → Domain settings → **Add custom domain**
2. Update DNS at the registrar (Netlify's nameservers or CNAME)
3. SSL is provisioned automatically

---

## 7. Go live checklist

Before switching on the domain:

- [ ] Comment out `local_backend: true` in `src/static/admin/config.yml`
- [ ] Commit and push — Netlify redeploys automatically
- [ ] Test CMS login at `yourdomain.com/admin/` via Netlify Identity
- [ ] Test a content edit end-to-end (create post → save → check GitHub → check live site)
- [ ] Check OG image renders correctly (use [opengraph.xyz](https://www.opengraph.xyz))
- [ ] Run Lighthouse check

---

## Quick reference

| What | Where |
|---|---|
| Menu variant | `src/_data/site.json` → `menuVariant` |
| Nav items | `src/_data/nav.json` |
| Brand colors | `src/css/tokens/colors.css` |
| Typography | `src/css/tokens/typography.css` |
| CMS collections | `src/static/admin/config.yml` |
| Global site data | `src/_data/site.json` |
| RSS feed config | `eleventy.config.js` → feedPlugin metadata |
