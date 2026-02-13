import { v4 as uuidv4 } from 'uuid';

// Demo quest titles grouped by quest type
const DEMO_QUESTS = {
  focus: [
    { title: 'React Context Setup', desc: 'Global State mit useContext + useReducer aufsetzen' },
    { title: 'REST API Endpunkte implementieren', desc: 'CRUD-Routen fuer User-Ressource' },
    { title: 'SQL Joins verstehen + anwenden', desc: 'INNER, LEFT, RIGHT JOIN mit Beispielen' },
    { title: 'Formular-Validierung bauen', desc: 'Client-seitige Validierung mit Custom Hook' },
    { title: 'Drag & Drop Sortierung einbauen', desc: 'dnd-kit fuer Kanban-Board integrieren' },
    { title: 'Auth Flow implementieren', desc: 'Login/Logout/Register mit JWT Token' },
    { title: 'Datenbankschema entwerfen', desc: 'ER-Diagramm + CREATE TABLE Statements' },
    { title: 'WebSocket Chat Prototyp', desc: 'Echtzeit-Nachrichten zwischen zwei Clients' },
    { title: 'Unit Tests fuer useQuestBoard', desc: 'Jest-Tests fuer CRUD-Operationen schreiben' },
    { title: 'CI/CD Pipeline konfigurieren', desc: 'GitHub Actions fuer Build + Deploy' },
  ],
  input: [
    { title: 'React Hooks Doku lesen', desc: 'Offizielle Docs zu useState, useEffect, useMemo' },
    { title: 'Git Branching Strategien lernen', desc: 'Git Flow vs Trunk-Based Development' },
    { title: 'Supabase Quickstart durcharbeiten', desc: 'Offizielles Tutorial bis Kapitel 3' },
    { title: 'CSS Grid Tutorial anschauen', desc: 'Kevin Powell Video: Grid in 20 Minutes' },
    { title: 'TypeScript Grundlagen Video', desc: 'Fireship TypeScript in 100 Seconds + Deep Dive' },
    { title: 'Accessibility Guidelines lesen', desc: 'WCAG 2.1 Level AA Anforderungen verstehen' },
    { title: 'Docker Basics Tutorial', desc: 'Dockerfile, docker-compose fuer Dev-Setup' },
    { title: 'Vite Config Doku studieren', desc: 'Plugins, Proxy, Build-Optionen' },
  ],
  create: [
    { title: 'Dashboard Mockup erstellen', desc: 'Figma-Wireframe fuer Analytics-Seite' },
    { title: 'Farbschema fuer Dark Mode', desc: 'HSL-Palette mit ausreichendem Kontrast' },
    { title: 'Landing Page designen', desc: 'Hero Section + Feature Cards skizzieren' },
    { title: 'Icon Set auswaehlen + anpassen', desc: 'Lucide Icons mit Custom Stroke Width' },
    { title: 'Component Library aufbauen', desc: 'Button, Input, Modal, Badge als Basis-Set' },
    { title: 'Animationskonzept skizzieren', desc: 'Micro-Interactions fuer Feedback-Momente' },
    { title: 'Onboarding Flow designen', desc: 'Erste-Start-Erfahrung fuer neue User' },
  ],
  routine: [
    { title: 'Dependencies updaten', desc: 'npm outdated pruefen + minor Updates installieren' },
    { title: 'Code Linting fixen', desc: 'ESLint Warnings in allen Dateien aufloesen' },
    { title: 'README aktualisieren', desc: 'Setup-Anleitung + Screenshots aktualisieren' },
    { title: 'Alte Feature Branches aufraeumen', desc: 'Merged Branches loeschen + Tags pruefen' },
    { title: 'Lighthouse Audit durchfuehren', desc: 'Performance, Accessibility, Best Practices pruefen' },
    { title: '.env Variablen dokumentieren', desc: 'Alle Umgebungsvariablen in .env.example eintragen' },
    { title: 'Build Output pruefen', desc: 'Bundle Size analysieren, unnoetige Imports finden' },
    { title: 'Backup erstellen', desc: 'Datenbank-Export + Konfigurationsdateien sichern' },
  ],
  reflect: [
    { title: 'Sprint Retro Notizen', desc: 'Was lief gut, was besser machen?' },
    { title: 'Code Review: TaskModal', desc: 'Eigenen Code kritisch durchlesen + Kommentare' },
    { title: 'Lernfortschritt dokumentieren', desc: 'Was habe ich diese Woche gelernt?' },
    { title: 'Tech-Schulden Liste updaten', desc: 'Bekannte Workarounds und TODOs erfassen' },
    { title: 'Architektur-Entscheidungen festhalten', desc: 'ADR fuer Datenmodell-Aenderung schreiben' },
    { title: 'Wochenplan erstellen', desc: 'Quests fuer naechste Woche priorisieren' },
    { title: 'Skill-Gaps identifizieren', desc: 'Welche Skills brauche ich fuer naechstes Projekt?' },
  ],
};

