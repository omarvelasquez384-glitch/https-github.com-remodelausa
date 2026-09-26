import { ClipboardList, Users, BadgeCheck } from 'lucide-react';
import { useLang } from '../lib/use-lang';

// Sección «Cómo funciona» en 3 pasos (patrón Networx/Angi): baja la ansiedad
// del primer visitante y lo empuja al formulario.

const T = {
  en: {
    scriptText: 'Simple, fast and free',
    subtitle: 'HOW IT WORKS',
    mainTitle: 'Your project in 3 easy steps',
    steps: [
      {
        icon: 'ClipboardList',
        title: 'Tell us about your project',
        description: 'Answer a few questions about your remodel — what, where and when. Takes less than 2 minutes.',
      },
      {
        icon: 'Users',
        title: 'Get matched with verified pros',
        description: 'We send your request to up to 4 licensed, verified contractors in your area. They contact you within 24 hours with free quotes.',
      },
      {
        icon: 'BadgeCheck',
        title: 'Hire with confidence',
        description: 'Compare quotes, check reviews and photos, and choose the pro you trust. Free for homeowners — contractors only pay when they sign the job.',
      },
    ],
    cta: 'Start my project',
  },
  es: {
    scriptText: 'Simple, rápido y gratis',
    subtitle: 'CÓMO FUNCIONA',
    mainTitle: 'Tu proyecto en 3 pasos',
    steps: [
      {
        icon: 'ClipboardList',
        title: 'Cuéntanos tu proyecto',
        description: 'Responde unas preguntas sobre tu remodelación — qué, dónde y cuándo. Toma menos de 2 minutos.',
      },
      {
        icon: 'Users',
        title: 'Recibe pros verificados',
        description: 'Enviamos tu solicitud a hasta 4 contratistas con licencia y verificados de tu zona. Te contactan en menos de 24 horas con cotizaciones gratis.',
      },
      {
        icon: 'BadgeCheck',
        title: 'Contrata con confianza',
        description: 'Compara cotizaciones, reseñas y fotos, y elige al profesional de tu confianza. Gratis para ti — el contratista solo paga cuando firma el trabajo.',
      },
    ],
    cta: 'Empezar mi proyecto',
  },
  pt: {
    scriptText: 'Simples, rápido e grátis',
    subtitle: 'COMO FUNCIONA',
    mainTitle: 'Seu projeto em 3 passos',
    steps: [
      {
        icon: 'ClipboardList',
        title: 'Conte-nos sobre o projeto',
        description: 'Responda algumas perguntas sobre sua reforma — o quê, onde e quando. Leva menos de 2 minutos.',
      },
      {
        icon: 'Users',
        title: 'Receba profissionais verificados',
        description: 'Enviamos sua solicitação para até 4 construtoras licenciadas e verificadas da sua região. Elas entram em contato em menos de 24 horas com orçamentos grátis.',
      },
      {
        icon: 'BadgeCheck',
        title: 'Contrate com confiança',
        description: 'Compare orçamentos, avaliações e fotos, e escolha o profissional de sua confiança. Grátis para você — a construtora só paga quando fecha o trabalho.',
      },
    ],
    cta: 'Começar meu projeto',
  },
} as const;

const iconMap = { ClipboardList, Users, BadgeCheck };

export function HowItWorks() {
  const lang = useLang();
  const t = T[lang];

  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="font-script text-3xl text-gold-400 block mb-2">{t.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">{t.subtitle}</span>
          <h2 className="font-serif text-h1 text-white">{t.mainTitle}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Línea conectora (desktop) */}
          <div className="hidden md:block absolute top-10 left-[18%] right-[18%] border-t border-dashed border-gold-500/30" aria-hidden="true" />

          {t.steps.map((step, i) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            return (
              <div key={i} className="relative text-center px-4">
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-full bg-wine-800 border-2 border-gold-500/40 flex items-center justify-center relative z-10">
                    <Icon className="w-8 h-8 text-gold-500" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gold-500 text-white text-sm font-serif flex items-center justify-center z-20">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-serif text-h5 text-white mb-3">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary rounded-sm"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
