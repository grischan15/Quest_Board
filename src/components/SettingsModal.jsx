import { useState } from 'react';
import Modal from './Modal';
import { KANBAN_COLUMNS, DEFAULT_SETTINGS } from '../hooks/useQuestBoard';
import './SettingsModal.css';

const workColumns = KANBAN_COLUMNS.filter((c) => c.id !== 'done');

export default function SettingsModal({ settings, isDemo, onClearDemo, onSave, onClose }) {
  const [wipLimits, setWipLimits] = useState({ ...settings.wipLimits });
  const [maxWildcardsPerDay, setMaxWildcardsPerDay] = useState(settings.maxWildcardsPerDay);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ wipLimits, maxWildcardsPerDay });
  }

  function handleWipChange(columnId, value) {
    const num = Math.max(1, Math.min(10, parseInt(value) || 1));
    setWipLimits((prev) => ({ ...prev, [columnId]: num }));
  }

  function handleWildcardChange(value) {
    setMaxWildcardsPerDay(Math.max(1, Math.min(5, parseInt(value) || 1)));
  }

  function handleReset() {
    setWipLimits({ ...DEFAULT_SETTINGS.wipLimits });
    setMaxWildcardsPerDay(DEFAULT_SETTINGS.maxWildcardsPerDay);
  }

  return (
    <Modal title="Einstellungen" onClose={onClose}>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="settings-section">
          <div className="settings-section-title">WIP-Limits (Kanban-Spalten)</div>
          <div className="settings-section-hint">
            Maximale Anzahl Quests pro Spalte im normalen Flow.
          </div>
          {workColumns.map((col) => (
            <div key={col.id} className="settings-row">
              <span className="settings-label">
                {col.icon} {col.label}
              </span>
              <input
                type="number"
                className="form-input settings-input"
                min={1}
                max={10}
                value={wipLimits[col.id]}
                onChange={(e) => handleWipChange(col.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Wildcards (Fast Lane)</div>
          <div className="settings-section-hint">
            Wie viele Quests d&uuml;rfen pro Tag in die Fast Lane?
          </div>
          <div className="settings-row">
            <span className="settings-label">Max Wildcards pro Tag</span>
            <input
              type="number"
              className="form-input settings-input"
              min={1}
              max={5}
              value={maxWildcardsPerDay}
              onChange={(e) => handleWildcardChange(e.target.value)}
            />
          </div>
        </div>

        {isDemo && (
          <div className="settings-section settings-section-demo">
            <div className="settings-section-title">Demo-Daten</div>
            <div className="settings-section-hint">
              Loescht alle Demo-Quests, Skills, Kategorien und Projekte &ndash; du startest komplett frisch.
            </div>
            <button
              type="button"
              className="settings-demo-delete"
              onClick={onClearDemo}
            >
              Demo-Daten loeschen
            </button>
          </div>
        )}

        <div className="form-actions">
          <div className="form-actions-left">
            <button type="button" className="settings-reset" onClick={handleReset}>
              Standardwerte
            </button>
          </div>
          <div className="form-actions-right">
            <button type="button" className="form-btn form-btn-cancel" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="form-btn form-btn-save">
              Speichern
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
