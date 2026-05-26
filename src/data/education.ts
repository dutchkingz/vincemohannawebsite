// src/data/education.ts
export interface Institution {
  name: string;
  degree: string;
  field: string;
  years: string;
  logo: string;
  logoAlt: string;
}

export const institutions: Institution[] = [
  {
    name: 'McGill University',
    degree: 'Your Degree Here',
    field: 'Your Field of Study',
    years: '20XX – 20XX',
    logo: '/images/mcgill.png',
    logoAlt: 'McGill University',
  },
  {
    name: 'Toronto Metropolitan University',
    degree: 'Your Degree Here',
    field: 'Your Field of Study',
    years: '20XX – 20XX',
    logo: '/images/TMU.avif',
    logoAlt: 'Toronto Metropolitan University',
  },
  {
    name: 'Lund University',
    degree: 'Your Degree Here',
    field: 'Your Field of Study',
    years: '20XX – 20XX',
    logo: '/images/Lund-University.jpg',
    logoAlt: 'Lund University',
  },
];
