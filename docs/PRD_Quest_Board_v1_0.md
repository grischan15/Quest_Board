# 📋 PRD: Quest Board v1.0
## Eisenhower-Kanban mit Skill-Tracking

**Version:** 1.0  
**Datum:** 11. Februar 2026  
**Status:** Approved  
**Track:** C (Task-Management) + A (Lern-App)

---

## 1. EXECUTIVE SUMMARY

- **Problem:** Chris nutzt ein physisches Board (Post-its) für Privates – funktioniert. Aber berufliche Tasks haben keinen Platz, und der Überblick über gelernte Skills geht in 15+ Markdown-Dateien verloren.
- **Lösung:** Digitales Quest Board das Eisenhower (Backlog) + Kanban (Execution) + Skill-Tree (Fortschritt) kombiniert.
- **Zielgruppe:** Chris selbst – ein User, berufliche Tasks, Web am Desktop.
- **USP:** Eisenhower ist nicht parallel zum Kanban sondern der BACKLOG. Karte verlässt Eisenhower wenn sie ins Kanban wandert. Bei "Done" werden Skills getracked.

---

## 2. DER FLOW

```
NEUER TASK
    ↓
EISENHOWER (= Backlog)
    4 Quadranten: Dringend/Wichtig Matrix
    Tasks leben hier bis sie ausgewählt werden
    ↓ (User wählt Task aus → "Starten")
    ↓ (Task VERSCHWINDET aus Eisenhower)
    ↓
KANBAN (= Execution)
    Vorbereiten → Doing → Done 🎉
    + FAST LANE (überholt alles, visuell hervorgehoben)
    ↓ (bei "Done")
    ↓
SKILL-CHECK (Modal)
    "Was hast du dabei gelernt?"
    → Skills aus vordefinierter Liste auswählen
    → Skill-Tree wird aktualisiert
```

---

## 3. FUNKTIONALE ANFORDERUNGEN

### 3.1 MVP (Must-Have) – Stufe 1

| ID | Feature | Beschreibung |
|----|---------|--------------|
| F01 | **Eisenhower-Ansicht** | 4 Quadranten-Grid, Tasks als Karten darin |
| F02 | **Task erstellen** | Titel, optionale Beschreibung, Quadrant wählen |
| F03 | **Drag & Drop Eisenhower** | Karten zwischen Quadranten verschieben |
| F04 | **Task starten** | Button/Aktion: Karte wandert von Eisenhower → Kanban "Vorbereiten" |
| F05 | **Kanban-Ansicht** | 3 Spalten: Vorbereiten, Doing, Done |
| F06 | **Drag & Drop Kanban** | Karten zwischen Spalten verschieben |
| F07 | **Fast Lane** | Markierung auf Karte → wird visuell hervorgehoben, steht oben in jeder Spalte |
| F08 | **Done → Skill-Check** | Wenn Karte auf "Done": Modal mit Skill-Auswahl |
| F09 | **Skill-Tree Ansicht** | Übersicht aller Skills, Status (gelernt/offen), welches Projekt |
| F10 | **Navigation** | Tab-Leiste: Eisenhower | Kanban | Skills |
| F11 | **Persistenz** | localStorage – Daten bleiben nach Browser-Reload |
| F12 | **Task bearbeiten** | Titel, Beschreibung, Quadrant ändern |
| F13 | **Task löschen** | Mit Bestätigung |

### 3.2 Nice-to-Have (Stufe 2+, NICHT in V1)

| ID | Feature | Stufe |
|----|---------|-------|
| F20 | Projekt-Zuordnung (Karte gehört zu Projekt X) | 2 |
| F21 | Projekt-Fortschritts-Ansicht | 2 |
| F22 | Farb-Kategorien für Projekte | 2 |
| F23 | Supabase Backend (Multi-Device Sync) | 3 |
| F24 | n8n Integration | 4 |
| F25 | Skill-Matrix erweitern (neue Skills hinzufügen) | 2 |
| F26 | Archiv-Ansicht (erledigte Tasks durchsuchen) | 2 |
| F27 | Statistiken (Tasks pro Woche, Skills gelernt) | 3 |

