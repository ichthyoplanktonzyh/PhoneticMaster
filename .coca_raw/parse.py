"""Parse COCA markdown files and extract word + IPA pairs for the spelling app."""

import re
import os

# Function words to exclude from the word bank
EXCLUDE_WORDS = {
    # Articles
    'the', 'a', 'an',
    # Prepositions
    'of', 'in', 'to', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
    'about', 'after', 'between', 'under', 'over', 'without', 'within',
    'upon', 'during', 'before', 'through', 'along', 'among', 'against',
    'around', 'toward', 'towards', 'behind', 'beyond', 'below', 'above',
    'across', 'onto', 'beside', 'besides', 'despite', 'except', 'inside',
    'outside', 'per', 'since', 'until', 'throughout',
    # Conjunctions
    'and', 'but', 'or', 'nor', 'yet', 'so', 'if', 'than', 'then', 'that',
    'because', 'although', 'though', 'while', 'whether', 'unless', 'once',
    # Auxiliary/Modal verbs
    'be', 'have', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must', 'am', 'are', 'is', 'was', 'were',
    'been', 'being', 'had', 'has', 'having', 'done', 'doing',
    # Pronouns
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
    'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours',
    'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself',
    'itself', 'ourselves', 'yourselves', 'themselves',
    'this', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose',
    'anyone', 'someone', 'everyone', 'something', 'anything', 'everything',
    'nothing', 'nobody', 'anybody', 'somebody', 'everybody',
    # Function adverbs / quantifiers
    'not', 'no', 'very', 'here', 'there', 'where', 'when', 'how', 'why',
    'also', 'just', 'only', 'now', 'then', 'even', 'still', 'too', 'all',
    'both', 'each', 'every', 'some', 'any', 'such', 'more', 'most', 'much',
    'many', 'few', 'own', 'same', 'other', 'another',
    'well', 'back', 'out', 'up', 'down', 'off', 'away', 'already', 'quite',
    'really', 'rather', 'always', 'never', 'often', 'sometimes', 'usually',
    'perhaps', 'maybe', 'almost', 'enough', 'however', 'therefore', 'thus',
    'ago', 'yet', 'ever', 'again', 'still', 'else', 'please', 'okay',
    # Numbers
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'hundred', 'thousand', 'million', 'billion',
    # Misc function
    'mr', 'mrs', 'ms', 'dr', 'st', 'pm', 'am',
}

MIN_WORD_LEN = 3

