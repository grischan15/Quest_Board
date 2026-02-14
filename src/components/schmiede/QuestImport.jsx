import { useState, useRef } from 'react';
import './QuestImport.css';

export default function QuestImport({ onImport }) {
  const [activeTab, setActiveTab] = useState('text');
  const [bulkText, setBulkText] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState([]);
  const [success, setSuccess] = useState(null);
  const fileRef = useRef(null);

  function parseTextInput(text) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({ title: line }));
  }

  function parseCSV(text) {
    const lines = text.split('\n').filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const task = {};
      headers.forEach((h, i) => {
        if (h === 'titel' || h === 'title') task.title = values[i];
        else if (h === 'beschreibung' || h === 'description') task.description = values[i];
        else if (h === 'quadrant') task.quadrant = values[i];
        else if (h === 'bis' || h === 'duedate' || h === 'due_date' || h === 'due') task.dueDate = values[i];
        else if (h === 'typ' || h === 'questtype' || h === 'quest_type' || h === 'type') task.questType = values[i];
        else if (h === 'dauer' || h === 'duration') task.duration = values[i];
        else if (h === 'xp') task.xp = parseInt(values[i]) || null;
      });
      return task;
    }).filter((t) => t.title);
  }

  function parseJSON(text) {
    try {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : data.tasks || [];
      return arr
        .map((t) => ({
          title: t.title || t.titel,
          description: t.description || t.beschreibung || '',
          quadrant: t.quadrant || null,
          dueDate: t.dueDate || t.due_date || t.bis || null,
          questType: t.questType || t.quest_type || t.typ || null,
          duration: t.duration || t.dauer || null,
          xp: t.xp ? parseInt(t.xp) : null,
        }))
        .filter((t) => t.title);
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
      setFileContent(text);
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
    let tasks = [];
    if (activeTab === 'text') {
      tasks = parseTextInput(bulkText);
    } else {
      tasks = preview;
    }
    if (tasks.length > 0) {
      onImport(tasks);
      setSuccess(tasks.length);
      setBulkText('');
      setPreview([]);
      setFileContent(null);
      setFileName('');
      setTimeout(() => setSuccess(null), 3000);
    }
  }

  const currentPreview = activeTab === 'text' ? parseTextInput(bulkText) : preview;

  return (
    <div className="quest-import">
      <p className="quest-import-intro">
        Importiere mehrere Quests auf einmal. Ideal wenn du eine Liste von Aufgaben hast,
        die du gesammelt ins Backlog laden willst.
      </p>

      <div className="quest-import-tabs">
        <button
          className={`quest-import-tab ${activeTab === 'text' ? 'quest-import-tab-active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Schnell-Eingabe
        </button>
        <button
          className={`quest-import-tab ${activeTab === 'file' ? 'quest-import-tab-active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          Datei (CSV/JSON)
        </button>
      </div>

      {activeTab === 'text' && (
        <div className="quest-import-section">
          <p className="quest-import-hint">
            Schreibe einfach eine Quest pro Zeile. Alle Quests landen im Backlog unter "Unsortiert".
          </p>
          <textarea
            className="quest-import-textarea"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"PRD schreiben\nDesign Review\nAPI Endpunkte definieren\nUnit Tests"}
            rows={6}
          />
        </div>
      )}

      {activeTab === 'file' && (
        <div className="quest-import-section">
          <p className="quest-import-hint">
            Lade eine CSV- oder JSON-Datei mit mehreren Quests. Nur <strong>title</strong> ist Pflicht &ndash;
            alle anderen Felder sind optional.
          </p>
          <div className="quest-import-columns">
            <div className="quest-import-columns-title">Erkannte Spalten:</div>
            <div className="quest-import-columns-grid">
              <span className="quest-import-col-name">title / titel</span>
              <span className="quest-import-col-desc">Quest-Titel (Pflicht)</span>
              <span className="quest-import-col-name">description</span>
              <span className="quest-import-col-desc">Beschreibung</span>
              <span className="quest-import-col-name">quadrant</span>
              <span className="quest-import-col-desc">q1 / q2 / q3 / q4</span>
              <span className="quest-import-col-name">dueDate / bis</span>
              <span className="quest-import-col-desc">Faelligkeit (YYYY-MM-DD)</span>
              <span className="quest-import-col-name">questType / typ</span>
              <span className="quest-import-col-desc">focus / input / create / routine / reflect</span>
              <span className="quest-import-col-name">duration / dauer</span>
              <span className="quest-import-col-desc">sprint / short / long</span>
              <span className="quest-import-col-name">xp</span>
              <span className="quest-import-col-desc">30 / 50 / 80</span>
            </div>
          </div>
          <div className="quest-import-file-area">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
              onClick={() => fileRef.current?.click()}
            >
              Datei waehlen
            </button>
            {fileName && <span className="quest-import-file-name">{fileName}</span>}
          </div>
        </div>
      )}

      {currentPreview.length > 0 && (
        <div className="quest-import-preview">
          <div className="quest-import-preview-label">
            Vorschau: {currentPreview.length} Quests
          </div>
          <div className="quest-import-preview-list">
            {currentPreview.slice(0, 8).map((t, i) => (
              <div key={i} className="quest-import-preview-item">
                <span className="quest-import-preview-title">{t.title}</span>
                {t.quadrant && <span className="quest-import-preview-tag">{t.quadrant}</span>}
                {t.questType && <span className="quest-import-preview-tag">{t.questType}</span>}
                {t.xp && <span className="quest-import-preview-tag">{t.xp} XP</span>}
              </div>
            ))}
            {currentPreview.length > 8 && (
              <div className="quest-import-preview-more">
                ...und {currentPreview.length - 8} weitere
              </div>
            )}
          </div>
        </div>
      )}

      {success && (
        <div className="schmiede-success">
          {'\u2705'} {success} Quests erfolgreich importiert!
        </div>
      )}

      {currentPreview.length > 0 && !success && (
        <button
          className="schmiede-btn schmiede-btn-primary"
          onClick={handleImport}
        >
          {currentPreview.length} Quests importieren
        </button>
      )}
    </div>
  );
}
