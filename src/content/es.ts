import type { SiteContent } from '../config';

export const esContent: SiteContent = {
  site: {
    title: "RemodelaUSA — Contratistas de Remodelación en Estados Unidos",
    description:
      "Encuentra contratistas verificados para remodelaciones, baños, cocinas, pintura, concreto y reparaciones en todo Estados Unidos. Cotizaciones gratis en 24 horas.",
    language: "es",
    keywords:
      "remodelación, contratistas, baños, cocinas, pintura, concreto, reparaciones, Estados Unidos, cotización gratis",
    ogImage: "/images/hero-banner.png",
    canonical: "",
  },

  navigation: {
    brandName: "RemodelaUSA",
    brandSubname: "hogar renovado",
    tagline: "Contratistas verificados en todo EE. UU.",
    navLinks: [
      { name: "Inicio", href: "#hero", icon: "Home" },
      {
        name: "Servicios",
        href: "#wines",
        icon: "Grape",
        dropdown: [
          { name: "Baños", href: "#wines" },
          { name: "Cocinas", href: "#wines" },
          { name: "Pintura", href: "#wines" },
          { name: "Concreto", href: "#wines" },
          { name: "Remodelaciones", href: "#wines" },
        ],
      },
      { name: "Proyectos", href: "#winery", icon: "BookOpen" },
      { name: "Calculadora", href: "#calculadora", icon: "Calculator" },
      { name: "Contratistas", href: "#museum", icon: "Users" },
      { name: "Directorio", href: "/contractors", icon: "HardHat" },
      { name: "Opiniones", href: "#news", icon: "Newspaper" },
      { name: "Contacto", href: "#contact", icon: "Mail" },
    ],
    ctaButtonText: "Cotizar gratis",
  },

  preloader: {
    brandName: "RemodelaUSA",
    brandSubname: "hogar renovado",
    yearText: "En todo EE. UU.",
  },

  hero: {
    scriptText: "Remodela, repara, renueva",
    mainTitle: "Tu hogar merece\nlas mejores manos",
    ctaButtonText: "Encuentra tu contratista",
    ctaTarget: "#contact",
    stats: [
      { value: 12500, suffix: "+", label: "Proyectos completados" },
      { value: 3800, suffix: "+", label: "Contratistas verificados" },
      { value: 50, suffix: "", label: "Estados cubiertos" },
    ],
    decorativeText: "Remodelación en todo EE. UU.",
    backgroundImage: "/images/hero-banner.png",
  },

  wineShowcase: {
    scriptText: "Nuestros servicios",
    subtitle: "Baños · Cocinas · Pintura · Concreto · Reparaciones",
    mainTitle: "Todo para transformar tu hogar",
    wines: [
      {
        id: "banos",
        name: "Baños",
        subtitle: "Tu spa en casa",
        year: "01",
        image: "/images/servicio-banos.png",
        filter: "",
        glowColor: "bg-sky-500/15",
        description:
          "Convierte tu baño en un refugio de relajación. Manejamos todo: demolición, plomería, azulejo, iluminación y acabados de lujo.",
        tastingNotes:
          "Incluye: regadera tipo lluvia, doble lavabo, azulejo de porcelana, instalación de tina y ventilación mejorada.",
        alcohol: "$4,500",
        temperature: "2–3 sem",
        aging: "1 año",
      },
      {
        id: "cocinas",
        name: "Cocinas",
        subtitle: "El corazón del hogar",
        year: "02",
        image: "/images/servicio-cocina.png",
        filter: "",
        glowColor: "bg-amber-500/15",
        description:
          "Diseñamos y construimos la cocina de tus sueños: gabinetes a medida, cubiertas de cuarzo, isla central e iluminación cálida.",
        tastingNotes:
          "Incluye: gabinetes, cubierta de cuarzo, instalación eléctrica y de gas, piso nuevo y backsplash de azulejo.",
        alcohol: "$12,000",
        temperature: "4–6 sem",
        aging: "1 año",
      },
      {
        id: "pintura",
        name: "Pintura",
        subtitle: "Color que renueva",
        year: "03",
        image: "/images/servicio-pintura.png",
        filter: "",
        glowColor: "bg-emerald-500/15",
        description:
          "Interior y exterior con pintura de primera calidad. Preparamos cada superficie para un acabado impecable y duradero.",
        tastingNotes:
          "Incluye: reparación de muros, lijado, masilla, dos capas de pintura premium y limpieza completa al finalizar.",
        alcohol: "$1,200",
        temperature: "3–5 días",
        aging: "2 años",
      },
      {
        id: "concreto",
        name: "Concreto",
        subtitle: "Base sólida y bella",
        year: "04",
        image: "/images/servicio-concreto.png",
        filter: "",
        glowColor: "bg-stone-400/15",
        description:
          "Driveways, patios, banquetas y fundaciones. Concreto estampado, pulido o tradicional con acabado profesional.",
        tastingNotes:
          "Incluye: excavación, encofrado, refuerzo de acero, colado, acabado estampado y sellado protector.",
        alcohol: "$3,800",
        temperature: "1–2 sem",
        aging: "5 años",
      },
      {
        id: "remodelacion",
        name: "Remodelación",
        subtitle: "Cambio completo",
        year: "05",
        image: "/images/servicio-remodelacion.png",
        filter: "",
        glowColor: "bg-gold-500/15",
        description:
          "Remodelaciones integrales: ampliaciones, nuevas habitaciones, segundo piso o la transformación completa de tu casa.",
        tastingNotes:
          "Incluye: diseño arquitectónico, permisos, mano de obra completa, supervisión de obra y acabados de lujo.",
        alcohol: "$25,000",
        temperature: "8–12 sem",
        aging: "1 año",
      },
    ],
    features: [
      {
        icon: "Sparkles",
        title: "Contratistas verificados",
        description:
          "Cada contratista pasa por revisión de licencia, seguro y antecedentes antes de recibir solicitudes.",
      },
      {
        icon: "Clock",
        title: "Cotización en 24 horas",
        description:
          "Publica tu proyecto gratis y recibe hasta 4 cotizaciones de contratistas de tu zona en menos de un día.",
      },
      {
        icon: "Thermometer",
        title: "Precios transparentes",
        description:
          "Compara propuestas lado a lado con precios claros, garantías por escrito y opiniones reales de clientes.",
      },
    ],
    quote: {
      text: "Comparé cuatro cotizaciones en un solo día y elegí al mejor contratista sin salir de casa.",
      attribution: "María G., Houston, TX",
      prefix: "Historias reales",
    },
  },

  wineryCarousel: {
    scriptText: "Inspiración",
    subtitle: "Proyectos reales",
    mainTitle: "Transformaciones que hablan por sí solas",
    locationTag: "En todo Estados Unidos",
    slides: [
      {
        image: "/images/slider01.png",
        title: "Cocina abierta moderna",
        subtitle: "Austin, Texas",
        area: "6",
        unit: "semanas",
        description:
          "De cocina cerrada y oscura a espacio abierto con isla central, gabinetes blancos y cubierta de cuarzo.",
      },
      {
        image: "/images/slider02.png",
        title: "Baño principal tipo spa",
        subtitle: "Phoenix, Arizona",
        area: "3",
        unit: "semanas",
        description:
          "Tina exenta, azulejo de mármol y doble regadera con luz natural: un spa privado en casa.",
      },
      {
        image: "/images/slider03.png",
        title: "Patio de concreto estampado",
        subtitle: "Denver, Colorado",
        area: "10",
        unit: "días",
        description:
          "Patio trasero completamente renovado con concreto estampado, luces colgantes y área de descanso.",
      },
    ],
  },

  museum: {
    scriptText: "Para contratistas",
    subtitle: "Más trabajos, menos esfuerzo",
    mainTitle: "Crece tu negocio con nosotros",
    introText:
      "Los dueños de casa publican sus proyectos gratis. Tú recibes las solicitudes de tu zona, cotizas, firmas el trabajo y solo entonces pagas una comisión. Sin mensualidades, sin riesgo.",
    timeline: [
      { year: "Paso 1", event: "Crea tu perfil" },
      { year: "Paso 2", event: "Recibe solicitudes" },
      { year: "Paso 3", event: "Cotiza y firma" },
      { year: "Paso 4", event: "Paga comisión" },
    ],
    tabs: [
      {
        id: "clientes",
        name: "Clientes reales",
        icon: "History",
        image: "/images/museum-tab1.png",
        content: {
          title: "Solicitudes de clientes listos para contratar",
          description:
            "Cada solicitud viene con fotos, presupuesto estimado y fecha deseada de inicio. Hablas directo con el dueño de la casa, sin intermediarios que se queden con tu margen.",
          highlight: "Hasta 15 solicitudes al mes en tu zona",
        },
      },
      {
        id: "verificacion",
        name: "Perfil verificado",
        icon: "Award",
        image: "/images/museum-tab2.png",
        content: {
          title: "Destaca con la insignia de verificado",
          description:
            "Verificamos tu licencia, seguro y antecedentes. Tu perfil verificado aparece primero en las búsquedas y genera confianza desde el primer contacto.",
          highlight: "Los perfiles verificados firman 3× más trabajos",
        },
      },
      {
        id: "comision",
        name: "Comisión justa",
        icon: "BookOpen",
        image: "/images/museum-tab3.png",
        content: {
          title: "Pagas solo cuando firmas el trabajo",
          description:
            "Registrar tu perfil es gratis. Solo pagas una comisión del 8% sobre trabajos firmados a través de la plataforma. Si no firmas, no pagas nada.",
          highlight: "0% de comisión si no firmas",
        },
      },
    ],
    openingHours: "Lun–Sáb · 8:00 AM – 6:00 PM",
    openingHoursLabel: "Soporte",
    ctaButtonText: "Únete como contratista",
    yearBadge: "8%",
    yearBadgeLabel: "Comisión",
    quote: {
      prefix: "Más trabajos",
      text: "Dupliqué mis proyectos en seis meses. Las solicitudes llegan directo a mi teléfono y decido cuáles cotizar.",
      attribution: "Carlos R., Contratista general, Miami, FL",
    },
    founderPhotoAlt: "Contratista verificado de RemodelaUSA",
    founderPhoto: "/images/photo-retro.png",
  },

  news: {
    scriptText: "Blog",
    subtitle: "Consejos y tendencias",
    mainTitle: "Ideas para tu próxima remodelación",
    viewAllText: "Ver todos",
    readMoreText: "Leer más",
    articles: [
      {
        id: 1,
        image: "/images/news01.png",
        title: "¿Cuánto cuesta remodelar un baño en 2026?",
        excerpt:
          "Precios promedio por estado, qué factores suben el presupuesto y cómo ahorrar sin sacrificar calidad.",
        date: "12 Sep 2026",
        category: "Presupuestos",
      },
      {
        id: 2,
        image: "/images/news02.png",
        title: "5 señales de que tu baño necesita renovación ya",
        excerpt:
          "Manchas de humedad, azulejo agrietado y mala ventilación: detecta a tiempo las señales de alerta.",
        date: "28 Ago 2026",
        category: "Baños",
      },
      {
        id: 3,
        image: "/images/news03.png",
        title: "Cómo elegir al contratista correcto: checklist completo",
        excerpt:
          "Las 10 preguntas que debes hacer antes de firmar, cómo verificar licencias y qué debe incluir todo contrato.",
        date: "15 Ago 2026",
        category: "Guías",
      },
    ],
    testimonialsScriptText: "Opiniones",
    testimonialsSubtitle: "Clientes felices",
    testimonialsMainTitle: "Lo que dicen los dueños de casa",
    testimonials: [
      {
        name: "María González",
        role: "Houston, TX",
        text: "Publiqué mi proyecto un lunes y el miércoles ya tenía tres cotizaciones. El contratista que elegí dejó mi baño hermoso y cumplió el presupuesto al centavo.",
        rating: 5,
      },
      {
        name: "James Wilson",
        role: "Atlanta, GA",
        text: "Lo que más me gustó fue la verificación: sabía que cada contratista tenía licencia y seguro. La pintura de mi casa quedó perfecta.",
        rating: 5,
      },
      {
        name: "Ana Martínez",
        role: "San Diego, CA",
        text: "El driveway de concreto estampado quedó mejor que en las fotos. Precio justo, trabajo limpio y garantía por escrito.",
        rating: 4,
      },
    ],
    storyScriptText: "Nuestra historia",
    storySubtitle: "El marketplace del hogar",
    storyTitle: "Conectamos hogares con manos expertas",
    storyParagraphs: [
      "RemodelaUSA nació con una idea simple: encontrar un contratista confiable no debería ser una lotería. Los dueños de casa merecen precios claros, trabajos garantizados y tranquilidad en cada proyecto.",
      "Hoy somos el punto de encuentro entre miles de familias y contratistas verificados en los 50 estados. Nosotros hacemos la conexión; los contratistas firman más trabajos y tú transformas tu hogar.",
    ],
    storyTimeline: [
      { value: "12,500+", label: "Proyectos" },
      { value: "3,800+", label: "Contratistas" },
      { value: "50", label: "Estados" },
      { value: "4.8/5", label: "Satisfacción" },
    ],
    storyQuote: {
      prefix: "Compromiso",
      text: "Cada trabajo firmado es una casa transformada y un contratista que hace crecer su negocio.",
      attribution: "Equipo RemodelaUSA",
    },
    storyImage: "/images/museum.png",
    storyImageCaption: "Sala remodelada por un contratista de RemodelaUSA",
  },

  contactForm: {
    scriptText: "Cotiza gratis",
    subtitle: "Sin compromiso",
    mainTitle: "Encuentra tu contratista hoy",
    introText:
      "Cuéntanos sobre tu proyecto y recibe hasta 4 cotizaciones de contratistas verificados en tu área. Es gratis y no te compromete a nada.",
    contactInfoTitle: "¿Prefieres hablar con nosotros?",
    contactInfo: [
      {
        icon: "MapPin",
        label: "Cobertura",
        value: "Todo Estados Unidos",
        subtext: "50 estados y más de 3,800 contratistas",
      },
      {
        icon: "Phone",
        label: "Teléfono",
        value: "+1 (800) 555-0199",
        subtext: "Lun–Sáb de 8:00 AM a 6:00 PM",
      },
      {
        icon: "Mail",
        label: "Correo",
        value: "hola@remodelausa.com",
        subtext: "Respondemos en menos de 24 horas",
      },
      {
        icon: "Clock",
        label: "Cotizaciones",
        value: "En 24 horas",
        subtext: "Hasta 4 propuestas de contratistas",
      },
    ],
    form: {
      nameLabel: "Nombre completo",
      namePlaceholder: "Tu nombre",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      phoneLabel: "Teléfono",
      phonePlaceholder: "+1 (___) ___-____",
      visitDateLabel: "¿Cuándo quieres empezar?",
      visitorsLabel: "Tipo de proyecto",
      visitorsOptions: [
        "Baño",
        "Cocina",
        "Pintura",
        "Concreto",
        "Remodelación completa",
        "Reparación",
      ],
      messageLabel: "Cuéntanos sobre tu proyecto",
      messagePlaceholder: "Describe brevemente qué quieres remodelar o reparar...",
      submitText: "Recibir cotizaciones gratis",
      submittingText: "Enviando...",
      successMessage:
        "¡Listo! Recibimos tu solicitud. Te contactaremos en menos de 24 horas.",
      errorMessage: "Hubo un problema al enviar. Intenta de nuevo.",
    },
    privacyNotice:
      "Al enviar aceptas nuestros Términos y Política de Privacidad. Nunca compartimos tus datos con terceros ajenos a tu proyecto.",
    formEndpoint: "",
  },

  footer: {
    brandName: "RemodelaUSA",
    tagline: "Tu hogar, renovado",
    description:
      "El marketplace que conecta dueños de casa con contratistas verificados en todo Estados Unidos.",
    socialLinks: [
      { icon: "Instagram", label: "Instagram", href: "#" },
      { icon: "Facebook", label: "Facebook", href: "#" },
      { icon: "Twitter", label: "Twitter", href: "#" },
      { icon: "Youtube", label: "YouTube", href: "#" },
    ],
    linkGroups: [
      {
        title: "Servicios",
        links: [
          { name: "Baños", href: "#wines" },
          { name: "Cocinas", href: "#wines" },
          { name: "Pintura", href: "#wines" },
          { name: "Concreto", href: "#wines" },
          { name: "Remodelaciones", href: "#wines" },
        ],
      },
      {
        title: "Compañía",
        links: [
          { name: "Iniciar sesión / Mi cuenta", href: "/account" },
          { name: "Directorio de contratistas", href: "/contractors" },
          { name: "Seguimiento de solicitud", href: "/track" },
          { name: "Portal de contratistas", href: "/portal" },
          { name: "Cómo funciona", href: "#museum" },
          { name: "Calculadora", href: "#calculadora" },
          { name: "Proyectos", href: "#winery" },
          { name: "Opiniones", href: "#news" },
          { name: "Blog", href: "#news" },
          { name: "Contacto", href: "#contact" },
        ],
      },
    ],
    contactItems: [
      { icon: "MapPin", text: "Todo Estados Unidos" },
      { icon: "Phone", text: "+1 (800) 555-0199" },
      { icon: "Mail", text: "hola@remodelausa.com" },
    ],
    newsletterLabel: "Recibe consejos de remodelación",
    newsletterPlaceholder: "Tu correo electrónico",
    newsletterButtonText: "Suscribirme",
    newsletterSuccessText: "¡Gracias por suscribirte!",
    newsletterErrorText: "Error al suscribirte. Intenta de nuevo.",
    newsletterEndpoint: "",
    copyrightText: "© 2026 RemodelaUSA. Todos los derechos reservados.",
    legalLinks: ["Política de Privacidad", "Términos de Uso"],
    icpText: "",
    backToTopText: "Volver arriba",
    ageVerificationText: "Las cotizaciones son gratuitas y sin compromiso.",
  },

  scrollToTop: {
    ariaLabel: "Volver arriba",
  },
};
