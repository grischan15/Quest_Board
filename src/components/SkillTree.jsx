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

  function getTaskTitle(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    return task?.title || 'Unbekannt';
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
                    <span className="skill-name">{skill.name}</span>
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
  );
}
