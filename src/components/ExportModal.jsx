import Modal from './Modal';
import './ExportModal.css';

export default function ExportModal({ tasks, skills, onExport, onClose }) {
  const taskCount = tasks.length;
  const learnedSkills = skills.filter((s) => s.status === 'learned').length;
  const totalSkills = skills.length;

  const eisenhowerCount = tasks.filter((t) => t.location === 'eisenhower').length;
  const kanbanCount = tasks.filter((t) => t.location === 'kanban' && t.kanbanColumn !== 'done').length;
  const doneCount = tasks.filter((t) => t.kanbanColumn === 'done').length;

  return (
    <Modal title="Daten exportieren" onClose={onClose}>
      <div className="export-modal">
        <div className="export-description">
          <p>
            Deine Quest Board Daten werden nur in <strong>diesem Browser</strong> gespeichert.
            Mit dem Export sicherst du alle Daten als JSON-Datei, die du jederzeit
            wiederherstellen kannst.
          </p>
          <p className="export-use-cases">
            Nutze den Export um:
          </p>
          <ul>
            <li>Ein <strong>Backup</strong> deiner Daten zu erstellen</li>
            <li>Daten auf einen <strong>anderen Browser oder PC</strong> zu übertragen</li>
            <li>Vor dem <strong>Löschen der Browser-Daten</strong> zu sichern</li>
          </ul>
        </div>

        <div className="export-summary">
          <div className="export-summary-label">Was wird exportiert:</div>
          <div className="export-stats">
            <div className="export-stat">
              <span className="export-stat-value">{taskCount}</span>
              <span className="export-stat-label">Tasks gesamt</span>
            </div>
            <div className="export-stat">
              <span className="export-stat-value">{eisenhowerCount}</span>
              <span className="export-stat-label">im Backlog</span>
            </div>
            <div className="export-stat">
              <span className="export-stat-value">{kanbanCount}</span>
              <span className="export-stat-label">im Kanban</span>
            </div>
            <div className="export-stat">
              <span className="export-stat-value">{doneCount}</span>
              <span className="export-stat-label">erledigt</span>
            </div>
            <div className="export-stat">
              <span className="export-stat-value">{learnedSkills}/{totalSkills}</span>
              <span className="export-stat-label">Skills gelernt</span>
            </div>
          </div>
        </div>

        <div className="export-includes">
          <div className="export-includes-label">Enthalten im Export:</div>
          <ul className="export-includes-list">
            <li>Alle Tasks mit Titel, Beschreibung, Status und Zuordnung</li>
            <li>Fälligkeitsdaten und Erstellungsdaten</li>
            <li>Komplette Verlaufs-Historie jedes Tasks</li>
            <li>Fast-Lane Markierungen</li>
            <li>Skill-Fortschritt (gelernt/offen)</li>
            <li>Schema-Version für Kompatibilität</li>
          </ul>
        </div>

        <div className="export-hint">
          Zum Wiederherstellen nutze <strong>Import &rarr; Wiederherstellen</strong>.
        </div>

        <div className="export-actions">
          <button className="form-btn form-btn-cancel" onClick={onClose}>
            Abbrechen
          </button>
          <button className="form-btn form-btn-save" onClick={() => { onExport(); onClose(); }}>
            JSON herunterladen
          </button>
        </div>
      </div>
    </Modal>
  );
}
