# 🌳 SKILL-MATRIX: Quest Board v1.0
## Vordefinierte Skills für den Skill-Tree

**Version:** 1.0  
**Datum:** 11. Februar 2026  
**Quelle:** Abgeleitet aus Lernplan v4.1, Craving Log, Reise-Planer

---

## REGELN

1. Skills sind vordefiniert – Chris wählt bei "Done" aus dieser Liste
2. Skills können später MANUELL ergänzt werden (F25 in Stufe 2)
3. Ein Skill kann durch MEHRERE Tasks gelernt werden (verstärkt sich)
4. Status: `learned` (mindestens 1 Task) oder `open` (noch kein Task)
5. `learnedFrom` speichert Array von Task-IDs die den Skill gelehrt haben

---

## SKILL-KATEGORIEN

### 🎨 FRONTEND (8 Skills)

| ID | Skill | Status | Gelernt durch |
|----|-------|--------|---------------|
| fe-01 | React Grundlagen (Components, Props, State) | ✅ learned | P3 Craving Log |
| fe-02 | Vite Build System | ✅ learned | P3 Craving Log |
| fe-03 | Component Architecture (Wiederverwendbare Teile) | ✅ learned | P3 Craving Log |
| fe-04 | P3 Design System (Farben, Fonts, Buttons) | ✅ learned | P3 Craving Log |
| fe-05 | Drag & Drop (dnd-kit) | ⬜ open | - |
| fe-06 | State Management (Context API / Zustand) | ⬜ open | - |
| fe-07 | Responsive / Desktop Layout | ⬜ open | - |
| fe-08 | Tailwind CSS | ⬜ open | - |

### 🔧 DEVOPS & DEPLOYMENT (7 Skills)

| ID | Skill | Status | Gelernt durch |
|----|-------|--------|---------------|
| dev-01 | Git & GitHub (Repos, Commits, Push) | ✅ learned | Alle Projekte |
| dev-02 | Capacitor APK Build | ✅ learned | P3 Craving Log |
| dev-03 | Claude Code CLI Workflow | ✅ learned | Reise-Planer |
| dev-04 | GitHub Actions CI/CD | ✅ learned | Reise-Planer |
| dev-05 | GitHub Pages Deployment | ✅ learned | Reise-Planer |
| dev-06 | Testing (Unit / Integration) | ⬜ open | - |
| dev-07 | Performance & Lighthouse Audit | ⬜ open | - |

### 📐 ARCHITEKTUR & PLANUNG (6 Skills)

| ID | Skill | Status | Gelernt durch |
|----|-------|--------|---------------|
| arch-01 | Anforderungsanalyse (PRD schreiben) | ⬜ open | - |
| arch-02 | App Flow Dokumentation | ⬜ open | - |
| arch-03 | Ordnerstruktur & Code-Organisation | ✅ learned | P3 Craving Log |
| arch-04 | localStorage Patterns | ✅ learned | P3 Craving Log |
| arch-05 | Datenmodell-Design | ⬜ open | - |
| arch-06 | Neurodivergenz-UI Patterns | ⬜ open | - |

### 🗄️ BACKEND & DATENBANK (6 Skills)

| ID | Skill | Status | Gelernt durch |
|----|-------|--------|---------------|
| be-01 | Supabase Setup & Grundlagen | ⬜ open | - |
| be-02 | SQL Grundlagen (CRUD) | ⬜ open | - |
| be-03 | Authentication (Login/Auth) | ⬜ open | - |
| be-04 | API Design & REST | ⬜ open | - |
| be-05 | Realtime / WebSocket | ⬜ open | - |
| be-06 | Row Level Security | ⬜ open | - |

### 🤖 AUTOMATION & KI (5 Skills)

| ID | Skill | Status | Gelernt durch |
|----|-------|--------|---------------|
| auto-01 | n8n Workflow Grundlagen | ⬜ open | - |
| auto-02 | Webhook / API Integration | ⬜ open | - |
| auto-03 | MCP Konzepte & Setup | ⬜ open | - |
| auto-04 | KI-Prompt Engineering (Vibe Coding) | ✅ learned | Alle Projekte |
| auto-05 | Multi-Agenten Workflows | ⬜ open | - |

### 📱 MOBILE & PWA (3 Skills)

| ID | Skill | Status | Gelernt durch |
|----|-------|--------|---------------|
| mob-01 | Capacitor Grundlagen | ✅ learned | P3 Craving Log |
| mob-02 | PWA (Service Worker, Offline) | ⬜ open | - |
| mob-03 | App Store Submission | ⬜ open | - |

---

## ZUSAMMENFASSUNG

| Kategorie | Gelernt | Gesamt | Prozent |
|-----------|---------|--------|---------|
| 🎨 Frontend | 4 | 8 | 50% |
| 🔧 DevOps | 5 | 7 | 71% |
| 📐 Architektur | 2 | 6 | 33% |
| 🗄️ Backend | 0 | 6 | 0% |
| 🤖 Automation | 1 | 5 | 20% |
| 📱 Mobile | 1 | 3 | 33% |
| **TOTAL** | **13** | **35** | **37%** |

---

## DATENFORMAT FÜR QUEST BOARD

```javascript
// So wird die Skill-Matrix in localStorage gespeichert
{
  "skills": [
    {
      "id": "fe-01",
      "name": "React Grundlagen",
      "category": "frontend",
      "categoryLabel": "🎨 Frontend",
      "status": "learned",        // "learned" | "open"
      "learnedFrom": ["task-uuid-1", "task-uuid-2"],
      "predefined": true          // false = manuell hinzugefügt
    },
    {
      "id": "fe-05",
      "name": "Drag & Drop (dnd-kit)",
      "category": "frontend",
      "categoryLabel": "🎨 Frontend",
      "status": "open",
      "learnedFrom": [],
      "predefined": true
    }
  ]
}
```

---

## ERWEITERUNG

Wenn Chris bei "Done" einen Skill braucht der nicht in der Liste steht:
- V1: In diesem Dokument manuell ergänzen, Skill-Matrix neu laden
- V2 (Stufe 2): [+ Skill hinzufügen] Button direkt im Skill-Check-Modal

---

*Dieses Dokument ist die Single Source of Truth für die initiale Skill-Befüllung.*
