import type { SiteContent } from '../config';

export const enContent: SiteContent = {
  site: {
    title: "RemodelaUSA — Find Remodeling Contractors Near You",
    description:
      "Find contractors reviewed by our team for remodels, bathrooms, kitchens, painting, concrete, and repairs in the Kansas City area. Free quotes with no obligation.",
    language: "en",
    keywords:
      "remodeling, contractors, bathrooms, kitchens, painting, concrete, repairs, United States, free quote",
    ogImage: "/images/hero-banner.png",
    canonical: "",
  },

  navigation: {
    brandName: "RemodelaUSA",
    brandSubname: "home renewed",
    tagline: "Contractors reviewed by our team",
    navLinks: [
      { name: "Home", href: "#hero", icon: "Home" },
      {
        name: "Services",
        href: "#wines",
        icon: "Grape",
        dropdown: [
          { name: "Bathrooms", href: "#wines" },
          { name: "Kitchens", href: "#wines" },
          { name: "Painting", href: "#wines" },
          { name: "Concrete", href: "#wines" },
          { name: "Full remodels", href: "#wines" },
        ],
      },
      { name: "Projects", href: "#winery", icon: "BookOpen" },
      { name: "Calculator", href: "#calculadora", icon: "Calculator" },
      { name: "Contractors", href: "/contractors", icon: "Users" },
      { name: "Directory", href: "/contractors", icon: "HardHat" },
      { name: "Contact", href: "#contact", icon: "Mail" },
    ],
    ctaButtonText: "Get a free quote",
    accountMenu: {
      label: "Sign in",
      items: [
        { name: "Homeowner account", href: "/account" },
        { name: "Contractor account", href: "/portal" },
      ],
    },
  },

  preloader: {
    brandName: "RemodelaUSA",
    brandSubname: "home renewed",
    yearText: "Kansas City area",
  },

  hero: {
    scriptText: "Remodel, repair, renew",
    mainTitle: "Your home deserves\nthe best hands",
    ctaButtonText: "Find your contractor",
    ctaTarget: "#contact",
    stats: [], // Sin cifras inventadas: no hay proyectos ni contratistas suficientes para mostrar estadísticas.
    decorativeText: "Remodeling in Kansas City",
    backgroundImage: "/images/hero-banner.png",
  },

  wineShowcase: {
    scriptText: "Our services",
    subtitle: "Bathrooms · Kitchens · Painting · Concrete · Repairs",
    mainTitle: "Everything to transform your home",
    wines: [
      {
        id: "banos",
        name: "Bathrooms",
        subtitle: "Your spa at home",
        year: "01",
        image: "/images/servicio-banos.png",
        filter: "",
        glowColor: "bg-sky-500/15",
        description:
          "Turn your bathroom into a relaxing retreat. We handle everything: demolition, plumbing, tile, lighting, and luxury finishes.",
        tastingNotes:
          "Includes: rainfall shower, double vanity, porcelain tile, tub installation, and improved ventilation.",
        alcohol: "$4,500",
        temperature: "2–3 wks",
        aging: "",
      },
      {
        id: "cocinas",
        name: "Kitchens",
        subtitle: "The heart of the home",
        year: "02",
        image: "/images/servicio-cocina.png",
        filter: "",
        glowColor: "bg-amber-500/15",
        description:
          "We design and build the kitchen of your dreams: custom cabinets, quartz countertops, a center island, and warm lighting.",
        tastingNotes:
          "Includes: cabinets, quartz countertop, electrical and gas hookups, new flooring, and tile backsplash.",
        alcohol: "$12,000",
        temperature: "4–6 wks",
        aging: "",
      },
      {
        id: "pintura",
        name: "Painting",
        subtitle: "Color that renews",
        year: "03",
        image: "/images/servicio-pintura.png",
        filter: "",
        glowColor: "bg-emerald-500/15",
        description:
          "Interior and exterior with top-quality paint. We prep every surface for a flawless, long-lasting finish.",
        tastingNotes:
          "Includes: wall repair, sanding, patching, two coats of premium paint, and full cleanup.",
        alcohol: "$1,200",
        temperature: "3–5 days",
        aging: "",
      },
      {
        id: "concreto",
        name: "Concrete",
        subtitle: "Solid and beautiful",
        year: "04",
        image: "/images/servicio-concreto.png",
        filter: "",
        glowColor: "bg-stone-400/15",
        description:
          "Driveways, patios, sidewalks, and foundations. Stamped, polished, or traditional concrete with a professional finish.",
        tastingNotes:
          "Includes: excavation, formwork, steel reinforcement, pouring, stamped finish, and protective sealing.",
        alcohol: "$3,800",
        temperature: "1–2 wks",
        aging: "",
      },
      {
        id: "remodelacion",
        name: "Remodeling",
        subtitle: "A complete change",
        year: "05",
        image: "/images/servicio-remodelacion.png",
        filter: "",
        glowColor: "bg-gold-500/15",
        description:
          "Full-home remodels: additions, new rooms, second stories, or a complete transformation of your house.",
        tastingNotes:
          "Includes: architectural design, permits, full labor, on-site supervision, and luxury finishes.",
        alcohol: "$25,000",
        temperature: "8–12 wks",
        aging: "",
      },
    ],
    features: [
      {
        icon: "Sparkles",
        title: "Reviewed profiles",
        description:
          "Every contractor profile is reviewed by our team before receiving requests.",
      },
      {
        icon: "Clock",
        title: "Free quotes, no obligation",
        description:
          "Post your project for free and receive up to 4 quotes from contractors with reviewed profiles in your area. Contractors reply directly — timing depends on each contractor.",
      },
      {
        icon: "Thermometer",
        title: "Transparent pricing",
        description:
          "Compare proposals side by side with clear prices and scopes of work. Warranty terms are agreed directly with your contractor.",
      },
    ],
  },

  wineryCarousel: {
    scriptText: "Inspiration",
    subtitle: "Project ideas",
    mainTitle: "Ideas for your next transformation",
    locationTag: "Example project",
    slides: [
      {
        image: "/images/slider01.png",
        title: "Modern open kitchen",
        subtitle: "Austin, Texas",
        area: "6",
        unit: "weeks",
        description:
          "From a closed, dark kitchen to an open space with a center island, white cabinets, and quartz counters.",
      },
      {
        image: "/images/slider02.png",
        title: "Spa-like master bathroom",
        subtitle: "Phoenix, Arizona",
        area: "3",
        unit: "weeks",
        description:
          "Freestanding tub, marble tile, and a double shower with natural light: a private spa at home.",
      },
      {
        image: "/images/slider03.png",
        title: "Stamped concrete patio",
        subtitle: "Denver, Colorado",
        area: "10",
        unit: "days",
        description:
          "A completely renovated backyard patio with stamped concrete, string lights, and a lounge area.",
      },
    ],
  },

  museum: {
    scriptText: "For contractors",
    subtitle: "More jobs, less effort",
    mainTitle: "Grow your business with us",
    introText:
      "Homeowners post their projects for free. You receive requests from your area, send quotes and sign the job. Your first lead is free; after that, membership is $150/month — first month with no commission, then 8% only on jobs you sign from the second month.",
    timeline: [
      { year: "Step 1", event: "Create your profile" },
      { year: "Step 2", event: "Receive requests" },
      { year: "Step 3", event: "Quote and sign" },
      { year: "Step 4", event: "Pay commission" },
    ],
    tabs: [
      {
        id: "clientes",
        name: "Client requests",
        icon: "History",
        image: "/images/museum-tab1.png",
        content: {
          title: "Requests from homeowners in your area",
          description:
            "Each request includes the project type, the details, and a desired start date. You talk directly to the homeowner — no middlemen taking your margin.",
          highlight: "Client requests in your area",
        },
      },
      {
        id: "verificacion",
        name: "Reviewed profile",
        icon: "Award",
        image: "/images/museum-tab2.png",
        content: {
          title: "Stand out with the reviewed-profile badge",
          description:
            "Our team reviews your profile before you receive requests. The badge shows homeowners that your profile was reviewed, which builds trust from the first contact. This review is not a verification of licenses or insurance.",
          highlight: "Reviewed-profile badge on your listing",
        },
      },
      {
        id: "comision",
        name: "Fair commission",
        icon: "BookOpen",
        image: "/images/museum-tab3.png",
        content: {
          title: "First lead free, then flat membership",
          description:
            "Creating your profile is free and your first lead is free. To keep receiving leads, membership is $150/month — first month with no commission, then 8% only on jobs you sign through the platform.",
          highlight: "8% only on signed jobs from month 2",
        },
      },
    ],
    openingHours: "Mon–Sat · 8:00 AM – 6:00 PM",
    openingHoursLabel: "Support",
    ctaButtonText: "Join as a contractor",
    yearBadge: "8%",
    yearBadgeLabel: "Commission",
    founderPhotoAlt: "RemodelaUSA contractor",
    founderPhoto: "/images/photo-retro.png",
  },

  news: {
    scriptText: "Blog",
    subtitle: "Tips and trends",
    mainTitle: "Ideas for your next remodel",
    viewAllText: "View all",
    readMoreText: "Read more",
    articles: [
      {
        id: 1,
        image: "/images/news01.png",
        title: "How much does a bathroom remodel cost in 2026?",
        excerpt:
          "Average prices by state, what drives the budget up, and how to save without sacrificing quality.",
        date: "Sep 12, 2026",
        category: "Budgets",
      },
      {
        id: 2,
        image: "/images/news02.png",
        title: "5 signs your bathroom needs a remodel now",
        excerpt:
          "Water stains, cracked tile, and poor ventilation: spot the warning signs early.",
        date: "Aug 28, 2026",
        category: "Bathrooms",
      },
      {
        id: 3,
        image: "/images/news03.png",
        title: "How to choose the right contractor: complete checklist",
        excerpt:
          "The 10 questions to ask before signing, how to verify licenses, and what every contract should include.",
        date: "Aug 15, 2026",
        category: "Guides",
      },
    ],
    storyScriptText: "Our story",
    storySubtitle: "The home marketplace",
    storyTitle: "We connect homes with expert hands",
    storyParagraphs: [
      "RemodelaUSA was born from a simple idea: finding a trustworthy contractor shouldn't be a gamble. Homeowners deserve clear prices, honest communication, and peace of mind on every project.",
      "Today we connect homeowners with contractors reviewed by our team in the Kansas City area (Missouri & Kansas). We make the connection; contractors sign more jobs, and you transform your home.",
    ],
    storyTimeline: [
      { value: "1", label: "Reviewed-profile contractor" },
      { value: "KC metro", label: "Service area" },
    ],
    storyQuote: {
      prefix: "Commitment",
      text: "Every signed job is a transformed home and a contractor growing their business.",
      attribution: "The RemodelaUSA team",
    },
    storyImage: "/images/museum.png",
    storyImageCaption: "Living room remodeling — example photo",
  },

  contactForm: {
    scriptText: "Free quote",
    subtitle: "No commitment",
    mainTitle: "Find your contractor today",
    introText:
      "Tell us about your project and receive up to 4 quotes from contractors with reviewed profiles in your area. It's free and there's no obligation.",
    contactInfoTitle: "Prefer to talk to us?",
    contactInfo: [
      {
        icon: "MapPin",
        label: "Coverage",
        value: "Kansas City area",
        subtext: "Missouri & Kansas",
      },
      {
        icon: "Mail",
        label: "Email",
        value: "hello@remodelausa.com",
        subtext: "We reply as soon as possible",
      },
      {
        icon: "Clock",
        label: "Quotes",
        value: "From contractors",
        subtext: "Up to 4 proposals, sent directly",
      },
    ],
    form: {
      nameLabel: "Full name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@email.com",
      phoneLabel: "Phone",
      phonePlaceholder: "+1 (___) ___-____",
      visitDateLabel: "When do you want to start?",
      visitorsLabel: "Project type",
      visitorsOptions: [
        "Bathroom",
        "Kitchen",
        "Painting",
        "Concrete",
        "Full remodel",
        "Repair",
      ],
      messageLabel: "Tell us about your project",
      messagePlaceholder: "Briefly describe what you want to remodel or repair...",
      submitText: "Get free quotes",
      submittingText: "Sending...",
      successMessage:
        "Done! We received your request. Assigned contractors will contact you directly about your project.",
      errorMessage: "Something went wrong. Please try again.",
    },
    privacyNotice:
      "By submitting you agree to our Terms and Privacy Policy. We never share your data with third parties outside your project.",
    formEndpoint: "",
  },

  footer: {
    brandName: "RemodelaUSA",
    tagline: "Your home, renewed",
    description:
      "The marketplace that connects homeowners with contractors reviewed by our team in the Kansas City area.",
    socialLinks: [],
    linkGroups: [
      {
        title: "Services",
        links: [
          { name: "Bathrooms", href: "#wines" },
          { name: "Kitchens", href: "#wines" },
          { name: "Painting", href: "#wines" },
          { name: "Concrete", href: "#wines" },
          { name: "Remodels", href: "#wines" },
        ],
      },
      {
        title: "Company",
        links: [
          { name: "Log in / My account", href: "/account" },
          { name: "Contractor directory", href: "/contractors" },
          { name: "Track your request", href: "/track" },
          { name: "Contractor portal", href: "/portal" },
          { name: "How it works", href: "#museum" },
          { name: "Calculator", href: "#calculadora" },
          { name: "Projects", href: "#winery" },
          { name: "Blog", href: "#news" },
          { name: "Contact", href: "#contact" },
        ],
      },
    ],
    contactItems: [
      { icon: "MapPin", text: "Kansas City, MO, USA" },
      { icon: "MapPin", text: "[Business mailing address — to be confirmed]" },
      { icon: "Mail", text: "hello@remodelausa.com" },
    ],
    newsletterLabel: "Get remodeling tips",
    newsletterPlaceholder: "Your email",
    newsletterButtonText: "Subscribe",
    newsletterSuccessText: "Thanks for subscribing!",
    newsletterErrorText: "Subscription failed. Please try again.",
    newsletterEndpoint: "",
    copyrightText: "© 2026 RemodelaUSA. All rights reserved.",
    legalLinks: ["Privacy Policy", "Terms of Use", "Cookie Policy", "Refund Policy"],
    icpText: "",
    backToTopText: "Back to top",
    ageVerificationText: "Quotes are free and carry no obligation.",
  },

  scrollToTop: {
    ariaLabel: "Back to top",
  },
};
