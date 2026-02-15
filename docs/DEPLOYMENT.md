# Deployment-Strategie: NeuroForge
**Version:** 1.0  
**Datum:** 15. Februar 2026

---

## 3-Stufen-Deployment

```
Stufe 1: LOKAL (Entwicklung)
   npm run dev → localhost:5173
   Fuer: Kleine Aenderungen, Beautification, schnelles Testen
   Base-Pfad: /

        ↓  git add + commit + push

Stufe 2: GITHUB PAGES (Test/Staging)
   Automatisch bei push auf main
   URL: https://grischan15.github.io/Quest_Board/
   Fuer: Groessere Features, halber Tag Arbeit, Browser-Test
   Base-Pfad: /Quest_Board/

        ↓  Manuell: GitHub → Actions → "Deploy to ALL-INKL" → Run workflow

Stufe 3: ALL-INKL (Produktion)
   Manuell ausgeloest per GitHub Action
   URL: https://apps.p3coaching.de/quest-board/
   Fuer: Stabile Features die oeffentlich gezeigt werden koennen
   Base-Pfad: /quest-board/
```

## Wann welche Stufe?

| Situation | Stufe |
|-----------|-------|
| CSS-Fix, kleiner Bugfix | 1 → lokal testen, dann push (Stufe 2 automatisch) |
| Neues Feature (halber Tag) | 1 → entwickeln, push → 2 → testen auf GitHub Pages |
| Feature stabil, zeigbar | 2 → manuell auf 3 deployen |
| Hotfix fuer Produktion | 1 → fix, push → 2 → kurz testen → sofort auf 3 |

## Technische Umsetzung

### vite.config.js (dynamischer Base-Pfad)

Die Environment-Variable `DEPLOY_TARGET` steuert den Base-Pfad:

| DEPLOY_TARGET | Base-Pfad | Wann |
|---------------|-----------|------|
| nicht gesetzt | `/Quest_Board/` | GitHub Pages (Default bei push) |
| `allinkl` | `/quest-board/` | ALL-INKL Action |
| development mode | `/` | Lokaler Dev-Server |

### GitHub Workflows

**`.github/workflows/deploy.yml`** (bestehend)
- Trigger: Automatisch bei push auf main
- Baut mit Default-Base (`/Quest_Board/`)
- Deployed auf GitHub Pages

**`.github/workflows/deploy-to-allinkl.yml`** (neu)
- Trigger: Nur manuell (workflow_dispatch)
- Baut mit `DEPLOY_TARGET=allinkl` (`/quest-board/`)
- Deployed per FTP auf ALL-INKL

### GitHub Secrets (im Repo angelegt)

| Secret | Zweck |
|--------|-------|
| `FTP_SERVER` | ALL-INKL Serveradresse |
| `FTP_USERNAME` | FTP-Benutzername |
| `FTP_PASSWORD` | FTP-Passwort |

### ALL-INKL Server-Struktur

```
/apps.p3coaching.de/
├── quest-board/        ← NeuroForge (Stufe 3)
├── [naechste-app]/     ← Zukuenftige Apps
└── index.html          ← Spaeter: Landing Page
```

## Manuelles Deployment ausloesen

1. GitHub → Quest_Board Repo
2. Tab **"Actions"**
3. Links: **"Deploy to ALL-INKL"** auswaehlen
4. Rechts: **"Run workflow"** → Branch main → **"Run workflow"**
5. Warten bis gruen → Live auf apps.p3coaching.de/quest-board/

## Fuer neue Apps wiederverwenden

Gleicher Workflow fuer jede neue App:

1. Neues Repo anlegen
2. Gleiche 3 GitHub Secrets anlegen (gleicher FTP-User)
3. `deploy-to-allinkl.yml` kopieren, `server-dir` anpassen (z.B. `/reise-planer/`)
4. `vite.config.js` mit DEPLOY_TARGET Pattern uebernehmen

---

*Referenz: ALL-INKL Deployment Guide in `20_how_to_wissen/`*
