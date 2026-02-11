export const initialSkills = [
  // Frontend (8 Skills)
  { id: 'fe-01', name: 'React Grundlagen', category: 'frontend', categoryLabel: 'Frontend', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'fe-02', name: 'Vite Build System', category: 'frontend', categoryLabel: 'Frontend', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'fe-03', name: 'Component Architecture', category: 'frontend', categoryLabel: 'Frontend', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'fe-04', name: 'P3 Design System', category: 'frontend', categoryLabel: 'Frontend', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'fe-05', name: 'Drag & Drop (dnd-kit)', category: 'frontend', categoryLabel: 'Frontend', status: 'open', learnedFrom: [], predefined: true },
  { id: 'fe-06', name: 'State Management', category: 'frontend', categoryLabel: 'Frontend', status: 'open', learnedFrom: [], predefined: true },
  { id: 'fe-07', name: 'Responsive / Desktop Layout', category: 'frontend', categoryLabel: 'Frontend', status: 'open', learnedFrom: [], predefined: true },
  { id: 'fe-08', name: 'Tailwind CSS', category: 'frontend', categoryLabel: 'Frontend', status: 'open', learnedFrom: [], predefined: true },

  // DevOps & Deployment (7 Skills)
  { id: 'dev-01', name: 'Git & GitHub', category: 'devops', categoryLabel: 'DevOps & Deployment', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'dev-02', name: 'Capacitor APK Build', category: 'devops', categoryLabel: 'DevOps & Deployment', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'dev-03', name: 'Claude Code CLI Workflow', category: 'devops', categoryLabel: 'DevOps & Deployment', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'dev-04', name: 'GitHub Actions CI/CD', category: 'devops', categoryLabel: 'DevOps & Deployment', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'dev-05', name: 'GitHub Pages Deployment', category: 'devops', categoryLabel: 'DevOps & Deployment', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'dev-06', name: 'Testing (Unit / Integration)', category: 'devops', categoryLabel: 'DevOps & Deployment', status: 'open', learnedFrom: [], predefined: true },
  { id: 'dev-07', name: 'Performance & Lighthouse', category: 'devops', categoryLabel: 'DevOps & Deployment', status: 'open', learnedFrom: [], predefined: true },

  // Architektur & Planung (6 Skills)
  { id: 'arch-01', name: 'Anforderungsanalyse (PRD)', category: 'architektur', categoryLabel: 'Architektur & Planung', status: 'open', learnedFrom: [], predefined: true },
  { id: 'arch-02', name: 'App Flow Dokumentation', category: 'architektur', categoryLabel: 'Architektur & Planung', status: 'open', learnedFrom: [], predefined: true },
  { id: 'arch-03', name: 'Ordnerstruktur & Code-Organisation', category: 'architektur', categoryLabel: 'Architektur & Planung', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'arch-04', name: 'localStorage Patterns', category: 'architektur', categoryLabel: 'Architektur & Planung', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'arch-05', name: 'Datenmodell-Design', category: 'architektur', categoryLabel: 'Architektur & Planung', status: 'open', learnedFrom: [], predefined: true },
  { id: 'arch-06', name: 'Neurodivergenz-UI Patterns', category: 'architektur', categoryLabel: 'Architektur & Planung', status: 'open', learnedFrom: [], predefined: true },

  // Backend & Datenbank (6 Skills)
  { id: 'be-01', name: 'Supabase Setup & Grundlagen', category: 'backend', categoryLabel: 'Backend & Datenbank', status: 'open', learnedFrom: [], predefined: true },
  { id: 'be-02', name: 'SQL Grundlagen (CRUD)', category: 'backend', categoryLabel: 'Backend & Datenbank', status: 'open', learnedFrom: [], predefined: true },
  { id: 'be-03', name: 'Authentication (Login/Auth)', category: 'backend', categoryLabel: 'Backend & Datenbank', status: 'open', learnedFrom: [], predefined: true },
  { id: 'be-04', name: 'API Design & REST', category: 'backend', categoryLabel: 'Backend & Datenbank', status: 'open', learnedFrom: [], predefined: true },
  { id: 'be-05', name: 'Realtime / WebSocket', category: 'backend', categoryLabel: 'Backend & Datenbank', status: 'open', learnedFrom: [], predefined: true },
  { id: 'be-06', name: 'Row Level Security', category: 'backend', categoryLabel: 'Backend & Datenbank', status: 'open', learnedFrom: [], predefined: true },

  // Automation & KI (5 Skills)
  { id: 'auto-01', name: 'n8n Workflow Grundlagen', category: 'automation', categoryLabel: 'Automation & KI', status: 'open', learnedFrom: [], predefined: true },
  { id: 'auto-02', name: 'Webhook / API Integration', category: 'automation', categoryLabel: 'Automation & KI', status: 'open', learnedFrom: [], predefined: true },
  { id: 'auto-03', name: 'MCP Konzepte & Setup', category: 'automation', categoryLabel: 'Automation & KI', status: 'open', learnedFrom: [], predefined: true },
  { id: 'auto-04', name: 'KI-Prompt Engineering', category: 'automation', categoryLabel: 'Automation & KI', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'auto-05', name: 'Multi-Agenten Workflows', category: 'automation', categoryLabel: 'Automation & KI', status: 'open', learnedFrom: [], predefined: true },

  // Mobile & PWA (3 Skills)
  { id: 'mob-01', name: 'Capacitor Grundlagen', category: 'mobile', categoryLabel: 'Mobile & PWA', status: 'learned', learnedFrom: [], predefined: true },
  { id: 'mob-02', name: 'PWA (Service Worker, Offline)', category: 'mobile', categoryLabel: 'Mobile & PWA', status: 'open', learnedFrom: [], predefined: true },
  { id: 'mob-03', name: 'App Store Submission', category: 'mobile', categoryLabel: 'Mobile & PWA', status: 'open', learnedFrom: [], predefined: true },
];

export const categoryIcons = {
  frontend: '\uD83C\uDFA8',
  devops: '\uD83D\uDD27',
  architektur: '\uD83D\uDCD0',
  backend: '\uD83D\uDDC4\uFE0F',
  automation: '\uD83E\uDD16',
  mobile: '\uD83D\uDCF1',
};

export const categoryOrder = ['frontend', 'devops', 'architektur', 'backend', 'automation', 'mobile'];
