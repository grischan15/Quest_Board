import { getLevelLabel } from '../data/questTypes';
import './RecentSkills.css';

function formatDateShort(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

export default function RecentSkills({ skills, tasks }) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Find tasks completed in the last month that assigned skills
  const recentDone = tasks
    .filter((t) => t.kanbanColumn === 'done' && t.completedAt && t.skillsLearned?.length > 0)
    .filter((t) => new Date(t.completedAt) >= monthAgo)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // Aggregate XP per skill from recent tasks
  const skillMap = new Map();
  for (const task of recentDone) {
    const xpPerSkill = task.xp || 0;
    const isLastWeek = new Date(task.completedAt) >= weekAgo;
    for (const skillId of task.skillsLearned) {
      if (!skillMap.has(skillId)) {
        skillMap.set(skillId, { xpGained: 0, lastDate: task.completedAt, isLastWeek });
      }
      const entry = skillMap.get(skillId);
      entry.xpGained += xpPerSkill;
      if (new Date(task.completedAt) > new Date(entry.lastDate)) {
        entry.lastDate = task.completedAt;
        entry.isLastWeek = isLastWeek;
      }
    }
  }

  // Build display list
  const recentEntries = [];
  for (const [skillId, data] of skillMap) {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) continue;
    recentEntries.push({
      id: skillId,
      name: skill.name,
      level: skill.level || 0,
      xpGained: data.xpGained,
      lastDate: data.lastDate,
      isLastWeek: data.isLastWeek,
    });
  }

  // Sort by most recent first
  recentEntries.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));

  // Split into week / month, max 5 total
  const MAX_ENTRIES = 5;
  const weekSkills = recentEntries.filter((e) => e.isLastWeek).slice(0, MAX_ENTRIES);
  const remaining = MAX_ENTRIES - weekSkills.length;
  const monthSkills = remaining > 0
    ? recentEntries.filter((e) => !e.isLastWeek).slice(0, remaining)
    : [];

  if (recentEntries.length === 0) {
    return (
      <div className="recent-skills">
        <div className="recent-skills-title">Kuerzlich gelernt</div>
        <div className="recent-skills-empty">
          Schliesse Quests ab und weise Skills zu, um hier Fortschritte zu sehen.
        </div>
      </div>
    );
  }

  return (
    <div className="recent-skills">
      {weekSkills.length > 0 && (
        <div className="recent-skills-group">
          <div className="recent-skills-title">Letzte Woche</div>
          <div className="recent-skills-list">
            {weekSkills.map((entry) => (
              <div key={entry.id} className="recent-skill-item recent-skill-item-week">
                <div className="recent-skill-info">
                  <span className="recent-skill-name">{entry.name}</span>
                  <span className={`recent-skill-level skill-level-${entry.level}`}>
                    {getLevelLabel(entry.level)}
                  </span>
                </div>
                <div className="recent-skill-meta">
                  <span className="recent-skill-xp">+{entry.xpGained} XP</span>
                  <span className="recent-skill-date">{formatDateShort(entry.lastDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {monthSkills.length > 0 && (
        <div className="recent-skills-group">
          <div className="recent-skills-title">Letzter Monat</div>
          <div className="recent-skills-list">
            {monthSkills.map((entry) => (
              <div key={entry.id} className="recent-skill-item">
                <div className="recent-skill-info">
                  <span className="recent-skill-name">{entry.name}</span>
                  <span className={`recent-skill-level skill-level-${entry.level}`}>
                    {getLevelLabel(entry.level)}
                  </span>
                </div>
                <div className="recent-skill-meta">
                  <span className="recent-skill-xp">+{entry.xpGained} XP</span>
                  <span className="recent-skill-date">{formatDateShort(entry.lastDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
