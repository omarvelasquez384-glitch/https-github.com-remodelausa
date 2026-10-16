import type { SiteContent } from '../config';

export const ptContent: SiteContent = {
  site: {
    title: "RemodelaUSA — Construtoras de Reforma nos Estados Unidos",
    description:
      "Encontre construtoras revisadas pela nossa equipe para reformas, banheiros, cozinhas, pintura, concreto e reparos na região de Kansas City. Orçamentos grátis e sem compromisso.",
    language: "pt",
    keywords:
      "reforma, construtoras, banheiros, cozinhas, pintura, concreto, reparos, Estados Unidos, orçamento grátis",
    ogImage: "/images/hero-banner.png",
    canonical: "",
  },

  navigation: {
    brandName: "RemodelaUSA",
    brandSubname: "lar renovado",
    tagline: "Construtoras revisadas pela nossa equipe",
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
    accountMenu: {
      label: "Entrar",
      items: [
        { name: "Conta de proprietário", href: "/account" },
        { name: "Conta de construtora", href: "/portal" },
      ],
    },
  },

  preloader: {
    brandName: "RemodelaUSA",
    brandSubname: "lar renovado",
    yearText: "Região de Kansas City",
  },

  hero: {
    scriptText: "Reforme, repare, renove",
    mainTitle: "Sua casa merece\nas melhores mãos",
    ctaButtonText: "Encontre sua construtora",
    ctaTarget: "#contact",
    stats: [], // Sem números inventados: ainda não há projetos nem construtoras suficientes para mostrar estatísticas.
    decorativeText: "Reformas em Kansas City",
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
        aging: "",
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
        aging: "",
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
        aging: "",
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
        aging: "",
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
        aging: "",
      },
    ],
    features: [
      {
        icon: "Sparkles",
        title: "Perfis revisados",
        description:
          "Todo perfil de construtora é revisado pela nossa equipe antes de receber solicitações.",
      },
      {
        icon: "Clock",
        title: "Orçamento grátis, sem compromisso",
        description:
          "Publique seu projeto grátis e receba até 4 orçamentos de construtoras com perfil revisado da sua região. As construtoras respondem direto — o prazo depende de cada construtora.",
      },
      {
        icon: "Thermometer",
        title: "Preços transparentes",
        description:
          "Compare propostas lado a lado com preços claros e avaliações de clientes. Os termos de garantia são acordados direto com sua construtora.",
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
      "Os proprietários publicam seus projetos grátis. Você recebe as solicitações da sua região, faz o orçamento e fecha o trabalho. Seu primeiro lead é grátis; depois, a assinatura é de US$ 150/mês — primeiro mês sem comissão e, a partir do segundo, só 8% dos trabalhos fechados.",
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
          highlight: "Solicitações de clientes na sua região — sem limite mensal",
        },
      },
      {
        id: "verificacion",
        name: "Perfil revisado",
        icon: "Award",
        image: "/images/museum-tab2.png",
        content: {
          title: "Destaque-se com o selo de perfil revisado",
          description:
            "Nossa equipe revisa seu perfil antes de você receber solicitações. Seu perfil revisado aparece primeiro nas buscas e gera confiança desde o primeiro contato.",
          highlight: "Perfis revisados aparecem primeiro nas buscas",
        },
      },
      {
        id: "comision",
        name: "Comissão justa",
        icon: "BookOpen",
        image: "/images/museum-tab3.png",
        content: {
          title: "Primeiro lead grátis, depois taxa fixa",
          description:
            "Criar seu perfil é grátis e seu primeiro lead é grátis. Para continuar recebendo leads, a assinatura é de US$ 150/mês — primeiro mês sem comissão e, a partir do segundo, só 8% dos trabalhos fechados pela plataforma.",
          highlight: "8% apenas de trabalhos fechados a partir do 2.º mês",
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
    founderPhotoAlt: "Construtora da RemodelaUSA",
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
      "A RemodelaUSA nasceu de uma ideia simples: encontrar uma construtora confiável não deveria ser uma loteria. Os proprietários merecem preços claros, comunicação honesta e tranquilidade em cada projeto.",
      "Hoje conectamos proprietários a construtoras revisadas pela nossa equipe na região de Kansas City (Missouri e Kansas). Nós fazemos a conexão; as construtoras fecham mais trabalhos e você transforma sua casa.",
    ],
    storyTimeline: [
      { value: "1", label: "Construtora com perfil revisado" },
      { value: "KC metro", label: "Área de atendimento" },
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
      "Conte-nos sobre seu projeto e receba até 4 orçamentos de construtoras com perfil revisado na sua região. É grátis e sem compromisso.",
    contactInfoTitle: "Prefere falar conosco?",
    contactInfo: [
      {
        icon: "MapPin",
        label: "Cobertura",
        value: "Região de Kansas City",
        subtext: "Missouri e Kansas",
      },
      {
        icon: "Mail",
        label: "E-mail",
        value: "ola@remodelausa.com",
        subtext: "Respondemos o quanto antes",
      },
      {
        icon: "Clock",
        label: "Orçamentos",
        value: "De construtoras",
        subtext: "Até 4 propostas, enviadas direto",
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
        "Pronto! Recebemos sua solicitação. As construtoras atribuídas entrarão em contato direto sobre o seu projeto.",
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
      "O marketplace que conecta proprietários a construtoras revisadas pela nossa equipe na região de Kansas City.",
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
      { icon: "MapPin", text: "Região de Kansas City" },
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
