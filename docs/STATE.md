# STATE: NeuroForge
## Wo stehen wir?

**Zuletzt aktualisiert:** 15. Februar 2026

---

## AKTUELLER STATUS

**Version:** v4.2 (Migrations-Sicherheitsnetz) · **Schema:** v14 · **Naechster Schritt:** v5.0 Quest-Dependencies. Siehe [ROADMAP.md](ROADMAP.md)

**Tech-Stack:** React + Vite + dnd-kit + localStorage · **Design:** Neurodivergenz-optimiert

### Kern-Features

- **Kanban** (Hauptansicht) – Mini-Backlog (Q2 Saege-schaerfen + Q1 Dringend, Covey 80/20) + Normal Flow + Fast Lane + Shared Done + WIP-Limits + Wildcard-Tageslimit
- **Eisenhower-Backlog** – 4 Quadranten + Unsortiert + Energie-Filter (Quest-Typ Chips) + Drag & Drop
- **Skill-Tree** – Skills mit Level 0-5 + XP + RPG Dashboard (Radar-Chart, CharacterCard, RecentSkills) + Projekte als Unlock-Ziele
- **Personal Dashboard** – Energiekurve, Heatmap (GitHub-Style), LineChart, Projekt-Fortschritt
- **Schmiede** – 4 Accordion-Sektionen: Lerngebiet-Wizard, KI-Lernpfad (Prompt + JSON-Import), Quest-Import, Backup & Restore
- **Migrations-Sicherheitsnetz** – Auto-Backup vor Migration, Schema-Validierung, Fehler-Banner, Notfall-Restore in Settings
- **Hilfe-Seite** – Konzept, Workflow, Covey/Eisenhower/Pareto, Farb-Code, Neurodivergenz-Prinzipien
- **Gamification** – Quest-Typen (Focus/Input/Create/Routine/Reflect), Duration (Sprint/Kurz/Lang), XP (30/50/80), Konfetti + Level-Up
- **Demo-Daten** – ~50 Beispiel-Quests + 4 Projekte beim ersten Start, loeschbar

---

## DATEISTRUKTUR

