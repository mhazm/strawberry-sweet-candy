import React, { createContext, useContext, useState } from 'react';
import {
  LanguageCode,
  LanguageOption,
  TranslationSchema,
  SUPPORTED_LANGUAGES,
  getDictionary,
} from '../locales';

export type Language = LanguageCode;
export type Translations = TranslationSchema;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languages: LanguageOption[];
  t: TranslationSchema;
  getAttrName: (key: string, fallback?: string) => string;
  getAttrDesc: (key: string, fallback?: string) => string;
  getHiddenName: (key: string, fallback?: string) => string;
  getHiddenDesc: (key: string, fallback?: string) => string;
  getTraitName: (id: string, fallback?: string) => string;
  getTraitDesc: (id: string, fallback?: string) => string;
}

const defaultDict = getDictionary('en');

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  languages: SUPPORTED_LANGUAGES,
  t: defaultDict,
  getAttrName: (_key, fallback) => fallback || _key,
  getAttrDesc: (_key, fallback) => fallback || '',
  getHiddenName: (_key, fallback) => fallback || _key,
  getHiddenDesc: (_key, fallback) => fallback || '',
  getTraitName: (_id, fallback) => fallback || _id,
  getTraitDesc: (_id, fallback) => fallback || '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('dnd_editor_lang') as LanguageCode;
    const exists = SUPPORTED_LANGUAGES.some((l) => l.code === saved);
    return exists ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('dnd_editor_lang', lang);
  };

  const currentDict = getDictionary(language);

  const getAttrName = (key: string, fallback?: string) => {
    return currentDict.attrs?.[key]?.name || fallback || key;
  };

  const getAttrDesc = (key: string, fallback?: string) => {
    return currentDict.attrs?.[key]?.desc || fallback || '';
  };

  const getHiddenName = (key: string, fallback?: string) => {
    return currentDict.hiddenAttrs?.[key]?.name || fallback || key;
  };

  const getHiddenDesc = (key: string, fallback?: string) => {
    return currentDict.hiddenAttrs?.[key]?.desc || fallback || '';
  };

  const getTraitName = (id: string, fallback?: string) => {
    const normalized = id.toLowerCase().replace(/\s+/g, '-');
    return (
      currentDict.traits?.[normalized]?.name ||
      currentDict.traits?.[id]?.name ||
      fallback ||
      id
    );
  };

  const getTraitDesc = (id: string, fallback?: string) => {
    const normalized = id.toLowerCase().replace(/\s+/g, '-');
    return (
      currentDict.traits?.[normalized]?.desc ||
      currentDict.traits?.[id]?.desc ||
      fallback ||
      ''
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
        t: currentDict,
        getAttrName,
        getAttrDesc,
        getHiddenName,
        getHiddenDesc,
        getTraitName,
        getTraitDesc,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
