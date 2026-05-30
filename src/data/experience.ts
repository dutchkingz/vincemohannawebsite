// src/data/experience.ts
export interface Role {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export const roles: Role[] = [
  {
    company: 'Morgan Stanley',
    title: 'Application Production Reliability Engineer',
    location: 'Montreal, Canada',
    startDate: '2024',
    endDate: '2025',
    bullets: [
      'Supporting Prime Brokerage Trade cycle process flow globally over Linux and Windows server farms',
      'Using SQL and shell scripts to ensure continuity and data quality for consistency',
      'Using a stack of internal tools for monitoring and reporting for Trade completion and Settlement flows for listed derivatives across the Morgan Stanley platforms',
      'Managing critical data streams and scheduling with Autosys jobs',
      'Investigating ongoing production issues with ServiceNow and JIRA tracking tool for software issues',
    ],
  },
  {
    company: 'Koios Intelligence',
    title: 'Application Data Engineer',
    location: 'Montreal, Canada',
    startDate: '2023',
    endDate: '2024',
    bullets: [
      'Using Keras and TensorFlow to train AI models for chat bot applications',
      'Data engineering and integrating insurance based data into LLMs',
      'LLM tuning, querying and evaluation using SAS and Matlab statistics and machine learning',
      'Software testing on the front end of Prompting application',
    ],
  },
  {
    company: 'BNP Paribas',
    title: 'VP Application Production Support',
    location: 'Montreal, Canada',
    startDate: '2021',
    endDate: '2023',
    bullets: [
      'Large scale financial software platforms deployed globally over Linux and Windows server farms',
      'Data driven software monitoring with Geneos and Splunk for critical processes',
      'Managing critical data streams for real-time applications with ION',
      'Software automation and scheduling with Autosys',
      'Provide support and training for traders and developers',
      'SQL Server scripts and Linux shell scripting',
      'Sailpoint and ServiceNow used in tiered software and IT service requests',
      'JIRA tracking tool for ongoing software issues',
    ],
  },
  {
    company: 'CSIO',
    title: 'Technical Support Application Engineer',
    location: 'Montreal, Canada',
    startDate: '2018',
    endDate: '2021',
    bullets: [
      'Analyze and implement software automation',
      'Software integration with Node.JS, PHP and VBA programming',
      'Technology analysis for integration and workflow automation',
      'Web content management in Drupal, HTML, CSS and PHP',
      'Ensure high quality technical support of Azure cloud-based software',
      'Consulting on data standards in XML and AL3 for insurance industry',
    ],
  },
  {
    company: 'TD Wealth',
    title: 'Investment Representative — CSC, CPH, DFOL, CFA Candidate',
    location: 'Montreal, Canada',
    startDate: '2015',
    endDate: '2018',
    bullets: [
      'Provide brokerage service to TD Wealth clients',
      'Fulfill registered plan transactions',
      'Provide market information and investing knowledge',
    ],
  },
  {
    company: 'Fiera Capital Corporation',
    title: 'Financial Analyst, Fund Accounting',
    location: 'Montreal, Canada',
    startDate: '2014',
    endDate: '2014',
    bullets: [
      'Preparation of financial statements and earnings',
      'Invoicing and accounts payable for fund management',
      'Automating internal processes with Excel Macro programming',
    ],
  },
  {
    company: 'Crescendo Systems Inc.',
    title: 'Application Engineer, Speech Recognition',
    location: 'Laval, Canada',
    startDate: '2011',
    endDate: '2013',
    bullets: [
      'Provide expertise in software Speech Recognition',
      'Software engineering, testing and product verification',
      'Creating test and verification applications in C#',
      'Creating statistical applications in VBA and Excel',
      'SQL Server maintenance and data migration',
      'Python programming for natural language processing (NLP)',
    ],
  },
  {
    company: 'Anticyclone',
    title: 'Application Engineer and Technical Support',
    location: 'Marseille, France',
    startDate: '2009',
    endDate: '2011',
    bullets: [
      'Provide expertise in software Speech Recognition',
      'Software engineering, testing, documentation and troubleshooting',
      'SQL Server maintenance of production sites',
      'Provide end-user training for medical staff',
      'Product demonstrations at industry trade shows in France',
    ],
  },
  {
    company: 'Nuance Communications',
    title: 'Professional Services Engineer',
    location: 'Vienna, Austria',
    startDate: '2006',
    endDate: '2009',
    bullets: [
      'Provide technical expertise and support to partner companies implementing Speech Enabled software solutions',
      'Build and maintain customer relations with software developers',
      'Software testing, debugging, and bug tracking',
      'Demonstrate speech recognition technology products at industry trade shows across Europe',
      'Product training for partner companies and hospital IT staff',
    ],
  },
  {
    company: 'Philips Semiconductors — Philips Research Laboratories',
    title: "Master's Student, R&D Internship",
    location: 'Eindhoven, Netherlands',
    startDate: '2005',
    endDate: '2006',
    bullets: [
      "Completed a Master's research project on application parallelization and real-time systems for a heterogeneous multiprocessor radio chip intended for the automobile industry, as part of a research group focusing on predictable multiprocessors within the Embedded Systems Architecture on Silicon group",
    ],
  },
];
