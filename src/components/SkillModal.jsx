import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { getLevelLabel, getXpForNextLevel, getLevel, LEVEL_THRESHOLDS } from '../data/questTypes';
import { getProjectsForSkill } from '../data/projectHelpers';
import './SkillModal.css';

export default function SkillModal({ skill, categoryId, categories, projects, onSave, onDelete, onToggleHidden, onClose }) {
  const isEdit = !!skill;
  const [name, setName] = useState(skill?.name || '');
  const [category, setCategory] = useState(skill?.category || categoryId || categories[0]?.id || '');
  const [status, setStatus] = useState(skill?.status || 'open');
  const [xpCurrent, setXpCurrent] = useState(skill?.xpCurrent || 0);
  const inputRef = useRef(null);

  const editLevel = getLevel(xpCurrent);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), category, status, xpCurrent: isEdit ? xpCurrent : undefined, level: isEdit ? editLevel : undefined });
  }

  function handleXpChange(value) {
    const num = Math.max(0, parseInt(value) || 0);
    setXpCurrent(num);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      handleSubmit(e);
    }
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <Modal title={isEdit ? 'Skill bearbeiten' : 'Neuer Skill'} onClose={onClose}>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="task-form">
        {isEdit && skill.predefined && (
          <div className="skill-modal-hint">
            Vordefinierter Skill &ndash; kann ausgeblendet, aber nicht gel&ouml;scht werden.
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="skill-name">Name</label>
          <input
            ref={inputRef}
            id="skill-name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skill-Name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="skill-category">Kategorie</label>
          <select
            id="skill-category"
            className="form-input form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {sortedCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {isEdit ? (
          <div className="form-group">
            <label className="form-label">XP &amp; Level</label>
            <div className="skill-modal-xp-edit">
              <div className="skill-modal-xp-input-row">
                <input
                  type="number"
                  className="form-input skill-modal-xp-input"
                  min={0}
                  value={xpCurrent}
                  onChange={(e) => handleXpChange(e.target.value)}
                />
                <span className="skill-modal-xp-suffix">XP</span>
                <span className="skill-modal-level-badge">
                  Lv.{editLevel} {getLevelLabel(editLevel)}
                </span>
              </div>
              <div className="skill-modal-xp-thresholds">
                Lv.1: 1 XP &middot; Lv.2: 100 &middot; Lv.3: 250 &middot; Lv.4: 500 &middot; Lv.5: 800
              </div>
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="quadrant-radio-group">
              <label className="quadrant-radio">
                <input
                  type="radio"
                  name="skill-status"
                  value="open"
                  checked={status === 'open'}
                  onChange={() => setStatus('open')}
                />
                <span>Offen (Level 0)</span>
              </label>
              <label className="quadrant-radio">
                <input
                  type="radio"
                  name="skill-status"
                  value="learned"
                  checked={status === 'learned'}
                  onChange={() => setStatus('learned')}
                />
                <span>Bereits gelernt (Level 3)</span>
              </label>
            </div>
          </div>
        )}

        {isEdit && skill && projects && (() => {
          const relatedProjects = getProjectsForSkill(skill.id, projects);
          if (relatedProjects.length === 0) return null;
          return (
            <div className="form-group">
              <label className="form-label">Wird ben&ouml;tigt von</label>
              <div className="skill-modal-projects">
                {relatedProjects.map((proj) => {
                  const req = proj.requirements.find((r) => r.skillId === skill.id);
                  const met = (editLevel) >= (req?.requiredLevel || 0);
                  return (
                    <div key={proj.id} className={`skill-modal-project-item ${met ? 'skill-modal-project-met' : 'skill-modal-project-unmet'}`}>
                      <span className="skill-modal-project-icon">{proj.icon}</span>
                      <span className="skill-modal-project-name">{proj.name}</span>
                      <span className="skill-modal-project-req">
                        Lv.{req?.requiredLevel} ben&ouml;tigt
                      </span>
                      <span className="skill-modal-project-status">
                        {met ? '\u2705' : '\u26AA'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className="form-actions">
          <div className="form-actions-left">
            {isEdit && skill.predefined && onToggleHidden && (
              <button
                type="button"
                className="form-btn form-btn-hide"
                onClick={() => onToggleHidden(skill.id)}
              >
                {skill.hidden ? 'Einblenden' : 'Ausblenden'}
              </button>
            )}
            {isEdit && !skill.predefined && onDelete && (
              <button
                type="button"
                className="form-btn form-btn-delete"
                onClick={() => onDelete(skill)}
              >
                L&ouml;schen
              </button>
            )}
          </div>
          <div className="form-actions-right">
            <button type="button" className="form-btn form-btn-cancel" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="form-btn form-btn-save" disabled={!name.trim()}>
              Speichern
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
