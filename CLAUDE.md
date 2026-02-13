# CLAUDE.md – Projekt-Regeln fuer Claude Code

## Workflow nach jedem Block

Nach jedem abgeschlossenen Block (wenn User Browser-Test bestaetigt und Docs aktualisiert sind):
1. Automatisch `git commit` erstellen (mit aussagekraeftiger Commit-Nachricht)
2. NICHT pushen ohne explizite Aufforderung

## Docs-Update Regel

Wenn der User "docs updaten" sagt:
- STATE.md und ROADMAP.md aktualisieren
- Danach automatisch committen (gehoert zum Block-Abschluss)

## Commit-Stil

- Commit-Nachrichten auf Englisch, Prefix: feat/fix/docs/refactor
- Kurze Summary-Zeile + Details im Body wenn noetig
- Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

## Sprache

- Code + Commits: Englisch
- Kommunikation mit User: Deutsch
- Docs (STATE.md, ROADMAP.md): Deutsch

## Projekt-Kontext

- App: NeuroForge – Deine Quest-Schmiede (React + Vite + localStorage)
- Docs: STATE.md (Ist-Zustand) + ROADMAP.md (Planung + Entscheidungslog)
- Schema-Versionierung: Jede Datenmodell-Aenderung bekommt neue Version
- Design: Neurodivergenz-optimiert (sanfte Farben, prefers-reduced-motion, Dopamin-Feedback)
