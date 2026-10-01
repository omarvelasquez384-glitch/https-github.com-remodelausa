import { Globe } from 'lucide-react';
import { LANGUAGES, getLanguage, setLanguage, type Lang } from '../i18n';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
}

export function LanguageSwitcher({ variant = 'desktop' }: LanguageSwitcherProps) {
  const current = getLanguage();

  const handleSelect = (lang: Lang) => {
    if (lang !== current) setLanguage(lang);
  };

  // La etiqueta se muestra SOLO en el idioma activo (antes salían las tres
  // palabras apiladas: "Idioma / Language / Idioma" en cualquier idioma).
  const langWord: Record<Lang, string> = { en: 'Language', es: 'Idioma', pt: 'Idioma' };

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-3 py-4 border-b border-white/10">
        <Globe className="w-5 h-5 text-gold-500" aria-hidden="true" />
        <span className="text-lg text-white/70 mr-auto">{langWord[current]}</span>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              aria-label={lang.name}
              className={`px-3 py-1.5 rounded-sm text-sm transition-all duration-300 ${
                current === lang.id
                  ? 'bg-gold-500 text-white'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-1 mr-6" role="group" aria-label="Language / Idioma / Idioma">
      <Globe className="w-4 h-4 text-gold-500 mr-2" aria-hidden="true" />
      {LANGUAGES.map((lang) => (
        <button
          key={lang.id}
          onClick={() => handleSelect(lang.id)}
          aria-label={lang.name}
          className={`px-2.5 py-1 rounded-sm text-xs tracking-wider transition-all duration-300 ${
            current === lang.id
              ? 'bg-gold-500 text-white'
              : 'text-white/60 hover:text-gold-400'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
