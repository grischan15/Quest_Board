# Quest-Skill-Projekt System: Konzept v1.0

**Datum:** 12. Februar 2026  
**Status:** Konzept – bereit zur inkrementellen Umsetzung  
**Kontext:** Hybrid-Modell (Modell 3) für neurodivergenz-optimiertes Task-Management

---

## Überblick: Drei Entitäten, drei Views

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│   QUEST BOARD    │────▶│  SKILL TREE  │────▶│  PROJEKTE    │
│  (Daily View)    │     │  (Progress)  │     │  (Unlock)    │
│                  │     │              │     │              │
│ ☐ Quest A  50XP │     │ React ████░░ │     │ 🔓 QuestBoard│
│ ☐ Quest B  30XP │     │ CSS   ██░░░░ │     │ 🔒 ValueSync │
│ ✅ Quest C 80XP │     │ Build █████░ │     │ 🔒 Identity  │
└─────────────────┘     └──────────────┘     └──────────────┘
```

**Kernprinzip:** Jede Ansicht hat genau EINEN Zweck:
- Quest Board = **Aktion** (Was mache ich jetzt?)
- Skill Tree = **Reflexion** (Was kann ich schon?)
- Projekte = **Motivation** (Was wird dadurch möglich?)

**Single User:** Das System ist für eine Person designed. Kein Multi-User, kein Sharing.

---

## 1. QUEST (Atom-Einheit)

> **Definition:** Eine konkrete, abgeschlossene Handlung mit messbarem Ergebnis.

### Abgrenzungstest – Ist es ein Quest?

- ✅ Hat ein klares "Done"-Kriterium (ja/nein)
- ✅ Dauert **30 min bis max 45 min**
- ✅ Ergebnis ist sichtbar (Code, Dokument, gelerntes Konzept)
- ✅ Eine Person kann es alleine erledigen
- ❌ Wenn es länger als 45 min dauert → aufteilen in Sub-Quests
- ❌ Wenn es kürzer als 30 min dauert → zu klein für Tracking, zusammenfassen
- ❌ Wenn es kein konkretes Ergebnis hat → es ist eine Notiz, kein Quest

### Quest-Datenmodell

| Feld | Typ | Beschreibung | Beispiel |
|------|-----|-------------|----------|
| `id` | string | UUID | `uuid-v4` |
| `title` | string | Was genau tun | "useState Hook in Counter-App einbauen" |
| `description` | string | Details, Done-Kriterium | "Counter mit +/- Buttons, State persists" |
| `questType` | enum | Energie-Kategorie | `code` / `learn` / `design` / `config` / `write` |
| `xp` | number | Belohnung | 30 / 50 / 80 |
| `quadrant` | enum | Eisenhower | `q1` / `q2` / `q3` / `q4` |
| `skillTags` | string[] | Welche Skills profitieren | `["fe-06", "arch-05"]` |
| `duration` | enum | Zeitschätzung | `short` (30min) / `long` (45min) |
| `location` | enum | Wo lebt es | `eisenhower` / `kanban` |
| `kanbanColumn` | string | Kanban-Spalte | `prepare` / `develop` / ... |
| `fastLane` | boolean | Wildcard? | `true` / `false` |
| `dueDate` | date | Fälligkeitsdatum | `2026-02-15` |
| `createdAt` | datetime | Erstellt | ISO timestamp |
| `startedAt` | datetime | Gestartet | ISO timestamp |
| `completedAt` | datetime | Abgeschlossen | ISO timestamp |
| `history` | array | Audit Trail | `[{action, from, to, timestamp}]` |

### Quest-Typen (Energie-Level)

| Typ | Key | Icon | Farbe | Wann wählen |
|-----|-----|------|-------|-------------|
| Code | `code` | ⚡ | Blau `#2196F3` | Hohe Energie, klarer Kopf |
| Learn | `learn` | 📖 | Grün `#4CAF50` | Mittlere Energie, Input-Modus |
| Design | `design` | 🎨 | Lila `#9C27B0` | Kreative Energie |
| Config | `config` | 🔧 | Orange `#FF9800` | Niedrige Energie, mechanisch |
| Write | `write` | ✍️ | Türkis `#00BCD4` | Ruhige Energie, reflektiv |