---

## 4. NICHT-FUNKTIONALE ANFORDERUNGEN

| Anforderung | Zielwert |
|-------------|----------|
| Ladezeit | < 2 Sekunden |
| Offline-fähig | Ja (localStorage, kein Backend) |
| Mobile-First | Nein – Desktop-First (große Bildschirme) |
| Datenschutz | Nur lokal, keine Daten an Server |
| Browser | Chrome/Edge (Chromium) |

---

## 5. TECHNISCHE SPEZIFIKATION

### 5.1 Tech-Stack

| Komponente | Tool | Version/Info |
|------------|------|-------------|
| **Build** | Vite | Latest |
| **Frontend** | React | Latest |
| **Drag & Drop** | dnd-kit | @dnd-kit/core + @dnd-kit/sortable |
| **Styling** | CSS Modules oder Tailwind | TBD bei Implementierung |
| **Persistenz** | localStorage | JSON serialisiert |
| **Deploy** | GitHub Pages | GitHub Actions CI/CD |
| **Dev-Tool** | Claude Code CLI | Weg B |

### 5.2 Datenmodell (localStorage)

```javascript
// Haupt-Datenstruktur in localStorage
{
  "questboard": {
    "tasks": [
      {
        "id": "uuid-string",
        "title": "PRD für Quest Board schreiben",
        "description": "Alle Anforderungen dokumentieren",  // optional
        "location": "eisenhower",       // "eisenhower" | "kanban"
        "quadrant": "q1",              // "q1" | "q2" | "q3" | "q4" (wenn Eisenhower)
        "kanbanColumn": null,          // "prepare" | "doing" | "done" (wenn Kanban)
        "fastLane": false,             // true = Fast Lane aktiv
        "skillsLearned": [],           // IDs aus Skill-Matrix (nur bei done)
        "createdAt": "2026-02-11T10:00:00Z",
        "startedAt": null,             // Zeitpunkt Eisenhower → Kanban
        "completedAt": null,           // Zeitpunkt → Done
        "order": 0                     // Sortierung innerhalb Container
      }
    ],
    "skills": [
      // Wird aus Skill_Matrix_v1_0.md initial befüllt
      // Siehe separates Dokument
    ]
  }
}
```

### 5.3 Kein Backend

V1 braucht kein Backend. Begründung:
- Ein User (Chris)
- Ein Gerät (Desktop)
- Keine Sync-Anforderung
- localStorage ist ausreichend und sofort verfügbar

Migration zu Supabase in Stufe 3 geplant (siehe 100_further_steps/).

---

## 6. DESIGN-ANFORDERUNGEN

### 6.1 Corporate Design
- **Farben:** P3 Red `#c60a0f`, P3 Blue `#25313a`, P3 Beige `#d5d4c7`
- **Font:** Avenir (system-ui Fallback)
- **Shared Components:** P3Button, P3Modal aus bestehender Library

### 6.2 Neurodivergenz-UI
- Klare visuelle Trennung der Bereiche
- Keine überladenen Screens
- Fast Lane visuell DEUTLICH hervorgehoben (Farbe + Position)
- "Done" Spalte mit Erfolgs-Feedback (Dopamin!)
- Drag & Drop mit klarem visuellem Feedback (wohin kann ich droppen?)

### 6.3 Quadranten-Farben (Eisenhower)

| Quadrant | Label | Farbe |
|----------|-------|-------|
| Q1 | Dringend & Wichtig | Rot-Akzent `#c60a0f` |
| Q2 | Wichtig, nicht dringend | Grün `#2d8a4e` |
| Q3 | Dringend, nicht wichtig | Gelb/Orange `#e6a817` |
| Q4 | Weder noch | Grau `#8a8a8a` |

### 6.4 Layout (Desktop-First)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Quest Board          [Eisenhower] [Kanban] [Skills] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  (Inhalt je nach aktiver Ansicht)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. USER STORIES

**Story 1: Task erfassen**
> Als User möchte ich schnell einen neuen Task in einen Eisenhower-Quadranten eintragen, damit ich ihn nicht vergesse.

