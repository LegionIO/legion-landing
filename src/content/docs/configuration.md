---
title: "Settings and ownership"
description: "Configure each layer through its supported settings owner and verify the resolved result."
section: "Configuration"
order: 30
sources: ["settings-loader", "settings-readme", "config-cli", "setup-cli", "router-defaults"]
special: none
---

## Start with the generated files

```bash
legion config scaffold
legion config path
legion config validate
```

The scaffold command generates subsystem configuration. The path command shows where the CLI searches, and validation checks the active configuration. Use these commands before constructing a settings file from an older example.

## Understand loading

`legion-settings` owns loading and merging. Its library API consumes the `config_file`, `config_dir`, or `config_dirs` paths supplied by the caller. A library consumer should not assume that every conventional directory is loaded automatically.

The loader's `default_directories` implementation supports `LEGION_SETTINGS_DIRS` as a platform-path-separated override. Without that override, it starts with `~/.legionio/settings`; Unix-like systems also include `/etc/legionio/settings`, while Windows uses an available `APPDATA` directory. Daemon boot chooses its directories through the framework.

Modules register defaults. The nearest `.legionio.env` can override base settings; request overlays take higher precedence. Inspect the settings README and loader for the full merge behavior.

## Keep configuration with its owner

| Concern | Owner | Where to look |
| --- | --- | --- |
| File loading, environment overlays, secret resolution | `legion-settings` | Loader and settings README |
| Routing policy and attempt budget | `legion-llm` | [Generated router reference](/docs/reference/router/) |
| Provider connection and model inventory | The chosen provider adapter | [Provider gems](/docs/ecosystem/) |
| Client proxy configuration | `legion setup proxy-mode` | [Gateway setup](/docs/getting-started/gateway/) |
| Runner/tool exposure | Extension metadata and MCP settings | [Discovery implementation](/docs/reference/sources/) |

## Secret references

The settings library supports `env://`, `vault://`, and `lease://` references. The first reads an environment variable; the others require the relevant Vault integration. The settings README documents resolution and fallback arrays.

Keep credentials out of checked-in configuration and public diagnostic output. `legion config show` is an inspection command; review its output before sharing it.

## Reloading

`Legion::Settings.reload!` reloads known configuration paths and reports changed keys. The library's `watch!` helper installs a SIGHUP handler on supported platforms. A successful settings reload does not imply that every downstream service has reconnected; verify the behavior of the affected component.

## Defaults versus effective values

The reference pages display defaults extracted from a specific source revision. They are not a readout of your machine. Compare your installed version, its generated files, and any overrides when troubleshooting a difference.
