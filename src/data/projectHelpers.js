/**
 * Pure computed helper functions for Projects.
 * Projects are Unlock-Ziele – their status is computed from Skill levels.
 */

export const PROJECT_STATUS_CONFIG = {
  done: { label: 'Abgeschlossen', icon: '\u2705', color: '#2d8a4e', bg: 'rgba(45,138,78,0.08)' },
  active: { label: 'Aktiv', icon: '\uD83D\uDD25', color: '#e6a817', bg: 'rgba(230,168,23,0.08)' },
  ready: { label: 'Bereit', icon: '\uD83D\uDE80', color: '#2196F3', bg: 'rgba(33,150,243,0.08)' },
  locked: { label: 'Gesperrt', icon: '\uD83D\uDD12', color: '#999', bg: 'rgba(0,0,0,0.04)' },
};

/**
 * Get the computed status of a project based on skill levels.
 * - done: project.status === 'done' (manually toggled)
 * - active: project.status === 'active' AND not all requirements met
 * - ready: all requirements met (but not yet marked done)
 * - locked: not all requirements met and status !== 'active'
 */
export function getProjectStatus(project, skills) {
  if (project.status === 'done') return 'done';

  const { met, total } = getProjectProgress(project, skills);
  const allMet = total > 0 && met === total;

  if (allMet) return 'ready';
  if (project.status === 'active') return 'active';
  return 'locked';
}

/**
 * Calculate progress: how many requirements are met.
 */
export function getProjectProgress(project, skills) {
  const reqs = project.requirements || [];
  const total = reqs.length;
  if (total === 0) return { met: 0, total: 0, percent: 0 };

  const skillMap = new Map(skills.map((s) => [s.id, s]));
  let met = 0;

  for (const req of reqs) {
    const skill = skillMap.get(req.skillId);
    if (skill && (skill.level || 0) >= req.requiredLevel) {
      met++;
    }
  }

  return { met, total, percent: Math.round((met / total) * 100) };
}

/**
 * Get all projects that require a given skill.
 */
export function getProjectsForSkill(skillId, projects) {
  return (projects || []).filter((p) =>
    (p.requirements || []).some((r) => r.skillId === skillId)
  );
}

/**
 * Get quests whose linkedSkills overlap with project requirements.
 */
export function getRelevantQuests(project, tasks) {
  const reqSkillIds = new Set((project.requirements || []).map((r) => r.skillId));
  return (tasks || []).filter((t) =>
    (t.linkedSkills || []).some((sid) => reqSkillIds.has(sid))
  );
}
