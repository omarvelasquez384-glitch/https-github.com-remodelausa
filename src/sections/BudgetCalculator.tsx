import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Bath, ChefHat, Paintbrush, Layers, Home, Calculator, Info } from 'lucide-react';
import { getLanguage, type Lang } from '../i18n';

// -----------------------------------------------------------------------------
// Precios (promedios de mercado en EE. UU., USD) — independientes del idioma
// -----------------------------------------------------------------------------
type Finish = 'economico' | 'estandar' | 'premium';

interface ExtraOption {
  id: string;
  price?: number;      // cargo fijo en USD
  perSqm?: number;     // cargo adicional por m²
}

interface ProjectType {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  minSize: number;
  maxSize: number;
  defaultSize: number;
  base: number;
  rates: Record<Finish, number>;
  extras: ExtraOption[];
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'bano',
    icon: Bath,
    minSize: 2,
    maxSize: 15,
    defaultSize: 5,
    base: 1200,
    rates: { economico: 450, estandar: 700, premium: 1100 },
    extras: [
      { id: 'regadera', price: 450 },
      { id: 'doble-lavabo', price: 380 },
      { id: 'tina', price: 950 },
      { id: 'azulejo', perSqm: 5 },
    ],
  },
  {
    id: 'cocina',
    icon: ChefHat,
    minSize: 6,
    maxSize: 40,
    defaultSize: 12,
    base: 2500,
    rates: { economico: 350, estandar: 600, premium: 950 },
    extras: [
      { id: 'isla', price: 2800 },
      { id: 'gabinetes', price: 3500 },
      { id: 'cuarzo', price: 2200 },
      { id: 'backsplash', price: 650 },
    ],
  },
  {
    id: 'pintura',
    icon: Paintbrush,
    minSize: 50,
    maxSize: 500,
    defaultSize: 150,
    base: 180,
    rates: { economico: 2.2, estandar: 3.5, premium: 5.5 },
    extras: [
      { id: 'techos', perSqm: 0.8 },
      { id: 'exterior', perSqm: 1.2 },
      { id: 'imprimacion', perSqm: 0.5 },
    ],
  },
  {
    id: 'concreto',
    icon: Layers,
    minSize: 40,
    maxSize: 400,
    defaultSize: 150,
    base: 500,
    rates: { economico: 55, estandar: 85, premium: 130 },
    extras: [
      { id: 'estampado', perSqm: 4 },
      { id: 'color', perSqm: 2.5 },
      { id: 'sellado', perSqm: 1.5 },
    ],
  },
  {
    id: 'remodelacion',
    icon: Home,
    minSize: 50,
    maxSize: 400,
    defaultSize: 150,
    base: 4000,
    rates: { economico: 380, estandar: 650, premium: 1050 },
    extras: [
      { id: 'ampliacion', perSqm: 250 },
      { id: 'acabados', price: 9500 },
      { id: 'diseno', price: 3200 },
    ],
  },
];

// -----------------------------------------------------------------------------
// Textos de la calculadora por idioma
// -----------------------------------------------------------------------------
interface CalcStrings {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  intro: string;
  projectTypeLabel: string;
  finishLabel: string;
  finishes: Record<Finish, string>;
  extrasLabel: string;
  resultTitle: string;
  prepLabel: string;
  extrasSelectedLabel: string;
  finalNoteSuffix: string;
  cta: string;
  types: Record<string, { name: string; sizeLabel: string; note: string }>;
  extras: Record<string, string>;
}

