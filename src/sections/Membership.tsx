import { BadgeCheck, ArrowRight, XCircle } from 'lucide-react';
import { useLang } from '../lib/use-lang';

// Sección de membresía mensual para contratistas: $100/mes por hasta 3
// trabajos firmados, sin comisión en esos trabajos. Coexiste con el plan
// gratuito de 8% de comisión por trabajo.

const T = {
  en: {
    eyebrow: 'MEMBERSHIP',
    title: '3 jobs a month. One flat fee.',
    subtitle:
      'Prefer predictable costs? The monthly membership covers up to 3 signed jobs for a flat $100 — no commission on those jobs.',
    planName: 'Monthly Membership',
    price: '$100',
    per: '/month',
    features: [
      'Up to 3 signed jobs per month',
      '$0 commission on membership jobs',
      'Verified profile included',
      'Cancel anytime',
    ],
    cta: 'Become a member',
    note: 'Rather pay per job? The free plan with 8% commission per signed job is still available.',
  },
  es: {
    eyebrow: 'MEMBRESÍA',
    title: '3 trabajos al mes. Una tarifa fija.',
    subtitle:
      '¿Prefieres costos predecibles? La membresía mensual cubre hasta 3 trabajos firmados por $100 fijos — sin comisión en esos trabajos.',
    planName: 'Membresía mensual',
    price: '$100',
    per: '/mes',
    features: [
      'Hasta 3 trabajos firmados por mes',
      'Comisión de $0 en trabajos de la membresía',
      'Perfil verificado incluido',
      'Cancela cuando quieras',
    ],
    cta: 'Quiero la membresía',
    note: '¿Prefieres pagar por trabajo? El plan gratis con 8% de comisión por trabajo firmado sigue disponible.',
  },
  pt: {
    eyebrow: 'ASSINATURA',
    title: '3 trabalhos por mês. Uma taxa fixa.',
    subtitle:
      'Prefere custos previsíveis? A assinatura mensal cobre até 3 trabalhos fechados por US$ 100 fixos — sem comissão nesses trabalhos.',
    planName: 'Assinatura mensal',
    price: 'US$ 100',
    per: '/mês',
    features: [
      'Até 3 trabalhos fechados por mês',
      'US$ 0 de comissão nos trabalhos da assinatura',
      'Perfil verificado incluído',
      'Cancele quando quiser',
    ],
    cta: 'Quero a assinatura',
    note: 'Prefere pagar por trabalho? O plano grátis com 8% de comissão por trabalho fechado continua disponível.',
  },
} as const;

export function Membership() {
  const lang = useLang();
  const t = T[lang];

  const goContractor = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-contractor-form')), 400);
  };

  return (
    <section id="membership" className="section-padding relative">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em]">{t.eyebrow}</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white mt-4 mb-4">{t.title}</h2>
          <p className="text-white/60 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-wine-800/60 border border-gold-500/40 rounded-lg p-8 text-center hover:border-gold-500 transition-all duration-300">
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.2em] mb-4">
              <BadgeCheck className="w-4 h-4" />
              {t.planName}
            </div>
            <div className="mb-6">
              <span className="font-serif text-5xl text-white">{t.price}</span>
              <span className="text-white/50">{t.per}</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/70 text-sm">
                  <BadgeCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={goContractor}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold rounded-lg px-6 py-3 transition-all"
            >
              {t.cta} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="flex items-start justify-center gap-2 text-white/40 text-xs mt-6">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {t.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
