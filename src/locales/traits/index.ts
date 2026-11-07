import { LanguageCode, TraitLocalization } from '../types';
import { enTraits } from './en';
import { idTraits } from './id';
import { jaTraits } from './ja';
import { zhTraits } from './zh';
import { deTraits } from './de';
import { esTraits } from './es';
import { ruTraits } from './ru';
import { frTraits } from './fr';

export const traitDictionaries: Record<LanguageCode, Record<string, TraitLocalization>> = {
  en: enTraits,
  id: idTraits,
  ja: jaTraits,
  zh: zhTraits,
  de: deTraits,
  es: esTraits,
  ru: ruTraits,
  fr: frTraits,
};

export function getTraitDictionary(lang: LanguageCode): Record<string, TraitLocalization> {
  const selected = traitDictionaries[lang] || enTraits;
  return {
    ...enTraits,
    ...selected,
  };
}
