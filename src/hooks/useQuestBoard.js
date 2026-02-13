import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { initialSkills, initialCategories } from '../data/skillsData';
import { getLevel } from '../data/questTypes';

const STORAGE_KEY = 'questboard';
const SCHEMA_VERSION = 10;

export const DEFAULT_SETTINGS = {
  wipLimits: {
    prepare: 3,
    develop: 2,
    'testing-intern': 2,
    'testing-extern': 2,
  },
  maxWildcardsPerDay: 2,
};

const defaultState = {
  version: SCHEMA_VERSION,
  tasks: [],
  skills: initialSkills.map((s) => ({ ...s, hidden: false })),
  categories: initialCategories,
  settings: { ...DEFAULT_SETTINGS },
};

// Merge backup skills with predefined skills (BUG-001 fix)
function mergeSkillsWithPredefined(backupSkills) {
  const merged = [];
  const backupMap = new Map(backupSkills.map((s) => [s.id, s]));

  // 1. All predefined skills: use backup version if exists, otherwise add as new 'open'
  for (const predefined of initialSkills) {
    const fromBackup = backupMap.get(predefined.id);
    if (fromBackup) {
      merged.push({ ...fromBackup, predefined: true, hidden: fromBackup.hidden || false });
      backupMap.delete(predefined.id);
    } else {
      merged.push({ ...predefined, hidden: false });
    }
  }

  // 2. All remaining custom skills from backup
  for (const custom of backupMap.values()) {
    merged.push({ ...custom, hidden: custom.hidden || false });
  }

  return merged;
}

// Merge backup categories with predefined categories
function mergeCategoriesWithPredefined(backupCategories) {
  const merged = [];
  const backupMap = new Map((backupCategories || []).map((c) => [c.id, c]));

  // 1. All predefined categories: use backup version if exists
  for (const predefined of initialCategories) {
    const fromBackup = backupMap.get(predefined.id);
    if (fromBackup) {
      merged.push({ ...fromBackup, predefined: true });
      backupMap.delete(predefined.id);
    } else {
      merged.push({ ...predefined });
    }
  }

  // 2. All remaining custom categories from backup
  for (const custom of backupMap.values()) {
    merged.push({ ...custom });
  }

  return merged;
}

function migrateState(state) {
  if (!state || !state.tasks) return defaultState;
  if (state.version >= SCHEMA_VERSION) return state;

  const migrated = {
    ...state,
    version: SCHEMA_VERSION,
    tasks: state.tasks.map((t) => {
      const task = { ...t };
      // V1 -> V2: doing -> develop
      if (task.kanbanColumn === 'doing') {
        task.kanbanColumn = 'develop';
      }
      // V2 -> V3: add history, dueDate
      if (!task.history) {
        task.history = [{ action: 'created', to: task.quadrant || task.kanbanColumn, timestamp: task.createdAt }];
      }
      if (task.dueDate === undefined) {
        task.dueDate = null;
      }
      // V5 -> V6: add questType and duration
      if (task.questType === undefined) {
        task.questType = null;
      }
      if (task.duration === undefined) {
        task.duration = null;
      }
      // V6 -> V7: add xp
      if (task.xp === undefined) {
        task.xp = null;
      }
      // V8 -> V9: rename quest types to universal names
      const questTypeMap = { code: 'focus', learn: 'input', design: 'create', config: 'routine', write: 'reflect' };
      if (task.questType && questTypeMap[task.questType]) {
        task.questType = questTypeMap[task.questType];
      }
      return task;
    }),
    // V3 -> V4: add createdAt/learnedAt to skills
    // V4 -> V5: add hidden flag to skills
    skills: (state.skills || initialSkills).map((s) => {
      const skill = { ...s };
      if (!skill.createdAt) {
        skill.createdAt = '2025-01-15T00:00:00.000Z';
      }
      if (skill.learnedAt === undefined) {
        skill.learnedAt = skill.status === 'learned' ? (skill.createdAt || '2025-01-15T00:00:00.000Z') : null;
      }
      if (skill.hidden === undefined) {
        skill.hidden = false;
      }
      // V6 -> V7: add level and xpCurrent
      if (skill.level === undefined) {
        if (skill.status === 'learned') {
          skill.level = 3;
          skill.xpCurrent = 250;
        } else {
          skill.level = 0;
          skill.xpCurrent = 0;
        }
      }
      return skill;
    }),
    // V4 -> V5: add categories from initialCategories if not present
    categories: (state.categories || initialCategories.map((c) => ({ ...c }))).map((c) => {
      // V9 -> V10: add showInDashboard flag
      if (c.showInDashboard === undefined) {
        return { ...c, showInDashboard: (c.order != null && c.order < 6) };
      }
      return c;
    }),
  };
  // V7 -> V8: add settings
  if (!migrated.settings) {
    migrated.settings = { ...DEFAULT_SETTINGS };
  }
  return migrated;
}

