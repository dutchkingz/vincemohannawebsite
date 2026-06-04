// src/data/projects.ts
export interface Project {
  title: string;
  slug?: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  imageAlt?: string;
  // Detail page fields
  categories?: string[];
  overview?: string;
  features?: string[];
  techStack?: string[];
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    title: 'VERITAS',
    slug: 'veritas',
    description:
      'Real-time OSINT platform that visualizes narrative warfare by tracking how news stories are engineered and spread across global media. Features a 3D globe showing disinformation propagation routes, a triad of AI agents (Google Gemini, OpenAI, Claude) for bias analysis, semantic RAG search, and AI-powered contradiction detection.',
    tags: ['Rails 8', 'PostgreSQL', 'pgvector', 'Three.js', 'OpenAI', 'Claude', 'Gemini'],
    link: 'https://www.veritas-intelligence.org',
    image: '/images/veritas_screen_cap.png',
    imageAlt: 'VERITAS — 3D globe showing disinformation narrative routes',
    categories: ['AI/ML', 'Full-Stack', 'Data Visualization', 'NLP'],
    overview:
      'Veritas is a truth radar for global news. Rather than showing what is happening, it reveals how stories are engineered — tracking disinformation routes, media bias, and narrative shifts across countries and time. It combines a striking 3D globe visualization with a three-agent AI pipeline that analyzes articles for bias, contradictions, and propaganda patterns.',
    features: [
      'Animated narrative arcs on a 3D globe tracing how stories propagate across countries and media outlets',
      'Bias heatmap with 3D cylindrical data cores color-coded by sentiment and propaganda intensity',
      'Time-travel slider to rewind and replay how a narrative evolved over time',
      'AI Analysis Triad — a three-agent pipeline (Analyst, Sentinel, Arbiter) generating bias verdicts per article',
      'RAG-powered chat interface with vector search over ingested articles',
      'Intelligence dossiers — region-triggered deep-dive reports from multi-source analysis',
      'Perspective filter to view news through the lens of specific geopolitical actors',
    ],
    techStack: [
      'Ruby on Rails 8.1',
      'PostgreSQL + pgvector',
      'OpenRouter (GPT-4o, Claude, Gemini)',
      'Globe.gl + Three.js',
      'Hotwire / Turbo / Stimulus',
      'Tailwind CSS',
      'ElevenLabs (audio)',
      'NewsAPI + GDELT / BigQuery',
      'Docker + Kamal',
    ],
    liveUrl: 'https://www.veritas-intelligence.org',
  },
  {
    title: 'ModernMan Analytics',
    slug: 'modernman',
    description:
      'Full-stack FinTech platform that aggregates real-time market data, earnings analysis, news sentiment, and options chains to help investors make data-driven decisions. Features stock charting with technical overlays, IPO calendar, watchlists, and daily scheduled data refreshes.',
    tags: ['Next.js', 'FastAPI', 'Python', 'PostgreSQL', 'yFinance', 'Docker'],
    link: 'https://lively-glacier-0ca6d1710.7.azurestaticapps.net',
    image: '/images/modernMan_screencap.png',
    imageAlt: 'ModernMan Analytics — stock dashboard with live market data and charts',
    categories: ['FinTech', 'Full-Stack', 'Data Visualization', 'Investment Analytics'],
    overview:
      'ModernMan Analytics is a comprehensive financial market analytics platform that empowers individual investors to make informed trading decisions through real-time stock data, technical analysis, and earnings insights. The application aggregates live market quotes, historical price data, options chains, earnings calendars, and sentiment-driven news analysis from multiple financial data providers. Built with modern web technologies and designed for active traders and retail investors, it provides institutional-grade analytics in an intuitive, visually polished interface.',
    features: [
      'Live stock dashboard with real-time quotes — instant prices, market cap, P/E ratios, dividend yields, 52-week ranges, and average volume with automatic refresh on market close',
      'Interactive price charts using Lightweight Charts with multiple time periods (1W, 1M, 3M, 6M, 1Y, 5Y), technical overlays (SMA, EMA, Bollinger Bands, VWAP), and oscillators (RSI, MACD)',
      'Personal watchlist with sparklines, percentage changes, and upcoming earnings dates in a responsive table',
      'Comprehensive earnings analysis — estimated vs. reported EPS, surprise percentages, beat/miss streaks, quarterly revenue trends, and price impact charts',
      'Options chain viewer with filtering by expiration date, strike prices, bid-ask spreads, implied volatility, open interest, and in-the-money indicators',
      'AI-powered news sentiment analysis — ticker-specific articles categorized as bullish, bearish, or neutral with sentiment distribution summaries via Alpha Vantage',
      'IPO calendar tracking upcoming offerings for the next 90 days with exchange listings, price ranges, share counts, and expected valuations',
      'Secure user authentication with bcrypt password hashing, email-based password reset via Resend, and admin panel with user management',
      'Automated background data caching — daily scheduler pre-caches fundamentals, earnings, and options in PostgreSQL to reduce API calls and improve performance',
    ],
    techStack: [
      'Next.js 16 + React 19 (TypeScript)',
      'FastAPI + Uvicorn (Python)',
      'PostgreSQL + SQLAlchemy + Alembic',
      'yFinance (stock data)',
      'Alpha Vantage API (fundamentals, earnings, sentiment)',
      'Finnhub API (IPO calendar)',
      'Lightweight Charts (financial charting)',
      'APScheduler (background jobs)',
      'Passlib + bcrypt (authentication)',
      'Resend (transactional email)',
      'Docker + Docker Compose',
      'Azure Static Web Apps',
    ],
    liveUrl: 'https://lively-glacier-0ca6d1710.7.azurestaticapps.net',
  },
  {
    title: 'Research Project',
    description:
      'Brief description of the project, its purpose, and your contribution or findings.',
    tags: ['Academic', 'Analysis'],
  },
];
