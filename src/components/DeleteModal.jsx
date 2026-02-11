import Modal from './Modal';
import './DeleteModal.css';

export default function DeleteModal({ task, onConfirm, onClose }) {
  return (
    <Modal title="Quest l&ouml;schen?" onClose={onClose}>
      <div className="delete-modal">
        <p className="delete-msg">
          "<strong>{task.title}</strong>" wird unwiderruflich gel&ouml;scht.
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
