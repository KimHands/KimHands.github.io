import { ui, defaultLang } from './ui';
export type Lang = keyof typeof ui;
export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui['ko']): string {
    return (ui[lang] as Record<string,string>)[key] ?? (ui[defaultLang] as Record<string,string>)[key];
  };
}
