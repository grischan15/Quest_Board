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
  onEdit,
  onDelete,
  onToggleFastLane,
  onReturnToBacklog,
}) {
  return (
    <div className="kanban-row-columns">
      {workColumns.map((col) => {
        const tasks = getColumnTasks(col.id, isFastLane);
        return (
          <div key={col.id} className="kanban-column">
            <div className="kanban-column-header">
              <span className="kanban-col-icon">{col.icon}</span>
              <span className="kanban-col-label">{col.label}</span>
              <span className="kanban-col-count">{tasks.length}</span>
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

export default function Kanban({
  getColumnTasks,
  getDoneTasksGrouped,
  kanbanTasks,
  onEdit,
  onDelete,
  onToggleFastLane,
  onReturnToBacklog,
  moveToColumn,
  onDone,
  onGoToBacklog,
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
            <div className="kanban-work-area">
              {/* Normal Flow */}
              <div className="kanban-row kanban-row-normal">
                <div className="kanban-row-label">Normaler Flow</div>
                <KanbanRow
                  prefix="normal"
                  isFastLane={false}
                  getColumnTasks={getColumnTasks}
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
