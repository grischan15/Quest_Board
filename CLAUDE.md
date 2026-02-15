# CLAUDE.md – Projekt-Regeln fuer Claude Code

## Projekt-Kontext

- App: NeuroForge – Deine Quest-Schmiede (React + Vite + localStorage)
- Design: Neurodivergenz-optimiert (sanfte Farben, prefers-reduced-motion, Dopamin-Feedback)
- Schema-Versionierung: Jede Datenmodell-Aenderung bekommt neue Version

## Docs-Struktur (keine Redundanz!)

| Datei | Zweck | Zeitbezug |
|-------|-------|-----------|
| **CLAUDE.md** | Entwicklungsregeln, Prozesse, Konventionen | Zeitlos (gilt immer) |
| **STATE.md** | Aktueller Snapshot: Version, Features, Dateistruktur, Schema | Gegenwart |
| **ROADMAP.md** | Nur Zukunft: Was kommt? Was ist zurueckgestellt? + Entscheidungslog | Zukunft |
| **Git Log** | Was wurde wann gemacht (die echte Historie) | Vergangenheit |

- STATE.md = kompakter Ist-Zustand, KEINE Feature-fuer-Feature-Geschichte
- ROADMAP.md = KEINE "Erledigt"-Bloecke, dafuer gibt es Git + STATE
- Entscheidungslog bleibt in ROADMAP (dokumentiert das "Warum")

## Workflow nach jedem Block

Nach jedem abgeschlossenen Block (wenn User Browser-Test bestaetigt und Docs aktualisiert sind):
1. Automatisch `git commit` erstellen (mit aussagekraeftiger Commit-Nachricht)
2. NICHT pushen ohne explizite Aufforderung

## Docs-Update Regel

Wenn der User "docs updaten" sagt:
- STATE.md und ROADMAP.md aktualisieren (gemaess Docs-Struktur oben)
- Danach automatisch committen (gehoert zum Block-Abschluss)

## Schema-Change Checkliste

Bei jeder Datenmodell-Aenderung (neues Feld, Umbenennung, Typwechsel):
1. Migration in `migrateState()` schreiben (useQuestBoard.js)
2. `SCHEMA_VERSION` hochzaehlen
3. `aiPromptTemplate.js` aktualisieren (neues Feld dokumentieren, Beispiel anpassen)
4. KI-Beispiel-Vorlagen (EXAMPLE_TEMPLATES) pruefen – stimmen die Stats noch?
5. STATE.md Schema-Tabelle aktualisieren
6. Export/Import/Restore pruefen – wird das neue Feld korrekt behandelt?

## Commit-Stil

- Commit-Nachrichten auf Englisch, Prefix: feat/fix/docs/refactor
- Kurze Summary-Zeile + Details im Body wenn noetig
- Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

## Sprache

- Code + Commits: Englisch
- Kommunikation mit User: Deutsch
- Docs (STATE.md, ROADMAP.md): Deutsch
