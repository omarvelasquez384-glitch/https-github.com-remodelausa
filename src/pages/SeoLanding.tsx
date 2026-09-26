import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowRight, ShieldCheck, Clock, DollarSign, ChevronRight, CheckCircle } from 'lucide-react';
import { SEO_SERVICES, SEO_STRINGS } from '../lib/seo-data';
import { US_STATES } from '../lib/us-states';
import { getLanguage, type Lang } from '../i18n';
import { api } from '../lib/api';

const fmtUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// Landing programática de SEO: /s/:stateSlug/:serviceId
// Ejemplo: /s/texas/bathroom → "Bathroom Remodeling in Texas"
export default function SeoLanding() {
  const { stateSlug, serviceId } = useParams<{ stateSlug: string; serviceId: string }>();

  const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
  const state = US_STATES.find((s) => slugify(s.name) === stateSlug?.toLowerCase());
  const service = SEO_SERVICES.find((s) => s.id === serviceId);

  if (!state || !service) return <NotFound />;
  return <SeoContent state={state} service={service} />;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-serif text-4xl text-gold-500 mb-4">404</p>
        <Link to="/" className="text-white/70 hover:text-gold-400 underline underline-offset-4">
          ← RemodelaUSA
        </Link>
      </div>
    </div>
  );
}

function SeoContent({ state, service }: { state: { abbr: string; name: string }; service: (typeof SEO_SERVICES)[number] }) {
  const lang = getLanguage() as Lang;
  const t = SEO_STRINGS[lang] ?? SEO_STRINGS.en;

  useEffect(() => {
    api.track('seo_landing_view', { state: state.name, service: service.id, lang });
  }, [state.name, service.id, lang]);

  const title = `${service.name[lang]} — ${state.name}`;
  useDocumentTitle(`${title} | RemodelaUSA`);
  useMetaDescription(service.intro[lang](state.name));

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Navegación mínima */}
      <nav className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-gold-400 hover:text-gold-300 font-serif text-lg mr-4">RemodelaUSA</Link>
          <span className="text-white/30">/</span>
          <Link to="/" className="text-white/60 hover:text-white">{t.breadcrumb}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/60">{state.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/90">{service.name[lang]}</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Encabezado */}
        <header className="mb-12">
          <p className="font-script text-3xl text-gold-400 mb-2">{state.name}</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-white leading-tight mb-4">
            {service.name[lang]}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl">{service.intro[lang](state.name)}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            <span className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-sm text-sm text-gold-400">
              <ShieldCheck className="w-4 h-4" /> {t.verified}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-sm text-white/70">
              <Clock className="w-4 h-4 text-gold-500" /> {t.freeQuotes}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-sm text-white/70">
              <DollarSign className="w-4 h-4 text-gold-500" />
              {t.priceRange}: <strong className="text-white">{fmtUSD.format(service.priceFrom)} – {fmtUSD.format(service.priceTo)}+</strong>
            </span>
          </div>
        </header>

        {/* CTA principal */}
        <div className="bg-gradient-to-r from-gold-500/15 to-transparent border border-gold-500/25 rounded-lg p-8 mb-12 flex flex-wrap items-center gap-6">
          <div className="mr-auto">
            <p className="font-serif text-2xl text-white mb-1">{t.ctaTitle} {state.name}</p>
            <p className="text-white/60 text-sm">{t.duration}: {service.duration[lang]}</p>
          </div>
          <a href="/#contact" className="btn-primary rounded-sm flex items-center gap-2">
            {t.ctaButton} <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/#calculadora" className="px-6 py-3 border border-white/20 rounded-sm text-white/80 hover:border-gold-500/50 hover:text-gold-400 transition-colors text-sm">
            {t.calcButton}
          </a>
        </div>

        {/* Qué incluye */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-white mb-6">{t.includesTitle}</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {service.includes[lang].map((item) => (
              <li key={item} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-sm px-4 py-3">
                <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-white/85">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-white mb-6">{t.faqTitle}</h2>
          <div className="space-y-3">
            {service.faq[lang].map((item) => (
              <details key={item.q} className="bg-white/5 border border-white/10 rounded-lg px-5 py-4 group">
                <summary className="cursor-pointer font-medium text-white list-none flex items-center justify-between">
                  {item.q}
                  <ChevronRight className="w-4 h-4 text-gold-500 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-white/65 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Enlaces relacionados: entramado interno (patrón Angi/Thumbtack) */}
        <section className="mb-12">
          {/* Selección determinista: 5 estados distintos que rotan según el índice */}
          {(() => {
            const stateIdx = US_STATES.findIndex((s) => s.name === state.name);
            const relatedStates = Array.from({ length: 5 }, (_, i) =>
              US_STATES[(stateIdx + 7 + i * 11) % US_STATES.length]
            ).filter((s, i, arr) => s.name !== state.name && arr.findIndex((x) => x.name === s.name) === i);
            const relatedServices = SEO_SERVICES.filter((s) => s.id !== service.id);
            return (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="font-serif text-xl text-white mb-4">
                    {t.relatedStates(service.name[lang])}
                  </h2>
                  <ul className="space-y-2">
                    {relatedStates.map((s) => (
                      <li key={s.abbr}>
                        <Link
                          to={`/s/${s.name.toLowerCase().replace(/\s/g, '-')}/${service.id}`}
                          className="text-sm text-gold-400/90 hover:text-gold-300 transition-colors"
                        >
                          {service.name[lang]} — {s.name} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-serif text-xl text-white mb-4">
                    {t.relatedServices(state.name)}
                  </h2>
                  <ul className="space-y-2">
                    {relatedServices.map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/s/${state.name.toLowerCase().replace(/\s/g, '-')}/${s.id}`}
                          className="text-sm text-gold-400/90 hover:text-gold-300 transition-colors"
                        >
                          {s.name[lang]} →
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to={`/contractors?state=${encodeURIComponent(state.name)}&trade=${service.id}`}
                        className="text-sm text-white/70 hover:text-gold-400 transition-colors"
                      >
                        {t.directoryCta} →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })()}
        </section>

        {/* CTA final */}
        <div className="text-center border-t border-white/10 pt-10">
          <p className="font-serif text-2xl text-white mb-4">{service.name[lang]} — {state.name}</p>
          <a href="/#contact" className="btn-primary rounded-sm inline-flex items-center gap-2">
            {t.ctaButton} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
}

// Helpers de metadata por ruta
function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };
  }, [title]);
}

function useMetaDescription(description: string) {
  useEffect(() => {
    let el = document.querySelector('meta[name="description"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'description');
      document.head.appendChild(el);
    }
    const prev = el.getAttribute('content') ?? '';
    el.setAttribute('content', description);
    return () => { el?.setAttribute('content', prev); };
  }, [description]);
}
