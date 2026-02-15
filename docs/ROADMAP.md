# ROADMAP: NeuroForge
## Wohin geht die Reise?

**Zuletzt aktualisiert:** 14. Februar 2026

---

## 📐 KONZEPT-DOKUMENT

> **→ [Quest-Skill-Projekt Konzept v1.0](Quest_Skill_Projekt_Konzept_v1_0.md)**
>
> Definiert das komplette Hybrid-System mit:
> - Abgrenzungsregeln: Quest vs Skill vs Projekt
> - XP-System (30/50/80) und Skill-Level (0-5)
> - Quest-Typen mit Energie-Kategorien (Focus/Input/Create/Routine/Reflect)
> - WIP-Limits, Fast Lane Regeln, Wildcard-Tageslimit
> - Intake-Flow für neue Ideen + KI-Import-Template
> - Inkrementelle Umsetzungs-Roadmap (9 Schritte)
>
> **Dieses Dokument ist die Referenz für die Claude Code CLI Umsetzung.**

---

## 🐛 BEKANNTE BUGS

### BUG-001: Backup-Restore überschreibt neue predefined Skills

**Status:** ✅ Behoben (12.02.2026)
**Entdeckt:** 12.02.2026
**Behoben in:** Schema v5 – `mergeSkillsWithPredefined()` + `mergeCategoriesWithPredefined()` in `useQuestBoard.js`

**Lösung:** Restore nutzt jetzt Merge statt Replace. Predefined Skills/Kategorien bleiben immer erhalten, Backup-Daten werden zusammengeführt. Custom Skills aus dem Backup werden übernommen.

---

## ✅ ERLEDIGT (v1.5 – Skill-Editor & Bugfix)

Umgesetzt am 12.02.2026, Schema v4 → v5:

- [x] **BUG-001 fixen** – Restore-Merge statt Overwrite
- [x] **Skill-Editor** – Skills manuell hinzufügen, bearbeiten, ausblenden (predefined) / löschen (custom)
- [x] **Eigene Skill-Kategorien** – Erstellen, bearbeiten, löschen (wenn leer) + Emoji-Picker
- [x] **Schema v5** – `categories` Array im State, `hidden` Flag auf Skills, Migration v4→v5
- [x] **ImportModal** – Restore-Warnung aktualisiert (Merge statt Replace), Kategorie-Anzahl in Vorschau

**Dateien:** `skillsData.js`, `useQuestBoard.js`, `SkillTree.jsx/.css`, `SkillCheckModal.jsx`, `App.jsx`, `ImportModal.jsx`, `DeleteModal.jsx` + NEU: `SkillModal.jsx/.css`, `CategoryModal.jsx/.css`

---

## ✅ ERLEDIGT (v2.0 Block A – Quest-Typ + Duration)

Umgesetzt am 12.02.2026, Schema v5 → v6:

- [x] **Quest-Typ Feld** – 5 Energie-Kategorien (Code/Learn/Design/Config/Write) als klickbare Buttons im TaskModal
- [x] **Duration-Feld** – Kurz (~30 Min) / Lang (~45 Min) als klickbare Buttons im TaskModal
- [x] **TaskCard Anzeige** – Farbiger Top-Border pro Quest-Typ + Quest-Typ Badge + Duration Badge im Meta-Bereich
- [x] **Schema v6** – Migration setzt `questType: null, duration: null` auf bestehende Tasks
- [x] **questTypes.js** – Zentrale Config (QUEST_TYPES + DURATIONS + Helper-Funktionen)

**Dateien:** NEU: `questTypes.js` + GEAENDERT: `useQuestBoard.js`, `TaskModal.jsx/.css`, `TaskCard.jsx/.css`, `App.jsx`

---

## ✅ ERLEDIGT (v2.0 Block B – XP + Skill-Level)

Umgesetzt am 12.02.2026, Schema v6 → v7:

- [x] **XP-System** – 3 XP-Stufen (30 Rezeptiv / 50 Reproduktiv / 80 Produktiv) als klickbare Buttons im TaskModal
- [x] **Skill-Level** – Level 0-5 (Locked/Novice/Apprentice/Journeyman/Expert/Master) statt binaer open/learned
- [x] **Migration** – `learned` → Level 3 / 250 XP, `open` → Level 0 / 0 XP
- [x] **assignSkills mit XP** – Addiert Task-XP auf Skills, berechnet Level neu, mindestens 1 XP pro Zuordnung
- [x] **SkillTree** – Sterne pro Level + XP-Progress-Bar + Level-Labels (6 Farbvarianten) + XP-Totals
- [x] **SkillCheckModal** – Zeigt Quest-XP, Level/XP-Vorschau pro Skill, Level-Up Highlight (gold)
- [x] **SkillModal** – Level/XP read-only Info im Edit-Mode, Status-Toggle nur bei Create
- [x] **TaskCard** – XP-Badge im Meta-Bereich (gruen)
- [x] **Schema v7** – `xp` auf Tasks, `level` + `xpCurrent` auf Skills

**Level-Schwellen:** 0→1: 1XP, 1→2: 100XP, 2→3: 250XP, 3→4: 500XP, 4→5: 800XP

**Dateien:** GEAENDERT: `questTypes.js`, `skillsData.js`, `useQuestBoard.js`, `TaskModal.jsx/.css`, `TaskCard.jsx/.css`, `SkillTree.jsx/.css`, `SkillCheckModal.jsx/.css`, `SkillModal.jsx/.css`, `App.jsx`

**Hinweis:** Nach Schema-Migration muss der Browser-Cache (localStorage) geloescht werden, da alte Datenstrukturen ohne level/xpCurrent den SkillTree crashen koennen.

---

## ✅ ERLEDIGT (v2.0 Block C – WIP + Wildcard-Limits)

Umgesetzt am 13.02.2026, Schema v7 → v8:

- [x] **WIP-Limits** – Kanban-Spalten-Header zeigt "2/3" Counter, rot wenn voll, Drag blockiert bei Limit
- [x] **Wildcard-Tageslimit** – Header zeigt "⚡ 1/2 Wildcards" auf Kanban-Tab, rot wenn aufgebraucht
- [x] **SettingsModal** – WIP-Limits pro Spalte (1-10) + Max Wildcards pro Tag (1-5) konfigurierbar
- [x] **Schema v8** – `settings` Objekt mit `wipLimits` + `maxWildcardsPerDay`, Migration v7→v8
- [x] **Export/Import** – Settings werden mit exportiert und beim Restore uebernommen

