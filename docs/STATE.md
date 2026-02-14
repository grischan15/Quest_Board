# STATE: NeuroForge
## Wo stehen wir?

**Zuletzt aktualisiert:** 14. Februar 2026
**Aktualisiert von:** Claude Code CLI

---

## AKTUELLER STATUS

```
████████████████████ Phase: v4.1 Schmiede-Tab (komplett) → Naechster Schritt: Browser-Testing & Feinschliff
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
- [x] Datenmodell & localStorage Persistenz (useQuestBoard Hook, Schema v14)
- [x] Skill-Matrix Daten (38 Skills, 6 Kategorien, mit createdAt/learnedAt/level/xpCurrent/showInDashboard)
- [x] Header mit Tab-Navigation (Backlog, Kanban, Skills, Dashboard, Hilfe) + P3 Logo + "NeuroForge" Branding + Import/Export + Settings
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
- [x] Schema-Versionierung mit Migration (v1 → v2 → v3 → v4 → v5 → v6 → v7 → v8 → v9 → v10 → v11 → v12)
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

**v3.0 Block B – Personal Dashboard (13.02.2026):**
- [x] **Schema v11** – `startedAt`/`completedAt` Timestamps auf Tasks, Migration backfill aus History
- [x] **PersonalDashboard** – Neuer Tab "Dashboard" mit 3 Visualisierungen + useDashboardData Hook
- [x] **Heatmap** – GitHub-Contribution-Style, Zeilen: Tageszeiten (2h-Bloecke 04-00), Spalten: Wochentage, kompakte flache Zellen
- [x] **LineChart** – SVG-Liniendiagramm, Wochen/Monate Toggle, farbige Linien pro Quest-Typ + Gesamtlinie
- [x] **EnergyCurve** – Persoenliche Energiekurve aus echten Done-Daten (ab 04:00) + farbige Quest-Typ-Balken + Legende
- [x] **Dashboard-Layout** – Energiekurve oben (wichtigstes Chart), dann Fortschritt, dann Heatmap
- [x] **Scrollbar-Design** – 10px breit, kontrastreiche Farben, Firefox-Support (global in index.css)
- [x] **Hilfe-Seite** – Callout-Box: persoenliche Energiekurve erklaert, Hinweis zur Planung adaptieren

**v3.0 Block B.2 – Quest-Skill Linking + Demo-Daten (13.02.2026):**
- [x] **Schema v12** – `linkedSkills: []` auf Tasks, `isDemo` Flag auf State
- [x] **Demo-Daten** – ~50 Beispiel-Quests beim ersten Start, gelber Banner, loeschbar
- [x] **Quest-Skill Linking** – Klappbarer Skill-Picker im TaskModal (Kategorien + Checkbox-Grid)
- [x] **SkillCheckModal Vorauswahl** – linkedSkills werden als Vorauswahl gesetzt
- [x] **TaskCard Badge** – linkedSkills-Count Badge auf nicht-Done Karten
- [x] **DemoBanner** – Warmer gelber Banner mit "Eigene Daten starten" Button
- [x] **Settings Demo-Delete** – Roter "Demo-Daten loeschen" Button im SettingsModal
- [x] **clearDemoData()** – Loescht alle Tasks, behaelt Skills/Kategorien/Settings

**v3.0 Block C – Kanban UX, Eisenhower Bugfix, Level-Klarheit (13.02.2026):**
- [x] **Schema v13** – `fastLaneAt` Timestamp auf Tasks, Migration backfill aus History
- [x] **Eisenhower Bug gefixt** – Unsortierte Quests waren nicht sichtbar (CSS flex-direction + max-height + overflow-y)
- [x] **Wildcard-Counter aus Header entfernt** – Stattdessen im Fast Lane Label: "WILDCARD" + "⚡ Fast Lane · 1/2"
- [x] **Wildcard-Zaehlung gefixt** – Zaehlt jetzt nach `fastLaneAt` statt `startedAt` (korrekte Tageszaehlung)
- [x] **WIP-Limits aus Fast Lane entfernt** – Fast Lane Spalten zeigen nur Anzahl, kein Limit
- [x] **Mini-Backlog als 2 separate Kaesten** – Q2 ("Saege schaerfen") oben mit gruener Borderlinie + Motivationstext, Q1 ("Dringend") unten mit roter Borderlinie
- [x] **CharacterCard Level-Erklaerung** – "Durchschnitt deiner Kategorie-Staerken" + Fortschrittsbalken fuer naechste 2 Ganzzahl-Level + Hebel-Tipp (schwaechste Kategorie)
- [x] **Level-Anzeige dynamisch** – Erreichte Level werden uebersprungen, zeigt immer die naechsten 2 noch nicht erreichten Level

**v3.5 Block C – Projekte als Unlock-Ziele (13.02.2026):**
- [x] **Schema v14** – `projects: []` im State, Migration v13→v14
- [x] **projectHelpers.js** – Pure computed Funktionen: getProjectStatus, getProjectProgress, getProjectsForSkill, getRelevantQuests, PROJECT_STATUS_CONFIG
- [x] **Projekt-Datenmodell** – id, name, description, icon, requirements [{skillId, requiredLevel}], status (active/done), createdAt, completedAt
- [x] **ProjectModal** – CRUD UI mit Requirements-Picker (Skill-Dropdown grouped by category + Level-Buttons 1-5 + met/unmet Indikator)
- [x] **ProjectCard** – Full mode (SkillTree: Icon + Name + Status-Badge + Progress-Bar + Requirement-Liste) + Compact mode (Dashboard: Icon + Name + Progress-Bar + "3/5 Skills")
- [x] **SkillTree Integration** – Projekte-Sektion UEBER den Skill-Kategorien mit ProjectCard-Grid + "+ Projekt" Button
- [x] **PersonalDashboard** – "Projekt-Fortschritt" Sektion mit kompakten ProjectCard-Tiles (vor Energiekurve)
- [x] **SkillCheckModal** – Projekt-Impact nach Skill-Auswahl ("Bringt dich naeher an: Projekt X") + Spezial-Highlight wenn Projekt "ready" wird
- [x] **SkillModal** – "Wird benoetigt von:" Sektion (Projekt-Icon + Name + Level-Anforderung + met/unmet)
- [x] **RpgDashboard** – "Aktive Projekte" Liste unter CharacterCard mit Mini-Progress-Bars
- [x] **Demo-Projekte** – 4 Beispiel-Projekte (1x done, 1x active, 2x locked) beim ersten Start
- [x] **Export/Import/Restore** – projects Array in Export, Restore, clearDemoData
- [x] **4 Status-Typen** – done (manuell), ready (computed: alle Requirements erfuellt), active (manuell), locked (computed: Requirements nicht erfuellt)

**v3.5 Block D – KI Setup Guide (13.02.2026):**
- [x] **Neuer Tab "KI Setup"** – Eigene Seite in der Hauptnavigation
- [x] **AiSetupGuide-Komponente** – 3-Schritte-Erklaerung, Prompt-Vorschau, Copy/Download, Import-Bereich, Tipps
- [x] **KI-Prompt-Template** – Umfassendes Markdown-Dokument (aiPromptTemplate.js) das der KI das NeuroForge-Datenmodell erklaert
- [x] **JSON-Schema Referenz** – Categories, Skills, Projects, Tasks mit allen Feldern und Regeln
- [x] **3 Beispiel-Vorlagen** – Webentwicklung, KI & Prompting, Physik Klasse 10 (jeweils mit Lernziel-Beschreibung)
- [x] **KI-JSON-Import** – Parst die generierte JSON, loest SKILL_INDEX-Referenzen auf, importiert Categories + Skills + Projects + Tasks
- [x] **Prompt kopieren/herunterladen** – Clipboard + .md Download, auch fuer Beispiel-Vorlagen (Prompt + Lernziel)
- [x] **dueDate-Bug gefixt** – AI-Import-Handler reicht jetzt dueDate an importTasks durch
- [x] **Prompt-Template ueberarbeitet** – Vollstaendige Feld-Tabellen fuer alle 4 Entitaeten, dueDate-Strategie, Eisenhower-Erklaerungen, Quest-Typ/Dauer/XP-Tabellen, Qualitaetskriterien, komplettes Mini-Beispiel (Git)
- [x] **Hilfe-Seite** – Neue Sektion "KI Setup: Lernpfad generieren" erklaert 3-Schritte-Workflow, zeigt was generiert wird, listet die 3 Beispiel-Vorlagen

**v4.0 Beautification (14.02.2026):**
- [x] **S-001: Vertikale Scrollbar** – html/body overflow:hidden, App-Main als einziger Scroll-Container (height:100vh + overflow-y:auto)
- [x] **S-002: Horizontale Scrollbars** – Alle CSS Grids von `1fr` auf `minmax(0, 1fr)` umgestellt (Kanban, Eisenhower, SkillTree, HelpPage), overflow-x:hidden auf Wrappern, Projekt-Grid mit `minmax(min(280px, 100%), 1fr)`
- [x] **S-003: Zentrales Breakpoint-System** – Einheitlich Mobile <640px, Tablet <1024px, Desktop >=1024px. Responsive Regeln in Header, Eisenhower, Kanban, SkillTree, HelpPage, PersonalDashboard, AiSetupGuide
- [x] **S-004: Settings-Button** – Zahnrad-Icon an letzte Position im Header verschoben, eigene `.settings-btn` CSS-Klasse
- [x] **S-005: Projekt-Anzeige konsistent** – SkillTree zeigt aktive Projekte direkt, abgeschlossene hinter klappbarem Toggle (default: eingeklappt, 65% Opazitaet). Nutzt `getProjectStatus()` konsistent

**v4.1 Schmiede-Tab (14.02.2026):**
- [x] **Neuer Tab "Schmiede"** – Ersetzt "KI Setup" Tab, konsolidiert alle Import/Export-Funktionen an einem Ort
- [x] **SchmiedePage** – Accordion-Layout mit 4 Sektionen (Progressive Disclosure), Hero-Header
- [x] **Sektion 1: Lerngebiet-Wizard** – 3-Schritt-Wizard (Kategorie waehlen/erstellen → Skills definieren mit XP → Vorschau + Speichern)
- [x] **Sektion 2: KI-Lernpfad** – Refactored AiSetupGuide mit "Bestand fuer KI kopieren" Button (Markdown-Export aktueller Categories/Skills/Projects) + Demo-Daten-Warnung
- [x] **Sektion 3: Quest-Import** – Schnell-Eingabe + CSV/JSON Datei-Upload mit Preview (extrahiert aus ImportModal)
- [x] **Sektion 4: Backup & Restore** – Export (JSON-Download mit Stats) + Restore (Upload + Merge) kombiniert (aus ExportModal + ImportModal)
- [x] **8 alte Dateien entfernt** – ImportModal, ExportModal, SkillImportModal, AiSetupGuide (je .jsx/.css)
- [x] **Header bereinigt** – Import/Export-Buttons entfernt, nur "Neue Quest" + Settings bleiben
- [x] **SkillTree bereinigt** – "+ Neue Kategorie" und "Skills importieren" Buttons entfernt
- [x] **SkillModal Bug-Fix** – Create-Mode zeigt jetzt XP-Input statt Status-Radio (gleicher Code wie Edit-Mode)
- [x] **Wizard Doppel-Kategorie Bug-Fix** – React State Closure Problem geloest: importSkills erstellt Kategorie automatisch, updateCategory setzt Icon/Label per Functional Updater

**Naechster Schritt:** Siehe [ROADMAP.md](ROADMAP.md)

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
│   │   ├── questTypes.js          <- QUEST_TYPES + DURATIONS + XP_VALUES + Level-Helpers + RPG_ATTRIBUTES
│   │   ├── demoData.js            <- generateDemoData() + generateDemoProjects() – Demo-Quests + Demo-Projekte
│   │   ├── projectHelpers.js      <- Pure computed Helpers (Status, Progress, ForSkill, RelevantQuests, CONFIG)
│   │   └── aiPromptTemplate.js    <- KI-Prompt-Template (Markdown) + 3 Beispiel-Vorlagen (EXAMPLE_TEMPLATES)
│   ├── hooks/
│   │   ├── useLocalStorage.js     <- localStorage Wrapper (supports function initialValue)
│   │   ├── useDashboardData.js    <- Dashboard-Datenaufbereitung (Heatmap, LineChart, EnergyCurve)
│   │   └── useQuestBoard.js       <- Haupt-State-Management (Schema v14, Settings, importSkills, clearDemoData, Project CRUD)
│   ├── components/
│   │   ├── Header.jsx/css         <- Navigation + Tabs (Kanban/Backlog/Skills/Dashboard/Schmiede/Hilfe) + NeuroForge Branding + Settings
│   │   ├── Eisenhower.jsx/css     <- 4-Quadranten Backlog + Unsortiert + Energie-Filter
│   │   ├── Kanban.jsx/css         <- Mini-Backlog (Q2+Q1 als separate Kaesten) + Normal + Fast Lane (Wildcard-Counter) + Shared Done + WIP-Limits + Drag-Blockade
│   │   ├── SkillTree.jsx/css      <- 2-Spalten: Projekte + Skills (Level+XP) links + RPG Dashboard rechts + Auge-Toggle
│   │   ├── ProjectCard.jsx/css   <- Projekt-Karte (Full + Compact Mode) mit Status-Badge + Progress-Bar + Requirements
│   │   ├── RpgDashboard.jsx/css  <- Container: RadarChart + CharacterCard + Aktive Projekte + RecentSkills
│   │   ├── RadarChart.jsx/css    <- SVG Spinnendiagramm (1-6 Achsen, Gradient-Fill)
│   │   ├── CharacterCard.jsx/css <- RPG Attribut-Balken (STR/INT/DEX/WIS/CHA/CON) + Level-Erklaerung + naechste Level + Hebel-Tipp
│   │   ├── RecentSkills.jsx/css  <- Kuerzlich gelernte Skills (Woche + Monat)
│   │   ├── PersonalDashboard.jsx/css <- Dashboard-Tab mit Projekt-Fortschritt, Heatmap, LineChart, EnergyCurve
│   │   ├── Heatmap.jsx/css         <- GitHub-Style Heatmap (Tageszeiten x Wochentage)
│   │   ├── LineChart.jsx/css       <- SVG-Liniendiagramm (Quest-Typen ueber Zeit)
│   │   ├── EnergyCurve.jsx/css     <- Persoenliche Energiekurve aus echten Daten
│   │   ├── DemoBanner.jsx/css      <- Gelber Banner fuer Demo-Modus
│   │   ├── HelpPage.jsx/css       <- Hilfe-Seite (Konzept, Workflow, XP, Energie-SVG, Universal-Kontexte, Demo-Daten, Neurodivergenz)
│   │   ├── TaskCard.jsx/css       <- Karte mit Datum, Due Date, Fast Lane, Quest-Typ, Duration, XP, linkedSkills Badge
│   │   ├── DroppableContainer.jsx <- DnD Wrapper
│   │   ├── Modal.jsx/css          <- Basis-Modal (scrollbar auf kleinen Bildschirmen)
│   │   ├── TaskModal.jsx/css      <- Quest Erstellen/Bearbeiten + Due Date + Quest-Typ + Duration + XP + Skill-Picker
│   │   ├── SkillModal.jsx/css     <- Skill Erstellen/Bearbeiten/Ausblenden + Level/XP editierbar (Create + Edit) + "Wird benoetigt von" Projekte
│   │   ├── CategoryModal.jsx/css  <- Kategorie Erstellen/Bearbeiten + Emoji-Picker
│   │   ├── ProjectModal.jsx/css   <- Projekt Erstellen/Bearbeiten + Requirements-Picker (Skill + Level)
│   │   ├── SkillCheckModal.jsx/css <- Done -> Skills + XP-Vergabe + Konfetti + Level-Up Preview + Projekt-Impact
│   │   ├── SettingsModal.jsx/css  <- WIP-Limits + Wildcard-Settings + Reset + Demo-Daten loeschen
│   │   └── DeleteModal.jsx/css    <- Loeschbestaetigung (Quest, Skill, Kategorie)
│   ├── components/schmiede/
│   │   ├── SchmiedePage.jsx/css    <- Wrapper mit Accordion-Layout (4 Sektionen, Progressive Disclosure)
│   │   ├── LerngebietWizard.jsx/css <- 3-Schritt-Wizard: Kategorie + Skills + Vorschau
│   │   ├── AiLernpfad.jsx/css      <- KI-Flow: Prompt-Template + Bestands-Export + JSON-Import
│   │   ├── QuestImport.jsx/css     <- Quest-Bulk-Import (Schnell-Eingabe + CSV/JSON)
│   │   └── BackupRestore.jsx/css   <- Export (JSON-Download) + Restore (Upload + Merge)
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
| v11 | startedAt/completedAt Timestamps auf Tasks, Backfill-Migration aus History (v3.0 Block B Personal Dashboard) |
| v12 | linkedSkills auf Tasks, isDemo Flag auf State, Demo-Daten beim ersten Start (v3.0 Block B.2) |
| v13 | fastLaneAt Timestamp auf Tasks, Wildcard-Zaehlung nach Fast-Lane-Eintritt statt Kanban-Start (v3.0 Block C) |
| v14 | projects Array im State, Projekt-Datenmodell (id, name, description, icon, requirements, status, createdAt, completedAt), Project CRUD, Demo-Projekte (v3.5 Block C) |

---

*Diese Datei wird bei jedem Arbeitsschritt aktualisiert.*
