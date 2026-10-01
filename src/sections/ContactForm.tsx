import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail, Clock, HardHat, Home } from 'lucide-react';
import { contactFormConfig } from '../config';
import { LocationBar, getStoredLocation } from '../components/LocationBar';
import { api, setSession } from '../lib/api';
import { US_STATES } from '../lib/us-states';
import { getLanguage, type Lang } from '../i18n';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin, Phone, Mail, Clock,
};

type Mode = 'homeowner' | 'contractor';

// Textos propios del componente (modo contratista) por idioma
const STRINGS = {
  en: {
    modeHomeowner: 'I\'m a homeowner',
    modeContractor: 'I\'m a contractor',
    contractorTitleNote: 'Join our network — receive client requests in your area and pay commission only when you sign.',
    companyLabel: 'Company',
    companyPlaceholder: 'Your company name',
    tradeLabel: 'Main specialty',
    stateLabel: 'State where you work',
    cityLabel: 'City',
    cityPlaceholder: 'Main city you serve',
    yearsLabel: 'Years of experience',
    websiteLabel: 'Website (optional)',
    websitePlaceholder: 'https://yourcompany.com',
    servicesLabel: 'Services you offer',
    aboutLabel: 'Tell homeowners about your work',
    aboutPlaceholder: 'e.g. We specialize in bathroom remodels with 15 years of experience and 300+ completed projects...',
    licenseLabel: 'Contractor license #',
    licensePlaceholder: 'e.g. TX-123456',
    passwordLabel: 'Password (min. 6 characters)',
    passwordPlaceholder: 'Create your password',
    confirmLabel: 'Repeat password',
    passwordMismatch: 'Passwords do not match.',
    consentBefore: 'I agree to the',
    consentLink: 'Terms of Use',
    consentAfter: 'and I consent to be contacted by phone, text or email by RemodelaUSA and up to 4 partner contractors about my project. Consent is not a condition of purchase.',
    consentRequired: 'Please accept the contact consent to submit your request.',
    termsAfter: 'including the commission on jobs signed through RemodelaUSA.',
    termsRequired: 'You must accept the Terms of Use to register.',
    successHomeowner: (matched: number) =>
      matched > 0
        ? `Done! Your request was received and sent to ${matched} verified contractor(s) in your area. You'll hear back within 24 hours.`
        : 'Done! We received your request. Our team is assigning verified contractors in your area — you\'ll hear back within 24 hours.',
    successContractor: 'Welcome aboard! We received your registration. We\'ll verify your license and notify you by email when your profile goes live.',
    trackCta: 'Track your request',
    accountCta: 'Create a free account to manage your requests',
    portalCta: 'Open your contractor portal to complete your profile and upload photos',
    error: 'Something went wrong sending your data. Please try again.',
    serverOffline: 'Could not reach the server. Check your connection and try again.',
  },
  es: {
    modeHomeowner: 'Soy dueño de casa',
    modeContractor: 'Soy contratista',
    contractorTitleNote: 'Únete a la red: recibe solicitudes de clientes en tu zona y paga comisión solo cuando firmes.',
    companyLabel: 'Empresa',
    companyPlaceholder: 'Nombre de tu empresa',
    tradeLabel: 'Especialidad principal',
    stateLabel: 'Estado donde trabajas',
    cityLabel: 'Ciudad',
    cityPlaceholder: 'Ciudad principal donde trabajas',
    yearsLabel: 'Años de experiencia',
    websiteLabel: 'Sitio web (opcional)',
    websitePlaceholder: 'https://tuempresa.com',
    servicesLabel: 'Servicios que ofreces',
    aboutLabel: 'Cuéntales a los dueños de casa sobre tu trabajo',
    aboutPlaceholder: 'ej. Nos especializamos en remodelación de baños con 15 años de experiencia y más de 300 proyectos...',
    licenseLabel: 'Licencia de contratista #',
    licensePlaceholder: 'ej. TX-123456',
    passwordLabel: 'Contraseña (mín. 6 caracteres)',
    passwordPlaceholder: 'Crea tu contraseña',
    confirmLabel: 'Repite la contraseña',
    passwordMismatch: 'Las contraseñas no coinciden.',
    consentBefore: 'Acepto los',
    consentLink: 'Términos de Uso',
    consentAfter: 'y consiento ser contactado por teléfono, mensaje de texto o correo por RemodelaUSA y hasta 4 contratistas asociados sobre mi proyecto. El consentimiento no es condición de compra.',
    consentRequired: 'Por favor acepta el consentimiento de contacto para enviar tu solicitud.',
    termsAfter: 'incluida la comisión por trabajos firmados a través de RemodelaUSA.',
    termsRequired: 'Debes aceptar los Términos de Uso para registrarte.',
    successHomeowner: (matched: number) =>
      matched > 0
        ? `¡Listo! Recibimos tu solicitud y ya se envió a ${matched} contratista(s) verificado(s) de tu zona. Te contactarán en menos de 24 horas.`
        : '¡Listo! Recibimos tu solicitud. Nuestro equipo está asignando contratistas verificados en tu zona — te contactarán en menos de 24 horas.',
    successContractor: '¡Bienvenido! Recibimos tu registro. Verificaremos tu licencia y te avisaremos por correo cuando tu perfil quede activo.',
    trackCta: 'Sigue tu solicitud',
    accountCta: 'Crea una cuenta gratis para administrar tus solicitudes',
    portalCta: 'Abre tu portal de contratista para completar tu perfil y subir fotos',
    error: 'Hubo un problema al enviar tus datos. Intenta de nuevo.',
    serverOffline: 'No se pudo contactar al servidor. Revisa tu conexión e inténtalo de nuevo.',
  },
  pt: {
    modeHomeowner: 'Sou proprietário',
    modeContractor: 'Sou construtora',
    contractorTitleNote: 'Junte-se à rede: receba solicitações de clientes na sua região e pague comissão apenas quando fechar.',
    companyLabel: 'Empresa',
    companyPlaceholder: 'Nome da sua empresa',
    tradeLabel: 'Especialidade principal',
    stateLabel: 'Estado onde trabalha',
    cityLabel: 'Cidade',
    cityPlaceholder: 'Cidade principal onde trabalha',
    yearsLabel: 'Anos de experiência',
    websiteLabel: 'Site (opcional)',
    websitePlaceholder: 'https://suaempresa.com',
    servicesLabel: 'Serviços que oferece',
    aboutLabel: 'Conte aos proprietários sobre o seu trabalho',
    aboutPlaceholder: 'ex. Somos especializados em reforma de banheiros com 15 anos de experiência e mais de 300 projetos...',
    licenseLabel: 'Licença de construtora #',
    licensePlaceholder: 'ex. TX-123456',
    passwordLabel: 'Senha (mín. 6 caracteres)',
    passwordPlaceholder: 'Crie sua senha',
    confirmLabel: 'Repita a senha',
    passwordMismatch: 'As senhas não coincidem.',
    consentBefore: 'Aceito os',
    consentLink: 'Termos de Uso',
    consentAfter: 'e consinto ser contatado por telefone, mensagem de texto ou e-mail pela RemodelaUSA e até 4 construtoras parceiras sobre o meu projeto. O consentimento não é condição de compra.',
    consentRequired: 'Aceite o consentimento de contato para enviar sua solicitação.',
    termsAfter: 'incluída a comissão por trabalhos fechados pela RemodelaUSA.',
    termsRequired: 'Você deve aceitar os Termos de Uso para se cadastrar.',
    successHomeowner: (matched: number) =>
      matched > 0
        ? `Pronto! Recebemos sua solicitação e já a enviamos para ${matched} construtora(s) verificada(s) da sua região. Elas entrarão em contato em menos de 24 horas.`
        : 'Pronto! Recebemos sua solicitação. Nossa equipe está atribuindo construtoras verificadas na sua região — elas entrarão em contato em menos de 24 horas.',
    successContractor: 'Bem-vindo! Recebemos seu cadastro. Verificaremos sua licença e avisaremos por e-mail quando seu perfil ficar ativo.',
    trackCta: 'Acompanhar solicitação',
    accountCta: 'Crie uma conta grátis para gerenciar suas solicitações',
    portalCta: 'Abra o portal da construtora para completar seu perfil e enviar fotos',
    error: 'Ocorreu um problema ao enviar seus dados. Tente novamente.',
    serverOffline: 'Não foi possível contatar o servidor. Verifique sua conexão e tente novamente.',
  },
} as const;

