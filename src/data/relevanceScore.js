const DURATION_MINUTES = { sprint: 15, short: 30, long: 45 };
const QUADRANT_WEIGHT = { q1: 6, q2: 4, q3: 3, q4: 1, unsorted: 0 };

/**
 * Returns true if at least one dependsOn task is NOT done.
 */
function isBlocked(task, allTasks) {
  if (!task.dependsOn || task.dependsOn.length === 0) return false;
  return task.dependsOn.some((depId) => {
    const dep = allTasks.find((t) => t.id === depId);
    return dep && dep.kanbanColumn !== 'done';
  });
}

/**
 * Recursively sums durations of all non-done dependencies (with cycle protection).
 */
function getDependencyDuration(task, allTasks, visited = new Set()) {
  if (!task.dependsOn || visited.has(task.id)) return 0;
  visited.add(task.id);
  let total = 0;
  for (const depId of task.dependsOn) {
    const dep = allTasks.find((t) => t.id === depId);
    if (!dep || dep.kanbanColumn === 'done') continue;
    total += DURATION_MINUTES[dep.duration] || 30;
    total += getDependencyDuration(dep, allTasks, visited);
  }
  return total;
}

/**
 * Calculates the relevance score for a task.
 *
 * Returns: { score, blocked, overdue, daysLeft }
 *   score = -1  → blocked (dependencies not done)
 *   score = 0   → no dueDate (stays in manual order)
 *   score > 0   → urgency ranking
 *   score >= 100 → overdue
 */
function calculateRelevanceScore(task, allTasks) {
  const blocked = isBlocked(task, allTasks);
  if (blocked) {
    return { score: -1, blocked: true, overdue: false, daysLeft: null };
  }

  if (!task.dueDate) {
    return { score: 0, blocked: false, overdue: false, daysLeft: null };
  }

  const now = new Date();
  const due = new Date(task.dueDate);
  const ownMinutes = DURATION_MINUTES[task.duration] || 30;
  const depMinutes = getDependencyDuration(task, allTasks);
  const totalWorkMs = (ownMinutes + depMinutes) * 60 * 1000;

  const availableMs = due.getTime() - (now.getTime() + totalWorkMs);
  const daysLeft = availableMs / (24 * 60 * 60 * 1000);

  const quadrant = task.quadrant || 'unsorted';
  const priorityFactor = QUADRANT_WEIGHT[quadrant] || 0;

  if (daysLeft < 0) {
    // Overdue
    return {
      score: priorityFactor * 100,
      blocked: false,
      overdue: true,
      daysLeft: Math.round(daysLeft),
    };
  }

  // Still time left
  const score = Math.max(1, 7 - daysLeft) * priorityFactor;
  return {
    score: Math.round(score * 10) / 10,
    blocked: false,
    overdue: false,
    daysLeft: Math.round(daysLeft),
  };
}

export { isBlocked, calculateRelevanceScore, QUADRANT_WEIGHT, DURATION_MINUTES };