function addHistoryEntry(task, action, from, to) {
  return {
    ...task,
    history: [...(task.history || []), { action, from, to, timestamp: new Date().toISOString() }],
  };
}

export const KANBAN_COLUMNS = [
  { id: 'prepare', label: 'Vorbereiten', subtitle: 'Sammeln & Planen', icon: '\uD83D\uDCC1' },
  { id: 'develop', label: 'Entwickeln', subtitle: 'Aktiv bearbeiten', icon: '\uD83D\uDCBB' },
  { id: 'testing-intern', label: 'Testing Intern', subtitle: 'Selbst pr\u00FCfen', icon: '\uD83D\uDD0D' },
  { id: 'testing-extern', label: 'Testing Extern', subtitle: 'Fremd pr\u00FCfen', icon: '\uD83E\uDDEA' },
  { id: 'done', label: 'Done', subtitle: 'Erledigt', icon: '\uD83C\uDF89' },
];

export function useQuestBoard() {
  const [rawState, setRawState] = useLocalStorage(STORAGE_KEY, defaultState);
  const state = migrateState(rawState);

  if (rawState.version !== state.version) {
    setRawState(state);
  }

  const tasks = state.tasks || [];
  const skills = state.skills || initialSkills;
  const categories = state.categories || initialCategories;
  const settings = state.settings || DEFAULT_SETTINGS;

  const updateTasks = useCallback((updater) => {
    setRawState((prev) => {
      const migrated = migrateState(prev);
      return {
        ...migrated,
        tasks: typeof updater === 'function' ? updater(migrated.tasks || []) : updater,
      };
    });
  }, [setRawState]);

  const updateSkills = useCallback((updater) => {
    setRawState((prev) => {
      const migrated = migrateState(prev);
      return {
        ...migrated,
        skills: typeof updater === 'function' ? updater(migrated.skills || initialSkills) : updater,
      };
    });
  }, [setRawState]);

  const updateCategories = useCallback((updater) => {
    setRawState((prev) => {
      const migrated = migrateState(prev);
      return {
        ...migrated,
        categories: typeof updater === 'function' ? updater(migrated.categories || initialCategories) : updater,
      };
    });
  }, [setRawState]);

  const updateSettings = useCallback((newSettings) => {
    setRawState((prev) => {
      const migrated = migrateState(prev);
      return {
        ...migrated,
        settings: typeof newSettings === 'function' ? newSettings(migrated.settings || DEFAULT_SETTINGS) : newSettings,
      };
    });
  }, [setRawState]);

  // Task CRUD
  const createTask = useCallback((title, description, quadrant, dueDate, questType, duration, xp) => {
    const now = new Date().toISOString();
    const newTask = {
      id: uuidv4(),
      title,
      description: description || '',
      location: 'eisenhower',
      quadrant: quadrant || 'unsorted',
      kanbanColumn: null,
      fastLane: false,
      skillsLearned: [],
      createdAt: now,
      startedAt: null,
      completedAt: null,
      dueDate: dueDate || null,
      questType: questType || null,
      duration: duration || null,
      xp: xp || null,
      order: Date.now(),
      history: [{ action: 'created', from: null, to: quadrant || 'unsorted', timestamp: now }],
    };
    updateTasks((prev) => [...prev, newTask]);
    return newTask;
  }, [updateTasks]);

  // Bulk import
  const importTasks = useCallback((taskList) => {
    const now = new Date().toISOString();
    const newTasks = taskList.map((t, i) => ({
      id: uuidv4(),
      title: t.title,
      description: t.description || '',
      location: 'eisenhower',
      quadrant: t.quadrant || 'unsorted',
      kanbanColumn: null,
      fastLane: false,
      skillsLearned: [],
      createdAt: now,
      startedAt: null,
      completedAt: null,
      dueDate: t.dueDate || null,
      questType: t.questType || null,
      duration: t.duration || null,
      xp: t.xp || null,
      order: Date.now() + i,
      history: [{ action: 'created', from: null, to: t.quadrant || 'unsorted', timestamp: now }],
    }));
    updateTasks((prev) => [...prev, ...newTasks]);
    return newTasks;
  }, [updateTasks]);

  const updateTask = useCallback((id, updates) => {
    updateTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, [updateTasks]);

  const deleteTask = useCallback((id) => {
    updateTasks((prev) => prev.filter((t) => t.id !== id));
  }, [updateTasks]);

  // Eisenhower -> Kanban
  const startTask = useCallback((id) => {
    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = addHistoryEntry(t, 'started', `eisenhower:${t.quadrant}`, 'kanban:prepare');
        return {
          ...updated,
          location: 'kanban',
          quadrant: null,
          kanbanColumn: 'prepare',
          startedAt: new Date().toISOString(),
          order: Date.now(),
        };
      })
    );
  }, [updateTasks]);

  // Kanban back to Eisenhower (only for non-fast-lane)
  const returnToBacklog = useCallback((id, quadrant) => {
    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        // Fast lane tasks cannot return
        if (t.fastLane) return t;
        const updated = addHistoryEntry(t, 'returned', `kanban:${t.kanbanColumn}`, `eisenhower:${quadrant || 'q1'}`);
        return {
          ...updated,
          location: 'eisenhower',
          quadrant: quadrant || 'q1',
          kanbanColumn: null,
          fastLane: false,
          startedAt: null,
          order: Date.now(),
        };
      })
    );
  }, [updateTasks]);

  // Move in Eisenhower
  const moveToQuadrant = useCallback((id, quadrant) => {
    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = addHistoryEntry(t, 'moved', `eisenhower:${t.quadrant}`, `eisenhower:${quadrant}`);
        return { ...updated, quadrant };
      })
    );
  }, [updateTasks]);

  // Move in Kanban
  const moveToColumn = useCallback((id, column, fastLane) => {
    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const fromLane = t.fastLane ? 'fast' : 'normal';
        const toLane = fastLane !== undefined ? (fastLane ? 'fast' : 'normal') : fromLane;
        const updated = addHistoryEntry(t, 'column-changed', `${fromLane}:${t.kanbanColumn}`, `${toLane}:${column}`);
        const result = { ...updated, kanbanColumn: column };
        if (column === 'done') {
          result.completedAt = new Date().toISOString();
        }
        if (fastLane !== undefined) {
          // Fast lane is one-way: can only be set to true, never back to false
          if (fastLane === true || t.fastLane === false) {
            result.fastLane = fastLane;
          }
        }
        return result;
      })
    );
  }, [updateTasks]);

  // Toggle Fast Lane (only ON, never OFF)
  const toggleFastLane = useCallback((id) => {
    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        // Can only enable fast lane, never disable
        if (t.fastLane) return t;
        const updated = addHistoryEntry(t, 'fast-lane', 'normal', 'fast');
        return { ...updated, fastLane: true };
      })
    );
  }, [updateTasks]);

  // Assign skills (with XP system)
  const assignSkills = useCallback((taskId, skillIds) => {
    const task = tasks.find((t) => t.id === taskId);
    const xpPerSkill = task?.xp || 0;

    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = addHistoryEntry(t, 'skills-assigned', null, skillIds.join(','));
        return { ...updated, skillsLearned: skillIds };
      })
    );
    const now = new Date().toISOString();
    updateSkills((prev) =>
      prev.map((s) => {
        if (!skillIds.includes(s.id)) return s;
        const newXp = (s.xpCurrent || 0) + xpPerSkill;
        // Ensure at least 1 XP so skill moves to level 1 (Novice)
        const finalXp = Math.max(newXp, 1);
        const newLevel = getLevel(finalXp);
        return {
          ...s,
          xpCurrent: finalXp,
          level: newLevel,
          status: newLevel >= 1 ? 'learned' : 'open',
          learnedAt: s.learnedAt || (newLevel >= 1 ? now : null),
          learnedFrom: [...new Set([...s.learnedFrom, taskId])],
        };
      })
    );
  }, [tasks, updateTasks, updateSkills]);

  // --- Skill CRUD (new in v5) ---

  // Bulk import skills (auto-creates missing categories)
  const importSkills = useCallback((skillList) => {
    // Auto-create missing categories
    const existingIds = new Set(categories.map((c) => c.id));
    const newCats = [];
    for (const s of skillList) {
      if (s.category && !existingIds.has(s.category) && !newCats.find((c) => c.id === s.category)) {
        const catId = s.category;
        newCats.push({
          id: catId,
          label: s.categoryLabel || catId.charAt(0).toUpperCase() + catId.slice(1),
          icon: '\uD83D\uDCCC',
          predefined: false,
          order: categories.length + newCats.length,
        });
        existingIds.add(catId);
      }
    }
    if (newCats.length > 0) {
      updateCategories((prev) => [...prev, ...newCats]);
    }

    const allCats = [...categories, ...newCats];
    const now = new Date().toISOString();
    const newSkills = skillList.map((s) => {
      const cat = allCats.find((c) => c.id === s.category);
      return {
        id: `custom-${uuidv4()}`,
        name: s.name,
        category: s.category || categories[0]?.id || 'frontend',
        categoryLabel: cat?.label || s.categoryLabel || s.category,
        status: s.status || 'open',
        level: s.level != null ? s.level : 0,
        xpCurrent: s.xpCurrent != null ? s.xpCurrent : 0,
        learnedFrom: [],
        predefined: false,
        createdAt: now,
        learnedAt: s.status === 'learned' ? now : null,
        hidden: false,
      };
    });
    updateSkills((prev) => [...prev, ...newSkills]);
    return newSkills;
  }, [updateSkills, updateCategories, categories]);

  const createSkill = useCallback((name, categoryId) => {
    const now = new Date().toISOString();
    const cat = categories.find((c) => c.id === categoryId);
    const newSkill = {
      id: `custom-${uuidv4()}`,
      name,
      category: categoryId,
      categoryLabel: cat?.label || categoryId,
      status: 'open',
      level: 0,
      xpCurrent: 0,
      learnedFrom: [],
      predefined: false,
      createdAt: now,
      learnedAt: null,
      hidden: false,
    };
    updateSkills((prev) => [...prev, newSkill]);
    return newSkill;
  }, [updateSkills, categories]);

  const updateSkill = useCallback((id, updates) => {
    updateSkills((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        // Sync categoryLabel when category changes
        if (updates.category && updates.category !== s.category) {
          const cat = categories.find((c) => c.id === updates.category);
          updated.categoryLabel = cat?.label || updates.category;
        }
        return updated;
      })
    );
  }, [updateSkills, categories]);

  const deleteSkill = useCallback((id) => {
    updateSkills((prev) => {
      const skill = prev.find((s) => s.id === id);
      // Only delete custom skills
      if (skill && skill.predefined) return prev;
      return prev.filter((s) => s.id !== id);
    });
  }, [updateSkills]);

  const toggleSkillHidden = useCallback((id) => {
    updateSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s))
    );
  }, [updateSkills]);

  const toggleSkillStatus = useCallback((id) => {
    const now = new Date().toISOString();
    updateSkills((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (s.status === 'learned') {
          return { ...s, status: 'open', level: 0, xpCurrent: 0, learnedAt: null };
        }
        return { ...s, status: 'learned', level: Math.max(s.level || 0, 3), xpCurrent: Math.max(s.xpCurrent || 0, 250), learnedAt: now };
      })
    );
  }, [updateSkills]);

  // --- Category CRUD (new in v5) ---

  const createCategory = useCallback((label, icon) => {
    const id = `custom-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
    const dashboardCount = categories.filter((c) => c.showInDashboard).length;
    const newCat = {
      id,
      label,
      icon: icon || '\uD83D\uDCCC',
      predefined: false,
      order: categories.length,
      showInDashboard: dashboardCount < 6,
    };
    updateCategories((prev) => [...prev, newCat]);
    return newCat;
  }, [updateCategories, categories]);

  const toggleCategoryDashboard = useCallback((catId) => {
    updateCategories((prev) => {
      const cat = prev.find((c) => c.id === catId);
      if (!cat) return prev;
      // If turning on, check max 6 limit
      if (!cat.showInDashboard) {
        const currentCount = prev.filter((c) => c.showInDashboard).length;
        if (currentCount >= 6) return prev;
      }
      return prev.map((c) => (c.id === catId ? { ...c, showInDashboard: !c.showInDashboard } : c));
    });
  }, [updateCategories]);

  const updateCategory = useCallback((id, updates) => {
    updateCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    // Sync categoryLabel on all skills in this category
    if (updates.label) {
      updateSkills((prev) =>
        prev.map((s) => (s.category === id ? { ...s, categoryLabel: updates.label } : s))
      );
    }
  }, [updateCategories, updateSkills]);

  const deleteCategory = useCallback((id) => {
    updateCategories((prev) => {
      const cat = prev.find((c) => c.id === id);
      // Only delete custom categories
      if (cat && cat.predefined) return prev;
      return prev.filter((c) => c.id !== id);
    });
  }, [updateCategories]);

  // Filtered getters
  const eisenhowerTasks = tasks.filter((t) => t.location === 'eisenhower');
  const kanbanTasks = tasks.filter((t) => t.location === 'kanban');

  const getQuadrantTasks = (quadrant) =>
    eisenhowerTasks
      .filter((t) => t.quadrant === quadrant)
      .sort((a, b) => a.order - b.order);

  const getColumnTasks = (column, isFastLane) =>
    kanbanTasks
      .filter(
        (t) =>
          t.kanbanColumn === column &&
          (isFastLane ? t.fastLane === true : t.fastLane !== true)
      )
      .sort((a, b) => a.order - b.order);

  // Shared done column - all done tasks, both lanes
  const getDoneTasksGrouped = () => {
    const doneTasks = kanbanTasks
      .filter((t) => t.kanbanColumn === 'done')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      lastWeek: doneTasks.filter((t) => new Date(t.completedAt) >= weekAgo),
      lastMonth: doneTasks.filter(
        (t) => new Date(t.completedAt) < weekAgo && new Date(t.completedAt) >= monthAgo
      ),
      older: doneTasks.filter((t) => new Date(t.completedAt) < monthAgo),
    };
  };

  // Wildcard counter: how many fast lane tasks were started today
  const getWildcardsUsedToday = useCallback(() => {
    const today = new Date().toDateString();
    return kanbanTasks.filter(
      (t) => t.fastLane && t.startedAt && new Date(t.startedAt).toDateString() === today
    ).length;
  }, [kanbanTasks]);

  // Export all data as JSON
  const exportData = useCallback(() => {
    const exportObj = {
      version: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      tasks: tasks,
      skills: skills,
      categories: categories,
      settings: settings,
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroforge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks, skills, categories, settings]);

  // Restore from exported JSON (BUG-001 fix: merge instead of replace)
  const restoreData = useCallback((data) => {
    if (!data || !data.tasks || !data.skills) return false;

    // Migrate the backup data first
    const migrated = migrateState({
      version: data.version || 1,
      tasks: data.tasks,
      skills: data.skills,
      categories: data.categories,
    });

    // Merge skills and categories with predefined ones
    const mergedSkills = mergeSkillsWithPredefined(migrated.skills);
    const mergedCategories = mergeCategoriesWithPredefined(migrated.categories);

    setRawState({
      ...migrated,
      skills: mergedSkills,
      categories: mergedCategories,
      settings: migrated.settings || DEFAULT_SETTINGS,
    });
    return true;
  }, [setRawState]);

  return {
    tasks,
    skills,
    categories,
    settings,
    eisenhowerTasks,
    kanbanTasks,
    getQuadrantTasks,
    getColumnTasks,
    getDoneTasksGrouped,
    getWildcardsUsedToday,
    createTask,
    importTasks,
    updateTask,
    deleteTask,
    startTask,
    returnToBacklog,
    moveToQuadrant,
    moveToColumn,
    toggleFastLane,
    assignSkills,
    importSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    toggleSkillHidden,
    toggleSkillStatus,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryDashboard,
    updateCategories,
    updateSettings,
    exportData,
    restoreData,
  };
}
