import { useState, useCallback } from 'react';
import Header from './components/Header';
import Eisenhower from './components/Eisenhower';
import Kanban from './components/Kanban';
import SkillTree from './components/SkillTree';
import TaskModal from './components/TaskModal';
import SkillCheckModal from './components/SkillCheckModal';
import DeleteModal from './components/DeleteModal';
import ImportModal from './components/ImportModal';
import ExportModal from './components/ExportModal';
import { useQuestBoard } from './hooks/useQuestBoard';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('eisenhower');
  const [taskModal, setTaskModal] = useState(null);
  const [skillCheckTask, setSkillCheckTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const board = useQuestBoard();

  const handleNewQuest = useCallback(() => {
    setTaskModal({ mode: 'create' });
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskModal({ mode: 'edit', task });
  }, []);

  const handleSaveTask = useCallback(
    ({ title, description, quadrant, dueDate }) => {
      if (taskModal.mode === 'create') {
        board.createTask(title, description, quadrant, dueDate);
      } else if (taskModal.mode === 'edit') {
        const updates = { title, description, dueDate };
        if (taskModal.task.location === 'eisenhower') {
          updates.quadrant = quadrant;
        }
        board.updateTask(taskModal.task.id, updates);
      }
      setTaskModal(null);
    },
    [taskModal, board]
  );

  const handleRequestDelete = useCallback((task) => {
    setTaskModal(null);
    setDeleteTask(task);
  }, []);

  const handleConfirmDelete = useCallback(
    (id) => {
      board.deleteTask(id);
      setDeleteTask(null);
    },
    [board]
  );

  const handleStartTask = useCallback(
    (id) => {
      board.startTask(id);
      setActiveTab('kanban');
    },
    [board]
  );

  const handleDoneTask = useCallback(
    (id, isFastLane) => {
      board.moveToColumn(id, 'done', isFastLane);
      const task = board.tasks.find((t) => t.id === id);
      if (task) setSkillCheckTask({ ...task, kanbanColumn: 'done' });
    },
    [board]
  );

  const handleSkillCheckSave = useCallback(
    (skillIds) => {
      if (skillCheckTask) {
        board.assignSkills(skillCheckTask.id, skillIds);
      }
      setSkillCheckTask(null);
    },
    [skillCheckTask, board]
  );

  const handleReturnToBacklog = useCallback(
    (id) => {
      board.returnToBacklog(id, 'q1');
    },
    [board]
  );

  const handleImport = useCallback(
    (taskList) => {
      board.importTasks(taskList);
    },
    [board]
  );

  const handleRestore = useCallback(
    (data) => {
      board.restoreData(data);
    },
    [board]
  );

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewQuest={handleNewQuest}
        onImport={() => setShowImport(true)}
        onExport={() => setShowExport(true)}
      />

      <main className="app-main">
        {activeTab === 'eisenhower' && (
          <Eisenhower
            getQuadrantTasks={board.getQuadrantTasks}
            onStart={handleStartTask}
            onEdit={handleEditTask}
            onDelete={handleRequestDelete}
            moveToQuadrant={board.moveToQuadrant}
            onNewQuest={handleNewQuest}
          />
        )}

        {activeTab === 'kanban' && (
          <Kanban
            getColumnTasks={board.getColumnTasks}
            getDoneTasksGrouped={board.getDoneTasksGrouped}
            kanbanTasks={board.kanbanTasks}
            onEdit={handleEditTask}
            onDelete={handleRequestDelete}
            onToggleFastLane={board.toggleFastLane}
            onReturnToBacklog={handleReturnToBacklog}
            moveToColumn={board.moveToColumn}
            onDone={handleDoneTask}
            onGoToBacklog={() => setActiveTab('eisenhower')}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTree skills={board.skills} tasks={board.tasks} />
        )}
      </main>

      {taskModal && (
        <TaskModal
          task={taskModal.mode === 'edit' ? taskModal.task : null}
          onSave={handleSaveTask}
          onDelete={taskModal.mode === 'edit' ? handleRequestDelete : null}
          onClose={() => setTaskModal(null)}
        />
      )}

      {skillCheckTask && (
        <SkillCheckModal
          task={skillCheckTask}
          skills={board.skills}
          onSave={handleSkillCheckSave}
          onClose={() => setSkillCheckTask(null)}
        />
      )}

      {deleteTask && (
        <DeleteModal
          task={deleteTask}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTask(null)}
        />
      )}

      {showImport && (
        <ImportModal
          onImport={handleImport}
          onRestore={handleRestore}
          onClose={() => setShowImport(false)}
        />
      )}

      {showExport && (
        <ExportModal
          tasks={board.tasks}
          skills={board.skills}
          onExport={board.exportData}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
