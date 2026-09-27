import type { SiteContent } from '../config';

export const enContent: SiteContent = {
  site: {
    title: "RemodelaUSA — Home Remodeling Contractors Across the United States",
    description:
      "Find verified contractors for remodels, bathrooms, kitchens, painting, concrete, and repairs anywhere in the United States. Free quotes within 24 hours.",
    language: "en",
    keywords:
      "remodeling, contractors, bathrooms, kitchens, painting, concrete, repairs, United States, free quote",
    ogImage: "/images/hero-banner.png",
    canonical: "",
  },

  navigation: {
    brandName: "RemodelaUSA",
    brandSubname: "home renewed",
    tagline: "Verified contractors across the U.S.",
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
      { name: "Contractors", href: "#museum", icon: "Users" },
      { name: "Directory", href: "/contractors", icon: "HardHat" },
      { name: "Reviews", href: "#news", icon: "Newspaper" },
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
    yearText: "Across the U.S.",
  },

  hero: {
    scriptText: "Remodel, repair, renew",
    mainTitle: "Your home deserves\nthe best hands",
    ctaButtonText: "Find your contractor",
    ctaTarget: "#contact",
    stats: [
      { value: 12500, suffix: "+", label: "Projects completed" },
      { value: 3800, suffix: "+", label: "Verified contractors" },
      { value: 50, suffix: "", label: "States covered" },
    ],
    decorativeText: "Remodeling across the U.S.",
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
        aging: "1 yr",
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
        aging: "1 yr",
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
        aging: "2 yrs",
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
        aging: "5 yrs",
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
        aging: "1 yr",
      },
    ],
    features: [
      {
        icon: "Sparkles",
        title: "Verified contractors",
        description:
          "Every contractor goes through license, insurance, and background checks before receiving requests.",
      },
      {
        icon: "Clock",
        title: "Quotes in 24 hours",
        description:
          "Post your project for free and receive up to 4 quotes from contractors in your area within a day.",
      },
      {
        icon: "Thermometer",
        title: "Transparent pricing",
        description:
          "Compare proposals side by side with clear prices, written warranties, and real customer reviews.",
      },
    ],
    quote: {
      text: "I compared four quotes in a single day and picked the best contractor without leaving home.",
      attribution: "Maria G., Houston, TX",
      prefix: "Real stories",
    },
  },

  wineryCarousel: {
    scriptText: "Inspiration",
    subtitle: "Real projects",
    mainTitle: "Transformations that speak for themselves",
    locationTag: "Across the United States",
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
      "Homeowners post their projects for free. You receive requests from your area, send quotes, sign the job, and only then pay a commission. No monthly fees, no risk.",
    timeline: [
      { year: "Step 1", event: "Create your profile" },
      { year: "Step 2", event: "Receive requests" },
      { year: "Step 3", event: "Quote and sign" },
      { year: "Step 4", event: "Pay commission" },
    ],
    tabs: [
      {
        id: "clientes",
        name: "Real clients",
        icon: "History",
        image: "/images/museum-tab1.png",
        content: {
          title: "Requests from clients ready to hire",
          description:
            "Every request comes with photos, an estimated budget, and a desired start date. You talk directly to the homeowner — no middlemen taking your margin.",
          highlight: "Up to 15 requests per month in your area",
        },
      },
      {
        id: "verificacion",
        name: "Verified profile",
        icon: "Award",
        image: "/images/museum-tab2.png",
        content: {
          title: "Stand out with the verified badge",
          description:
            "We verify your license, insurance, and background. Your verified profile ranks first in searches and builds trust from the first contact.",
          highlight: "Verified profiles sign 3× more jobs",
        },
      },
      {
        id: "comision",
        name: "Fair commission",
        icon: "BookOpen",
        image: "/images/museum-tab3.png",
        content: {
          title: "Pay only when you sign the job",
          description:
            "Creating your profile is free. You only pay an 8% commission on jobs signed through the platform. If you don't sign, you don't pay.",
          highlight: "0% commission if you don't sign",
        },
      },
    ],
    openingHours: "Mon–Sat · 8:00 AM – 6:00 PM",
    openingHoursLabel: "Support",
    ctaButtonText: "Join as a contractor",
    yearBadge: "8%",
    yearBadgeLabel: "Commission",
    quote: {
      prefix: "More jobs",
      text: "I doubled my projects in six months. Requests arrive straight to my phone and I decide which ones to quote.",
      attribution: "Carlos R., General contractor, Miami, FL",
    },
    founderPhotoAlt: "Verified RemodelaUSA contractor",
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
    testimonialsScriptText: "Reviews",
    testimonialsSubtitle: "Happy customers",
    testimonialsMainTitle: "What homeowners say",
    testimonials: [
      {
        name: "Maria Gonzalez",
        role: "Houston, TX",
        text: "I posted my project on Monday and had three quotes by Wednesday. The contractor I chose left my bathroom beautiful and hit the budget to the penny.",
        rating: 5,
      },
      {
        name: "James Wilson",
        role: "Atlanta, GA",
        text: "What I liked most was the verification: I knew every contractor had a license and insurance. The paint job on my house came out perfect.",
        rating: 5,
      },
      {
        name: "Ana Martinez",
        role: "San Diego, CA",
        text: "The stamped concrete driveway looks better than the photos. Fair price, clean work, and a written warranty.",
        rating: 4,
      },
    ],
    storyScriptText: "Our story",
    storySubtitle: "The home marketplace",
    storyTitle: "We connect homes with expert hands",
    storyParagraphs: [
      "RemodelaUSA was born from a simple idea: finding a trustworthy contractor shouldn't be a gamble. Homeowners deserve clear prices, guaranteed work, and peace of mind on every project.",
      "Today we are the meeting point between thousands of families and verified contractors in all 50 states. We make the connection; contractors sign more jobs, and you transform your home.",
    ],
    storyTimeline: [
      { value: "12,500+", label: "Projects" },
      { value: "3,800+", label: "Contractors" },
      { value: "50", label: "States" },
      { value: "4.8/5", label: "Satisfaction" },
    ],
    storyQuote: {
      prefix: "Commitment",
      text: "Every signed job is a transformed home and a contractor growing their business.",
      attribution: "The RemodelaUSA team",
    },
    storyImage: "/images/museum.png",
    storyImageCaption: "Living room remodeled by a RemodelaUSA contractor",
  },

  contactForm: {
    scriptText: "Free quote",
    subtitle: "No commitment",
    mainTitle: "Find your contractor today",
    introText:
      "Tell us about your project and receive up to 4 quotes from verified contractors in your area. It's free and there's no obligation.",
    contactInfoTitle: "Prefer to talk to us?",
    contactInfo: [
      {
        icon: "MapPin",
        label: "Coverage",
        value: "All United States",
        subtext: "50 states and over 3,800 contractors",
      },
      {
        icon: "Phone",
        label: "Phone",
        value: "+1 (800) 555-0199",
        subtext: "Mon–Sat, 8:00 AM – 6:00 PM",
      },
      {
        icon: "Mail",
        label: "Email",
        value: "hello@remodelausa.com",
        subtext: "We reply within 24 hours",
      },
      {
        icon: "Clock",
        label: "Quotes",
        value: "Within 24 hours",
        subtext: "Up to 4 contractor proposals",
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
        "Done! We received your request. We'll contact you within 24 hours.",
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
      "The marketplace that connects homeowners with verified contractors across the United States.",
    socialLinks: [
      { icon: "Instagram", label: "Instagram", href: "#" },
      { icon: "Facebook", label: "Facebook", href: "#" },
      { icon: "Twitter", label: "Twitter", href: "#" },
      { icon: "Youtube", label: "YouTube", href: "#" },
    ],
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
          { name: "Reviews", href: "#news" },
          { name: "Blog", href: "#news" },
          { name: "Contact", href: "#contact" },
        ],
      },
    ],
    contactItems: [
      { icon: "MapPin", text: "All United States" },
      { icon: "Phone", text: "+1 (800) 555-0199" },
      { icon: "Mail", text: "hello@remodelausa.com" },
    ],
    newsletterLabel: "Get remodeling tips",
    newsletterPlaceholder: "Your email",
    newsletterButtonText: "Subscribe",
    newsletterSuccessText: "Thanks for subscribing!",
    newsletterErrorText: "Subscription failed. Please try again.",
    newsletterEndpoint: "",
    copyrightText: "© 2026 RemodelaUSA. All rights reserved.",
    legalLinks: ["Privacy Policy", "Terms of Use"],
    icpText: "",
    backToTopText: "Back to top",
    ageVerificationText: "Quotes are free and carry no obligation.",
  },

  scrollToTop: {
    ariaLabel: "Back to top",
  },
};
