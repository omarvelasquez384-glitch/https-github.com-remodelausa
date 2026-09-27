import { useState, useCallback, useEffect } from 'react';
import { Navigation } from '../sections/Navigation';
import { Hero } from '../sections/Hero';
import { HowItWorks } from '../sections/HowItWorks';
import { WineShowcase } from '../sections/WineShowcase';
import { BudgetCalculator } from '../sections/BudgetCalculator';
import { PopularProjects } from '../sections/PopularProjects';
import { WineryCarousel } from '../sections/WineryCarousel';
import { Museum } from '../sections/Museum';
import { News } from '../sections/News';
import { DualCta } from '../sections/DualCta';
import { ContactForm } from '../sections/ContactForm';
import { Footer } from '../sections/Footer';
import { Preloader } from '../components/Preloader';
import { ScrollToTop } from '../components/ScrollToTop';
import { ChatWidget } from '../components/ChatWidget';
import { getLanguage } from '../i18n';
import { consumePendingScroll } from '../lib/utils';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<string>(getLanguage());

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    // Si venimos de otra página con un destino pendiente (p. ej. "Cotización
    // gratis" desde /track o una landing SEO), aplicamos el scroll AHORA que el
    // preloader terminó y la página ya se puede desplazar.
    const pending = consumePendingScroll();
    if (pending) {
      setTimeout(() => {
        document.querySelector(pending)?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }, []);

  // Re-renderiza todo el sitio cuando cambia el idioma
  useEffect(() => {
    const onLanguageChange = (e: Event) => {
      setLang((e as CustomEvent<string>).detail);
    };
    window.addEventListener('app-languagechange', onLanguageChange);
    return () => window.removeEventListener('app-languagechange', onLanguageChange);
  }, []);

  // Analítica propia: registro de visitas (visible en /admin)
  useEffect(() => {
    import('../lib/api').then(({ api }) => {
      api.track('page_view', { path: window.location.pathname, lang: getLanguage() });
    });
  }, [lang]);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-[#141414] ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
        <div key={lang}>
          <Navigation />

          <main>
            <Hero isReady={!isLoading} />
            <HowItWorks />
            <WineShowcase />
            <BudgetCalculator />
            <PopularProjects />
            <WineryCarousel />
            <Museum />
            <News />
            <DualCta />
            <ContactForm />
          </main>

          <Footer />
          <ChatWidget />
        </div>
        <ScrollToTop />
      </div>
    </>
  );
}
