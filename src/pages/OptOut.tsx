import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import { api } from '../lib/api';
import { getLanguage, type Lang } from '../i18n';

// -----------------------------------------------------------------------------
// Página de baja / revocación: /opt-out y /unsubscribe
// - /opt-out: revoca el consentimiento de contacto (TCPA: equivale a
//   responder STOP) y da de baja el correo.
// - /unsubscribe: baja de correo (CAN-SPAM). Pre-llena el correo desde
//   ?email= (el enlace de cada correo) y confirma con un clic.
// La baja de correo SUPRIME futuros envíos (ver server/mailer.js).
// -----------------------------------------------------------------------------
const T = {
  en: {
    title: 'Opt out',
    intro: 'Use this page to stop calls/texts about your project and/or stop emails from RemodelaUSA. Fill in the email or phone you used in your request.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    revoke: 'Revoke contact consent + unsubscribe email',
    unsubscribeOnly: 'Unsubscribe email only',
    success: 'Done. We recorded your opt-out: we will no longer call or text you about your project, and we suppressed future emails to this address.',
    unsubSuccess: 'Done. We unsubscribed this email address: you will not receive more emails from RemodelaUSA.',
    error: 'Something went wrong. Please try again or email hello@remodelausa.com.',
    needOne: 'Enter your email or phone.',
    note: 'If you later submit a new request with fresh consent, that new consent applies to the new request only.',
    back: 'Back to home',
  },
  es: {
    title: 'Darse de baja',
    intro: 'Usa esta página para dejar de recibir llamadas/mensajes sobre tu proyecto y/o dejar de recibir correos de RemodelaUSA. Escribe el correo o teléfono que usaste en tu solicitud.',
    emailLabel: 'Correo',
    phoneLabel: 'Teléfono',
    revoke: 'Revocar consentimiento de contacto + dar de baja el correo',
    unsubscribeOnly: 'Dar de baja solo el correo',
    success: 'Listo. Registramos tu baja: ya no te llamaremos ni te escribiremos sobre tu proyecto, y suprimimos futuros correos a esta dirección.',
    unsubSuccess: 'Listo. Dimos de baja esta dirección de correo: no recibirás más correos de RemodelaUSA.',
    error: 'Hubo un problema. Intenta de nuevo o escribe a hola@remodelausa.com.',
    needOne: 'Escribe tu correo o teléfono.',
    note: 'Si después envías una solicitud nueva con un consentimiento nuevo, ese consentimiento nuevo aplica solo a la solicitud nueva.',
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Cancelar',
    intro: 'Use esta página para parar de receber ligações/mensagens sobre o seu projeto e/ou parar de receber e-mails da RemodelaUSA. Informe o e-mail ou telefone usado na sua solicitação.',
    emailLabel: 'E-mail',
    phoneLabel: 'Telefone',
    revoke: 'Revogar consentimento de contato + cancelar e-mail',
    unsubscribeOnly: 'Cancelar apenas o e-mail',
    success: 'Pronto. Registramos seu cancelamento: não ligaremos nem enviaremos mensagens sobre o seu projeto, e suprimimos futuros e-mails para este endereço.',
    unsubSuccess: 'Pronto. Cancelamos este endereço de e-mail: você não receberá mais e-mails da RemodelaUSA.',
    error: 'Ocorreu um problema. Tente novamente ou escreva para ola@remodelausa.com.',
    needOne: 'Informe seu e-mail ou telefone.',
    note: 'Se depois você enviar uma nova solicitação com um novo consentimento, esse novo consentimento vale apenas para a nova solicitação.',
    back: 'Voltar ao início',
  },
} as const;

export default function OptOut() {
  const lang = getLanguage() as Lang;
  const t = T[lang] ?? T.en;
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'unsub-success' | 'error' | 'need-one'>('idle');
  const [busy, setBusy] = useState(false);
  const done = params.get('done') === '1';

  useEffect(() => {
    // Llegada desde el enlace de baja del correo: la baja ya se registró
    // en el servidor (GET /api/unsubscribe); mostramos la confirmación.
    if (done && params.get('email')) setStatus('unsub-success');
  }, [done, params]);

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors';

  const doRevoke = async () => {
    if (!email.trim() && !phone.trim()) { setStatus('need-one'); return; }
    setBusy(true);
    try {
      await api.revokeConsent({ email: email.trim(), phone: phone.trim(), channel: 'all' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
    setBusy(false);
  };

  const doUnsubscribe = async () => {
    if (!email.trim()) { setStatus('need-one'); return; }
    setBusy(true);
    try {
      await api.unsubscribe(email.trim());
      setStatus('unsub-success');
    } catch {
      setStatus('error');
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-gold-400 hover:text-gold-300 font-serif text-lg mr-4">RemodelaUSA</Link>
          <span className="text-white/90">{t.title}</span>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl lg:text-4xl mb-4">{t.title}</h1>
        <p className="text-white/70 leading-relaxed mb-8">{t.intro}</p>

        {status === 'success' || status === 'unsub-success' ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 flex gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-white leading-relaxed">{status === 'success' ? t.success : t.unsubSuccess}</p>
              <p className="text-white/50 text-sm mt-3">{t.note}</p>
              <Link to="/" className="inline-block mt-4 text-gold-400 hover:text-gold-300 underline underline-offset-4 text-sm">{t.back} →</Link>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-5">
            <div>
              <label htmlFor="optout-email" className="block text-sm text-white/80 mb-2">{t.emailLabel}</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                <input id="optout-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label htmlFor="optout-phone" className="block text-sm text-white/80 mb-2">{t.phoneLabel}</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
                <input id="optout-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+1 (___) ___-____" />
              </div>
            </div>
            {(status === 'error' || status === 'need-one') && (
              <p className="text-sm text-red-400">{status === 'error' ? t.error : t.needOne}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={doRevoke} disabled={busy} className="btn-primary rounded-sm disabled:opacity-50">{t.revoke}</button>
              <button onClick={doUnsubscribe} disabled={busy} className="px-6 py-3 border border-white/20 rounded-sm text-white/80 hover:border-gold-500/50 hover:text-gold-400 transition-colors text-sm disabled:opacity-50">{t.unsubscribeOnly}</button>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">{t.note}</p>
          </div>
        )}
      </main>
    </div>
  );
}
