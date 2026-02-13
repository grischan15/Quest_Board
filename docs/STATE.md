# STATE: NeuroForge
## Wo stehen wir?

**Zuletzt aktualisiert:** 13. Februar 2026
**Aktualisiert von:** Claude Code CLI

---

## AKTUELLER STATUS

```
████████████████████ Phase: v3.0 Block A – RPG Dashboard im Skill-Tree
```

**Was ist fertig:**
- [x] Konzept diskutiert und entschieden
- [x] PRD geschrieben (PRD_Quest_Board_v1_0.md)
- [x] App Flow dokumentiert (App_Flow_Quest_Board_v1_0.md)
- [x] Skill-Matrix definiert (Skill_Matrix_v1_0.md)
- [x] Neurodivergenz UI Guidelines (2025_12_25_Neurodivergenz_UI_Guidelines_v1_0.md)
- [x] Tech-Stack entschieden: Vite + React + dnd-kit + localStorage
- [x] Vite + React Projekt aufgesetzt
- [x] Dependencies installiert (@dnd-kit/core, @dnd-kit/sortable, uuid)
- [x] Datenmodell & localStorage Persistenz (useQuestBoard Hook, Schema v10)
- [x] Skill-Matrix Daten (38 Skills, 6 Kategorien, mit createdAt/learnedAt/level/xpCurrent/showInDashboard)
- [x] Header mit Tab-Navigation (Backlog, Kanban, Skills, Hilfe) + P3 Logo + "NeuroForge" Branding + Import/Export + Settings
- [x] Eisenhower-Ansicht mit 4 Quadranten + Unsortiert-Bereich + Drag & Drop + Energie-Filter
- [x] Kanban-Ansicht: Normal Flow + Fast Lane + WIP-Limits + Wildcard-Counter
- [x] Kanban-Spalten: Vorbereiten, Entwickeln, Testing Intern, Testing Extern
- [x] Geteilter Done-Bereich (Last Week / Last Month Gruppierung)
- [x] Fast Lane ist Einbahnstrasse (kann nicht rueckgaengig gemacht werden)
- [x] Ex-Fast-Lane Tasks rot markiert im Done-Bereich
- [x] Skill-Tree 2-Spalten-Layout: Skills (Level+XP) links + RPG Dashboard rechts (Radar-Chart, Character Card, Kuerzlich gelernt)
- [x] Skill-Timestamps: createdAt + learnedAt pro Skill
- [x] Task-Modal (Erstellen/Bearbeiten) mit Faelligkeitsdatum + Quest-Typ + Duration + XP
- [x] Skill-Check-Modal (bei Done) mit Konfetti + XP-Vergabe + Level-Up Preview
- [x] Loesch-Bestaetigungs Modal
- [x] Import-Funktion (Schnell-Eingabe + CSV/JSON Datei-Upload + Wiederherstellen) mit vollstaendiger Spaltendokumentation
- [x] Export-Funktion (JSON-Download mit Tasks, Skills, Categories, Settings, Metadaten)
- [x] Restore-Funktion (Merge statt Replace – BUG-001 gefixt)
- [x] Erstellungsdatum auf Tasks angezeigt
- [x] Faelligkeitsdatum ("Zu erledigen bis") mit Ueberfaellig/Bald-faellig Styling
- [x] Historie-Tracking auf Tasks (fuer spaetere Auswertungen)
- [x] Schema-Versionierung mit Migration (v1 → v2 → v3 → v4 → v5 → v6 → v7 → v8)
- [x] P3 Design System (Farben, Fonts, Quadranten-Farben)
- [x] Neurodivergenz-UI: sanfte Farben, prefers-reduced-motion, Dopamin-Feedback
- [x] Dynamic base path (dev: `/`, production: `/Quest_Board/`)
- [x] GitHub Repo erstellt + gepusht
- [x] Build erfolgreich (Vite Production Build)

