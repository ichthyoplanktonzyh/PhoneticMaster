# COCA Raw Data & Parser

This directory contains the Python script used to generate `src/data/wordBank.ts`.

## Source

The vocabulary files were downloaded from [coca-vocabulary-20000](https://github.com/llt22/coca-vocabulary-20000), which provides COCA (Corpus of Contemporary American English) frequency-ranked words with IPA transcriptions.

## Regenerating the word bank

```bash
cd .coca_raw
python3 parse.py
```

This will re-parse all `part*.md` files and overwrite `src/data/wordBank.ts`.

## File format

Each COCA markdown file contains entries like:

```
1 say
- [seɪ]  [se]
- ...
```

The IPA line format is `- [British_IPA]  [American_IPA]`, separated by two spaces.
The parser extracts both and generates TypeScript with `ipa_uk` and `ipa_us` fields.
