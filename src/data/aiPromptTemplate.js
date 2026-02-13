/**
 * KI-Prompt-Template for generating NeuroForge learning trees.
 * This is the markdown content that users copy into ChatGPT/Claude.
 */

export const AI_PROMPT_TEMPLATE = `# NeuroForge – Lernpfad-Generator

Du bist ein Experte fuer Lernpfade, Gamification und Skill-basiertes Lernen.
Der User wird dir ein **Lernziel** oder **Themengebiet** beschreiben.
Deine Aufgabe: Generiere eine **komplette NeuroForge-Konfiguration** als JSON.

---

## Was ist NeuroForge?

NeuroForge ist ein Quest-basiertes Lern- und Produktivitaets-Tool mit 3 Entitaeten:
- **Skills** – Faehigkeiten mit Level 0-5 (durch XP-Vergabe bei Quest-Abschluss)
- **Projekte** – Unlock-Ziele die bestimmte Skills auf bestimmtem Level erfordern
- **Quests** – Konkrete Aufgaben (30-45 Min) die Skills trainieren

---

## JSON-Schema

Generiere ein JSON-Objekt mit genau dieser Struktur:

\`\`\`json
{
  "meta": {
    "name": "Name des Lernpfads",
    "description": "Kurze Beschreibung",
    "version": 1,
    "generatedFor": "neuroforge-v14"
  },
  "categories": [
    {
      "id": "cat-id",
      "label": "Kategorie-Name",
      "icon": "🎯",
      "predefined": false,
      "order": 0,
      "showInDashboard": true
    }
  ],
  "skills": [
    {
      "name": "Skill-Name",
      "category": "cat-id",
      "status": "open",
      "level": 0,
      "xpCurrent": 0
    }
  ],
  "projects": [
    {
      "name": "Projekt-Name",
      "description": "Was wird gebaut/erreicht?",
      "icon": "🚀",
      "requirements": [
        { "skillId": "SKILL_INDEX_0", "requiredLevel": 3 }
      ],
      "status": "active"
    }
  ],
  "tasks": [
    {
      "title": "Quest-Titel",
      "description": "Was genau tun?",
      "quadrant": "q2",
      "questType": "focus",
      "duration": "short",
      "xp": 50,
      "linkedSkills": ["SKILL_INDEX_0", "SKILL_INDEX_1"]
    }
  ]
}
\`\`\`

---

## Regeln & Konventionen

### Categories (3-6 Stueck)
- \`id\`: Kleinbuchstaben, Bindestrich-getrennt (z.B. \`"grundlagen"\`, \`"praxis-tools"\`)
- \`icon\`: Ein einzelnes Emoji
- \`order\`: Aufsteigend ab 0
- \`showInDashboard\`: Maximal 6 auf \`true\`

### Skills (5-12 pro Kategorie)
- \`category\`: Muss einer Category-ID entsprechen
- \`status\`: Immer \`"open"\` (Level 0, Start bei Null)
- Skill-Namen: Konkret und messbar (nicht "Grundlagen kennen", sondern "HTML-Elemente anwenden")
- **SKILL_INDEX_0, SKILL_INDEX_1 etc.** – Werden beim Import automatisch durch echte IDs ersetzt. Verwende die Index-Nummer (0-basiert) des Skills im \`skills\`-Array.

### Projects (2-4 Stueck)
- Jedes Projekt definiert **Skill-Requirements**: welcher Skill auf welchem Level noetig ist
- \`requirements.skillId\`: Referenz als \`"SKILL_INDEX_N"\` (N = Index im skills-Array)
- \`requirements.requiredLevel\`: 1-5
- **Sinnvolle Progression**: Erstes Projekt braucht Level 1-2, spaetere Level 3-4
- \`status\`: Immer \`"active"\`
- Projekte sollten **reale, anwendbare Ergebnisse** sein (Portfolio-Stueck, Prototyp, Zertifikat)

### Tasks/Quests (10-20 Stueck)
- \`quadrant\`: \`"q1"\` (dringend+wichtig), \`"q2"\` (wichtig, Saege schaerfen), \`"q3"\` (dringend), \`"q4"\` (nice-to-have)
- **Empfohlene Verteilung**: 30% q1, 40% q2, 20% q3, 10% q4
- \`questType\`: Einer von \`"focus"\` | \`"input"\` | \`"create"\` | \`"routine"\` | \`"reflect"\`
  - **focus** = Hohe Konzentration (Programmieren, Rechnen, Analysieren)
  - **input** = Aufnehmen (Lesen, Videos, Tutorials)
  - **create** = Gestalten (Designen, Schreiben, Bauen)
  - **routine** = Organisieren (Aufraumen, Konfigurieren, Pflege)
  - **reflect** = Nachdenken (Review, Dokumentation, Planung)
- \`duration\`: \`"sprint"\` (~15 Min) | \`"short"\` (~30 Min) | \`"long"\` (~45 Min)
- \`xp\`: \`30\` (rezeptiv/einfach) | \`50\` (reproduktiv/mittel) | \`80\` (produktiv/schwer)
- \`linkedSkills\`: Array von \`"SKILL_INDEX_N"\` – welche Skills diese Quest trainiert (1-3 Skills)
- Quest-Titel: **Aktionsverb + konkretes Ergebnis** (z.B. "CSS Grid Layout bauen" statt "CSS lernen")

### Level-Schwellen (zur Orientierung)
- Level 0 → 1: 1 XP (Novice – erster Kontakt)
- Level 1 → 2: 100 XP (Apprentice – Grundlagen)
- Level 2 → 3: 250 XP (Journeyman – anwendbar)
- Level 3 → 4: 500 XP (Expert – sicher)
- Level 4 → 5: 800 XP (Master – Meisterschaft)

---

## Qualitaetskriterien

1. **Praxisbezug**: Jede Quest und jedes Projekt sollte ein reales Ergebnis liefern
2. **Progression**: Vom Einfachen zum Komplexen – erste Quests sind \`input\`/\`routine\`, spaetere \`focus\`/\`create\`
3. **Motivation**: Projekte sind echte Meilensteine, die man vorzeigen kann
4. **Ausgewogenheit**: Verschiedene Quest-Typen mischen (nicht nur \`focus\`)
5. **Messbarkeit**: Skills muessen klar abgrenzbar und bewertbar sein
6. **30-45 Min Regel**: Jede Quest sollte in einer Session machbar sein

---

## Deine Aufgabe

Der User beschreibt jetzt sein Lernziel. Generiere daraus:
1. Passende **Kategorien** (3-6)
2. **Skills** pro Kategorie (5-12 pro Kat, insgesamt 20-50)
3. **Projekte** als Meilensteine (2-4, mit steigender Schwierigkeit)
4. **Starter-Quests** (10-20 zum Loslegen)

**Antworte NUR mit dem JSON.** Kein erklarender Text, nur das JSON-Objekt.
Stelle sicher, dass das JSON valide ist und alle Referenzen (SKILL_INDEX_N) korrekte Indizes verwenden.
`;

