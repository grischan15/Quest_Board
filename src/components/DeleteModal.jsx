import Modal from './Modal';
import './DeleteModal.css';

export default function DeleteModal({ task, itemLabel, onConfirm, onClose }) {
  const label = itemLabel || 'Quest';
  const displayName = task.title || task.name || task.label;

  return (
    <Modal title={`${label} l\u00f6schen?`} onClose={onClose}>
      <div className="delete-modal">
        <p className="delete-msg">
          "<strong>{displayName}</strong>" wird unwiderruflich gel&ouml;scht.
        </p>
        <div className="delete-actions">
          <button className="form-btn form-btn-cancel" onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="form-btn delete-confirm-btn"
            onClick={() => onConfirm(task.id)}
          >
            L&ouml;schen
          </button>
        </div>
      </div>
    </Modal>
  );
}
