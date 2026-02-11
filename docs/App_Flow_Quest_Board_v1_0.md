# 📱 APP FLOW: Quest Board v1.0

**Version:** 1.0  
**Datum:** 11. Februar 2026  
**Verknüpft mit:** PRD_Quest_Board_v1_0.md

---

## 1. ÜBERSICHT

### 1.1 App-Typ
- [ ] Single-Page App
- [x] Multi-Page App (3 Tab-Ansichten)
- [ ] Dashboard
- [ ] Wizard

### 1.2 Einstiegspunkt
→ Eisenhower-Ansicht (Backlog)

### 1.3 Hauptziel des Users
→ Tasks priorisieren, bearbeiten, und dabei Skills tracken

---

## 2. SCREEN-ÜBERSICHT

| # | Screen | Zweck | Erreichbar über |
|---|--------|-------|-----------------|
| 1 | **Eisenhower** | Backlog – alle ungestarteten Tasks in 4 Quadranten | Tab-Navigation |
| 2 | **Kanban** | Execution – aktive Tasks im Flow | Tab-Navigation |
| 3 | **Skills** | Fortschritt – Skill-Tree mit Status | Tab-Navigation |
| M1 | **Task-Modal** | Task erstellen/bearbeiten | [+] Button oder Karte klicken |
| M2 | **Skill-Check-Modal** | Skills zuordnen bei "Done" | Automatisch bei Done-Drop |
| M3 | **Lösch-Bestätigung** | Task löschen bestätigen | Löschen-Button auf Karte |

---

## 3. NAVIGATION

### 3.1 Tab-Leiste (fest oben)

```
┌─────────────────────────────────────────────────────────────┐
│  ⚔️ Quest Board        [📋 Backlog] [🏃 Kanban] [🌳 Skills] │
└─────────────────────────────────────────────────────────────┘
```

- Aktiver Tab: Hervorgehoben (P3 Red underline)
- Immer sichtbar
- [+ Neue Quest] Button rechts in der Leiste (immer erreichbar)

### 3.2 Keine Zurück-Navigation nötig
Alle Screens sind über Tabs erreichbar, keine verschachtelten Views.

---

## 4. SCREEN-DETAILS

### 4.1 EISENHOWER (Backlog)

```
┌─────────────────────────────────────────────────────────────┐
│  ⚔️ Quest Board        [📋 Backlog] [🏃 Kanban] [🌳 Skills]  [+ Neue Quest] │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│   🔴 Q1: SOFORT ERLEDIGEN   │   🟢 Q2: EINPLANEN          │
│   (dringend & wichtig)       │   (wichtig, nicht dringend)  │
│                              │                              │
│   ┌──────────────────┐      │   ┌──────────────────┐      │
│   │ Task-Karte       │      │   │ Task-Karte       │      │
│   │ Titel            │      │   │ Titel            │      │
│   │ [Starten] [···]  │      │   │ [Starten] [···]  │      │
│   └──────────────────┘      │   └──────────────────┘      │
│                              │                              │
├──────────────────────────────┼──────────────────────────────┤
│                              │                              │
│   🟡 Q3: DELEGIEREN         │   ⚪ Q4: ELIMINIEREN         │
│   (dringend, nicht wichtig)  │   (weder noch)              │
│                              │                              │
│   ┌──────────────────┐      │                              │
│   │ Task-Karte       │      │                              │
│   │ Titel            │      │                              │
│   │ [Starten] [···]  │      │                              │
│   └──────────────────┘      │                              │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

**Interaktionen auf diesem Screen:**

| Aktion | Trigger | Ergebnis |
|--------|---------|----------|
| Task verschieben | Drag & Drop Karte | Karte wechselt Quadrant |
| Task starten | [Starten] Button | Karte verschwindet → erscheint in Kanban "Vorbereiten" |
| Task bearbeiten | Klick auf Karte oder [···] | Task-Modal öffnet sich |
| Neue Task | [+ Neue Quest] | Task-Modal öffnet sich (leer) |
| Task löschen | [···] → Löschen | Lösch-Bestätigung Modal |

**Empty State:**
Wenn Eisenhower leer → "Keine Quests im Backlog. Erstelle eine neue Quest! [+ Neue Quest]"

---

### 4.2 KANBAN (Execution)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚔️ Quest Board        [📋 Backlog] [🏃 Kanban] [🌳 Skills]  [+ Neue Quest] │
├──────────────────────┬──────────────────────┬───────────────────────────┤
│                      │                      │                           │
│   📁 VORBEREITEN     │   ⚡ DOING           │   🎉 DONE                │
│                      │                      │                           │
│   ╔═══════════════╗  │                      │   ┌──────────────────┐   │
│   ║ ⚡ FAST LANE  ║  │   ╔═══════════════╗  │   │ Erledigte Quest  │   │
│   ║ Dringender    ║  │   ║ ⚡ FAST LANE  ║  │   │ ✅ 3 Skills      │   │
│   ║ Task!         ║  │   ║ ...           ║  │   └──────────────────┘   │
│   ╚═══════════════╝  │   ╚═══════════════╝  │                           │
│                      │                      │   ┌──────────────────┐   │
│   ┌──────────────┐   │   ┌──────────────┐   │   │ Erledigte Quest  │   │
│   │ Normaler     │   │   │ Normaler     │   │   │ ✅ 2 Skills      │   │
│   │ Task         │   │   │ Task         │   │   └──────────────────┘   │
│   └──────────────┘   │   └──────────────┘   │                           │
│                      │                      │                           │
└──────────────────────┴──────────────────────┴───────────────────────────┘
```

