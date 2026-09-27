import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Loader, PackageOpen, Phone, MapPin, Star, BadgeCheck, ArrowRight } from 'lucide-react';
import { Navigation } from '../sections/Navigation';
import { Footer } from '../sections/Footer';
import { publicApi, type MyRequest } from '../lib/api';
import { requestSectionScroll } from '../lib/utils';
import { useLang } from '../lib/use-lang';
import { TRADE_LABELS, LEAD_STATUS_LABELS } from '../lib/labels';

const T = {
  en: {
    title: 'Track your request', subtitle: 'MY PROJECTS',
    intro: 'Enter the email or phone number you used when you submitted your request and see its status and the contractors working on it.',
    emailLabel: 'Email', emailPlaceholder: 'you@example.com',
    phoneLabel: 'Phone', phonePlaceholder: '(555) 123-4567',
    search: 'See my requests', searching: 'Searching…',
    hint: 'Use the same email or phone from your quote request.',
    none: 'We couldn\'t find requests with that information. Check the spelling or submit a new request.',
    request: 'Request', submitted: 'Submitted', contractorsAssigned: 'Contractors assigned to your project',
    yourRequests: (n: number) => `We found ${n} request${n === 1 ? '' : 's'}`,
    call: 'Call', viewProfile: 'View profile', newRequest: 'Start a new request',
    error: 'Something went wrong. Please try again.',
  },
  es: {
    title: 'Sigue tu solicitud', subtitle: 'MIS PROYECTOS',
    intro: 'Ingresa el correo o teléfono que usaste al enviar tu solicitud y mira su estado y los contratistas que están atendiéndola.',
    emailLabel: 'Correo electrónico', emailPlaceholder: 'tu@ejemplo.com',
    phoneLabel: 'Teléfono', phonePlaceholder: '(555) 123-4567',
    search: 'Ver mis solicitudes', searching: 'Buscando…',
    hint: 'Usa el mismo correo o teléfono de tu solicitud de cotización.',
    none: 'No encontramos solicitudes con esos datos. Revisa la escritura o envía una nueva solicitud.',
    request: 'Solicitud', submitted: 'Enviada', contractorsAssigned: 'Contratistas asignados a tu proyecto',
    yourRequests: (n: number) => `Encontramos ${n} solicitud${n === 1 ? '' : 'es'}`,
    call: 'Llamar', viewProfile: 'Ver perfil', newRequest: 'Iniciar una nueva solicitud',
    error: 'Algo salió mal. Inténtalo de nuevo.',
  },
  pt: {
    title: 'Acompanhar solicitação', subtitle: 'MEUS PROJETOS',
    intro: 'Digite o e-mail ou telefone usado no envio da solicitação e veja o status e as construtoras que estão atendendo.',
    emailLabel: 'E-mail', emailPlaceholder: 'voce@exemplo.com',
    phoneLabel: 'Telefone', phonePlaceholder: '(555) 123-4567',
    search: 'Ver minhas solicitações', searching: 'Buscando…',
    hint: 'Use o mesmo e-mail ou telefone do seu pedido de orçamento.',
    none: 'Não encontramos solicitações com esses dados. Verifique a escrita ou envie uma nova solicitação.',
    request: 'Solicitação', submitted: 'Enviada', contractorsAssigned: 'Construtoras atribuídas ao seu projeto',
    yourRequests: (n: number) => `Encontramos ${n} solicitaç${n === 1 ? 'ão' : 'ões'}`,
    call: 'Ligar', viewProfile: 'Ver perfil', newRequest: 'Iniciar nova solicitação',
    error: 'Algo deu errado. Tente novamente.',
  },
} as const;

const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors';

const STATUS_STYLE: Record<string, string> = {
  new: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  contacted: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
  quoted: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  signed: 'bg-green-500/10 border-green-500/30 text-green-300',
  lost: 'bg-white/5 border-white/20 text-white/50',
};

export default function Track() {
  const lang = useLang();
  const t = T[lang];

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState<MyRequest[] | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) return;
    setLoading(true);
    setError('');
    setRequests(null);
    try {
      const result = await publicApi.myRequests(email.trim(), phone.trim());
      setRequests(result);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-3 block">{t.subtitle}</span>
            <h1 className="font-serif text-4xl text-white mb-3">{t.title}</h1>
            <p className="text-white/70 max-w-xl mx-auto">{t.intro}</p>
          </div>

          {/* Buscador */}
          <form onSubmit={search} className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="track-email" className="block text-sm text-white/80 mb-2">{t.emailLabel}</label>
                <input
                  id="track-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="track-phone" className="block text-sm text-white/80 mb-2">{t.phoneLabel}</label>
                <input
                  id="track-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </div>
            <button type="submit" disabled={loading || (!email.trim() && !phone.trim())} className="w-full btn-primary rounded-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? t.searching : t.search}
            </button>
            <p className="text-xs text-white/40 text-center mt-3">{t.hint}</p>
            {error && <p className="text-sm text-red-400 text-center mt-3">{error}</p>}
          </form>

          {/* Resultados */}
          {requests && (
            <>
              <p className="text-sm text-white/60 mb-5">{t.yourRequests(requests.length)}</p>
              {requests.length === 0 ? (
                <div className="text-center bg-white/5 border border-white/10 rounded-lg py-12">
                  <PackageOpen className="w-10 h-10 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 max-w-md mx-auto mb-6">{t.none}</p>
                  <button onClick={() => requestSectionScroll('#contact')} className="btn-primary rounded-sm inline-flex items-center gap-2">
                    {t.newRequest} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {requests.map((req) => (
                    <article key={req.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div>
                          <h2 className="font-serif text-xl text-white">
                            {t.request} #{req.id} — {TRADE_LABELS[lang][req.project_type] ?? req.project_type}
                          </h2>
                          <p className="text-sm text-white/50 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {req.city ? `${req.city}, ` : ''}{req.state || '—'} · {t.submitted}: {new Date(req.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs ${STATUS_STYLE[req.status] ?? STATUS_STYLE.new}`}>
                          {LEAD_STATUS_LABELS[lang][req.status] ?? req.status}
                        </span>
                      </div>

                      {req.contractors.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-3">{t.contractorsAssigned}</p>
                          <ul className="space-y-3">
                            {req.contractors.map((c) => (
                              <li key={c.id} className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-md p-3">
                                {c.logo ? (
                                  <img src={c.logo} alt="" className="w-11 h-11 rounded-full object-cover border border-gold-500/30 flex-shrink-0" />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                                    <BadgeCheck className="w-5 h-5 text-gold-500" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium truncate">{c.company || c.name}</p>
                                  <p className="text-xs text-white/50">
                                    {TRADE_LABELS[lang][c.trade] ?? c.trade}
                                    {c.rating > 0 && (
                                      <span className="inline-flex items-center gap-1 ml-2">
                                        <Star className="w-3 h-3 text-gold-500 fill-gold-500" /> {c.rating.toFixed(1)}
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gold-500/50 text-gold-400 rounded-sm text-xs hover:bg-gold-500/10 transition-colors">
                                    <Phone className="w-3.5 h-3.5" /> {t.call}
                                  </a>
                                  <Link to={`/contractors/${c.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-gold-400 transition-colors">
                                    {t.viewProfile} <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
