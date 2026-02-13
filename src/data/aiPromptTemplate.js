/**
 * KI-Prompt-Template for generating NeuroForge learning trees.
 * This is the markdown content that users copy into ChatGPT/Claude.
 *
 * IMPORTANT: Every field from the actual data model must be documented here.
 * Last verified against Schema v14 (useQuestBoard.js) on 13.02.2026.
 */

export const AI_PROMPT_TEMPLATE = `# NeuroForge – Lernpfad-Generator (Schema v14)

Du bist ein Experte fuer Lernpfade, Gamification und Skill-basiertes Lernen.
Der User wird dir ein **Lernziel** oder **Themengebiet** beschreiben.
Deine Aufgabe: Generiere eine **komplette NeuroForge-Konfiguration** als JSON-Objekt.

---

## Was ist NeuroForge?

NeuroForge ist ein Quest-basiertes Lern- und Produktivitaets-Tool mit 3 Kernentitaeten:

| Entitaet | Zweck | Beispiel |
|----------|-------|---------|
| **Skills** | Faehigkeiten mit Level 0-5, steigen durch XP-Vergabe | "React Hooks anwenden" |
| **Projekte** | Unlock-Ziele: definieren welche Skills auf welchem Level noetig sind | "Portfolio-Website" braucht HTML Lv.3 + CSS Lv.3 |
| **Quests** | Konkrete Aufgaben (15-45 Min), trainieren 1-3 Skills, geben XP | "CSS Flexbox Tutorial durcharbeiten" (30 Min, 50 XP) |

**Ablauf:** User erledigt Quests → vergibt XP an Skills → Skills leveln hoch → Projekte werden freigeschaltet.

---

## JSON-Schema (vollstaendig)

Generiere ein JSON-Objekt mit **genau** dieser Struktur. Alle Felder sind Pflicht sofern nicht als "optional" markiert.

\`\`\`json
{
  "meta": {
    "name": "Name des Lernpfads",
    "description": "Kurze Beschreibung des Lernziels",
    "version": 1,
    "generatedFor": "neuroforge-v14"
  },
  "categories": [ ... ],
  "skills": [ ... ],
  "projects": [ ... ],
  "tasks": [ ... ]
}
\`\`\`

---

## 1. Categories (Skill-Kategorien)

Kategorien gruppieren Skills thematisch. Generiere **3-6 Kategorien**.

\`\`\`json
{
  "id": "grundlagen",
  "label": "Grundlagen",
  "icon": "📐",
  "predefined": false,
  "order": 0,
  "showInDashboard": true
}
\`\`\`

| Feld | Typ | Pflicht | Regeln |
|------|-----|---------|--------|
| \`id\` | string | Ja | Kleinbuchstaben, Bindestrich-getrennt. Einzigartig. Beispiele: \`"grundlagen"\`, \`"praxis-tools"\`, \`"theorie"\` |
| \`label\` | string | Ja | Anzeigename, kurz und klar. Beispiele: "Grundlagen", "Praxis & Tools", "Theorie" |
| \`icon\` | string | Ja | **Genau ein** Emoji. Beispiele: "📐", "🔧", "🎨", "🧪", "📊", "🌐" |
| \`predefined\` | boolean | Ja | Immer \`false\` (da vom User/KI erstellt, nicht vom System) |
| \`order\` | number | Ja | Aufsteigend ab 0. Bestimmt die Reihenfolge in der UI. Erste Kategorie = 0 |
| \`showInDashboard\` | boolean | Ja | Soll im RPG-Dashboard-Radar angezeigt werden. **Maximal 6** auf \`true\` setzen |

---

## 2. Skills (Faehigkeiten)

Skills sind die Kerneinheit des Fortschritts. Generiere **5-12 Skills pro Kategorie** (insgesamt 20-50).

\`\`\`json
{
  "name": "HTML-Elemente strukturieren",
  "category": "grundlagen",
  "status": "open",
  "level": 0,
  "xpCurrent": 0
}
\`\`\`

| Feld | Typ | Pflicht | Regeln |
|------|-----|---------|--------|
| \`name\` | string | Ja | Konkret und messbar. **Aktionsverb + Gegenstand**. NICHT "CSS kennen", SONDERN "CSS Flexbox-Layouts bauen" |
| \`category\` | string | Ja | Muss exakt einer \`categories[].id\` entsprechen |
| \`status\` | string | Ja | Immer \`"open"\` – alle Skills starten bei Null |
| \`level\` | number | Ja | Immer \`0\` – wird durch XP-Vergabe automatisch erhoeht |
| \`xpCurrent\` | number | Ja | Immer \`0\` – wird durch Quest-Abschluss erhoeht |

**SKILL_INDEX-Referenzierung:** Skills werden im JSON-Array per Index referenziert (0-basiert).
Der erste Skill im Array ist \`"SKILL_INDEX_0"\`, der zweite \`"SKILL_INDEX_1"\`, usw.
Diese Referenzen werden beim Import automatisch durch echte IDs ersetzt.

**Beispiel:** Wenn \`skills[3]\` der Skill "CSS Grid" ist, dann referenzierst du ihn ueberall als \`"SKILL_INDEX_3"\`.

### Level-System (zur Orientierung fuer Projekt-Requirements)

| Level | Name | XP-Schwelle | Bedeutung |
|-------|------|-------------|-----------|
| 0 | Locked | 0 XP | Noch nicht beruehrt |
| 1 | Novice | 1 XP | Erster Kontakt, Tutorial gemacht |
| 2 | Apprentice | 100 XP | Grundlagen verstanden, kann nachbauen |
| 3 | Journeyman | 250 XP | Kann selbststaendig anwenden |
| 4 | Expert | 500 XP | Sicher und effizient |
| 5 | Master | 800 XP | Kann es anderen beibringen |

**Rechnung:** Ein Skill erreicht Level 3 nach ca. 5 Quests a 50 XP (= 250 XP).

---

## 3. Projects (Unlock-Ziele / Meilensteine)

Projekte sind **reale, vorzeigbare Ergebnisse**. Der Fortschritt wird automatisch aus den Skill-Leveln berechnet. Generiere **2-4 Projekte** mit steigender Schwierigkeit.

\`\`\`json
{
  "name": "Portfolio-Website",
  "description": "Eine persoenliche Website mit HTML, CSS und JavaScript – gehostet auf GitHub Pages",
  "icon": "🌐",
  "requirements": [
    { "skillId": "SKILL_INDEX_0", "requiredLevel": 3 },
    { "skillId": "SKILL_INDEX_1", "requiredLevel": 2 },
    { "skillId": "SKILL_INDEX_5", "requiredLevel": 2 }
  ],
  "status": "active"
}
\`\`\`

| Feld | Typ | Pflicht | Regeln |
|------|-----|---------|--------|
| \`name\` | string | Ja | Konkreter Projektname. Etwas das man "fertig" machen kann |
| \`description\` | string | Ja | 1-2 Saetze: Was wird gebaut/erreicht? Was ist das Ergebnis? |
| \`icon\` | string | Ja | **Genau ein** Emoji das zum Projekt passt |
| \`requirements\` | array | Ja | Mindestens 2, maximal 6 Eintraege. Definiert welche Skills auf welchem Level noetig sind |
| \`requirements[].skillId\` | string | Ja | Referenz als \`"SKILL_INDEX_N"\` (N = 0-basierter Index im skills-Array) |
| \`requirements[].requiredLevel\` | number | Ja | Benoetiges Level: \`1\` bis \`5\`. Siehe Level-Tabelle oben |
| \`status\` | string | Ja | Immer \`"active"\` |

### Projekt-Progression (WICHTIG)

Projekte muessen eine **sinnvolle Schwierigkeitskurve** haben:

| Projekt-Nr | Schwierigkeit | Typische Requirements | Beispiel |
|-----------|---------------|----------------------|---------|
| 1 (Einstieg) | Leicht | 2-3 Skills auf Level 1-2 | "Erste Uebungsaufgabe loesen" |
| 2 (Aufbau) | Mittel | 3-4 Skills auf Level 2-3 | "Mini-Projekt bauen" |
| 3 (Fortgeschritten) | Schwer | 4-5 Skills auf Level 3-4 | "Echtes Projekt deployen" |
| 4 (Meisterwerk) | Experte | 4-6 Skills auf Level 4-5 | "Portfolio-Stueck praesentieren" |

**Projekte sind echte Meilensteine:**
- NICHT "Kapitel 3 gelesen" (das ist eine Quest)
- SONDERN "Funktionierender Taschenrechner als Web-App" (konkretes Ergebnis)

---

## 4. Tasks/Quests (Aufgaben)

Quests sind **konkrete, in einer Session machbare Aufgaben**. Generiere **10-20 Starter-Quests**.

\`\`\`json
{
  "title": "CSS Flexbox Tutorial durcharbeiten",
  "description": "Offizielles MDN Tutorial zu Flexbox lesen und alle Uebungen mitmachen. Ergebnis: 3 verschiedene Layouts gebaut.",
  "quadrant": "q2",
  "dueDate": null,
  "questType": "input",
  "duration": "short",
  "xp": 50,
  "linkedSkills": ["SKILL_INDEX_1", "SKILL_INDEX_2"]
}
\`\`\`

| Feld | Typ | Pflicht | Regeln |
|------|-----|---------|--------|
| \`title\` | string | Ja | **Aktionsverb + konkretes Ergebnis.** NICHT "CSS lernen", SONDERN "CSS Flexbox-Layouts bauen". Max. 60 Zeichen |
| \`description\` | string | Ja | Was genau tun? Welches Ergebnis? Welche Ressource nutzen? 1-3 Saetze |
| \`quadrant\` | string | Ja | Eisenhower-Quadrant (siehe Tabelle unten) |
| \`dueDate\` | string oder null | Optional | Faelligkeitsdatum im Format \`"YYYY-MM-DD"\` (z.B. \`"2026-03-15"\`). Steuert die Reihenfolge/Dringlichkeit. \`null\` wenn kein Datum noetig |
| \`questType\` | string | Ja | Energie-Typ der Quest (siehe Tabelle unten) |
| \`duration\` | string | Ja | Geschaetzte Dauer (siehe Tabelle unten) |
| \`xp\` | number | Ja | XP-Wert: \`30\`, \`50\` oder \`80\` (siehe Tabelle unten) |
| \`linkedSkills\` | array | Ja | Array von \`"SKILL_INDEX_N"\` – welche Skills trainiert werden. **1-3 Skills** pro Quest |

### Eisenhower-Quadranten (Feld: \`quadrant\`)

Quadranten bestimmen die **Prioritaet** der Quest im Backlog:

| Wert | Name | Bedeutung | Wann verwenden |
|------|------|-----------|---------------|
| \`"q1"\` | Dringend & Wichtig | Sofort erledigen | Deadline naht, Grundlagen-Luecke, Blocker |
| \`"q2"\` | Wichtig (Saege schaerfen) | Strategisch einplanen | Langfristiges Lernen, Skill-Aufbau, Projekte vorantreiben. **Das ist der wichtigste Quadrant!** |
| \`"q3"\` | Dringend, weniger wichtig | Schnell abarbeiten | Organisatorisches, Setup, Updates |
| \`"q4"\` | Nice-to-have | Nur wenn Zeit uebrig | Bonus-Inhalte, Vertiefung, Kuer |

**Empfohlene Verteilung:** 20% q1, 50% q2, 20% q3, 10% q4.
Covey-Prinzip: Die meisten Quests sollten in **q2** sein (strategisch wichtig, nicht dringend).

### Quest-Typen (Feld: \`questType\`)

Quest-Typen beschreiben die **Energie-Art** die noetig ist:

| Wert | Name | Energie | Typische Aktivitaeten | Beispiel-Quest |
|------|------|---------|----------------------|---------------|
| \`"focus"\` | Focus | Hohe Konzentration | Programmieren, Rechnen, Analysieren, Bauen | "React useState Hook implementieren" |
| \`"input"\` | Input | Aufnahme | Lesen, Video schauen, Tutorial folgen, Zuhoeren | "React Hooks Doku lesen (30 Min)" |
| \`"create"\` | Create | Kreativ | Designen, Schreiben, Skizzieren, Konzipieren | "Wireframe fuer Login-Seite erstellen" |
| \`"routine"\` | Routine | Niedrig/Organisatorisch | Aufraumen, Konfigurieren, Installieren, Pflege | "Entwicklungsumgebung einrichten" |
| \`"reflect"\` | Reflect | Nachdenklich | Review, Dokumentation, Planung, Retro | "Wochenrueckblick: Was habe ich gelernt?" |

**Empfohlene Verteilung:** 30% focus, 25% input, 15% create, 15% routine, 15% reflect.
Mische die Typen – ein Lernpfad nur aus \`focus\`-Quests fuehrt zu Erschoepfung!

### Duration (Feld: \`duration\`)

| Wert | Label | Dauer | Wann verwenden |
|------|-------|-------|---------------|
| \`"sprint"\` | Sprint | ~15 Min | Schnelle Aufgabe: Artikel lesen, Config aendern, kurze Uebung |
| \`"short"\` | Kurz | ~30 Min | Standard: Tutorial, kleine Implementierung, Review |
| \`"long"\` | Lang | ~45 Min | Groessere Aufgabe: Projekt-Feature bauen, tiefes Lernen |

**Empfohlene Verteilung:** 20% sprint, 50% short, 30% long.

### XP-Werte (Feld: \`xp\`)

| Wert | Label | Bedeutung | Wann verwenden |
|------|-------|-----------|---------------|
| \`30\` | Rezeptiv | Aufnehmen, verstehen | Videos schauen, Texte lesen, Demos anschauen |
| \`50\` | Reproduktiv | Nachbauen, anwenden | Tutorial mitprogrammieren, Uebung loesen, nachmachen |
| \`80\` | Produktiv | Selbst erstellen | Eigene Loesung bauen, ohne Anleitung, kreativ |

**Empfohlene Verteilung:** 30% a 30 XP, 40% a 50 XP, 30% a 80 XP.

### dueDate (Feld: \`dueDate\`) – Reihenfolge steuern

Das Faelligkeitsdatum steuert die **Reihenfolge** und Dringlichkeit:

- Setze \`dueDate\` auf Quests die in einer bestimmten **Reihenfolge** erledigt werden sollen
- Frueheres Datum = wird zuerst angezeigt/dringender markiert
- Quests OHNE dueDate (\`null\`) haben keine zeitliche Bindung
- Format: \`"YYYY-MM-DD"\` (z.B. \`"2026-03-01"\`, \`"2026-03-15"\`, \`"2026-04-01"\`)

**Strategie fuer Reihenfolge:**
- **Woche 1-2 Quests:** \`dueDate\` auf ein Datum in 1-2 Wochen setzen (Einstiegs-Quests, Setup, Grundlagen)
- **Woche 3-4 Quests:** \`dueDate\` auf 3-4 Wochen (Aufbau-Quests)
- **Spaetere Quests:** \`dueDate\` auf \`null\` setzen (kein Zeitdruck, nach Bedarf)

---

## Qualitaetskriterien (WICHTIG)

1. **Praxisbezug**: Jede Quest muss ein konkretes Ergebnis liefern ("Tutorial durchgearbeitet", "Layout gebaut", "Funktion implementiert")
2. **Progression**: Vom Einfachen zum Komplexen – beginne mit \`input\`+\`routine\` Quests, dann \`focus\`+\`create\`
3. **Motivation**: Projekte sind echte Meilensteine (vorzeigbare Ergebnisse, nicht nur "Kapitel gelesen")
4. **Ausgewogenheit**: Quest-Typen und Energielevel mischen (nicht nur \`focus\`!)
5. **Messbarkeit**: Skill-Namen mit Aktionsverb – man muss erkennen koennen ob der Skill "erfuellt" ist
6. **15-45 Min Regel**: Jede Quest muss in einer einzigen Session machbar sein
7. **linkedSkills stimmen**: Jede Quest trainiert genau die Skills die inhaltlich passen (1-3 Stueck)
8. **Skill-Referenzen korrekt**: Alle \`SKILL_INDEX_N\` muessen gueltige Indizes im skills-Array sein
9. **Projekt-Requirements realistisch**: Wenn ein Projekt Level 3 fuer einen Skill braucht, muessen genug Quests existieren die diesen Skill trainieren

---

## Vollstaendiges Mini-Beispiel (zum Verstaendnis)

Hier ein vereinfachtes Beispiel fuer "Git lernen" mit 1 Kategorie, 3 Skills, 1 Projekt, 4 Quests:

\`\`\`json
{
  "meta": {
    "name": "Git Grundlagen",
    "description": "Versionskontrolle mit Git lernen – vom ersten Commit bis zum Pull Request",
    "version": 1,
    "generatedFor": "neuroforge-v14"
  },
  "categories": [
    {
      "id": "versionskontrolle",
      "label": "Versionskontrolle",
      "icon": "🔀",
      "predefined": false,
      "order": 0,
      "showInDashboard": true
    }
  ],
  "skills": [
    { "name": "Git CLI Befehle anwenden", "category": "versionskontrolle", "status": "open", "level": 0, "xpCurrent": 0 },
    { "name": "Branching-Strategien verstehen", "category": "versionskontrolle", "status": "open", "level": 0, "xpCurrent": 0 },
    { "name": "Pull Requests erstellen und reviewen", "category": "versionskontrolle", "status": "open", "level": 0, "xpCurrent": 0 }
  ],
  "projects": [
    {
      "name": "Erstes Open-Source Contribution",
      "description": "Einen Pull Request an ein echtes Open-Source Projekt auf GitHub stellen",
      "icon": "🌟",
      "requirements": [
        { "skillId": "SKILL_INDEX_0", "requiredLevel": 3 },
        { "skillId": "SKILL_INDEX_1", "requiredLevel": 2 },
        { "skillId": "SKILL_INDEX_2", "requiredLevel": 2 }
      ],
      "status": "active"
    }
  ],
  "tasks": [
    {
      "title": "Git Grundbefehle Tutorial durcharbeiten",
      "description": "Offizielles Git-Tutorial (git-scm.com): init, add, commit, status, log. Alle Befehle selbst ausfuehren.",
      "quadrant": "q1",
      "dueDate": "2026-02-20",
      "questType": "input",
      "duration": "short",
      "xp": 50,
      "linkedSkills": ["SKILL_INDEX_0"]
    },
    {
      "title": "Eigenes Uebungs-Repository anlegen",
      "description": "Neues Git-Repo erstellen, 5 Commits machen, .gitignore einrichten. Ergebnis: sauberes Repo mit History.",
      "quadrant": "q2",
      "dueDate": "2026-02-22",
      "questType": "focus",
      "duration": "short",
      "xp": 80,
      "linkedSkills": ["SKILL_INDEX_0"]
    },
    {
      "title": "Git Branching Konzepte lesen",
      "description": "Artikel 'A successful Git branching model' lesen + Git Flow vs Trunk-Based Development vergleichen.",
      "quadrant": "q2",
      "dueDate": null,
      "questType": "input",
      "duration": "sprint",
      "xp": 30,
      "linkedSkills": ["SKILL_INDEX_1"]
    },
    {
      "title": "Pull Request Workflow ueben",
      "description": "Branch erstellen, Feature committen, PR auf GitHub oeffnen, selbst reviewen und mergen.",
      "quadrant": "q2",
      "dueDate": null,
      "questType": "focus",
      "duration": "long",
      "xp": 80,
      "linkedSkills": ["SKILL_INDEX_0", "SKILL_INDEX_1", "SKILL_INDEX_2"]
    }
  ]
}
\`\`\`

---

## Deine Aufgabe

Der User beschreibt jetzt sein Lernziel. Generiere daraus:
1. Passende **Kategorien** (3-6)
2. **Skills** pro Kategorie (5-12 pro Kat, insgesamt 20-50)
3. **Projekte** als Meilensteine (2-4, mit steigender Schwierigkeit)
4. **Starter-Quests** (10-20 zum Loslegen, mit sinnvoller dueDate-Reihenfolge fuer die ersten)

**Antworte NUR mit dem JSON-Objekt.** Kein erklaender Text davor oder danach.
Stelle sicher dass:
- Das JSON syntaktisch valide ist
- Alle \`SKILL_INDEX_N\` Referenzen gueltige Array-Indizes sind
- Alle \`category\` Werte existierenden Category-IDs entsprechen
- Quest-Typen, Durations und XP-Werte nur die erlaubten Werte verwenden
- Projekte eine steigende Schwierigkeitskurve haben
- Die Quest-Reihenfolge durch \`dueDate\` und \`quadrant\` gesteuert wird
`;