### XP-Werte (3 feste Stufen)

```
30 XP = Rezeptiv   (lesen, anschauen, verstehen)
50 XP = Reproduktiv (nachbauen, anwenden mit Vorlage)
80 XP = Produktiv   (selbst erstellen, eigene Lösung)
```

---

## 2. SKILL (Fähigkeit)

> **Definition:** Eine erlernbare Kompetenz, die durch abgeschlossene Quests wächst.
> Ein Skill ist NIEMALS eine Aufgabe.

### Abgrenzungstest – Ist es ein Skill?

- ✅ Kann man "besser werden" darin (hat Level)
- ✅ Wird durch mehrere Quests trainiert
- ✅ Ist übertragbar auf verschiedene Projekte
- ✅ Lässt sich als Substantiv formulieren ("React State Management")
- ❌ Wenn es nur einmal gebraucht wird → es ist ein Quest
- ❌ Wenn es ein Ergebnis beschreibt → es ist ein Projekt
- ❌ Wenn es ein Verb ist ("App deployen") → es ist ein Quest

### Skill-Datenmodell (erweitert)

| Feld | Typ | Beschreibung | Beispiel |
|------|-----|-------------|----------|
| `id` | string | Skill-ID | `fe-06` |
| `name` | string | Die Fähigkeit | "React State Management" |
| `category` | string | Skill-Baum-Ast | `frontend` / `backend` / `devops` / ... |
| `categoryLabel` | string | Anzeigename | "Frontend" |
| `level` | number | Aktuelles Level 0-5 | `2` |
| `xpCurrent` | number | Gesammelte XP | `180` |
| `learnedFrom` | string[] | Quest-IDs die beigetragen haben | `["quest-uuid-1", ...]` |
| `predefined` | boolean | Aus skillsData.js | `true` |
| `createdAt` | datetime | Erstellt | ISO timestamp |

### Level-System

```
Level 0 ░░░░░ Locked      (0 XP)       = Noch nicht berührt
Level 1 ⭐     Novice      (1-100 XP)    ~2-3 Quests   ≈ 1-2 Tage
Level 2 ⭐⭐    Apprentice  (100-250 XP)  ~3-5 Quests   ≈ 1 Woche
Level 3 ⭐⭐⭐   Journeyman  (250-500 XP)  ~5-8 Quests   ≈ 2-3 Wochen
Level 4 ⭐⭐⭐⭐  Expert      (500-800 XP)  ~6-10 Quests  ≈ 1-2 Monate
Level 5 ⭐⭐⭐⭐⭐ Master      (800+ XP)     ~10+ Quests   ≈ 3+ Monate
```

### Level-Berechnung

```javascript
function getLevel(xp) {
  if (xp >= 800) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  if (xp >= 1) return 1;
  return 0;
}

function getXpForNextLevel(level) {
  const thresholds = [1, 100, 250, 500, 800];
  return level >= 5 ? null : thresholds[level];
}
```

### Migration bestehender Skills

Bei der Umstellung von binär (`open`/`learned`) auf Level-System:

```
status: 'learned' → level: 3, xpCurrent: 250 (Journeyman = selbständig anwenden)
status: 'open'    → level: 0, xpCurrent: 0   (Locked)
```

---

## 3. PROJEKT (Ergebnis)

> **Definition:** Ein konkretes Endprodukt, das mehrere Skills auf bestimmtem Level voraussetzt.

### Abgrenzungstest – Ist es ein Projekt?