**v1.5 Skill-Editor:**
- [x] **BUG-001 gefixt** – Restore merged Skills/Categories statt zu ueberschreiben
- [x] **Skill-Editor** – Skills erstellen, bearbeiten, ausblenden (predefined) / loeschen (custom)
- [x] **Custom Skill-Kategorien** – Erstellen, bearbeiten, loeschen (wenn leer) + Emoji-Picker
- [x] **Schema v5** – categories Array im State, hidden Flag auf Skills

**v2.0 Block A – Quest-Typ + Duration:**
- [x] **Quest-Typ Feld** – 5 Energie-Kategorien (Code/Learn/Design/Config/Write) mit Farbcoding
- [x] **Duration-Feld** – Kurz (~30 Min) / Lang (~45 Min) auf Tasks
- [x] **Schema v6** – questType + duration auf Tasks, Migration, farbiger Top-Border auf TaskCard

**v2.0 Block B – XP + Skill-Level:**
- [x] **XP-System** – 3 XP-Stufen (30/50/80) auf Quests, XP-Buttons im TaskModal, XP-Badge auf TaskCard
- [x] **Skill-Level System** – Level 0-5 (Locked→Master) statt binaer (open/learned), Sterne + XP-Progress-Bar im SkillTree
- [x] **SkillCheckModal XP** – Zeigt Quest-XP, Level-Vorschau pro Skill, Level-Up Highlight
- [x] **Schema v7** – xp auf Tasks, level+xpCurrent auf Skills, Migration (learned→Lv3/250XP, open→Lv0/0XP)

**v2.0 Block C – WIP + Wildcard-Limits:**
- [x] **WIP-Limits** – Kanban-Spalten zeigen "2/3" Counter, Drag blockiert wenn voll, konfigurierbar
- [x] **Wildcard-Tageslimit** – Header zeigt Wildcards-Zaehler, Default 2/Tag, konfigurierbar 1-5
- [x] **SettingsModal** – WIP-Limits pro Spalte + Max Wildcards pro Tag einstellbar
- [x] **Schema v8** – settings Objekt im State (wipLimits + maxWildcardsPerDay), Migration v7→v8

**v2.0 Block D – Energie-Filter:**
- [x] **Energie-Filter** – Filter-Leiste ueber Eisenhower-Board mit Quest-Typ Chips (Alle/Code/Learn/Design/Config/Write)

**v2.1 QoL-Verbesserungen (13.02.2026):**
- [x] **Modal-Scroll Fix** – Modals scrollen auf kleinen Bildschirmen statt abgeschnitten zu werden
- [x] **Skill Level/XP editierbar** – XP-Eingabefeld im SkillModal mit automatischer Level-Berechnung + Schwellen-Referenz
- [x] **Task-Import erweitert** – Alle Spalten dokumentiert (title, description, quadrant, dueDate, questType, duration, xp), Parser erweitert
- [x] **Skill-Import** – Eigenes SkillImportModal auf der SkillTree-Seite (Schnell-Eingabe + CSV/JSON mit Spaltendokumentation)
- [x] **Hilfe-Seite** – Neuer Tab mit Erklaerung des Quest-Skill-Konzepts, Workflow, XP/Level-System, Quest-Typen und Neurodivergenz-Design-Prinzipien
- [x] **importSkills()** – Neue Bulk-Import-Funktion fuer Skills im Hook