**Interaktionen auf diesem Screen:**

| Aktion | Trigger | Ergebnis |
|--------|---------|----------|
| Task verschieben | Drag & Drop | Karte wechselt Spalte |
| Fast Lane toggle | ⚡-Icon auf Karte | Karte wird Fast Lane (oben, hervorgehoben) |
| Task auf Done | Drop in Done-Spalte | Skill-Check-Modal öffnet sich |
| Task bearbeiten | Klick auf Karte | Task-Modal |
| Task zurück zu Eisenhower | [···] → "Zurück zum Backlog" | Karte verschwindet → zurück in Eisenhower |

**Spalten-Regeln:**
- Fast Lane Tasks stehen IMMER oben in jeder Spalte
- Fast Lane hat visuell einen auffälligen Rahmen (doppelt, P3 Red)
- Done-Spalte zeigt Anzahl zugeordneter Skills pro Karte

**Empty State:**
"Keine aktiven Quests. Wähle Tasks aus dem Backlog! [→ Zum Backlog]"

---

### 4.3 SKILLS (Skill-Tree)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚔️ Quest Board        [📋 Backlog] [🏃 Kanban] [🌳 Skills]  [+ Neue Quest] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   🌳 SKILL-TREE                               Gesamt: 12/35 (34%)     │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ 🎨 FRONTEND                                    4/8  ████░░ │      │
│   │                                                             │      │
│   │   ✅ React Grundlagen          (P3 Craving Log)           │      │
│   │   ✅ Vite Build System         (P3 Craving Log)           │      │
│   │   ✅ Component Architecture    (P3 Craving Log)           │      │
│   │   ✅ P3 Design System          (P3 Craving Log)           │      │
│   │   ⬜ Drag & Drop (dnd-kit)                                │      │
│   │   ⬜ State Management (Context/Zustand)                   │      │
│   │   ⬜ Responsive Layout                                     │      │
│   │   ⬜ Tailwind CSS                                          │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ 🔧 DEVOPS & TOOLS                             5/7  █████░ │      │
│   │                                                             │      │
│   │   ✅ Git & GitHub              (alle Projekte)             │      │
│   │   ✅ Capacitor APK Build       (P3 Craving Log)           │      │
│   │   ✅ Claude Code CLI           (Reise-Planer)             │      │
│   │   ✅ GitHub Actions CI/CD      (Reise-Planer)             │      │
│   │   ✅ GitHub Pages Deploy       (Reise-Planer)             │      │
│   │   ⬜ Testing (Unit/Integration)                            │      │
│   │   ⬜ Performance Optimization                              │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   (weitere Kategorien...)                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Interaktionen auf diesem Screen:**

| Aktion | Trigger | Ergebnis |
|--------|---------|----------|
| Kategorie auf/zuklappen | Klick auf Kategorie-Header | Toggle Collapse |
| Skill-Details | Klick auf einzelnen Skill | Zeigt: welche Tasks diesen Skill gelehrt haben |
| Skill hinzufügen | [+ Skill hinzufügen] Button | Neuen Skill zu Kategorie hinzufügen |

**Empty State (pro Kategorie):**
Wenn keine Skills gelernt: Fortschrittsbalken bei 0%, alle Skills ⬜

---

## 5. MODALE (Overlays)

### 5.1 Task-Modal (Erstellen/Bearbeiten)

```
┌─────────────────────────────────────────┐
│  Neue Quest                         [X] │
├─────────────────────────────────────────┤
│                                         │
│  Titel: [________________________]      │
│                                         │
│  Beschreibung (optional):               │
│  [________________________________]     │
│  [________________________________]     │
│                                         │
│  Quadrant:                              │
│  (●) Q1: Sofort erledigen              │
│  ( ) Q2: Einplanen                      │
│  ( ) Q3: Delegieren                     │
│  ( ) Q4: Eliminieren                    │
│                                         │
│              [Abbrechen] [Speichern]    │
│                                         │
└─────────────────────────────────────────┘
```