- ✅ Hat ein lieferbares Endprodukt (App, Buch, System)
- ✅ Braucht mehrere verschiedene Skills
- ✅ Hat einen "Release"-Moment
- ✅ Existiert unabhängig von dir (andere können es nutzen)
- ❌ Wenn es kein Endprodukt hat → es ist ein Skill
- ❌ Wenn es in 45 min erledigt ist → es ist ein Quest
- ❌ Wenn nur du es nutzt zum Lernen → es ist eine Skill-Übung (Quest)

### Projekt-Datenmodell

| Feld | Typ | Beschreibung | Beispiel |
|------|-----|-------------|----------|
| `id` | string | Projekt-ID | `proj-01` |
| `name` | string | Das Endprodukt | "Eisenhower-Matrix LITE App" |
| `track` | enum | Welcher Track | `A` / `B` / `C` |
| `requirements` | array | Skill + Level Anforderungen | `[{skillId: "fe-06", requiredLevel: 3}]` |
| `status` | enum | Unlock-Status | `locked` / `ready` / `active` / `done` |
| `createdAt` | datetime | Erstellt | ISO timestamp |
| `completedAt` | datetime | Abgeschlossen | ISO timestamp |

### Projekt-Unlock-Logik

```javascript
function getProjectStatus(project, skills) {
  const fulfilled = project.requirements.every(req => {
    const skill = skills.find(s => s.id === req.skillId);
    return skill && skill.level >= req.requiredLevel;
  });
  if (project.completedAt) return 'done';
  if (project.status === 'active') return 'active';
  if (fulfilled) return 'ready'; // 🔓 Unlocked!
  return 'locked'; // 🔒
}

function getProjectProgress(project, skills) {
  const total = project.requirements.length;
  const met = project.requirements.filter(req => {
    const skill = skills.find(s => s.id === req.skillId);
    return skill && skill.level >= req.requiredLevel;
  }).length;
  return { met, total, percent: Math.round((met / total) * 100) };
}
```

### Projekte im UI

Projekte leben NICHT als eigener Tab, sondern als **Unlock-Leiste im Skill-Tree Tab**:

```
┌──────────────────────────────────────────────────────┐
│  PROJEKTE                                             │
│  🔓 Quest Board v2    🔒 Eisenhower App (3/5 Skills)  │
│  ████████████ 100%    ██████░░░░░░ 60%               │
│                                                       │
│  🔒 Identity Cards (1/4 Skills)  🔒 ValueSync (0/8)  │
│  ██░░░░░░░░░░ 25%               ░░░░░░░░░░░ 0%      │
└──────────────────────────────────────────────────────┘
│                                                       │
│  SKILL TREE (bestehender View)                        │
│  ...                                                  │
```

---

## 4. Zusammenfassung der Abgrenzung

| | Quest | Skill | Projekt |
|---|---|---|---|
| **Was ist es?** | Eine Aufgabe | Eine Fähigkeit | Ein Endprodukt |
| **Zeitrahmen** | 30-45 min | Wochen – Monate | Wochen – Monate |
| **Kardinalität** | Viele (50-200+) | Mittel (15-40) | Wenige (5-10) |
| **Wer sieht es?** | Du, täglich | Du, wöchentlich | Du + andere |
| **Verb** | "Tun" | "Können" | "Haben/Liefern" |
| **Test-Frage** | "Kann ich es in 45min anfangen UND abschließen?" | "Bin ich darin besser geworden?" | "Kann jemand anderes das benutzen?" |
| **Wo lebt es?** | Backlog + Kanban | Skill Tree | Skill Tree (oben) |
| **Wächst durch** | Erledigen | Quest-XP sammeln | Skills unlocken |

---

## 5. Kanban: WIP-limitiert

### Spalten (beibehalten wie v1.0)

