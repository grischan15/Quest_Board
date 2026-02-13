import { useMemo } from 'react';
import RadarChart from './RadarChart';
import CharacterCard from './CharacterCard';
import RecentSkills from './RecentSkills';
import { RPG_ATTRIBUTES } from '../data/questTypes';
import './RpgDashboard.css';

export default function RpgDashboard({ skills, tasks, categories }) {
  const { categoryStrengths, totalLevel, totalXP } = useMemo(() => {
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

    return { categoryStrengths: strengths, totalLevel: tLevel, totalXP: tXP };
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

  return (
    <div className="rpg-dashboard">
      <RadarChart categoryStrengths={categoryStrengths} />
      <CharacterCard
        categoryStrengths={categoryStrengths}
        totalLevel={totalLevel}
        totalXP={totalXP}
      />
      <RecentSkills skills={skills} tasks={tasks} />
    </div>
  );
}
