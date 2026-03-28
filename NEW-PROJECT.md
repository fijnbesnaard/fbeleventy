# New project setup — fbeleventy

Step-by-step guide for setting up a new client project using fbeleventy as a starter template.

**Prerequisites:**

- [GitHub CLI](https://cli.github.com) installed: `brew install gh`
- `fijnbesnaard/fbeleventy` marked as a template on GitHub:
  Settings → check **"Template repository"** (one-time)
- `gh` configured as the git credential helper (one-time per machine):
  ```bash
  gh auth setup-git
  ```
  This ensures `gh auth switch` also controls which account git pushes as.
  Without it, macOS Keychain may cache the wrong account's credentials.

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

## 2. Switch to the client's GitHub account

If you've logged in before with a different account, add the new one:

```bash
gh auth login
```

Follow the prompts: select **GitHub.com → HTTPS → Login with a web browser**. This adds the client account without removing yours.

To switch between accounts at any time:
```bash
gh auth switch
gh auth status   # confirm who you're now acting as
```

---

## 3. Create the repo from the template and clone it

```bash
gh repo create client/sitename \
  --private \
  --template fijnbesnaard/fbeleventy \
  --clone

cd sitename
```

This creates the repo under the client's account, copies the template, and clones it locally in one step. Authentication for pushes is handled automatically by `gh`.

---

## 4. Run the setup script

```bash
node setup.js
```

The script will:
1. Confirm you're acting as the right GitHub account (prompts if not)
2. Auto-detect the GitHub repo from the cloned directory
3. Prompt for project details (title, URL, author, Cloudinary credentials, menu variant)
4. Patch `src/_data/site.json`, `src/static/admin/config.yml`, `eleventy.config.js`
5. Commit and push the changes

Then:

```bash
npm install
npm start
```

- Site: `http://localhost:8080`
- CMS: `http://localhost:8080/admin/`

---

## 5. Manual setup (not automated)

These require files or design decisions — handle them per project:

- [ ] **Fonts** — add `.woff2` files to `src/fonts/`, uncomment `@font-face` in `base.css`, update family names in `tokens/typography.css`
- [ ] **Brand colors** — update `src/css/tokens/colors.css`
- [ ] **Favicon** — add favicon files to `src/static/`
- [ ] **OG image** — add `src/static/images/og-default.jpg`
- [ ] **Nav items** — update `src/_data/nav.json` (or use the CMS)
- [ ] **Menu variant** — verify the variant set during setup looks right; adjust CSS/JS per variant if needed
- [ ] **i18n** — if single-language, simplify `src/_data/i18n.js` and remove unused locale from `config.yml`

---

## 6. Connect Netlify

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

## 7. Point the domain (when ready)

1. Netlify → Domain settings → **Add custom domain**
2. Update DNS at the registrar (Netlify's nameservers or CNAME)
3. SSL is provisioned automatically

---

## 8. Go live checklist

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

## Switching between client accounts

```bash
gh auth status          # see all logged-in accounts and who's active
gh auth switch          # interactive account switcher
gh auth login           # add another account
```

Always run `gh auth status` before creating a new repo to confirm you're acting as the right account.
