import sources from './generated/sources.json';
import { rubyMethods, metricBuckets, cliCommands, rubyList } from '../../scripts/source-parsers.mjs';

export type SourceId = keyof typeof sources;
export { sources };
export const source = (id: SourceId) => sources[id];
export const sourceLink = (id: SourceId, needle?: string) => {
  const s = source(id);
  const index = needle ? s.content.indexOf(needle) : -1;
  if (needle && index < 0) throw new Error(`Missing source anchor ${id}: ${needle}`);
  return s.url + (index < 0 ? '' : `#L${s.content.slice(0, index).split('\n').length}`);
};
export const defaults = rubyMethods(sources['router-defaults'].content);
export const tierPriority = defaults.find((d) => d.name === 'tier_priority')!.expression.match(/%i\[([^\]]+)\]/)![1].split(/\s+/);
export const buckets = metricBuckets(sources.metrics.content);
export const commands = [
  ...cliCommands(sources.cli.content).map((c) => ({ ...c, source: 'cli' as SourceId })),
  ...cliCommands(sources['config-cli'].content, 'legion config').map((c) => ({ ...c, source: 'config-cli' as SourceId })),
  ...cliCommands(sources['setup-cli'].content, 'legion setup').map((c) => ({ ...c, source: 'setup-cli' as SourceId })),
];
export const retryable = rubyList(sources.outcomes.content, 'RETRYABLE');
export const rubyRequirement = sources['core-gemspec'].content.match(/required_ruby_version = '([^']+)'/)![1];
export const steps = {
  before: rubyList(sources.executor.content, 'PRE_PROVIDER_STEPS'),
  after: rubyList(sources.executor.content, 'POST_PROVIDER_STEPS'),
};