| Spalte | WIP-Limit | Zweck |
|--------|-----------|-------|
| Vorbereiten | max 3 | Quest vorbereiten, Material sammeln |
| Entwickeln | max 2 | Aktive Arbeit |
| Testing Intern | max 2 | Selbst testen |
| Testing Extern | max 2 | Von anderem Gerät/Browser testen |
| Done | ∞ | Abgeschlossen, gruppiert nach Zeit |

### WIP-Limit Enforcement

```
Spalte voll? → Kein neues Quest kann rein
Visuell:      Spalten-Header zeigt "2/2" in Rot wenn voll
Ausnahme:     Fast Lane hat eigene Limits (siehe unten)
```

---

## 6. Fast Lane (Wildcard)

> **Für den ADHS-Moment: "Das will ich JETZT machen!"**

### Regeln

| Regel | Wert | Konfigurierbar? |
|-------|------|----------------|
| Gleichzeitig in Fast Lane | max 1 Quest | Nein (fix) |
| Wildcards pro Tag | Default: 2 | Ja (1-5, in Settings) |
| Zeitlimit pro Wildcard | = Quest-Duration (30 oder 45 min) | Nein (automatisch) |
| Zeitlimit überschritten | → Automatisch zurück in Backlog | Nein (fix) |
| Wildcard-Quest braucht | Quest-Format (Done-Kriterium, Typ, XP, Skill-Tag) | Nein (fix) |

### UI-Elemente

```
Header: ⚡ 1/2 Wildcards heute
Fast Lane Bereich: Timer-Anzeige wenn Quest aktiv
Settings-Page: Slider "Max Wildcards pro Tag" (1-5)
```

### Tagesreset

```javascript
// Wildcards-Zähler resettet um Mitternacht
function getWildcardsUsedToday(tasks) {
  const today = new Date().toDateString();
  return tasks.filter(t =>
    t.fastLane &&
    t.startedAt &&
    new Date(t.startedAt).toDateString() === today
  ).length;
}
```

---

## 7. Backlog: Eisenhower + Energie-Filter

### Bestehend (beibehalten)

4 Quadranten: Q1 (Dringend+Wichtig), Q2 (Wichtig), Q3 (Dringend), Q4 (Weder noch)

### Neu: Energie-Filter

Filter-Leiste über dem Eisenhower-Board:

```
[Alle ▼] [⚡ Code] [📖 Learn] [🎨 Design] [🔧 Config] [✍️ Write]
```

Bei Klick auf einen Quest-Typ werden nur Quests dieses Typs angezeigt. Hilft bei: "Ich hab wenig Energie, was kann ich trotzdem machen?" → Filter auf 🔧 Config.

---

## 8. Intake-Flow: Neue Idee einpflegen

### Entscheidungsbaum

```
💡 "Ich habe eine Idee!"
     │
     ▼
Ist es ein ERGEBNIS das andere nutzen können?
     │
  JA ──► PROJEKT anlegen
     │     └─► Skills identifizieren die es braucht
     │         └─► Fehlende Skills → Quests ableiten → Backlog
     │
  NEIN
     │
     ▼
Ist es eine FÄHIGKEIT die ich aufbauen will?
     │
  JA ──► SKILL anlegen/erweitern
     │     └─► Quests ableiten die den Skill trainieren → Backlog
     │
  NEIN
     │
     ▼
Ist es eine KONKRETE AUFGABE mit klarem Ergebnis (30-45 min)?
     │
  JA ──► QUEST anlegen
     │     └─► Skill-Tag zuordnen (oder "misc")
     │     └─► Eisenhower-Quadrant + Quest-Typ setzen
     │     └─► Ab in den Backlog
     │
  NEIN ──► Es ist eine NOTIZ. Nicht ins System.
           In ein Notizbuch oder Parking Lot.
```

### KI-gestützter Import

Workflow: Beschreibe ein neues Projekt → Claude generiert Skills + Quests → JSON-Export → Import ins Quest Board.

**Prompt-Template für Claude:**

