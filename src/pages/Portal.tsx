import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  HardHat, BadgeCheck, Loader, LogOut, Save, ImagePlus, Trash2, CheckCircle,
  AlertCircle, Lock, ExternalLink,
} from 'lucide-react';
import { Navigation } from '../sections/Navigation';
import { Footer } from '../sections/Footer';
import { contractorApi, authApi, getSession, clearSession, type PublicContractor, type LeadRecord } from '../lib/api';
import { US_STATES } from '../lib/us-states';
import { useLang } from '../lib/use-lang';
import { TRADE_LABELS, LEAD_STATUS_LABELS, UI_LABELS } from '../lib/labels';

const T = {
  en: {
    title: 'Contractor portal', subtitle: 'YOUR BUSINESS',
    intro: 'Manage your public profile, upload project photos and follow up on the requests assigned to you.',
    emailLabel: 'Email', passwordLabel: 'Password',
    loginButton: 'Log in', loggingIn: 'Logging in…',
    wrongCredentials: 'Incorrect email or password.',
    legacyLabel: 'Or paste your access token from the welcome email',
    tokenPlaceholder: 'Paste the token from your welcome email',
    open: 'Open my portal', invalidToken: 'That access token is not valid. Check your welcome email.',
    profileTab: 'My profile', leadsTab: 'My requests',
    save: 'Save profile', saving: 'Saving…', saved: 'Profile saved. It now shows in the public directory.',
    uploadLogo: 'Upload logo', uploadPhoto: 'Add project photo', uploading: 'Uploading…',
    photoLimit: 'Up to 8 project photos.', removePhoto: 'Remove',
    status: 'Account status', statusPending: 'Pending verification — your profile is not public yet.',
    statusActive: 'Active — your profile is visible in the directory.',
    viewPublic: 'View my public profile',
    noLeads: 'No client requests assigned to you yet. They arrive here automatically when a homeowner near you asks for a quote.',
    leadFor: 'Project', client: 'Client', assigned: 'Assigned',
    loginNote: 'You received your personal access link in your registration confirmation email.',
  },
  es: {
    title: 'Portal del contratista', subtitle: 'TU NEGOCIO',
    intro: 'Administra tu perfil público, sube fotos de tus trabajos y da seguimiento a las solicitudes que te asignen.',
    emailLabel: 'Correo electrónico', passwordLabel: 'Contraseña',
    loginButton: 'Entrar', loggingIn: 'Entrando…',
    wrongCredentials: 'Correo o contraseña incorrectos.',
    legacyLabel: 'O pega tu token de acceso del correo de bienvenida',
    tokenPlaceholder: 'Pega el token de tu correo de bienvenida',
    open: 'Abrir mi portal', invalidToken: 'Ese token de acceso no es válido. Revisa tu correo de bienvenida.',
    profileTab: 'Mi perfil', leadsTab: 'Mis solicitudes',
    save: 'Guardar perfil', saving: 'Guardando…', saved: 'Perfil guardado. Ya se muestra en el directorio público.',
    uploadLogo: 'Subir logo', uploadPhoto: 'Agregar foto de proyecto', uploading: 'Subiendo…',
    photoLimit: 'Hasta 8 fotos de proyectos.', removePhoto: 'Quitar',
    status: 'Estado de la cuenta', statusPending: 'Pendiente de verificación — tu perfil aún no es público.',
    statusActive: 'Activo — tu perfil es visible en el directorio.',
    viewPublic: 'Ver mi perfil público',
    noLeads: 'Aún no tienes solicitudes de clientes. Llegan aquí automáticamente cuando un dueño de casa cerca de ti pide una cotización.',
    leadFor: 'Proyecto', client: 'Cliente', assigned: 'Asignada',
    loginNote: 'Recibiste tu enlace de acceso personal en el correo de confirmación de tu registro.',
  },
  pt: {
    title: 'Portal da construtora', subtitle: 'SEU NEGÓCIO',
    intro: 'Administre seu perfil público, envie fotos dos projetos e acompanhe as solicitações atribuídas a você.',
    emailLabel: 'E-mail', passwordLabel: 'Senha',
    loginButton: 'Entrar', loggingIn: 'Entrando…',
    wrongCredentials: 'E-mail ou senha incorretos.',
    legacyLabel: 'Ou cole seu token de acesso do e-mail de boas-vindas',
    tokenPlaceholder: 'Cole o token do e-mail de boas-vindas',
    open: 'Abrir meu portal', invalidToken: 'Esse token de acesso não é válido. Verifique seu e-mail de boas-vindas.',
    profileTab: 'Meu perfil', leadsTab: 'Minhas solicitações',
    save: 'Salvar perfil', saving: 'Salvando…', saved: 'Perfil salvo. Ele já aparece no diretório público.',
    uploadLogo: 'Enviar logo', uploadPhoto: 'Adicionar foto de projeto', uploading: 'Enviando…',
    photoLimit: 'Até 8 fotos de projetos.', removePhoto: 'Remover',
    status: 'Status da conta', statusPending: 'Pendente de verificação — seu perfil ainda não é público.',
    statusActive: 'Ativo — seu perfil está visível no diretório.',
    viewPublic: 'Ver meu perfil público',
    noLeads: 'Você ainda não tem solicitações de clientes. Elas chegam aqui automaticamente quando um proprietário da sua região pede um orçamento.',
    leadFor: 'Projeto', client: 'Cliente', assigned: 'Atribuída',
    loginNote: 'Você recebeu seu link de acesso pessoal no e-mail de confirmação do cadastro.',
  },
} as const;

