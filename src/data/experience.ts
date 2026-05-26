// src/data/experience.ts
export interface Role {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export const roles: Role[] = [
  {
    company: 'Company Name',
    title: 'Your Job Title',
    location: 'Montreal, QC',
    startDate: 'Jan 20XX',
    endDate: 'Present',
    description:
      'Brief description of your responsibilities and key achievements in this role.',
  },
  {
    company: 'Previous Company',
    title: 'Previous Title',
    location: 'City, Province',
    startDate: 'Jun 20XX',
    endDate: 'Dec 20XX',
    description:
      'Brief description of your responsibilities and key achievements in this role.',
  },
];