```
PROJEKT: [Name]
BESCHREIBUNG: [Was soll entstehen]
TECH-STACK: [Welche Technologien]
MEIN LEVEL: [Anfänger/Fortgeschritten in was]

Generiere ein JSON mit:
1. Benötigte SKILLS mit requiredLevel (1-5)
2. Für jeden fehlenden Skill: QUESTS die den Skill trainieren
3. Jeder Quest mit:
   - title, questType (code/learn/design/config/write)
   - xp (30/50/80), duration (short/long)
   - quadrant (q1/q2/q3/q4)
   - skillTags (Skill-IDs)
   - doneCriteria (klares Abschlusskriterium)

Format: { project: {...}, quests: [...] }
```

**Beispiel-Output:**

```json
{
  "project": {
    "name": "Eisenhower-Matrix LITE",
    "track": "A",
    "requirements": [
      {"skillId": "fe-06", "requiredLevel": 3},
      {"skillId": "fe-05", "requiredLevel": 2},
      {"skillId": "arch-06", "requiredLevel": 2}
    ]
  },
  "quests": [
    {
      "title": "useReducer für komplexen State lernen",
      "questType": "learn",
      "xp": 50,
      "duration": "short",
      "quadrant": "q2",
      "skillTags": ["fe-06"],
      "doneCriteria": "Counter-App mit useReducer statt useState gebaut"
    }
  ]
}
```

---

## 9. Umsetzungs-Roadmap (inkrementell)

Jeder Schritt ist selbst ein Quest – Meta-Level: das Tool mit dem Tool bauen.

| # | Feature | Neue Felder / Logik | Aufwand |
|---|---------|--------------------|---------|
| 1 | **Quest-Typ Feld** + Farbcoding auf TaskCard | `questType` auf Task, CSS pro Typ | ~1 Quest |
| 2 | **XP-System** auf Quest + automatische Berechnung auf Skill | `xp` auf Task, `xpCurrent` auf Skill, Summenlogik | ~2-3 Quests |
| 3 | **Skill-Level** statt binär (inkl. Migration) | `level` auf Skill, Migrationslogik, UI-Update SkillTree | ~2-3 Quests |
| 4 | **WIP-Limits** auf Kanban-Spalten | Limit-Config, visuelles Feedback, Drag-Blockade | ~1 Quest |
| 5 | **Wildcard-Limit** (Tageszähler + Settings) | `maxWildcardsPerDay` Setting, Zähler, Timer | ~1-2 Quests |
| 6 | **Projekte als Unlock-Ziele** im Skill-Tree | `projects` Array, Unlock-Logik, UI-Leiste | ~2-3 Quests |
| 7 | **KI-Import-Template** (Prompt + JSON-Schema) | Import-Modal erweitern für Projekt+Quest JSON | ~1 Quest |
| 8 | **Energie-Filter** im Backlog | Filter-Buttons, Eisenhower-View filtern | ~1 Quest |
| 9 | **Duration-Feld** + Timer-Anzeige | `duration` auf Task, Timer-Komponente | ~1-2 Quests |

**Schema-Version:** Aktuell v4 → nach Umsetzung: v5 (mit Migration)

---

## 10. Technische Hinweise

### Daten-Strategie

**Phase 1 (jetzt):** Alles in localStorage. Nur für dich. Export/Import als Backup.

**Phase 2 (später):** Wenn das System stabil ist und du es öffnen willst → Supabase als Lern-Skill (`be-01`, `be-02`). Der Umbau auf DB ist selbst ein Projekt im System!

### Schema-Migration

Bei jedem Feature-Schritt:
1. `SCHEMA_VERSION` in `useQuestBoard.js` hochzählen
2. `migrateState()` erweitern für neue Felder
3. Default-Werte für bestehende Daten setzen

---

*Dieses Konzept ist die Referenz für die Claude Code CLI Umsetzung.*  
*Bei Fragen: `docs/Quest_Skill_Projekt_Konzept_v1_0.md` laden.*
