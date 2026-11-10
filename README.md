# LegionIO Landing Page

Marketing and landing page for [LegionIO](https://github.com/LegionIO) — an open source cognitive architecture for AI agents.

Built with [Astro](https://astro.build/) + [Tailwind CSS 4](https://tailwindcss.com/), deployed to [Cloudflare Pages](https://pages.cloudflare.com/).

## Development

```bash
npm install
npm run dev          # start dev server at localhost:4321
```

## Build

```bash
npm run build        # static output to ./dist/
npm run preview      # preview production build locally
```

## Deploy (Cloudflare Pages)

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION=22` |

## AI assistant discovery

`public/llms.txt` is the technical context and source-reference index for AI assistants.
The homepage advertises its canonical URL, `https://legionio.dev/llms.txt`, through:

- A visible, keyboard-accessible link immediately below the hero introduction, before
  the install commands and capability catalog. It does not depend on JavaScript.
- A `rel="describedby"` link in `src/layouts/BaseLayout.astro`.
- An HTTP `Link` header configured in `public/_headers` for Cloudflare Pages.

Keep these discovery paths intact when updating the page. The relation follows the
[llms.txt proposal](https://llmstxt.org/#proposal); discovery does not guarantee an
assistant will fetch the index or follow its references.

To check production headers locally, build and run
`npx --no-install wrangler pages dev dist --port 8788`; Astro preview does not apply
Cloudflare's `_headers` rules. Verify the homepage notice survives text extraction
and `/llms.txt` returns `200` with a `text/plain` content type.

## Project Structure

```
src/
├── layouts/BaseLayout.astro        # HTML shell, meta, fonts, scroll-reveal script
├── pages/index.astro               # Single page composing all sections
├── styles/global.css               # Tailwind theme, colors, animations, utilities
├── components/
│   ├── Nav.astro                   # Sticky glass nav + mobile menu
│   ├── Hero.astro                  # Headline, install command, CTAs, stats
│   ├── Comparison.astro            # "Not a Prompt Wrapper" table
│   ├── Architecture.astro          # GAIA / Synapse / Apollo + tick & dream cycles
│   ├── FeatureGrid.astro           # 8 feature cards
│   ├── Extensions.astro            # Cognitive domains + service integrations
│   ├── GettingStarted.astro        # 3-step terminal install guide
│   ├── Audience.astro              # Who it's for
│   ├── OpenSourceCTA.astro         # Final call to action
│   └── Footer.astro                # Links + copyright
└── components/ui/
    ├── Badge.astro                 # Pill badge with optional pulse dot
    ├── Button.astro                # Primary/secondary link buttons
    ├── CodeBlock.astro             # Terminal-style block with copy button
    ├── SectionHeading.astro        # Label + title + subtitle
    └── GlowCard.astro             # Glass card with glow border
```

## Theme

Color palette derived from [legion-interlink](https://github.com/LegionIO/legion-interlink)'s design system:

- **Violet Primary** `#7F77DD` — accent, links, glows
- **Lavender** `#C5C2F5` — highlighted text, gradients
- **Deep Purple** `#584E9C` — shadows, dark accents
- **Background** `#0e0c1a` — deep purple-black

## License

MIT
