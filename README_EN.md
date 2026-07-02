# PhoneticMaster

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/vite-6-646CFF.svg)](https://vite.dev)

[中文](README.md)

PhoneticMaster is a lightweight, browser-based phonetic perception trainer. It is driven by language profiles, currently supports English IPA and Mandarin Pinyin, and can optionally show L1-aware practice recommendations.

The app has no required backend and no external API dependency. Word banks are bundled locally, speech playback uses the browser Web Speech API, and recent session history is stored locally when available.

## Live Demo

[https://ichthyoplanktonzyh.github.io/PhoneticMaster/](https://ichthyoplanktonzyh.github.io/PhoneticMaster/)

## Current Capabilities

- **Multiple target languages**: English / IPA and Mandarin / Pinyin.
- **Optional L1**: choosing a native language enables smart recommendations; choosing only an L2 is enough to train.
- **Two core modes**:
  - Spelling: listen, type IPA or Pinyin, then get phoneme-level feedback.
  - Listen: view the word and notation while replaying the audio.
- **Minimal-pair listening**: choose what you heard from A/B candidates, then review accuracy and missed pairs.
- **Structured Mandarin input hint**: Mandarin spelling mode keeps the initial/final/tone keypad and hints the initial -> final -> tone order in the input box.
- **Session results**: exact score, near matches, mistakes, review, and recent local history.
- **Topic filtering**: focus a session on a specific English phoneme or Pinyin unit.
- **Adjustable round size**: 1 to 50 items per session.
- **Profile-driven keypad**: IPA vowels/consonants/stress marks for English, initials/finals/tones for Mandarin.
- **Local-first**: no account, no API key, no database.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |
| Local preview | Express |
| Speech | Web Speech API |

## Requirements

- Node.js 18 or newer
- npm
- A modern browser with Web Speech API support, such as Chrome, Edge, Safari, or Firefox

## Quick Start

```bash
git clone https://github.com/ichthyoplanktonzyh/PhoneticMaster.git
cd PhoneticMaster
npm install
npm run dev
```

The local dev server runs at:

```text
http://localhost:3000
```

## Commands

```bash
npm run dev            # start the Vite/Express dev server
npm run lint           # TypeScript check
npm run validate:data  # validate profiles, word banks, and L1/L2 maps
npm run build          # production build
npm run start          # serve dist/server.cjs after build
npm run clean          # remove build artifacts
```

## Word Banks

| Target language | Notation | Training units | Basic | Intermediate | Advanced | Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| English | IPA | 44 | 881 | 1,527 | 1,680 | 4,088 |
| Mandarin | Pinyin | 61 | 131 | 99 | 20 | 250 |

English items use American IPA as the canonical training notation and keep British IPA as an alternate display field. Mandarin items use tone-number Pinyin as canonical notation and diacritic Pinyin for display.

The app also includes 15 structured minimal-pair sets: 8 for English and 7 for Mandarin. They currently use Web Speech API playback and reserve `audioUrl` for future standard recordings.

## Architecture

The central abstraction is `LanguageProfile`. Each target language declares its own phoneme inventory, keypad layout, parser, judge, TTS language, sound features, and word bank. UI and training flow use the profile instead of hardcoded language branches.

Adding a new target language should mainly require:

- `src/profiles/{code}.ts`
- `src/data/{code}WordBank.ts`
- one registration import in `src/profiles/index.ts`
- optional parser and L1 difficulty data

## Deployment

The MVP is intended for static hosting.

For GitHub Pages:

```bash
GITHUB_PAGES=true npm run build
```

The output in `dist/` should reference assets under `/PhoneticMaster/assets/`. The repository includes a GitHub Actions workflow that validates data, type-checks, builds with the Pages base path, uploads `dist/`, and deploys Pages.

For Vercel, Netlify, or Cloudflare Pages:

```bash
npm run build
```

Publish the `dist/` directory. No environment variables are required.

`server.ts` is useful for local preview or self-hosting, but it is not a required backend for the public MVP.

## FAQ

**No sound?**

Make sure the browser supports Web Speech API, system audio is enabled, and try another voice in the Voice menu.

**Why do some L1/L2 pairs have no recommendation?**

Recommendations depend on mappings in `src/l1/`. The current focused pairs are Mandarin speakers learning English and English speakers learning Mandarin.

**Why does Mandarin use `v`?**

The Mandarin profile uses `v` as the keyboard-friendly form of `ü`, as in `nv3` or `lv4`.

## License

[Apache License 2.0](LICENSE)
