import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { metricBuckets, rubyMethods, validateCatalog } from './source-parsers.mjs';

const root = new URL('../', import.meta.url);
const lock = JSON.parse(await readFile(new URL('scripts/sources.lock.json', root), 'utf8'));
const target = new URL('src/data/generated/sources.json', root);
const checking = process.argv.includes('--check');
const sources = checking ? JSON.parse(await readFile(target, 'utf8')) : {};
for (const entry of lock) {
  if (!/^[0-9a-f]{40}$/.test(entry.commit)) throw new Error(`Unpinned source: ${entry.id}`);
  const url = `https://github.com/LegionIO/${entry.repo}/blob/${entry.commit}/${entry.path}`;
  if (!checking) {
    const response = await fetch(`https://raw.githubusercontent.com/LegionIO/${entry.repo}/${entry.commit}/${entry.path}`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`${entry.id}: HTTP ${response.status}`);
    const content = await response.text();
    sources[entry.id] = { ...entry, url, sha256: createHash('sha256').update(content).digest('hex'), content };
  }
  const source = sources[entry.id];
  if (!source || source.url !== url || source.commit !== entry.commit || source.repo !== entry.repo || source.path !== entry.path || source.sha256 !== createHash('sha256').update(source.content).digest('hex')) throw new Error(`Source integrity check failed: ${entry.id}`);
}
if (Object.keys(sources).length !== lock.length) throw new Error('Unexpected source snapshots');
metricBuckets(sources.metrics.content);
if (!rubyMethods(sources['router-defaults'].content).some((s) => s.name === 'tier_priority')) throw new Error('Router settings format changed');
validateCatalog(JSON.parse(await readFile(new URL('src/data/extensions.json', root), 'utf8')), sources.capabilities.content);
// Write only after every fetch and extraction succeeds; a failed refresh preserves the snapshot.
if (!checking) await writeFile(target, `${JSON.stringify(sources, null, 2)}\n`);
console.log(`${checking ? 'Verified' : 'Synchronized'} ${lock.length} pinned sources and the extension catalog (${fileURLToPath(target)}).`);