Akzeptanzkriterien:
- [ ] Klick auf [+ Neue Aufgabe] öffnet Modal
- [ ] Nur Titel ist Pflichtfeld
- [ ] Quadrant ist wählbar (Default: Q1)
- [ ] Nach Speichern erscheint Karte im gewählten Quadranten

**Story 2: Task priorisieren**
> Als User möchte ich Tasks per Drag & Drop zwischen Quadranten verschieben, damit ich sie umpriorisieren kann.

Akzeptanzkriterien:
- [ ] Karte ist draggable
- [ ] Visuelles Feedback beim Ziehen (Schatten, Platzhalter)
- [ ] Drop in anderem Quadranten aktualisiert die Zuordnung
- [ ] Änderung wird sofort in localStorage gespeichert

**Story 3: Task starten**
> Als User möchte ich einen Task aus der Eisenhower-Matrix ins Kanban übernehmen, damit ich ihn aktiv bearbeite.

Akzeptanzkriterien:
- [ ] Button "Starten" auf der Karte oder Drag in Kanban-Bereich
- [ ] Karte verschwindet aus Eisenhower
- [ ] Karte erscheint in Kanban "Vorbereiten"
- [ ] Zeitstempel "startedAt" wird gesetzt

**Story 4: Fast Lane**
> Als User möchte ich einen Task als "Fast Lane" markieren, damit er alle anderen überholt.

Akzeptanzkriterien:
- [ ] Toggle auf der Karte (Blitz-Icon oder ähnlich)
- [ ] Fast Lane Tasks stehen OBEN in ihrer Spalte
- [ ] Visuell deutlich hervorgehoben (Rahmen, Farbe, Icon)

**Story 5: Task abschließen + Skills tracken**
> Als User möchte ich beim Abschließen angeben was ich gelernt habe, damit mein Skill-Tree wächst.

Akzeptanzkriterien:
- [ ] Wenn Karte auf "Done" gezogen wird: Modal öffnet sich
- [ ] Vordefinierte Skill-Liste mit Checkboxen
- [ ] Ausgewählte Skills werden dem Task UND dem Skill-Tree zugeordnet
- [ ] Erfolgs-Feedback ("🎉 Quest abgeschlossen!")

**Story 6: Skill-Tree ansehen**
> Als User möchte ich meinen Fortschritt sehen – welche Skills ich habe und woher sie kommen.

Akzeptanzkriterien:
- [ ] Eigene Ansicht/Tab "Skills"
- [ ] Skills gruppiert nach Kategorie
- [ ] Jeder Skill zeigt: Name, Status (gelernt/offen), durch welche(n) Task(s)
- [ ] Fortschrittsanzeige pro Kategorie

---

## 8. RISIKEN & OFFENE FRAGEN

| Risiko | Wahrscheinlichkeit | Maßnahme |
|--------|-------------------|----------|
| Drag & Drop komplex (dnd-kit Lernkurve) | Mittel | Einfach starten, erstmal nur Kanban D&D |
| localStorage-Limit (5-10MB) | Niedrig | Für einen User mit <1000 Tasks kein Problem |
| Scope Creep (Projekt-Zuordnung zu früh) | Hoch | Strikt bei V1 Scope bleiben! |
| ADHS: Quest Board bauen statt Quests erledigen | Mittel | V1 in max. 5 Tagen fertig haben |

---

## 9. ABGRENZUNG: Was V1 NICHT ist

- Kein Multi-User System
- Kein Backend/Datenbank
- Kein Mobile-optimiertes Layout
- Keine Projekt-Verwaltung
- Keine Automatisierung (n8n)
- Keine Kalender-Integration
- Kein Import/Export

---

## 10. ERFOLGS-METRIK

V1 ist erfolgreich wenn:
1. Chris nutzt es tatsächlich für berufliche Tasks (statt Post-its)
2. Skill-Tree zeigt akkurat was er kann
3. Deployment auf GitHub Pages funktioniert
4. Bau-Zeit: maximal 5 Arbeitstage

---

*Nächstes Dokument: App_Flow_Quest_Board_v1_0.md*
