import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import DroppableContainer from './DroppableContainer';
import TaskCard from './TaskCard';
import { KANBAN_COLUMNS } from '../hooks/useQuestBoard';
import './Kanban.css';

const workColumns = KANBAN_COLUMNS.filter((c) => c.id !== 'done');

function SharedDoneColumn({ doneGroups, onEdit, onDelete }) {
  const allDone = [...doneGroups.lastWeek, ...doneGroups.lastMonth, ...doneGroups.older];

  return (
    <div className="kanban-done-shared">
      <div className="kanban-column-header">
        <span className="kanban-col-icon">{'\uD83C\uDF89'}</span>
        <span className="kanban-col-label">Done</span>
        <span className="kanban-col-count">{allDone.length}</span>
      </div>
      <DroppableContainer
        id="shared-done"
        items={allDone.map((t) => t.id)}
        className="kanban-column-tasks done-grouped"
      >
        {allDone.length === 0 && (
          <div className="done-empty">Noch keine erledigten Quests</div>
        )}
        {doneGroups.lastWeek.length > 0 && (
          <>
            <div className="done-group-label">Letzte Woche</div>
            {doneGroups.lastWeek.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </>
        )}
        {doneGroups.lastMonth.length > 0 && (
          <>
            <div className="done-group-label">Letzter Monat</div>
            {doneGroups.lastMonth.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </>
        )}
        {doneGroups.older.length > 0 && (
          <>
            <div className="done-group-label">&Auml;lter</div>
            {doneGroups.older.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </>
        )}
      </DroppableContainer>
    </div>
  );
}

function KanbanRow({
  prefix,
  isFastLane,
  getColumnTasks,
  wipLimits,
  onEdit,
  onDelete,
  onToggleFastLane,
  onReturnToBacklog,
}) {
  return (
    <div className="kanban-row-columns">
      {workColumns.map((col) => {
        const tasks = getColumnTasks(col.id, isFastLane);
        const limit = wipLimits?.[col.id];
        const isFull = limit != null && tasks.length >= limit;
        return (
          <div key={col.id} className={`kanban-column${isFull ? ' kanban-column-full' : ''}`}>
            <div className="kanban-column-header">
              <span className="kanban-col-icon">{col.icon}</span>
              <div className="kanban-col-labels">
                <span className="kanban-col-label">{col.label}</span>
                {col.subtitle && <span className="kanban-col-subtitle">{col.subtitle}</span>}
              </div>
              <span className={`kanban-col-count${isFull ? ' wip-full' : ''}`}>
                {limit != null ? `${tasks.length}/${limit}` : tasks.length}
              </span>
            </div>
            <DroppableContainer
              id={`${prefix}-${col.id}`}
              items={tasks.map((t) => t.id)}
              className="kanban-column-tasks"
            >
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showFastLane={!isFastLane}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFastLane={onToggleFastLane}
                  onReturnToBacklog={!task.fastLane ? () => onReturnToBacklog(task.id) : undefined}
                />
              ))}
            </DroppableContainer>
          </div>
        );
      })}
    </div>
  );
}

