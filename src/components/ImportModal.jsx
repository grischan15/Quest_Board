import { useState, useRef } from 'react';
import Modal from './Modal';
import './ImportModal.css';

export default function ImportModal({ onImport, onRestore, onClose }) {
  const [activeTab, setActiveTab] = useState('text');
  const [bulkText, setBulkText] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState([]);
  const [restoreData, setRestoreData] = useState(null);
  const [restoreFileName, setRestoreFileName] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const fileRef = useRef(null);
  const restoreFileRef = useRef(null);

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

  function handleRestoreFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreFileName(file.name);
    setRestoreError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.tasks || !data.skills) {
          setRestoreError('Ungültige Backup-Datei: Tasks oder Skills fehlen.');
          setRestoreData(null);
          return;
        }
        setRestoreData(data);
      } catch {
        setRestoreError('Datei konnte nicht gelesen werden. Ist es eine gültige JSON-Datei?');
        setRestoreData(null);
      }
    };
    reader.readAsText(file);
  }

  function handleRestore() {
    if (restoreData && onRestore) {
      onRestore(restoreData);
      onClose();
    }
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
      onClose();
    }
  }

  const currentPreview = activeTab === 'text' ? parseTextInput(bulkText) : preview;

  return (
    <Modal title="Tasks importieren" onClose={onClose}>
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
          <button
            className={`import-tab ${activeTab === 'restore' ? 'import-tab-active' : ''}`}
            onClick={() => setActiveTab('restore')}
          >
            Wiederherstellen
          </button>
        </div>

        {activeTab === 'text' && (
          <div className="import-section">
            <p className="import-hint">
              Eine Zeile pro Task. Ohne Quadrant landen sie in "Unsortiert".
            </p>
            <textarea
              className="import-textarea"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"PRD schreiben\nDesign Review\nAPI Endpunkte definieren\nUnit Tests"}
              rows={8}
            />
          </div>
        )}

        {activeTab === 'file' && (
          <div className="import-section">
            <p className="import-hint">
              CSV oder JSON Datei mit Quest-Daten. Nur <strong>title</strong> ist Pflicht.
            </p>
            <div className="import-columns-info">
              <div className="import-columns-title">Erkannte Spalten:</div>
              <div className="import-columns-grid">
                <span className="import-col-name">title / titel</span>
                <span className="import-col-desc">Quest-Titel (Pflicht)</span>
                <span className="import-col-name">description</span>
                <span className="import-col-desc">Beschreibung</span>
                <span className="import-col-name">quadrant</span>
                <span className="import-col-desc">q1 / q2 / q3 / q4</span>
                <span className="import-col-name">dueDate / bis</span>
                <span className="import-col-desc">F&auml;lligkeit (YYYY-MM-DD)</span>
                <span className="import-col-name">questType / typ</span>
                <span className="import-col-desc">focus / input / create / routine / reflect</span>
                <span className="import-col-name">duration / dauer</span>
                <span className="import-col-desc">sprint (~15 Min) / short (~30 Min) / long (~45 Min)</span>
                <span className="import-col-name">xp</span>
                <span className="import-col-desc">30 / 50 / 80</span>
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

        {activeTab === 'restore' && (
          <div className="import-section">
            <p className="import-hint">
              Lade eine zuvor exportierte Backup-Datei (.json), um alle Tasks und
              Skills wiederherzustellen.
            </p>
            <div className="restore-warning">
              Achtung: Tasks werden durch die Backup-Daten ersetzt.
              Skills und Kategorien werden zusammengef&uuml;hrt &ndash; neue vordefinierte
              Skills bleiben erhalten.
            </div>
            <div className="import-file-area">
              <input
                ref={restoreFileRef}
                type="file"
                accept=".json"
                onChange={handleRestoreFileChange}
                className="import-file-input"
              />
              <button
                className="import-file-btn"
                onClick={() => restoreFileRef.current?.click()}
              >
                Backup-Datei w&auml;hlen
              </button>
              {restoreFileName && <span className="import-file-name">{restoreFileName}</span>}
            </div>
            {restoreError && (
              <div className="restore-error">{restoreError}</div>
            )}
            {restoreData && (
              <div className="import-preview">
                <div className="import-preview-label">
                  Backup-Inhalt:
                </div>
                <div className="restore-stats">
                  <div className="restore-stat">
                    <strong>{restoreData.tasks.length}</strong> Tasks
                  </div>
                  <div className="restore-stat">
                    <strong>{restoreData.skills.filter((s) => s.status === 'learned').length}</strong> / {restoreData.skills.length} Skills gelernt
                  </div>
                  {restoreData.categories && (
                    <div className="restore-stat">
                      <strong>{restoreData.categories.length}</strong> Kategorien
                    </div>
                  )}
                  {restoreData.exportedAt && (
                    <div className="restore-stat">
                      Exportiert am: <strong>{new Date(restoreData.exportedAt).toLocaleDateString('de-DE')}</strong>
                    </div>
                  )}
                  {restoreData.version && (
                    <div className="restore-stat">
                      Schema-Version: <strong>v{restoreData.version}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'restore' && currentPreview.length > 0 && (
          <div className="import-preview">
            <div className="import-preview-label">
              Vorschau: {currentPreview.length} Tasks
            </div>
            <div className="import-preview-list">
              {currentPreview.slice(0, 10).map((t, i) => (
                <div key={i} className="import-preview-item">
                  <span className="import-preview-title">{t.title}</span>
                  {t.quadrant && <span className="import-preview-tag">{t.quadrant}</span>}
                  {t.questType && <span className="import-preview-tag">{t.questType}</span>}
                  {t.xp && <span className="import-preview-tag">{t.xp} XP</span>}
                  {t.dueDate && <span className="import-preview-tag">Bis: {t.dueDate}</span>}
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
          {activeTab === 'restore' ? (
            <button
              className="form-btn form-btn-save restore-btn"
              disabled={!restoreData}
              onClick={handleRestore}
            >
              Daten wiederherstellen
            </button>
          ) : (
            <button
              className="form-btn form-btn-save"
              disabled={currentPreview.length === 0}
              onClick={handleImport}
            >
              {currentPreview.length} Tasks importieren
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
