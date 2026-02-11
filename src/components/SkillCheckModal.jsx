import { useState } from 'react';
import Modal from './Modal';
import { categoryOrder, categoryIcons } from '../data/skillsData';
import './SkillCheckModal.css';

export default function SkillCheckModal({ task, skills, onSave, onClose }) {
  const [selected, setSelected] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const categories = categoryOrder
    .map((cat) => ({
      id: cat,
      label: skills.find((s) => s.category === cat)?.categoryLabel || cat,
      icon: categoryIcons[cat],
      skills: skills.filter((s) => s.category === cat),
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

  return (
    <Modal title="Quest abgeschlossen!" onClose={onClose}>
      <div className="skill-check">
        {showConfetti && <div className="confetti-overlay">&#127881;</div>}
        <p className="skill-check-task">"{task.title}"</p>
        <p className="skill-check-prompt">Was hast du dabei gelernt?</p>

        <div className="skill-check-categories">
          {categories.map((cat) => (
            <div key={cat.id} className="skill-check-category">
              <div className="skill-check-cat-label">
                {cat.icon} {cat.label}
              </div>
              {cat.skills.map((skill) => {
                const alreadyLearned =
                  skill.status === 'learned' && !selected.includes(skill.id);
                return (
                  <label
                    key={skill.id}
                    className={`skill-check-item ${
                      alreadyLearned ? 'skill-already-learned' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(skill.id)}
                      onChange={() => toggleSkill(skill.id)}
                    />
                    <span>{skill.name}</span>
                    {skill.status === 'learned' &&
                      !selected.includes(skill.id) && (
                        <span className="skill-already-badge">bereits gelernt</span>
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
