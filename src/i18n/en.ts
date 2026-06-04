// src/i18n/en.ts
export const en = {
  nav: {
    home: 'Home',
    about: 'About',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    cv: 'CV',
    blog: 'Blog',
    contact: 'Contact',
  },
  hero: {
    greeting: "Welcome to my webpage! I'm",
    name: 'Vince Mohanna',
    title: 'Computer Engineer, Full-Stack Developer & AI Engineer, FinTech Specialist',
    tagline: "AI Software Engineer building end-to-end AI-driven applications. Expert in bridging the gap between complex data streams and modern integrations.",
    cta_contact: 'Contact Me',
  },
  about: {
    heading: 'About Me',
    bio_1:  "Versatile Engineer with a Master’s in Embedded Systems and over 15 years of experience across different industries notably finance, healthcare and insurance and AI startups.",
    bio_2: "With a strong foundation in finance and a comprehensive understanding of financial instruments, I am equipped to navigate the complexities of the global financial markets. My expertise spans across various asset classes, including equities, fixed income, derivatives, and foreign exchange, enabling me to analyze and interpret market dynamics effectively. I possess in-depth knowledge of trading strategies, portfolio management, risk assessment, and valuation methodologies, which are essential for informed decision-making in high-stakes financial environments.",
    bio_3: "In addition to my financial acumen, I have a solid background in fintech, where I focus on leveraging technology to enhance trading applications and optimize financial processes. By combining technical proficiency with financial expertise, I support the development and implementation of sophisticated trading systems that enhance market efficiency, improve liquidity, and drive innovation. Whether through algorithmic trading solutions, data analytics, or the integration of blockchain technology, I am committed to advancing the capabilities of fintech platforms to meet the evolving demands of modern financial markets.",
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
    name_placeholder: 'Vincent Mohanna',
    email_placeholder: 'vince.mohanna@gmail.com',
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
