import type { SiteContent } from './config';
import { esContent } from './content/es';
import { enContent } from './content/en';
import { ptContent } from './content/pt';
import { applyContent } from './config';

export type Lang = 'en' | 'es' | 'pt';

export const LANGUAGES: { id: Lang; label: string; name: string }[] = [
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'es', label: 'ES', name: 'Español' },
  { id: 'pt', label: 'PT', name: 'Português' },
];

const STORAGE_KEY = 'remodelausa-lang';

const CONTENT_BY_LANG: Record<Lang, SiteContent> = {
  en: enContent,
  es: esContent,
  pt: ptContent,
};

export function getLanguage(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'es' || stored === 'pt') return stored;
  return 'en';
}

export function setLanguage(lang: Lang): void {
  window.localStorage.setItem(STORAGE_KEY, lang);
  const content = CONTENT_BY_LANG[lang];
  applyContent(content);
  document.documentElement.lang = lang;
  if (content.site.title) document.title = content.site.title;
  window.dispatchEvent(new CustomEvent('app-languagechange', { detail: lang }));
}

export function initLanguage(): void {
  setLanguage(getLanguage());
}