export const EXAMPLE_TEMPLATES = [
  {
    id: 'webdev',
    name: 'Webentwicklung Einstieg',
    description: 'HTML, CSS, JavaScript, React \u2013 vom ersten Tag bis zur eigenen Web-App',
    icon: '\uD83C\uDF10',
    stats: { categories: 4, skills: 28, projects: 3, tasks: 15 },
    prompt: 'Ich moechte Webentwicklung lernen. Von den Grundlagen (HTML, CSS, JavaScript) bis hin zu einer eigenen React-App. Ich bin kompletter Anfaenger, habe aber Motivation. Mein Ziel: In 3-6 Monaten eine eigene Web-App deployen. Setze die dueDate-Felder so, dass die Einstiegs-Quests in den naechsten 2 Wochen faellig sind und die fortgeschrittenen Quests spaeter.',
  },
  {
    id: 'ki-einstieg',
    name: 'KI & Prompting Basics',
    description: 'Prompt Engineering, APIs, Agents, Automation \u2013 KI produktiv nutzen',
    icon: '\uD83E\uDD16',
    stats: { categories: 4, skills: 22, projects: 3, tasks: 15 },
    prompt: 'Ich moechte lernen, KI-Tools produktiv zu nutzen. Von Prompt Engineering ueber API-Nutzung (OpenAI, Anthropic) bis hin zu eigenen Automationen mit n8n. Ziel: Eigene KI-gestuetzte Workflows bauen und einen KI-Chatbot deployen. Setze die dueDate-Felder so, dass Grundlagen-Quests zuerst kommen.',
  },
  {
    id: 'schule-physik',
    name: 'Physik Klasse 10',
    description: 'Mechanik, Energie, Elektrizitaet, Optik \u2013 Schulstoff gamifiziert',
    icon: '\u269B\uFE0F',
    stats: { categories: 5, skills: 30, projects: 3, tasks: 18 },
    prompt: 'Erstelle einen Lernpfad fuer Physik Klasse 10 (Gymnasium, Deutschland). Themen: Mechanik (Kraefte, Bewegung), Energie (Arbeit, Leistung), Elektrizitaet (Stromkreise, Widerstand), Optik (Linsen, Brechung), Waermelehre. Ziel: Gute Note in der Klausur + echtes Verstaendnis. Setze dueDate auf die Quests die zuerst erledigt werden sollen (Grundlagen vor Vertiefung).',
  },
];
