# ROADMAP: NeuroForge
## Wohin geht die Reise?

**Zuletzt aktualisiert:** 15. Februar 2026

---

## Referenz-Dokumente

| Dokument | Inhalt |
|----------|--------|
| [Quest-Skill-Projekt Konzept v1.0](Quest_Skill_Projekt_Konzept_v1_0.md) | Hybrid-System, XP, Level, Quest-Typen, WIP, Fast Lane, Intake-Flow |
| [Relevance Score Regeln v1.0](2025_06_22_Relevance_Score_Regeln_v1_0.md) | Priorisierungsformel (Airtable-Ursprung, adaptiert fuer v5.0) |
| [Covey Wochenarbeitsblatt v1.0](2025_09_06_Covey_Wochenarbeitsblatt_Konzept_v1_0.md) | Wochenplanung (teilweise in Mini-Backlog umgesetzt, Rest zurueckgestellt) |
| [Neurodivergenz UI Guidelines](2025_12_25_Neurodivergenz_UI_Guidelines_v1_0.md) | HSP/ADHS-optimiertes Design |

---

## NAECHSTE SCHRITTE

### v4.2 – Migrations-Sicherheitsnetz

**Problem:** `migrateState()` hat 14 Schema-Versionen erfolgreich migriert, aber kein Sicherheitsnetz. Bei einem Bug in der Migration werden scharfe Daten unwiderruflich ueberschrieben.

**Geplante Massnahmen:**
- [ ] **Auto-Backup vor Migration** – `localStorage.setItem('questboard_backup_v{N}', ...)` bevor migrateState schreibt
- [ ] **Schema-Validierung** – `validateState(state)` prueft nach Migration alle Pflichtfelder und Datentypen
- [ ] **Notfall-Restore in Settings** – Button "Letztes Backup wiederherstellen"
- [ ] **Fehlerbehandlung** – Bei Fehler: alten State behalten, User warnen, nicht ueberschreiben

**Voraussetzung fuer:** Schema v15 und alle zukuenftigen Schema-Changes.

---

### v5.0 – Quest-Dependencies + Relevance Score

> **Referenz:** [Relevance Score Regeln v1.0](2025_06_22_Relevance_Score_Regeln_v1_0.md)

**Kernidee:** Quests stehen oft in logischen Ketten (Quest 3 braucht Quest 1+2 zuerst). Die Dringlichkeit ergibt sich aus der gesamten Abhaengigkeitskette, nicht nur dem eigenen dueDate.

**Vorhandene Daten:** `dueDate`, `duration` (Sprint/Kurz/Lang), Eisenhower-Quadranten.
**Aktuell:** Tasks innerhalb der Quadranten werden nur nach Drag-Reihenfolge sortiert (keine Auto-Sortierung).

**Was fehlt:**
- `dependsOn: [taskId, ...]` auf Tasks → **Schema v15**
- Relevance Score Berechnung (pure computed, kein Storage)
- Auto-Sort innerhalb der Quadranten nach Score
- Visuelles Dringlichkeits-Feedback + Blockiert-Indikator
- Dependency-Picker im TaskModal

**Vereinfachte Score-Formel:**
```
Verfuegbare_Zeit = dueDate - (heute + eigene_duration + SUM(abhaengige_durations))
Prioritaets_Faktor = Quadrant-Gewicht (Q1=6, Q2=4, Q3=3, Q4=1)

Ueberfaellig:  Score = Prioritaets_Faktor x 100
Noch Zeit:     Score = MAX(1, (7 - Tage_Rest)) x Prioritaets_Faktor
```

**Geplante Bloecke:**
- [ ] **Block A:** Sicherheitsnetz (v4.2, siehe oben)
- [ ] **Block B:** Schema v15 – `dependsOn: []` + Migration + Dependency-Picker
- [ ] **Block C:** Relevance Score – `relevanceScore.js` + Auto-Sort + visuelles Feedback
- [ ] **Block D:** Blockiert-Logik – Ausgegraut/Ketten-Symbol fuer wartende Quests

---

## MITTELFRISTIG

### Vorlagen-System
- [ ] **Skill-Set Templates** – Vordefinierte Vorlagen ("Softwareentwicklung", "Physik Klasse 10", "Sprachen lernen" etc.)
- [ ] **Template-Auswahl** – Bei erstem Start oder ueber Settings waehlbar
- [ ] **Community Templates** – Templates teilen/importieren

### Browser-Testing & Feinschliff
- [ ] Systematischer Cross-Browser-Test

### Datenbank statt localStorage

**Problem:** Daten nur im Browser. Bei Browser-/Geraetewechsel oder Datenverlust sind die Daten weg.

**Status:** Bewusst aufgeschoben – localStorage reicht fuer Single-User.