// Skill IDs grouped by category for realistic linking
const SKILL_GROUPS = {
  frontend: ['fe-01', 'fe-02', 'fe-03', 'fe-04', 'fe-05', 'fe-06', 'fe-07', 'fe-08'],
  devops: ['dev-01', 'dev-02', 'dev-03', 'dev-04', 'dev-05', 'dev-06', 'dev-07'],
  architektur: ['arch-01', 'arch-02', 'arch-03', 'arch-04', 'arch-05', 'arch-06'],
  backend: ['be-01', 'be-02', 'be-03', 'be-04', 'be-05', 'be-06'],
  automation: ['auto-01', 'auto-02', 'auto-03', 'auto-04', 'auto-05'],
  mobile: ['mob-01', 'mob-02', 'mob-03'],
};

// Map quest types to likely skill categories
const TYPE_SKILL_MAP = {
  focus: ['frontend', 'backend', 'devops'],
  input: ['frontend', 'backend', 'architektur'],
  create: ['frontend', 'architektur'],
  routine: ['devops', 'automation'],
  reflect: ['architektur', 'automation'],
};

const QUADRANTS = ['q1', 'q2', 'q3', 'q4'];
const KANBAN_ACTIVE = ['prepare', 'develop', 'testing-intern', 'testing-extern'];
const DURATIONS = ['sprint', 'short', 'long'];
const XP_VALUES = [30, 50, 80];
const QUEST_TYPES = ['focus', 'input', 'create', 'routine', 'reflect'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN(arr, n, rng) {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function generateTimestamp(daysAgo, hour, minute) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function getLinkedSkills(questType, rng) {
  const cats = TYPE_SKILL_MAP[questType] || ['frontend'];
  const cat = pick(cats, rng);
  const skills = SKILL_GROUPS[cat] || [];
  const count = Math.floor(rng() * 3) + 1; // 1-3 skills
  return pickN(skills, count, rng);
}

export function generateDemoData() {
  const rng = seededRandom(42);
  const tasks = [];

  // --- 40 Done tasks spread over 90 days ---
  const allDoneQuests = [];
  for (const type of QUEST_TYPES) {
    for (const q of DEMO_QUESTS[type]) {
      allDoneQuests.push({ ...q, questType: type });
    }
  }
  // Shuffle and pick 40
  allDoneQuests.sort(() => rng() - 0.5);
  const doneQuests = allDoneQuests.slice(0, 40);

  for (let i = 0; i < doneQuests.length; i++) {
    const q = doneQuests[i];
    const id = uuidv4();

    // Spread over 90 days, more recent tasks more likely
    const daysAgo = Math.floor(rng() * 90);

    // Weekday distribution: more Mon-Fri (0=Sun, 6=Sat)
    const testDate = new Date();
    testDate.setDate(testDate.getDate() - daysAgo);
    const dayOfWeek = testDate.getDay();
    if ((dayOfWeek === 0 || dayOfWeek === 6) && rng() > 0.3) {
      // Skip 70% of weekends by shifting to Monday
      testDate.setDate(testDate.getDate() + (dayOfWeek === 0 ? 1 : 2));
    }
    const actualDaysAgo = Math.max(0, Math.round((Date.now() - testDate.getTime()) / (24 * 60 * 60 * 1000)));

    // Time distribution: peaks at 08-12 and 14-17
    let hour;
    const timeRoll = rng();
    if (timeRoll < 0.4) {
      hour = 8 + Math.floor(rng() * 4);  // 08-11
    } else if (timeRoll < 0.75) {
      hour = 14 + Math.floor(rng() * 3); // 14-16
    } else if (timeRoll < 0.9) {
      hour = 17 + Math.floor(rng() * 3); // 17-19 evening
    } else {
      hour = 12 + Math.floor(rng() * 2); // 12-13 lunch
    }
    const minute = Math.floor(rng() * 60);

    const duration = pick(DURATIONS, rng);
    const xp = pick(XP_VALUES, rng);
    const linkedSkills = getLinkedSkills(q.questType, rng);
    const skillsLearned = rng() > 0.15 ? linkedSkills : []; // 85% chance skills were assigned
    const quadrant = rng() > 0.3 ? pick(['q1', 'q2'], rng) : pick(QUADRANTS, rng);

    const completedAt = generateTimestamp(actualDaysAgo, hour, minute);
    // Created 1-5 days before completion
    const createdDaysOffset = Math.floor(rng() * 5) + 1;
    const createdAt = generateTimestamp(actualDaysAgo + createdDaysOffset, 9, Math.floor(rng() * 60));
    // Started between created and completed
    const startedDaysOffset = Math.floor(rng() * createdDaysOffset);
    const startedAt = generateTimestamp(actualDaysAgo + startedDaysOffset, 10, Math.floor(rng() * 60));
    const isFastLane = rng() > 0.85;

    tasks.push({
      id,
      title: q.title,
      description: q.desc,
      location: 'kanban',
      quadrant: null,
      kanbanColumn: 'done',
      fastLane: isFastLane, // 15% were fast lane
      fastLaneAt: isFastLane ? startedAt : null,
      skillsLearned,
      linkedSkills,
      createdAt,
      startedAt,
      completedAt,
      dueDate: null,
      questType: q.questType,
      duration,
      xp,
      order: Date.now() - actualDaysAgo * 86400000 + i,
      history: [
        { action: 'created', from: null, to: `eisenhower:${quadrant}`, timestamp: createdAt },
        { action: 'started', from: `eisenhower:${quadrant}`, to: 'kanban:prepare', timestamp: startedAt },
        { action: 'column-changed', from: 'normal:prepare', to: 'normal:done', timestamp: completedAt },
      ],
    });
  }

  // --- 10 Active tasks ---
  const activeQuests = [
    { title: 'Supabase Auth einrichten', desc: 'Email/Password Login mit Supabase Client', questType: 'focus', quadrant: 'q1', kanban: 'develop' },
    { title: 'Error Handling verbessern', desc: 'Try/Catch Bloecke + User-Feedback bei API-Fehlern', questType: 'focus', quadrant: 'q1', kanban: 'testing-intern' },
    { title: 'Responsive Breakpoints', desc: 'Mobile-First Anpassung fuer Tablet + Desktop', questType: 'create', quadrant: 'q2', kanban: 'prepare' },
    { title: 'Performance Profiling', desc: 'React DevTools Profiler + Lighthouse Analyse', questType: 'routine', quadrant: 'q1', kanban: 'prepare' },
    { title: 'n8n Webhook testen', desc: 'Eingehende Webhooks an lokalen Server weiterleiten', questType: 'focus', quadrant: 'q2', kanban: 'develop' },
    // Remaining 5 stay in Eisenhower
    { title: 'GraphQL Grundlagen lesen', desc: 'Offizielles Tutorial + Vergleich mit REST', questType: 'input', quadrant: 'q2', kanban: null },
    { title: 'PWA Manifest erstellen', desc: 'Icons, Splash Screen, Offline-Seite', questType: 'routine', quadrant: 'q3', kanban: null },
    { title: 'Projekt-Readme aufhuebschen', desc: 'Badges, Screenshots, GIF-Demo', questType: 'create', quadrant: 'q4', kanban: null },
    { title: 'Docker Compose fuer Dev', desc: 'Frontend + Backend + DB in einem Compose File', questType: 'focus', quadrant: 'q1', kanban: null },
    { title: 'Accessibility Audit', desc: 'Screenreader-Test + Kontrast-Check', questType: 'reflect', quadrant: 'q2', kanban: null },
  ];

  for (let i = 0; i < activeQuests.length; i++) {
    const q = activeQuests[i];
    const id = uuidv4();
    const daysAgo = Math.floor(rng() * 7) + 1;
    const createdAt = generateTimestamp(daysAgo, 9, Math.floor(rng() * 60));
    const duration = pick(DURATIONS, rng);
    const xp = pick(XP_VALUES, rng);
    const linkedSkills = getLinkedSkills(q.questType, rng);

    const isKanban = q.kanban !== null;
    const startedAt = isKanban ? generateTimestamp(Math.max(0, daysAgo - 1), 10, Math.floor(rng() * 60)) : null;

    const history = [
      { action: 'created', from: null, to: `eisenhower:${q.quadrant}`, timestamp: createdAt },
    ];
    if (isKanban) {
      history.push({ action: 'started', from: `eisenhower:${q.quadrant}`, to: 'kanban:prepare', timestamp: startedAt });
      if (q.kanban !== 'prepare') {
        history.push({ action: 'column-changed', from: 'normal:prepare', to: `normal:${q.kanban}`, timestamp: generateTimestamp(Math.max(0, daysAgo - 1), 14, 0) });
      }
    }

    tasks.push({
      id,
      title: q.title,
      description: q.desc,
      location: isKanban ? 'kanban' : 'eisenhower',
      quadrant: isKanban ? null : q.quadrant,
      kanbanColumn: q.kanban,
      fastLane: false,
      fastLaneAt: null,
      skillsLearned: [],
      linkedSkills,
      createdAt,
      startedAt,
      completedAt: null,
      dueDate: null,
      questType: q.questType,
      duration,
      xp,
      order: Date.now() + i,
      history,
    });
  }

  return tasks;
}
