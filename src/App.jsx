import { useState, useCallback } from 'react';
import Header from './components/Header';
import Eisenhower from './components/Eisenhower';
import Kanban from './components/Kanban';
import SkillTree from './components/SkillTree';
import TaskModal from './components/TaskModal';
import SkillCheckModal from './components/SkillCheckModal';
import SkillModal from './components/SkillModal';
import CategoryModal from './components/CategoryModal';
import ProjectModal from './components/ProjectModal';
import DeleteModal from './components/DeleteModal';
import SettingsModal from './components/SettingsModal';
import PersonalDashboard from './components/PersonalDashboard';
import SchmiedePage from './components/schmiede/SchmiedePage';
import HelpPage from './components/HelpPage';
import DemoBanner from './components/DemoBanner';
import { useQuestBoard } from './hooks/useQuestBoard';
import { getLevel } from './data/questTypes';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [taskModal, setTaskModal] = useState(null);
  const [skillCheckTask, setSkillCheckTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [skillModal, setSkillModal] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [deleteSkillTarget, setDeleteSkillTarget] = useState(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [projectModal, setProjectModal] = useState(null);
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

  const board = useQuestBoard();

  const handleNewQuest = useCallback(() => {
    setTaskModal({ mode: 'create' });
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskModal({ mode: 'edit', task });
  }, []);

  const handleSaveTask = useCallback(
    ({ title, description, quadrant, dueDate, questType, duration, xp, linkedSkills }) => {
      if (taskModal.mode === 'create') {
        board.createTask(title, description, quadrant, dueDate, questType, duration, xp, linkedSkills);
      } else if (taskModal.mode === 'edit') {
        const updates = { title, description, dueDate, questType, duration, xp, linkedSkills };
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

  // --- Skill handlers ---
  const handleAddSkill = useCallback((categoryId) => {
    setSkillModal({ mode: 'create', categoryId });
  }, []);

  const handleEditSkill = useCallback((skill) => {
    setSkillModal({ mode: 'edit', skill });
  }, []);

  const handleSaveSkill = useCallback(
    ({ name, category, status, xpCurrent, level }) => {
      if (skillModal.mode === 'create') {
        const newSkill = board.createSkill(name, category);
        if (xpCurrent > 0) {
          board.updateSkill(newSkill.id, {
            xpCurrent,
            level,
            status: level >= 1 ? 'learned' : 'open',
            learnedAt: level >= 1 ? new Date().toISOString() : null,
          });
        }
      } else if (skillModal.mode === 'edit') {
        const updates = { name, category };
        // Apply XP/Level changes if provided
        if (xpCurrent !== undefined && level !== undefined) {
          updates.xpCurrent = xpCurrent;
          updates.level = level;
          updates.status = level >= 1 ? 'learned' : 'open';
          if (level >= 1 && !skillModal.skill.learnedAt) {
            updates.learnedAt = new Date().toISOString();
          }
        } else if (status !== skillModal.skill.status) {
          board.toggleSkillStatus(skillModal.skill.id);
        }
        board.updateSkill(skillModal.skill.id, updates);
      }
      setSkillModal(null);
    },
    [skillModal, board]
  );

  const handleToggleSkillHidden = useCallback(
    (id) => {
      board.toggleSkillHidden(id);
      setSkillModal(null);
    },
    [board]
  );

  const handleRequestDeleteSkill = useCallback((skill) => {
    setSkillModal(null);
    setDeleteSkillTarget(skill);
  }, []);

  const handleConfirmDeleteSkill = useCallback(
    (id) => {
      board.deleteSkill(id);
      setDeleteSkillTarget(null);
    },
    [board]
  );

  // --- Category handlers ---
  const handleAddCategory = useCallback(() => {
    setCategoryModal({ mode: 'create' });
  }, []);

  const handleEditCategory = useCallback((category) => {
    setCategoryModal({ mode: 'edit', category });
  }, []);

  const handleSaveCategory = useCallback(
    ({ label, icon }) => {
      if (categoryModal.mode === 'create') {
        board.createCategory(label, icon);
      } else if (categoryModal.mode === 'edit') {
        board.updateCategory(categoryModal.category.id, { label, icon });
      }
      setCategoryModal(null);
    },
    [categoryModal, board]
  );

  const handleRequestDeleteCategory = useCallback((category) => {
    setCategoryModal(null);
    setDeleteCategoryTarget(category);
  }, []);

  const handleConfirmDeleteCategory = useCallback(
    (id) => {
      board.deleteCategory(id);
      setDeleteCategoryTarget(null);
    },
    [board]
  );

  // --- Project handlers ---
  const handleAddProject = useCallback(() => {
    setProjectModal({ mode: 'create' });
  }, []);

  const handleEditProject = useCallback((project) => {
    setProjectModal({ mode: 'edit', project });
  }, []);

  const handleSaveProject = useCallback(
    ({ name, description, icon, requirements }) => {
      if (projectModal.mode === 'create') {
        board.createProject(name, description, icon, requirements);
      } else if (projectModal.mode === 'edit') {
        board.updateProject(projectModal.project.id, { name, description, icon, requirements });
      }
      setProjectModal(null);
    },
    [projectModal, board]
  );

  const handleRequestDeleteProject = useCallback((project) => {
    setProjectModal(null);
    setDeleteProjectTarget(project);
  }, []);

  const handleConfirmDeleteProject = useCallback(
    (id) => {
      board.deleteProject(id);
      setDeleteProjectTarget(null);
    },
    [board]
  );

  // --- Wizard save handler (category + skills atomically) ---
  const handleWizardSave = useCallback(
    ({ isNewCategory, categoryId, categoryLabel, categoryIcon, skills: wizardSkills }) => {
      let catId = categoryId;
      if (isNewCategory) {
        // Generate a stable slug ID (same format as createCategory)
        catId = `custom-${categoryLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
      }
      if (!catId) return;

      // importSkills auto-creates missing categories using the categoryLabel
      const skillList = wizardSkills.map((s) => ({
        name: s.name,
        category: catId,
        categoryLabel: isNewCategory ? categoryLabel : undefined,
        status: getLevel(s.xp) >= 1 ? 'learned' : 'open',
        xpCurrent: s.xp,
        level: getLevel(s.xp),
      }));
      board.importSkills(skillList);

      // Fix the icon + showInDashboard on the auto-created category
      // (updateCategory uses functional updaters, so it sees the latest state)
      if (isNewCategory) {
        const dashboardCount = board.categories.filter((c) => c.showInDashboard).length;
        board.updateCategory(catId, {
          icon: categoryIcon || '\uD83D\uDCCC',
          label: categoryLabel,
          showInDashboard: dashboardCount < 6,
        });
      }
    },
    [board]
  );

  // --- AI Setup import handler ---
  const handleAiImportJson = useCallback(
    (data) => {
      // Import categories
      if (data.categories && data.categories.length > 0) {
        const newCats = data.categories.map((c, i) => ({
          id: c.id || `ai-cat-${Date.now()}-${i}`,
          label: c.label,
          icon: c.icon || '\uD83D\uDCCC',
          predefined: false,
          order: (board.categories.length) + i,
          showInDashboard: c.showInDashboard !== false && i < 6,
        }));
        board.updateCategories((prev) => [...prev, ...newCats]);
      }

      // Import skills – resolve category IDs and build index map
      const skillIdMap = new Map();
      if (data.skills && data.skills.length > 0) {
        const importedSkills = board.importSkills(
          data.skills.map((s) => ({
            name: s.name,
            category: s.category,
            categoryLabel: s.categoryLabel,
            status: s.status || 'open',
            level: s.level || 0,
            xpCurrent: s.xpCurrent || 0,
          }))
        );
        // Build map: __idx_N -> real skill ID
        importedSkills.forEach((skill, i) => {
          skillIdMap.set(`__idx_${i}`, skill.id);
        });
      }

      // Import projects – resolve skill references
      if (data.projects && data.projects.length > 0) {
        for (const proj of data.projects) {
          const requirements = (proj.requirements || [])
            .map((r) => ({
              skillId: skillIdMap.get(r.skillId) || r.skillId,
              requiredLevel: r.requiredLevel || 2,
            }))
            .filter((r) => r.skillId && !r.skillId.startsWith('__idx_'));
          board.createProject(proj.name, proj.description, proj.icon, requirements);
        }
      }

      // Import tasks – resolve linked skill references
      if (data.tasks && data.tasks.length > 0) {
        const taskList = data.tasks.map((t) => ({
          title: t.title,
          description: t.description || '',
          quadrant: t.quadrant || 'q2',
          questType: t.questType || null,
          duration: t.duration || null,
          xp: t.xp || null,
          dueDate: t.dueDate || null,
          linkedSkills: (t.linkedSkills || [])
            .map((ref) => skillIdMap.get(ref) || ref)
            .filter((id) => id && !id.startsWith('__idx_')),
        }));
        board.importTasks(taskList);
      }
    },
    [board]
  );

  const categoryHasSkills = (categoryId) => {
    return board.skills.some((s) => s.category === categoryId);
  };

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewQuest={handleNewQuest}
        onSettingsClick={() => setShowSettings(true)}
      />

      {board.migrationError && (
        <div className="migration-banner">
          <span className="migration-banner-text">
            Migration fehlgeschlagen &ndash; deine Daten wurden nicht veraendert.
          </span>
          <button
            className="migration-banner-btn"
            onClick={() => setShowSettings(true)}
          >
            Einstellungen
          </button>
        </div>
      )}

      {board.isDemo && (
        <DemoBanner onClearDemo={board.clearDemoData} />
      )}

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
            q1Tasks={board.getQuadrantTasks('q1')}
            q2Tasks={board.getQuadrantTasks('q2')}
            onStart={handleStartTask}
            onEdit={handleEditTask}
            onDelete={handleRequestDelete}
            onToggleFastLane={board.toggleFastLane}
            onReturnToBacklog={handleReturnToBacklog}
            moveToColumn={board.moveToColumn}
            onDone={handleDoneTask}
            onGoToBacklog={() => setActiveTab('eisenhower')}
            wipLimits={board.settings.wipLimits}
            getWildcardsUsedToday={board.getWildcardsUsedToday}
            maxWildcardsPerDay={board.settings.maxWildcardsPerDay}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTree
            skills={board.skills}
            tasks={board.tasks}
            categories={board.categories}
            projects={board.projects}
            onEditSkill={handleEditSkill}
            onAddSkill={handleAddSkill}
            onEditCategory={handleEditCategory}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onToggleDashboard={board.toggleCategoryDashboard}
          />
        )}

        {activeTab === 'dashboard' && (
          <PersonalDashboard
            tasks={board.tasks}
            skills={board.skills}
            projects={board.projects}
          />
        )}

        {activeTab === 'schmiede' && (
          <SchmiedePage
            categories={board.categories}
            skills={board.skills}
            projects={board.projects}
            tasks={board.tasks}
            isDemo={board.isDemo}
            onWizardSave={handleWizardSave}
            onImportTasks={handleImport}
            onExportData={board.exportData}
            onRestoreData={handleRestore}
            onAiImportJson={handleAiImportJson}
          />
        )}

        {activeTab === 'help' && <HelpPage />}
      </main>

      {taskModal && (
        <TaskModal
          task={taskModal.mode === 'edit' ? taskModal.task : null}
          skills={board.skills}
          categories={board.categories}
          onSave={handleSaveTask}
          onDelete={taskModal.mode === 'edit' ? handleRequestDelete : null}
          onClose={() => setTaskModal(null)}
        />
      )}

      {skillCheckTask && (
        <SkillCheckModal
          task={skillCheckTask}
          skills={board.skills}
          categories={board.categories}
          projects={board.projects}
          onSave={handleSkillCheckSave}
          onClose={() => setSkillCheckTask(null)}
        />
      )}

      {skillModal && (
        <SkillModal
          skill={skillModal.mode === 'edit' ? skillModal.skill : null}
          categoryId={skillModal.categoryId}
          categories={board.categories}
          projects={board.projects}
          onSave={handleSaveSkill}
          onDelete={skillModal.mode === 'edit' && skillModal.skill && !skillModal.skill.predefined ? handleRequestDeleteSkill : null}
          onToggleHidden={skillModal.mode === 'edit' ? handleToggleSkillHidden : null}
          onClose={() => setSkillModal(null)}
        />
      )}

      {categoryModal && (
        <CategoryModal
          category={categoryModal.mode === 'edit' ? categoryModal.category : null}
          onSave={handleSaveCategory}
          onDelete={
            categoryModal.mode === 'edit' &&
            categoryModal.category &&
            !categoryModal.category.predefined &&
            !categoryHasSkills(categoryModal.category.id)
              ? handleRequestDeleteCategory
              : null
          }
          hasSkills={categoryModal.mode === 'edit' && categoryModal.category ? categoryHasSkills(categoryModal.category.id) : false}
          onClose={() => setCategoryModal(null)}
        />
      )}

      {deleteTask && (
        <DeleteModal
          task={deleteTask}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTask(null)}
        />
      )}

      {deleteSkillTarget && (
        <DeleteModal
          task={deleteSkillTarget}
          itemLabel="Skill"
          onConfirm={handleConfirmDeleteSkill}
          onClose={() => setDeleteSkillTarget(null)}
        />
      )}

      {deleteCategoryTarget && (
        <DeleteModal
          task={deleteCategoryTarget}
          itemLabel="Kategorie"
          onConfirm={handleConfirmDeleteCategory}
          onClose={() => setDeleteCategoryTarget(null)}
        />
      )}

      {projectModal && (
        <ProjectModal
          project={projectModal.mode === 'edit' ? projectModal.project : null}
          skills={board.skills}
          categories={board.categories}
          onSave={handleSaveProject}
          onDelete={projectModal.mode === 'edit' ? handleRequestDeleteProject : null}
          onClose={() => setProjectModal(null)}
        />
      )}

      {deleteProjectTarget && (
        <DeleteModal
          task={deleteProjectTarget}
          itemLabel="Projekt"
          onConfirm={handleConfirmDeleteProject}
          onClose={() => setDeleteProjectTarget(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={board.settings}
          isDemo={board.isDemo}
          onClearDemo={() => {
            board.clearDemoData();
            setShowSettings(false);
          }}
          backups={board.getBackups()}
          onRestoreBackup={(key) => {
            board.restoreFromBackup(key);
            setShowSettings(false);
          }}
          onSave={(newSettings) => {
            board.updateSettings(newSettings);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
