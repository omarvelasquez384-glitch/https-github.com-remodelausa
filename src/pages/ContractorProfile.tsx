import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { HardHat, BadgeCheck, MapPin, Star, Phone, Mail, Globe, ArrowLeft, Loader, ShieldCheck, Briefcase } from 'lucide-react';
import { Navigation } from '../sections/Navigation';
import { Footer } from '../sections/Footer';
import { publicApi, type PublicContractor } from '../lib/api';
import { useLang } from '../lib/use-lang';
import { TRADE_LABELS, UI_LABELS } from '../lib/labels';

export default function ContractorProfile() {
  const { id } = useParams();
  const lang = useLang();
  const ui = UI_LABELS[lang];
  const navigate = useNavigate();

  const [c, setC] = useState<PublicContractor | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setC(null);
    setFailed(false);
    publicApi.contractor(Number(id))
      .then(setC)
      .catch(() => setFailed(true));
    window.scrollTo({ top: 0 });
  }, [id]);

  const requestQuote = () => {
    navigate('/#contact');
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container-custom max-w-5xl">
          <Link to="/contractors" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-400 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {ui.backToDirectory}
          </Link>

          {!c && !failed && (
            <div className="flex justify-center py-16 text-white/60">
              <Loader className="w-6 h-6 animate-spin mr-2" /> {ui.loading}
            </div>
          )}
          {failed && (
            <div className="text-center py-16">
              <p className="text-white/70 mb-6">{ui.notFound}</p>
              <Link to="/contractors" className="btn-primary rounded-sm">{ui.backToDirectory}</Link>
            </div>
          )}

          {c && (
            <>
              {/* Encabezado del perfil */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {c.logo ? (
                    <img src={c.logo} alt={c.company || c.name} className="w-24 h-24 rounded-full object-cover border-2 border-gold-500/40 flex-shrink-0" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
                      <HardHat className="w-10 h-10 text-gold-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="font-serif text-3xl md:text-4xl text-white">{c.company || c.name}</h1>
                      {!!c.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                          <BadgeCheck className="w-3.5 h-3.5" /> {ui.verified}
                        </span>
                      )}
                    </div>
                    <p className="text-gold-400 mt-1">{TRADE_LABELS[lang][c.trade] ?? c.trade}</p>
                    <p className="text-white/60 text-sm mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {ui.basedIn}: {c.city ? `${c.city}, ` : ''}{c.state}
                    </p>
                    {c.rating > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className={`w-4 h-4 ${i <= Math.round(c.rating) ? 'text-gold-500 fill-gold-500' : 'text-white/20'}`} />
                          ))}
                        </span>
                        <span className="text-white/70 text-sm">{c.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={requestQuote} className="btn-primary rounded-sm text-sm px-6">
                      {ui.requestQuote}
                    </button>
                    {c.phone && (
                      <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gold-500/50 text-gold-400 rounded-sm text-sm hover:bg-gold-500/10 transition-colors">
                        <Phone className="w-4 h-4" /> {ui.call}
                      </a>
                    )}
                  </div>
                </div>

                {/* Datos rápidos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                  {c.years > 0 && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-white font-medium text-sm">{c.years}</p>
                        <p className="text-white/50 text-xs">{ui.years(c.years)}</p>
                      </div>
                    </div>
                  )}
                  {c.jobs_done > 0 && (
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-white font-medium text-sm">{c.jobs_done}</p>
                        <p className="text-white/50 text-xs">{ui.jobsDone(c.jobs_done)}</p>
                      </div>
                    </div>
                  )}
                  {c.license && (
                    <div className="col-span-2">
                      <p className="text-white/50 text-xs mb-0.5">{ui.license}</p>
                      <p className="text-white/80 text-sm font-mono">{c.license}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción y servicios */}
              {(c.description || c.services.length > 0) && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
                  {c.description && <p className="text-white/75 leading-relaxed mb-6 whitespace-pre-line">{c.description}</p>}
                  {c.services.length > 0 && (
                    <div>
                      <h2 className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-3">{ui.services}</h2>
                      <div className="flex flex-wrap gap-2">
                        {c.services.map((s) => (
                          <span key={s} className="px-4 py-2 bg-gold-500/10 border border-gold-500/30 text-gold-300 text-sm rounded-sm">
                            {TRADE_LABELS[lang][s] ?? s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Galería de fotos */}
              {c.photos.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-5">{ui.photos}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {c.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`${c.company || c.name} — ${i + 1}`}
                        loading="lazy"
                        className="w-full aspect-square object-cover rounded-md border border-white/10"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Contacto */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  {c.phone && (
                    <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-sm text-white hover:border-gold-500/50 transition-colors">
                      <Phone className="w-4 h-4 text-gold-500" /> {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-sm text-white hover:border-gold-500/50 transition-colors">
                      <Mail className="w-4 h-4 text-gold-500" /> {c.email}
                    </a>
                  )}
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-sm text-white hover:border-gold-500/50 transition-colors">
                      <Globe className="w-4 h-4 text-gold-500" /> {ui.website}
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