- Titel hat Auto-Focus
- Enter = Speichern
- Escape = Abbrechen
- Bei Bearbeiten: Felder vorausgefüllt + [Löschen] Button sichtbar

### 5.2 Skill-Check-Modal (bei Done)

```
┌─────────────────────────────────────────┐
│  🎉 Quest abgeschlossen!           [X] │
│  "PRD für Quest Board schreiben"        │
├─────────────────────────────────────────┤
│                                         │
│  Was hast du dabei gelernt?             │
│                                         │
│  🎨 Frontend:                           │
│  [ ] React Grundlagen                   │
│  [ ] Drag & Drop (dnd-kit)             │
│  [ ] Component Architecture             │
│                                         │
│  🔧 DevOps:                             │
│  [ ] GitHub Pages Deploy                │
│  [✓] Claude Code CLI                   │
│                                         │
│  📐 Architektur:                        │
│  [✓] Anforderungsanalyse (PRD)         │
│  [ ] App-Architektur                    │
│                                         │
│  (nur relevante Kategorien zeigen)      │
│                                         │
│         [Überspringen] [Speichern 🎉]  │
│                                         │
└─────────────────────────────────────────┘
```

- Bereits gelernte Skills sind ausgegraut (schon ✅)
- "Überspringen" speichert Done ohne Skill-Zuordnung
- Konfetti/Feedback bei Speichern (Dopamin!)

### 5.3 Lösch-Bestätigung

```
┌─────────────────────────────────────────┐
│  Quest löschen?                     [X] │
├─────────────────────────────────────────┤
│                                         │
│  "Task-Titel" wird unwiderruflich       │
│  gelöscht.                              │
│                                         │
│              [Abbrechen] [Löschen]      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. DRAG & DROP DETAILS

### 6.1 Eisenhower Drag & Drop

| Was | Wohin | Ergebnis |
|-----|-------|----------|
| Karte | Anderer Quadrant | Quadrant-Zuordnung ändert sich |
| Karte | Kanban-Bereich | Nicht möglich (nur via [Starten] Button) |

**Visuelles Feedback:**
- Beim Greifen: Karte wird leicht angehoben (Schatten)
- Beim Ziehen: Platzhalter (gestrichelter Rahmen) am Ursprungsort
- Über Drop-Zone: Ziel-Quadrant leuchtet leicht auf
- Drop: Karte animiert an neue Position

### 6.2 Kanban Drag & Drop

| Was | Wohin | Ergebnis |
|-----|-------|----------|
| Karte | Andere Spalte | Status ändert sich |
| Karte | Done-Spalte | Skill-Check-Modal öffnet sich |
| Karte | Innerhalb Spalte | Reihenfolge ändert sich |

**Einschränkungen:**
- Kein Rückwärts-Drag von Done → Doing (Task ist abgeschlossen)
- Karte kann aber über [···] Menü "reaktiviert" werden

---

## 7. ZUSTÄNDE (STATES)

### 7.1 Loading
- Beim ersten Laden: localStorage wird gelesen
- Dauer: <100ms → kein Spinner nötig

### 7.2 Empty States
| Screen | Bedingung | Anzeige |
|--------|-----------|---------|
| Eisenhower | Keine Tasks | "Starte deine erste Quest!" + [+] Button |
| Kanban | Keine aktiven Tasks | "Wähle Quests aus dem Backlog!" + Link |
| Skills | Keine Skills gelernt | "Schließe Quests ab um Skills zu sammeln!" |

### 7.3 Error States
- localStorage voll: Warnung + Hinweis alte Done-Tasks zu löschen
- Drag fehlschlägt: Karte springt zurück an Ursprungsposition

---

## 8. TASK-KARTE DESIGN

```
┌──────────────────────────────────┐
│ ⚡ Task-Titel                [···]│  ← ⚡ nur bei Fast Lane
│ Optionale Beschreibung (1 Zeile) │
│                                  │
│ [Starten →]          vor 2 Tagen │  ← [Starten] nur in Eisenhower
└──────────────────────────────────┘
```

- Karte hat leichten Schatten (Elevation)
- Fast Lane: Doppelter Rahmen in P3 Red
- Done-Karten: Leicht transparent, Skills-Count Badge
- Hover: Leichte Vergrößerung (Scale 1.02)

---

*Nächstes Dokument: Skill_Matrix_v1_0.md*
