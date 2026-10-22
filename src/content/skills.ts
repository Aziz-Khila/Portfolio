import type { Localized } from "./types";

export type SkillGroup = {
  category: Localized;
  blurb: Localized;
  items: { name: string; icon: string }[];
};

export const skills: SkillGroup[] = [
  {
    category: { en: "Backend & Web", fr: "Backend & Web" },
    blurb: {
      en: "Fullstack web products, from database schema to responsive interface.",
      fr: "Des produits web fullstack, du schéma de base de données à l'interface responsive.",
    },
    items: [
      { name: "Laravel", icon: "/media/tech/laravel.svg" },
      { name: "JavaScript", icon: "/media/tech/js.svg" },
      { name: "PHP", icon: "/media/tech/php.svg" },
      { name: "SQL", icon: "/media/tech/sql.svg" },
      { name: "Vue.js", icon: "/media/tech/vue.svg" },
      { name: "HTML", icon: "/media/tech/html.svg" },
      { name: "CSS", icon: "/media/tech/css.svg" },
    ],
  },
  {
    category: { en: "Microsoft Stack", fr: "Stack Microsoft" },
    blurb: {
      en: "Enterprise apps, CRM customization and workflow automation.",
      fr: "Applications d'entreprise, personnalisation CRM et automatisation de workflows.",
    },
    items: [
      { name: "Power Platform", icon: "/media/tech/power-platform.svg" },
      { name: "Dynamics 365", icon: "/media/tech/dynamics365.svg" },
      { name: "Dataverse", icon: "/media/tech/dataverse.svg" },
      { name: "Twilio", icon: "/media/tech/twilio.svg" },
    ],
  },
  {
    category: { en: "Languages & Tools", fr: "Langages & outils" },
    blurb: {
      en: "The languages, databases and practices behind the work.",
      fr: "Les langages, bases de données et pratiques derrière chaque projet.",
    },
    items: [
      { name: "Python", icon: "/media/tech/python.svg" },
      { name: "Java", icon: "/media/tech/java.svg" },
      { name: "MySQL", icon: "/media/tech/mysql.svg" },
      { name: "SQLite", icon: "/media/tech/sqlite.svg" },
      { name: "Scrum", icon: "/media/tech/scrum.svg" },
      { name: "Git", icon: "/media/tech/git.svg" },
    ],
  },
];

export const marqueeStack = skills.flatMap((group) => group.items);
