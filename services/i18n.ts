import { Language } from '@/types';
import en from '@/locales/en.json';
import yo from '@/locales/yo.json';
import ha from '@/locales/ha.json';
import ig from '@/locales/ig.json';
import pcm from '@/locales/pcm.json';

const translations: Record<Language, any> = {
  en,
  yo,
  ha,
  ig,
  pcm,
};

export class I18n {
  private currentLanguage: Language = 'en';

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  }

  getTranslations(section: string): any {
    const keys = section.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return {};
      }
    }

    return value || {};
  }
}

export const i18n = new I18n();
