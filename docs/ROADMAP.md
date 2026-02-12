# ROADMAP: Quest Board
## Wohin geht die Reise?

**Zuletzt aktualisiert:** 12. Februar 2026

---

## KURZFRISTIG (Feinschliff MVP)

- [ ] Browser-Testing & Feinschliff
- [x] GitHub Pages Deployment mit GitHub Actions
- [ ] Analytics/Auswertung basierend auf Historie-Daten
- [ ] **Skill-Editor in der App** (Skills manuell hinzufügen, bearbeiten, löschen)
- [ ] **Eigene Skill-Kategorien erstellen** (Name + Icon wählbar)

---

## MITTELFRISTIG (Nächste Features)

### 1. Skills generalisieren

**Problem:** Aktuell sind 35 App-Entwicklung Skills hardcoded in `skillsData.js`. Das Board soll aber auch für andere Bereiche und Menschen nutzbar sein.

**Optionen:**

| Option | Beschreibung | Aufwand | Flexibilität |
|--------|-------------|---------|-------------|
| **A) Skill-Sets/Profile** | Vordefinierte Sets (App Dev, Projektmanagement, Coaching, etc.). User wählt beim Start. | Mittel | Mittel |
| **B) Komplett custom** | User erstellt eigene Skills + Kategorien komplett frei. Keine Vorlagen. | Hoch | Hoch |
| **C) Hybrid** | Vordefinierte Sets als Startvorlagen + eigene Skills/Kategorien ergänzbar und löschbar. | Hoch | Sehr hoch |

**Offene Fragen:**
- Soll das Quest Board nur für mich sein oder auch für andere Personen?
- Braucht es einen "Skill-Editor" in der App oder reicht es die `skillsData.js` direkt zu editieren?
- Sollen Skill-Sets exportierbar/teilbar sein (z.B. Coaching-Skills als JSON-Template)?

**Status:** Entschieden → **Option C (Hybrid)** — Vordefinierte Skills als Startvorlage + manuell eigene Skills und Kategorien in der App ergänzbar. Kein Code-Edit nötig für neue Skills.

**Umsetzung (geplant):**
- Skill Tree bekommt "+" Button zum Hinzufügen neuer Skills
- Kategorie-Dropdown mit "Neue Kategorie erstellen" Option
- Neue Kategorien: Name + Icon (Emoji-Picker oder Auswahl)
- Alle manuell erstellten Skills/Kategorien werden im localStorage gespeichert
- Export/Import unterstützt auch custom Skills + Kategorien

---

### 2. Datenbank statt localStorage

**Problem:** Daten liegen nur im Browser. Bei Browser-Wechsel, Gerätewechsel oder Datenverlust sind die Daten weg (nur Export/Import als Backup).

**Ziel:** Persistente Datenbank, geräteübergreifend.

**Optionen:**

| Option | Beschreibung | Vorteile | Nachteile |
|--------|-------------|----------|-----------|
| **Supabase** | PostgreSQL + Auth + Realtime. Steht als Skill-Lernziel. | Lerneffekt, kostenloser Tier, RLS | Dependency auf externen Dienst |
| **Firebase** | Google Cloud. Firestore + Auth. | Einfaches Setup, gute Docs | Google Lock-in, NoSQL |
| **Eigenes Backend** | z.B. Express + SQLite/PostgreSQL | Volle Kontrolle | Hosting nötig, mehr Aufwand |
| **localStorage beibehalten** | Status Quo mit Export/Import | Kein Server nötig, einfach | Nicht geräteübergreifend |

**Abhängigkeiten:**
- Wenn Skills für andere Menschen nutzbar sein sollen → Auth nötig → DB nötig
- Wenn nur für mich → localStorage + Export/Import reicht evtl.

**Offene Fragen:**
- Single-User (nur ich) oder Multi-User?
- Brauchen andere User eigene Boards oder teilen sie sich eines?
- Soll die App offline-fähig bleiben (PWA + DB-Sync)?
- Supabase als Lernprojekt nutzen?

**Status:** Noch nicht entschieden

---

## LANGFRISTIG (Ideen)

- [ ] PWA mit Offline-Support (Service Worker)
- [ ] Mobile App via Capacitor
- [ ] Erweiterte Analytics (Burndown Charts, Velocity, Skill-Wachstum über Zeit)
- [ ] Benachrichtigungen bei überfälligen Tasks
- [ ] Dark Mode
- [ ] Coaching-Modus (Skill-Sets für Klienten zuweisen)

---

## ENTSCHEIDUNGSLOG

| Datum | Entscheidung | Begründung |
|-------|-------------|-----------|
| 11.02.2026 | MVP mit localStorage | Schneller Start, kein Backend nötig |
| 11.02.2026 | Schema-Versionierung | Zukunftssicher für Datenmodell-Änderungen |
| 11.02.2026 | Export/Import als Backup | Überbrückung bis DB-Lösung steht |
| 11.02.2026 | Neurodivergenz-UI Guidelines | HSP/ADHS-optimiertes Design als Grundprinzip |
| 12.02.2026 | Skills Hybrid-Ansatz (Option C) | Manuelles Hinzufügen von Skills + Kategorien in der App, keine Code-Änderung nötig |
| 12.02.2026 | 3 neue DevOps Skills | DNS, SSL, FTP Deployment als predefined Skills hinzugefügt |

---

*Diese Datei wird bei Strategiediskussionen und Planungsänderungen aktualisiert.*
