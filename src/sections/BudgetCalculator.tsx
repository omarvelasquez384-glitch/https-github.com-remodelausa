import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Bath, ChefHat, Paintbrush, Layers, Home, Calculator, Info, LayoutGrid, Warehouse, Zap, Droplets, Wind, AppWindow, Trees } from 'lucide-react';
import { getLanguage, type Lang } from '../i18n';
import { US_STATES } from '../lib/us-states';

// -----------------------------------------------------------------------------
// Precios: promedios reales de remodelación en EE. UU. (datos 2026 de guías
// de la industria: HomeGuide, Houzz, estudios regionales de costo de construcción)
// multiplicados por un índice regional por estado (variación de mano de obra
// y materiales: Costa Oeste y Noreste ~+20-40%, Sur Central ~-15%).
// -----------------------------------------------------------------------------
type Finish = 'economico' | 'estandar' | 'premium';

interface ExtraOption {
  id: string;
  price?: number;       // cargo fijo en USD
  perSqft?: number;     // cargo adicional por pie cuadrado (o por unidad)
}

interface ProjectType {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  minSize: number;
  maxSize: number;
  defaultSize: number;
  unit: 'sqft' | 'units';
  base: number;
  rates: Record<Finish, number>;
  extras: ExtraOption[];
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'bano',
    icon: Bath,
    minSize: 20, maxSize: 200, defaultSize: 50, unit: 'sqft',
    base: 1800,
    rates: { economico: 130, estandar: 220, premium: 380 },
    extras: [
      { id: 'regadera', price: 600 },
      { id: 'doble-lavabo', price: 450 },
      { id: 'tina', price: 1800 },
      { id: 'azulejo', perSqft: 8 },
    ],
  },
  {
    id: 'cocina',
    icon: ChefHat,
    minSize: 60, maxSize: 400, defaultSize: 150, unit: 'sqft',
    base: 3000,
    rates: { economico: 110, estandar: 190, premium: 320 },
    extras: [
      { id: 'isla', price: 3500 },
      { id: 'gabinetes', price: 6500 },
      { id: 'cuarzo', price: 3800 },
      { id: 'backsplash', price: 900 },
      { id: 'electrodomesticos', price: 5500 },
    ],
  },
  {
    id: 'piso',
    icon: LayoutGrid,
    minSize: 100, maxSize: 3000, defaultSize: 800, unit: 'sqft',
    base: 350,
    rates: { economico: 4, estandar: 8, premium: 16 },
    extras: [
      { id: 'retiro', perSqft: 1.5 },
      { id: 'subpiso', perSqft: 2 },
      { id: 'escaleras', price: 900 },
    ],
  },
  {
    id: 'pintura',
    icon: Paintbrush,
    minSize: 200, maxSize: 3000, defaultSize: 800, unit: 'sqft',
    base: 250,
    rates: { economico: 2, estandar: 3.2, premium: 5 },
    extras: [
      { id: 'techos', perSqft: 0.9 },
      { id: 'exterior', perSqft: 1.4 },
      { id: 'imprimacion', perSqft: 0.6 },
      { id: 'molduras', price: 750 },
    ],
  },
  {
    id: 'concreto',
    icon: Layers,
    minSize: 200, maxSize: 3000, defaultSize: 600, unit: 'sqft',
    base: 600,
    rates: { economico: 7, estandar: 11, premium: 17 },
    extras: [
      { id: 'estampado', perSqft: 5 },
      { id: 'color', perSqft: 3 },
      { id: 'sellado', perSqft: 2 },
      { id: 'demolicion', price: 800 },
    ],
  },
  {
    id: 'techo',
    icon: Warehouse,
    minSize: 400, maxSize: 5000, defaultSize: 1500, unit: 'sqft',
    base: 900,
    rates: { economico: 4.5, estandar: 6.5, premium: 10 },
    extras: [
      { id: 'remocion', perSqft: 1.6 },
      { id: 'claraboya', price: 850 },
      { id: 'canales', price: 1400 },
      { id: 'aislamiento', perSqft: 1.2 },
    ],
  },
  {
    id: 'electrico',
    icon: Zap,
    minSize: 200, maxSize: 4000, defaultSize: 1200, unit: 'sqft',
    base: 300,
    rates: { economico: 1.8, estandar: 3.2, premium: 5.5 },
    extras: [
      { id: 'panel', price: 2200 },
      { id: 'cargador-ev', price: 1300 },
      { id: 'iluminacion', price: 950 },
      { id: 'domotica', price: 1100 },
    ],
  },
  {
    id: 'plomeria',
    icon: Droplets,
    minSize: 200, maxSize: 3000, defaultSize: 1000, unit: 'sqft',
    base: 400,
    rates: { economico: 2.5, estandar: 4.5, premium: 7.5 },
    extras: [
      { id: 'calentador', price: 1600 },
      { id: 'repipe', perSqft: 3 },
      { id: 'regadera-lluvia', price: 650 },
      { id: 'jacuzzi', price: 2500 },
    ],
  },
  {
    id: 'hvac',
    icon: Wind,
    minSize: 400, maxSize: 4000, defaultSize: 1500, unit: 'sqft',
    base: 500,
    rates: { economico: 3, estandar: 5, premium: 8 },
    extras: [
      { id: 'ductos', perSqft: 2.5 },
      { id: 'termostato', price: 400 },
      { id: 'zonificacion', price: 2200 },
      { id: 'purificador', price: 1500 },
    ],
  },
  {
    id: 'ventanas',
    icon: AppWindow,
    minSize: 1, maxSize: 40, defaultSize: 8, unit: 'units',
    base: 250,
    rates: { economico: 380, estandar: 680, premium: 1150 },
    extras: [
      { id: 'doble-vidrio', perSqft: 140 },
      { id: 'marco-aluminio', price: 2200 },
      { id: 'puerta-patio', price: 1800 },
    ],
  },
  {
    id: 'remodelacion',
    icon: Home,
    minSize: 400, maxSize: 5000, defaultSize: 1500, unit: 'sqft',
    base: 6000,
    rates: { economico: 60, estandar: 120, premium: 230 },
    extras: [
      { id: 'ampliacion', perSqft: 220 },
      { id: 'acabados', price: 18000 },
      { id: 'diseno', price: 4500 },
      { id: 'cocina-completa', price: 28000 },
      { id: 'banos-completos', price: 16000 },
    ],
  },
  {
    id: 'deck',
    icon: Trees,
    minSize: 100, maxSize: 1500, defaultSize: 400, unit: 'sqft',
    base: 700,
    rates: { economico: 18, estandar: 30, premium: 55 },
    extras: [
      { id: 'techado', price: 5500 },
      { id: 'iluminacion-ext', price: 800 },
      { id: 'barandales', perSqft: 8 },
      { id: 'cocina-exterior', price: 4500 },
    ],
  },
];

