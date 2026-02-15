# KI-Lernpfad: XP-Balancing-Problem bei Skill-Leveling und Projekt-Unlock

**Version:** 1.0  
**Datum:** 2026-02-15  
**Kontext:** Anweisung für den KI-Lernpfad-Generator in NeuroForge  
**Zweck:** Dieses Dokument beschreibt ein kritisches Design-Problem bei der Generierung von Lernpfad-JSONs und definiert Regeln, die der Generator einhalten MUSS, damit Projekte tatsächlich unlockbar sind.

---

## 1. Das Problem: Projekte sind mathematisch nicht unlockbar

### Symptom

Projekte zeigen im Skill-Tree unrealistisch niedrige Fortschritte (0%, 20%, 25%), obwohl der User die zugehörige Arbeit komplett erledigt hat. Ein Projekt das fertig gebaut ist, steht bei 0% Fortschritt.

### Ursache

Der KI-Lernpfad-Generator erstellt **zu wenige Quests pro Skill**, um die in den Projekt-Requirements geforderten Skill-Level zu erreichen. Die generierten Quests liefern in Summe nicht genug XP, um die mathematisch notwendigen Level-Schwellen zu überschreiten.

### Konkretes Beispiel aus der Praxis

**Projekt "NeuroForge MVP"** verlangt:

| Skill | Required Level | XP nötig | Verlinkte Quests | Max. erreichbare XP |
|-------|---------------|----------|-------------------|---------------------|
| React Hooks | Lv.2 (Apprentice) | 100 XP | 1 Quest (50 XP) | 50 XP |
| Drag & Drop mit dnd-kit | Lv.2 | 100 XP | 1 Quest (80 XP) | 80 XP |
| localStorage Persistenz | Lv.2 | 100 XP | 1 Quest (80 XP) | 80 XP |
| Git Workflow | Lv.1 (Novice) | 1 XP | 1 Quest (50 XP) | 50 XP |

Ergebnis: 3 von 4 Skills können das Required Level **nie** erreichen, selbst wenn alle Quests auf Done stehen. Das Projekt bleibt für immer bei 25%.

---

## 2. Wie das XP/Level-System funktioniert

### Level-Schwellen (fest im Code)

| Level | Label | XP-Schwelle | Bedeutung |
|-------|-------|-------------|-----------|
| 0 | Locked | 0 XP | Noch nie benutzt |
| 1 | Novice | 1+ XP | Erste Berührung |
| 2 | Apprentice | 100+ XP | Grundlagen verstanden |
| 3 | Journeyman | 250+ XP | Selbständig anwendbar |
| 4 | Expert | 500+ XP | Tiefes Verständnis |
| 5 | Master | 800+ XP | Meisterschaft |

### XP-Vergabe pro Quest (3 Stufen)

| XP-Wert | Label | Beschreibung |
|---------|-------|--------------|
| 30 XP | Rezeptiv | Lesen, anschauen, verstehen |
| 50 XP | Reproduktiv | Nachbauen, anwenden |
| 80 XP | Produktiv | Selbst erstellen |

### Wie XP auf Skills fließen

XP werden **nicht automatisch** beim Verschieben auf Done vergeben. Der Ablauf ist:

1. User schiebt Quest im Kanban auf "Done"
2. Das **SkillCheckModal** öffnet sich
3. User bestätigt welche der verlinkten Skills bei dieser Quest gelernt wurden
4. Die **vollen Quest-XP** fließen auf **jeden bestätigten Skill** (kein Splitting!)

Wichtig: Eine Quest mit 80 XP und 3 verlinkten Skills gibt jedem der 3 Skills 80 XP – nicht 80/3.

---

## 3. Die mathematischen Regeln für den Generator

### Kernregel: Jeder Skill in einem Projekt-Requirement braucht genug verlinkte Quests, um das Required Level zu erreichen

Formel:

```
Summe(XP aller Quests die auf diesen Skill verlinkt sind) >= Level-Schwelle des Required Level
```