const STRINGS: Record<Lang, CalcStrings> = {
  en: {
    scriptText: 'Calculate your budget',
    subtitle: 'Estimate in seconds',
    mainTitle: 'What would your project cost?',
    intro:
      'Move the controls and get a price range based on real U.S. remodeling averages. Then receive exact quotes from verified contractors.',
    projectTypeLabel: 'Project type',
    finishLabel: 'Finish level',
    finishes: { economico: 'Budget', estandar: 'Standard', premium: 'Premium' },
    extrasLabel: 'Optional extras',
    resultTitle: 'Estimated budget',
    prepLabel: 'Preparation and base',
    extrasSelectedLabel: 'Selected extras',
    finalNoteSuffix: 'The final price depends on your location, the current condition of the space, and the materials you choose.',
    cta: 'Get real quotes for free',
    types: {
      bano: {
        name: 'Bathroom',
        sizeLabel: 'Bathroom size',
        note: 'Includes demolition, basic plumbing, installation, and finishes.',
      },
      cocina: {
        name: 'Kitchen',
        sizeLabel: 'Kitchen size',
        note: 'Includes labor, basic electrical and gas hookups.',
      },
      pintura: {
        name: 'Painting',
        sizeLabel: 'Area to paint (walls)',
        note: 'Two coats of premium paint, furniture protection, and final cleanup.',
      },
      concreto: {
        name: 'Concrete',
        sizeLabel: 'Concrete area (driveway / patio)',
        note: 'Includes excavation, formwork, steel reinforcement, and pouring.',
      },
      remodelacion: {
        name: 'Remodel',
        sizeLabel: 'Home area',
        note: 'Full project with on-site supervision and permit handling.',
      },
    },
    extras: {
      regadera: 'New rainfall shower',
      'doble-lavabo': 'Double vanity',
      tina: 'Freestanding tub',
      azulejo: 'Floor-to-ceiling tile',
      isla: 'Center island with countertop',
      gabinetes: 'Custom cabinets',
      cuarzo: 'Quartz countertops',
      backsplash: 'Tile backsplash',
      techos: 'Include ceilings',
      exterior: 'Exterior painting',
      imprimacion: 'Primer and wall repair',
      estampado: 'Stamped finish',
      color: 'Integral color',
      sellado: 'Heavy-duty protective sealer',
      ampliacion: 'Space addition',
      acabados: 'Luxury finishes',
      diseno: 'Architectural design included',
    },
  },
  es: {
    scriptText: 'Calcula tu presupuesto',
    subtitle: 'Estimado en segundos',
    mainTitle: '¿Cuánto costaría tu proyecto?',
    intro:
      'Mueve los controles y obtén un rango de precio basado en promedios reales de remodelación en Estados Unidos. Después recibe cotizaciones exactas de contratistas verificados.',
    projectTypeLabel: 'Tipo de proyecto',
    finishLabel: 'Nivel de acabado',
    finishes: { economico: 'Económico', estandar: 'Estándar', premium: 'Premium' },
    extrasLabel: 'Extras opcionales',
    resultTitle: 'Presupuesto estimado',
    prepLabel: 'Preparación y base',
    extrasSelectedLabel: 'Extras seleccionados',
    finalNoteSuffix: 'El precio final depende de la ubicación, el estado actual del espacio y los materiales elegidos.',
    cta: 'Recibir cotizaciones reales gratis',
    types: {
      bano: {
        name: 'Baño',
        sizeLabel: 'Tamaño del baño',
        note: 'Incluye demolición, plomería básica, instalación y acabados.',
      },
      cocina: {
        name: 'Cocina',
        sizeLabel: 'Tamaño de la cocina',
        note: 'Incluye mano de obra, instalación eléctrica y de gas básica.',
      },
      pintura: {
        name: 'Pintura',
        sizeLabel: 'Área a pintar (paredes)',
        note: 'Dos capas de pintura premium, protección de muebles y limpieza final.',
      },
      concreto: {
        name: 'Concreto',
        sizeLabel: 'Área de concreto (driveway / patio)',
        note: 'Incluye excavación, encofrado, refuerzo de acero y colado.',
      },
      remodelacion: {
        name: 'Remodelación',
        sizeLabel: 'Área de la casa',
        note: 'Proyecto integral con supervisión de obra y gestión de permisos.',
      },
    },
    extras: {
      regadera: 'Regadera tipo lluvia nueva',
      'doble-lavabo': 'Doble lavabo',
      tina: 'Tina exenta',
      azulejo: 'Azulejo piso a techo',
      isla: 'Isla central con cubierta',
      gabinetes: 'Gabinetes a medida',
      cuarzo: 'Cubiertas de cuarzo',
      backsplash: 'Backsplash de azulejo',
      techos: 'Incluir techos',
      exterior: 'Pintura exterior',
      imprimacion: 'Imprimación y reparación de muros',
      estampado: 'Acabado estampado',
      color: 'Color integral',
      sellado: 'Sellado protector reforzado',
      ampliacion: 'Ampliación de espacios',
      acabados: 'Acabados de lujo',
      diseno: 'Diseño arquitectónico incluido',
    },
  },
  pt: {
    scriptText: 'Calcule seu orçamento',
    subtitle: 'Estimativa em segundos',
    mainTitle: 'Quanto custaria seu projeto?',
    intro:
      'Mova os controles e obtenha uma faixa de preço baseada em médias reais de reforma nos Estados Unidos. Depois receba orçamentos exatos de construtoras verificadas.',
    projectTypeLabel: 'Tipo de projeto',
    finishLabel: 'Nível de acabamento',
    finishes: { economico: 'Econômico', estandar: 'Padrão', premium: 'Premium' },
    extrasLabel: 'Extras opcionais',
    resultTitle: 'Orçamento estimado',
    prepLabel: 'Preparação e base',
    extrasSelectedLabel: 'Extras selecionados',
    finalNoteSuffix: 'O preço final depende da localização, do estado atual do espaço e dos materiais escolhidos.',
    cta: 'Receber orçamentos reais grátis',
    types: {
      bano: {
        name: 'Banheiro',
        sizeLabel: 'Tamanho do banheiro',
        note: 'Inclui demolição, encanamento básico, instalação e acabamentos.',
      },
      cocina: {
        name: 'Cozinha',
        sizeLabel: 'Tamanho da cozinha',
        note: 'Inclui mão de obra, instalação elétrica e de gás básica.',
      },
      pintura: {
        name: 'Pintura',
        sizeLabel: 'Área a pintar (paredes)',
        note: 'Duas demãos de tinta premium, proteção de móveis e limpeza final.',
      },
      concreto: {
        name: 'Concreto',
        sizeLabel: 'Área de concreto (garagem / pátio)',
        note: 'Inclui escavação, forma, armação de aço e concretagem.',
      },
      remodelacion: {
        name: 'Reforma',
        sizeLabel: 'Área da casa',
        note: 'Projeto integral com supervisão de obra e gestão de alvarás.',
      },
    },
    extras: {
      regadera: 'Chuveiro tipo chuva novo',
      'doble-lavabo': 'Dupla cuba',
      tina: 'Banheira exenta',
      azulejo: 'Azulejo do piso ao teto',
      isla: 'Ilha central com bancada',
      gabinetes: 'Armários sob medida',
      cuarzo: 'Bancadas de quartzo',
      backsplash: 'Revestimento de azulejo',
      techos: 'Incluir tetos',
      exterior: 'Pintura externa',
      imprimacion: 'Selador e reparo de paredes',
      estampado: 'Acabamento estampado',
      color: 'Cor integral',
      sellado: 'Selagem protetora reforçada',
      ampliacion: 'Ampliação de espaços',
      acabados: 'Acabamentos de luxo',
      diseno: 'Projeto arquitetônico incluído',
    },
  },
};

