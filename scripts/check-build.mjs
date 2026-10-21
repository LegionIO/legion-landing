import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('dist');
const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));
const pages = new Map();
for (const file of files) {
  const html = await readFile(path.join(root, file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${file}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one h1: ${file}`);
  assert.match(html, /<title>[^<]+<\/title>/, `Missing title: ${file}`);
  assert.match(html, /<link rel="canonical" href="https:\/\/legionio\.dev\//, `Missing canonical: ${file}`);
  pages.set(path.join(root, file), { html, ids: new Set(ids) });
}
let checked = 0;
for (const [filename, { html }] of pages) {
  const pageUrl = new URL(path.relative(root, filename).replace(/index\.html$/, ''), 'https://legionio.dev/');
  for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (!value.startsWith('/') && !value.startsWith('#')) continue;
    const url = new URL(value, pageUrl);
    if (url.origin !== pageUrl.origin) continue;
    let local = path.join(root, decodeURIComponent(url.pathname));
    let info;
    try { info = await stat(local); } catch { throw new Error(`${path.relative(root, filename)} links to missing ${value}`); }
    if (info.isDirectory()) local = path.join(local, 'index.html');
    assert.ok(await stat(local), `Missing ${local}`);
    if (url.hash && pages.has(local)) assert.ok(pages.get(local).ids.has(decodeURIComponent(url.hash.slice(1))), `${path.relative(root, filename)} links to missing anchor ${value}`);
    checked++;
  }
}
console.log(`Verified ${files.length} pages: titles, canonical URLs, heading structure, unique IDs, and ${checked} internal links/assets.`);
