// src/data/projects.ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    title: 'Project Title',
    description:
      'Brief description of the project, its purpose, and your contribution or findings.',
    tags: ['Research', 'Engineering'],
    link: 'https://example.com',
  },
  {
    title: 'Research Project',
    description:
      'Brief description of the project, its purpose, and your contribution or findings.',
    tags: ['Academic', 'Analysis'],
  },
  {
    title: 'Another Project',
    description: 'Brief description of the project.',
    tags: ['Development'],
  },
];
