import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rubyMethods, metricBuckets, cliCommands, validateCatalog, rubyList } from './source-parsers.mjs';
const sources = JSON.parse(readFileSync(new URL('../src/data/generated/sources.json', import.meta.url)));

test('extracts default expressions and exact source line anchors without evaluating Ruby', () => {
  const input = 'module A\n  def self.enabled\n    false\n  end\n\n  def self.defaults\n    { enabled: enabled }\n  end\nend\n';
  assert.deepEqual(rubyMethods(input), [{ name: 'enabled', expression: 'false', line: 2 }]);
  assert.equal(rubyMethods(sources['router-defaults'].content).length, 12);
});
test('keeps negative reductions and aligns token averages with their conversation bucket', () => {
  const buckets = metricBuckets(sources.metrics.content);
  assert.equal(buckets.length, 7);
  assert.deepEqual(buckets[0], { label: '1', reduction: -0.1, requests: 126202, conversations: 126202, naive: 1295, actual: 1296 });
  assert.equal(buckets.at(-1).conversations, 37);
  assert.equal(buckets.at(-1).reduction, 97.7);
});
test('fails closed when metrics change shape', () => {
  assert.throws(() => metricBuckets(sources.metrics.content.replace('Avg actual per turn', 'Renamed metric')), /Missing metric row/);
  assert.throws(() => metricBuckets(sources.metrics.content.replace('**97.7%**', '**unknown**')), /Invalid metric/);
});
test('generates CLI commands only from desc declarations and preserves argument placeholders', () => {
  assert.deepEqual(cliCommands("  desc 'import SOURCE', 'Import config'\n  # desc 'no', 'ignore'", 'legion config'), [{ command: 'legion config import SOURCE', description: 'Import config', line: 1 }]);
});
test('extracts multiline Ruby constants and rejects missing declarations', () => {
  assert.deepEqual(rubyList('STEPS = %i[one\n two].freeze', 'STEPS'), ['one', 'two']);
  assert.throws(() => rubyList('STEPS = []', 'STEPS'), /Missing Ruby list/);
});
test('catalog validation supports repeated runner names and rejects missing functions', () => {
  const catalog = { gem_count: 1, runner_count: 2, function_count: 2, gems: [{ gem: 'lex-test', runners: [{ runner: 'token', functions: [{ name: 'one' }] }, { runner: 'token', functions: [{ name: 'two' }] }] }] };
  const text = '**1 gems · 2 runners · 2 functions**\n### lex-test\n- **token**\n  - `one`\n- **token**\n  - `two`\n';
  assert.doesNotThrow(() => validateCatalog(catalog, text));
  assert.throws(() => validateCatalog(catalog, text.replace('`two`', '`missing`')), /Missing upstream function/);
  assert.throws(() => validateCatalog({ ...catalog, gem_count: 2 }, text), /Catalog totals/);
});
