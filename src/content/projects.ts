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
