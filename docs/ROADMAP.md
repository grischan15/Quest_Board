# ROADMAP: Quest Board
## Wohin geht die Reise?

**Zuletzt aktualisiert:** 12. Februar 2026

---

## 📐 KONZEPT-DOKUMENT

> **→ [Quest-Skill-Projekt Konzept v1.0](Quest_Skill_Projekt_Konzept_v1_0.md)**
>
> Definiert das komplette Hybrid-System mit:
> - Abgrenzungsregeln: Quest vs Skill vs Projekt
> - XP-System (30/50/80) und Skill-Level (0-5)
> - Quest-Typen mit Energie-Kategorien (Code/Learn/Design/Config/Write)
> - WIP-Limits, Fast Lane Regeln, Wildcard-Tageslimit
> - Intake-Flow für neue Ideen + KI-Import-Template
> - Inkrementelle Umsetzungs-Roadmap (9 Schritte)
>
> **Dieses Dokument ist die Referenz für die Claude Code CLI Umsetzung.**

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

## KURZFRISTIG (v2.0 – Gamification)

Umsetzung gemäß [Konzept v1.0](Quest_Skill_Projekt_Konzept_v1_0.md), Abschnitt 9:

- [ ] **BUG-001 fixen** (Restore-Merge statt Overwrite)
- [ ] **Schritt 1:** Quest-Typ Feld + Farbcoding auf TaskCard
- [ ] **Schritt 2:** XP-System auf Quest + Berechnung auf Skill
- [ ] **Schritt 3:** Skill-Level statt binär (Migration v4→v5)
- [ ] **Schritt 4:** WIP-Limits auf Kanban-Spalten
- [ ] **Schritt 5:** Wildcard-Limit (Tageszähler + Settings)
- [ ] **Schritt 8:** Energie-Filter im Backlog
- [ ] **Schritt 9:** Duration-Feld + Timer-Anzeige
- [ ] **Skill-Editor in der App** (Skills manuell hinzufügen, bearbeiten, löschen)
- [ ] **Eigene Skill-Kategorien erstellen** (Name + Icon wählbar)

---

## MITTELFRISTIG (v3.0 – Projekte & KI)

- [ ] **Schritt 6:** Projekte als Unlock-Ziele im Skill-Tree
- [ ] **Schritt 7:** KI-Import-Template (Prompt + JSON-Schema)
- [ ] Analytics/Auswertung basierend auf Historie-Daten + XP-Verlauf
- [ ] Browser-Testing & Feinschliff

### Datenbank statt localStorage

**Problem:** Daten liegen nur im Browser. Bei Browser-Wechsel, Gerätewechsel oder Datenverlust sind die Daten weg (nur Export/Import als Backup).

**Status:** Bewusst aufgeschoben – localStorage reicht für Single-User. Datenbank-Migration ist selbst ein **Projekt im System** (Skills: `be-01` Supabase Setup, `be-02` SQL Grundlagen).

**Entscheidung:** Wenn das Gamification-System stabil läuft und du das Board öffnen willst → Supabase als Lernprojekt. Der Skill "Datenbank" wird dabei natürlich im eigenen Quest Board getrackt. 🔄

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
| 12.02.2026 | Skills Hybrid-Ansatz (Option C) | Manuelles Hinzufügen von Skills + Kategorien in der App |
| 12.02.2026 | 3 neue DevOps Skills | DNS, SSL, FTP Deployment als predefined Skills |
| 12.02.2026 | BUG-001 dokumentiert | Restore überschreibt predefined Skills statt zu mergen |
| **12.02.2026** | **Modell 3 (Hybrid-System)** | **Quest-Skill-Projekt Abgrenzung definiert. XP-Level statt binär. Single-User. Quest 30-45min. Konzept v1.0 erstellt.** |
| **12.02.2026** | **DB bewusst aufgeschoben** | **localStorage reicht für Single-User. DB-Migration wird eigenes Projekt im System (Meta-Level).** |
| **12.02.2026** | **Kanban-Spalten beibehalten** | **5 Spalten (Vorbereiten→Entwickeln→Testing Intern→Testing Extern→Done) sind gebaut und passen für Software-Quests.** |

---

*Diese Datei wird bei Strategiediskussionen und Planungsänderungen aktualisiert.*