const TOKEN_KEY = 'remodelausa-contractor-token';

const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors';

export default function Portal() {
  const lang = useLang();
  const t = T[lang];
  const ui = UI_LABELS[lang];
  const [params] = useSearchParams();

  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'profile' | 'leads'>('profile');

  const [profile, setProfile] = useState<PublicContractor | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [services, setServices] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [leads, setLeads] = useState<(LeadRecord & { assigned_at: string })[]>([]);
  const [uploading, setUploading] = useState(false);

  const logoInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async (tk: string) => {
    const me = await contractorApi.me(tk);
    setProfile(me);
    setForm({
      name: me.name, company: me.company, trade: me.trade, state: me.state, city: me.city,
      phone: me.phone, license: me.license, years: String(me.years), website: me.website,
      description: me.description,
    });
    setServices(me.services);
    setLeads(await contractorApi.myLeads(tk));
  }, []);

  // Token por URL (?token=...) o guardado en el navegador
  useEffect(() => {
    const fromUrl = params.get('token');
    const stored = window.localStorage.getItem(TOKEN_KEY) ?? '';
    const tk = fromUrl || stored;
    if (!tk) return;
    setToken(tk);
    setLoading(true);
    loadProfile(tk)
      .then(() => {
        window.localStorage.setItem(TOKEN_KEY, tk);
        setAuthed(true);
      })
      .catch(() => window.localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, [params, loadProfile]);

  // Login con email + contraseña; el token de sesión se guarda en la misma
  // clave que usaba el token legado, así el resto del portal sigue igual.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token: sessionToken } = await authApi.login('contractor', email.trim(), password);
      window.localStorage.setItem(TOKEN_KEY, sessionToken);
      setToken(sessionToken);
      await loadProfile(sessionToken);
      setAuthed(true);
    } catch {
      setError(t.wrongCredentials);
    } finally {
      setLoading(false);
    }
  };

  // Acceso legado con el token del correo de bienvenida
  const loginWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loadProfile(token.trim());
      window.localStorage.setItem(TOKEN_KEY, token.trim());
      setAuthed(true);
    } catch {
      setError(t.invalidToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const session = getSession();
    if (session?.user.type === 'contractor') {
      void authApi.logout();
      clearSession();
    }
    window.localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setProfile(null);
    setToken('');
    setEmail('');
    setPassword('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleService = (value: string) => {
    setServices((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
  };

  const saveProfile = async () => {
    setSaveState('saving');
    try {
      const updated = await contractorApi.updateMe(window.localStorage.getItem(TOKEN_KEY) ?? token, {
        ...form,
        years: Number(form.years) || 0,
        services,
      });
      setProfile(updated);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch {
      setSaveState('idle');
      setError(ui.error);
    }
  };

  // Las fotos de los teléfonos pesan 3–8 MB (y a veces vienen en HEIC), lo que
  // superaba el límite del servidor y rechazaba la subida. Las redimensionamos
  // en el navegador (máx. 1600 px, JPEG 85%) → ~200–500 KB, siempre aceptadas.
  const resizeImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const MAX = 1600;
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (Math.max(w, h) > MAX) {
            const scale = MAX / Math.max(w, h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('canvas unavailable');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch (e) {
          reject(e);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('unreadable image'));
      };
      img.src = url;
    });

  const uploadFile = async (file: File, kind: 'logo' | 'photo') => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const dataUrl = await resizeImage(file);
      const tk = window.localStorage.getItem(TOKEN_KEY) ?? token;
      const { path } = await contractorApi.upload(tk, dataUrl, file.name);
      if (kind === 'logo') {
        const updated = await contractorApi.updateMe(tk, { logo: path });
        setProfile(updated);
      } else {
        const photos = [...(profile?.photos ?? []), path].slice(0, 8);
        const updated = await contractorApi.updateMe(tk, { photos });
        setProfile(updated);
      }
    } catch {
      setError(ui.error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (index: number) => {
    const photos = (profile?.photos ?? []).filter((_, i) => i !== index);
    const tk = window.localStorage.getItem(TOKEN_KEY) ?? token;
    const updated = await contractorApi.updateMe(tk, { photos });
    setProfile(updated);
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

          {/* Login */}
          {!authed && (
            <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-lg p-8">
              <Lock className="w-8 h-8 text-gold-500 mx-auto mb-4" />
              <form onSubmit={login} className="space-y-4">
                <div>
                  <label htmlFor="portal-email" className="block text-sm text-white/80 mb-2">{t.emailLabel}</label>
                  <input
                    id="portal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="portal-password" className="block text-sm text-white/80 mb-2">{t.passwordLabel}</label>
                  <input
                    id="portal-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={inputClass}
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary rounded-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? t.loggingIn : t.loginButton}
                </button>
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              </form>

              {/* Acceso legado con token */}
              <form onSubmit={loginWithToken} className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <label htmlFor="portal-token" className="block text-xs text-white/50">{t.legacyLabel}</label>
                <input
                  id="portal-token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t.tokenPlaceholder}
                  className={inputClass}
                />
                <button type="submit" disabled={loading || !token.trim()} className="w-full px-4 py-2.5 border border-white/20 text-white/70 rounded-sm text-sm hover:border-gold-500/50 hover:text-gold-400 transition-colors disabled:opacity-50">
                  {t.open}
                </button>
              </form>
            </div>
          )}

          {/* Panel */}
          {authed && profile && (
            <>
              {/* Cabecera del panel */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {profile.logo ? (
                    <img src={profile.logo} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/30" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                      <HardHat className="w-6 h-6 text-gold-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-serif text-xl text-white truncate">{profile.company || profile.name}</p>
                    <p className="text-xs text-white/50">
                      {t.status}:{' '}
                      {profile.verified
                        ? <span className="text-green-400">{t.statusActive}</span>
                        : <span className="text-yellow-400">{t.statusPending}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {profile.verified > 0 && (
                    <Link to={`/contractors/${profile.id}`} className="inline-flex items-center gap-2 px-4 py-2 border border-gold-500/50 text-gold-400 rounded-sm text-sm hover:bg-gold-500/10 transition-colors">
                      <ExternalLink className="w-4 h-4" /> {t.viewPublic}
                    </Link>
                  )}
                  <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 rounded-sm text-sm hover:border-red-500/50 hover:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tarjeta de membresía (modelo híbrido) */}
              {(() => {
                const expires = profile.membership_expires_at ? new Date(profile.membership_expires_at) : null;
                const active = profile.membership_status === 'active' && expires !== null && expires.getTime() > Date.now();
                const freeLeft = !profile.free_lead_used;
                return (
                  <div className={`border rounded-lg p-6 mb-6 ${active ? 'bg-green-500/5 border-green-500/30' : freeLeft ? 'bg-gold-500/5 border-gold-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.2em] mb-1 text-white/50">Membership</p>
                        {active ? (
                          <>
                            <p className="text-green-400 font-medium">Active — leads keep coming</p>
                            <p className="text-sm text-white/60 mt-1">Renews / expires: {expires!.toLocaleDateString()} · $150/mes + 8% desde el 2.º mes</p>
                          </>
                        ) : freeLeft ? (
                          <>
                            <p className="text-gold-400 font-medium">Your first lead is FREE</p>
                            <p className="text-sm text-white/60 mt-1">Recibirás tu primer lead de cortesía. Después: $150/mes (el 1.er mes sin comisión, desde el 2.º +8% por trabajo firmado).</p>
                          </>
                        ) : (
                          <>
                            <p className="text-red-400 font-medium">No membership — leads paused</p>
                            <p className="text-sm text-white/60 mt-1">Ya usaste tu lead gratis. Activa tu membresía de $150/mes para seguir recibiendo solicitudes de clientes.</p>
                          </>
                        )}
                      </div>
                      {!active && !freeLeft && (
                        <a href="mailto:hola@remodelausa.com?subject=Membership%20activation" className="btn-primary rounded text-center whitespace-nowrap">Activar membresía</a>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Pestañas */}
              <div className="flex gap-2 mb-6">
                {(['profile', 'leads'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`px-5 py-2.5 rounded-sm text-sm transition-colors ${
                      tab === key ? 'bg-gold-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {key === 'profile' ? t.profileTab : t.leadsTab}
                  </button>
                ))}
              </div>

              {tab === 'profile' && (
                <div className="space-y-6">
                  {/* Logo y fotos */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row gap-8">
                      <div>
                        <p className="text-sm text-white/80 mb-3">{t.uploadLogo}</p>
                        <div className="flex items-center gap-4">
                          {profile.logo ? (
                            <img src={profile.logo} alt="logo" className="w-20 h-20 rounded-full object-cover border-2 border-gold-500/40" />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/30">
                              <ImagePlus className="w-6 h-6" />
                            </div>
                          )}
                          <input
                            ref={logoInput}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && void uploadFile(e.target.files[0], 'logo')}
                          />
                          <button
                            type="button"
                            onClick={() => logoInput.current?.click()}
                            disabled={uploading}
                            className="px-4 py-2 border border-gold-500/50 text-gold-400 rounded-sm text-sm hover:bg-gold-500/10 transition-colors disabled:opacity-50"
                          >
                            {uploading ? t.uploading : t.uploadLogo}
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/80 mb-3">{t.uploadPhoto} <span className="text-white/40">({t.photoLimit})</span></p>
                        <div className="flex flex-wrap gap-3">
                          {profile.photos.map((photo, i) => (
                            <div key={photo} className="relative group">
                              <img src={photo} alt={`project ${i + 1}`} className="w-20 h-20 object-cover rounded-md border border-white/10" />
                              <button
                                type="button"
                                onClick={() => void removePhoto(i)}
                                aria-label={t.removePhoto}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                          {profile.photos.length < 8 && (
                            <>
                              <input
                                ref={photoInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) void uploadFile(e.target.files[0], 'photo');
                                  e.target.value = '';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => photoInput.current?.click()}
                                disabled={uploading}
                                className="w-20 h-20 border border-dashed border-white/30 rounded-md flex flex-col items-center justify-center text-white/40 hover:border-gold-500/50 hover:text-gold-400 transition-colors disabled:opacity-50"
                              >
                                <ImagePlus className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Datos del perfil */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-name">{ui.verified === 'Verified' ? 'Full name' : 'Nombre completo'}</label>
                        <input id="p-name" name="name" value={form.name ?? ''} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-company">{lang === 'es' ? 'Empresa' : lang === 'pt' ? 'Empresa' : 'Company'}</label>
                        <input id="p-company" name="company" value={form.company ?? ''} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-trade">{lang === 'es' ? 'Especialidad principal' : lang === 'pt' ? 'Especialidade principal' : 'Main specialty'}</label>
                        <select id="p-trade" name="trade" value={form.trade ?? ''} onChange={handleChange} className={inputClass}>
                          {Object.entries(TRADE_LABELS[lang]).map(([value, label]) => (
                            <option key={value} value={value} className="bg-wine-800">{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-state">{lang === 'es' ? 'Estado' : lang === 'pt' ? 'Estado' : 'State'}</label>
                        <select id="p-state" name="state" value={form.state ?? ''} onChange={handleChange} className={inputClass}>
                          <option value="" className="bg-wine-800">—</option>
                          {US_STATES.map((s) => (
                            <option key={s.abbr} value={s.name} className="bg-wine-800">{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-city">{lang === 'es' ? 'Ciudad' : lang === 'pt' ? 'Cidade' : 'City'}</label>
                        <input id="p-city" name="city" value={form.city ?? ''} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-phone">{lang === 'es' ? 'Teléfono' : lang === 'pt' ? 'Telefone' : 'Phone'}</label>
                        <input id="p-phone" name="phone" value={form.phone ?? ''} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-license">{ui.license} #</label>
                        <input id="p-license" name="license" value={form.license ?? ''} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-years">{lang === 'es' ? 'Años de experiencia' : lang === 'pt' ? 'Anos de experiência' : 'Years of experience'}</label>
                        <input id="p-years" name="years" type="number" min={0} max={80} value={form.years ?? ''} onChange={handleChange} className={inputClass} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-white/80 mb-2" htmlFor="p-website">{ui.website}</label>
                        <input id="p-website" name="website" type="url" value={form.website ?? ''} onChange={handleChange} placeholder="https://" className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <span className="block text-sm text-white/80 mb-2">{ui.services}</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(TRADE_LABELS[lang]).filter(([v]) => v !== 'other').map(([value, label]) => {
                          const active = services.includes(value);
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => toggleService(value)}
                              aria-pressed={active}
                              className={`px-4 py-2 rounded-sm text-sm border transition-all duration-300 ${
                                active ? 'bg-gold-500 border-gold-500 text-white' : 'bg-white/5 border-white/20 text-white/70 hover:border-gold-500/50'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/80 mb-2" htmlFor="p-description">
                        {lang === 'es' ? 'Descripción (se muestra en tu perfil público)' : lang === 'pt' ? 'Descrição (aparece no seu perfil público)' : 'Description (shown on your public profile)'}
                      </label>
                      <textarea
                        id="p-description"
                        name="description"
                        value={form.description ?? ''}
                        onChange={handleChange}
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button onClick={() => void saveProfile()} disabled={saveState === 'saving'} className="btn-primary rounded-sm flex items-center gap-2 disabled:opacity-50">
                      <Save className="w-4 h-4" />
                      {saveState === 'saving' ? t.saving : t.save}
                    </button>
                    {saveState === 'saved' && (
                      <p className="text-sm text-green-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> {t.saved}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tab === 'leads' && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  {leads.length === 0 ? (
                    <div className="text-center py-10">
                      <AlertCircle className="w-8 h-8 text-white/20 mx-auto mb-3" />
                      <p className="text-white/60 text-sm max-w-md mx-auto">{t.noLeads}</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {leads.map((lead) => (
                        <li key={lead.id} className="border border-white/10 rounded-md p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="text-white font-medium">
                                {t.leadFor} #{lead.id} — {TRADE_LABELS[lang][lead.project_type] ?? lead.project_type}
                              </p>
                              <p className="text-sm text-white/60">{lead.city ? `${lead.city}, ` : ''}{lead.state} · {t.assigned}: {new Date(lead.assigned_at).toLocaleDateString()}</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300">
                              <BadgeCheck className="w-3 h-3" />
                              {LEAD_STATUS_LABELS[lang][lead.status] ?? lead.status}
                            </span>
                          </div>
                          <p className="text-sm text-white/50 mt-2">
                            {t.client}: {lead.name} — <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="text-gold-400 hover:underline">{lead.phone}</a>
                            {' · '}
                            <a href={`mailto:${lead.email}`} className="text-gold-400 hover:underline">{lead.email}</a>
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
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
