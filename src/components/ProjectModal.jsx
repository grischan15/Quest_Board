import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { getLevelLabel } from '../data/questTypes';
import './ProjectModal.css';

const EMOJI_SUGGESTIONS = [
  '\uD83C\uDFAF', '\uD83D\uDE80', '\uD83D\uDCA1', '\uD83C\uDFD7\uFE0F', '\uD83D\uDD25',
  '\uD83E\uDDE0', '\uD83C\uDFAE', '\uD83D\uDCF1', '\uD83C\uDF10', '\uD83D\uDEE0\uFE0F',
  '\uD83E\uDD16', '\uD83D\uDCCA', '\u2699\uFE0F', '\uD83D\uDD12', '\uD83C\uDFA8',
];

export default function ProjectModal({ project, skills, categories, onSave, onDelete, onClose }) {
  const isEdit = !!project;
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [icon, setIcon] = useState(project?.icon || '\uD83C\uDFAF');
  const [customEmoji, setCustomEmoji] = useState('');
  const [requirements, setRequirements] = useState(
    project?.requirements?.map((r) => ({ ...r })) || []
  );
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  const visibleSkills = skills.filter((s) => !s.hidden);
  const usedSkillIds = new Set(requirements.map((r) => r.skillId));

  const skillsByCategory = sortedCategories
    .map((cat) => ({
      ...cat,
      skills: visibleSkills.filter((s) => s.category === cat.id),
    }))
    .filter((cat) => cat.skills.length > 0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      icon: icon || '\uD83C\uDFAF',
      requirements: requirements.filter((r) => r.skillId),
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
      handleSubmit(e);
    }
  }

  function selectEmoji(emoji) {
    setIcon(emoji);
    setCustomEmoji('');
  }

  function handleCustomEmojiChange(e) {
    const val = e.target.value;
    setCustomEmoji(val);
    if (val.trim()) {
      const chars = [...val.trim()];
      setIcon(chars[chars.length - 1]);
    }
  }

  function addRequirement() {
    // Find first available skill
    const available = visibleSkills.find((s) => !usedSkillIds.has(s.id));
    if (!available) return;
    setRequirements((prev) => [...prev, { skillId: available.id, requiredLevel: 2 }]);
  }

  function removeRequirement(index) {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRequirement(index, field, value) {
    setRequirements((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  const allSkillsUsed = usedSkillIds.size >= visibleSkills.length;

  return (
    <Modal title={isEdit ? 'Projekt bearbeiten' : 'Neues Projekt'} onClose={onClose}>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="task-form">
        <div className="form-group">
          <label className="form-label" htmlFor="proj-name">Name</label>
          <input
            ref={inputRef}
            id="proj-name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Projekt-Name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="proj-desc">Beschreibung (optional)</label>
          <textarea
            id="proj-desc"
            className="form-input form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was ist das Ziel dieses Projekts?"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Icon</label>
          <div className="emoji-grid">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-btn ${icon === emoji ? 'emoji-btn-active' : ''}`}
                onClick={() => selectEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="emoji-custom">
            <input
              className="form-input emoji-custom-input"
              type="text"
              value={customEmoji}
              onChange={handleCustomEmojiChange}
              placeholder="Oder eigenes Emoji..."
            />
            {icon && <span className="emoji-preview">{icon}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Skill-Anforderungen</label>
          <div className="proj-requirements">
            {requirements.map((req, index) => {
              const skill = skills.find((s) => s.id === req.skillId);
              const currentLevel = skill?.level || 0;
              const met = currentLevel >= req.requiredLevel;
              return (
                <div key={index} className="proj-req-row">
                  <select
                    className="form-input form-select proj-req-skill"
                    value={req.skillId}
                    onChange={(e) => updateRequirement(index, 'skillId', e.target.value)}
                  >
                    {skillsByCategory.map((cat) => (
                      <optgroup key={cat.id} label={`${cat.icon} ${cat.label}`}>
                        {cat.skills
                          .filter((s) => s.id === req.skillId || !usedSkillIds.has(s.id))
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (Lv.{s.level || 0})
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="proj-req-levels">
                    {[1, 2, 3, 4, 5].map((lv) => (
                      <button
                        key={lv}
                        type="button"
                        className={`proj-req-level-btn ${req.requiredLevel === lv ? 'proj-req-level-active' : ''}`}
                        onClick={() => updateRequirement(index, 'requiredLevel', lv)}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                  <span className={`proj-req-status ${met ? 'proj-req-met' : 'proj-req-unmet'}`}>
                    {met ? '\u2705' : `Lv.${currentLevel}/${req.requiredLevel}`}
                  </span>
                  <button
                    type="button"
                    className="proj-req-remove"
                    onClick={() => removeRequirement(index)}
                    title="Entfernen"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
            {!allSkillsUsed && (
              <button
                type="button"
                className="proj-req-add"
                onClick={addRequirement}
              >
                + Anforderung
              </button>
            )}
            {requirements.length === 0 && (
              <div className="proj-req-empty">
                Noch keine Anforderungen. Fuege Skills hinzu, die fuer dieses Projekt noetig sind.
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <div className="form-actions-left">
            {isEdit && onDelete && (
              <button
                type="button"
                className="form-btn form-btn-delete"
                onClick={() => onDelete(project)}
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
