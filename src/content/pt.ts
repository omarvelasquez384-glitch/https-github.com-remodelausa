import type { SiteContent } from '../config';

export const ptContent: SiteContent = {
  site: {
    title: "RemodelaUSA — Construtoras de Reforma nos Estados Unidos",
    description:
      "Encontre construtoras verificadas para reformas, banheiros, cozinhas, pintura, concreto e reparos em todo os Estados Unidos. Orçamentos grátis em 24 horas.",
    language: "pt",
    keywords:
      "reforma, construtoras, banheiros, cozinhas, pintura, concreto, reparos, Estados Unidos, orçamento grátis",
    ogImage: "/images/hero-banner.png",
    canonical: "",
  },

  navigation: {
    brandName: "RemodelaUSA",
    brandSubname: "lar renovado",
    tagline: "Construtoras verificadas em todo os EUA",
    navLinks: [
      { name: "Início", href: "#hero", icon: "Home" },
      {
        name: "Serviços",
        href: "#wines",
        icon: "Grape",
        dropdown: [
          { name: "Banheiros", href: "#wines" },
          { name: "Cozinhas", href: "#wines" },
          { name: "Pintura", href: "#wines" },
          { name: "Concreto", href: "#wines" },
          { name: "Reformas completas", href: "#wines" },
        ],
      },
      { name: "Projetos", href: "#winery", icon: "BookOpen" },
      { name: "Calculadora", href: "#calculadora", icon: "Calculator" },
      { name: "Construtoras", href: "#museum", icon: "Users" },
      { name: "Diretório", href: "/contractors", icon: "HardHat" },
      { name: "Avaliações", href: "#news", icon: "Newspaper" },
      { name: "Contato", href: "#contact", icon: "Mail" },
    ],
    ctaButtonText: "Orçamento grátis",
  },

  preloader: {
    brandName: "RemodelaUSA",
    brandSubname: "lar renovado",
    yearText: "Em todo os EUA",
  },

  hero: {
    scriptText: "Reforme, repare, renove",
    mainTitle: "Sua casa merece\nas melhores mãos",
    ctaButtonText: "Encontre sua construtora",
    ctaTarget: "#contact",
    stats: [
      { value: 12500, suffix: "+", label: "Projetos concluídos" },
      { value: 3800, suffix: "+", label: "Construtoras verificadas" },
      { value: 50, suffix: "", label: "Estados cobertos" },
    ],
    decorativeText: "Reformas em todo os EUA",
    backgroundImage: "/images/hero-banner.png",
  },

  wineShowcase: {
    scriptText: "Nossos serviços",
    subtitle: "Banheiros · Cozinhas · Pintura · Concreto · Reparos",
    mainTitle: "Tudo para transformar sua casa",
    wines: [
      {
        id: "banos",
        name: "Banheiros",
        subtitle: "Seu spa em casa",
        year: "01",
        image: "/images/servicio-banos.png",
        filter: "",
        glowColor: "bg-sky-500/15",
        description:
          "Transforme seu banheiro em um refúgio de relaxamento. Cuidamos de tudo: demolição, encanamento, azulejo, iluminação e acabamentos de luxo.",
        tastingNotes:
          "Inclui: chuveiro tipo chuva, dupla cuba, azulejo de porcelana, instalação de banheira e ventilação melhorada.",
        alcohol: "$4.500",
        temperature: "2–3 sem",
        aging: "1 ano",
      },
      {
        id: "cocinas",
        name: "Cozinhas",
        subtitle: "O coração da casa",
        year: "02",
        image: "/images/servicio-cocina.png",
        filter: "",
        glowColor: "bg-amber-500/15",
        description:
          "Projetamos e construímos a cozinha dos seus sonhos: armários sob medida, bancadas de quartzo, ilha central e iluminação aconchegante.",
        tastingNotes:
          "Inclui: armários, bancada de quartzo, instalação elétrica e de gás, piso novo e revestimento de azulejo.",
        alcohol: "$12.000",
        temperature: "4–6 sem",
        aging: "1 ano",
      },
      {
        id: "pintura",
        name: "Pintura",
        subtitle: "Cor que renova",
        year: "03",
        image: "/images/servicio-pintura.png",
        filter: "",
        glowColor: "bg-emerald-500/15",
        description:
          "Interior e exterior com tinta de primeira qualidade. Preparamos cada superfície para um acabamento impecável e duradouro.",
        tastingNotes:
          "Inclui: reparo de paredes, lixamento, massa corrida, duas demãos de tinta premium e limpeza completa.",
        alcohol: "$1.200",
        temperature: "3–5 dias",
        aging: "2 anos",
      },
      {
        id: "concreto",
        name: "Concreto",
        subtitle: "Base sólida e bonita",
        year: "04",
        image: "/images/servicio-concreto.png",
        filter: "",
        glowColor: "bg-stone-400/15",
        description:
          "Entradas de garagem, pátios, calçadas e fundações. Concreto estampado, polido ou tradicional com acabamento profissional.",
        tastingNotes:
          "Inclui: escavação, forma, armação de aço, concretagem, acabamento estampado e selagem protetora.",
        alcohol: "$3.800",
        temperature: "1–2 sem",
        aging: "5 anos",
      },
      {
        id: "remodelacion",
        name: "Reforma",
        subtitle: "Mudança completa",
        year: "05",
        image: "/images/servicio-remodelacion.png",
        filter: "",
        glowColor: "bg-gold-500/15",
        description:
          "Reformas integrais: ampliações, novos cômodos, segundo pavimento ou a transformação completa da sua casa.",
        tastingNotes:
          "Inclui: projeto arquitetônico, alvarás, mão de obra completa, supervisão de obra e acabamentos de luxo.",
        alcohol: "$25.000",
        temperature: "8–12 sem",
        aging: "1 ano",
      },
    ],
    features: [
      {
        icon: "Sparkles",
        title: "Construtoras verificadas",
        description:
          "Toda construtora passa por verificação de licença, seguro e antecedentes antes de receber solicitações.",
      },
      {
        icon: "Clock",
        title: "Orçamento em 24 horas",
        description:
          "Publique seu projeto grátis e receba até 4 orçamentos de construtoras da sua região em menos de um dia.",
      },
      {
        icon: "Thermometer",
        title: "Preços transparentes",
        description:
          "Compare propostas lado a lado com preços claros, garantias por escrito e avaliações reais de clientes.",
      },
    ],
    quote: {
      text: "Comparei quatro orçamentos em um único dia e escolhi a melhor construtora sem sair de casa.",
      attribution: "Maria G., Houston, TX",
      prefix: "Histórias reais",
    },
  },

  wineryCarousel: {
    scriptText: "Inspiração",
    subtitle: "Projetos reais",
    mainTitle: "Transformações que falam por si",
    locationTag: "Em todo os Estados Unidos",
    slides: [
      {
        image: "/images/slider01.png",
        title: "Cozinha aberta moderna",
        subtitle: "Austin, Texas",
        area: "6",
        unit: "semanas",
        description:
          "De uma cozinha fechada e escura para um espaço aberto com ilha central, armários brancos e bancada de quartzo.",
      },
      {
        image: "/images/slider02.png",
        title: "Banheiro principal tipo spa",
        subtitle: "Phoenix, Arizona",
        area: "3",
        unit: "semanas",
        description:
          "Banheira exenta, azulejo de mármore e chuveiro duplo com luz natural: um spa privativo em casa.",
      },
      {
        image: "/images/slider03.png",
        title: "Pátio de concreto estampado",
        subtitle: "Denver, Colorado",
        area: "10",
        unit: "dias",
        description:
          "Quintal completamente renovado com concreto estampado, luzes penduradas e área de descanso.",
      },
    ],
  },

  museum: {
    scriptText: "Para construtoras",
    subtitle: "Mais trabalhos, menos esforço",
    mainTitle: "Faça seu negócio crescer conosco",
    introText:
      "Os proprietários publicam seus projetos grátis. Você recebe as solicitações da sua região, faz o orçamento, fecha o trabalho e só então paga uma comissão. Sem mensalidades, sem risco.",
    timeline: [
      { year: "Passo 1", event: "Crie seu perfil" },
      { year: "Passo 2", event: "Receba solicitações" },
      { year: "Passo 3", event: "Orce e feche" },
      { year: "Passo 4", event: "Pague a comissão" },
    ],
    tabs: [
      {
        id: "clientes",
        name: "Clientes reais",
        icon: "History",
        image: "/images/museum-tab1.png",
        content: {
          title: "Solicitações de clientes prontos para contratar",
          description:
            "Cada solicitação vem com fotos, orçamento estimado e data desejada de início. Você fala direto com o proprietário, sem intermediários tirando sua margem.",
          highlight: "Até 15 solicitações por mês na sua região",
        },
      },
      {
        id: "verificacion",
        name: "Perfil verificado",
        icon: "Award",
        image: "/images/museum-tab2.png",
        content: {
          title: "Destaque-se com o selo de verificado",
          description:
            "Verificamos sua licença, seguro e antecedentes. Seu perfil verificado aparece primeiro nas buscas e gera confiança desde o primeiro contato.",
          highlight: "Perfis verificados fecham 3× mais trabalhos",
        },
      },
      {
        id: "comision",
        name: "Comissão justa",
        icon: "BookOpen",
        image: "/images/museum-tab3.png",
        content: {
          title: "Pague apenas quando fechar o trabalho",
          description:
            "Criar seu perfil é grátis. Você só paga uma comissão de 8% sobre os trabalhos fechados pela plataforma. Se não fechar, não paga nada.",
          highlight: "0% de comissão se não fechar",
        },
      },
    ],
    openingHours: "Seg–Sáb · 8:00 – 18:00",
    openingHoursLabel: "Suporte",
    ctaButtonText: "Cadastre-se como construtora",
    yearBadge: "8%",
    yearBadgeLabel: "Comissão",
    quote: {
      prefix: "Mais trabalhos",
      text: "Dobrei meus projetos em seis meses. As solicitações chegam direto no meu celular e eu decido quais orçar.",
      attribution: "Carlos R., Construtor geral, Miami, FL",
    },
    founderPhotoAlt: "Construtora verificada da RemodelaUSA",
    founderPhoto: "/images/photo-retro.png",
  },

  news: {
    scriptText: "Blog",
    subtitle: "Dicas e tendências",
    mainTitle: "Ideias para sua próxima reforma",
    viewAllText: "Ver todos",
    readMoreText: "Ler mais",
    articles: [
      {
        id: 1,
        image: "/images/news01.png",
        title: "Quanto custa reformar um banheiro em 2026?",
        excerpt:
          "Preços médios por estado, o que aumenta o orçamento e como economizar sem sacrificar a qualidade.",
        date: "12 Set 2026",
        category: "Orçamentos",
      },
      {
        id: 2,
        image: "/images/news02.png",
        title: "5 sinais de que seu banheiro precisa de reforma já",
        excerpt:
          "Manchas de umidade, azulejo rachado e má ventilação: identifique os sinais de alerta a tempo.",
        date: "28 Ago 2026",
        category: "Banheiros",
      },
      {
        id: 3,
        image: "/images/news03.png",
        title: "Como escolher a construtora certa: checklist completo",
        excerpt:
          "As 10 perguntas que você deve fazer antes de assinar, como verificar licenças e o que todo contrato deve incluir.",
        date: "15 Ago 2026",
        category: "Guias",
      },
    ],
    testimonialsScriptText: "Avaliações",
    testimonialsSubtitle: "Clientes felizes",
    testimonialsMainTitle: "O que dizem os proprietários",
    testimonials: [
      {
        name: "Maria Gonzalez",
        role: "Houston, TX",
        text: "Publiquei meu projeto numa segunda e na quarta já tinha três orçamentos. A construtora que escolhi deixou meu banheiro lindo e respeitou o orçamento ao centavo.",
        rating: 5,
      },
      {
        name: "James Wilson",
        role: "Atlanta, GA",
        text: "O que mais gostei foi a verificação: sabia que cada construtora tinha licença e seguro. A pintura da minha casa ficou perfeita.",
        rating: 5,
      },
      {
        name: "Ana Martinez",
        role: "San Diego, CA",
        text: "A entrada de concreto estampado ficou melhor que nas fotos. Preço justo, trabalho limpo e garantia por escrito.",
        rating: 4,
      },
    ],
    storyScriptText: "Nossa história",
    storySubtitle: "O marketplace do lar",
    storyTitle: "Conectamos lares a mãos especializadas",
    storyParagraphs: [
      "A RemodelaUSA nasceu de uma ideia simples: encontrar uma construtora confiável não deveria ser uma loteria. Os proprietários merecem preços claros, trabalhos garantidos e tranquilidade em cada projeto.",
      "Hoje somos o ponto de encontro entre milhares de famílias e construtoras verificadas nos 50 estados. Nós fazemos a conexão; as construtoras fecham mais trabalhos e você transforma sua casa.",
    ],
    storyTimeline: [
      { value: "12.500+", label: "Projetos" },
      { value: "3.800+", label: "Construtoras" },
      { value: "50", label: "Estados" },
      { value: "4.8/5", label: "Satisfação" },
    ],
    storyQuote: {
      prefix: "Compromisso",
      text: "Cada trabalho fechado é uma casa transformada e uma construtora fazendo seu negócio crescer.",
      attribution: "Equipe RemodelaUSA",
    },
    storyImage: "/images/museum.png",
    storyImageCaption: "Sala reformada por uma construtora da RemodelaUSA",
  },

  contactForm: {
    scriptText: "Orçamento grátis",
    subtitle: "Sem compromisso",
    mainTitle: "Encontre sua construtora hoje",
    introText:
      "Conte-nos sobre seu projeto e receba até 4 orçamentos de construtoras verificadas na sua região. É grátis e sem compromisso.",
    contactInfoTitle: "Prefere falar conosco?",
    contactInfo: [
      {
        icon: "MapPin",
        label: "Cobertura",
        value: "Todo os Estados Unidos",
        subtext: "50 estados e mais de 3.800 construtoras",
      },
      {
        icon: "Phone",
        label: "Telefone",
        value: "+1 (800) 555-0199",
        subtext: "Seg–Sáb, 8:00 – 18:00",
      },
      {
        icon: "Mail",
        label: "E-mail",
        value: "ola@remodelausa.com",
        subtext: "Respondemos em menos de 24 horas",
      },
      {
        icon: "Clock",
        label: "Orçamentos",
        value: "Em 24 horas",
        subtext: "Até 4 propostas de construtoras",
      },
    ],
    form: {
      nameLabel: "Nome completo",
      namePlaceholder: "Seu nome",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@email.com",
      phoneLabel: "Telefone",
      phonePlaceholder: "+1 (___) ___-____",
      visitDateLabel: "Quando quer começar?",
      visitorsLabel: "Tipo de projeto",
      visitorsOptions: [
        "Banheiro",
        "Cozinha",
        "Pintura",
        "Concreto",
        "Reforma completa",
        "Reparo",
      ],
      messageLabel: "Conte-nos sobre seu projeto",
      messagePlaceholder: "Descreva brevemente o que quer reformar ou reparar...",
      submitText: "Receber orçamentos grátis",
      submittingText: "Enviando...",
      successMessage:
        "Pronto! Recebemos sua solicitação. Entraremos em contato em menos de 24 horas.",
      errorMessage: "Ocorreu um problema ao enviar. Tente novamente.",
    },
    privacyNotice:
      "Ao enviar você aceita nossos Termos e Política de Privacidade. Nunca compartilhamos seus dados com terceiros alheios ao seu projeto.",
    formEndpoint: "",
  },

  footer: {
    brandName: "RemodelaUSA",
    tagline: "Seu lar, renovado",
    description:
      "O marketplace que conecta proprietários a construtoras verificadas em todo os Estados Unidos.",
    socialLinks: [
      { icon: "Instagram", label: "Instagram", href: "#" },
      { icon: "Facebook", label: "Facebook", href: "#" },
      { icon: "Twitter", label: "Twitter", href: "#" },
      { icon: "Youtube", label: "YouTube", href: "#" },
    ],
    linkGroups: [
      {
        title: "Serviços",
        links: [
          { name: "Banheiros", href: "#wines" },
          { name: "Cozinhas", href: "#wines" },
          { name: "Pintura", href: "#wines" },
          { name: "Concreto", href: "#wines" },
          { name: "Reformas", href: "#wines" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { name: "Entrar / Minha conta", href: "/account" },
          { name: "Diretório de construtoras", href: "/contractors" },
          { name: "Acompanhar solicitação", href: "/track" },
          { name: "Portal da construtora", href: "/portal" },
          { name: "Como funciona", href: "#museum" },
          { name: "Calculadora", href: "#calculadora" },
          { name: "Projetos", href: "#winery" },
          { name: "Avaliações", href: "#news" },
          { name: "Blog", href: "#news" },
          { name: "Contato", href: "#contact" },
        ],
      },
    ],
    contactItems: [
      { icon: "MapPin", text: "Todo os Estados Unidos" },
      { icon: "Phone", text: "+1 (800) 555-0199" },
      { icon: "Mail", text: "ola@remodelausa.com" },
    ],
    newsletterLabel: "Receba dicas de reforma",
    newsletterPlaceholder: "Seu e-mail",
    newsletterButtonText: "Assinar",
    newsletterSuccessText: "Obrigado por assinar!",
    newsletterErrorText: "Falha ao assinar. Tente novamente.",
    newsletterEndpoint: "",
    copyrightText: "© 2026 RemodelaUSA. Todos os direitos reservados.",
    legalLinks: ["Política de Privacidade", "Termos de Uso"],
    icpText: "",
    backToTopText: "Voltar ao topo",
    ageVerificationText: "Os orçamentos são gratuitos e sem compromisso.",
  },

  scrollToTop: {
    ariaLabel: "Voltar ao topo",
  },
};
