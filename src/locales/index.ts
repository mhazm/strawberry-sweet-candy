import { LanguageCode, LanguageOption, TranslationSchema } from './types';
import { en } from './en';
import { id } from './id';
import { zh } from './zh';
import { de } from './de';
import { ja } from './ja';
import { es } from './es';
import { ru } from './ru';
import { fr } from './fr';
import { getTraitDictionary } from './traits';

export * from './types';
export * from './traits';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'zh', label: '简体中文', flag: '🇨🇳' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const dictionaries: Record<LanguageCode, TranslationSchema> = {
  en,
  id,
  zh,
  de,
  ja,
  es,
  ru,
  fr,
};

/**
 * Returns the dictionary for the requested language.
 * Automatically falls back to English for any missing keys, preventing runtime errors.
 */
export function getDictionary(lang: LanguageCode): TranslationSchema {
  const selected = dictionaries[lang] || dictionaries.en;
  const langTraits = getTraitDictionary(lang);

  // Deep fallback for attrs, hiddenAttrs, and traits if missing
  return {
    ...en,
    ...selected,
    attrs: {
      ...en.attrs,
      ...(selected.attrs || {}),
    },
    hiddenAttrs: {
      ...en.hiddenAttrs,
      ...(selected.hiddenAttrs || {}),
    },
    traits: langTraits,
  };
}