const FINISH_IDS: Finish[] = ['economico', 'estandar', 'premium'];

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// Número animado suave al cambiar el estimado
function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(target);
  const prev = useRef(target);

  useEffect(() => {
    const from = prev.current;
    const to = target;
    prev.current = target;
    if (from === to) return;

    const startTime = performance.now();
    const duration = 500;
    let raf: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}

export function BudgetCalculator() {
  const lang = getLanguage() as Lang;
  const t = STRINGS[lang] ?? STRINGS.en;

  const [activeType, setActiveType] = useState(0);
  const [size, setSize] = useState(PROJECT_TYPES[0].defaultSize);
  const [finish, setFinish] = useState<Finish>('estandar');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animaciones de entrada al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const project = PROJECT_TYPES[activeType];
  const typeStrings = t.types[project.id];

  const switchType = (index: number) => {
    setActiveType(index);
    setSize(PROJECT_TYPES[index].defaultSize);
    setSelectedExtras([]);
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const { low, high, extrasTotal } = (() => {
    const workCost = size * project.rates[finish];
    let extrasSum = 0;
    for (const extra of project.extras) {
      if (!selectedExtras.includes(extra.id)) continue;
      extrasSum += extra.price ?? 0;
      if (extra.perSqm) extrasSum += extra.perSqm * size;
    }
    const total = project.base + workCost + extrasSum;
    return {
      low: Math.round(total * 0.9 / 50) * 50,
      high: Math.round(total * 1.15 / 50) * 50,
      extrasTotal: extrasSum,
    };
  })();

  const animatedLow = useAnimatedNumber(low);
  const animatedHigh = useAnimatedNumber(high);

  return (
    <section id="calculadora" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Acento de fondo */}
      <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-gold-500/5 to-transparent" />

      <div className="container-custom relative">
        {/* Encabezado */}
        <div className="fade-up text-center mb-16">
          <span className="font-script text-3xl text-gold-400 block mb-2">{t.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
            {t.subtitle}
          </span>
          <h2 className="font-serif text-h1 text-white">{t.mainTitle}</h2>
          <p className="text-white/70 max-w-2xl mx-auto mt-4">{t.intro}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Controles */}
          <div className="slide-in-left space-y-8">
            {/* Tipo de proyecto */}
            <div className="fade-up">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">{t.projectTypeLabel}</p>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((type, i) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => switchType(i)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm transition-all duration-300 ${
                        i === activeType
                          ? 'bg-gold-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t.types[type.id].name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tamaño */}
            <div className="fade-up" style={{ transitionDelay: '0.05s' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/60 uppercase tracking-wider">{typeStrings.sizeLabel}</p>
                <span className="font-serif text-xl text-gold-500 tabular-nums">
                  {size} m²
                </span>
              </div>
              <input
                type="range"
                min={project.minSize}
                max={project.maxSize}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-[#d2a855] cursor-pointer"
                aria-label={typeStrings.sizeLabel}
              />
              <div className="flex justify-between text-[11px] text-white/40 mt-1">
                <span>{project.minSize} m²</span>
                <span>{project.maxSize} m²</span>
              </div>
            </div>

            {/* Nivel de acabado */}
            <div className="fade-up" style={{ transitionDelay: '0.1s' }}>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">{t.finishLabel}</p>
              <div className="flex gap-2">
                {FINISH_IDS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`flex-1 px-4 py-2.5 rounded-sm text-sm transition-all duration-300 ${
                      finish === f
                        ? 'bg-gold-500 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {t.finishes[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            {project.extras.length > 0 && (
              <div className="fade-up" style={{ transitionDelay: '0.15s' }}>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-3">{t.extrasLabel}</p>
                <div className="space-y-2">
                  {project.extras.map((extra) => (
                    <label
                      key={extra.id}
                      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-sm border cursor-pointer transition-all duration-300 ${
                        selectedExtras.includes(extra.id)
                          ? 'border-gold-500/50 bg-gold-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                          className="accent-[#d2a855] w-4 h-4"
                        />
                        <span className="text-sm text-white/85">{t.extras[extra.id]}</span>
                      </span>
                      <span className="text-sm text-gold-400 whitespace-nowrap">
                        {extra.perSqm
                          ? `+${fmt.format(extra.perSqm)}/m²`
                          : `+${fmt.format(extra.price ?? 0)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resultado */}
          <div className="slide-in-right lg:sticky lg:top-28">
            <div className="bg-white/5 rounded-lg border border-gold-500/20 p-8 lg:p-10 relative overflow-hidden">
              {/* Resplandor decorativo */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-gold-500" />
                <h3 className="font-serif text-h4 text-white">{t.resultTitle}</h3>
              </div>

              <div className="mb-2 text-sm text-white/60">
                {typeStrings.name} · {size} m² · {t.finishes[finish]}
              </div>

              <div className="font-serif text-4xl lg:text-5xl text-gold-500 leading-tight tabular-nums mb-6">
                {fmt.format(Math.round(animatedLow / 50) * 50)}
                <span className="text-white/40 mx-2">—</span>
                {fmt.format(Math.round(animatedHigh / 50) * 50)}
              </div>

              {/* Desglose */}
              <div className="space-y-3 border-t border-white/10 pt-6 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">{t.prepLabel}</span>
                  <span className="text-white/85 tabular-nums">{fmt.format(project.base)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">
                    {size} m² × {fmt.format(project.rates[finish])}
                  </span>
                  <span className="text-white/85 tabular-nums">{fmt.format(Math.round(size * project.rates[finish]))}</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">{t.extrasSelectedLabel}</span>
                    <span className="text-gold-400 tabular-nums">{fmt.format(Math.round(extrasTotal))}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-white/50 leading-relaxed mb-8 flex items-start gap-2">
                <Info className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                {typeStrings.note} {t.finalNoteSuffix}
              </p>

              <button
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full btn-primary rounded-sm flex items-center justify-center gap-2 group"
                aria-label={t.cta}
              >
                {t.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
