#!/usr/bin/env node
/**
 * fbeleventy project setup
 * Run once after creating and cloning the repo via gh CLI:
 *   node setup.js
 */

import readline from 'readline';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultVal = '') {
  const hint = defaultVal ? ` (${defaultVal})` : '';
  return new Promise(resolve => {
    rl.question(`${question}${hint}: `, answer => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function choose(question, options, defaultVal) {
  return new Promise(resolve => {
    rl.question(`${question} [${options.join(' / ')}] (${defaultVal}): `, answer => {
      const val = answer.trim().toLowerCase();
      resolve(options.includes(val) ? val : defaultVal);
    });
  });
}

function ghExec(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

async function main() {
  console.log('\n── fbeleventy new project setup ──\n');

  // ── Check gh CLI is available ──────────────────────────────
  try {
    ghExec('gh --version');
  } catch {
    console.error('Error: gh CLI is not installed. See https://cli.github.com');
    process.exit(1);
  }

  // ── Show current gh account ────────────────────────────────
  let ghUser;
  try {
    ghUser = ghExec('gh api user -q .login');
    console.log(`Logged in to GitHub as: ${ghUser}`);
    const confirmed = await ask('Is this the correct account for this project? (y/n)', 'y');
    if (confirmed.toLowerCase() !== 'y') {
      console.log('\nRun: gh auth switch\nThen re-run this script.\n');
      rl.close();
      process.exit(0);
    }
  } catch {
    console.error('Not logged in to gh. Run: gh auth login');
    rl.close();
    process.exit(1);
  }

  // ── Auto-detect GitHub repo ────────────────────────────────
  let githubRepo;
  try {
    githubRepo = ghExec('gh repo view --json nameWithOwner -q .nameWithOwner');
    console.log(`GitHub repo: ${githubRepo}\n`);
  } catch {
    console.error('Could not detect GitHub repo. Make sure you are inside the cloned project directory.');
    rl.close();
    process.exit(1);
  }

  // ── Gather project details ─────────────────────────────────
  const title       = await ask('Site title');
  const description = await ask('Site description');
  const url         = await ask('Production URL (no trailing slash)', 'https://example.com');
  const authorName  = await ask('Author / studio name', 'Studio Fijnbesnaard');
  const authorEmail = await ask('Author email');
  const authorUrl   = await ask('Author website', url);
  const language    = await ask('Language code', 'nl');
  const locale      = await ask('Locale', 'nl_NL');
  const menuVariant = await choose('Menu variant', ['slide', 'overlay', 'clippath'], 'overlay');

  console.log('\n── Cloudinary ────────────────────────────────────────────');
  const cloudName   = await ask('Cloud name');
  const cloudApiKey = await ask('API key');

  rl.close();
  console.log();

  // ── Patch site.json ────────────────────────────────────────
  const siteJsonPath = 'src/_data/site.json';
  const site = JSON.parse(readFileSync(siteJsonPath, 'utf8'));
  site.menuVariant      = menuVariant;
  site.title            = title;
  site.description      = description;
  site.url              = url;
  site.language         = language;
  site.locale           = locale;
  site.author.name      = authorName;
  site.author.email     = authorEmail;
  site.author.url       = authorUrl;
  writeFileSync(siteJsonPath, JSON.stringify(site, null, 2) + '\n');
  console.log('✓ src/_data/site.json');

  // ── Patch config.yml ───────────────────────────────────────
  const configPath = 'src/static/admin/config.yml';
  let config = readFileSync(configPath, 'utf8');
  config = config.replace(/repo: .+/, `repo: ${githubRepo}`);
  config = config.replace(/cloud_name: .+/, `cloud_name: ${cloudName}`);
  config = config.replace(/api_key: .+/, `api_key: ${cloudApiKey}`);
  writeFileSync(configPath, config);
  console.log('✓ src/static/admin/config.yml');

  // ── Patch eleventy.config.js ───────────────────────────────
  const eleventyPath = 'eleventy.config.js';
  let eleventy = readFileSync(eleventyPath, 'utf8');
  eleventy = eleventy.replace(/language: "[^"]*"/, `language: "${language}"`);
  eleventy = eleventy.replace(/title: "Site title"/, `title: "${title}"`);
  eleventy = eleventy.replace(/subtitle: "Site description"/, `subtitle: "${description}"`);
  eleventy = eleventy.replace(/base: "https:\/\/example\.com\/"/, `base: "${url}/"`);
  eleventy = eleventy.replace(/name: "Author name"/, `name: "${authorName}"`);
  eleventy = eleventy.replace(/email: "author@example\.com"/, `email: "${authorEmail}"`);
  writeFileSync(eleventyPath, eleventy);
  console.log('✓ eleventy.config.js');

  // ── Commit and push ────────────────────────────────────────
  try {
    execSync('git add src/_data/site.json src/static/admin/config.yml eleventy.config.js', { stdio: 'pipe' });
    execSync(`git commit -m "Setup: configure for ${title}"`, { stdio: 'pipe' });
    execSync('git push', { stdio: 'pipe' });
    console.log('✓ Committed and pushed to GitHub');
  } catch {
    console.log('  (git commit/push skipped — no changes or push failed)');
  }

  // ── Done ───────────────────────────────────────────────────
  console.log('\n── Done ──────────────────────────────────────────────────\n');
  console.log('Next steps:');
  console.log('  npm install');
  console.log('  npm start');
  console.log('  Site:  http://localhost:8080');
  console.log('  CMS:   http://localhost:8080/admin/\n');
  console.log('Still to do manually:');
  console.log('  • Fonts → src/fonts/ + uncomment @font-face in base.css');
  console.log('  • Brand colors → src/css/tokens/colors.css');
  console.log('  • Favicon → src/static/');
  console.log('  • OG image → src/static/images/og-default.jpg');
  console.log('  • Nav items → src/_data/nav.json');
  console.log('\nSee NEW-PROJECT.md for the full checklist.\n');
}

main();