### Mindest-Quest-Anzahl pro Required Level

Unter der Annahme eines Mix aus allen drei XP-Stufen (Durchschnitt ~53 XP/Quest):

| Required Level | XP nötig | Mindestens Quests | Empfohlen |
|----------------|----------|-------------------|-----------|
| Lv.1 (Novice) | 1 XP | 1 Quest | 1-2 |
| Lv.2 (Apprentice) | 100 XP | 2 Quests | 3-4 |
| Lv.3 (Journeyman) | 250 XP | 4 Quests | 5-6 |
| Lv.4 (Expert) | 500 XP | 7 Quests | 8-10 |
| Lv.5 (Master) | 800 XP | 11 Quests | 12-15 |

### Worst-Case-Rechnung (nur 30 XP Quests)

| Required Level | XP nötig | Mindestens Quests (bei 30 XP) |
|----------------|----------|-------------------------------|
| Lv.2 | 100 XP | 4 Quests |
| Lv.3 | 250 XP | 9 Quests |
| Lv.4 | 500 XP | 17 Quests |

Der Generator MUSS die Worst-Case-Rechnung berücksichtigen, da der User möglicherweise nicht alle Quests als "Produktiv" (80 XP) anlegt.

---

## 4. Validierungsregeln für den Generator

### MUSS-Regeln (Pflicht)

1. **XP-Budget-Check pro Skill:** Für jeden Skill der in einem Projekt-Requirement vorkommt, MUSS die Summe der XP aller verlinkten Quests >= der XP-Schwelle des Required Levels sein.

2. **Keine verwaisten Requirements:** Jeder Skill der in einem Projekt-Requirement referenziert wird, MUSS in mindestens einer Quest als `linkedSkill` vorkommen.

3. **Kein Skill ohne Quest:** Jeder Skill im Lernpfad MUSS in mindestens einer Quest verlinkt sein. Skills ohne Quests sind tote Einträge die nie leveln.

4. **Quest-Granularität:** Eine einzelne Quest soll NICHT mehr als 3 Skills gleichzeitig verlinken. Lieber mehr kleinere Quests als wenige Mega-Quests. Das spiegelt reales Lernen besser wider und verhindert "eine Quest erledigt, alles geleveled".

5. **Progression über Quadranten:** Grundlagen-Quests (Rezeptiv, 30 XP) gehören nach Q2 (wichtig, nicht dringend). Anwendungs-Quests (Reproduktiv, 50 XP) nach Q1 oder Q2. Produktive Quests (80 XP) nach Q1. Das bildet einen natürlichen Lernpfad: erst verstehen, dann anwenden, dann selbst erstellen.

### SOLL-Regeln (Empfohlen)

6. **Überschuss einplanen:** Die Quest-XP-Summe pro Skill soll **mindestens 120%** der Required-Level-Schwelle betragen. Puffer für den Fall, dass der User nicht alle Quests einem Skill zuordnet.

7. **Skill-Wiederverwendung:** Ein Skill soll in verschiedenen Quests mit steigender Komplexität auftauchen. Beispiel für "React Hooks":
   - Quest 1: "useState für Formular nutzen" (30 XP, Rezeptiv)
   - Quest 2: "useEffect für API-Call" (50 XP, Reproduktiv)  
   - Quest 3: "Custom Hook schreiben" (80 XP, Produktiv)

8. **Projekt-Requirements realistisch setzen:** Nicht jeder Skill in einem Projekt braucht Lv.3+. Ein MVP-Projekt sollte primär Lv.1-2 Requirements haben. Lv.3+ ist für fortgeschrittene Projekte reserviert.

---

## 5. Validierungs-Algorithmus (Pseudocode)

Der Generator MUSS vor der JSON-Ausgabe folgenden Check durchführen:

