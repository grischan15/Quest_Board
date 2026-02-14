import { useState } from 'react';
import LerngebietWizard from './LerngebietWizard';
import AiLernpfad from './AiLernpfad';
import QuestImport from './QuestImport';
import BackupRestore from './BackupRestore';
import './SchmiedePage.css';

function AccordionSection({ id, icon, title, subtitle, isOpen, onToggle, children }) {
  return (
    <div className={`schmiede-accordion ${isOpen ? 'schmiede-accordion-open' : ''}`}>
      <button className="schmiede-accordion-header" onClick={() => onToggle(id)}>
        <span className="schmiede-accordion-icon">{icon}</span>
        <div className="schmiede-accordion-info">
          <span className="schmiede-accordion-title">{title}</span>
          <span className="schmiede-accordion-subtitle">{subtitle}</span>
        </div>
        <span className="schmiede-accordion-chevron">{isOpen ? '\u25BC' : '\u25B6'}</span>
      </button>
      {isOpen && (
        <div className="schmiede-accordion-body">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SchmiedePage({
  categories,
  skills,
  projects,
  tasks,
  isDemo,
  onWizardSave,
  onImportTasks,
  onExportData,
  onRestoreData,
  onAiImportJson,
}) {
  const [openSection, setOpenSection] = useState(null);

  function handleToggle(id) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  return (
    <div className="schmiede-wrapper">
      <div className="schmiede-content">
        <div className="schmiede-hero">
          <div className="schmiede-hero-icon">{'\uD83D\uDD28'}</div>
          <h2 className="schmiede-hero-title">Die Schmiede</h2>
          <p className="schmiede-hero-text">
            Lerngebiete anlegen, KI-Lernpfade importieren, Quests laden und Backups verwalten &ndash; alles an einem Ort.
          </p>
        </div>

        <div className="schmiede-sections">
          <AccordionSection
            id="wizard"
            icon={'\uD83C\uDF33'}
            title="Lerngebiet anlegen"
            subtitle="Kategorie + Skills manuell erstellen"
            isOpen={openSection === 'wizard'}
            onToggle={handleToggle}
          >
            <LerngebietWizard
              categories={categories}
              onSave={onWizardSave}
            />
          </AccordionSection>

          <AccordionSection
            id="ai"
            icon={'\uD83E\uDD16'}
            title="KI-Lernpfad"
            subtitle="Mit KI einen kompletten Skill-Tree generieren"
            isOpen={openSection === 'ai'}
            onToggle={handleToggle}
          >
            <AiLernpfad
              categories={categories}
              skills={skills}
              projects={projects}
              isDemo={isDemo}
              onImportJson={onAiImportJson}
            />
          </AccordionSection>

          <AccordionSection
            id="quests"
            icon={'\uD83D\uDCCB'}
            title="Quests importieren"
            subtitle="Mehrere Aufgaben auf einmal ins Backlog laden"
            isOpen={openSection === 'quests'}
            onToggle={handleToggle}
          >
            <QuestImport onImport={onImportTasks} />
          </AccordionSection>

          <AccordionSection
            id="backup"
            icon={'\uD83D\uDCBE'}
            title="Backup & Restore"
            subtitle="Daten exportieren oder wiederherstellen"
            isOpen={openSection === 'backup'}
            onToggle={handleToggle}
          >
            <BackupRestore
              tasks={tasks}
              skills={skills}
              categories={categories}
              projects={projects}
              onExport={onExportData}
              onRestore={onRestoreData}
            />
          </AccordionSection>
        </div>
      </div>
    </div>
  );
}
