import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import './TaskModal.css';

const quadrantOptions = [
  { id: 'q1', label: 'Q1: Sofort erledigen' },
  { id: 'q2', label: 'Q2: Einplanen' },
  { id: 'q3', label: 'Q3: Delegieren' },
  { id: 'q4', label: 'Q4: Eliminieren' },
  { id: 'unsorted', label: 'Unsortiert (sp\u00e4ter zuordnen)' },
];

export default function TaskModal({ task, onSave, onDelete, onClose }) {
  const isEdit = !!task;
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [quadrant, setQuadrant] = useState(task?.quadrant || 'q1');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      quadrant,
      dueDate: dueDate || null,
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      handleSubmit(e);
    }
  }

  return (
    <Modal title={isEdit ? 'Quest bearbeiten' : 'Neue Quest'} onClose={onClose}>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="task-form">
        <div className="form-group">
          <label className="form-label" htmlFor="task-title">Titel</label>
          <input
            ref={inputRef}
            id="task-title"
            className="form-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Was muss erledigt werden?"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-desc">
            Beschreibung <span className="form-optional">(optional)</span>
          </label>
          <textarea
            id="task-desc"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-due">
            Zu erledigen bis <span className="form-optional">(optional)</span>
          </label>
          <input
            id="task-due"
            className="form-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {(!isEdit || task?.location === 'eisenhower') && (
          <div className="form-group">
            <label className="form-label">Quadrant</label>
            <div className="quadrant-radio-group">
              {quadrantOptions.map((q) => (
                <label key={q.id} className="quadrant-radio">
                  <input
                    type="radio"
                    name="quadrant"
                    value={q.id}
                    checked={quadrant === q.id}
                    onChange={(e) => setQuadrant(e.target.value)}
                  />
                  <span>{q.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          {isEdit && onDelete && (
            <button
              type="button"
              className="form-btn form-btn-delete"
              onClick={() => onDelete(task)}
            >
              L&ouml;schen
            </button>
          )}
          <div className="form-actions-right">
            <button type="button" className="form-btn form-btn-cancel" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="form-btn form-btn-save" disabled={!title.trim()}>
              Speichern
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
