export const QUEST_TYPES = [
  { id: 'focus',   label: 'Focus',   icon: '\u26A1',     color: '#2196F3' },
  { id: 'input',   label: 'Input',   icon: '\uD83D\uDCD6', color: '#4CAF50' },
  { id: 'create',  label: 'Create',  icon: '\uD83C\uDFA8', color: '#9C27B0' },
  { id: 'routine', label: 'Routine', icon: '\uD83D\uDD27', color: '#FF9800' },
  { id: 'reflect', label: 'Reflect', icon: '\u270D\uFE0F', color: '#00BCD4' },
];

export const DURATIONS = [
  { id: 'sprint', label: 'Sprint', subtitle: '~15 Min' },
  { id: 'short',  label: 'Kurz',   subtitle: '~30 Min' },
  { id: 'long',   label: 'Lang',   subtitle: '~45 Min' },
];

export const XP_VALUES = [
  { id: 30, label: 'Rezeptiv',    subtitle: '30 XP', description: 'lesen, anschauen, verstehen' },
  { id: 50, label: 'Reproduktiv', subtitle: '50 XP', description: 'nachbauen, anwenden' },
  { id: 80, label: 'Produktiv',   subtitle: '80 XP', description: 'selbst erstellen' },
];

export const LEVEL_THRESHOLDS = [0, 1, 100, 250, 500, 800];

export const LEVEL_LABELS = ['Locked', 'Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'];

export function getLevel(xp) {
  if (xp >= 800) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  if (xp >= 1) return 1;
  return 0;
}

export function getXpForNextLevel(level) {
  const thresholds = [1, 100, 250, 500, 800];
  return level >= 5 ? null : thresholds[level];
}

export function getLevelLabel(level) {
  return LEVEL_LABELS[level] || 'Locked';
}

export function getQuestType(id) {
  return QUEST_TYPES.find((t) => t.id === id) || null;
}

export function getDuration(id) {
  return DURATIONS.find((d) => d.id === id) || null;
}

export const RPG_ATTRIBUTES = ['STR', 'INT', 'DEX', 'WIS', 'CHA', 'CON'];
