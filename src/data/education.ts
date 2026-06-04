// src/data/education.ts
export interface Institution {
  name: string;
  degree: string;
  field: string;
  years: string;
  logo: string;
  logoAlt: string;
  badge?: string;
  badgeAlt?: string;
  url?: string;
}

export const institutions: Institution[] = [
  {
    name: 'McGill University',
    degree: 'Graduate Diploma',
    field: 'Applied Finance',
    years: '2013 – 2015',
    logo: '/images/mcgill.png',
    logoAlt: 'McGill University',
    badge: '/images/mcgill_university.svg',
    badgeAlt: 'McGill University crest',
    url: 'https://www.mcgill.ca/',
  },
  {
    name: 'Toronto Metropolitan University',
    degree: 'Bachelor of Engineering',
    field: 'Electrical Engineering',
    years: '1999 – 2003',
    logo: '/images/TMU.avif',
    logoAlt: 'Toronto Metropolitan University',
    badge: '/images/toronto_met_seal.webp',
    badgeAlt: 'Toronto Metropolitan University seal',
    url: 'https://www.torontomu.ca/',
  },
  {
    name: 'Lund University',
    degree: 'Master in Computer Enginnering',
    field: 'System-on-Chip',
    years: '2005 – 2007',
    logo: '/images/Lunds_Universitet.jpg',
    logoAlt: 'Lund University',
    badge: '/images/lunds_universitet_logo.png',
    badgeAlt: 'Lund University logo',
    url: 'https://www.lunduniversity.lu.se/',
  },
];
