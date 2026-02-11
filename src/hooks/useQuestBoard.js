import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { initialSkills } from '../data/skillsData';

const STORAGE_KEY = 'questboard';
const SCHEMA_VERSION = 3;

const defaultState = {
  version: SCHEMA_VERSION,
  tasks: [],
  skills: initialSkills,
};

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
      return task;
    }),
  };
  return migrated;
}

function addHistoryEntry(task, action, from, to) {
  return {
    ...task,
    history: [...(task.history || []), { action, from, to, timestamp: new Date().toISOString() }],
  };
}

export const KANBAN_COLUMNS = [
  { id: 'prepare', label: 'Vorbereiten', icon: '\uD83D\uDCC1' },
  { id: 'develop', label: 'Entwickeln', icon: '\uD83D\uDCBB' },
  { id: 'testing-intern', label: 'Testing Intern', icon: '\uD83D\uDD0D' },
  { id: 'testing-extern', label: 'Testing Extern', icon: '\uD83E\uDDEA' },
  { id: 'done', label: 'Done', icon: '\uD83C\uDF89' },
];

export function useQuestBoard() {
  const [rawState, setRawState] = useLocalStorage(STORAGE_KEY, defaultState);
  const state = migrateState(rawState);

  if (rawState.version !== state.version) {
    setRawState(state);
  }

  const tasks = state.tasks || [];
  const skills = state.skills || initialSkills;

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

  // Task CRUD
  const createTask = useCallback((title, description, quadrant, dueDate) => {
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

  // Assign skills
  const assignSkills = useCallback((taskId, skillIds) => {
    updateTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = addHistoryEntry(t, 'skills-assigned', null, skillIds.join(','));
        return { ...updated, skillsLearned: skillIds };
      })
    );
    updateSkills((prev) =>
      prev.map((s) =>
        skillIds.includes(s.id)
          ? { ...s, status: 'learned', learnedFrom: [...new Set([...s.learnedFrom, taskId])] }
          : s
      )
    );
  }, [updateTasks, updateSkills]);

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

  // Export all data as JSON
  const exportData = useCallback(() => {
    const exportObj = {
      version: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      tasks: tasks,
      skills: skills,
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quest-board-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks, skills]);

  // Restore from exported JSON
  const restoreData = useCallback((data) => {
    if (!data || !data.tasks || !data.skills) return false;
    const migrated = migrateState({
      version: data.version || 1,
      tasks: data.tasks,
      skills: data.skills,
    });
    setRawState(migrated);
    return true;
  }, [setRawState]);

  return {
    tasks,
    skills,
    eisenhowerTasks,
    kanbanTasks,
    getQuadrantTasks,
    getColumnTasks,
    getDoneTasksGrouped,
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
    exportData,
    restoreData,
  };
}