function MiniBacklog({ q1Tasks, q2Tasks, onStart, onEdit }) {
  const totalQ1 = q1Tasks.length;
  const totalQ2 = q2Tasks.length;
  const total = totalQ1 + totalQ2;
  const q2Percent = total > 0 ? Math.round((totalQ2 / total) * 100) : 0;

  return (
    <div className="kanban-mini-backlog">
      <div className="mini-backlog-header">
        <span className="mini-backlog-title">Backlog</span>
        <span className="mini-backlog-count">{total}</span>
      </div>

      {total === 0 && (
        <div className="mini-backlog-empty">Backlog leer</div>
      )}

      {totalQ1 > 0 && (
        <div className="mini-backlog-section">
          <div className="mini-backlog-section-header mini-backlog-q1">
            <span>Q1 &ndash; Dringend</span>
            <span className="mini-backlog-percent">~80%</span>
          </div>
          <div className="mini-backlog-list">
            {q1Tasks.slice(0, 6).map((task) => (
              <div key={task.id} className="mini-backlog-item">
                <div
                  className="mini-backlog-item-title"
                  onClick={() => onEdit?.(task)}
                >
                  {task.title}
                </div>
                <button
                  className="mini-backlog-start-btn"
                  onClick={() => onStart?.(task.id)}
                >
                  &#9654;
                </button>
              </div>
            ))}
            {totalQ1 > 6 && (
              <div className="mini-backlog-more">+{totalQ1 - 6} weitere</div>
            )}
          </div>
        </div>
      )}

      {totalQ2 > 0 && (
        <div className="mini-backlog-section">
          <div className="mini-backlog-section-header mini-backlog-q2">
            <span>Q2 &ndash; S&auml;ge sch&auml;rfen</span>
            <span className="mini-backlog-percent">~20%</span>
          </div>
          <div className="mini-backlog-list">
            {q2Tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="mini-backlog-item mini-backlog-item-q2">
                <div
                  className="mini-backlog-item-title"
                  onClick={() => onEdit?.(task)}
                >
                  {task.title}
                </div>
                <button
                  className="mini-backlog-start-btn"
                  onClick={() => onStart?.(task.id)}
                >
                  &#9654;
                </button>
              </div>
            ))}
            {totalQ2 > 4 && (
              <div className="mini-backlog-more">+{totalQ2 - 4} weitere</div>
            )}
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="mini-backlog-ratio">
          <div className="mini-backlog-ratio-bar">
            <div
              className="mini-backlog-ratio-q1"
              style={{ width: `${100 - q2Percent}%` }}
            />
            <div
              className="mini-backlog-ratio-q2"
              style={{ width: `${q2Percent}%` }}
            />
          </div>
          <div className="mini-backlog-ratio-label">
            Q1: {totalQ1} &middot; Q2: {totalQ2}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Kanban({
  getColumnTasks,
  getDoneTasksGrouped,
  kanbanTasks,
  q1Tasks,
  q2Tasks,
  onStart,
  onEdit,
  onDelete,
  onToggleFastLane,
  onReturnToBacklog,
  moveToColumn,
  onDone,
  onGoToBacklog,
  wipLimits,
  getWildcardsUsedToday,
  maxWildcardsPerDay,
}) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeTask = kanbanTasks.find((t) => t.id === activeId);
  const doneGroups = getDoneTasksGrouped();

  function findTaskDropTarget(overId) {
    // Shared done
    if (overId === 'shared-done') {
      return { column: 'done', isFastLane: undefined };
    }
    // Prefixed droppable: normal-prepare, fast-develop, etc.
    if (overId.startsWith('normal-') || overId.startsWith('fast-')) {
      const dashIdx = overId.indexOf('-');
      const row = overId.substring(0, dashIdx);
      const column = overId.substring(dashIdx + 1);
      return { column, isFastLane: row === 'fast' };
    }
    // It's a task ID
    const overTask = kanbanTasks.find((t) => t.id === overId);
    if (!overTask) return null;
    if (overTask.kanbanColumn === 'done') {
      return { column: 'done', isFastLane: undefined };
    }
    return { column: overTask.kanbanColumn, isFastLane: overTask.fastLane };
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = active.id;
    const task = kanbanTasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.kanbanColumn === 'done') return;

    const target = findTaskDropTarget(over.id);
    if (!target) return;

    const columnChanged = task.kanbanColumn !== target.column;
    const laneChanged = target.isFastLane !== undefined && task.fastLane !== target.isFastLane;
    // Fast lane is one-way
    const effectiveFastLane = target.isFastLane !== undefined
      ? (task.fastLane ? true : target.isFastLane)
      : undefined;

    if (!columnChanged && !laneChanged) return;

    // WIP-limit check: block moves to full columns (except done)
    if (target.column !== 'done' && wipLimits) {
      const targetLane = effectiveFastLane !== undefined ? effectiveFastLane : task.fastLane;
      const currentCount = getColumnTasks(target.column, targetLane).length;
      const limit = wipLimits[target.column];
      // Don't count the task itself if it's already in this column (lane change)
      const isAlreadyInColumn = task.kanbanColumn === target.column;
      if (limit != null && (currentCount - (isAlreadyInColumn ? 1 : 0)) >= limit) return;
    }

    // Wildcard-limit check: block new Fast Lane moves if daily limit reached
    if (effectiveFastLane === true && !task.fastLane && getWildcardsUsedToday && maxWildcardsPerDay) {
      if (getWildcardsUsedToday() >= maxWildcardsPerDay) return;
    }

    if (target.column === 'done') {
      onDone(taskId, effectiveFastLane);
    } else {
      moveToColumn(taskId, target.column, effectiveFastLane);
    }
  }

  const isEmpty = kanbanTasks.length === 0;

  return (
    <div className="kanban-wrapper">
      {isEmpty ? (
        <div className="empty-state">
          <p>Keine aktiven Quests.</p>
          <button className="empty-state-btn" onClick={onGoToBacklog}>
            &rarr; Zum Backlog
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-layout">
            {/* Mini-Backlog: Q1 + Q2 */}
            {(q1Tasks.length > 0 || q2Tasks.length > 0) && (
              <MiniBacklog
                q1Tasks={q1Tasks}
                q2Tasks={q2Tasks}
                onStart={onStart}
                onEdit={onEdit}
              />
            )}

            <div className="kanban-work-area">
              {/* Normal Flow */}
              <div className="kanban-row kanban-row-normal">
                <div className="kanban-row-label">Normaler Flow</div>
                <KanbanRow
                  prefix="normal"
                  isFastLane={false}
                  getColumnTasks={getColumnTasks}
                  wipLimits={wipLimits}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFastLane={onToggleFastLane}
                  onReturnToBacklog={onReturnToBacklog}
                />
              </div>

              {/* Fast Lane */}
              <div className="kanban-row kanban-row-fast">
                <div className="kanban-row-label fast-lane-label">
                  &#9889; Fast Lane
                </div>
                <KanbanRow
                  prefix="fast"
                  isFastLane={true}
                  getColumnTasks={getColumnTasks}
                  wipLimits={wipLimits}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFastLane={onToggleFastLane}
                  onReturnToBacklog={onReturnToBacklog}
                />
              </div>
            </div>

            {/* Shared Done column */}
            <SharedDoneColumn
              doneGroups={doneGroups}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="task-card drag-overlay">
                <div className="task-card-title">
                  {activeTask.fastLane && <span className="fastlane-icon">&#9889;</span>}
                  {activeTask.title}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
