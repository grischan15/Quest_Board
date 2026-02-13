import { useState } from 'react';
import Modal from './Modal';
import { getLevel, getLevelLabel, getXpForNextLevel } from '../data/questTypes';
import './SkillCheckModal.css';

export default function SkillCheckModal({ task, skills, categories, onSave, onClose }) {
  const [selected, setSelected] = useState(task.linkedSkills || []);
  const [showConfetti, setShowConfetti] = useState(false);

  const taskXp = task.xp || 0;
  const visibleSkills = skills.filter((s) => !s.hidden);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const categoryData = sortedCategories
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      icon: cat.icon,
      skills: visibleSkills.filter((s) => s.category === cat.id),
    }))
    .filter((cat) => cat.skills.length > 0);

  function toggleSkill(skillId) {
    setSelected((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  }

  function handleSave() {
    setShowConfetti(true);
    setTimeout(() => {
      onSave(selected);
    }, 600);
  }

  function getSkillPreview(skill) {
    const currentXp = skill.xpCurrent || 0;
    const newXp = Math.max(currentXp + taskXp, 1);
    const newLevel = getLevel(newXp);
    const levelUp = newLevel > (skill.level || 0);
    return { currentXp, newXp, newLevel, levelUp };
  }

  return (
    <Modal title="Quest abgeschlossen!" onClose={onClose}>
      <div className="skill-check">
        {showConfetti && <div className="confetti-overlay">&#127881;</div>}
        <p className="skill-check-task">"{task.title}"</p>
        {taskXp > 0 ? (
          <p className="skill-check-xp-info">Quest gibt <strong>{taskXp} XP</strong> pro Skill</p>
        ) : (
          <p className="skill-check-xp-info">Keine XP gesetzt &ndash; Skills erhalten 1 XP</p>
        )}
        <p className="skill-check-prompt">Welche Skills hast du trainiert?</p>

        <div className="skill-check-categories">
          {categoryData.map((cat) => (
            <div key={cat.id} className="skill-check-category">
              <div className="skill-check-cat-label">
                {cat.icon} {cat.label}
              </div>
              {cat.skills.map((skill) => {
                const isSelected = selected.includes(skill.id);
                const preview = isSelected ? getSkillPreview(skill) : null;
                return (
                  <label
                    key={skill.id}
                    className="skill-check-item"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSkill(skill.id)}
                    />
                    <div className="skill-check-item-info">
                      <span className="skill-check-item-name">{skill.name}</span>
                      <span className="skill-check-item-level">
                        Lv.{skill.level || 0} {getLevelLabel(skill.level || 0)}
                        {' \u00B7 '}{skill.xpCurrent || 0} XP
                      </span>
                    </div>
                    {isSelected && preview && (
                      <span className={`skill-check-preview ${preview.levelUp ? 'skill-check-levelup' : ''}`}>
                        {preview.levelUp
                          ? `\u2B50 Lv.${preview.newLevel}!`
                          : `+${taskXp || 1} XP`
                        }
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          ))}
        </div>

        <div className="skill-check-actions">
          <button className="form-btn form-btn-cancel" onClick={() => onSave([])}>
            &Uuml;berspringen
          </button>
          <button className="form-btn form-btn-save" onClick={handleSave}>
            Speichern &#127881;
          </button>
        </div>
      </div>
    </Modal>
  );
}
