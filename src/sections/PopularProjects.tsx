import { ArrowRight, Clock } from 'lucide-react';
import { useLang } from '../lib/use-lang';
import { SEO_SERVICES } from '../lib/seo-data';

// Bloque «Proyectos populares» con precio inicial ancla (patrón Angi):
// cada tarjeta muestra el servicio, foto, precio «desde $X» y duración.
// Sin calificaciones inventadas: solo datos reales que ya tenemos.

const T = {
  en: {
    scriptText: 'Plan your budget',
    subtitle: 'POPULAR PROJECTS',
    mainTitle: 'Remodeling projects and starting prices',
    intro: 'National price ranges to plan your budget. Every project is different — get free local quotes to know your exact price.',
    from: 'From', quotesCta: 'Get free quotes', prosCta: 'See contractors',
  },
  es: {
    scriptText: 'Planifica tu presupuesto',
    subtitle: 'PROYECTOS POPULARES',
    mainTitle: 'Proyectos de remodelación y precios de inicio',
    intro: 'Rangos de precios nacionales para planear tu presupuesto. Cada proyecto es distinto — pide cotizaciones locales gratis para saber tu precio exacto.',
    from: 'Desde', quotesCta: 'Cotizar gratis', prosCta: 'Ver contratistas',
  },
  pt: {
    scriptText: 'Planeje seu orçamento',
    subtitle: 'PROJETOS POPULARES',
    mainTitle: 'Projetos de reforma e preços iniciais',
    intro: 'Faixas de preços nacionais para planejar seu orçamento. Cada projeto é diferente — peça orçamentos locais grátis para saber seu preço exato.',
    from: 'A partir de', quotesCta: 'Orçamento grátis', prosCta: 'Ver construtoras',
  },
} as const;

const SERVICE_IMAGES: Record<string, string> = {
  bathroom: '/images/servicio-banos.png',
  kitchen: '/images/servicio-cocina.png',
  painting: '/images/servicio-pintura.png',
  concrete: '/images/servicio-concreto.png',
  remodel: '/images/servicio-remodelacion.png',
};

const fmt = (n: number) => '$' + n.toLocaleString('en-US');

export function PopularProjects() {
  const lang = useLang();
  const t = T[lang];

  const goToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="popular-projects" className="section-padding relative bg-wine-900/40">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="font-script text-3xl text-gold-400 block mb-2">{t.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">{t.subtitle}</span>
          <h2 className="font-serif text-h1 text-white mb-4">{t.mainTitle}</h2>
          <p className="text-white/70 max-w-2xl mx-auto">{t.intro}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {SEO_SERVICES.map((service) => (
            <article
              key={service.id}
              className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={SERVICE_IMAGES[service.id]}
                  alt={service.name[lang]}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3">
                  <span className="block text-xs text-white/60">{t.from}</span>
                  <span className="block font-serif text-2xl text-gold-400">{fmt(service.priceFrom)}</span>
                </p>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-serif text-lg text-white mb-2">{service.name[lang]}</h3>
                <p className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
                  <Clock className="w-3.5 h-3.5" /> {service.duration[lang]}
                </p>
                <div className="mt-auto space-y-2">
                  <button
                    onClick={goToContact}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gold-500 text-white rounded-sm text-xs hover:bg-gold-600 transition-colors"
                  >
                    {t.quotesCta} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`/contractors?trade=${service.id}`}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-white/20 text-white/70 rounded-sm text-xs hover:border-gold-500/50 hover:text-gold-400 transition-colors"
                  >
                    {t.prosCta}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
