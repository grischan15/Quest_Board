import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import './CategoryModal.css';

const EMOJI_SUGGESTIONS = [
  '\uD83C\uDFA8', '\uD83D\uDD27', '\uD83D\uDCD0', '\uD83D\uDDC4\uFE0F', '\uD83E\uDD16', '\uD83D\uDCF1',
  '\uD83C\uDF10', '\uD83D\uDCCA', '\uD83C\uDFAF', '\uD83D\uDD12',
  '\uD83D\uDCDD', '\uD83D\uDCA1', '\uD83C\uDFAE', '\uD83E\uDDEA', '\u2699\uFE0F',
  '\uD83D\uDCE6', '\uD83D\uDD0C', '\uD83E\uDDE0', '\uD83C\uDFD7\uFE0F', '\uD83D\uDEE0\uFE0F',
];

export default function CategoryModal({ category, onSave, onDelete, hasSkills, onClose }) {
  const isEdit = !!category;
  const [label, setLabel] = useState(category?.label || '');
  const [icon, setIcon] = useState(category?.icon || '');
  const [customEmoji, setCustomEmoji] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!label.trim()) return;
    onSave({ label: label.trim(), icon: icon || '\uD83D\uDCCC' });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      handleSubmit(e);
    }
  }

  function selectEmoji(emoji) {
    setIcon(emoji);
    setCustomEmoji('');
  }

  function handleCustomEmojiChange(e) {
    const val = e.target.value;
    setCustomEmoji(val);
    // Use last character(s) that form an emoji
    if (val.trim()) {
      // Take the last grapheme cluster (emoji)
      const chars = [...val.trim()];
      setIcon(chars[chars.length - 1]);
    }
  }

  return (
    <Modal title={isEdit ? 'Kategorie bearbeiten' : 'Neue Kategorie'} onClose={onClose}>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="task-form">
        {isEdit && category.predefined && (
          <div className="skill-modal-hint">
            Vordefinierte Kategorie &ndash; kann bearbeitet, aber nicht gel&ouml;scht werden.
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="cat-label">Name</label>
          <input
            ref={inputRef}
            id="cat-label"
            className="form-input"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Kategorie-Name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Icon</label>
          <div className="emoji-grid">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-btn ${icon === emoji ? 'emoji-btn-active' : ''}`}
                onClick={() => selectEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="emoji-custom">
            <input
              className="form-input emoji-custom-input"
              type="text"
              value={customEmoji}
              onChange={handleCustomEmojiChange}
              placeholder="Oder eigenes Emoji eingeben..."
            />
            {icon && (
              <span className="emoji-preview">{icon}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <div className="form-actions-left">
            {isEdit && !category.predefined && onDelete && (
              <button
                type="button"
                className="form-btn form-btn-delete"
                onClick={() => onDelete(category)}
              >
                L&ouml;schen
              </button>
            )}
            {isEdit && !category.predefined && hasSkills && !onDelete && (
              <span className="category-delete-hint">
                Kategorie enth&auml;lt Skills und kann nicht gel&ouml;scht werden.
              </span>
            )}
          </div>
          <div className="form-actions-right">
            <button type="button" className="form-btn form-btn-cancel" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="form-btn form-btn-save" disabled={!label.trim()}>
              Speichern
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