```
Quest_Board/
├── docs/
│   ├── PRD_Quest_Board_v1_0.md
│   ├── App_Flow_Quest_Board_v1_0.md
│   ├── Skill_Matrix_v1_0.md
│   ├── Quest_Skill_Projekt_Konzept_v1_0.md
│   ├── 2025_12_25_Neurodivergenz_UI_Guidelines_v1_0.md
│   ├── 2025_06_22_Relevance_Score_Regeln_v1_0.md    <- Referenz fuer v5.0
│   ├── 2025_09_06_Covey_Wochenarbeitsblatt_Konzept_v1_0.md  <- Teilweise umgesetzt, Rest zurueckgestellt
│   ├── P3_Logo_RZ_WortBild_mClaim_hell.svg
│   ├── STATE.md
│   └── ROADMAP.md
├── src/
│   ├── assets/
│   │   └── P3_Logo_RZ_WortBild_mClaim_hell.svg
│   ├── data/
│   │   ├── skillsData.js          <- Skills + Kategorien (initialSkills, initialCategories)
│   │   ├── questTypes.js          <- QUEST_TYPES, DURATIONS, XP_VALUES, Level-Helpers, RPG_ATTRIBUTES
│   │   ├── demoData.js            <- generateDemoData() + generateDemoProjects()
│   │   ├── projectHelpers.js      <- getProjectStatus, getProjectProgress, getProjectsForSkill
│   │   └── aiPromptTemplate.js    <- KI-Prompt-Template + EXAMPLE_TEMPLATES
│   ├── hooks/
│   │   ├── useLocalStorage.js     <- localStorage Wrapper
│   │   ├── useDashboardData.js    <- Heatmap, LineChart, EnergyCurve Datenaufbereitung
│   │   └── useQuestBoard.js       <- Haupt-State (Schema v14, migrateState, CRUD, Import/Export, Auto-Backup, validateState)
│   ├── components/
│   │   ├── Header.jsx/css         <- Tabs + Branding + Settings
│   │   ├── Eisenhower.jsx/css     <- 4 Quadranten + Unsortiert + Energie-Filter
│   │   ├── Kanban.jsx/css         <- Mini-Backlog + Normal + Fast Lane + Done + WIP
│   │   ├── SkillTree.jsx/css      <- Projekte + Skills + RPG Dashboard
│   │   ├── ProjectCard.jsx/css    <- Full + Compact Mode
│   │   ├── RpgDashboard.jsx/css   <- RadarChart + CharacterCard + Projekte + RecentSkills
│   │   ├── RadarChart.jsx/css     <- SVG Spinnendiagramm
│   │   ├── CharacterCard.jsx/css  <- RPG Attribut-Balken + Level
│   │   ├── RecentSkills.jsx/css   <- Kuerzlich gelernte Skills
│   │   ├── PersonalDashboard.jsx/css <- Energiekurve + Heatmap + LineChart + Projekte
│   │   ├── Heatmap.jsx/css        <- Tageszeiten x Wochentage
│   │   ├── LineChart.jsx/css      <- Quest-Typen ueber Zeit
│   │   ├── EnergyCurve.jsx/css    <- Persoenliche Energiekurve
│   │   ├── DemoBanner.jsx/css     <- Demo-Modus Banner
│   │   ├── HelpPage.jsx/css       <- Hilfe-Seite
│   │   ├── TaskCard.jsx/css       <- Quest-Karte
│   │   ├── DroppableContainer.jsx <- DnD Wrapper
│   │   ├── Modal.jsx/css          <- Basis-Modal
│   │   ├── TaskModal.jsx/css      <- Quest CRUD + Skill-Picker
│   │   ├── SkillModal.jsx/css     <- Skill CRUD + XP/Level
│   │   ├── CategoryModal.jsx/css  <- Kategorie CRUD + Emoji-Picker
│   │   ├── ProjectModal.jsx/css   <- Projekt CRUD + Requirements-Picker
│   │   ├── SkillCheckModal.jsx/css <- Done-Flow: XP + Konfetti + Projekt-Impact
│   │   ├── SettingsModal.jsx/css  <- WIP-Limits + Wildcards + Demo-Delete + Notfall-Backups
│   │   └── DeleteModal.jsx/css    <- Loeschbestaetigung
│   ├── components/schmiede/
│   │   ├── SchmiedePage.jsx/css   <- Accordion-Layout (4 Sektionen)
│   │   ├── LerngebietWizard.jsx/css <- Kategorie + Skills Wizard
│   │   ├── AiLernpfad.jsx/css     <- KI-Flow: Prompt + Import
│   │   ├── QuestImport.jsx/css    <- Schnell-Eingabe + CSV/JSON
│   │   └── BackupRestore.jsx/css  <- Export + Restore
│   ├── App.jsx/css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

---

## SCHEMA-VERSIONEN

| Version | Aenderungen |
|---------|-----------|
| v1 | Initiales Datenmodell (location, quadrant, kanbanColumn) |
| v2 | Kanban-Refactor: doing → develop, testing-intern/testing-extern |
| v3 | dueDate, history[], unsorted Quadrant, Fast Lane |
| v4 | Skills: createdAt + learnedAt |
| v5 | categories[] im State, hidden auf Skills, Merge-Restore |
| v6 | questType + duration auf Tasks |
| v7 | xp auf Tasks, level + xpCurrent auf Skills |
| v8 | settings (wipLimits + maxWildcardsPerDay) |
| v9 | Quest-Typ IDs: code→focus, learn→input, design→create, config→routine, write→reflect |
| v10 | showInDashboard auf Categories (max 6) |
| v11 | startedAt/completedAt auf Tasks (Backfill aus History) |
| v12 | linkedSkills auf Tasks, isDemo auf State |
| v13 | fastLaneAt auf Tasks |
| v14 | projects[] im State (id, name, description, icon, requirements, status) |

---

*Diese Datei wird bei jedem Arbeitsschritt aktualisiert.*