export const EXAMPLE_TEMPLATES = [
  {
    id: 'webdev',
    name: 'Webentwicklung Einstieg',
    description: 'HTML, CSS, JavaScript, React – vom ersten Tag bis zur eigenen Web-App',
    icon: '\uD83C\uDF10',
    stats: { categories: 4, skills: 28, projects: 3, tasks: 15 },
    prompt: 'Ich moechte Webentwicklung lernen. Von den Grundlagen (HTML, CSS, JavaScript) bis hin zu einer eigenen React-App. Ich bin kompletter Anfaenger, habe aber Motivation. Mein Ziel: In 3-6 Monaten eine eigene Web-App deployen.',
  },
  {
    id: 'ki-einstieg',
    name: 'KI & Prompting Basics',
    description: 'Prompt Engineering, APIs, Agents, Automation – KI produktiv nutzen',
    icon: '\uD83E\uDD16',
    stats: { categories: 4, skills: 22, projects: 3, tasks: 15 },
    prompt: 'Ich moechte lernen, KI-Tools produktiv zu nutzen. Von Prompt Engineering ueber API-Nutzung (OpenAI, Anthropic) bis hin zu eigenen Automationen mit n8n. Ziel: Eigene KI-gestuetzte Workflows bauen und einen KI-Chatbot deployen.',
  },
  {
    id: 'schule-physik',
    name: 'Physik Klasse 10',
    description: 'Mechanik, Energie, Elektrizitaet, Optik – Schulstoff gamifiziert',
    icon: '\u269B\uFE0F',
    stats: { categories: 5, skills: 30, projects: 3, tasks: 18 },
    prompt: 'Erstelle einen Lernpfad fuer Physik Klasse 10 (Gymnasium, Deutschland). Themen: Mechanik (Kraefte, Bewegung), Energie (Arbeit, Leistung), Elektrizitaet (Stromkreise, Widerstand), Optik (Linsen, Brechung), Waermelehre. Ziel: Gute Note in der Klausur + echtes Verstaendnis.',
  },
];