**Dateien:** GEAENDERT: `useQuestBoard.js`, `Kanban.jsx/.css`, `Header.jsx/.css`, `App.jsx` + NEU: `SettingsModal.jsx/.css`

---

## ✅ ERLEDIGT (v2.0 Block D – Energie-Filter)

Umgesetzt am 13.02.2026, kein Schema-Change:

- [x] **Energie-Filter** – Filter-Leiste ueber dem Eisenhower-Board mit Quest-Typ Chips
- [x] **Toggle-Verhalten** – Klick aktiviert Filter, erneuter Klick zeigt alle
- [x] **Sichtbarkeit** – Nur sichtbar wenn mindestens 1 Quest einen Typ gesetzt hat
- [x] **Filtert** – Quadranten + Unsortiert-Bereich

**Dateien:** GEAENDERT: `Eisenhower.jsx/.css`

---

## ✅ ERLEDIGT (v2.1 – QoL-Verbesserungen)

Umgesetzt am 13.02.2026, kein Schema-Change:

- [x] **Modal-Scroll Fix** – Modals scrollen auf kleinen Bildschirmen statt abgeschnitten zu werden (max-height + overflow-y auf Modal.css)
- [x] **Skill Level/XP editierbar** – XP-Eingabefeld im SkillModal mit automatischer Level-Berechnung + Schwellen-Referenz (Lv.1: 1 · Lv.2: 100 · Lv.3: 250 · Lv.4: 500 · Lv.5: 800)
- [x] **Task-Import erweitert** – Alle 7 Spalten dokumentiert (title, description, quadrant, dueDate, questType, duration, xp), CSV/JSON Parser erweitert, Spalten-Info-Grid im Modal
- [x] **Skill-Import** – Eigenes SkillImportModal auf der SkillTree-Seite (Schnell-Eingabe + CSV/JSON mit Spaltendokumentation: name, category, status, level, xp)
- [x] **Hilfe-Seite** – Neuer Tab "Hilfe" mit Erklaerung des Quest-Skill-Projekt-Konzepts, Workflow (4 Schritte), XP/Level-Tabellen, Quest-Typen, Fast Lane, Neurodivergenz-Designprinzipien (6 Bereiche)
- [x] **importSkills()** – Neue Bulk-Import-Funktion fuer Skills im useQuestBoard Hook

**Dateien:** GEAENDERT: `Modal.css`, `SkillModal.jsx/.css`, `ImportModal.jsx/.css`, `SkillTree.jsx/.css`, `App.jsx`, `useQuestBoard.js`, `Header.jsx` + NEU: `SkillImportModal.jsx/.css`, `HelpPage.jsx/.css`

---

## ✅ ERLEDIGT (v2.5 – NeuroForge Rebrand & Beautification)

Umgesetzt am 13.02.2026, Schema v8 → v9:

- [x] **Rebrand zu "NeuroForge – Deine Quest-Schmiede"** – Header, HelpPage, index.html, Export-Dateiname
- [x] **Quest-Typen universell** – Code→Focus, Learn→Input, Design→Create, Config→Routine, Write→Reflect. Schema v9 Migration.
- [x] **15-Min Sprint Quest** – Neue Duration "Sprint (~15 Min)" neben Kurz und Lang
- [x] **Hilfe-Seite komplett überarbeitet** – Universelle Quest-Typ-Beschreibungen mit zwei Kontexten (Coding + Schule), Energie-Tagesverlauf SVG-Diagramm, "Universal einsetzbar"-Sektion (Software, Physik Kl.10, Sprachen), Duration-Tabelle mit Sprint
- [x] **Skill Import: Kategorie-Dropdown** – Schnell-Eingabe hat jetzt Dropdown zur Kategorie-Auswahl
- [x] **Skill Import: Auto-Create Categories** – Unbekannte Kategorie-IDs aus CSV/JSON werden automatisch als neue Kategorien angelegt
- [x] **Kanban als Default-Tab** – Kanban ist jetzt die Hauptansicht (erster Tab), Backlog wird zum zweiten Tab
- [x] **Mini-Backlog im Kanban** – Links im Kanban: Q1 (Dringend, ~80%) + Q2 (Säge schärfen, ~20%) mit Start-Button. Covey 80/20-Prinzip visuell sichtbar
- [x] **Kanban-Spalten Subtitles** – Universelle Zweitbeschreibung: Sammeln & Planen / Aktiv bearbeiten / Selbst prüfen / Fremd prüfen
- [x] **Hilfe: Farb-Code Erkläung** – Visuelle Demo-Karten für Quest-Typ-Farben, Fast Lane Doppelrahmen, Done-Markierung, Fälligkeits-Farben
- [x] **Hilfe: Kanban-Flow Erklärung** – Spalten-Erklärung mit Coding + Schul-Beispielen, Retrieval Practice Didaktik-Hinweis

**Dateien:** `questTypes.js`, `useQuestBoard.js` (Schema v9), `Header.jsx/.css`, `HelpPage.jsx/.css`, `TaskCard.css`, `SkillImportModal.jsx/.css`, `ImportModal.jsx`, `Kanban.jsx/.css`, `App.jsx`, `index.html`

---

## KURZFRISTIG (v2.0 – Gamification)

Umsetzung gemäß [Konzept v1.0](Quest_Skill_Projekt_Konzept_v1_0.md), Abschnitt 9.

### ✅ Block C: Kanban-Limits (Schema v7 → v8, Settings in State)

WIP-Limits und Wildcard-Tageslimit für fokussiertes Arbeiten.

- [x] **Schritt 4:** WIP-Limits auf Kanban-Spalten
- [x] **Schritt 5:** Wildcard-Limit (Tageszähler + Settings)

**Umgesetzt:** Schema v8 – `settings` Objekt mit `wipLimits` + `maxWildcardsPerDay`. Spalten-Header zeigt "2/3" Counter (rot wenn voll). Drag blockiert bei vollem Limit. Wildcard-Zähler im Header. SettingsModal für Konfiguration.

### ✅ Block D: Energie-Filter (rein UI, kein Schema-Change)

Setzt Block A (Quest-Typ) voraus.

- [x] **Schritt 8:** Energie-Filter im Backlog

**Umgesetzt:** Filter-Leiste ueber dem Eisenhower-Board mit Chips [Alle] [Code] [Learn] [Design] [Config] [Write]. Filtert Quadranten und Unsortiert-Bereich. Nur sichtbar wenn mindestens 1 Quest einen Typ hat. Toggle-Verhalten (nochmal klicken = zurueck zu Alle).

### Empfohlene Reihenfolge

