#!/usr/bin/env node
/**
 * fbeleventy project setup
 * Run once after cloning the template for a new project:
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

async function main() {
  console.log('\n── fbeleventy new project setup ──\n');

  // ── Gather input ───────────────────────────────────────────
  const title       = await ask('Site title');
  const description = await ask('Site description');
  const url         = await ask('Production URL (no trailing slash)', 'https://example.com');
  const authorName  = await ask('Author / studio name', 'Studio Fijnbesnaard');
  const authorEmail = await ask('Author email');
  const authorUrl   = await ask('Author website', url);
  const language    = await ask('Language code', 'nl');
  const locale      = await ask('Locale', 'nl_NL');
  const menuVariant = await choose('Menu variant', ['slide', 'overlay', 'clippath'], 'overlay');

  console.log('\n── GitHub ────────────────────────────────────────────────');
  const githubRepo  = await ask('GitHub repo (owner/repo, e.g. client/sitename)');

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

  // ── Update git remote ──────────────────────────────────────
  try {
    execSync(`git remote set-url origin https://github.com/${githubRepo}.git`, { stdio: 'pipe' });
    console.log(`✓ git remote → https://github.com/${githubRepo}.git`);
  } catch {
    console.log(`  (skipped git remote update — run manually if needed)`);
  }

  // ── Done ───────────────────────────────────────────────────
  console.log('\n── Done ──────────────────────────────────────────────────\n');
  console.log('Next steps:');
  console.log('  npm install');
  console.log('  npm start');
  console.log(`  Site:  http://localhost:8080`);
  console.log(`  CMS:   http://localhost:8080/admin/\n`);
  console.log('Still to do manually:');
  console.log('  • Fonts → src/fonts/ + uncomment @font-face in base.css');
  console.log('  • Brand colors → src/css/tokens/colors.css');
  console.log('  • Favicon → src/static/');
  console.log('  • OG image → src/static/images/og-default.jpg');
  console.log('  • Nav items → src/_data/nav.json');
  console.log('\nSee NEW-PROJECT.md for the full checklist.\n');
}

main();
