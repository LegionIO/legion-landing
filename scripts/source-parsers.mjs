// Deliberately parses source text, never executes upstream Ruby.
export function rubyMethods(content) {
  return [...content.matchAll(/^([ \t]*)def self\.(\w+)\s*\n([\s\S]*?)^\1end\s*$/gm)]
    .filter((match) => match[2] !== 'defaults')
    .map((match) => ({ name: match[2], expression: match[3].trim(), line: content.slice(0, match.index).split('\n').length }));
}

export function rubyList(content, name) {
  const match = content.match(new RegExp(`${name}\\s*=\\s*%[iw]\\[([^\\]]+)\\]`));
  if (!match) throw new Error(`Missing Ruby list: ${name}`);
  return match[1].trim().split(/\s+/);
}

export function metricBuckets(content) {
  const rows = content.split('\n').filter((line) => line.startsWith('|')).map((line) => line.split('|').slice(1, -1).map((cell) => cell.replace(/\*\*/g, '').trim()));
  const row = (label) => {
    const found = rows.find((r) => r[0] === label);
    if (!found) throw new Error(`Missing metric row: ${label}`);
    return found.slice(1);
  };
  const labels = row('Turns in conversation');
  const reductions = row('Reduction vs. naive');
  const requests = row('Total requests');
  const conversations = row('Conversations');
  const naive = row('Avg naive per turn');
  const actual = row('Avg actual per turn');
  if ([reductions, requests, conversations, naive, actual].some((r) => r.length !== labels.length)) throw new Error('Metric columns no longer align');
  const number = (value) => {
    const parsed = Number(value.replace(/[,%]/g, ''));
    if (!Number.isFinite(parsed)) throw new Error(`Invalid metric: ${value}`);
    return parsed;
  };
  return labels.map((label, i) => ({ label, reduction: number(reductions[i]), requests: number(requests[i]), conversations: number(conversations[i]), naive: number(naive[i]), actual: number(actual[i]) }));
}

export function cliCommands(content, prefix = 'legion') {
  return [...content.matchAll(/^\s+desc '([^']+)', '([^']+)'/gm)]
    .map((match) => ({ command: `${prefix} ${match[1]}`, description: match[2], line: content.slice(0, match.index).split('\n').length }));
}

export function validateCatalog(catalog, source) {
  const totals = [catalog.gems.length, catalog.gems.reduce((n, g) => n + g.runners.length, 0), catalog.gems.reduce((n, g) => n + g.runners.reduce((sum, r) => sum + r.functions.length, 0), 0)];
  if (JSON.stringify(totals) !== JSON.stringify([catalog.gem_count, catalog.runner_count, catalog.function_count])) throw new Error('Catalog totals differ from runner metadata');
  const upstream = source.match(/\*\*(\d+) gems · (\d+) runners · (\d+) functions\*\*/);
  if (!upstream || JSON.stringify(upstream.slice(1).map(Number)) !== JSON.stringify(totals)) throw new Error('Catalog snapshot differs from pinned upstream counts; regenerate catalog upstream');
  const sections = source.split(/^### /m).slice(1);
  for (const gem of catalog.gems) {
    const section = sections.find((s) => s.split(/\s/)[0] === gem.gem);
    if (!section) throw new Error(`Missing upstream gem ${gem.gem}`);
    for (const runner of gem.runners) {
      const segment = section.split(/^- \*\*/m).slice(1).filter((s) => s.startsWith(`${runner.runner}**`)).join('\n');
      if (!segment) throw new Error(`Missing upstream runner ${gem.gem}/${runner.runner}`);
      for (const fn of runner.functions) if (!segment.includes('`' + fn.name + '`')) throw new Error(`Missing upstream function ${gem.gem}/${runner.runner}/${fn.name}`);
    }
  }
}
