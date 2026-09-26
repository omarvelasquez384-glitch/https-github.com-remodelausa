import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { HardHat, BadgeCheck, MapPin, Star, ArrowRight, Loader } from 'lucide-react';
import { Navigation } from '../sections/Navigation';
import { Footer } from '../sections/Footer';
import { publicApi, type PublicContractor } from '../lib/api';
import { US_STATES } from '../lib/us-states';
import { useLang } from '../lib/use-lang';
import { TRADE_LABELS, UI_LABELS } from '../lib/labels';

const T = {
  en: {
    title: 'Find a verified contractor', subtitle: 'DIRECTORY',
    intro: 'Browse licensed contractors across the U.S. Compare experience, reviews and photos, and contact them directly — free for homeowners.',
    filterState: 'State', filterTrade: 'Specialty', allStates: 'All states', allTrades: 'All specialties',
    contractorsFound: (n: number) => `${n} contractor${n === 1 ? '' : 's'} available`,
  },
  es: {
    title: 'Encuentra un contratista verificado', subtitle: 'DIRECTORIO',
    intro: 'Explora contratistas con licencia en todo EE. UU. Compara experiencia, reseñas y fotos, y contáctalos directo — gratis para dueños de casa.',
    filterState: 'Estado', filterTrade: 'Especialidad', allStates: 'Todos los estados', allTrades: 'Todas las especialidades',
    contractorsFound: (n: number) => `${n} contratista${n === 1 ? '' : 's'} disponible${n === 1 ? '' : 's'}`,
  },
  pt: {
    title: 'Encontre uma construtora verificada', subtitle: 'DIRETÓRIO',
    intro: 'Navegue por construtoras licenciadas em todo os EUA. Compare experiência, avaliações e fotos, e contate direto — grátis para proprietários.',
    filterState: 'Estado', filterTrade: 'Especialidade', allStates: 'Todos os estados', allTrades: 'Todas as especialidades',
    contractorsFound: (n: number) => `${n} construtora${n === 1 ? '' : 's'} disponíve${n === 1 ? 'l' : 'is'}`,
  },
} as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-gold-500 fill-gold-500' : 'text-white/20'}`}
        />
      ))}
    </span>
  );
}

export default function Directory() {
  const lang = useLang();
  const t = T[lang];
  const ui = UI_LABELS[lang];
  const navigate = useNavigate();

  const [list, setList] = useState<PublicContractor[] | null>(null);
  const [failed, setFailed] = useState(false);
  // Filtros iniciales desde la URL (?state=Texas&trade=bathroom), usados por
  // los enlaces de las tarjetas de «Proyectos populares» del home.
  const [params] = useSearchParams();
  const [state, setState] = useState(params.get('state') ?? '');
  const [trade, setTrade] = useState(params.get('trade') ?? '');

  useEffect(() => {
    setList(null);
    setFailed(false);
    publicApi.directory(state || undefined, trade || undefined)
      .then(setList)
      .catch(() => setFailed(true));
  }, [state, trade]);

  const goRegister = () => {
    navigate('/');
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-contractor-form')), 400);
  };

  const selectClass = 'px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white focus:outline-none focus:border-gold-500 transition-colors';

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">{t.subtitle}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">{t.title}</h1>
            <p className="text-white/70 max-w-2xl mx-auto">{t.intro}</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass} aria-label={t.filterState}>
              <option value="" className="bg-wine-800">{t.allStates}</option>
              {US_STATES.map((s) => (
                <option key={s.abbr} value={s.name} className="bg-wine-800">{s.name}</option>
              ))}
            </select>
            <select value={trade} onChange={(e) => setTrade(e.target.value)} className={selectClass} aria-label={t.filterTrade}>
              <option value="" className="bg-wine-800">{t.allTrades}</option>
              {Object.entries(TRADE_LABELS[lang]).filter(([v]) => v !== 'other').map(([value, label]) => (
                <option key={value} value={value} className="bg-wine-800">{label}</option>
              ))}
            </select>
          </div>
          <p className="text-center text-sm text-white/50 mb-10" aria-live="polite">
            {list ? t.contractorsFound(list.length) : ''}
          </p>

          {/* Estados de carga / error */}
          {!list && !failed && (
            <div className="flex justify-center py-16 text-white/60">
              <Loader className="w-6 h-6 animate-spin mr-2" /> {ui.loading}
            </div>
          )}
          {failed && <p className="text-center text-red-400 py-16">{ui.error}</p>}

          {/* Tarjetas */}
          {list && list.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((c) => (
                <Link
                  key={c.id}
                  to={`/contractors/${c.id}`}
                  className="group bg-white/5 border border-white/10 rounded-lg p-6 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {c.logo ? (
                      <img src={c.logo} alt={c.company || c.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/30 flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                        <HardHat className="w-7 h-7 text-gold-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="font-serif text-xl text-white truncate group-hover:text-gold-400 transition-colors">
                        {c.company || c.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {!!c.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                            <BadgeCheck className="w-3 h-3" /> {ui.verified}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-white/60">
                          <MapPin className="w-3 h-3" /> {c.city ? `${c.city}, ` : ''}{c.state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gold-400/90 mb-3">
                    {TRADE_LABELS[lang][c.trade] ?? c.trade}
                  </p>
                  {c.description && (
                    <p className="text-sm text-white/60 line-clamp-2 mb-4">{c.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {c.rating > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Stars rating={c.rating} />
                          <span className="text-white/60">{c.rating.toFixed(1)}</span>
                        </span>
                      )}
                      {c.years > 0 && <span className="text-white/50">{ui.years(c.years)}</span>}
                    </div>
                    <span className="inline-flex items-center gap-1 text-gold-500 group-hover:gap-2 transition-all">
                      {ui.viewProfile} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {list && list.length === 0 && (
            <div className="text-center py-16">
              <HardHat className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/70 mb-2">{ui.noResults}</p>
              <p className="text-white/50 text-sm mb-6">{ui.beFirst}</p>
              <button onClick={goRegister} className="btn-primary rounded-sm">
                {ui.joinNow}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