```
✅ Block A (Quest-Typ + Duration)  ← DONE
✅ Block B (XP + Skill-Level)      ← DONE
✅ Block C (WIP + Wildcard-Limits) ← DONE
✅ Block D (Energie-Filter)        ← DONE
```

---

## ✅ ERLEDIGT (v3.0 Block A – RPG Dashboard im Skill-Tree)

Umgesetzt am 13.02.2026, Schema v9 → v10:

- [x] **Schema v10** – `showInDashboard` Flag auf Kategorien (max 6), Migration v9→v10, `toggleCategoryDashboard()` Funktion
- [x] **RPG_ATTRIBUTES** – `['STR', 'INT', 'DEX', 'WIS', 'CHA', 'CON']` in questTypes.js
- [x] **RadarChart (SVG)** – Spinnendiagramm (viewBox 400, RADIUS 145), N Achsen (1-6), Referenz-Polygone, Gradient-Fill Daten-Polygon, Icon + RPG-Kuerzel Labels auf weissem Kreis-Hintergrund, Edge Cases (1 Kat = Bar, 2 = Spiegel, 3-6 = N-gon)
- [x] **CharacterCard** – Gesamt Character-Level (Durchschnitt Kategorie-Staerken skaliert 0-5) + Total XP. Pro Kategorie: RPG-Name + Icon + Label + Attribut-Balken mit Level-Farbpalette (6 Stufen)
- [x] **RecentSkills** – Kuerzlich gelernte Skills (Woche + Monat), aggregiert pro Skill (Name, Level-Label, +XP, Datum), max 5 Eintraege
- [x] **RpgDashboard** – Container: berechnet categoryStrengths/totalLevel/totalXP, rendert RadarChart → CharacterCard → RecentSkills vertikal, sticky + scrollbar, Empty State
- [x] **SkillTree Layout-Umbau** – Done-Panels entfernt, Grid `1fr 420px` (Skills links, Dashboard rechts), Auge-Toggle (👁) auf Category-Header fuer showInDashboard
- [x] **Kategorie-Staerke** – `(levelSum / (skillCount * 5)) * 100`, 0-100% Skala
- [x] **Responsive** – `@media (max-width: 900px)` → 1 Spalte

**Dateien:** NEU: `RadarChart.jsx/.css`, `CharacterCard.jsx/.css`, `RecentSkills.jsx/.css`, `RpgDashboard.jsx/.css` (8 Dateien) + GEAENDERT: `skillsData.js`, `questTypes.js`, `useQuestBoard.js`, `SkillTree.jsx/.css`, `App.jsx`

---

## ✅ ERLEDIGT (v3.0 Block B – Personal Dashboard)

Umgesetzt am 13.02.2026, Schema v10 → v11:

