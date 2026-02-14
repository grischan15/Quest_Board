import { useState, useRef } from 'react';
import './BackupRestore.css';

export default function BackupRestore({ tasks, skills, categories, projects, onExport, onRestore }) {
  const [restoreData, setRestoreData] = useState(null);
  const [restoreFileName, setRestoreFileName] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const restoreFileRef = useRef(null);

  const taskCount = tasks.length;
  const learnedSkills = skills.filter((s) => s.status === 'learned').length;
  const totalSkills = skills.length;
  const eisenhowerCount = tasks.filter((t) => t.location === 'eisenhower').length;
  const kanbanCount = tasks.filter((t) => t.location === 'kanban' && t.kanbanColumn !== 'done').length;
  const doneCount = tasks.filter((t) => t.kanbanColumn === 'done').length;

  function handleExport() {
    onExport();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  }

  function handleRestoreFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreFileName(file.name);
    setRestoreError('');
    setRestoreSuccess(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.tasks || !data.skills) {
          setRestoreError('Ungueltige Backup-Datei: Tasks oder Skills fehlen.');
          setRestoreData(null);
          return;
        }
        setRestoreData(data);
      } catch {
        setRestoreError('Datei konnte nicht gelesen werden. Ist es eine gueltige JSON-Datei?');
        setRestoreData(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleRestore() {
    if (restoreData && onRestore) {
      onRestore(restoreData);
      setRestoreSuccess(true);
      setRestoreData(null);
      setRestoreFileName('');
      setTimeout(() => setRestoreSuccess(false), 3000);
    }
  }

  return (
    <div className="backup-restore">
      {/* Export Section */}
      <div className="backup-section">
        <h4 className="backup-section-title">Daten exportieren</h4>
        <p className="backup-section-desc">
          Deine Daten werden nur in diesem Browser gespeichert.
          Exportiere regelmaessig als Backup.
        </p>

        <div className="backup-stats">
          <div className="backup-stat">
            <span className="backup-stat-value">{taskCount}</span>
            <span className="backup-stat-label">Tasks</span>
          </div>
          <div className="backup-stat">
            <span className="backup-stat-value">{eisenhowerCount}</span>
            <span className="backup-stat-label">Backlog</span>
          </div>
          <div className="backup-stat">
            <span className="backup-stat-value">{kanbanCount}</span>
            <span className="backup-stat-label">Kanban</span>
          </div>
          <div className="backup-stat">
            <span className="backup-stat-value">{doneCount}</span>
            <span className="backup-stat-label">Erledigt</span>
          </div>
          <div className="backup-stat">
            <span className="backup-stat-value">{learnedSkills}/{totalSkills}</span>
            <span className="backup-stat-label">Skills</span>
          </div>
        </div>

        <button className="schmiede-btn schmiede-btn-primary" onClick={handleExport}>
          JSON herunterladen
        </button>

        {exportSuccess && (
          <div className="schmiede-success">
            {'\u2705'} Export heruntergeladen!
          </div>
        )}
      </div>

      {/* Restore Section */}
      <div className="backup-section">
        <h4 className="backup-section-title">Daten wiederherstellen</h4>
        <p className="backup-section-desc">
          Lade eine zuvor exportierte Backup-Datei, um alle Daten wiederherzustellen.
        </p>

        <div className="backup-restore-warning">
          Tasks werden durch die Backup-Daten ersetzt.
          Skills und Kategorien werden zusammengefuehrt.
        </div>

        <div className="backup-file-area">
          <input
            ref={restoreFileRef}
            type="file"
            accept=".json"
            onChange={handleRestoreFileChange}
            style={{ display: 'none' }}
          />
          <button
            className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
            onClick={() => restoreFileRef.current?.click()}
          >
            Backup-Datei waehlen
          </button>
          {restoreFileName && <span className="backup-file-name">{restoreFileName}</span>}
        </div>

        {restoreError && (
          <div className="schmiede-error">
            {'\u26A0\uFE0F'} {restoreError}
          </div>
        )}

        {restoreData && (
          <div className="backup-restore-preview">
            <div className="backup-restore-preview-title">Backup-Inhalt:</div>
            <div className="backup-restore-preview-stats">
              <span><strong>{restoreData.tasks.length}</strong> Tasks</span>
              <span><strong>{restoreData.skills.filter((s) => s.status === 'learned').length}</strong>/{restoreData.skills.length} Skills gelernt</span>
              {restoreData.categories && (
                <span><strong>{restoreData.categories.length}</strong> Kategorien</span>
              )}
              {restoreData.exportedAt && (
                <span>Export: <strong>{new Date(restoreData.exportedAt).toLocaleDateString('de-DE')}</strong></span>
              )}
            </div>
            <button
              className="schmiede-btn schmiede-btn-primary schmiede-btn-sm backup-restore-btn"
              onClick={handleRestore}
            >
              Daten wiederherstellen
            </button>
          </div>
        )}

        {restoreSuccess && (
          <div className="schmiede-success">
            {'\u2705'} Daten erfolgreich wiederhergestellt!
          </div>
        )}
      </div>
    </div>
  );
}
