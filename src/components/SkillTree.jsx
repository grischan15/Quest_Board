import { useState } from 'react';
import { categoryOrder, categoryIcons } from '../data/skillsData';
import './SkillTree.css';

export default function SkillTree({ skills, tasks }) {
  const [collapsed, setCollapsed] = useState({});

  const categories = categoryOrder.map((cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    const learned = catSkills.filter((s) => s.status === 'learned').length;
    const total = catSkills.length;
    return {
      id: cat,
      label: catSkills[0]?.categoryLabel || cat,
      icon: categoryIcons[cat] || '',
      skills: catSkills,
      learned,
      total,
      percent: total > 0 ? Math.round((learned / total) * 100) : 0,
    };
  });

  const totalLearned = skills.filter((s) => s.status === 'learned').length;
  const totalSkills = skills.length;
  const totalPercent = totalSkills > 0 ? Math.round((totalLearned / totalSkills) * 100) : 0;

  // Done tasks grouped by time
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const doneTasks = tasks
    .filter((t) => t.kanbanColumn === 'done' && t.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  const lastWeekTasks = doneTasks.filter((t) => new Date(t.completedAt) >= weekAgo);
  const lastMonthTasks = doneTasks.filter(
    (t) => new Date(t.completedAt) < weekAgo && new Date(t.completedAt) >= monthAgo
  );

  function getTaskTitle(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    return task?.title || 'Unbekannt';
  }

  function formatDate(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function formatDateShort(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  }

  function toggleCategory(catId) {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  }

  return (
    <div className="skilltree-wrapper">
      <div className="skilltree-header">
        <h2 className="skilltree-title">Skill-Tree</h2>
        <div className="skilltree-total">
          Gesamt: {totalLearned}/{totalSkills} ({totalPercent}%)
        </div>
      </div>

      <div className="skilltree-layout">
        {/* Skill Tree - Left */}
        <div className="skilltree-main">
          {totalLearned === 0 && (
            <div className="empty-state">
              <p>Schliesse Quests ab um Skills zu sammeln!</p>
            </div>
          )}

          <div className="skilltree-categories">
            {categories.map((cat) => (
              <div key={cat.id} className="skill-category">
                <button
                  className="skill-category-header"
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span className="skill-cat-icon">{cat.icon}</span>
                  <span className="skill-cat-label">{cat.label}</span>
                  <span className="skill-cat-count">
                    {cat.learned}/{cat.total}
                  </span>
                  <div className="skill-progress-bar">
                    <div
                      className="skill-progress-fill"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                  <span className="skill-cat-chevron">
                    {collapsed[cat.id] ? '\u25B6' : '\u25BC'}
                  </span>
                </button>

                {!collapsed[cat.id] && (
                  <div className="skill-list">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`skill-item ${
                          skill.status === 'learned' ? 'skill-learned' : 'skill-open'
                        }`}
                      >
                        <span className="skill-status-icon">
                          {skill.status === 'learned' ? '\u2705' : '\u2B1C'}
                        </span>
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <div className="skill-dates">
                            {skill.createdAt && (
                              <span className="skill-date">Angelegt: {formatDate(skill.createdAt)}</span>
                            )}
                            {skill.learnedAt && (
                              <span className="skill-date skill-date-learned">Gelernt: {formatDate(skill.learnedAt)}</span>
                            )}
                          </div>
                        </div>
                        {skill.learnedFrom.length > 0 && (
                          <span className="skill-source">
                            ({skill.learnedFrom.map(getTaskTitle).join(', ')})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Letzter Monat - Middle */}
        <div className="done-panel done-panel-month">
          <div className="done-panel-header">
            <div className="done-panel-title">Letzter Monat</div>
            <div className="done-panel-subtitle">erledigt</div>
            <div className="done-panel-count">{lastMonthTasks.length}</div>
          </div>
          <div className="done-panel-list">
            {lastMonthTasks.length === 0 ? (
              <div className="done-panel-empty">Noch keine Quests diesen Monat erledigt</div>
            ) : (
              lastMonthTasks.map((task) => (
                <div key={task.id} className={`done-panel-item ${task.fastLane ? 'done-panel-item-fast' : ''}`}>
                  <span className="done-panel-check">{'\u2713'}</span>
                  <div className="done-panel-item-info">
                    <span className="done-panel-item-title">{task.title}</span>
                    <span className="done-panel-item-date">{formatDateShort(task.completedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Letzte Woche - Right (most prominent) */}
        <div className="done-panel done-panel-week">
          <div className="done-panel-header">
            <div className="done-panel-title">Letzte Woche</div>
            <div className="done-panel-subtitle">erledigt</div>
            <div className="done-panel-count done-panel-count-week">{lastWeekTasks.length}</div>
          </div>
          <div className="done-panel-list">
            {lastWeekTasks.length === 0 ? (
              <div className="done-panel-empty">Noch keine Quests diese Woche erledigt</div>
            ) : (
              lastWeekTasks.map((task) => (
                <div key={task.id} className={`done-panel-item done-panel-item-recent ${task.fastLane ? 'done-panel-item-fast' : ''}`}>
                  <span className="done-panel-check">{'\u2713'}</span>
                  <div className="done-panel-item-info">
                    <span className="done-panel-item-title">{task.title}</span>
                    <span className="done-panel-item-date">{formatDateShort(task.completedAt)}</span>
                  </div>
                  {task.skillsLearned.length > 0 && (
                    <span className="done-panel-skills">+{task.skillsLearned.length} Skills</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