- [x] **Schema v11** – `startedAt`/`completedAt` Timestamps auf Tasks, Migration backfill aus History
- [x] **PersonalDashboard** – Neuer Tab mit 3 Visualisierungen + useDashboardData Hook
- [x] **Heatmap** – GitHub-Contribution-Style, Zeilen: Tageszeiten (2h-Bloecke 04-00), Spalten: Wochentage (Mo-So), kompakte flache Zellen
- [x] **LineChart** – SVG-Liniendiagramm, Wochen/Monate Toggle, farbige Linien pro Quest-Typ + Gesamtlinie
- [x] **EnergyCurve** – Persoenliche Energiekurve aus echten Done-Daten (ab 04:00) + farbige Quest-Typ-Balken pro Zeitslot + Legende
- [x] **Dashboard-Layout** – Energiekurve oben (wichtigstes Chart), dann Fortschritt, dann Heatmap
- [x] **Scrollbar-Design** – 10px breit, kontrastreiche Farben (#9a9a8e), Firefox-Support
- [x] **Hilfe-Seite** – Callout-Box zur persoenlichen Energiekurve (Planung adaptieren)

**Dateien:** NEU: `PersonalDashboard.jsx/.css`, `Heatmap.jsx/.css`, `LineChart.jsx/.css`, `EnergyCurve.jsx/.css`, `useDashboardData.js` + GEAENDERT: `useQuestBoard.js`, `Header.jsx`, `HelpPage.jsx/.css`, `App.jsx`, `index.css`

---

## ✅ ERLEDIGT (v3.0 Block B.2 – Quest-Skill Linking + Demo-Daten)

Umgesetzt am 13.02.2026, Schema v11 → v12:

- [x] **Schema v12** – `linkedSkills: []` auf Tasks, `isDemo` Flag auf State
- [x] **Demo-Daten** – ~50 Beispiel-Quests beim ersten Start (generateDemoData()), gelber Banner, loeschbar ueber Banner oder Settings
- [x] **Quest-Skill Linking** – Klappbarer Skill-Picker im TaskModal (Kategorien + Checkbox-Grid)
- [x] **SkillCheckModal Vorauswahl** – linkedSkills werden als Vorauswahl gesetzt
- [x] **TaskCard Badge** – linkedSkills-Count Badge auf nicht-Done Karten
- [x] **DemoBanner** – Warmer gelber Banner mit "Eigene Daten starten" Button
- [x] **Settings Demo-Delete** – Roter "Demo-Daten loeschen" Button im SettingsModal
- [x] **clearDemoData()** – Loescht alle Tasks, behaelt Skills/Kategorien/Settings

**Dateien:** NEU: `demoData.js`, `DemoBanner.jsx/.css` + GEAENDERT: `useQuestBoard.js`, `useLocalStorage.js`, `TaskModal.jsx/.css`, `SkillCheckModal.jsx`, `TaskCard.jsx/.css`, `SettingsModal.jsx/.css`, `HelpPage.jsx`, `App.jsx`

---

## ✅ ERLEDIGT (v3.0 Block C – Kanban UX, Eisenhower Bugfix, Level-Klarheit)

Umgesetzt am 13.02.2026, Schema v12 → v13:

- [x] **Schema v13** – `fastLaneAt` Timestamp auf Tasks, Migration backfill aus History/startedAt
- [x] **Eisenhower Bug gefixt** – Unsortierte Quests nicht sichtbar wegen CSS flex-wrap + width-Constraint. Fix: flex-direction column + width 100% + max-height 300px + overflow-y auto
- [x] **Wildcard-Counter verschoben** – Aus Header entfernt, im Fast Lane Label: grosses "WILDCARD" + kleine Zeile "⚡ Fast Lane · 1/2"
- [x] **Wildcard-Zaehlung gefixt** – Zaehlt nach `fastLaneAt` statt `startedAt` (Tasks die gestern gestartet und heute in Fast Lane geschoben wurden, werden jetzt korrekt gezaehlt)
- [x] **WIP-Limits aus Fast Lane entfernt** – Fast Lane Spalten zeigen nur Task-Anzahl, kein Limit (da Wildcard-Tageslimit ohnehin begrenzt)
- [x] **Mini-Backlog als 2 separate Kaesten** – Q2 oben (gruene Borderlinie, Motivation "Investiere 20% in dich selbst") + Q1 unten (rote Borderlinie), Ratio-Bar am Ende
- [x] **CharacterCard Level-Erklaerung** – Hint "Durchschnitt deiner Kategorie-Staerken", Fortschrittsbalken fuer naechste 2 Ganzzahl-Level (z.B. Lv. 1.0 → 45%, Lv. 2.0 → 22%), Hebel-Tipp (schwaechste Kategorie = groesster Hebel)
- [x] **Level-Anzeige dynamisch** – Erreichte Ganzzahl-Level werden uebersprungen (bei Lv. 1.0 zeigt es → 2.0 und → 3.0)
- [x] **Hilfe-Seite Umbau** – Story-driven Layout mit klappbaren Sektionen + Sticky Sidebar TOC (vorheriger Commit)

**Dateien:** GEAENDERT: `Eisenhower.css`, `Header.jsx/.css`, `Kanban.jsx/.css`, `CharacterCard.jsx/.css`, `RpgDashboard.jsx`, `useQuestBoard.js`, `demoData.js`, `App.jsx`

---

## ✅ ERLEDIGT (v3.5 Block C – Projekte als Unlock-Ziele)

Umgesetzt am 13.02.2026, Schema v13 → v14:

- [x] **Schema v14** – `projects: []` im State, Migration v13→v14
- [x] **projectHelpers.js** – Pure computed Helpers: getProjectStatus (locked/ready/active/done), getProjectProgress, getProjectsForSkill, getRelevantQuests, PROJECT_STATUS_CONFIG
- [x] **Projekt-Datenmodell** – `{id, name, description, icon, requirements: [{skillId, requiredLevel}], status, createdAt, completedAt}`
- [x] **Project CRUD** – createProject, updateProject, deleteProject, toggleProjectStatus in useQuestBoard
- [x] **ProjectModal** – CRUD UI: Name, Beschreibung, Emoji-Picker, Requirements-Picker (Skill-Dropdown grouped by category + Level-Buttons 1-5 + met/unmet Indikator)
- [x] **ProjectCard** – Full mode (SkillTree) mit Icon + Name + Status-Badge + Progress-Bar + Requirement-Liste (met/unmet) + Compact mode (Dashboard) mit Icon + Name + Progress-Bar + "3/5 Skills"
- [x] **SkillTree** – Projekte-Sektion ueber Skill-Kategorien mit ProjectCard-Grid (auto-fill minmax 280px) + "+ Projekt" Button + Empty State
- [x] **PersonalDashboard** – "Projekt-Fortschritt" Sektion (vor Energiekurve) mit kompakten ProjectCard-Tiles
- [x] **SkillCheckModal** – Projekt-Impact: "Bringt dich naeher an: Projekt X (3/5 Skills)" + Spezial-Highlight wenn Projekt dadurch "ready" wird
- [x] **SkillModal** – "Wird benoetigt von:" Sektion (read-only, Projekt-Icon + Name + Lv.X benoetigt + met/unmet)
- [x] **RpgDashboard** – "Aktive Projekte" Liste unter CharacterCard mit Mini-Progress-Bars + Status-Farben
- [x] **Demo-Projekte** – 4 Beispiel-Projekte: "NeuroForge Quest Board" (done), "Eisenhower LITE" (active), "Identity Cards" (locked), "Automation Pipeline" (locked)
- [x] **Export/Import** – projects in exportData, restoreData, clearDemoData

**Dateien:** NEU: `projectHelpers.js`, `ProjectModal.jsx/.css`, `ProjectCard.jsx/.css` (6 Dateien) + GEAENDERT: `useQuestBoard.js`, `demoData.js`, `App.jsx`, `SkillTree.jsx`, `PersonalDashboard.jsx/.css`, `SkillCheckModal.jsx/.css`, `SkillModal.jsx/.css`, `RpgDashboard.jsx/.css`

---

## ✅ ERLEDIGT (v3.5 Block D – KI Setup Guide)

Umgesetzt am 13.02.2026, kein Schema-Change:

- [x] **Neuer Tab "KI Setup"** – Eigene Seite in der Hauptnavigation (Header: Kanban, Backlog, Skills, Dashboard, KI Setup, Hilfe)
- [x] **AiSetupGuide-Komponente** – 3-Schritte-Erklaerung (Prompt kopieren → KI fragen → JSON importieren), Prompt-Vorschau (collapsible), Tipps-Sektion
- [x] **KI-Prompt-Template** – Umfassendes Markdown-Anforderungsdokument in `aiPromptTemplate.js`: erklaert das NeuroForge-Datenmodell, JSON-Schema, Regeln fuer Categories/Skills/Projects/Tasks, Level-Schwellen, Qualitaetskriterien
- [x] **3 Beispiel-Vorlagen** – "Webentwicklung Einstieg", "KI & Prompting Basics", "Physik Klasse 10" (jeweils mit konkreter Lernziel-Beschreibung + erwarteten Stats)
- [x] **Prompt kopieren/herunterladen** – Clipboard-Copy + .md-Download, auch fuer Beispiel-Vorlagen (Prompt + Lernziel kombiniert)
- [x] **KI-JSON-Import** – Textarea + Datei-Upload, JSON-Validierung, Vorschau (Anzahl Categories/Skills/Projects/Tasks), SKILL_INDEX-Referenz-Aufloesung, Import in Board (importSkills + createProject + importTasks)
- [x] **Responsive Design** – Mobile-optimiert, prefers-reduced-motion Support

**Nachbesserungen (gleicher Block):**
- [x] **dueDate-Bug gefixt** – `handleAiImportJson` reichte dueDate nicht an importTasks durch. Gefixt: `dueDate: t.dueDate || null` im Task-Mapping
- [x] **Prompt-Template komplett ueberarbeitet** – Vollstaendige Feld-Tabellen fuer alle 4 Entitaeten (Categories 6 Felder, Skills 5, Projects 7, Tasks 8 inkl. dueDate), Eisenhower-Quadranten mit Covey-Erklaerung, Quest-Typ/Dauer/XP-Tabellen mit empfohlener Verteilung, Projekt-Progressionskurve, 9 Qualitaetskriterien, komplettes Mini-Beispiel (Git: 1 Kategorie, 3 Skills, 1 Projekt, 4 Quests mit dueDate)
- [x] **Hilfe-Seite** – Neue Sektion "KI Setup: Lernpfad generieren" (3-Schritte-Workflow, 4 generierte Entitaeten, 3 Beispiel-Vorlagen, Tipp-Callout)

**Dateien:** NEU: `AiSetupGuide.jsx/.css`, `aiPromptTemplate.js` (3 Dateien) + GEAENDERT: `Header.jsx`, `App.jsx`, `HelpPage.jsx`

---

## ✅ ERLEDIGT (v4.0 – Beautification)

Umgesetzt am 14.02.2026, kein Schema-Change:

- [x] **S-001: Vertikale Scrollbar entfernt** – html/body overflow:hidden, `.app` height:100vh overflow:hidden, `.app-main` als einziger Scroll-Container (overflow-y:auto, overflow-x:hidden, min-height:0)
- [x] **S-002: Horizontale Scrollbars gefixt** – Alle CSS Grid-Spalten von `1fr` auf `minmax(0, 1fr)` (verhindert implizites min-width:auto). Betrifft: Kanban (Layout + Row-Columns + Mini-Backlog), Eisenhower, SkillTree, HelpPage (6 Grids). Wrapper mit overflow-x:hidden. Projekt-Grid: `minmax(min(280px, 100%), 1fr)`
- [x] **S-003: Zentrales Breakpoint-System** – Mobile <640px, Tablet <1024px, Desktop >=1024px. Responsive Rules fuer: Header (Tabs icon-only, P3-Logo hidden, kompaktere Buttons), Eisenhower (1 Spalte), Kanban (3→2→1 Spalten), SkillTree (900px→1024px), HelpPage, PersonalDashboard, AiSetupGuide
- [x] **S-004: Settings-Button repositioniert** – Zahnrad von erster auf letzte Position im Header, eigene `.settings-btn` CSS-Klasse (subtil, dezent)
- [x] **S-005: Projekt-Anzeige konsistent** – SkillTree: aktive Projekte im Grid, abgeschlossene hinter klappbarem Toggle (default eingeklappt, 65% Opazitaet). `getProjectStatus()` konsistent verwendet

**Dateien:** GEAENDERT: `index.css`, `App.css`, `Header.jsx/.css`, `Eisenhower.css`, `Kanban.css`, `SkillTree.jsx/.css`, `ProjectCard.css`, `PersonalDashboard.css`, `HelpPage.css`, `AiSetupGuide.css`

---

## ✅ ERLEDIGT (v4.1 – Schmiede-Tab)

Umgesetzt am 14.02.2026, kein Schema-Change:

- [x] **Neuer Tab "Schmiede"** – Ersetzt "KI Setup" Tab, konsolidiert Import/Export/Wizard/KI-Flow in 4 Accordion-Sektionen (Progressive Disclosure)
- [x] **SchmiedePage** – Wrapper mit Hero-Header + AccordionSection (eine Sektion gleichzeitig offen)
- [x] **Sektion 1: Lerngebiet-Wizard** – 3-Schritt-Wizard: Kategorie waehlen oder neu erstellen (Emoji-Picker) → Skills definieren (Name + XP-Input mit Level-Badge) → Vorschau + Speichern
- [x] **Sektion 2: KI-Lernpfad** – Refactored AiSetupGuide: 3-Schritte-Erklaerung, Prompt kopieren/downloaden, 3 Beispiel-Vorlagen, JSON-Import. NEU: "Bestand fuer KI kopieren" (Markdown-Summary aktueller Categories/Skills/Projects in Clipboard). NEU: Demo-Daten-Warnung (gelber Banner wenn isDemo)
- [x] **Sektion 3: Quest-Import** – Schnell-Eingabe (1 Quest pro Zeile) + Datei-Upload (CSV/JSON) mit Spalten-Dokumentation und Inline-Preview. Extrahiert aus ImportModal
- [x] **Sektion 4: Backup & Restore** – Export (Statistiken + JSON-Download) + Restore (Datei-Upload + Merge-Warnung + Vorschau). Kombiniert ExportModal + ImportModal Restore-Tab
- [x] **8 alte Dateien geloescht** – ImportModal.jsx/.css, ExportModal.jsx/.css, SkillImportModal.jsx/.css, AiSetupGuide.jsx/.css
- [x] **Header bereinigt** – Import/Export-Buttons entfernt, nur "Neue Quest" + Settings bleiben
- [x] **SkillTree bereinigt** – "+ Neue Kategorie" und "Skills importieren" Buttons entfernt
- [x] **SkillModal Bug-Fix** – Create-Mode zeigt jetzt XP-Input (gleicher Code wie Edit-Mode), onSave sendet immer xpCurrent + level
- [x] **Wizard Doppel-Kategorie Bug-Fix** – React State Closure Problem: createCategory + importSkills lasen veralteten State. Loesung: importSkills auto-erstellt Kategorie, updateCategory setzt Icon/Label per Functional Updater (sieht neuesten State)

**Dateien:** NEU: `components/schmiede/` (SchmiedePage, LerngebietWizard, AiLernpfad, QuestImport, BackupRestore – je .jsx/.css = 10 Dateien) + GEAENDERT: `App.jsx`, `Header.jsx`, `SkillTree.jsx`, `SkillModal.jsx` + GELOESCHT: ImportModal, ExportModal, SkillImportModal, AiSetupGuide (je .jsx/.css = 8 Dateien)

---

## NAECHSTE SCHRITTE (v4.2+ – Migrationssicherheit & Intelligente Priorisierung)

### v4.2 – Migrations-Sicherheitsnetz

**Problem:** Das Migrationssystem (`migrateState()` in useQuestBoard.js) hat 14 Schema-Versionen erfolgreich migriert, aber es gibt kein Sicherheitsnetz: Wenn eine Migration fehlschlaegt, werden die alten Daten ueberschrieben. Mit scharfen Daten im System (keine Demo-Daten mehr) ist das ein reales Risiko – auch fuer zukuenftige Nutzer.

**Analyse der aktuellen Schwachstellen:**
- Kein Backup vor Migration – altes Schema wird sofort ueberschrieben
- Keine Validierung nach Migration – fehlerhafte Daten werden gespeichert
- Kein Rollback-Mechanismus – einzige Rettung waere manueller JSON-Export (wenn vorher gemacht)

**Geplante Massnahmen:**
- [ ] **Auto-Backup vor Migration** – `localStorage.setItem('questboard_backup_v{N}', ...)` bevor `migrateState` schreibt
- [ ] **Schema-Validierung** – `validateState(state)` Funktion prueft nach Migration alle Pflichtfelder und Datentypen
- [ ] **Notfall-Restore in Settings** – Button "Letztes Backup wiederherstellen" liest `questboard_backup_v{N}` aus localStorage
- [ ] **Fehlerbehandlung** – Wenn Migration oder Validierung fehlschlaegt: alten State behalten, User warnen, nicht ueberschreiben

**Voraussetzung fuer:** Schema v15 (Quest-Dependencies) und alle zukuenftigen Schema-Changes.

---

### v5.0 – Quest-Dependencies + Relevance Score

> **Referenzdokument:** [Relevance Score Regeln v1.0](2025_06_22_Relevance_Score_Regeln_v1_0.md)

**Kernidee:** Quests stehen oft in logischen Ketten (Quest 3 braucht Quest 1+2 zuerst). Die Dringlichkeit einer Quest ergibt sich nicht nur aus ihrem eigenen `dueDate`, sondern aus der gesamten Abhaengigkeitskette. Wenn Quest 3 am Freitag faellig ist und Quest 1+2 jeweils 45 Minuten brauchen, dann ist Quest 1 effektiv viel dringender als ihr eigenes Faelligkeitsdatum vermuten laesst.

**Was bereits vorhanden ist:**
- `dueDate` auf Tasks (seit Schema v3)
- `duration` auf Tasks: Sprint ~15min / Kurz ~30min / Lang ~45min (seit Schema v6)
- Eisenhower-Quadranten als Wichtigkeits-Proxy (Q1=dringend+wichtig bis Q4=unwichtig)
- Aktuelle Sortierung innerhalb der Quadranten: nur `a.order - b.order` (reine Drag-Reihenfolge, **keine Auto-Sortierung**)

**Was fehlt:**
- `dependsOn: [taskId, ...]` auf Tasks (analog zu `linkedSkills`) → **Schema v15**
- Relevance Score Berechnung (pure computed, kein Storage)
- Auto-Sort innerhalb der Quadranten nach Score
- Visuelles Dringlichkeits-Feedback (Countdown, Farbabstufungen)
- Blockiert-Indikator (Quest wartet auf Vorgaenger)
- Dependency-Picker im TaskModal

**Vereinfachte Score-Formel (adaptiert aus Referenzdokument):**
```
Verfuegbare_Zeit = dueDate - (heute + eigene_duration + SUM(abhaengige_durations))
Prioritaets_Faktor = Quadrant-Gewicht (Q1=6, Q2=4, Q3=3, Q4=1)

Ueberfaellig:  Score = Prioritaets_Faktor x 100
Noch Zeit:     Score = MAX(1, (7 - Tage_Rest)) x Prioritaets_Faktor
```

**localStorage-Last:** Minimal. `dependsOn` ist nur ein kleines Array von IDs pro Task. Der Score wird live berechnet, nicht gespeichert.

**Geplante Bloecke:**
- [ ] **Block A: Sicherheitsnetz** – Auto-Backup + Validierung (v4.2, siehe oben)
- [ ] **Block B: Schema v15** – `dependsOn: []` auf Tasks + Migration + Dependency-Picker im TaskModal
- [ ] **Block C: Relevance Score** – `relevanceScore.js` Helper + Auto-Sort in Eisenhower-Quadranten + visuelles Feedback
- [ ] **Block D: Blockiert-Logik** – Ausgegraut/Ketten-Symbol fuer Quests deren Vorgaenger nicht erledigt sind

---

## MITTELFRISTIG (v3.5+ – Projekte & Vorlagen)

### Block C: Projekte & KI
- [x] **Schritt 6:** Projekte als Unlock-Ziele im Skill-Tree (v3.5 Block C)
- [x] **Schritt 7:** KI-Import-Template (Prompt + JSON-Schema) (v3.5 Block D)

### Block D: Vorlagen-System
- [ ] **Skill-Set Templates** – Vordefinierte Vorlagen ("Softwareentwicklung", "Physik Klasse 10", "Sprachen lernen" etc.)
- [ ] **Template-Auswahl** – Bei erstem Start oder ueber Settings waehlbar
- [ ] **Community Templates** – Spaeter: Templates teilen/importieren

### Block E: "Schmiede"-Tab (Import/Export Konsolidierung)

Umgesetzt am 14.02.2026 – siehe Abschnitt "ERLEDIGT (v4.1)" weiter oben.

### Sonstiges
- [ ] Browser-Testing & Feinschliff

### Datenbank statt localStorage

**Problem:** Daten liegen nur im Browser. Bei Browser-Wechsel, Geraetewechsel oder Datenverlust sind die Daten weg (nur Export/Import als Backup).

**Status:** Bewusst aufgeschoben – localStorage reicht fuer Single-User. Datenbank-Migration ist selbst ein **Projekt im System** (Skills: `be-01` Supabase Setup, `be-02` SQL Grundlagen).

**Entscheidung:** Wenn das Gamification-System stabil laeuft und du das Board oeffnen willst → Supabase als Lernprojekt. Der Skill "Datenbank" wird dabei natuerlich im eigenen Quest Board getrackt.

---

## LANGFRISTIG (Ideen)

### Kalender-Integration (Outlook / Google Calendar)

> **Ursprungsidee:** Offene Quests automatisch in freie Kalender-Slots einplanen. Bei Nicht-Erledigung werden alle Quests nach Dringlichkeit (Relevance Score) automatisch nach hinten verschoben.

**Voraussetzungen:**
- Datenbank (Supabase) – fuer Server-seitige Logik
- OAuth-Anbindung an Google Calendar / Microsoft Graph API
- Relevance Score + Quest-Dependencies (v5.0) als Intelligenz fuer den Auto-Scheduler
- Rescheduling-Logik: Wenn Quest nicht abgeschlossen → gesamte Abhaengigkeitskette zeitlich verschieben

**Status:** Vision. Die Dependencies + Relevance Score (v5.0) sind die direkte Vorarbeit – wenn die Dringlichkeitsberechnung sauber im Frontend laeuft, hat ein spaeterer Kalender-Scheduler bereits die noetige Intelligenz.

### Covey Wochenarbeitsblatt

> **Referenzdokument:** [Covey Wochenarbeitsblatt Konzept v1.0](2025_09_06_Covey_Wochenarbeitsblatt_Konzept_v1_0.md)

**Was bereits umgesetzt ist:**
- Saege schaerfen (Q2, 20%) → Mini-Backlog im Kanban
- 80/20 Prinzip → Covey-Ratio-Bar
- Skill-Kategorien → aehneln "beruflichen Rollen"

**Was fehlen wuerde fuer vollstaendige Umsetzung:**
- Rollen als Lebensbereich-Konzept (Vater, Coach, Selbstfuersorge ≠ Skill-Kategorien) → neues Datenmodell
- Wochenplanung-View mit Zeitbloecken → neue Komponente
- Wochenziele pro Rolle → neue Verknuepfungen

**Entscheidung (15.02.2026):** Zurueckgestellt. Das Rollen-Konzept ist ein komplett neues Paradigma das ueber Skill-Kategorien hinausgeht. Passt besser in eine Phase mit Datenbank, eventuell kombiniert mit der Kalender-Integration.

### Weitere Ideen
- [ ] PWA mit Offline-Support (Service Worker)
- [ ] Mobile App via Capacitor
- [ ] Erweiterte Analytics (Burndown Charts, Velocity, Skill-Wachstum ueber Zeit)
- [ ] Benachrichtigungen bei ueberfaelligen Tasks
- [ ] Dark Mode
- [ ] Coaching-Modus (Skill-Sets fuer Klienten zuweisen)

---

## ENTSCHEIDUNGSLOG

| Datum | Entscheidung | Begründung |
|-------|-------------|-----------|
| 11.02.2026 | MVP mit localStorage | Schneller Start, kein Backend nötig |
| 11.02.2026 | Schema-Versionierung | Zukunftssicher für Datenmodell-Änderungen |
| 11.02.2026 | Export/Import als Backup | Überbrückung bis DB-Lösung steht |
| 11.02.2026 | Neurodivergenz-UI Guidelines | HSP/ADHS-optimiertes Design als Grundprinzip |
| 12.02.2026 | Skills Hybrid-Ansatz (Option C) | Manuelles Hinzufügen von Skills + Kategorien in der App |
| 12.02.2026 | 3 neue DevOps Skills | DNS, SSL, FTP Deployment als predefined Skills |
| 12.02.2026 | BUG-001 dokumentiert | Restore überschreibt predefined Skills statt zu mergen |
| **12.02.2026** | **Modell 3 (Hybrid-System)** | **Quest-Skill-Projekt Abgrenzung definiert. XP-Level statt binär. Single-User. Quest 30-45min. Konzept v1.0 erstellt.** |
| **12.02.2026** | **DB bewusst aufgeschoben** | **localStorage reicht für Single-User. DB-Migration wird eigenes Projekt im System (Meta-Level).** |
| **12.02.2026** | **Kanban-Spalten beibehalten** | **5 Spalten (Vorbereiten→Entwickeln→Testing Intern→Testing Extern→Done) sind gebaut und passen für Software-Quests.** |
| **12.02.2026** | **v1.5 Skill-Editor shipped** | **BUG-001 gefixt, Skill-Editor + Custom Categories, Schema v5. Predefined Skills ausblendbar, Custom Skills löschbar, Emoji-Picker für Kategorien.** |
| **12.02.2026** | **Gamification in 4 Blöcke aufgeteilt** | **A: Quest-Typ+Duration → B: XP+Level → C: WIP+Wildcards → D: Energie-Filter. Jeweils eigene Schema-Migration.** |
| **12.02.2026** | **Block A shipped** | **Quest-Typ (5 Typen) + Duration auf Tasks. Schema v6. Farbiger Top-Border + Badges auf TaskCard. Browser-getestet.** |
| **12.02.2026** | **Block B shipped** | **XP-System (30/50/80) + Skill-Level 0-5 (Locked→Master). Schema v7. Sterne + XP-Progress im SkillTree. Level-Up Preview im SkillCheckModal. Browser-getestet.** |
| **13.02.2026** | **Block C shipped** | **WIP-Limits auf Kanban-Spalten + Wildcard-Tageslimit. Schema v8. SettingsModal fuer Konfiguration. Drag-Blockade bei vollem Limit.** |
| **13.02.2026** | **Block D shipped** | **Energie-Filter im Backlog. Quest-Typ Chips ueber dem Eisenhower-Board. Kein Schema-Change. v2.0 Gamification komplett.** |
| **13.02.2026** | **v2.1 QoL shipped** | **6 Verbesserungen: Modal-Scroll Fix, Skill XP/Level editierbar, Task-Import Spaltendoku, Skill-Import Modal, Hilfe-Seite (Neurodivergenz), importSkills() Funktion. Kein Schema-Change.** |
| **13.02.2026** | **Rebrand zu NeuroForge** | **"NeuroForge – Deine Quest-Schmiede" statt "Quest Board". Emotionaler Name, neurodivergent-proud.** |
| **13.02.2026** | **Quest-Typen universalisiert** | **Code→Focus, Learn→Input, Design→Create, Config→Routine, Write→Reflect. Energie-Level funktionieren jetzt für jeden Kontext (Coding, Schule, Sprachen etc.).** |
| **13.02.2026** | **v2.5 shipped** | **NeuroForge Rebrand, universelle Quest-Typen (Schema v9), 15-Min Sprint, Hilfe-Seite mit Energie-SVG + Schul-Beispiel, Skill Import: Kategorie-Dropdown + Auto-Create, Kanban als Default + Mini-Backlog (Covey 80/20), Farb-Code + Kanban-Flow Hilfe, Spalten-Subtitles.** |
| **13.02.2026** | **Kanban als Hauptansicht** | **Fokus-Prinzip: Kanban zeigt die aktive Arbeit. Backlog (Q1+Q2) links sichtbar, kein Tab-Wechsel nötig. Covey: ~80% Q1 dringende Arbeit + ~20% Q2 Säge schärfen.** |
| **13.02.2026** | **v3.0 Block A shipped** | **RPG Dashboard im Skill-Tree: Radar-Chart (SVG), CharacterCard (STR/INT/DEX/WIS/CHA/CON), RecentSkills. Schema v10 (showInDashboard). Done-Panels ersetzt. Skills links, Dashboard rechts (Lesefluss).** |
| **13.02.2026** | **v3.0 Block B shipped** | **Personal Dashboard Tab: Heatmap (GitHub-Style), LineChart (Quest-Typen ueber Zeit), EnergyCurve (persoenlich aus Daten). Schema v11 (startedAt/completedAt Timestamps).** |
| **13.02.2026** | **v3.0 Block B.2 shipped** | **Quest-Skill Linking + Demo-Daten. Schema v12 (linkedSkills, isDemo). ~50 Beispiel-Quests beim ersten Start. Skill-Picker im TaskModal. Vorauswahl im SkillCheckModal. DemoBanner + Settings Demo-Delete.** |
| **13.02.2026** | **Demo-Daten Strategie** | **Erster Start laedt automatisch ~50 realistische Quests (40 done + 10 aktiv). Dashboard sofort nutzbar. Loeschbar ueber Banner oder Settings. Export enthaelt nie isDemo=true.** |
| **13.02.2026** | **v3.0 Block C shipped** | **Kanban UX ueberarbeitet: Wildcard-Counter in Fast Lane Label, WIP-Limits nur im Normal Flow, Mini-Backlog als 2 Kaesten (Q2 oben/Q1 unten). Eisenhower unsorted Bug gefixt. CharacterCard mit Level-Erklaerung + dynamischen naechsten Levels + Hebel-Tipp. Schema v13 (fastLaneAt).** |
| **13.02.2026** | **Wildcard-Zaehlung Bugfix** | **getWildcardsUsedToday zaehlte nach startedAt (Kanban-Eintritt) statt Fast-Lane-Eintritt. Neues Feld fastLaneAt korrigiert die Tageszaehlung.** |
| **13.02.2026** | **Projekte: Ansatz A (rein computed)** | **Projekte definieren Skill-Requirements, Status (locked/ready/active/done) wird rein computed. Kein projectId auf Quests. Fortschritt = wie viele Required Skills das Required Level erreicht haben.** |
| **13.02.2026** | **v3.5 Block C shipped** | **Projekte als Unlock-Ziele: ProjectModal mit Requirements-Picker, ProjectCard (Full + Compact), Integration in SkillTree + Dashboard + SkillCheckModal + SkillModal + RpgDashboard. Schema v14 (projects Array). 4 Demo-Projekte.** |
| **13.02.2026** | **v3.5 Block D shipped** | **KI Setup Guide: Neuer Tab mit Prompt-Template (Markdown), 3 Beispiel-Vorlagen (Webdev, KI, Physik), JSON-Import mit SKILL_INDEX-Aufloesung. User kann jeden Lernpfad per KI generieren lassen.** |
| **13.02.2026** | **Prompt-Template ueberarbeitet** | **Kritischer Review: dueDate fehlte, Kontext zu klein fuer zuverlaessige KI-Generierung. Komplett neu geschrieben mit vollstaendigen Feld-Tabellen, Verteilungsempfehlungen, Mini-Beispiel. Hilfe-Seite um KI-Setup-Sektion erweitert.** |
| **14.02.2026** | **v4.0 Beautification shipped** | **5 Schoenheitsfehler gefixt: Scrollbars (vertikal+horizontal), zentrales Breakpoint-System (Mobile/Tablet/Desktop), Settings-Button Repositionierung, konsistente Projekt-Anzeige mit Done-Toggle.** |
| **14.02.2026** | **minmax(0,1fr) Pattern** | **`1fr` hat implizites `min-width:auto` – Kinder koennen Grid-Spalten ueber deren Breite hinaus ausdehnen. Fix: `minmax(0,1fr)` erlaubt Schrumpfen auf 0. Alle Grids umgestellt.** |
| **14.02.2026** | **Schmiede-Tab Konzept** | **Import/Export/KI-Setup in 5 verschiedenen Stellen verstreut → konsolidiert in einem einzigen "Schmiede"-Tab mit 4 Sektionen: Manueller Wizard (1 Kategorie + Skills), KI-Flow (mit Bestands-Export), Quest-Import, Backup & Restore. Ersetzt KI-Setup-Tab + ImportModal + ExportModal + SkillImportModal.** |
| **14.02.2026** | **v4.1 Schmiede-Tab shipped** | **4 Accordion-Sektionen (Progressive Disclosure), 10 neue Dateien in components/schmiede/, 8 alte Dateien geloescht, Header + SkillTree bereinigt. SkillModal Create-Mode XP-Bug gefixt. Wizard Doppel-Kategorie Bug (React State Closure) geloest.** |
| **14.02.2026** | **React State Closure Lesson** | **createCategory() + importSkills() nacheinander aufrufen fuehrt zu Duplikaten: importSkills liest categories aus Closure (alter State ohne neue Kategorie) und auto-erstellt Duplikat. Loesung: Nur importSkills aufrufen (auto-create), dann updateCategory mit Functional Updater fuer Icon/Label.** |
| **15.02.2026** | **Relevance Score Konzept evaluiert** | **Referenzdokument (Juni 2025, Airtable) analysiert. Kernidee passt zu NeuroForge: Quest-Dependencies (`dependsOn`) + Duration-Ketten ermoeglichen automatische Dringlichkeitsberechnung. Score ist rein computed (kein Storage), nur `dependsOn: []` als neues Feld noetig (Schema v15). Vereinfachte Formel: dueDate minus Chain-Duration, gewichtet nach Eisenhower-Quadrant.** |
| **15.02.2026** | **Covey Wochenarbeitsblatt zurueckgestellt** | **Referenzdokument (Sep 2025) analysiert. 80/20 + Saege-schaerfen bereits im Mini-Backlog umgesetzt. Volles Rollen-Konzept (Lebensrollen ≠ Skill-Kategorien) + Wochenplanung + Zeitbloecke waere neues Paradigma → benoetigt Datenbank. Spaeter evtl. kombiniert mit Kalender-Integration.** |
| **15.02.2026** | **Migrations-Sicherheitsnetz priorisiert** | **Analyse des aktuellen Migrationssystems: 14 Versionen erfolgreich, aber kein Backup vor Migration, keine Validierung, kein Rollback. Mit scharfen Daten (keine Demo mehr) und zukuenftigen Nutzern ist das ein reales Risiko. Auto-Backup + Schema-Validierung + Notfall-Restore als Block v4.2 VOR Schema v15 geplant.** |
| **15.02.2026** | **Kalender-Integration als Vision** | **Idee: Offene Quests automatisch in Outlook/Google Calendar Slots einplanen, bei Nicht-Erledigung nach Dringlichkeit verschieben. Benoetigt DB + OAuth + Server-Logik. Dependencies + Relevance Score (v5.0) sind die direkte Vorarbeit dafuer.** |
| **15.02.2026** | **Aktuelle Sortierung: nur Drag-Order** | **Festgestellt: Tasks innerhalb der Eisenhower-Quadranten werden nur nach `a.order - b.order` sortiert (Drag-Reihenfolge). Keinerlei automatische Sortierung nach dueDate oder Dringlichkeit. Relevance Score wuerde das aendern.** |

---

*Diese Datei wird bei Strategiediskussionen und Planungsaenderungen aktualisiert.*