```
FÜR JEDES Projekt:
  FÜR JEDES Requirement im Projekt:
    skill = finde Skill anhand skillId
    requiredXP = LEVEL_THRESHOLDS[requiredLevel]  // [0, 1, 100, 250, 500, 800]
    
    verlinkteQuests = alle Quests wo skill in linkedSkills
    verfügbareXP = SUMME(quest.xp für jede Quest in verlinkteQuests)
    
    WENN verfügbareXP < requiredXP:
      FEHLER: "Skill '{skill.name}' braucht {requiredXP} XP für Lv.{requiredLevel}, 
               aber nur {verfügbareXP} XP durch {anzahl} Quests verfügbar.
               → {fehlend} XP fehlen → mindestens {ceil(fehlend/50)} Quests nacherfassen!"
    
    WENN verlinkteQuests.length == 0:
      FEHLER: "Skill '{skill.name}' hat NULL verlinkte Quests → wird nie leveln!"
```

---

## 6. Beispiel: Korrekt balancierter Skill-Pfad

### Skill: "React Hooks (useState, useEffect)" — Required Level 2 (100 XP nötig)

```json
[
  {
    "title": "useState Grundlagen: Counter und Toggle bauen",
    "xp": 30,
    "linkedSkills": ["SKILL_INDEX_0"],
    "questType": "input",
    "duration": "sprint"
  },
  {
    "title": "useEffect fuer Daten laden und Cleanup verstehen",
    "xp": 30,
    "linkedSkills": ["SKILL_INDEX_0"],
    "questType": "input",
    "duration": "sprint"
  },
  {
    "title": "Formular mit useState und Validierung bauen",
    "xp": 50,
    "linkedSkills": ["SKILL_INDEX_0", "SKILL_INDEX_1"],
    "questType": "focus",
    "duration": "short"
  }
]
```

**Ergebnis:** 30 + 30 + 50 = 110 XP verfügbar → Lv.2 (100 XP) erreichbar mit 10 XP Puffer.

### Zum Vergleich: Was der alte Generator produziert hat

```json
[
  {
    "title": "Vite + React Projekt aufsetzen mit dnd-kit",
    "xp": 50,
    "linkedSkills": ["SKILL_INDEX_0", "SKILL_INDEX_14"]
  }
]
```

**Ergebnis:** 50 XP verfügbar → Lv.2 (100 XP) **nie erreichbar**. 50 XP fehlen.

---

## 7. Zusammenfassung der Fehler im aktuellen Generator

| # | Fehler | Auswirkung |
|---|--------|------------|
| 1 | Zu wenige Quests pro Skill (oft nur 1) | Skills können Required Level nie erreichen |
| 2 | Kein XP-Budget-Check gegen Requirements | Projekte mathematisch nicht unlockbar |
| 3 | Quests mit zu vielen linkedSkills (4-5 pro Quest) | XP verteilen sich zu breit, wirkt aber nicht negativ da XP nicht gesplittet werden – trotzdem unrealistisch |
| 4 | Skills ohne jede Quest-Verlinkung | Tote Einträge die nie leveln (z.B. "Git Workflow" hatte 0 Quests) |
| 5 | Keine Lern-Progression innerhalb eines Skills | Alle Quests produktiv (80 XP) statt aufbauend (30→50→80) |
| 6 | Alle Skills starten bei Level 0 / 0 XP | Bereits geleistete Arbeit wird nicht abgebildet |

---

## 8. Checkliste für den Generator (vor JSON-Ausgabe)

- [ ] Jeder Skill hat mindestens 1 Quest
- [ ] Jeder Skill in einem Projekt-Requirement hat genug Quest-XP für das Required Level
- [ ] XP-Budget pro Skill >= 120% der Level-Schwelle (Puffer)
- [ ] Quests haben max. 3 linkedSkills
- [ ] Mix aus XP-Stufen pro Skill (30/50/80) für natürliche Progression
- [ ] Keine Projekt-Requirements über Lv.3 ohne mindestens 6+ Quests auf dem Skill
- [ ] SKILL_INDEX-Referenzen sind korrekt (0-basiert, passend zum skills-Array)
