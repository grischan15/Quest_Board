import { useMemo } from 'react';
import RadarChart from './RadarChart';
import CharacterCard from './CharacterCard';
import RecentSkills from './RecentSkills';
import { RPG_ATTRIBUTES } from '../data/questTypes';
import { getProjectStatus, getProjectProgress, PROJECT_STATUS_CONFIG } from '../data/projectHelpers';
import './RpgDashboard.css';

export default function RpgDashboard({ skills, tasks, categories, projects }) {
  const { categoryStrengths, totalLevel, totalXP, nextLevel1, nextLevel2, progress1, progress2, weakestCategory } = useMemo(() => {
    const visibleSkills = skills.filter((s) => !s.hidden);
    const dashboardCats = [...categories]
      .filter((c) => c.showInDashboard)
      .sort((a, b) => a.order - b.order);

    const strengths = dashboardCats.map((cat, i) => {
      const catSkills = visibleSkills.filter((s) => s.category === cat.id);
      const levelSum = catSkills.reduce((sum, s) => sum + (s.level || 0), 0);
      const maxLevelSum = catSkills.length * 5;
      const strength = maxLevelSum > 0 ? (levelSum / maxLevelSum) * 100 : 0;
      return {
        catId: cat.id,
        label: cat.label,
        rpgName: RPG_ATTRIBUTES[i] || `AT${i + 1}`,
        icon: cat.icon,
        strength,
        levelSum,
        maxLevelSum,
        skillCount: catSkills.length,
      };
    });

    const tXP = visibleSkills.reduce((sum, s) => sum + (s.xpCurrent || 0), 0);

    // Character Level = average of category strengths, scaled to 0-5
    const avgStrength = strengths.length > 0
      ? strengths.reduce((sum, s) => sum + s.strength, 0) / strengths.length
      : 0;
    const tLevel = Math.round((avgStrength / 100) * 5 * 10) / 10;

    // Next integer levels + progress (skip already reached levels)
    const nextLevel1 = (Number.isInteger(tLevel) && tLevel > 0) ? tLevel + 1 : (Math.ceil(tLevel) || 1);
    const nextLevel2 = nextLevel1 + 1;
    const strengthForLevel = (lvl) => (lvl / 5) * 100;
    const progress1 = Math.min(100, avgStrength / strengthForLevel(nextLevel1) * 100);
    const progress2 = Math.min(100, avgStrength / strengthForLevel(nextLevel2) * 100);

    // Weakest category = biggest lever
    const weakestCat = strengths.length > 0
      ? strengths.reduce((min, s) => s.strength < min.strength ? s : min, strengths[0])
      : null;

    return {
      categoryStrengths: strengths,
      totalLevel: tLevel,
      totalXP: tXP,
      nextLevel1,
      nextLevel2,
      progress1,
      progress2,
      weakestCategory: weakestCat,
    };
  }, [skills, categories]);

  if (categoryStrengths.length === 0) {
    return (
      <div className="rpg-dashboard rpg-dashboard-empty">
        <div className="rpg-dashboard-empty-text">
          Aktiviere Kategorien im Skill-Tree mit dem Auge-Icon, um das RPG Dashboard zu sehen.
        </div>
      </div>
    );
  }

  const activeProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return projects
      .map((p) => ({
        ...p,
        computedStatus: getProjectStatus(p, skills),
        progress: getProjectProgress(p, skills),
      }))
      .filter((p) => p.computedStatus !== 'done');
  }, [projects, skills]);

  return (
    <div className="rpg-dashboard">
      <RadarChart categoryStrengths={categoryStrengths} />
      <CharacterCard
        categoryStrengths={categoryStrengths}
        totalLevel={totalLevel}
        totalXP={totalXP}
        nextLevel1={nextLevel1}
        nextLevel2={nextLevel2}
        progress1={progress1}
        progress2={progress2}
        weakestCategory={weakestCategory}
      />
      {activeProjects.length > 0 && (
        <div className="rpg-projects">
          <h4 className="rpg-projects-title">Aktive Projekte</h4>
          <div className="rpg-projects-list">
            {activeProjects.map((proj) => {
              const cfg = PROJECT_STATUS_CONFIG[proj.computedStatus];
              return (
                <div key={proj.id} className="rpg-project-item">
                  <span className="rpg-project-icon">{proj.icon}</span>
                  <div className="rpg-project-info">
                    <span className="rpg-project-name">{proj.name}</span>
                    <div className="rpg-project-bar">
                      <div
                        className="rpg-project-bar-fill"
                        style={{ width: `${proj.progress.percent}%`, background: cfg.color }}
                      />
                    </div>
                  </div>
                  <span className="rpg-project-percent" style={{ color: cfg.color }}>
                    {proj.progress.percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <RecentSkills skills={skills} tasks={tasks} />
    </div>
  );
}
