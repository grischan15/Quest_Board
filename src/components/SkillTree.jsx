import { useState } from 'react';
import { getLevelLabel, getXpForNextLevel, LEVEL_THRESHOLDS } from '../data/questTypes';
import { getProjectStatus } from '../data/projectHelpers';
import RpgDashboard from './RpgDashboard';
import ProjectCard from './ProjectCard';
import './SkillTree.css';

export default function SkillTree({ skills, tasks, categories, projects, onEditSkill, onAddSkill, onEditCategory, onAddProject, onEditProject, onToggleDashboard }) {
  const [collapsed, setCollapsed] = useState({});
  const [showHidden, setShowHidden] = useState(false);
  const [showDoneProjects, setShowDoneProjects] = useState(false);

  const visibleSkills = skills.filter((s) => !s.hidden);
  const hiddenSkills = skills.filter((s) => s.hidden);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const categoryData = sortedCategories.map((cat) => {
    const catSkills = visibleSkills.filter((s) => s.category === cat.id);
    const active = catSkills.filter((s) => (s.level || 0) >= 1).length;
    const total = catSkills.length;
    const totalXp = catSkills.reduce((sum, s) => sum + (s.xpCurrent || 0), 0);
    return {
      ...cat,
      skills: catSkills,
      active,
      total,
      totalXp,
      percent: total > 0 ? Math.round((active / total) * 100) : 0,
    };
  });

  const totalActive = visibleSkills.filter((s) => (s.level || 0) >= 1).length;
  const totalSkills = visibleSkills.length;
  const totalXp = visibleSkills.reduce((sum, s) => sum + (s.xpCurrent || 0), 0);

  const dashboardCount = categories.filter((c) => c.showInDashboard).length;

  function getStars(level) {
    if (level <= 0) return '\u2B1C';
    return '\u2B50'.repeat(level);
  }

  function getXpProgress(skill) {
    const level = skill.level || 0;
    const xp = skill.xpCurrent || 0;
    if (level >= 5) return { percent: 100, current: xp, next: null };
    const currentThreshold = LEVEL_THRESHOLDS[level] || 0;
    const nextThreshold = getXpForNextLevel(level);
    if (!nextThreshold) return { percent: 100, current: xp, next: null };
    const range = nextThreshold - currentThreshold;
    const progress = xp - currentThreshold;
    return {
      percent: range > 0 ? Math.min(100, Math.round((progress / range) * 100)) : 0,
      current: xp,
      next: nextThreshold,
    };
  }

  function toggleCategory(catId) {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  }

  return (
    <div className="skilltree-wrapper">
      <div className="skilltree-header">
        <h2 className="skilltree-title">Skill-Tree</h2>
        <div className="skilltree-total">
          {totalActive}/{totalSkills} Skills aktiv &middot; {totalXp} XP gesamt
        </div>
      </div>

      <div className="skilltree-layout">
        {/* Skill Tree - Left */}
        <div className="skilltree-main">
          {/* Projects Section – gleiche Filterlogik wie Dashboard/RPG: nicht-done zuerst */}
          {(projects && projects.length > 0 || onAddProject) && (() => {
            const activeProjects = (projects || []).filter((p) => getProjectStatus(p, skills) !== 'done');
            const doneProjects = (projects || []).filter((p) => getProjectStatus(p, skills) === 'done');
            return (
              <div className="project-section">
                <div className="project-section-header">
                  <h3 className="project-section-title">Projekte</h3>
                  {onAddProject && (
                    <button className="project-add-btn" onClick={onAddProject}>
                      + Projekt
                    </button>
                  )}
                </div>
                {activeProjects.length > 0 ? (
                  <div className="project-grid">
                    {activeProjects.map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        project={proj}
                        skills={skills}
                        onClick={onEditProject ? () => onEditProject(proj) : undefined}
                      />
                    ))}
                  </div>
                ) : projects && projects.length > 0 ? null : (
                  <div className="project-empty">
                    Erstelle dein erstes Projekt &ndash; definiere welche Skills du brauchst, um es freizuschalten!
                  </div>
                )}
                {doneProjects.length > 0 && (
                  <>
                    <button
                      className="project-done-toggle"
                      onClick={() => setShowDoneProjects((prev) => !prev)}
                    >
                      <span>{showDoneProjects ? '\u25BC' : '\u25B6'}</span>
                      <span>Abgeschlossene Projekte ({doneProjects.length})</span>
                    </button>
                    {showDoneProjects && (
                      <div className="project-grid project-grid-done">
                        {doneProjects.map((proj) => (
                          <ProjectCard
                            key={proj.id}
                            project={proj}
                            skills={skills}
                            onClick={onEditProject ? () => onEditProject(proj) : undefined}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}

          {totalActive === 0 && (
            <div className="empty-state">
              <p>Schliesse Quests ab um Skills zu leveln!</p>
            </div>
          )}

          <div className="skilltree-categories">
            {categoryData.map((cat) => (
              <div key={cat.id} className="skill-category">
                <div className="skill-category-header-row">
                  <button
                    className="skill-category-header"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <span className="skill-cat-icon">{cat.icon}</span>
                    <span className="skill-cat-label">{cat.label}</span>
                    <span className="skill-cat-count">
                      {cat.active}/{cat.total} &middot; {cat.totalXp} XP
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
                  {onToggleDashboard && (
                    <button
                      className={`skill-eye-icon ${cat.showInDashboard ? 'skill-eye-active' : 'skill-eye-inactive'}`}
                      onClick={(e) => { e.stopPropagation(); onToggleDashboard(cat.id); }}
                      title={cat.showInDashboard ? 'Aus Dashboard entfernen' : (dashboardCount >= 6 ? 'Max. 6 Kategorien im Dashboard' : 'Im Dashboard anzeigen')}
                      disabled={!cat.showInDashboard && dashboardCount >= 6}
                    >
                      {cat.showInDashboard ? '\uD83D\uDC41' : '\uD83D\uDC41\u200D\uD83D\uDDE8'}
                    </button>
                  )}
                  {onEditCategory && (
                    <button
                      className="skill-edit-icon"
                      onClick={(e) => { e.stopPropagation(); onEditCategory(cat); }}
                      title="Kategorie bearbeiten"
                    >
                      {'\u270E'}
                    </button>
                  )}
                </div>

                {!collapsed[cat.id] && (
                  <div className="skill-list">
                    {cat.skills.map((skill) => {
                      const level = skill.level || 0;
                      const xpProg = getXpProgress(skill);
                      return (
                        <div
                          key={skill.id}
                          className={`skill-item ${
                            level >= 1 ? 'skill-learned' : 'skill-open'
                          } ${onEditSkill ? 'skill-item-clickable' : ''}`}
                          onClick={onEditSkill ? () => onEditSkill(skill) : undefined}
                        >
                          <span className="skill-level-stars">
                            {getStars(level)}
                          </span>
                          <div className="skill-info">
                            <div className="skill-name-row">
                              <span className="skill-name">{skill.name}</span>
                              <span className={`skill-level-label skill-level-${level}`}>
                                {getLevelLabel(level)}
                              </span>
                            </div>
                            <div className="skill-xp-row">
                              <div className="skill-xp-bar">
                                <div
                                  className="skill-xp-fill"
                                  style={{ width: `${xpProg.percent}%` }}
                                />
                              </div>
                              <span className="skill-xp-text">
                                {xpProg.current}{xpProg.next !== null ? `/${xpProg.next}` : ''} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {onAddSkill && (
                      <button
                        className="skill-add-btn"
                        onClick={() => onAddSkill(cat.id)}
                      >
                        + Skill
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

          </div>

          {/* Hidden Skills Section */}
          {hiddenSkills.length > 0 && (
            <div className="hidden-skills-section">
              <button
                className="hidden-skills-toggle"
                onClick={() => setShowHidden((prev) => !prev)}
              >
                <span>Ausgeblendete Skills ({hiddenSkills.length})</span>
                <span className="skill-cat-chevron">{showHidden ? '\u25BC' : '\u25B6'}</span>
              </button>
              {showHidden && (
                <div className="hidden-skills-list">
                  {hiddenSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`skill-item skill-item-hidden ${onEditSkill ? 'skill-item-clickable' : ''}`}
                      onClick={onEditSkill ? () => onEditSkill(skill) : undefined}
                    >
                      <span className="skill-status-icon">{'\uD83D\uDEAB'}</span>
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-date">
                          {categories.find((c) => c.id === skill.category)?.label || skill.categoryLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RPG Dashboard - Right */}
        <RpgDashboard skills={skills} tasks={tasks} categories={categories} projects={projects} />
      </div>
    </div>
  );
}
