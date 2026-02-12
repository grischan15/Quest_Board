# ROADMAP: Quest Board
## Wohin geht die Reise?

**Zuletzt aktualisiert:** 12. Februar 2026

---

## 🐛 BEKANNTE BUGS

### BUG-001: Backup-Restore überschreibt neue predefined Skills

**Status:** Offen  
**Entdeckt:** 12.02.2026  
**Priorität:** Hoch (blockiert sauberen Workflow)

**Problem:**  
Wenn ein Backup wiederhergestellt wird (Import → Wiederherstellen → JSON), überschreibt die Restore-Funktion **alle** Skills komplett mit den Daten aus dem Backup. Neue predefined Skills aus `skillsData.js`, die nach dem Backup-Zeitpunkt hinzugefügt wurden, gehen dabei verloren.

**Reproduktion:**
1. App hat Skills aus `skillsData.js` (z.B. 38 Skills inkl. dev-08, dev-09, dev-10)
2. User hat ein älteres Backup (z.B. mit nur 35 Skills, ohne dev-08/09/10)
3. User stellt Backup wieder her → Wiederherstellen-Tab → JSON hochladen
4. **Ergebnis:** Skill Tree zeigt nur die 35 alten Skills, die 3 neuen fehlen
5. **Erwartet:** Skill Tree zeigt 38 Skills – alte Task-Daten wiederhergestellt + neue predefined Skills ergänzt

**Root Cause:**  
Die Restore-Logik setzt `localStorage` Skills 1:1 auf die Backup-Daten, ohne gegen `initialSkills` aus `skillsData.js` zu mergen.

**Lösungsansatz:**  
Beim Restore einen Merge durchführen:

```
Restore-Logik (Pseudocode):
1. Lade Backup-Skills (aus JSON)
2. Lade aktuelle predefined Skills (aus skillsData.js → initialSkills)
3. Für jeden predefined Skill:
   a. Existiert er im Backup? → Backup-Version übernehmen (behält status, learnedAt etc.)
   b. Existiert er NICHT im Backup? → Als neuen 'open' Skill hinzufügen
4. Für jeden NICHT-predefined Skill im Backup (custom/user-created):
   → Übernehmen wie er ist
5. Ergebnis in localStorage speichern
```

**Betroffene Datei(en):**  
Vermutlich die Import/Restore-Logik – muss im Code lokalisiert werden (wahrscheinlich in einer Komponente wie `ImportModal` oder `BackupRestore` oder direkt im `useStorage` Hook).

**Wichtig:** Dieser Bug betrifft auch das geplante Feature "Skill-Editor" – wenn User eigene Skills erstellen können, muss der Merge auch custom Skills korrekt behandeln.

---

## KURZFRISTIG (Feinschliff MVP)

- [ ] **BUG-001 fixen** (Restore-Merge statt Overwrite)
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
| 12.02.2026 | BUG-001 dokumentiert | Restore überschreibt predefined Skills statt zu mergen |

---

*Diese Datei wird bei Strategiediskussionen und Planungsänderungen aktualisiert.*
