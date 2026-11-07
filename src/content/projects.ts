import type { Localized } from "./types";

export type Project = {
  slug: string;
  title: Localized;
  category: Localized;
  context: Localized;
  year?: string;
  video: string;
  poster: string;
  description: Localized;
  tech: string[];
  features: Localized<string[]>;
};

export const projects: Project[] = [
  {
    slug: "offcut",
    title: { en: "OFFCUT", fr: "OFFCUT" },
    category: { en: "E-commerce Template", fr: "Template e-commerce" },
    context: {
      en: "Studio template · Storefront + Brand Studio",
      fr: "Template studio · Boutique + Brand Studio",
    },
    year: "2026",
    video: "/media/videos/offcut.mp4",
    poster: "/media/posters/offcut.jpg",
    description: {
      en: "A clothing storefront built to be rebranded, showcased here as OFFCUT. One codebase serves any fashion brand: a built-in Studio lets me edit products, colors, typography and copy with a live preview, then export a clean, standalone project for each client.",
      fr: "Une boutique de vêtements conçue pour être rebrandée, présentée ici sous la marque OFFCUT. Une seule base de code pour n'importe quelle marque de mode : un Studio intégré me permet de modifier produits, couleurs, typographie et textes avec un aperçu en direct, puis d'exporter un projet autonome et propre pour chaque client.",
    },
    tech: ["Next.js", "React", "Tailwind CSS", "GSAP", "Motion"],
    features: {
      en: [
        "Interactive product carousel with drag, swipe and keyboard",
        "Slide-in product panel with sizes, colorways and cart",
        "Studio admin for products, colors and per-size stock",
        "Brand editor with palettes, typography and contrast checks",
        "Config-driven and export-ready for any clothing brand",
      ],
      fr: [
        "Carrousel produits interactif au glisser, au swipe et au clavier",
        "Panneau produit avec tailles, coloris et panier",
        "Studio d'administration pour produits, couleurs et stock par taille",
        "Éditeur de marque avec palettes, typographie et contrôle des contrastes",
        "Piloté par configuration et exportable pour toute marque de vêtements",
      ],
    },
  },
  {
    slug: "stryd",
    title: { en: "STRYD.", fr: "STRYD." },
    category: { en: "Sneaker Storefront", fr: "Boutique de sneakers" },
    context: {
      en: "Studio template · Storefront + Brand Studio",
      fr: "Template studio · Boutique + Brand Studio",
    },
    year: "2026",
    video: "/media/videos/stryd.mp4",
    poster: "/media/posters/stryd.jpg",
    description: {
      en: "A sneaker storefront that turns the catalogue into an online showroom: every pair sits on a lit shelf, and the camera zooms in when you pick one. A local Brand Studio launches the store for any brand — theme, lighting, products from plain photos — and exports it as a standalone Next.js project.",
      fr: "Une boutique de sneakers qui transforme le catalogue en showroom en ligne : chaque paire repose sur une étagère éclairée, et la caméra zoome quand on en choisit une. Un Brand Studio local lance la boutique pour n'importe quelle marque — thème, éclairage, produits à partir de simples photos — et l'exporte en projet Next.js autonome.",
    },
    tech: ["Next.js", "React", "Motion", "View Transitions", "On-device AI"],
    features: {
      en: [
        "Showroom wall with a camera zoom into each pair",
        "Scroll-driven featured drop and full-catalogue rack",
        "Brand Studio for theme, lighting, text and wall layout",
        "Products from plain photos, background removed on-device by AI",
        "One-click export to a clean, standalone Next.js project",
      ],
      fr: [
        "Mur showroom avec zoom caméra sur chaque paire",
        "Drop vedette et rayon complet animés au scroll",
        "Brand Studio pour le thème, l'éclairage, les textes et la disposition",
        "Produits à partir de simples photos, détourés sur l'appareil par IA",
        "Export en un clic vers un projet Next.js autonome et propre",
      ],
    },
  },
  {
    slug: "maison-doree",
    title: { en: "Maison Dorée", fr: "Maison Dorée" },
    category: { en: "Restaurant Website", fr: "Site de restaurant" },
    context: {
      en: "Studio template · Showcase",
      fr: "Template studio · Vitrine",
    },
    year: "2026",
    video: "/media/videos/maison-doree.mp4",
    poster: "/media/posters/maison-doree.jpg",
    description: {
      en: "A premium restaurant website template built with Next.js, showcased here as Maison Dorée. Through my studio, I adapt it end to end — branding, menu and content — for each restaurant brand.",
      fr: "Un template de site de restaurant haut de gamme développé avec Next.js, présenté ici sous la marque Maison Dorée. Via mon studio, je l'adapte entièrement — identité, menu et contenus — à chaque restaurant.",
    },
    tech: ["Next.js", "Vercel"],
    features: {
      en: [
        "Elegant dark, editorial design",
        "Signature dishes by category",
        "Interactive flip-book menu",
        "Visit section with address, hours and contact",
        "Fully rebrandable for any restaurant",
      ],
      fr: [
        "Design sombre et éditorial raffiné",
        "Plats signatures par catégorie",
        "Menu interactif à feuilleter",
        "Section visite avec adresse, horaires et contact",
        "Entièrement personnalisable pour chaque restaurant",
      ],
    },
  },
  {
    slug: "erp-system",
    title: { en: "ERP System", fr: "Système ERP" },
    category: { en: "Human Resources", fr: "Ressources humaines" },
    context: {
      en: "Internship · Tunisia Smart Solutions",
      fr: "Stage · Tunisia Smart Solutions",
    },
    year: "2024 – 2025",
    video: "/media/videos/erp.mp4",
    poster: "/media/posters/erp.jpg",
    description: {
      en: "A fullstack human resource management web application built during my internship at Tunisia Smart Solutions, using Scrum and Laravel.",
      fr: "Une application web fullstack de gestion des ressources humaines développée lors de mon stage chez Tunisia Smart Solutions, en Scrum et Laravel.",
    },
    tech: ["Laravel", "JavaScript", "MySQL", "HTML", "CSS"],
    features: {
      en: [
        "Dynamic role-based access control",
        "Multi-level validation workflows",
        "Real-time internal chat",
        "User management and authentication",
        "Responsive operations dashboard",
      ],
      fr: [
        "Contrôle d'accès dynamique par rôles",
        "Workflows de validation multi-niveaux",
        "Chat interne en temps réel",
        "Gestion des utilisateurs et authentification",
        "Tableau de bord opérationnel responsive",
      ],
    },
  },
  {
    slug: "jarvis",
    title: { en: "J.A.R.V.I.S.", fr: "J.A.R.V.I.S." },
    category: { en: "AI Voice Assistant", fr: "Assistant vocal IA" },
    context: { en: "Personal project", fr: "Projet personnel" },
    video: "/media/videos/jarvis.mp4",
    poster: "/media/posters/jarvis.jpg",
    description: {
      en: "A fully local AI voice assistant in Python, using Faster-Whisper, Ollama (Qwen2.5) and Piper for speech recognition, conversation and text-to-speech.",
      fr: "Un assistant vocal IA entièrement local en Python, utilisant Faster-Whisper, Ollama (Qwen2.5) et Piper pour la reconnaissance vocale, la conversation et la synthèse vocale.",
    },
    tech: ["Python", "Faster-Whisper", "Ollama", "Piper"],
    features: {
      en: [
        "Fully offline speech-to-text and text-to-speech",
        "Conversational AI with Qwen2.5 via Ollama",
        "Modular architecture for long-term memory",
        "Tool and function calling",
        "Local system task automation",
      ],
      fr: [
        "Reconnaissance et synthèse vocales 100 % hors ligne",
        "IA conversationnelle Qwen2.5 via Ollama",
        "Architecture modulaire avec mémoire long terme",
        "Appel d'outils et de fonctions",
        "Automatisation de tâches système locales",
      ],
    },
  },
  {
    slug: "unijob",
    title: { en: "UniJob", fr: "UniJob" },
    category: { en: "Job Portal", fr: "Portail d'emploi" },
    context: {
      en: "Freelance · ISCAE student group",
      fr: "Freelance · Groupe d'étudiants ISCAE",
    },
    video: "/media/videos/unijob.mp4",
    poster: "/media/posters/unijob.jpg",
    description: {
      en: "A fullstack portal linking students and employers for internships and part-time work, built as a freelance project for an ISCAE students group.",
      fr: "Un portail fullstack reliant étudiants et employeurs pour les stages et jobs à temps partiel, réalisé en freelance pour un groupe d'étudiants de l'ISCAE.",
    },
    tech: ["Laravel", "Vue.js", "SQLite", "Vite"],
    features: {
      en: [
        "Students browse jobs and apply with CVs",
        "Employers post jobs and manage applications",
        "Admin approval for profiles, users, jobs and invoices",
        "Real-time chat and notifications",
        "PDF invoices and role-based access",
      ],
      fr: [
        "Les étudiants parcourent les offres et postulent avec leur CV",
        "Les employeurs publient des offres et gèrent les candidatures",
        "Validation admin des profils, utilisateurs, offres et factures",
        "Chat en temps réel et notifications",
        "Factures PDF et contrôle d'accès par rôles",
      ],
    },
  },
  {
    slug: "green-exchange",
    title: { en: "Green Exchange", fr: "Green Exchange" },
    category: { en: "Sustainability Platform", fr: "Plateforme durable" },
    context: {
      en: "Freelance · ISCAE student group",
      fr: "Freelance · Groupe d'étudiants ISCAE",
    },
    video: "/media/videos/green-exchange.mp4",
    poster: "/media/posters/green-exchange.jpg",
    description: {
      en: "A fullstack marketplace for trading recyclable waste between buyers and sellers, built as a freelance project for an ISCAE students group.",
      fr: "Une marketplace fullstack pour l'échange de déchets recyclables entre acheteurs et vendeurs, réalisée en freelance pour un groupe d'étudiants de l'ISCAE.",
    },
    tech: ["PHP", "SQLite", "HTML", "CSS", "JavaScript"],
    features: {
      en: [
        "Product listings, cart and wishlist",
        "Order management with admin approval",
        "Commission tracking and PDF invoices",
        "Notifications and role-based access",
        "Multi-language support (EN / FR / AR)",
      ],
      fr: [
        "Annonces, panier et liste de souhaits",
        "Gestion des commandes avec validation admin",
        "Suivi des commissions et factures PDF",
        "Notifications et contrôle d'accès par rôles",
        "Support multilingue (EN / FR / AR)",
      ],
    },
  },
  {
    slug: "sport-divers",
    title: { en: "Sport Divers", fr: "Sport Divers" },
    category: { en: "Sports Platform", fr: "Plateforme sportive" },
    context: { en: "Internship · E-build", fr: "Stage · E-build" },
    year: "2023 – 2024",
    video: "/media/videos/sport-divers.mp4",
    poster: "/media/posters/sport-divers.jpg",
    description: {
      en: "A Laravel web application for managing a sports complex, developed during my internship at E-build.",
      fr: "Une application web Laravel pour la gestion d'un complexe sportif, développée lors de mon stage chez E-build.",
    },
    tech: ["Laravel", "JavaScript", "MySQL", "HTML", "CSS"],
    features: {
      en: [
        "Facility and booking management",
        "Event scheduling",
        "User profiles",
        "Operations dashboard",
        "Responsive interface",
      ],
      fr: [
        "Gestion des installations et des réservations",
        "Planification des événements",
        "Profils utilisateurs",
        "Tableau de bord opérationnel",
        "Interface responsive",
      ],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
