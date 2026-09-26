import type { Lang } from '../i18n';

// -----------------------------------------------------------------------------
// Datos para las landing pages programáticas de SEO: /s/:estado/:servicio
// (50 estados × 5 servicios × 3 idiomas)
// -----------------------------------------------------------------------------

export interface SeoService {
  id: string;
  priceFrom: number;
  priceTo: number;
  duration: Record<Lang, string>;
  name: Record<Lang, string>;
  intro: Record<Lang, (state: string) => string>;
  includes: Record<Lang, string[]>;
  faq: Record<Lang, { q: string; a: string }[]>;
}

export const SEO_SERVICES: SeoService[] = [
  {
    id: 'bathroom',
    priceFrom: 4500,
    priceTo: 15000,
    duration: { en: '2–3 weeks', es: '2–3 semanas', pt: '2–3 semanas' },
    name: { en: 'Bathroom Remodeling', es: 'Remodelación de Baños', pt: 'Reforma de Banheiros' },
    intro: {
      en: (s) => `Find verified bathroom remodeling contractors in ${s}. Compare up to 4 free quotes within 24 hours and hire with a written warranty.`,
      es: (s) => `Encuentra contratistas verificados para remodelar baños en ${s}. Compara hasta 4 cotizaciones gratis en 24 horas y contrata con garantía por escrito.`,
      pt: (s) => `Encontre construtoras verificadas para reformar banheiros em ${s}. Compare até 4 orçamentos grátis em 24 horas e contrate com garantia por escrito.`,
    },
    includes: {
      en: ['Demolition and debris removal', 'Plumbing and fixture upgrades', 'Porcelain or ceramic tile', 'Lighting and ventilation', 'Written 1-year warranty'],
      es: ['Demolición y retiro de escombro', 'Plomería y nuevos accesorios', 'Azulejo de porcelana o cerámica', 'Iluminación y ventilación', 'Garantía por escrito de 1 año'],
      pt: ['Demolição e remoção de entulho', 'Encanamento e novos acessórios', 'Azulejo de porcelana ou cerâmica', 'Iluminação e ventilação', 'Garantia por escrito de 1 ano'],
    },
    faq: {
      en: [
        { q: 'How much does a bathroom remodel cost?', a: 'In most areas it ranges from $4,500 for a basic refresh to $15,000+ for a full luxury renovation. Get free quotes from local contractors to compare exact prices.' },
        { q: 'How long does it take?', a: 'A typical bathroom remodel takes 2–3 weeks including demolition, plumbing, tile, and finishes.' },
      ],
      es: [
        { q: '¿Cuánto cuesta remodelar un baño?', a: 'En la mayoría de las zonas va de $4,500 por una actualización básica a más de $15,000 por una renovación completa de lujo. Pide cotizaciones gratis para comparar precios exactos.' },
        { q: '¿Cuánto tiempo toma?', a: 'Una remodelación de baño típica toma de 2 a 3 semanas incluyendo demolición, plomería, azulejo y acabados.' },
      ],
      pt: [
        { q: 'Quanto custa reformar um banheiro?', a: 'Na maioria das regiões vai de $4.500 por uma atualização básica a mais de $15.000 por uma renovação completa de luxo. Peça orçamentos grátis para comparar preços exatos.' },
        { q: 'Quanto tempo leva?', a: 'Uma reforma de banheiro típica leva de 2 a 3 semanas incluindo demolição, encanamento, azulejo e acabamentos.' },
      ],
    },
  },
  {
    id: 'kitchen',
    priceFrom: 12000,
    priceTo: 45000,
    duration: { en: '4–6 weeks', es: '4–6 semanas', pt: '4–6 semanas' },
    name: { en: 'Kitchen Remodeling', es: 'Remodelación de Cocinas', pt: 'Reforma de Cozinhas' },
    intro: {
      en: (s) => `Connect with verified kitchen remodeling contractors in ${s}. Custom cabinets, quartz countertops, and islands — free quotes in 24 hours.`,
      es: (s) => `Conecta con contratistas verificados para remodelar cocinas en ${s}. Gabinetes a medida, cubiertas de cuarzo e islas — cotizaciones gratis en 24 horas.`,
      pt: (s) => `Conecte-se a construtoras verificadas para reformar cozinhas em ${s}. Armários sob medida, bancadas de quartzo e ilhas — orçamentos grátis em 24 horas.`,
    },
    includes: {
      en: ['Custom or semi-custom cabinets', 'Quartz or granite countertops', 'Electrical and gas upgrades', 'New flooring and backsplash', 'Written 1-year warranty'],
      es: ['Gabinetes a medida o semi-medida', 'Cubiertas de cuarzo o granito', 'Actualización eléctrica y de gas', 'Piso nuevo y backsplash', 'Garantía por escrito de 1 año'],
      pt: ['Armários sob medida ou semi-medida', 'Bancadas de quartzo ou granito', 'Atualização elétrica e de gás', 'Piso novo e revestimento', 'Garantia por escrito de 1 ano'],
    },
    faq: {
      en: [
        { q: 'What is the average kitchen remodel cost?', a: 'Most kitchen remodels range from $12,000 for a standard update to $45,000+ for a full custom renovation with premium materials.' },
        { q: 'Do contractors handle permits?', a: 'Yes. Verified contractors manage permits and inspections required for electrical, gas, and structural work.' },
      ],
      es: [
        { q: '¿Cuál es el costo promedio de remodelar una cocina?', a: 'La mayoría de las remodelaciones van de $12,000 por una actualización estándar a más de $45,000 por una renovación completa con materiales premium.' },
        { q: '¿Los contratistas tramitan los permisos?', a: 'Sí. Los contratistas verificados gestionan los permisos e inspecciones requeridos para trabajos eléctricos, de gas y estructurales.' },
      ],
      pt: [
        { q: 'Qual o custo médio de reformar uma cozinha?', a: 'A maioria das reformas vai de $12.000 por uma atualização padrão a mais de $45.000 por uma renovação completa com materiais premium.' },
        { q: 'As construtoras cuidam dos alvarás?', a: 'Sim. As construtoras verificadas cuidam dos alvarás e inspeções exigidos para trabalhos elétricos, de gás e estruturais.' },
      ],
    },
  },
  {
    id: 'painting',
    priceFrom: 1200,
    priceTo: 6000,
    duration: { en: '3–5 days', es: '3–5 días', pt: '3–5 dias' },
    name: { en: 'House Painting', es: 'Pintura de Casas', pt: 'Pintura de Casas' },
    intro: {
      en: (s) => `Hire verified interior and exterior painters in ${s}. Premium paint, surface prep, and a flawless finish — free quotes in 24 hours.`,
      es: (s) => `Contrata pintores verificados de interiores y exteriores en ${s}. Pintura premium, preparación de superficies y acabado impecable — cotizaciones gratis en 24 horas.`,
      pt: (s) => `Contrate pintores verificados de interiores e exteriores em ${s}. Tinta premium, preparação de superfícies e acabamento impecável — orçamentos grátis em 24 horas.`,
    },
    includes: {
      en: ['Wall repair, sanding and patching', 'Two coats of premium paint', 'Ceilings, trim and doors', 'Furniture and floor protection', 'Written 2-year warranty'],
      es: ['Reparación, lijado y masilla de muros', 'Dos capas de pintura premium', 'Techos, molduras y puertas', 'Protección de muebles y pisos', 'Garantía por escrito de 2 años'],
      pt: ['Reparo, lixamento e massa de paredes', 'Duas demãos de tinta premium', 'Tetos, rodapés e portas', 'Proteção de móveis e pisos', 'Garantia por escrito de 2 anos'],
    },
    faq: {
      en: [
        { q: 'How much does it cost to paint a house?', a: 'Interior painting typically runs $1,200–3,500 and exterior $2,500–6,000 depending on size, prep work, and paint quality.' },
        { q: 'What paint brands do contractors use?', a: 'Verified contractors use premium brands like Sherwin-Williams, Benjamin Moore, or Behr with manufacturer warranties.' },
      ],
      es: [
        { q: '¿Cuánto cuesta pintar una casa?', a: 'La pintura interior suele costar de $1,200 a $3,500 y la exterior de $2,500 a $6,000 según el tamaño, la preparación y la calidad de la pintura.' },
        { q: '¿Qué marcas de pintura usan los contratistas?', a: 'Los contratistas verificados usan marcas premium como Sherwin-Williams, Benjamin Moore o Behr con garantía del fabricante.' },
      ],
      pt: [
        { q: 'Quanto custa pintar uma casa?', a: 'A pintura interna costuma custar de $1.200 a $3.500 e a externa de $2.500 a $6.000 conforme o tamanho, a preparação e a qualidade da tinta.' },
        { q: 'Quais marcas de tinta as construtoras usam?', a: 'As construtoras verificadas usam marcas premium como Sherwin-Williams, Benjamin Moore ou Behr com garantia do fabricante.' },
      ],
    },
  },
  {
    id: 'concrete',
    priceFrom: 3800,
    priceTo: 12000,
    duration: { en: '1–2 weeks', es: '1–2 semanas', pt: '1–2 semanas' },
    name: { en: 'Concrete Contractors', es: 'Concreto y Estampado', pt: 'Concreto Estampado' },
    intro: {
      en: (s) => `Find verified concrete contractors in ${s} for driveways, patios, and stamped concrete. Free quotes from local pros in 24 hours.`,
      es: (s) => `Encuentra contratistas verificados de concreto en ${s} para driveways, patios y concreto estampado. Cotizaciones gratis de profesionales locales en 24 horas.`,
      pt: (s) => `Encontre construtoras verificadas de concreto em ${s} para garagens, pátios e concreto estampado. Orçamentos grátis de profissionais locais em 24 horas.`,
    },
    includes: {
      en: ['Excavation and grading', 'Steel reinforcement', 'Pouring and finishing', 'Stamped, stained or broom finish', 'Written 5-year warranty'],
      es: ['Excavación y nivelación', 'Refuerzo de acero', 'Colado y acabado', 'Estampado, teñido o escobillado', 'Garantía por escrito de 5 años'],
      pt: ['Escavação e nivelamento', 'Armação de aço', 'Concretagem e acabamento', 'Estampado, tingido ou escovado', 'Garantia por escrito de 5 anos'],
    },
    faq: {
      en: [
        { q: 'How much does a concrete driveway cost?', a: 'A standard concrete driveway runs $3,800–8,000; stamped or stained finishes range $8,000–12,000+ depending on size and design.' },
        { q: 'How long before I can use new concrete?', a: 'You can typically walk on new concrete after 24–48 hours and drive on it after 7 days.' },
      ],
      es: [
        { q: '¿Cuánto cuesta un driveway de concreto?', a: 'Un driveway estándar de concreto cuesta de $3,800 a $8,000; los acabados estampados o teñidos van de $8,000 a $12,000+ según el tamaño y diseño.' },
        { q: '¿Cuándo puedo usar el concreto nuevo?', a: 'Por lo general puedes caminar sobre el concreto nuevo después de 24–48 horas y estacionar tu auto después de 7 días.' },
      ],
      pt: [
        { q: 'Quanto custa uma garagem de concreto?', a: 'Uma garagem padrão de concreto custa de $3.800 a $8.000; os acabamentos estampados ou tingidos vão de $8.000 a $12.000+ conforme o tamanho e o design.' },
        { q: 'Quando posso usar o concreto novo?', a: 'Geralmente você pode caminar sobre o concreto novo após 24–48 horas e estacionar seu carro após 7 dias.' },
      ],
    },
  },
  {
    id: 'remodel',
    priceFrom: 25000,
    priceTo: 120000,
    duration: { en: '8–12 weeks', es: '8–12 semanas', pt: '8–12 semanas' },
    name: { en: 'Full Home Remodeling', es: 'Remodelación Completa', pt: 'Reforma Completa' },
    intro: {
      en: (s) => `Get free quotes from verified whole-home remodeling contractors in ${s}. Additions, second stories, and complete transformations with permits handled.`,
      es: (s) => `Recibe cotizaciones gratis de contratistas verificados para remodelación completa en ${s}. Ampliaciones, segundos pisos y transformaciones completas con permisos incluidos.`,
      pt: (s) => `Receba orçamentos grátis de construtoras verificadas para reforma completa em ${s}. Ampliações, segundo pavimento e transformações completas com alvarás incluídos.`,
    },
    includes: {
      en: ['Architectural design and plans', 'Permits and inspections handled', 'Full labor and project management', 'Kitchens, baths, floors and paint', 'Written 1-year warranty'],
      es: ['Diseño arquitectónico y planos', 'Permisos e inspecciones incluidos', 'Mano de obra completa y supervisión', 'Cocinas, baños, pisos y pintura', 'Garantía por escrito de 1 año'],
      pt: ['Projeto arquitetônico e plantas', 'Alvarás e inspeções incluídos', 'Mão de obra completa e supervisão', 'Cozinhas, banheiros, pisos e pintura', 'Garantia por escrito de 1 ano'],
    },
    faq: {
      en: [
        { q: 'How much does a full home remodel cost?', a: 'Full remodels typically start around $25,000 for cosmetic updates and range to $120,000+ for structural work, additions, or second stories.' },
        { q: 'Can I stay in my home during the remodel?', a: 'Often yes for cosmetic projects; for full-gut remodels contractors phase the work so you can usually stay in part of the home.' },
      ],
      es: [
        { q: '¿Cuánto cuesta una remodelación completa?', a: 'Las remodelaciones integrales suelen partir de $25,000 por actualizaciones cosméticas y llegar a $120,000+ por trabajos estructurales, ampliaciones o segundos pisos.' },
        { q: '¿Puedo vivir en mi casa durante la remodelación?', a: 'A menudo sí en proyectos cosméticos; en remodelaciones totales los contratistas organizan la obra por fases para que normalmente puedas quedarte en parte de la casa.' },
      ],
      pt: [
        { q: 'Quanto custa uma reforma completa?', a: 'Reformas integrais costumam partir de $25.000 por atualizações cosméticas e chegar a $120.000+ por trabalhos estruturais, ampliações ou segundo pavimento.' },
        { q: 'Posso morar na casa durante a reforma?', a: 'Geralmente sim em projetos cosméticos; em reformas totais as construtoras organizam a obra em fases para que você normalmente possa ficar em parte da casa.' },
      ],
    },
  },
];