// Índice regional de costo por estado (1.00 = promedio nacional). Basado en
// estudios 2025-2026 de costo de construcción por estado y regiones:
// Pacífico (HI/AK) 1.30-1.40, Costa Oeste 1.12-1.25, Noreste 1.05-1.25,
// Atlántico Sur 0.95-1.08, Centro-Sur 0.82-0.95, Medio Oeste 0.88-1.10.
const STATE_FACTORS: Record<string, number> = {
  AL: 0.85, AK: 1.30, AZ: 1.05, AR: 0.82, CA: 1.25, CO: 1.10, CT: 1.20, DE: 1.05,
  FL: 1.00, GA: 0.95, HI: 1.40, ID: 1.02, IL: 1.10, IN: 0.90, IA: 0.88, KS: 0.90,
  KY: 0.85, LA: 0.88, ME: 1.05, MD: 1.08, MA: 1.25, MI: 0.95, MN: 1.02, MS: 0.82,
  MO: 0.90, MT: 1.00, NE: 0.88, NV: 1.05, NH: 1.10, NJ: 1.25, NM: 0.90, NY: 1.25,
  NC: 0.95, ND: 0.90, OH: 0.92, OK: 0.85, OR: 1.12, PA: 1.00, RI: 1.15, SC: 0.95,
  SD: 0.88, TN: 0.88, TX: 0.95, UT: 1.05, VT: 1.05, VA: 1.00, WA: 1.20, WV: 0.85,
  WI: 0.95, WY: 0.98, DC: 1.30,
};

