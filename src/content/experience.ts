import type { Localized } from "./types";

export type Experience = {
  period: string;
  type: Localized;
  title: Localized;
  company: string;
  tech: string[];
  points: Localized<string[]>;
};

export type Education = {
  period: string;
  title: Localized;
  school: Localized;
};

export const experience: Experience[] = [
  {
    period: "2026",
    type: { en: "Customer Service", fr: "Service client" },
    title: {
      en: "PayPal English-Speaking Customer Service Representative",
      fr: "Conseiller clientèle anglophone PayPal",
    },
    company: "Transcom",
    tech: ["PayPal", "Customer Operations"],
    points: {
      en: [
        "Supported PayPal users with account access, payments and disputes.",
        "Applied company policies to investigate issues and keep customers satisfied.",
        "Completed PayPal certification.",
      ],
      fr: [
        "Accompagnement des utilisateurs PayPal sur l'accès aux comptes, les paiements et les litiges.",
        "Application des politiques internes pour investiguer les incidents et garantir la satisfaction client.",
        "Certification PayPal obtenue.",
      ],
    },
  },
  {
    period: "2025 – 2026",
    type: { en: "Apprenticeship", fr: "Apprentissage" },
    title: {
      en: "Full Stack Developer Apprentice",
      fr: "Apprenti développeur Full Stack",
    },
    company: "UIT / U4Gen",
    tech: ["Power Platform", "Dynamics 365", "Dataverse", "Twilio"],
    points: {
      en: [
        "Built and maintained enterprise web apps with Microsoft Power Platform, Dynamics 365 and Dataverse.",
        "Integrated WhatsApp communication through Twilio APIs.",
        "Contributed to CRM customization, API integrations and workflow automation in an agile team.",
      ],
      fr: [
        "Développement et maintenance d'applications web d'entreprise avec Microsoft Power Platform, Dynamics 365 et Dataverse.",
        "Intégration de la communication WhatsApp via les API Twilio.",
        "Personnalisation CRM, intégrations API et automatisation de workflows en environnement agile.",
      ],
    },
  },
  {
    period: "2024 – 2025",
    type: { en: "Internship", fr: "Stage" },
    title: {
      en: "Full Stack Developer Intern",
      fr: "Stagiaire développeur Full Stack",
    },
    company: "Tunisia Smart Solutions",
    tech: ["Laravel", "Scrum", "MySQL"],
    points: {
      en: [
        "Delivered a fullstack human resource management web app with Scrum and Laravel.",
        "Implemented role-based access control, multi-level validation workflows and real-time internal chat.",
      ],
      fr: [
        "Développement d'une application web de gestion des ressources humaines en Scrum et Laravel.",
        "Mise en place d'un contrôle d'accès par rôles, de workflows de validation multi-niveaux et d'un chat interne en temps réel.",
      ],
    },
  },
  {
    period: "2023 – 2024",
    type: { en: "Internship", fr: "Stage" },
    title: {
      en: "Full Stack Developer Intern",
      fr: "Stagiaire développeur Full Stack",
    },
    company: "E-build",
    tech: ["Laravel", "MySQL"],
    points: {
      en: ["Developed Sport Divers, a Laravel web app for managing a sports complex."],
      fr: [
        "Développement de Sport Divers, une application web Laravel pour la gestion d'un complexe sportif.",
      ],
    },
  },
];

export const education: Education[] = [
  {
    period: "2022 – 2025",
    title: { en: "Bachelor of Computer Science", fr: "Licence en informatique" },
    school: {
      en: "Higher Institute of Information Technologies and Communication (ISTIC)",
      fr: "Institut supérieur des technologies de l'information et de la communication (ISTIC)",
    },
  },
  {
    period: "2021 – 2022",
    title: {
      en: "Baccalaureate in Experimental Sciences",
      fr: "Baccalauréat sciences expérimentales",
    },
    school: { en: "Borj Cedria High School", fr: "Lycée de Borj Cédria" },
  },
];
