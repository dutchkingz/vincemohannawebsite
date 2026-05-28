// src/i18n/fr.ts
import type { Translations } from './en';

export const fr: Translations = {
  nav: {
    about: 'À propos',
    education: 'Formation',
    experience: 'Expérience',
    projects: 'Projets',
    cv: 'CV',
    blog: 'Blogue',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Bonjour, je suis',
    name: 'Vince Mohanna',
    title: 'Votre titre professionnel ici',
    tagline: 'Une accroche brève et convaincante sur votre expertise et ce qui vous motive.',
    cta_cv: 'Voir le CV',
    cta_contact: 'Me contacter',
  },
  about: {
    heading: 'À propos de moi',
    bio_1: 'Remplacez ce paragraphe par votre biographie réelle. Racontez votre parcours — votre background, votre spécialité, et le type de problèmes que vous aimez résoudre.',
    bio_2: 'Un deuxième paragraphe sur votre expérience, vos valeurs ou ce qui vous distingue professionnellement.',
    bio_3: "",
  },
  education: {
    heading: 'Formation',
  },
  experience: {
    heading: 'Expérience',
    present: 'Présent',
  },
  projects: {
    heading: 'Projets et recherches',
    view_link: 'Voir le projet',
  },
  cv: {
    heading: 'Curriculum Vitæ',
    description:
      'Téléchargez mon CV complet pour un aperçu détaillé de mon parcours professionnel, de mes diplômes et de mes qualifications.',
    download: 'Télécharger le CV',
  },
  blog: {
    heading: 'Derniers articles',
    read_more: 'Lire la suite',
    view_all: 'Voir tous les articles',
  },
  contact: {
    heading: 'Me contacter',
    name_label: 'Nom',
    email_label: 'Courriel',
    message_label: 'Message',
    name_placeholder: 'Votre nom complet',
    email_placeholder: 'votre@courriel.com',
    message_placeholder: 'Comment puis-je vous aider?',
    submit: 'Envoyer le message',
    sending: 'Envoi en cours…',
    success: 'Message envoyé ! Je vous répondrai bientôt.',
    error: "Une erreur s'est produite. Veuillez réessayer.",
  },
  footer: {
    rights: 'Tous droits réservés.',
  },
};
