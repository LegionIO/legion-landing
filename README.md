# LegionIO product and documentation site

The public [LegionIO](https://legionio.dev) homepage and its documentation site. Astro statically renders the landing page, seven documentation sections, and individual extension references. The homepage's violet palette, fonts, and hex-grid identity are shared with the documentation layout.

## Develop and verify

Node.js >= 22.12.0 is required.

```bash
npm ci
npm run dev          # http://localhost:4321
npm run check        # source integrity, catalog consistency, extraction tests
npm run build        # static output in dist/
npm run check:build  # internal links/assets, anchors, IDs, titles, canonical metadata
npm run preview      # preview the production output
```

The GitHub validation workflow runs the same checks. Builds use checked-in data and do not fetch upstream documentation. Runtime diagrams are explanatory walkthroughs; they never execute LegionIO or contact a model provider.

## Content and source ownership

| Location | Purpose |
| --- | --- |
| `src/content/docs/` | Editorial Markdown guides with required source IDs |
| `src/content.config.ts` | Documentation content schema |
| `src/pages/docs/[...slug].astro` | Guide and generated-reference rendering |
| `src/pages/docs/ecosystem/[gem].astro` | Gem pages derived from catalog metadata |
| `src/data/extensions.json` | Existing upstream-generated gem/runner/function catalog |
| `scripts/sources.lock.json` | Exact upstream commit pins and source paths |
| `src/data/generated/sources.json` | Imported text, commit URLs, and SHA-256 checksums |
| `scripts/source-parsers.mjs` | Strict text extraction; never executes upstream Ruby |
| `src/data/reference.ts` | Shared derived defaults, commands, metrics, and pipeline stages |
| `src/data/flows.ts` | Editorial step explanations with validated source anchors |
| `src/layouts/DocsLayout.astro` | Sidebar, page sources, table of contents, adjacent pages |
| `src/components/docs/` | Catalog filters, metric explorer, flow walkthroughs |
| `src/styles/docs.css` | Responsive documentation styles using existing brand tokens |

Implementation source is canonical when an older overview disagrees with it. Defaults, CLI declarations, and measurement values are extracted rather than copied into page markup. Each page identifies its source revision. The evidence chart retains the negative single-turn result, modeled denominator, and single-deployment limitations.

### Refresh upstream source

1. Resolve the upstream commit to document and update the relevant pins in `scripts/sources.lock.json`. Keep files from the same repository on a coherent revision.
2. Run `npm run sources:sync`. This fetches public files at the pinned commits and validates the imports before replacing the snapshot. It does not require credentials.
3. Review upstream changes alongside guide copy and flow explanations. Updating a pin does not automatically update editorial interpretations.
4. Run `npm run check`, `npm run build`, and `npm run check:build`.

The extension JSON remains owned by the upstream `generate_extension_catalog.rb` workflow. Do not hand-edit its facts. Bring in a regenerated catalog and update the pinned public `.github/capabilities.md` source together. Validation checks counts, gems, runners, and functions, including repeated runner names. A mismatch blocks publication.

### Add a guide

Add Markdown under `src/content/docs/` with `title`, `description`, `section`, `order`, and `sources` frontmatter. Use an existing section name from `src/data/navigation.ts`. The content loader adds its route, sidebar entry, and neighboring-page links. Source IDs must exist in the manifest. Use `special` only for one of the existing generated or interactive views.

Keep configuration examples grounded in the implementation. Use source links for provider-specific setup instead of inventing credentials, model names, or options. Label historical measurements and experimental features explicitly.

## Deploy

The existing Cloudflare Pages deployment remains in place:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | `22` (>= 22.12.0) |

`npm run deploy` builds and deploys to the existing `legionio` Pages project. A documentation PR does not require running that command or changing the production domain.

## Theme and licensing

The shared palette uses violet `#7F77DD`, lavender `#C5C2F5`, deep purple `#584E9C`, and background `#0e0c1a`, with Space Grotesk, DM Sans, and JetBrains Mono.

The site is MIT licensed. Imported source snapshots retain their upstream licensing; consult each repository's license (Legion core gems generally Apache-2.0, extensions MIT). They are included for reproducible documentation generation and provenance.
