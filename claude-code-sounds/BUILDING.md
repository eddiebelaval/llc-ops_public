# BUILDING.md — Claude Code Sounds

> From a single `afplay` call to a 7-theme sound system with an interactive npm installer.

Last updated: 2026-03-18

---

## Origin (Feb 2026)

Started as a one-liner experiment: what if Claude Code played a sound when it finished responding? The first version was a shell script that called `afplay` on a single WAV file, wired into a Claude Code `Stop` hook. The immediate reaction: this changes the entire workflow. No more tab-switching to check if Claude is done.

## The Theme System

Once the single sound worked, the obvious question was: why not themed sound packs? The WC3 Orc Peon theme came first -- "Something need doing?" on session start, grunt acknowledgments on prompt submit, "Work complete!" on response finish. The nostalgia factor was immediate and motivating.

Six more themes followed: Zelda OOT (Navi's "Hey! Listen!"), Super Mario Bros (coins and power-ups), Star Wars (lightsabers and R2-D2), Metal Gear Solid (codec calls and alert sounds), Pokemon Gen 1 (battle cries and menu sounds), and Portal (turret voices and portal guns).

Each theme required mapping dozens of sound clips to 11 lifecycle events in a way that felt natural -- the right emotional tone for each event type.

## The Interactive Installer

The first installer was a bash script requiring `jq`. It worked but was fragile and hard to customize. The Node.js CLI (`bin/cli.js`, ~940 lines) replaced it with a full terminal TUI: raw-mode ANSI menus with vim key support, theme preview, per-category sound customization, sound borrowing across categories, and automated hook configuration.

The `--yes` flag was added for scripted and CI usage, and `--uninstall` for clean removal.

## npm Publishing

Published as `claude-code-sounds` on npm. Uses Trusted Publishing (OIDC, no token) triggered by GitHub Releases with `vX.Y.Z` tags. Zero runtime dependencies -- the package only needs Node.js for the installer and macOS `afplay` for playback.

## Version History

- **v1.0.0** -- Initial release with WC3 Peon theme and bash installer
- **v1.1.0** -- Added 6 additional themes
- **v1.2.0** -- Node.js interactive installer replacing bash
- **v1.3.0** -- Per-category sound customization and borrowing
- **v1.4.0** -- Current release. Teammate-idle hook, stability fixes

## Key Decisions

**afplay over web audio.** macOS `afplay` plays audio in the background with zero overhead. No Electron, no browser window, no audio library dependencies. The tradeoff is macOS-only support, which is acceptable for the target audience (Claude Code developers, predominantly on macOS).

**Random selection per category.** Instead of sequential playback, each event picks a random sound from the category directory. This keeps the experience fresh without requiring playlist logic.

**Sounds downloaded at install time.** Audio files are fetched during installation via theme-specific download scripts, not bundled in the npm package. This keeps the package small and avoids distributing copyrighted audio through npm directly.
