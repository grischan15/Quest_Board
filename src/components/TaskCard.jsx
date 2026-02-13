import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { getQuestType, getDuration } from '../data/questTypes';
import './TaskCard.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function isDueSoon(dateStr) {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // < 3 days
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

export default function TaskCard({
  task,
  onStart,
  onEdit,
  onDelete,
  onToggleFastLane,
  onReturnToBacklog,
  showStart = false,
  showFastLane = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isDone = task.kanbanColumn === 'done';
  const wasFastLane = task.fastLane;
  const qt = getQuestType(task.questType);
  const dur = getDuration(task.duration);

  const cardStyle = {
    ...style,
    ...(qt ? { borderTop: `3px solid ${qt.color}` } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`task-card ${task.fastLane && !isDone ? 'task-card-fastlane' : ''} ${
        isDone ? 'task-card-done' : ''
      } ${isDone && wasFastLane ? 'task-card-was-fastlane' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header">
        <div className="task-card-title">
          {task.fastLane && <span className="fastlane-icon">&#9889;</span>}
          {task.title}
        </div>
        <div className="task-card-menu-wrapper">
          <button
            className="task-card-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            &#8943;
          </button>
          {menuOpen && (
            <div className="task-card-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit?.(task);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                Bearbeiten
              </button>
              {showFastLane && !task.fastLane && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onToggleFastLane?.(task.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  Fast Lane an
                </button>
              )}
              {onReturnToBacklog && !isDone && !task.fastLane && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onReturnToBacklog?.(task.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  Zum Backlog
                </button>
              )}
              <button
                className="dropdown-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete?.(task);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                L&ouml;schen
              </button>
            </div>
          )}
        </div>
      </div>
      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}
      <div className="task-card-meta">
        <span className="task-card-created">
          {formatDate(task.createdAt)}
        </span>
        {task.dueDate && (
          <span
            className={`task-card-due ${isOverdue(task.dueDate) ? 'due-overdue' : ''} ${
              isDueSoon(task.dueDate) ? 'due-soon' : ''
            }`}
          >
            Bis: {formatDate(task.dueDate)}
          </span>
        )}
        {qt && (
          <span className={`task-card-quest-type quest-type-${qt.id}`}>
            {qt.icon} {qt.label}
          </span>
        )}
        {dur && (
          <span className="task-card-duration">
            {dur.subtitle}
          </span>
        )}
        {task.xp && (
          <span className="task-card-xp">
            {task.xp} XP
          </span>
        )}
      </div>
      <div className="task-card-footer">
        {showStart && (
          <button
            className="task-start-btn"
            onClick={(e) => {
              e.stopPropagation();
              onStart?.(task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Starten &rarr;
          </button>
        )}
        {isDone && task.skillsLearned.length > 0 && (
          <span className="task-skills-badge">
            &#10003; {task.skillsLearned.length} Skills
          </span>
        )}
      </div>
    </div>
  );
}
