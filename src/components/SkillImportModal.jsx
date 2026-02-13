import { useState, useRef } from 'react';
import Modal from './Modal';
import './SkillImportModal.css';

export default function SkillImportModal({ categories, onImport, onClose }) {
  const [activeTab, setActiveTab] = useState('text');
  const [bulkText, setBulkText] = useState('');
  const [preview, setPreview] = useState([]);
  const [fileName, setFileName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const fileRef = useRef(null);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  const defaultCategory = selectedCategory || sortedCategories[0]?.id || 'frontend';

  function parseTextInput(text) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({ name: line, category: defaultCategory }));
  }

  function parseCSV(text) {
    const lines = text.split('\n').filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const skill = {};
      headers.forEach((h, i) => {
        if (h === 'name' || h === 'skill') skill.name = values[i];
        else if (h === 'kategorie' || h === 'category') skill.category = values[i];
        else if (h === 'status') skill.status = values[i];
        else if (h === 'xp' || h === 'xpcurrent') skill.xpCurrent = parseInt(values[i]) || 0;
        else if (h === 'level') skill.level = parseInt(values[i]) || 0;
      });
      if (!skill.category) skill.category = defaultCategory;
      return skill;
    }).filter((s) => s.name);
  }

  function parseJSON(text) {
    try {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : data.skills || [];
      return arr
        .map((s) => ({
          name: s.name || s.skill,
          category: s.category || s.kategorie || defaultCategory,
          categoryLabel: s.categoryLabel,
          status: s.status || 'open',
          xpCurrent: s.xpCurrent || s.xp || 0,
          level: s.level || 0,
        }))
        .filter((s) => s.name);
    } catch {
      return [];
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      let parsed = [];
      if (file.name.endsWith('.json')) {
        parsed = parseJSON(text);
      } else {
        parsed = parseCSV(text);
      }
      setPreview(parsed);
    };
    reader.readAsText(file);
  }

  function handleImport() {
    let skills = [];
    if (activeTab === 'text') {
      skills = parseTextInput(bulkText);
    } else {
      skills = preview;
    }
    if (skills.length > 0) {
      onImport(skills);
      onClose();
    }
  }

  const currentPreview = activeTab === 'text' ? parseTextInput(bulkText) : preview;

  return (
    <Modal title="Skills importieren" onClose={onClose}>
      <div className="import-modal">
        <div className="import-tabs">
          <button
            className={`import-tab ${activeTab === 'text' ? 'import-tab-active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            Schnell-Eingabe
          </button>
          <button
            className={`import-tab ${activeTab === 'file' ? 'import-tab-active' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            Datei (CSV/JSON)
          </button>
        </div>

        {activeTab === 'text' && (
          <div className="import-section">
            <p className="import-hint">
              Ein Skill-Name pro Zeile. W&auml;hle die Kategorie f&uuml;r alle Skills:
            </p>
            <select
              className="form-input skill-import-category-select"
              value={defaultCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {sortedCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
            <textarea
              className="import-textarea"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"React Hooks\nTypeScript Basics\nCSS Grid Layout\nGit Branching"}
              rows={6}
            />
          </div>
        )}

        {activeTab === 'file' && (
          <div className="import-section">
            <p className="import-hint">
              CSV oder JSON Datei mit Skill-Daten. Nur <strong>name</strong> ist Pflicht.
            </p>
            <div className="import-columns-info">
              <div className="import-columns-title">Erkannte Spalten:</div>
              <div className="import-columns-grid">
                <span className="import-col-name">name / skill</span>
                <span className="import-col-desc">Skill-Name (Pflicht)</span>
                <span className="import-col-name">category</span>
                <span className="import-col-desc">Kategorie-ID (z.B. frontend, backend)</span>
                <span className="import-col-name">status</span>
                <span className="import-col-desc">open / learned</span>
                <span className="import-col-name">level</span>
                <span className="import-col-desc">0-5 (Locked bis Master)</span>
                <span className="import-col-name">xp / xpCurrent</span>
                <span className="import-col-desc">Aktuelle XP (z.B. 250)</span>
              </div>
              <div className="skill-import-categories-hint">
                Vorhandene Kategorien: {sortedCategories.map((c) => `${c.icon} ${c.label} (${c.id})`).join(', ')}
              </div>
              <div className="skill-import-categories-hint skill-import-auto-hint">
                Neue Kategorie-IDs werden automatisch als eigene Kategorie angelegt.
              </div>
            </div>
            <div className="import-file-area">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="import-file-input"
              />
              <button
                className="import-file-btn"
                onClick={() => fileRef.current?.click()}
              >
                Datei w&auml;hlen
              </button>
              {fileName && <span className="import-file-name">{fileName}</span>}
            </div>
          </div>
        )}

        {currentPreview.length > 0 && (
          <div className="import-preview">
            <div className="import-preview-label">
              Vorschau: {currentPreview.length} Skills
            </div>
            <div className="import-preview-list">
              {currentPreview.slice(0, 10).map((s, i) => (
                <div key={i} className="import-preview-item">
                  <span className="import-preview-title">{s.name}</span>
                  {s.category && <span className="import-preview-tag">{s.category}</span>}
                  {s.xpCurrent > 0 && <span className="import-preview-tag">{s.xpCurrent} XP</span>}
                </div>
              ))}
              {currentPreview.length > 10 && (
                <div className="import-preview-more">
                  ...und {currentPreview.length - 10} weitere
                </div>
              )}
            </div>
          </div>
        )}

        <div className="import-actions">
          <button className="form-btn form-btn-cancel" onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="form-btn form-btn-save"
            disabled={currentPreview.length === 0}
            onClick={handleImport}
          >
            {currentPreview.length} Skills importieren
          </button>
        </div>
      </div>
    </Modal>
  );
}
