import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Home, LogOut, Loader, Plus, CheckCircle, AlertCircle, User, Phone, MapPin,
  Star, BadgeCheck, Save,
} from 'lucide-react';
import { Navigation } from '../sections/Navigation';
import { Footer } from '../sections/Footer';
import {
  authApi, getSession, setSession, clearSession,
  api, type AuthUser, type MyRequest,
} from '../lib/api';
import { US_STATES } from '../lib/us-states';
import { useLang } from '../lib/use-lang';
import { TRADE_LABELS, LEAD_STATUS_LABELS } from '../lib/labels';
import { getLanguage } from '../i18n';

const T = {
  en: {
    title: 'My account', subtitle: 'HOMEOWNER',
    intro: 'Log in to publish what your home needs and follow every quote request from one place.',
    tabLogin: 'Log in', tabRegister: 'Create account',
    emailLabel: 'Email', passwordLabel: 'Password', nameLabel: 'Full name', phoneLabel: 'Phone',
    loginButton: 'Log in', registerButton: 'Create my account',
    registering: 'Creating…', loggingIn: 'Logging in…',
    wrongCredentials: 'Incorrect email or password.',
    emailTaken: 'That email already has an account. Log in instead.',
    passwordShort: 'Password must be at least 6 characters.',
    error: 'Something went wrong. Please try again.',
    welcome: (n: string) => `Welcome, ${n}`,
    logout: 'Log out',
    newRequestTitle: 'What does your home need?',
    projectTypeLabel: 'Project type', stateLabel: 'State', cityLabel: 'City',
    dateLabel: 'Desired start date', messageLabel: 'Details (optional)',
    messagePlaceholder: 'Tell us about your project: size, materials, ideas…',
    publish: 'Publish my request', publishing: 'Publishing…',
    consentBefore: 'I agree to the', consentLink: 'Terms of Use',
    consentAfter: 'and I consent to be contacted by phone, text or email by RemodelaUSA and up to 4 partner contractors about my project.',
    consentRequired: 'Please accept the contact consent to publish.',
    publishedOk: 'Published! We are assigning verified contractors in your area.',
    myRequestsTitle: 'My requests',
    noRequests: 'You have no requests yet. Publish the first one — it takes 2 minutes.',
    request: 'Request', assigned: 'Contractors assigned', submitted: 'Submitted',
    viewProfile: 'View profile', call: 'Call',
    profileTitle: 'My profile', saveProfile: 'Save', saved: 'Profile updated.',
    trackHint: 'You can also check your requests without logging in from',
    trackLink: 'the tracking page',
    contractorHere: 'Are you a contractor?',
    contractorLink: 'Log in to your contractor portal',
  },
  es: {
    title: 'Mi cuenta', subtitle: 'DUEÑO DE CASA',
    intro: 'Inicia sesión para publicar lo que tu hogar necesita y dar seguimiento a cada solicitud de cotización desde un solo lugar.',
    tabLogin: 'Iniciar sesión', tabRegister: 'Crear cuenta',
    emailLabel: 'Correo electrónico', passwordLabel: 'Contraseña', nameLabel: 'Nombre completo', phoneLabel: 'Teléfono',
    loginButton: 'Entrar', registerButton: 'Crear mi cuenta',
    registering: 'Creando…', loggingIn: 'Entrando…',
    wrongCredentials: 'Correo o contraseña incorrectos.',
    emailTaken: 'Ese correo ya tiene cuenta. Inicia sesión.',
    passwordShort: 'La contraseña debe tener al menos 6 caracteres.',
    error: 'Algo salió mal. Inténtalo de nuevo.',
    welcome: (n: string) => `Bienvenido, ${n}`,
    logout: 'Cerrar sesión',
    newRequestTitle: '¿Qué necesita tu hogar?',
    projectTypeLabel: 'Tipo de proyecto', stateLabel: 'Estado', cityLabel: 'Ciudad',
    dateLabel: 'Fecha deseada de inicio', messageLabel: 'Detalles (opcional)',
    messagePlaceholder: 'Cuéntanos sobre tu proyecto: tamaño, materiales, ideas…',
    publish: 'Publicar mi solicitud', publishing: 'Publicando…',
    consentBefore: 'Acepto los', consentLink: 'Términos de Uso',
    consentAfter: 'y consiento ser contactado por teléfono, mensaje de texto o correo por RemodelaUSA y hasta 4 contratistas asociados sobre mi proyecto.',
    consentRequired: 'Acepta el consentimiento de contacto para publicar.',
    publishedOk: '¡Publicada! Estamos asignando contratistas verificados en tu zona.',
    myRequestsTitle: 'Mis solicitudes',
    noRequests: 'Aún no tienes solicitudes. Publica la primera — toma 2 minutos.',
    request: 'Solicitud', assigned: 'Contratistas asignados', submitted: 'Enviada',
    viewProfile: 'Ver perfil', call: 'Llamar',
    profileTitle: 'Mi perfil', saveProfile: 'Guardar', saved: 'Perfil actualizado.',
    trackHint: 'También puedes consultar tus solicitudes sin iniciar sesión desde',
    trackLink: 'la página de seguimiento',
    contractorHere: '¿Eres contratista?',
    contractorLink: 'Entra a tu portal de contratista',
  },
  pt: {
    title: 'Minha conta', subtitle: 'PROPRIETÁRIO',
    intro: 'Entre para publicar o que sua casa precisa e acompanhar cada solicitação de orçamento em um só lugar.',
    tabLogin: 'Entrar', tabRegister: 'Criar conta',
    emailLabel: 'E-mail', passwordLabel: 'Senha', nameLabel: 'Nome completo', phoneLabel: 'Telefone',
    loginButton: 'Entrar', registerButton: 'Criar minha conta',
    registering: 'Criando…', loggingIn: 'Entrando…',
    wrongCredentials: 'E-mail ou senha incorretos.',
    emailTaken: 'Esse e-mail já tem conta. Entre com ele.',
    passwordShort: 'A senha deve ter pelo menos 6 caracteres.',
    error: 'Algo deu errado. Tente novamente.',
    welcome: (n: string) => `Bem-vindo, ${n}`,
    logout: 'Sair',
    newRequestTitle: 'O que sua casa precisa?',
    projectTypeLabel: 'Tipo de projeto', stateLabel: 'Estado', cityLabel: 'Cidade',
    dateLabel: 'Data desejada de início', messageLabel: 'Detalhes (opcional)',
    messagePlaceholder: 'Conte-nos sobre seu projeto: tamanho, materiais, ideias…',
    publish: 'Publicar minha solicitação', publishing: 'Publicando…',
    consentBefore: 'Aceito os', consentLink: 'Termos de Uso',
    consentAfter: 'e consinto ser contatado por telefone, mensagem de texto ou e-mail pela RemodelaUSA e até 4 construtoras parceiras sobre o meu projeto.',
    consentRequired: 'Aceite o consentimento de contato para publicar.',
    publishedOk: 'Publicada! Estamos atribuindo construtoras verificadas da sua região.',
    myRequestsTitle: 'Minhas solicitações',
    noRequests: 'Você ainda não tem solicitações. Publique a primeira — leva 2 minutos.',
    request: 'Solicitação', assigned: 'Construtoras atribuídas', submitted: 'Enviada',
    viewProfile: 'Ver perfil', call: 'Ligar',
    profileTitle: 'Meu perfil', saveProfile: 'Salvar', saved: 'Perfil atualizado.',
    trackHint: 'Você também pode consultar suas solicitações sem entrar em',
    trackLink: 'a página de acompanhamento',
    contractorHere: 'Você é uma construtora?',
    contractorLink: 'Entre no portal da construtora',
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

export default function Account() {
  const lang = useLang();
  const t = T[lang];
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [leads, setLeads] = useState<MyRequest[]>([]);
  const [leadForm, setLeadForm] = useState({
    project_type: 'bathroom', state: '', city: '', start_date: '', message: '',
  });
  const [publishing, setPublishing] = useState(false);
  const [publishState, setPublishState] = useState<'idle' | 'ok' | 'error'>('idle');
  const [leadConsent, setLeadConsent] = useState(false); // consentimiento TCPA
  const [publishError, setPublishError] = useState('');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [profileSaved, setProfileSaved] = useState(false);

  const loadLeads = useCallback(async () => {
    try {
      setLeads(await authApi.homeownerLeads());
    } catch { /* sesión expirada: se maneja abajo */ }
  }, []);

  // Sesión existente
  useEffect(() => {
    const session = getSession();
    if (!session) {
      setChecking(false);
      return;
    }
    authApi.me()
      .then(({ user: me }) => {
        if (me.type === 'contractor') {
          navigate('/portal');
          return;
        }
        setSession(session.token, me);
        setUser(me);
        setProfileForm({ name: me.name, phone: me.phone ?? '' });
        void loadLeads();
      })
      .catch(() => clearSession())
      .finally(() => setChecking(false));
  }, [navigate, loadLeads]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (authMode === 'register') {
        const { token, user: me } = await authApi.registerHomeowner({
          name: authForm.name, email: authForm.email, phone: authForm.phone, password: authForm.password,
        });
        setSession(token, me);
        setUser(me);
        setProfileForm({ name: me.name, phone: me.phone ?? '' });
        void loadLeads();
      } else {
        const { token, user: me } = await authApi.login('homeowner', authForm.email, authForm.password);
        if (me.type === 'contractor') {
          navigate('/portal');
          return;
        }
        setSession(token, me);
        setUser(me);
        setProfileForm({ name: me.name, phone: me.phone ?? '' });
        void loadLeads();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('401') || msg.includes('invalid')) setError(t.wrongCredentials);
      else if (msg.includes('409') || msg.includes('already')) setError(t.emailTaken);
      else if (msg.includes('6 characters')) setError(t.passwordShort);
      else setError(t.error);
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignorar */ }
    clearSession();
    setUser(null);
  };

  const publishLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadConsent) {
      setPublishError(t.consentRequired);
      setPublishState('error');
      setTimeout(() => setPublishState('idle'), 5000);
      return;
    }
    setPublishing(true);
    setPublishState('idle');
    setPublishError('');
    try {
      const session = getSession();
      if (!session) throw new Error('no session');
      await api.submitLeadAuthed({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: profileForm.phone,
        project_type: leadForm.project_type,
        start_date: leadForm.start_date,
        message: leadForm.message,
        state: leadForm.state,
        city: leadForm.city,
        lang: getLanguage(),
        source: 'account',
        tcpa_consent: leadConsent,
      }, session.token);
      setPublishState('ok');
      setLeadConsent(false);
      setLeadForm({ project_type: 'bathroom', state: '', city: '', start_date: '', message: '' });
      void loadLeads();
    } catch {
      setPublishError(t.error);
      setPublishState('error');
    } finally {
      setPublishing(false);
      setTimeout(() => setPublishState('idle'), 5000);
    }
  };

  const saveProfile = async () => {
    try {
      const updated = await authApi.updateHomeowner(profileForm);
      const session = getSession();
      if (session) setSession(session.token, { ...session.user, name: updated.name, phone: updated.phone });
      setUser((prev) => prev ? { ...prev, name: updated.name, phone: updated.phone } : prev);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 4000);
    } catch {
      setError(t.error);
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

          {checking && (
            <div className="flex justify-center py-16 text-white/60">
              <Loader className="w-6 h-6 animate-spin mr-2" />
            </div>
          )}

          {/* Login / registro */}
          {!checking && !user && (
            <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-lg p-8">
              <div className="flex gap-2 mb-6">
                {(['login', 'register'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setAuthMode(m); setError(''); }}
                    className={`flex-1 px-4 py-2.5 rounded-sm text-sm transition-colors ${
                      authMode === m ? 'bg-gold-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {m === 'login' ? t.tabLogin : t.tabRegister}
                  </button>
                ))}
              </div>
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label htmlFor="acc-name" className="block text-sm text-white/80 mb-2">{t.nameLabel}</label>
                      <input id="acc-name" type="text" required value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className={inputClass} autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="acc-phone" className="block text-sm text-white/80 mb-2">{t.phoneLabel}</label>
                      <input id="acc-phone" type="tel" value={authForm.phone}
                        onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} className={inputClass} autoComplete="tel" />
                    </div>
                  </>
                )}
                <div>
                  <label htmlFor="acc-email" className="block text-sm text-white/80 mb-2">{t.emailLabel}</label>
                  <input id="acc-email" type="email" required value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className={inputClass} autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="acc-password" className="block text-sm text-white/80 mb-2">{t.passwordLabel}</label>
                  <input id="acc-password" type="password" required minLength={6} value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className={inputClass} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} />
                </div>
                <button type="submit" disabled={busy} className="w-full btn-primary rounded-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {busy && <Loader className="w-4 h-4 animate-spin" />}
                  {busy ? (authMode === 'register' ? t.registering : t.loggingIn) : (authMode === 'register' ? t.registerButton : t.loginButton)}
                </button>
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              </form>
              <p className="text-xs text-white/40 text-center mt-6">
                {t.contractorHere}{' '}
                <Link to="/portal" className="text-gold-400 hover:underline">{t.contractorLink}</Link>
              </p>
            </div>
          )}

          {/* Dashboard del dueño */}
          {!checking && user && (
            <>
              {/* Cabecera */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6 text-gold-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-xl text-white truncate">{t.welcome(user.name)}</p>
                  <p className="text-xs text-white/50 truncate">{user.email}</p>
                </div>
                <button onClick={() => void logout()} className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 rounded-sm text-sm hover:border-red-500/50 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" /> {t.logout}
                </button>
              </div>

              {/* Nueva solicitud */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <h2 className="font-serif text-2xl text-white mb-5 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-gold-500" /> {t.newRequestTitle}
                </h2>
                <form onSubmit={publishLead} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lead-type" className="block text-sm text-white/80 mb-2">{t.projectTypeLabel}</label>
                      <select id="lead-type" value={leadForm.project_type} className={inputClass}
                        onChange={(e) => setLeadForm({ ...leadForm, project_type: e.target.value })}>
                        {Object.entries(TRADE_LABELS[lang]).filter(([v]) => v !== 'other').map(([value, label]) => (
                          <option key={value} value={value} className="bg-wine-800">{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lead-state" className="block text-sm text-white/80 mb-2">{t.stateLabel}</label>
                      <select id="lead-state" required value={leadForm.state} className={inputClass}
                        onChange={(e) => setLeadForm({ ...leadForm, state: e.target.value })}>
                        <option value="" className="bg-wine-800">—</option>
                        {US_STATES.map((s) => (
                          <option key={s.abbr} value={s.name} className="bg-wine-800">{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lead-city" className="block text-sm text-white/80 mb-2">{t.cityLabel}</label>
                      <input id="lead-city" type="text" value={leadForm.city} className={inputClass}
                        onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="lead-date" className="block text-sm text-white/80 mb-2">{t.dateLabel}</label>
                      <input id="lead-date" type="date" value={leadForm.start_date} className={inputClass}
                        onChange={(e) => setLeadForm({ ...leadForm, start_date: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lead-message" className="block text-sm text-white/80 mb-2">{t.messageLabel}</label>
                    <textarea id="lead-message" rows={3} value={leadForm.message} className={`${inputClass} resize-none`}
                      placeholder={t.messagePlaceholder}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })} />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadConsent}
                      onChange={(e) => setLeadConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#d2a855] shrink-0"
                    />
                    <span className="text-xs text-white/60 leading-relaxed">
                      {t.consentBefore}{' '}
                      <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline underline-offset-2">
                        {t.consentLink}
                      </a>{' '}
                      {t.consentAfter}
                    </span>
                  </label>
                  <button type="submit" disabled={publishing} className="btn-primary rounded-sm flex items-center gap-2 disabled:opacity-50">
                    {publishing && <Loader className="w-4 h-4 animate-spin" />}
                    {publishing ? t.publishing : t.publish}
                  </button>
                  {publishState === 'ok' && (
                    <p className="text-sm text-green-400 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> {t.publishedOk}</p>
                  )}
                  {publishState === 'error' && (
                    <p className="text-sm text-red-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {publishError || t.error}</p>
                  )}
                </form>
              </div>

              {/* Mis solicitudes */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <h2 className="font-serif text-2xl text-white mb-5">{t.myRequestsTitle}</h2>
                {leads.length === 0 ? (
                  <p className="text-white/50 text-sm">{t.noRequests}</p>
                ) : (
                  <div className="space-y-4">
                    {leads.map((req) => (
                      <article key={req.id} className="border border-white/10 rounded-md p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-white font-medium">
                              {t.request} #{req.id} — {TRADE_LABELS[lang][req.project_type] ?? req.project_type}
                            </h3>
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
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs uppercase tracking-[0.2em] text-gold-500 mb-2">{t.assigned}</p>
                            <ul className="space-y-2">
                              {req.contractors.map((c) => (
                                <li key={c.id} className="flex items-center gap-3 text-sm">
                                  {c.logo ? (
                                    <img src={c.logo} alt="" className="w-8 h-8 rounded-full object-cover border border-gold-500/30" />
                                  ) : (
                                    <BadgeCheck className="w-4 h-4 text-gold-500 flex-shrink-0" />
                                  )}
                                  <span className="text-white/80 flex-1 truncate">{c.company || c.name}</span>
                                  {c.rating > 0 && (
                                    <span className="inline-flex items-center gap-1 text-white/50">
                                      <Star className="w-3 h-3 text-gold-500 fill-gold-500" /> {c.rating.toFixed(1)}
                                    </span>
                                  )}
                                  <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="text-gold-400 hover:underline">{t.call}</a>
                                  <Link to={`/contractors/${c.id}`} className="text-white/50 hover:text-gold-400">{t.viewProfile}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
                <p className="text-xs text-white/40 mt-4">
                  {t.trackHint}{' '}
                  <Link to="/track" className="text-gold-400 hover:underline">{t.trackLink}</Link>
                </p>
              </div>

              {/* Perfil */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h2 className="font-serif text-2xl text-white mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-500" /> {t.profileTitle}
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="prof-name" className="block text-sm text-white/80 mb-2">{t.nameLabel}</label>
                    <input id="prof-name" type="text" value={profileForm.name} className={inputClass}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="prof-phone" className="block text-sm text-white/80 mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {t.phoneLabel}
                    </label>
                    <input id="prof-phone" type="tel" value={profileForm.phone} className={inputClass}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                </div>
                <button onClick={() => void saveProfile()} className="px-5 py-2.5 border border-gold-500/50 text-gold-400 rounded-sm text-sm hover:bg-gold-500/10 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> {t.saveProfile}
                </button>
                {profileSaved && <p className="text-sm text-green-400 mt-3">{t.saved}</p>}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
