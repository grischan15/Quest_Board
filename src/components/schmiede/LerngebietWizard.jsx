import { useState } from 'react';
import { getLevel, getLevelLabel } from '../../data/questTypes';
import './LerngebietWizard.css';

const EMOJI_SUGGESTIONS = [
  '\uD83C\uDFA8', '\uD83D\uDD27', '\uD83D\uDCD0', '\uD83D\uDDC4\uFE0F', '\uD83E\uDD16', '\uD83D\uDCF1',
  '\uD83C\uDF10', '\uD83D\uDCCA', '\uD83C\uDFAF', '\uD83D\uDD12',
  '\uD83D\uDCDD', '\uD83D\uDCA1', '\uD83C\uDFAE', '\uD83E\uDDEA', '\u2699\uFE0F',
  '\uD83D\uDCE6', '\uD83D\uDD0C', '\uD83E\uDDE0', '\uD83C\uDFD7\uFE0F', '\uD83D\uDEE0\uFE0F',
];

export default function LerngebietWizard({ categories, onSave }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('new'); // 'new' or 'existing'
  const [catLabel, setCatLabel] = useState('');
  const [catIcon, setCatIcon] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [skills, setSkills] = useState([{ name: '', xp: 0 }]);
  const [success, setSuccess] = useState(null);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  function selectEmoji(emoji) {
    setCatIcon(emoji);
    setCustomEmoji('');
  }

  function handleCustomEmojiChange(e) {
    const val = e.target.value;
    setCustomEmoji(val);
    if (val.trim()) {
      const chars = [...val.trim()];
      setCatIcon(chars[chars.length - 1]);
    }
  }

  function addSkillRow() {
    setSkills((prev) => [...prev, { name: '', xp: 0 }]);
  }

  function removeSkillRow(index) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSkill(index, field, value) {
    setSkills((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  function canProceedStep1() {
    if (mode === 'new') return catLabel.trim().length > 0;
    return selectedCategoryId !== '';
  }

  function canProceedStep2() {
    return skills.some((s) => s.name.trim().length > 0);
  }

  function getSelectedCategory() {
    if (mode === 'existing') {
      return categories.find((c) => c.id === selectedCategoryId);
    }
    return { label: catLabel.trim(), icon: catIcon || '\uD83D\uDCCC' };
  }

  function getValidSkills() {
    return skills.filter((s) => s.name.trim().length > 0);
  }

  function handleSave() {
    const validSkills = getValidSkills();
    if (validSkills.length === 0) return;

    const skillList = validSkills.map((s) => ({
      name: s.name.trim(),
      xp: Math.max(0, parseInt(s.xp) || 0),
    }));

    const saveData = {
      isNewCategory: mode === 'new',
      categoryId: mode === 'existing' ? selectedCategoryId : null,
      categoryLabel: mode === 'new' ? catLabel.trim() : null,
      categoryIcon: mode === 'new' ? (catIcon || '\uD83D\uDCCC') : null,
      skills: skillList,
    };

    onSave(saveData);

    const cat = getSelectedCategory();
    setSuccess({
      categoryName: cat.label || cat.icon,
      skillCount: skillList.length,
    });

    // Reset form
    setStep(1);
    setMode('new');
    setCatLabel('');
    setCatIcon('');
    setCustomEmoji('');
    setSelectedCategoryId('');
    setSkills([{ name: '', xp: 0 }]);
  }

  if (success) {
    return (
      <div className="wizard-success">
        <div className="schmiede-success">
          {'\u2705'} {success.skillCount} Skills in "{success.categoryName}" erstellt!
        </div>
        <button
          className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
          onClick={() => setSuccess(null)}
        >
          Weitere Skills anlegen
        </button>
      </div>
    );
  }

  return (
    <div className="wizard">
      {/* Step indicator */}
      <div className="wizard-steps">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`wizard-step-dot ${step === s ? 'wizard-step-active' : ''} ${step > s ? 'wizard-step-done' : ''}`}>
            {step > s ? '\u2713' : s}
          </div>
        ))}
      </div>

      {/* Step 1: Category */}
      {step === 1 && (
        <div className="wizard-step-content">
          <h4 className="wizard-step-title">Schritt 1: Kategorie</h4>

          <div className="wizard-mode-toggle">
            <button
              className={`wizard-mode-btn ${mode === 'new' ? 'wizard-mode-active' : ''}`}
              onClick={() => setMode('new')}
            >
              Neue Kategorie
            </button>
            <button
              className={`wizard-mode-btn ${mode === 'existing' ? 'wizard-mode-active' : ''}`}
              onClick={() => setMode('existing')}
            >
              Vorhandene
            </button>
          </div>

          {mode === 'new' ? (
            <div className="wizard-new-cat">
              <div className="wizard-field">
                <label className="wizard-label">Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={catLabel}
                  onChange={(e) => setCatLabel(e.target.value)}
                  placeholder="z.B. Machine Learning, Design, ..."
                  autoFocus
                />
              </div>
              <div className="wizard-field">
                <label className="wizard-label">Icon</label>
                <div className="wizard-emoji-grid">
                  {EMOJI_SUGGESTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-btn ${catIcon === emoji ? 'emoji-btn-active' : ''}`}
                      onClick={() => selectEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="wizard-emoji-custom">
                  <input
                    className="form-input"
                    type="text"
                    value={customEmoji}
                    onChange={handleCustomEmojiChange}
                    placeholder="Oder eigenes Emoji..."
                  />
                  {catIcon && <span className="wizard-emoji-preview">{catIcon}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="wizard-field">
              <label className="wizard-label">Kategorie waehlen</label>
              <select
                className="form-input form-select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">-- Waehlen --</option>
                {sortedCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="wizard-nav">
            <div />
            <button
              className="schmiede-btn schmiede-btn-primary schmiede-btn-sm"
              disabled={!canProceedStep1()}
              onClick={() => setStep(2)}
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <div className="wizard-step-content">
          <h4 className="wizard-step-title">Schritt 2: Skills definieren</h4>
          <p className="wizard-hint">Definiere die Skills fuer "{getSelectedCategory()?.label}". XP optional.</p>

          <div className="wizard-skill-list">
            {skills.map((s, i) => {
              const level = getLevel(Math.max(0, parseInt(s.xp) || 0));
              return (
                <div key={i} className="wizard-skill-row">
                  <input
                    className="form-input wizard-skill-name"
                    type="text"
                    value={s.name}
                    onChange={(e) => updateSkill(i, 'name', e.target.value)}
                    placeholder={`Skill ${i + 1}`}
                    autoFocus={i === skills.length - 1}
                  />
                  <div className="wizard-skill-xp-group">
                    <input
                      className="form-input wizard-skill-xp"
                      type="number"
                      min={0}
                      value={s.xp}
                      onChange={(e) => updateSkill(i, 'xp', e.target.value)}
                      placeholder="0"
                    />
                    <span className="wizard-skill-xp-label">XP</span>
                    <span className={`wizard-skill-level skill-level-${level}`}>
                      Lv.{level}
                    </span>
                  </div>
                  {skills.length > 1 && (
                    <button
                      type="button"
                      className="wizard-skill-remove"
                      onClick={() => removeSkillRow(i)}
                      title="Entfernen"
                    >
                      {'\u2715'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
            onClick={addSkillRow}
          >
            + Skill hinzufuegen
          </button>

          <div className="wizard-nav">
            <button
              className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
              onClick={() => setStep(1)}
            >
              Zurueck
            </button>
            <button
              className="schmiede-btn schmiede-btn-primary schmiede-btn-sm"
              disabled={!canProceedStep2()}
              onClick={() => setStep(3)}
            >
              Vorschau
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview + Save */}
      {step === 3 && (
        <div className="wizard-step-content">
          <h4 className="wizard-step-title">Schritt 3: Vorschau</h4>

          <div className="wizard-preview">
            <div className="wizard-preview-cat">
              <span className="wizard-preview-cat-icon">{getSelectedCategory()?.icon}</span>
              <span className="wizard-preview-cat-label">
                {getSelectedCategory()?.label}
                {mode === 'new' && <span className="wizard-preview-new-badge">Neu</span>}
              </span>
            </div>
            <div className="wizard-preview-skills">
              {getValidSkills().map((s, i) => {
                const xp = Math.max(0, parseInt(s.xp) || 0);
                const level = getLevel(xp);
                return (
                  <div key={i} className="wizard-preview-skill">
                    <span className="wizard-preview-skill-name">{s.name}</span>
                    <span className={`wizard-preview-skill-level skill-level-${level}`}>
                      Lv.{level} {getLevelLabel(level)}
                    </span>
                    {xp > 0 && <span className="wizard-preview-skill-xp">{xp} XP</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="wizard-nav">
            <button
              className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
              onClick={() => setStep(2)}
            >
              Zurueck
            </button>
            <button
              className="schmiede-btn schmiede-btn-primary schmiede-btn-sm"
              onClick={handleSave}
            >
              {'\uD83D\uDE80'} {getValidSkills().length} Skills erstellen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
