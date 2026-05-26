// src/i18n/en.ts
export const en = {
  nav: {
    about: 'About',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    cv: 'CV',
    blog: 'Blog',
    contact: 'Contact',
  },
  hero: {
    greeting: "Hi, I'm",
    name: 'Vince Mohanna',
    title: 'Your Professional Title Here',
    tagline: 'A brief, compelling tagline about your expertise and what drives you.',
    cta_cv: 'View CV',
    cta_contact: 'Contact Me',
  },
  about: {
    heading: 'About Me',
    bio_1: 'Replace this paragraph with your actual bio. Tell your story — your background, what you specialize in, and the kind of problems you love solving.',
    bio_2: 'A second paragraph about your experience, values, or what makes you unique professionally.',
  },
  education: {
    heading: 'Education',
  },
  experience: {
    heading: 'Experience',
    present: 'Present',
  },
  projects: {
    heading: 'Projects & Research',
    view_link: 'View Project',
  },
  cv: {
    heading: 'Curriculum Vitae',
    description:
      'Download my full CV for a detailed overview of my professional background, academic credentials, and qualifications.',
    download: 'Download CV',
  },
  blog: {
    heading: 'Latest Posts',
    read_more: 'Read more',
    view_all: 'View all posts',
  },
  contact: {
    heading: 'Contact Me',
    name_label: 'Name',
    email_label: 'Email',
    message_label: 'Message',
    name_placeholder: 'Your full name',
    email_placeholder: 'your@email.com',
    message_placeholder: 'How can I help you?',
    submit: 'Send Message',
    sending: 'Sending…',
    success: "Message sent! I'll get back to you soon.",
    error: 'Something went wrong. Please try again.',
  },
  footer: {
    rights: 'All rights reserved.',
  },
} as const;

export type Translations = typeof en;
