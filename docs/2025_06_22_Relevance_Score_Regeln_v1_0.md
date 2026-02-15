# Relevance Score – Priorisierungsformel
**Ursprung:** Juni 2025 – Airtable Task-Management  
**Status:** Archiviert – Konzept teilweise in NeuroForge uebernommen  
**Bezug:** NeuroForge ROADMAP.md → Priorisierungslogik

---

## Kontext

Diese Formel wurde fuer die automatische Priorisierung von Tasks in Airtable entwickelt. In NeuroForge wird stattdessen die manuelle Eisenhower-Matrix verwendet, aber die Denklogik hinter dem Score bleibt als Referenz wertvoll.

## Kernidee

Der Relevance Score beruecksichtigt drei Faktoren:

1. **Wichtigkeit** (1-6, wobei 1 = hoechste Prioritaet)
2. **Verfuegbare Zeit** bis zur Deadline (unter Beruecksichtigung von Dependencies)
3. **Generelle Vorlaufzeit** von 7 Tagen als Puffer

## Berechnung

### Schritt 1: Verfuegbare Zeit
```
Verfuegbare_Zeit = Deadline - (Heute + Dependency_Duration + Aufwand)
```

### Schritt 2: Prioritaets-Faktor (Wichtigkeit umkehren)
```
Prioritaets_Faktor = 7 - Wichtigkeit
```
Wichtigkeit 1 ergibt Faktor 6 (hoechste Prioritaet), Wichtigkeit 6 ergibt Faktor 1.

### Schritt 3: Score

**Ueberfaellig** (Verfuegbare_Zeit > 0):
```
Score = Prioritaets_Faktor × 100
```

**Noch Zeit** (Verfuegbare_Zeit ≤ 0):
```
Score = MAX(1, (7 - ABS(Verfuegbare_Zeit))) × Prioritaets_Faktor
```

## Score-Bereiche

| Score | Bedeutung |
|-------|-----------|
| 500-600 | Ueberfaellig, sehr wichtig (Wichtigkeit 1-2) |
| 300-400 | Ueberfaellig, wichtig (Wichtigkeit 3-4) |
| 100-200 | Ueberfaellig, weniger wichtig (Wichtigkeit 5-6) |
| 30-42 | Dringend (1-2 Tage, hohe Wichtigkeit) |
| 6-30 | Normale Prioritaet |
| 1-5 | Niedrig (viel Zeit oder unwichtig) |

## Relevanz fuer NeuroForge

In NeuroForge wird die Priorisierung manuell ueber die Eisenhower-Quadranten geloest:
- **Q1 Sofort Erledigen** entspricht Score 100+ (ueberfaellig/dringend+wichtig)
- **Q2 Einplanen** entspricht Score 6-30 (wichtig, nicht dringend)
- **Q3 Delegieren** entspricht dringend aber unwichtig
- **Q4 Eliminieren** entspricht Score 1-5

Die manuelle Zuordnung ist fuer Neurodivergenz besser geeignet als eine automatische Formel, weil sie Kontext und Bauchgefuehl einbezieht statt rein numerisch zu priorisieren.

## Moegliche Zukunftsanwendung

Falls NeuroForge spaeter eine Datenbank bekommt (Supabase), koennte eine vereinfachte Version des Relevance Score als "Auto-Sort" im Eisenhower-Backlog dienen – z.B. Tasks innerhalb eines Quadranten automatisch nach Faelligkeit sortieren.

---

*Originalversion: 22. Juni 2025*  
*Archiviert: Februar 2026*
