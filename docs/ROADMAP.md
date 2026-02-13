# ROADMAP: NeuroForge
## Wohin geht die Reise?

**Zuletzt aktualisiert:** 13. Februar 2026

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

## MITTELFRISTIG (v3.5+ – Projekte & Vorlagen)

### Block C: Projekte & KI
- [ ] **Schritt 6:** Projekte als Unlock-Ziele im Skill-Tree
- [ ] **Schritt 7:** KI-Import-Template (Prompt + JSON-Schema)

### Block D: Vorlagen-System
- [ ] **Skill-Set Templates** – Vordefinierte Vorlagen ("Softwareentwicklung", "Physik Klasse 10", "Sprachen lernen" etc.)
- [ ] **Template-Auswahl** – Bei erstem Start oder ueber Settings waehlbar
- [ ] **Community Templates** – Spaeter: Templates teilen/importieren

### Sonstiges
- [ ] Browser-Testing & Feinschliff

### Datenbank statt localStorage

**Problem:** Daten liegen nur im Browser. Bei Browser-Wechsel, Gerätewechsel oder Datenverlust sind die Daten weg (nur Export/Import als Backup).

**Status:** Bewusst aufgeschoben – localStorage reicht für Single-User. Datenbank-Migration ist selbst ein **Projekt im System** (Skills: `be-01` Supabase Setup, `be-02` SQL Grundlagen).

**Entscheidung:** Wenn das Gamification-System stabil läuft und du das Board öffnen willst → Supabase als Lernprojekt. Der Skill "Datenbank" wird dabei natürlich im eigenen Quest Board getrackt. 🔄

---

## LANGFRISTIG (Ideen)

- [ ] PWA mit Offline-Support (Service Worker)
- [ ] Mobile App via Capacitor
- [ ] Erweiterte Analytics (Burndown Charts, Velocity, Skill-Wachstum über Zeit)
- [ ] Benachrichtigungen bei überfälligen Tasks
- [ ] Dark Mode
- [ ] Coaching-Modus (Skill-Sets für Klienten zuweisen)

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

---

*Diese Datei wird bei Strategiediskussionen und Planungsänderungen aktualisiert.*