**v2.5 NeuroForge Rebrand & Beautification (13.02.2026):**
- [x] **Rebrand zu "NeuroForge – Deine Quest-Schmiede"** – Header (Logo + Subtitle), HelpPage, index.html title, Export-Dateiname
- [x] **Quest-Typen universalisiert** – Code→Focus, Learn→Input, Design→Create, Config→Routine, Write→Reflect (Schema v9 Migration)
- [x] **15-Min Sprint Quest** – Neue Duration "Sprint (~15 Min)" mit gleichen XP-Werten
- [x] **Hilfe-Seite komplett ueberarbeitet** – Universelle Quest-Typ-Karten mit Coding + Schul-Beispielen, Energie-Tagesverlauf SVG-Diagramm, "Universal einsetzbar"-Sektion, Duration-Tabelle
- [x] **Skill Import: Kategorie-Dropdown** – Schnell-Eingabe hat Dropdown zur Kategorie-Auswahl
- [x] **Skill Import: Auto-Create Categories** – Unbekannte Kategorie-IDs aus CSV/JSON werden automatisch als neue Kategorien angelegt
- [x] **Kanban als Default-Tab** – Kanban ist Hauptansicht, Backlog wird zweiter Tab
- [x] **Mini-Backlog im Kanban** – Q1 (Dringend, ~80%) + Q2 (Saege schaerfen, ~20%) links im Kanban mit Start-Button + Covey-Ratio-Bar
- [x] **Kanban-Spalten Subtitles** – Sammeln & Planen / Aktiv bearbeiten / Selbst pruefen / Fremd pruefen
- [x] **Hilfe: Farb-Code** – Visuelle Demo-Karten fuer Quest-Typ-Farben, Fast Lane Doppelrahmen, Done-Markierung, Faelligkeits-Farben
- [x] **Hilfe: Kanban-Flow** – Spalten-Erklaerung mit Coding + Schul-Beispielen + Retrieval Practice Didaktik-Hinweis
- [x] **Hilfe: Covey x Eisenhower x Pareto** – Umfangreiches Kapitel mit 3-Saeulen-Karten, Eisenhower-Quadranten, Pareto 80/20, 4-Schritt-Flow, Saege-schaerfen-Box, externe Links

**v3.0 Block A – RPG Dashboard im Skill-Tree (13.02.2026):**
- [x] **Schema v10** – `showInDashboard` Flag auf Kategorien, Migration v9→v10 (order < 6 = true), `toggleCategoryDashboard()` mit Max-6-Pruefung
- [x] **RPG_ATTRIBUTES** – `['STR', 'INT', 'DEX', 'WIS', 'CHA', 'CON']` Export in questTypes.js
- [x] **RadarChart** – SVG Spinnendiagramm (viewBox 400, RADIUS 145), 1-6 Achsen, Referenz-Polygone (25/50/75/100%), Gradient-Fill Daten-Polygon, Icon + RPG-Kuerzel Labels auf weissem Kreis-Hintergrund
- [x] **CharacterCard** – Gesamt Character-Level (Durchschnitt Staerken skaliert 0-5) + Total XP, pro Kategorie: RPG-Name + Icon + Label + Attribut-Balken mit Level-Farbpalette
- [x] **RecentSkills** – Kuerzlich gelernte/gelevelete Skills (letzte Woche + Monat), aggregiert pro Skill (Name, Level, XP, Datum), max 5 Eintraege
- [x] **RpgDashboard** – Container-Komponente: berechnet categoryStrengths/totalLevel/totalXP, rendert RadarChart + CharacterCard + RecentSkills vertikal, sticky + scrollbar, Empty State
- [x] **SkillTree Layout-Umbau** – Done-Panels (Letzter Monat/Letzte Woche) entfernt, Grid 1fr 420px (Skills links, Dashboard rechts), Auge-Toggle auf Category-Header fuer showInDashboard
- [x] **Kategorie-Staerke Formel** – `(levelSum / (skillCount * 5)) * 100`, 0-100% Skala fuer Radar
- [x] **Responsive** – Unter 900px: 1 Spalte (Skills oben, Dashboard unten)

