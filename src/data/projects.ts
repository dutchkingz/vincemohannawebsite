// src/data/projects.ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  imageAlt?: string;
}

export const projects: Project[] = [
  {
    title: 'VERITAS',
    description:
      'Real-time OSINT platform that visualizes narrative warfare by tracking how news stories are engineered and spread across global media. Features a 3D globe showing disinformation propagation routes, a triad of AI agents (Google Gemini, OpenAI, Claude) for bias analysis, semantic RAG search, and AI-powered contradiction detection.',
    tags: ['Rails 8', 'PostgreSQL', 'pgvector', 'Three.js', 'OpenAI', 'Claude', 'Gemini'],
    link: 'https://www.veritas-intelligence.org',
    image: '/images/veritas_screen_cap.png',
    imageAlt: 'VERITAS — 3D globe showing disinformation narrative routes',
  },
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