# Target IPA symbols from the keypad
TARGET_VOWELS = {'i', 'ɪ', 'eɪ', 'ɛ', 'æ', 'ɑ', 'ɔ', 'oʊ', 'ʊ', 'u', 'ʌ', 'ɚ', 'ə', 'aɪ', 'aʊ', 'ɔɪ'}
TARGET_CONSONANTS = {'p', 'b', 't', 'd', 'k', 'ɡ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'm', 'n', 'ŋ', 'l', 'r', 'j', 'w', 'tʃ', 'dʒ'}


def extract_ipas_from_line(line):
    """Extract British and American IPA from a line like '- [ðə]  [ðə]' or '- [əˈnʌðə(r)]  [əˈnʌðɚ]'"""
    m = re.match(r'^- \[([^\]]+)\]\s{2}\[([^\]]+)\]', line)
    if not m:
        return None, None
    uk_raw = m.group(1)
    us_raw = m.group(2)
    # Take the first variant if comma-separated
    if ',' in uk_raw:
        uk_raw = uk_raw.split(',')[0].strip()
    if ',' in us_raw:
        us_raw = us_raw.split(',')[0].strip()
    return uk_raw, us_raw


def ts_escape(s):
    """Escape a string for use inside a TypeScript single-quoted string."""
    return s.replace('\\', '\\\\').replace("'", "\\'")


def parse_file(filepath):
    """Parse a single COCA markdown file."""
    results = []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by numbered word entries
    entries = re.split(r'\n(?=\d+ [a-zA-Z])', content)

    for entry in entries:
        lines = entry.strip().split('\n')
        if not lines:
            continue

        # First line: "N wordname"
        first_line = lines[0].strip()
        m = re.match(r'^(\d+)\s+(\S+)', first_line)
        if not m:
            continue
        rank = int(m.group(1))
        word = m.group(2).lower()

        if len(word) < MIN_WORD_LEN:
            continue
        if word in EXCLUDE_WORDS:
            continue
        if not re.match(r'^[a-zA-Z]+$', word):
            continue

        # Find IPA line
        ipa_uk, ipa_us = None, None
        for line in lines[1:]:
            ipa_uk, ipa_us = extract_ipas_from_line(line)
            if ipa_uk and ipa_us:
                break

        if ipa_uk and ipa_us:
            results.append({'word': word, 'ipa_uk': ipa_uk, 'ipa_us': ipa_us, 'rank': rank})

    return results


def classify_difficulty(rank):
    if rank <= 1200:
        return 'basic'
    elif rank <= 3000:
        return 'intermediate'
    else:
        return 'advanced'


WORDS_PER_LEVEL = 80


def main():
    raw_dir = os.path.dirname(os.path.abspath(__file__))
    files = sorted(f for f in os.listdir(raw_dir) if f.startswith('part') and f.endswith('.md'))

    all_words = []
    for fname in files:
        entries = parse_file(os.path.join(raw_dir, fname))
        all_words.extend(entries)
        print(f"{fname}: {len(entries)} words")

    print(f"\nTotal valid words: {len(all_words)}")

    # Group by difficulty
    by_diff = {'basic': [], 'intermediate': [], 'advanced': []}
    for entry in all_words:
        diff = classify_difficulty(entry['rank'])
        by_diff[diff].append(entry)

    # Sort by rank (lower = more common)
    for diff_name in by_diff:
        by_diff[diff_name].sort(key=lambda x: x['rank'])

    # Report coverage per level
    for diff_name, word_list in by_diff.items():
        all_ipa = ' '.join(w['ipa_us'] for w in word_list)
        vowels_found = {s for s in TARGET_VOWELS if s in all_ipa}
        consonants_found = {s for s in TARGET_CONSONANTS if s in all_ipa}
        missing_v = TARGET_VOWELS - vowels_found
        missing_c = TARGET_CONSONANTS - consonants_found
        print(f"\n{diff_name} pool: {len(word_list)} words")
        print(f"  Vowels: {len(vowels_found)}/{len(TARGET_VOWELS)} covered")
        print(f"  Consonants: {len(consonants_found)}/{len(TARGET_CONSONANTS)} covered")
        if missing_v:
            print(f"  Missing vowels: {sorted(missing_v)}")
        if missing_c:
            print(f"  Missing consonants: {sorted(missing_c)}")

    # Include all words per difficulty, sorted by frequency
    selected = {}
    for diff_name in ['basic', 'intermediate', 'advanced']:
        word_list = list(by_diff[diff_name])
        word_list.sort(key=lambda x: x['rank'])
        selected[diff_name] = word_list

        all_ipa = ' '.join(w['ipa_us'] for w in word_list)
        vowels_found = {s for s in TARGET_VOWELS if s in all_ipa}
        consonants_found = {s for s in TARGET_CONSONANTS if s in all_ipa}
        print(f"\n{diff_name} selected: {len(selected[diff_name])} words")
        print(f"  Vowels covered: {len(vowels_found)}/{len(TARGET_VOWELS)}")
        print(f"  Consonants covered: {len(consonants_found)}/{len(TARGET_CONSONANTS)}")

    # Generate TypeScript
    out_path = os.path.join(raw_dir, '..', 'src', 'data', 'wordBank.ts')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("""/**
 * COCA (Corpus of Contemporary American English) 词库
 * 来源: https://github.com/llt22/coca-vocabulary-20000
 * 基于 COCA 前 5000 词频表，经筛选和难度分级
 */
import { WordData, Difficulty } from '../types';

""")
        for diff_name in ['basic', 'intermediate', 'advanced']:
            f.write(f"const {diff_name}: WordData[] = [\n")
            for w in selected[diff_name]:
                word_esc = ts_escape(w['word'])
                uk_esc = ts_escape(w['ipa_uk'])
                us_esc = ts_escape(w['ipa_us'])
                f.write(f"  {{ word: '{word_esc}', ipa_uk: '{uk_esc}', ipa_us: '{us_esc}' }},\n")
            f.write(f"];\n\n")

        f.write("""export const wordBank: Record<Difficulty, WordData[]> = {
  basic,
  intermediate,
  advanced,
};

export function pickWords(difficulty: Difficulty, count: number = 10): WordData[] {
  const pool = wordBank[difficulty];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
""")

    print(f"\nWritten to: {out_path}")
    for diff_name in ['basic', 'intermediate', 'advanced']:
        print(f"  {diff_name}: {len(selected[diff_name])} words")


if __name__ == '__main__':
    main()