// -----------------------------------------------------------------------------
// Textos de la calculadora por idioma
// -----------------------------------------------------------------------------
interface CalcStrings {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  intro: string;
  projectTypeLabel: string;
  stateLabel: string;
  stateDefault: string;
  adjustedTo: string;
  unitSqft: string;
  unitItems: string;
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
      'Pick your project, size, and state to get a price range based on real 2026 U.S. remodeling averages — adjusted for your region. Then receive exact quotes from verified contractors.',
    projectTypeLabel: 'Project type',
    stateLabel: 'Your state (adjusts prices to your region)',
    stateDefault: 'National average',
    adjustedTo: 'Regional adjustment',
    unitSqft: 'sq ft',
    unitItems: 'windows',
    finishLabel: 'Finish level',
    finishes: { economico: 'Budget', estandar: 'Standard', premium: 'Premium' },
    extrasLabel: 'Optional extras',
    resultTitle: 'Estimated budget',
    prepLabel: 'Preparation and base',
    extrasSelectedLabel: 'Selected extras',
    finalNoteSuffix: 'The final price depends on the current condition of the space and the materials you choose.',
    cta: 'Get real quotes for free',
    types: {
      bano: { name: 'Bathroom', sizeLabel: 'Bathroom size', note: 'Includes demolition, plumbing, installation, and finishes. A mid-range bathroom typically runs $12,000–$25,000.' },
      cocina: { name: 'Kitchen', sizeLabel: 'Kitchen size', note: 'Includes labor, cabinetry, basic electrical and gas hookups. Mid-range kitchens typically run $25,000–$60,000.' },
      piso: { name: 'Flooring', sizeLabel: 'Area to floor', note: 'Removal and installation of new floors: vinyl (LVP), hardwood, or tile.' },
      pintura: { name: 'Painting', sizeLabel: 'Wall area to paint', note: 'Two coats of premium paint, furniture protection, and final cleanup.' },
      concreto: { name: 'Concrete', sizeLabel: 'Concrete area (driveway / patio)', note: 'Includes excavation, formwork, steel reinforcement, and pouring.' },
      techo: { name: 'Roofing', sizeLabel: 'Roof area', note: 'Tear-off, underlayment, and installation of architectural shingles or premium materials.' },
      electrico: { name: 'Electrical', sizeLabel: 'Home size', note: 'Wiring upgrades, new circuits, outlets, and fixtures for the whole home.' },
      plomeria: { name: 'Plumbing', sizeLabel: 'Home size', note: 'Repipes, fixture replacement, and water heater connections.' },
      hvac: { name: 'HVAC', sizeLabel: 'Home size', note: 'Heating and cooling system sized for your home, including labor.' },
      ventanas: { name: 'Windows', sizeLabel: 'Number of windows', note: 'Removal and installation per window, including trim and sealing.' },
      remodelacion: { name: 'Full remodel', sizeLabel: 'Home area', note: 'Whole-home project with supervision, permits, kitchen and baths.' },
      deck: { name: 'Deck / Patio', sizeLabel: 'Deck area', note: 'Outdoor living space in wood or composite, with permits and footings.' },
    },
    extras: {
      regadera: 'New rainfall shower', 'doble-lavabo': 'Double vanity', tina: 'Freestanding tub', azulejo: 'Floor-to-ceiling tile',
      isla: 'Center island with countertop', gabinetes: 'Custom cabinets', cuarzo: 'Quartz countertops', backsplash: 'Tile backsplash', electrodomesticos: 'New appliance package',
      retiro: 'Remove old flooring', subpiso: 'Subfloor leveling / underlayment', escaleras: 'Stairs included',
      techos: 'Include ceilings', exterior: 'Exterior painting', imprimacion: 'Primer and wall repair', molduras: 'Doors and trim detail',
      estampado: 'Stamped finish', color: 'Integral color', sellado: 'Heavy-duty sealer', demolicion: 'Old slab removal',
      remocion: 'Tear-off of old roof', claraboya: 'Skylight', canales: 'Seamless gutters', aislamiento: 'Attic insulation',
      panel: 'Electrical panel upgrade', 'cargador-ev': 'EV charger', iluminacion: 'Recessed lighting package', domotica: 'Smart-home devices',
      calentador: 'Tankless water heater', repipe: 'Full repipe (PEX / copper)', 'regadera-lluvia': 'Rainfall shower system', jacuzzi: 'Jacuzzi tub',
      ductos: 'New ductwork', termostato: 'Smart thermostat', zonificacion: 'Multi-zone system', purificador: 'Air purifier',
      'doble-vidrio': 'Energy-efficient double pane', 'marco-aluminio': 'Aluminum / fiberglass frames', 'puerta-patio': 'Sliding patio door',
      ampliacion: 'Room addition', acabados: 'Luxury finishes', diseno: 'Architectural design', 'cocina-completa': 'New kitchen included', 'banos-completos': 'Bathrooms included',
      techado: 'Pergola / roof cover', 'iluminacion-ext': 'Exterior lighting', barandales: 'Railings', 'cocina-exterior': 'Outdoor kitchen',
    },
  },
  es: {
    scriptText: 'Calcula tu presupuesto',
    subtitle: 'Estimado en segundos',
    mainTitle: '¿Cuánto costaría tu proyecto?',
    intro:
      'Elige el proyecto, el tamaño y tu estado para obtener un rango basado en promedios reales de remodelación 2026 en EE. UU., ajustados a tu región. Después recibe cotizaciones exactas de contratistas verificados.',
    projectTypeLabel: 'Tipo de proyecto',
    stateLabel: 'Tu estado (ajusta los precios a tu región)',
    stateDefault: 'Promedio nacional',
    adjustedTo: 'Ajuste regional',
    unitSqft: 'pies²',
    unitItems: 'ventanas',
    finishLabel: 'Nivel de acabado',
    finishes: { economico: 'Económico', estandar: 'Estándar', premium: 'Premium' },
    extrasLabel: 'Extras opcionales',
    resultTitle: 'Presupuesto estimado',
    prepLabel: 'Preparación y base',
    extrasSelectedLabel: 'Extras seleccionados',
    finalNoteSuffix: 'El precio final depende del estado actual del espacio y los materiales que elijas.',
    cta: 'Recibir cotizaciones reales gratis',
    types: {
      bano: { name: 'Baño', sizeLabel: 'Tamaño del baño', note: 'Incluye demolición, plomería, instalación y acabados. Un baño de gama media suele costar $12,000–$25,000.' },
      cocina: { name: 'Cocina', sizeLabel: 'Tamaño de la cocina', note: 'Incluye mano de obra, gabinetes e instalación eléctrica y de gas. Cocinas de gama media: $25,000–$60,000.' },
      piso: { name: 'Pisos', sizeLabel: 'Área a poner piso', note: 'Retiro e instalación de piso nuevo: vinílico (LVP), madera o azulejo.' },
      pintura: { name: 'Pintura', sizeLabel: 'Área de pared a pintar', note: 'Dos capas de pintura premium, protección de muebles y limpieza final.' },
      concreto: { name: 'Concreto', sizeLabel: 'Área de concreto (cochera / patio)', note: 'Incluye excavación, encofrado, refuerzo de acero y colado.' },
      techo: { name: 'Techo', sizeLabel: 'Área del techo', note: 'Retiro del techo viejo, impermeabilización e instalación de teja arquitectónica o materiales premium.' },
      electrico: { name: 'Electricidad', sizeLabel: 'Tamaño de la casa', note: 'Actualización de cableado, circuitos, contactos y luminarias para toda la casa.' },
      plomeria: { name: 'Plomería', sizeLabel: 'Tamaño de la casa', note: 'Tuberías nuevas, cambio de accesorios y conexión del calentador de agua.' },
      hvac: { name: 'Clima (HVAC)', sizeLabel: 'Tamaño de la casa', note: 'Sistema de calefacción y aire acondicionado dimensionado para tu casa, con mano de obra.' },
      ventanas: { name: 'Ventanas', sizeLabel: 'Número de ventanas', note: 'Retiro e instalación por ventana, incluyendo molduras y sellado.' },
      remodelacion: { name: 'Remodelación total', sizeLabel: 'Área de la casa', note: 'Proyecto integral con supervisión, permisos, cocina y baños.' },
      deck: { name: 'Deck / Patio', sizeLabel: 'Área del deck', note: 'Espacio exterior en madera o compuesto, con permisos y cimientos.' },
    },
    extras: {
      regadera: 'Regadera tipo lluvia nueva', 'doble-lavabo': 'Doble lavabo', tina: 'Tina exenta', azulejo: 'Azulejo piso a techo',
      isla: 'Isla central con cubierta', gabinetes: 'Gabinetes a medida', cuarzo: 'Cubiertas de cuarzo', backsplash: 'Backsplash de azulejo', electrodomesticos: 'Paquete de electrodomésticos nuevos',
      retiro: 'Retiro de piso viejo', subpiso: 'Nivelación / underlayment', escaleras: 'Incluir escaleras',
      techos: 'Incluir techos', exterior: 'Pintura exterior', imprimacion: 'Imprimación y reparación de muros', molduras: 'Puertas y molduras',
      estampado: 'Acabado estampado', color: 'Color integral', sellado: 'Sellado reforzado', demolicion: 'Demolición de losa vieja',
      remocion: 'Retiro de techo viejo', claraboya: 'Claraboya', canales: 'Canalones continuos', aislamiento: 'Aislamiento de ático',
      panel: 'Actualización de tablero eléctrico', 'cargador-ev': 'Cargador de auto eléctrico', iluminacion: 'Paquete de luces empotradas', domotica: 'Casa inteligente',
      calentador: 'Calentador de agua sin tanque', repipe: 'Cambio total de tuberías', 'regadera-lluvia': 'Regadera tipo lluvia', jacuzzi: 'Tina de hidromasaje',
      ductos: 'Ductos nuevos', termostato: 'Termostato inteligente', zonificacion: 'Sistema de zonas', purificador: 'Purificador de aire',
      'doble-vidrio': 'Doble vidrio ahorrador', 'marco-aluminio': 'Marcos de aluminio / fibra de vidrio', 'puerta-patio': 'Puerta corrediza de patio',
      ampliacion: 'Ampliación de espacios', acabados: 'Acabados de lujo', diseno: 'Diseño arquitectónico', 'cocina-completa': 'Cocina nueva incluida', 'banos-completos': 'Baños incluidos',
      techado: 'Pérgola / techo', 'iluminacion-ext': 'Iluminación exterior', barandales: 'Barandales', 'cocina-exterior': 'Cocina exterior',
    },
  },
  pt: {
    scriptText: 'Calcule seu orçamento',
    subtitle: 'Estimativa em segundos',
    mainTitle: 'Quanto custaria seu projeto?',
    intro:
      'Escolha o projeto, o tamanho e o seu estado para obter uma faixa baseada em médias reais de reforma 2026 nos EUA, ajustadas à sua região. Depois receba orçamentos exatos de construtoras verificadas.',
    projectTypeLabel: 'Tipo de projeto',
    stateLabel: 'Seu estado (ajusta os preços à sua região)',
    stateDefault: 'Média nacional',
    adjustedTo: 'Ajuste regional',
    unitSqft: 'pés²',
    unitItems: 'janelas',
    finishLabel: 'Nível de acabamento',
    finishes: { economico: 'Econômico', estandar: 'Padrão', premium: 'Premium' },
    extrasLabel: 'Extras opcionais',
    resultTitle: 'Orçamento estimado',
    prepLabel: 'Preparação e base',
    extrasSelectedLabel: 'Extras selecionados',
    finalNoteSuffix: 'O preço final depende do estado atual do espaço e dos materiais escolhidos.',
    cta: 'Receber orçamentos reais grátis',
    types: {
      bano: { name: 'Banheiro', sizeLabel: 'Tamanho do banheiro', note: 'Inclui demolição, encanamento, instalação e acabamentos. Um banheiro médio costuma custar $12.000–$25.000.' },
      cocina: { name: 'Cozinha', sizeLabel: 'Tamanho da cozinha', note: 'Inclui mão de obra, armários e instalação elétrica e de gás. Cozinhas médias: $25.000–$60.000.' },
      piso: { name: 'Pisos', sizeLabel: 'Área a revestir', note: 'Remoção e instalação de piso novo: vinílico (LVP), madeira ou azulejo.' },
      pintura: { name: 'Pintura', sizeLabel: 'Área de parede a pintar', note: 'Duas demãos de tinta premium, proteção de móveis e limpeza final.' },
      concreto: { name: 'Concreto', sizeLabel: 'Área de concreto (garagem / pátio)', note: 'Inclui escavação, forma, armação de aço e concretagem.' },
      techo: { name: 'Telhado', sizeLabel: 'Área do telhado', note: 'Remoção do telhado antigo, impermeabilização e instalação de telha arquitetônica ou materiais premium.' },
      electrico: { name: 'Eletricidade', sizeLabel: 'Tamanho da casa', note: 'Modernização da fiação, circuitos, tomadas e luminárias para toda a casa.' },
      plomeria: { name: 'Encanamento', sizeLabel: 'Tamanho da casa', note: 'Tubulações novas, troca de metais e conexão do aquecedor de água.' },
      hvac: { name: 'Climatização', sizeLabel: 'Tamanho da casa', note: 'Sistema de aquecimento e refrigeração dimensionado para sua casa, com mão de obra.' },
      ventanas: { name: 'Janelas', sizeLabel: 'Número de janelas', note: 'Remoção e instalação por janela, incluindo molduras e vedação.' },
      remodelacion: { name: 'Reforma completa', sizeLabel: 'Área da casa', note: 'Projeto integral com supervisão, alvarás, cozinha e banheiros.' },
      deck: { name: 'Deck / Pátio', sizeLabel: 'Área do deck', note: 'Espaço externo em madeira ou composto, com alvarás e fundações.' },
    },
    extras: {
      regadera: 'Chuveiro tipo chuva novo', 'doble-lavabo': 'Dupla cuba', tina: 'Banheira exenta', azulejo: 'Azulejo do piso ao teto',
      isla: 'Ilha central com bancada', gabinetes: 'Armários sob medida', cuarzo: 'Bancadas de quartzo', backsplash: 'Revestimento de azulejo', electrodomesticos: 'Pacote de eletrodomésticos novos',
      retiro: 'Remoção do piso antigo', subpiso: 'Nivelamento / underlayment', escaleras: 'Incluir escadas',
      techos: 'Incluir tetos', exterior: 'Pintura externa', imprimacion: 'Selador e reparo de paredes', molduras: 'Portas e molduras',
      estampado: 'Acabamento estampado', color: 'Cor integral', sellado: 'Selagem reforçada', demolicion: 'Demolição da laje antiga',
      remocion: 'Remoção do telhado antigo', claraboya: 'Claraboia', canales: 'Calhas contínuas', aislamiento: 'Isolamento do sótão',
      panel: 'Modernização do quadro elétrico', 'cargador-ev': 'Carregador de carro elétrico', iluminacion: 'Pacote de luzes embutidas', domotica: 'Casa inteligente',
      calentador: 'Aquecedor de água sem tanque', repipe: 'Troca total de tubulações', 'regadera-lluvia': 'Chuveiro tipo chuva', jacuzzi: 'Banheira de hidromassagem',
      ductos: 'Dutos novos', termostato: 'Termostato inteligente', zonificacion: 'Sistema de zonas', purificador: 'Purificador de ar',
      'doble-vidrio': 'Vidro duplo econômico', 'marco-aluminio': 'Esquadrias de alumínio / fibra', 'puerta-patio': 'Porta de correr para o pátio',
      ampliacion: 'Ampliação de espaços', acabados: 'Acabamentos de luxo', diseno: 'Projeto arquitetônico', 'cocina-completa': 'Cozinha nova incluída', 'banos-completos': 'Banheiros incluídos',
      techado: 'Pergolado / cobertura', 'iluminacion-ext': 'Iluminação externa', barandales: 'Guarda-corpos', 'cocina-exterior': 'Cozinha externa',
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
  const [stateAbbr, setStateAbbr] = useState('');
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
  const unitStr = project.unit === 'sqft' ? t.unitSqft : t.unitItems;
  const factor = stateAbbr ? (STATE_FACTORS[stateAbbr] ?? 1) : 1;
  const stateName = stateAbbr ? (US_STATES.find((s) => s.abbr === stateAbbr)?.name ?? stateAbbr) : '';

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
      if (extra.perSqft) extrasSum += extra.perSqft * size;
    }
    const total = (project.base + workCost + extrasSum) * factor;
    return {
      low: Math.round(total * 0.9 / 50) * 50,
      high: Math.round(total * 1.15 / 50) * 50,
      extrasTotal: extrasSum * factor,
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROJECT_TYPES.map((type, i) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => switchType(i)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm transition-all duration-300 ${
                        i === activeType
                          ? 'bg-gold-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{t.types[type.id].name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estado (ajuste regional) */}
            <div className="fade-up" style={{ transitionDelay: '0.03s' }}>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">{t.stateLabel}</p>
              <select
                value={stateAbbr}
                onChange={(e) => setStateAbbr(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white/85 focus:border-gold-500/50 focus:outline-none cursor-pointer [&>option]:bg-[#141414]"
                aria-label={t.stateLabel}
              >
                <option value="">{t.stateDefault}</option>
                {US_STATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name} ({s.abbr})
                  </option>
                ))}
              </select>
            </div>

            {/* Tamaño */}
            <div className="fade-up" style={{ transitionDelay: '0.05s' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/60 uppercase tracking-wider">{typeStrings.sizeLabel}</p>
                <span className="font-serif text-xl text-gold-500 tabular-nums">
                  {size} {unitStr}
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
                <span>{project.minSize} {unitStr}</span>
                <span>{project.maxSize} {unitStr}</span>
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
                        {extra.perSqft
                          ? `+${fmt.format(extra.perSqft)}/${unitStr}`
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
                {typeStrings.name} · {size} {unitStr} · {t.finishes[finish]}
                {stateName && <span className="text-gold-400/80"> · {stateName}</span>}
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
                  <span className="text-white/85 tabular-nums">{fmt.format(Math.round(project.base * factor))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">
                    {size} {unitStr} × {fmt.format(project.rates[finish])}
                  </span>
                  <span className="text-white/85 tabular-nums">{fmt.format(Math.round(size * project.rates[finish] * factor))}</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">{t.extrasSelectedLabel}</span>
                    <span className="text-gold-400 tabular-nums">{fmt.format(Math.round(extrasTotal))}</span>
                  </div>
                )}
                {stateAbbr && factor !== 1 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">{t.adjustedTo} ({stateAbbr})</span>
                    <span className="text-gold-400 tabular-nums">
                      {factor > 1 ? '+' : ''}{Math.round((factor - 1) * 100)}%
                    </span>
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
