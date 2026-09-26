import { useEffect, useState } from 'react';
import { getLanguage, type Lang } from '../i18n';

// Hook reactivo al idioma del sitio (las páginas se re-renderizan al cambiarlo)
export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>(getLanguage());
  useEffect(() => {
    const onChange = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener('app-languagechange', onChange);
    return () => window.removeEventListener('app-languagechange', onChange);
  }, []);
  return lang;
}
