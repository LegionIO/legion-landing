---
title: "Source manifest"
description: "Inspect the exact revisions behind this documentation snapshot."
section: "Reference"
order: 73
sources: ["core-readme", "router", "metrics", "capabilities"]
special: sources
---

## Source policy

Implementation source takes precedence over an older README or overview when they disagree. `llms.txt` is a useful entry point for discovery, not a replacement for the referenced implementation. Generated metadata supplies the catalog; editorial pages explain the mechanics and link to their evidence.

## Refreshing the snapshot

The site repository contains a pinned manifest and a synchronization command:

```bash
npm run sources:sync
npm run check
npm run build
```

To update upstream revisions, change the relevant commit pins in `scripts/sources.lock.json`, synchronize, review the content changes, and run validation. The synchronizer never executes upstream Ruby. It verifies the metric structure and catalog counts before writing a new snapshot.

The extension catalog is generated upstream. When its contents change, regenerate its JSON through the upstream catalog workflow and update the corresponding public capability snapshot together. A mismatch fails validation instead of silently publishing conflicting counts.

## Revisions

Commit links below identify the snapshot used by this site. They do not claim to be the latest upstream release. Source files may contain more functionality than the guide covers.
