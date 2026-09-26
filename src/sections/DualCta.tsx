import { Home, HardHat, ArrowRight } from 'lucide-react';
import { useLang } from '../lib/use-lang';

// Banda de doble CTA (patrón Networx): monetiza ambos lados del mercado en
// una sola vista. La tarjeta de contratista abre el formulario en modo
// contratista mediante el evento que escucha ContactForm.

const T = {
  en: {
    subtitle: 'FOR HOMEOWNERS & CONTRACTORS',
    homeownerTitle: 'Ready to remodel your home?',
    homeownerText: 'Get up to 4 free quotes from verified contractors in your area within 24 hours.',
    homeownerCta: 'Get my free quotes',
    contractorTitle: 'Are you a contractor?',
    contractorText: 'Join our network and receive client requests in your area. No monthly fees — you only pay a commission when you sign the job.',
    contractorCta: 'I want more jobs',
  },
  es: {
    subtitle: 'PARA DUEÑOS DE CASA Y CONTRATISTAS',
    homeownerTitle: '¿Listo para remodelar tu hogar?',
    homeownerText: 'Recibe hasta 4 cotizaciones gratis de contratistas verificados de tu zona en menos de 24 horas.',
    homeownerCta: 'Cotizar gratis',
    contractorTitle: '¿Eres contratista?',
    contractorText: 'Únete a la red y recibe solicitudes de clientes en tu zona. Sin cuotas mensuales — solo pagas comisión cuando firmas el trabajo.',
    contractorCta: 'Quiero más trabajos',
  },
  pt: {
    subtitle: 'PARA PROPRIETÁRIOS E CONSTRUTORAS',
    homeownerTitle: 'Pronto para reformar sua casa?',
    homeownerText: 'Receba até 4 orçamentos grátis de construtoras verificadas da sua região em menos de 24 horas.',
    homeownerCta: 'Pedir orçamento grátis',
    contractorTitle: 'Você é uma construtora?',
    contractorText: 'Junte-se à rede e receba solicitações de clientes da sua região. Sem mensalidades — você só paga comissão quando fecha o trabalho.',
    contractorCta: 'Quero mais trabalhos',
  },
} as const;

export function DualCta() {
  const lang = useLang();
  const t = T[lang];

  const goHomeowner = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  const goContractor = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-contractor-form')), 400);
  };

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em]">{t.subtitle}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Dueño de casa */}
          <button
            onClick={goHomeowner}
            className="group text-left bg-white/5 border border-white/10 rounded-lg p-8 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-5">
              <Home className="w-6 h-6 text-gold-500" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-3">{t.homeownerTitle}</h3>
            <p className="text-white/60 text-sm mb-6">{t.homeownerText}</p>
            <span className="inline-flex items-center gap-2 text-gold-400 group-hover:gap-3 transition-all">
              {t.homeownerCta} <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          {/* Contratista */}
          <button
            onClick={goContractor}
            className="group text-left bg-wine-800/60 border border-gold-500/30 rounded-lg p-8 hover:border-gold-500 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center mb-5">
              <HardHat className="w-6 h-6 text-gold-400" />
            </div>
            <h3 className="font-serif text-2xl text-white mb-3">{t.contractorTitle}</h3>
            <p className="text-white/60 text-sm mb-6">{t.contractorText}</p>
            <span className="inline-flex items-center gap-2 text-gold-400 group-hover:gap-3 transition-all">
              {t.contractorCta} <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
