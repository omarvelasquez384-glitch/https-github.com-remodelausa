import { BadgeCheck, ArrowRight, XCircle } from 'lucide-react';
import { useLang } from '../lib/use-lang';

// Sección de membresía mensual para contratistas: modelo híbrido — primer lead
// GRATIS, luego membresía de $150/mes; primer mes sin comisión y 8% por trabajo
// firmado a partir del segundo mes.

const T = {
  en: {
    eyebrow: 'MEMBERSHIP',
    title: 'Your first lead is free. Then grow with a flat membership.',
    subtitle:
      'Try RemodelaUSA with zero risk: your first client lead is free. To keep receiving leads, the membership is $150/month — first month with no commission, then 8% only on jobs you sign through us.',
    planName: 'Monthly Membership',
    price: '$150',
    per: '/month',
    features: [
      'First lead completely FREE',
      'Unlimited client leads in your area',
      'First month: $0 commission',
      'From month 2: 8% only on signed jobs',
      'Verified profile included',
      'Cancel anytime',
    ],
    cta: 'Become a member',
    note: 'No permanence: if you do not renew, you simply stop receiving leads.',
  },
  es: {
    eyebrow: 'MEMBRESÍA',
    title: 'Tu primer lead es gratis. Luego crece con una tarifa fija.',
    subtitle:
      'Prueba RemodelaUSA sin riesgo: tu primer lead de cliente es gratis. Para seguir recibiendo leads, la membresía es de $150/mes — primer mes sin comisión y desde el segundo solo 8% de los trabajos que firmes con nosotros.',
    planName: 'Membresía mensual',
    price: '$150',
    per: '/mes',
    features: [
      'Primer lead completamente GRATIS',
      'Leads ilimitados de clientes de tu zona',
      'Primer mes: comisión de $0',
      'Desde el 2.º mes: 8% solo de trabajos firmados',
      'Perfil verificado incluido',
      'Cancela cuando quieras',
    ],
    cta: 'Quiero la membresía',
    note: 'Sin permanencia: si no renuevas, solo dejas de recibir leads.',
  },
  pt: {
    eyebrow: 'ASSINATURA',
    title: 'Seu primeiro lead é grátis. Depois cresça com uma taxa fixa.',
    subtitle:
      'Teste a RemodelaUSA sem risco: seu primeiro lead de cliente é grátis. Para continuar recebendo leads, a assinatura é de US$ 150/mês — primeiro mês sem comissão e, a partir do segundo, só 8% dos trabalhos fechados conosco.',
    planName: 'Assinatura mensal',
    price: 'US$ 150',
    per: '/mês',
    features: [
      'Primeiro lead completamente GRÁTIS',
      'Leads ilimitados de clientes da sua região',
      'Primeiro mês: comissão de US$ 0',
      'Do 2.º mês: 8% apenas de trabalhos fechados',
      'Perfil verificado incluído',
      'Cancele quando quiser',
    ],
    cta: 'Quero a assinatura',
    note: 'Sem permanência: se não renovar, você apenas para de receber leads.',
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