const TRADE_OPTIONS: Record<Lang, { value: string; label: string }[]> = {
  en: [
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'painting', label: 'Painting' },
    { value: 'concrete', label: 'Concrete' },
    { value: 'remodel', label: 'Full remodel' },
    { value: 'repair', label: 'Repair' },
  ],
  es: [
    { value: 'bathroom', label: 'Baños' },
    { value: 'kitchen', label: 'Cocinas' },
    { value: 'painting', label: 'Pintura' },
    { value: 'concrete', label: 'Concreto' },
    { value: 'remodel', label: 'Remodelación completa' },
    { value: 'repair', label: 'Reparación' },
  ],
  pt: [
    { value: 'bathroom', label: 'Banheiros' },
    { value: 'kitchen', label: 'Cozinhas' },
    { value: 'painting', label: 'Pintura' },
    { value: 'concrete', label: 'Concreto' },
    { value: 'remodel', label: 'Reforma completa' },
    { value: 'repair', label: 'Reparo' },
  ],
};

export function ContactForm() {
  // Null check: if config is empty, render nothing
  if (!contactFormConfig.mainTitle) return null;

  const lang = getLanguage() as Lang;
  const t = STRINGS[lang] ?? STRINGS.en;
  const form = contactFormConfig.form;

  const [mode, setMode] = useState<Mode>('homeowner');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visitDate: '',
    visitors: form.visitorsOptions[0] ?? '',
    message: '',
    company: '',
    trade: 'bathroom',
    state: '',
    city: '',
    years: '',
    website: '',
    license: '',
    password: '',
    confirm: '',
  });
  const [services, setServices] = useState<string[]>(['bathroom']);
  const [consent, setConsent] = useState(false);           // TCPA (dueño de casa)
  const [agreeTerms, setAgreeTerms] = useState(false);     // términos (contratista)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [portalLink, setPortalLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // El CTA de contratistas en otras secciones abre este formulario en modo contratista
  useEffect(() => {
    const openContractor = () => {
      setMode('contractor');
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('open-contractor-form', openContractor);
    return () => window.removeEventListener('open-contractor-form', openContractor);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', visitDate: '', visitors: form.visitorsOptions[0] ?? '',
      message: '', company: '', trade: 'bathroom', state: '', city: '', years: '', website: '', license: '',
      password: '', confirm: '',
    });
    setServices(['bathroom']);
    setConsent(false);
    setAgreeTerms(false);
  };

  const toggleService = (value: string) => {
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    // Validación de contraseña del contratista
    if (mode === 'contractor') {
      if (formData.password.length < 6) {
        setStatus('error');
        setStatusMessage(t.passwordLabel);
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirm) {
        setStatus('error');
        setStatusMessage(t.passwordMismatch);
        setIsSubmitting(false);
        return;
      }
      if (!agreeTerms) {
        setStatus('error');
        setStatusMessage(t.termsRequired);
        setIsSubmitting(false);
        return;
      }
    } else if (!consent) {
      // Consentimiento de contacto (TCPA) obligatorio para dueños de casa
      setStatus('error');
      setStatusMessage(t.consentRequired);
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === 'homeowner') {
        const loc = getStoredLocation();
        const result = await api.submitLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_type: formData.visitors,
          start_date: formData.visitDate,
          message: formData.message,
          state: loc?.state ?? '',
          city: loc?.city ?? '',
          lang,
          source: 'website',
          tcpa_consent: consent,
        });
        setStatus('success');
        setStatusMessage(t.successHomeowner(result.matched));
        setPortalLink('');
      } else {
        const result = await api.registerContractor({
          name: formData.name,
          company: formData.company,
          trade: formData.trade,
          state: formData.state,
          city: formData.city,
          phone: formData.phone,
          email: formData.email,
          license: formData.license,
          years: Number(formData.years) || 0,
          description: formData.message,
          services,
          website: formData.website,
          password: formData.password,
          agree_terms: agreeTerms,
        });
        setStatus('success');
        setStatusMessage(t.successContractor);
        setPortalLink(`/portal?token=${result.access_token}`);
        // Auto-login: el contratista queda con la sesión iniciada
        if (result.session_token) {
          const user = { id: result.id, type: 'contractor' as const, name: formData.name, email: formData.email };
          setSession(result.session_token, user);
          window.localStorage.setItem('remodelausa-contractor-token', result.session_token);
        }
      }
      resetForm();
    } catch {
      setStatus('error');
      setStatusMessage(navigator.onLine ? t.error : t.serverOffline);
    }

    setIsSubmitting(false);
    setTimeout(() => { setStatus('idle'); setPortalLink(''); }, 12000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d2a855 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="fade-up text-center mb-12">
          <span className="font-script text-3xl text-gold-400 block mb-2">{contactFormConfig.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
            {contactFormConfig.subtitle}
          </span>
          <h2 className="font-serif text-h1 text-white mb-4">
            {contactFormConfig.mainTitle}
          </h2>
          {contactFormConfig.introText && (
            <p className="text-white/70 max-w-2xl mx-auto">
              {contactFormConfig.introText}
            </p>
          )}
        </div>

        {/* Selector de modo: dueño de casa / contratista */}
        <div className="fade-up flex justify-center gap-2 mb-8">
          <button
            onClick={() => setMode('homeowner')}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm text-sm transition-all duration-300 ${
              mode === 'homeowner'
                ? 'bg-gold-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Home className="w-4 h-4" />
            {t.modeHomeowner}
          </button>
          <button
            onClick={() => setMode('contractor')}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm text-sm transition-all duration-300 ${
              mode === 'contractor'
                ? 'bg-gold-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            <HardHat className="w-4 h-4" />
            {t.modeContractor}
          </button>
        </div>

        {mode === 'contractor' && (
          <p className="text-center text-sm text-gold-400/90 mb-8 max-w-xl mx-auto">{t.contractorTitleNote}</p>
        )}

        <LocationBar />

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="slide-in-left" style={{ transitionDelay: '0.1s' }}>
              {contactFormConfig.contactInfoTitle && (
                <h3 className="font-serif text-h5 text-white mb-6">{contactFormConfig.contactInfoTitle}</h3>
              )}
              <div className="space-y-4" role="list" aria-label="Contact information">
                {contactFormConfig.contactInfo.map((item) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-gold-500/30 transition-colors"
                      role="listitem"
                    >
                      <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        {IconComponent && <IconComponent className="w-5 h-5 text-gold-500" />}
                      </div>
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                        <p className="text-sm text-white/60">{item.subtext}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="slide-in-right bg-white/5 rounded-lg border border-white/10 p-8" style={{ transitionDelay: '0.15s' }}>
              {status === 'success' ? (
                <div className="text-center py-12" role="alert">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-h5 text-white mb-2 max-w-md mx-auto">
                    {statusMessage}
                  </h3>
                  {portalLink ? (
                    <a
                      href={portalLink}
                      className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold-500 text-white rounded-sm hover:bg-gold-600 transition-colors text-sm"
                    >
                      <HardHat className="w-4 h-4" />
                      {t.portalCta}
                    </a>
                  ) : (
                    <>
                      <a
                        href="/track"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold-500 text-white rounded-sm hover:bg-gold-600 transition-colors text-sm"
                      >
                        <Send className="w-4 h-4" />
                        {t.trackCta}
                      </a>
                      <a
                        href="/account"
                        className="block mt-4 text-sm text-white/50 hover:text-gold-400 transition-colors underline underline-offset-4"
                      >
                        {t.accountCta}
                      </a>
                    </>
                  )}
                </div>
              ) : status === 'error' ? (
                <div className="text-center py-12" role="alert">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="font-serif text-h5 text-white mb-2 max-w-md mx-auto">
                    {statusMessage || form.errorMessage}
                  </h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-sm text-white/80 mb-2">
                        {form.nameLabel} <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={form.namePlaceholder}
                        autoComplete="name"
                        className={inputClass}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm text-white/80 mb-2">
                        {form.phoneLabel} <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder={form.phonePlaceholder}
                        autoComplete="tel"
                        className={inputClass}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="block text-sm text-white/80 mb-2">
                        {form.emailLabel} <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={form.emailPlaceholder}
                        autoComplete="email"
                        className={inputClass}
                      />
                    </div>

                    {mode === 'homeowner' ? (
                      /* Start date */
                      <div>
                        <label htmlFor="contact-date" className="block text-sm text-white/80 mb-2">
                          {form.visitDateLabel} <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="contact-date"
                          type="date"
                          name="visitDate"
                          value={formData.visitDate}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                    ) : (
                      /* Company (contractor) */
                      <div>
                        <label htmlFor="contact-company" className="block text-sm text-white/80 mb-2">
                          {t.companyLabel}
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder={t.companyPlaceholder}
                          autoComplete="organization"
                          className={inputClass}
                        />
                      </div>
                    )}
                  </div>

                  {mode === 'homeowner' ? (
                    /* Project type (homeowner) */
                    <div>
                      <label htmlFor="contact-visitors" className="block text-sm text-white/80 mb-2">
                        {form.visitorsLabel}
                      </label>
                      <select
                        id="contact-visitors"
                        name="visitors"
                        value={formData.visitors}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {form.visitorsOptions.map((option) => (
                          <option key={option} value={option} className="bg-wine-800">{option}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Specialty (contractor) */}
                      <div>
                        <label htmlFor="contact-trade" className="block text-sm text-white/80 mb-2">
                          {t.tradeLabel} <span className="text-gold-500">*</span>
                        </label>
                        <select
                          id="contact-trade"
                          name="trade"
                          value={formData.trade}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          {TRADE_OPTIONS[lang].map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-wine-800">{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* State (contractor) */}
                      <div>
                        <label htmlFor="contact-state" className="block text-sm text-white/80 mb-2">
                          {t.stateLabel} <span className="text-gold-500">*</span>
                        </label>
                        <select
                          id="contact-state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        >
                          <option value="" className="bg-wine-800">—</option>
                          {US_STATES.map((s) => (
                            <option key={s.abbr} value={s.name} className="bg-wine-800">{s.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* City (contractor) */}
                      <div>
                        <label htmlFor="contact-city" className="block text-sm text-white/80 mb-2">
                          {t.cityLabel}
                        </label>
                        <input
                          id="contact-city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder={t.cityPlaceholder}
                          autoComplete="address-level2"
                          className={inputClass}
                        />
                      </div>

                      {/* Years of experience (contractor) */}
                      <div>
                        <label htmlFor="contact-years" className="block text-sm text-white/80 mb-2">
                          {t.yearsLabel}
                        </label>
                        <input
                          id="contact-years"
                          type="number"
                          name="years"
                          min={0}
                          max={80}
                          value={formData.years}
                          onChange={handleChange}
                          placeholder="10"
                          className={inputClass}
                        />
                      </div>

                      {/* License (contractor) */}
                      <div>
                        <label htmlFor="contact-license" className="block text-sm text-white/80 mb-2">
                          {t.licenseLabel} <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="contact-license"
                          type="text"
                          name="license"
                          value={formData.license}
                          onChange={handleChange}
                          required
                          placeholder={t.licensePlaceholder}
                          className={inputClass}
                        />
                      </div>

                      {/* Website (contractor) */}
                      <div>
                        <label htmlFor="contact-website" className="block text-sm text-white/80 mb-2">
                          {t.websiteLabel}
                        </label>
                        <input
                          id="contact-website"
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder={t.websitePlaceholder}
                          autoComplete="url"
                          className={inputClass}
                        />
                      </div>

                      {/* Password (contractor) */}
                      <div>
                        <label htmlFor="contact-password" className="block text-sm text-white/80 mb-2">
                          {t.passwordLabel} <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="contact-password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                          placeholder={t.passwordPlaceholder}
                          autoComplete="new-password"
                          className={inputClass}
                        />
                      </div>

                      {/* Confirm password (contractor) */}
                      <div>
                        <label htmlFor="contact-confirm" className="block text-sm text-white/80 mb-2">
                          {t.confirmLabel} <span className="text-gold-500">*</span>
                        </label>
                        <input
                          id="contact-confirm"
                          type="password"
                          name="confirm"
                          value={formData.confirm}
                          onChange={handleChange}
                          required
                          minLength={6}
                          autoComplete="new-password"
                          className={inputClass}
                        />
                      </div>

                      {/* Services offered (contractor, full width) */}
                      <div className="md:col-span-2">
                        <span className="block text-sm text-white/80 mb-2">{t.servicesLabel}</span>
                        <div className="flex flex-wrap gap-2">
                          {TRADE_OPTIONS[lang].map((opt) => {
                            const active = services.includes(opt.value);
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => toggleService(opt.value)}
                                aria-pressed={active}
                                className={`px-4 py-2 rounded-sm text-sm border transition-all duration-300 ${
                                  active
                                    ? 'bg-gold-500 border-gold-500 text-white'
                                    : 'bg-white/5 border-white/20 text-white/70 hover:border-gold-500/50'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-sm text-white/80 mb-2">
                      {mode === 'contractor' ? t.aboutLabel : form.messageLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder={mode === 'contractor' ? t.aboutPlaceholder : form.messagePlaceholder}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Consentimiento legal */}
                  {mode === 'homeowner' ? (
                    <label className="flex items-start gap-3 cursor-pointer text-left">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
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
                  ) : (
                    <label className="flex items-start gap-3 cursor-pointer text-left">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#d2a855] shrink-0"
                      />
                      <span className="text-xs text-white/60 leading-relaxed">
                        {t.consentBefore}{' '}
                        <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline underline-offset-2">
                          {t.consentLink}
                        </a>{' '}
                        {t.termsAfter}
                      </span>
                    </label>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {form.submittingText}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {mode === 'homeowner' ? form.submitText : t.modeContractor}
                      </>
                    )}
                  </button>

                  {contactFormConfig.privacyNotice && (
                    <p className="text-xs text-white/50 text-center">
                      {contactFormConfig.privacyNotice}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
