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
import { QUEST_TYPES } from '../data/questTypes';
import './Eisenhower.css';

const quadrants = [
  { id: 'q1', label: 'Sofort erledigen', sublabel: 'dringend & wichtig', color: '#c60a0f' },
  { id: 'q2', label: 'Einplanen', sublabel: 'wichtig, nicht dringend', color: '#2d8a4e' },
  { id: 'q3', label: 'Delegieren', sublabel: 'dringend, nicht wichtig', color: '#e6a817' },
  { id: 'q4', label: 'Eliminieren', sublabel: 'weder noch', color: '#8a8a8a' },
];

const allZones = [...quadrants, { id: 'unsorted' }];

export default function Eisenhower({
  getQuadrantTasks,
  onStart,
  onEdit,
  onDelete,
  moveToQuadrant,
  onNewQuest,
}) {
  const [activeId, setActiveId] = useState(null);
  const [filterType, setFilterType] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const allTasks = allZones.flatMap((q) => getQuadrantTasks(q.id));
  const hasAnyType = allTasks.some((t) => t.questType);
  const unsortedTasks = getQuadrantTasks('unsorted');
  const activeTask = allTasks.find((t) => t.id === activeId);

  const filterTask = (task) => !filterType || task.questType === filterType;

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = active.id;
    let targetQuadrant = over.id;
    if (!allZones.find((q) => q.id === targetQuadrant)) {
      const overTask = allTasks.find((t) => t.id === over.id);
      if (overTask) targetQuadrant = overTask.quadrant;
      else return;
    }

    const task = allTasks.find((t) => t.id === taskId);
    if (task && task.quadrant !== targetQuadrant) {
      moveToQuadrant(taskId, targetQuadrant);
    }
  }

  const quadrantTasks = quadrants.flatMap((q) => getQuadrantTasks(q.id));
  const isEmpty = allTasks.length === 0;

  return (
    <div className="eisenhower-wrapper">
      {isEmpty ? (
        <div className="empty-state">
          <p>Starte deine erste Quest!</p>
          <button className="empty-state-btn" onClick={onNewQuest}>
            + Neue Quest
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="eisenhower-layout">
            {hasAnyType && (
              <div className="energy-filter-bar">
                <button
                  className={`energy-filter-btn${filterType === null ? ' energy-filter-active' : ''}`}
                  onClick={() => setFilterType(null)}
                >
                  Alle
                </button>
                {QUEST_TYPES.map((qt) => (
                  <button
                    key={qt.id}
                    className={`energy-filter-btn${filterType === qt.id ? ' energy-filter-active' : ''}`}
                    style={{
                      '--filter-color': qt.color,
                      borderColor: filterType === qt.id ? qt.color : undefined,
                      background: filterType === qt.id ? `${qt.color}10` : undefined,
                    }}
                    onClick={() => setFilterType(filterType === qt.id ? null : qt.id)}
                  >
                    <span className="energy-filter-icon">{qt.icon}</span>
                    {qt.label}
                  </button>
                ))}
              </div>
            )}
            <div className="eisenhower-grid">
              {quadrants.map((q) => {
                const tasks = getQuadrantTasks(q.id).filter(filterTask);
                return (
                  <div
                    key={q.id}
                    className="quadrant"
                    style={{ '--quadrant-color': q.color }}
                  >
                    <div className="quadrant-header">
                      <span
                        className="quadrant-dot"
                        style={{ background: q.color }}
                      />
                      <div>
                        <div className="quadrant-label">{q.label}</div>
                        <div className="quadrant-sublabel">{q.sublabel}</div>
                      </div>
                    </div>
                    <DroppableContainer
                      id={q.id}
                      items={tasks.map((t) => t.id)}
                      className="quadrant-tasks"
                    >
                      {tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          showStart
                          onStart={onStart}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))}
                    </DroppableContainer>
                  </div>
                );
              })}
            </div>

            {/* Unsorted area */}
            {unsortedTasks.length > 0 && (
              <div className="unsorted-area">
                <div className="unsorted-header">
                  <span className="unsorted-label">Unsortiert</span>
                  <span className="unsorted-hint">
                    Ziehe Tasks in einen Quadranten um sie zuzuordnen
                  </span>
                  <span className="kanban-col-count">{unsortedTasks.length}</span>
                </div>
                <DroppableContainer
                  id="unsorted"
                  items={unsortedTasks.filter(filterTask).map((t) => t.id)}
                  className="unsorted-tasks"
                >
                  {unsortedTasks.filter(filterTask).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      showStart
                      onStart={onStart}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </DroppableContainer>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="task-card drag-overlay">
                <div className="task-card-title">{activeTask.title}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