**Naechster Schritt (v3.0 Block B):** Siehe [ROADMAP.md](ROADMAP.md)

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
│   ├── P3_Logo_RZ_WortBild_mClaim_hell.svg
│   ├── STATE.md
│   └── ROADMAP.md
├── src/
│   ├── assets/
│   │   └── P3_Logo_RZ_WortBild_mClaim_hell.svg
│   ├── data/
│   │   ├── skillsData.js          <- 38 Skills, 6 Kategorien (mit showInDashboard), initialCategories
│   │   └── questTypes.js          <- QUEST_TYPES + DURATIONS + XP_VALUES + Level-Helpers + RPG_ATTRIBUTES
│   ├── hooks/
│   │   ├── useLocalStorage.js     <- localStorage Wrapper
│   │   └── useQuestBoard.js       <- Haupt-State-Management (Schema v10, Settings, importSkills, toggleCategoryDashboard)
│   ├── components/
│   │   ├── Header.jsx/css         <- Navigation + Tabs (Kanban/Backlog/Skills/Hilfe) + NeuroForge Branding + Wildcard-Counter + Settings + Import/Export
│   │   ├── Eisenhower.jsx/css     <- 4-Quadranten Backlog + Unsortiert + Energie-Filter
│   │   ├── Kanban.jsx/css         <- Mini-Backlog (Q1+Q2 Covey) + Normal + Fast Lane + Shared Done + WIP-Limits + Drag-Blockade
│   │   ├── SkillTree.jsx/css      <- 2-Spalten: Skills (Level+XP) links + RPG Dashboard rechts + Auge-Toggle
│   │   ├── RpgDashboard.jsx/css  <- Container: RadarChart + CharacterCard + RecentSkills
│   │   ├── RadarChart.jsx/css    <- SVG Spinnendiagramm (1-6 Achsen, Gradient-Fill)
│   │   ├── CharacterCard.jsx/css <- RPG Attribut-Balken (STR/INT/DEX/WIS/CHA/CON)
│   │   ├── RecentSkills.jsx/css  <- Kuerzlich gelernte Skills (Woche + Monat)
│   │   ├── HelpPage.jsx/css       <- Hilfe-Seite (Konzept, Workflow, XP, Energie-SVG, Universal-Kontexte, Neurodivergenz)
│   │   ├── TaskCard.jsx/css       <- Karte mit Datum, Due Date, Fast Lane, Quest-Typ, Duration, XP
│   │   ├── DroppableContainer.jsx <- DnD Wrapper
│   │   ├── Modal.jsx/css          <- Basis-Modal (scrollbar auf kleinen Bildschirmen)
│   │   ├── TaskModal.jsx/css      <- Quest Erstellen/Bearbeiten + Due Date + Quest-Typ + Duration + XP
│   │   ├── SkillModal.jsx/css     <- Skill Erstellen/Bearbeiten/Ausblenden + Level/XP editierbar
│   │   ├── CategoryModal.jsx/css  <- Kategorie Erstellen/Bearbeiten + Emoji-Picker
│   │   ├── SkillCheckModal.jsx/css <- Done -> Skills + XP-Vergabe + Konfetti + Level-Up Preview
│   │   ├── ImportModal.jsx/css    <- Task-Import (Text + CSV/JSON mit Spaltendoku + Restore)
│   │   ├── SkillImportModal.jsx/css <- Skill-Import (Text + CSV/JSON mit Spaltendoku)
│   │   ├── ExportModal.jsx/css    <- Daten-Export mit Beschreibung
│   │   ├── SettingsModal.jsx/css  <- WIP-Limits + Wildcard-Settings + Reset
│   │   └── DeleteModal.jsx/css    <- Loeschbestaetigung (Quest, Skill, Kategorie)
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
| v1 | Initiales Datenmodell (location, quadrant, kanbanColumn: prepare/doing/done) |
| v2 | Kanban-Refactor: doing → develop, neue Spalten testing-intern/testing-extern |
| v3 | Due Date, History-Array, Unsortiert-Quadrant, One-Way Fast Lane |
| v4 | Skills: createdAt + learnedAt Timestamps, Migration bestehender Skills |
| v5 | Categories Array im State, hidden Flag auf Skills, Merge-Restore (BUG-001 Fix) |
| v6 | questType + duration auf Tasks (Block A Gamification) |
| v7 | xp auf Tasks, level + xpCurrent auf Skills (Block B XP/Level) |
| v8 | settings Objekt (wipLimits + maxWildcardsPerDay) im State (Block C Kanban-Limits) |
| v9 | Quest-Typ IDs umbenannt: code→focus, learn→input, design→create, config→routine, write→reflect (v2.5 NeuroForge) |
| v10 | showInDashboard Flag auf Categories (max 6), toggleCategoryDashboard(), RPG Dashboard (v3.0 Block A) |

---

*Diese Datei wird bei jedem Arbeitsschritt aktualisiert.*