**Entscheidung:** Wenn das System stabil laeuft und fuer mehrere Nutzer geoeffnet werden soll → Supabase als Lernprojekt.

---

## LANGFRISTIG

### Kalender-Integration (Outlook / Google Calendar)

Offene Quests automatisch in freie Kalender-Slots einplanen. Bei Nicht-Erledigung nach Dringlichkeit (Relevance Score) verschieben.

**Voraussetzungen:** Datenbank, OAuth, Server-Logik. Dependencies + Relevance Score (v5.0) sind die Vorarbeit.

### Covey Wochenarbeitsblatt

> **Referenz:** [Covey Wochenarbeitsblatt v1.0](2025_09_06_Covey_Wochenarbeitsblatt_Konzept_v1_0.md)

80/20 + Saege-schaerfen bereits im Mini-Backlog umgesetzt. Volles Rollen-Konzept (Lebensrollen ≠ Skill-Kategorien) + Wochenplanung benoetigt Datenbank. Evtl. kombiniert mit Kalender-Integration.

### Weitere Ideen
- [ ] PWA mit Offline-Support (Service Worker)
- [ ] Mobile App via Capacitor
- [ ] Erweiterte Analytics (Burndown Charts, Velocity, Skill-Wachstum ueber Zeit)
- [ ] Benachrichtigungen bei ueberfaelligen Tasks
- [ ] Dark Mode
- [ ] Coaching-Modus (Skill-Sets fuer Klienten zuweisen)

---

## ENTSCHEIDUNGSLOG

| Datum | Entscheidung | Begruendung |
|-------|-------------|-------------|
| 11.02 | MVP mit localStorage | Schneller Start, kein Backend noetig |
| 11.02 | Schema-Versionierung | Zukunftssicher fuer Datenmodell-Aenderungen |
| 11.02 | Export/Import als Backup | Ueberbrueckung bis DB-Loesung steht |
| 11.02 | Neurodivergenz-UI Guidelines | HSP/ADHS-optimiertes Design als Grundprinzip |
| 12.02 | Modell 3 (Hybrid-System) | Quest-Skill-Projekt Abgrenzung. XP-Level statt binaer. Single-User. Konzept v1.0 |
| 12.02 | DB bewusst aufgeschoben | localStorage reicht fuer Single-User. DB-Migration wird eigenes Projekt |
| 12.02 | Gamification in 4 Bloecke | A: Quest-Typ+Duration → B: XP+Level → C: WIP+Wildcards → D: Energie-Filter |
| 13.02 | Kanban als Hauptansicht | Fokus-Prinzip: Kanban zeigt aktive Arbeit. Covey 80/20 im Mini-Backlog |
| 13.02 | Quest-Typen universalisiert | Code→Focus, Learn→Input, Design→Create, Config→Routine, Write→Reflect |
| 13.02 | Projekte: rein computed | Status (locked/ready/active/done) aus Skill-Leveln berechnet, kein projectId auf Quests |
| 13.02 | Demo-Daten Strategie | ~50 realistische Quests beim ersten Start. Dashboard sofort nutzbar. Loeschbar |
| 14.02 | minmax(0,1fr) Pattern | `1fr` hat implizites min-width:auto. Fix: `minmax(0,1fr)` erlaubt Schrumpfen auf 0 |
| 14.02 | Schmiede-Tab Konsolidierung | Import/Export/KI-Setup in 5 Stellen → ein Tab mit 4 Accordion-Sektionen |
| 14.02 | React State Closure Lesson | Funktionale Updater statt sequentielle Calls bei abhaengigen State-Updates |
| 15.02 | Relevance Score Konzept | Dependencies + Duration-Ketten fuer automatische Dringlichkeit. Score ist computed, nur `dependsOn` neu |
| 15.02 | Covey Wochenblatt zurueckgestellt | Rollen-Konzept ≠ Skill-Kategorien. Benoetigt Datenbank. 80/20 bereits umgesetzt |
| 15.02 | Migrations-Sicherheitsnetz priorisiert | Kein Backup/Validierung/Rollback bei Migration. Mit scharfen Daten ein reales Risiko |
| 15.02 | Kalender-Integration als Vision | Auto-Scheduling in Outlook/Google. Dependencies + Score sind Vorarbeit |
| 15.02 | KI-Template: nur 1 Projekt | 2-4 Projekte ueberfordern bei Neurodivergenz. 1 klares Ziel motiviert besser |
| 15.02 | Docs-Struktur bereinigt | CLAUDE.md=Regeln, STATE=Gegenwart, ROADMAP=Zukunft+Log, Git=Historie. Keine Redundanz |

---

*Diese Datei wird bei Strategiediskussionen und Planungsaenderungen aktualisiert.*
