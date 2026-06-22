# PhoneticMaster — 数据模型

> 最后更新：2026-06-22

## Identity Strategy

| 记录 | 稳定身份 | 说明 |
|------|----------|------|
| TrainingItem | `display` + `pronunciation` | 同一词可能有多音（如 "read" /ri:d/ vs /rɛd/），display+pronunciation 联合唯一 |
| PhonemeDef | `symbol` + `category` | 同一符号可能在不同类别中（如 'i' 在 vowel 和 final 中含义不同） |
| L1L2Difficulty | `l1` + `l2` | 每对 (L1, L2) 至多一条映射 |
| PhonemeDifficulty | `phoneme` | 在 L1L2Difficulty 内唯一 |
| FeatureDifficulty | `feature` | 在 L1L2Difficulty 内唯一 |

## Core Type Relationships

```
LanguageProfile
├── code: string                    ← ISO 639-1
├── displayName: string
├── notationName: string            ← 'IPA' | 'Pinyin' | ...
├── phonemes: PhonemeDef[]
│   ├── symbol: string
│   ├── category: string            ← open: 'vowel'|'consonant'|'initial'|'final'|'tone'|...
│   └── label: string
├── keypadLayout: KeypadSection[]
│   ├── category: string
│   └── phonemes: string[]          ← references PhonemeDef.symbol
├── ttsLang: string                 ← BCP 47
├── parseNotation: (s) => string[]  ← notation → phoneme symbol array
├── judge: (input, target) => JudgeResult
│   ├── correct: boolean
│   ├── nearMatch: boolean
│   └── diffs: PhonemeDiff[]
│       ├── position: number
│       ├── expected: string
│       └── actual: string
├── soundFeatures: string[]
└── wordBank: Record<Difficulty, TrainingItem[]>
    └── TrainingItem
        ├── display: string         ← 汉字 / English word
        ├── pronunciation: string   ← canonical form (tone numbers for Pinyin)
        ├── pronunciationAlt?: string ← display form (diacritics for Pinyin)
        ├── frequencyTier: Difficulty
        └── definition?: string     ← gloss / translation

L1L2Difficulty
├── l1: string                      ← matches SUPPORTED_L1[].code
├── l2: string                      ← matches LanguageProfile.code
├── hardPhonemes: PhonemeDifficulty[]
│   ├── phoneme: string             ← matches LanguageProfile.phonemes[].symbol
│   ├── level: number               ← 1-5
│   ├── reason: string              ← PAM/SLM explanation
│   ├── l1Equivalence?: string      ← closest L1 sound
│   └── minimalPairs?: string[]     ← e.g. ["ship/sheep"]
└── hardFeatures: FeatureDifficulty[]
    ├── feature: string             ← matches LanguageProfile.soundFeatures[]
    ├── level: number               ← 1-5
    └── reason: string
```

## Notation Semantics

### English IPA

- `pronunciation`: US IPA with stress marks, e.g. `ˈæp.əl`
- `pronunciationAlt`: UK IPA (optional), e.g. `ˈæp.əl`
- `parseNotation`: tokenizeIpa — strips stress/syllable markers, normalizes variants

### Chinese Pinyin

- `pronunciation`: tone-number form, e.g. `ni3 hao3` — **canonical**
- `pronunciationAlt`: diacritic form, e.g. `nǐ hǎo` — **display only**
- `parseNotation`: parsePinyin — splits into initial + final + tone components

### Future languages

- Must define which form is canonical (`pronunciation`) vs display-only (`pronunciationAlt`)
- `parseNotation` must return phoneme symbols matching `PhonemeDef.symbol` entries

## Persistence (localStorage)

| Key | 格式 | 用途 |
|-----|------|------|
| `ipa-spelling-l1` | string (ISO 639-1) | 用户母语选择 |
| `ipa-spelling-l2` | string (ISO 639-1) | 用户目标语言选择 |
| `ipa-spelling-voice-{lang}` | string (voiceURI) | TTS 语音偏好（按语言） |

所有 localStorage 操作均有 try/catch 保护，隐私模式下静默失败。

## Backward Compatibility

```
WordData (legacy)          TrainingItem (current)
─────────────────          ─────────────────────
word        ──────────→    display
ipa_us      ──────────→    pronunciation
ipa_uk      ──────────→    pronunciationAlt
(none)      ──────────→    frequencyTier (injected)
(none)      ──────────→    definition (undefined)
```

Conversion functions: `wordDataToTrainingItem()` / `trainingItemToWordData()` in `types.ts`.
WordData is `@deprecated` — new code must use TrainingItem directly.