export const SEO_STRINGS = {
  en: {
    freeQuotes: 'Free quotes in 24 hours',
    verified: 'verified contractors',
    ctaTitle: 'Get your free quote in',
    ctaButton: 'Request free quotes',
    calcButton: 'Calculate my budget',
    includesTitle: "What's included",
    faqTitle: 'Frequently asked questions',
    priceRange: 'Typical price range',
    duration: 'Typical duration',
    breadcrumb: 'Home',
    relatedStates: (service: string) => `${service} in other states`,
    relatedServices: (state: string) => `Other services in ${state}`,
    directoryCta: 'See verified contractors in the directory',
  },
  es: {
    freeQuotes: 'Cotizaciones gratis en 24 horas',
    verified: 'contratistas verificados',
    ctaTitle: 'Recibe tu cotización gratis en',
    ctaButton: 'Pedir cotizaciones gratis',
    calcButton: 'Calcular mi presupuesto',
    includesTitle: 'Qué incluye',
    faqTitle: 'Preguntas frecuentes',
    priceRange: 'Rango de precio típico',
    duration: 'Duración típica',
    breadcrumb: 'Inicio',
    relatedStates: (service: string) => `${service} en otros estados`,
    relatedServices: (state: string) => `Otros servicios en ${state}`,
    directoryCta: 'Ver contratistas verificados en el directorio',
  },
  pt: {
    freeQuotes: 'Orçamentos grátis em 24 horas',
    verified: 'construtoras verificadas',
    ctaTitle: 'Receba seu orçamento grátis em',
    ctaButton: 'Pedir orçamentos grátis',
    calcButton: 'Calcular meu orçamento',
    includesTitle: 'O que está incluído',
    faqTitle: 'Perguntas frequentes',
    priceRange: 'Faixa de preço típica',
    duration: 'Duração típica',
    breadcrumb: 'Início',
    relatedStates: (service: string) => `${service} em outros estados`,
    relatedServices: (state: string) => `Outros serviços em ${state}`,
    directoryCta: 'Ver construtoras verificadas no diretório',
  },
} as const;
