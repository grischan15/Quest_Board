# 🧠 NEURODIVERGENZ UI GUIDELINES
## HSP & ADHS-optimiertes Design für P3 Apps

**Version:** 1.0  
**Datum:** 25. Dezember 2025  
**Anwendung:** Alle Track C Apps (Task-Management) + P3 Coaching Apps

---

## 🎯 ZIEL DIESES DOKUMENTS

Design-Regeln für Apps, die von neurodivergenten Menschen (HSP, ADHS) genutzt werden. Diese Guidelines ergänzen das P3 Corporate Design System.

> "Design für das empfindsamste Gehirn, 
> und alle anderen profitieren auch."

---

## 1. GRUNDPRINZIPIEN

### 1.1 HSP (Hochsensible Personen)

| Bedürfnis | UI-Lösung |
|-----------|-----------|
| Reizreduktion | Wenige Elemente, viel Whitespace |
| Sanfte Übergänge | Keine harten Animationen |
| Ruhige Farben | Gedämpfte, natürliche Töne |
| Keine Überraschungen | Vorhersehbare Interaktionen |
| Kontrollierbare Umgebung | Einstellungen für Anpassungen |

### 1.2 ADHS

| Bedürfnis | UI-Lösung |
|-----------|-----------|
| Fokus-Unterstützung | Klare visuelle Hierarchie |
| Dopamin-Boosts | Erfolgsfeedback, Micro-Animationen |
| Schnelle Erfassung | Scanbare Layouts |
| Externe Struktur | Klare Kategorisierung |
| Vermeidung von Overwhelm | Progressives Disclosure |

### 1.3 Gemeinsame Prinzipien

```
╔═══════════════════════════════════════════════════════════════════╗
║                    NEURO-DESIGN PRINZIPIEN                         ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║   1. WENIGER IST MEHR                                              ║
║      → Nur das Nötigste anzeigen                                  ║
║      → Features progressiv einführen                              ║
║                                                                    ║
║   2. KLARHEIT VOR KREATIVITÄT                                     ║
║      → Eindeutige Labels                                          ║
║      → Bekannte Patterns verwenden                                ║
║                                                                    ║
║   3. KONTROLLE BEIM USER                                          ║
║      → Anpassbare Einstellungen                                   ║
║      → Keine Auto-Play Elemente                                   ║
║                                                                    ║
║   4. SANFTES FEEDBACK                                             ║
║      → Positive Verstärkung                                       ║
║      → Keine aggressiven Alerts                                   ║
║                                                                    ║
║   5. KONSISTENZ ÜBERALL                                           ║
║      → Gleiche Patterns wiederholen                               ║
║      → Vorhersehbares Verhalten                                   ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 2. FARBEN

### 2.1 Neurodivergenz-Palette (Erweiterung zu P3)

```javascript
// Ergänzung zu p3-design-system.js

export const NEURO_COLORS = {
  // Beruhigende Hintergründe (HSP-freundlich)
  backgrounds: {
    calm: '#f8f9fa',       // Fast-Weiß, nicht grell
    warm: '#faf8f5',       // Warmes Off-White
    cool: '#f5f8fa',       // Kühles Off-White
  },
  
  // Fokus-Farben (ADHS-freundlich)
  focus: {
    highlight: '#fff3cd',  // Sanftes Gelb für Aufmerksamkeit
    active: '#e8f4f8',     // Hellblau für aktive Elemente
  },
  
  // Feedback-Farben (gedämpft, nicht aggressiv)
  feedback: {
    success: '#d4edda',    // Sanftes Grün
    successText: '#155724',
    warning: '#fff3cd',    // Sanftes Gelb
    warningText: '#856404',
    error: '#f8d7da',      // Sanftes Rosa (nicht Rot!)
    errorText: '#721c24',
    info: '#d1ecf1',       // Sanftes Cyan
    infoText: '#0c5460',
  },
  
  // Quadranten-Farben (Eisenhower, gedämpft)
  quadrants: {
    q1_urgent_important: '#ffcccb',  // Gedämpftes Rot
    q2_important: '#c8e6c9',         // Gedämpftes Grün
    q3_urgent: '#fff9c4',            // Gedämpftes Gelb
    q4_neither: '#e0e0e0',           // Neutrales Grau
  },
  
  // Energie-Level (für Task-Planung)
  energy: {
    high: '#c8e6c9',       // Grün - Volle Power
    medium: '#fff9c4',     // Gelb - Normal
    low: '#ffccbc',        // Orange - Schonmodus
  }
};
```

### 2.2 Farb-Regeln

| Regel | Begründung | Beispiel |
|-------|------------|----------|
| **Kein reines Weiß (#fff)** | Zu grell, strengt Augen an | Stattdessen: #f8f9fa |
| **Kein reines Schwarz (#000)** | Zu hart, hoher Kontrast | Stattdessen: #25313a (P3 Blue) |
| **Kein knalliges Rot** | Triggert Stress-Response | Stattdessen: #ffcccb oder P3 Red gedämpft |
| **Pastelltöne für Flächen** | Beruhigend, reduziert Reize | Siehe NEURO_COLORS |
| **Satte Farben nur für CTAs** | Lenkt Fokus | P3 Red für primäre Buttons |

### 2.3 Kontrast-Empfehlungen

```
TEXTE:
  Normaler Text:    #25313a auf #f8f9fa  (Ratio: ~12:1) ✓
  Sekundärer Text:  #6c757d auf #f8f9fa  (Ratio: ~5:1)  ✓
  
INTERAKTIVE ELEMENTE:
  Buttons:          Minimum 4.5:1 Kontrast
  Links:            Unterstrichen ODER farbig, nicht beides
  
FEHLER VERMEIDEN:
  ❌ Grauer Text auf grauem Hintergrund
  ❌ Pastellfarben für wichtige Infos
  ❌ Nur Farbe als Unterscheidungsmerkmal
```

---

## 3. TYPOGRAFIE

### 3.1 Schrift-Einstellungen

```css
/* Neurodivergenz-optimierte Typografie */

:root {
  /* Basis-Schriftgröße größer als üblich */
  font-size: 18px;  /* Statt 16px Standard */
  
  /* Großzügiger Zeilenabstand */
  line-height: 1.6;  /* Statt 1.4-1.5 */
  
  /* Wortabstand leicht erhöht */
  word-spacing: 0.05em;
}

/* Überschriften */
h1, h2, h3 {
  font-weight: 600;  /* Nicht zu fett */
  letter-spacing: -0.01em;
  margin-bottom: 0.75em;
}

/* Fließtext */
p {
  max-width: 65ch;  /* Optimale Lesebreite */
  margin-bottom: 1.5em;
}
```

### 3.2 Typografie-Regeln

| Regel | Begründung | Umsetzung |
|-------|------------|-----------|
| **Große Basis-Schrift** | Leichter zu lesen | Min. 16px, besser 18px |
| **Großzügiger Zeilenabstand** | Zeilen nicht verwechseln | Line-height: 1.6+ |
| **Begrenzte Zeilenlänge** | Fokus halten | Max. 65-75 Zeichen |
| **Klare Hierarchie** | Scanbarkeit | Deutliche Größenunterschiede |
| **Keine Textwände** | Overwhelm vermeiden | Absätze, Listen, Whitespace |

### 3.3 Schriftarten-Empfehlung

```
EMPFOHLEN:
✓ Avenir (P3 Corporate)
✓ Inter (Google Fonts, sehr lesbar)
✓ System-UI Stack (native, performant)

VERMEIDEN:
✗ Dünne Schriften (Light, Thin)
✗ Dekorative Schriften
✗ Zu enge Schriften (Condensed)
✗ ALLCAPS für längere Texte
```

---

## 4. LAYOUT & SPACING

### 4.1 Whitespace-Regeln

```
╔═══════════════════════════════════════════════════════════════════╗
║                    WHITESPACE GUIDELINES                           ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║   MINIMUM ABSTÄNDE:                                                ║
║                                                                    ║
║   ┌─────────────────────────────────────────────────────┐         ║
║   │                     24px margin                      │         ║
║   │  ┌─────────────────────────────────────────────┐    │         ║
║   │  │                                             │    │         ║
║   │  │     Content                                 │    │         ║
║   │  │                                             │    │         ║
║   │  │                 16px padding                │    │         ║
║   │  │                                             │    │         ║
║   │  └─────────────────────────────────────────────┘    │         ║
║   │                                                      │         ║
║   │                     16px gap                         │         ║
║   │                                                      │         ║
║   │  ┌─────────────────────────────────────────────┐    │         ║
║   │  │     Nächstes Element                        │    │         ║
║   │  └─────────────────────────────────────────────┘    │         ║
║   └─────────────────────────────────────────────────────┘         ║
║                                                                    ║
║   FAUSTREGEL: Im Zweifel MEHR Whitespace, nicht weniger           ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 4.2 Spacing-Skala

```javascript
// Konsistente Spacing-Skala
export const SPACING = {
  xs: '4px',    // Minimaler Abstand
  sm: '8px',    // Kleine Elemente
  md: '16px',   // Standard
  lg: '24px',   // Gruppen trennen
  xl: '32px',   // Sektionen trennen
  xxl: '48px',  // Hauptbereiche
};
```

### 4.3 Touch-Targets

```
MINIMALE TOUCH-ZIELE:

┌──────────────────────────────────────────┐
│                                          │
│   Buttons:        min. 44px × 44px       │
│   Checkboxes:     min. 44px × 44px       │
│   List Items:     min. 48px Höhe         │
│   Links in Text:  ausreichend Padding    │
│                                          │
│   ABSTAND zwischen Touch-Targets:        │
│   min. 8px (besser 16px)                 │
│                                          │
└──────────────────────────────────────────┘

BEGRÜNDUNG:
- Feinmotorik kann bei Stress/ADHS beeinträchtigt sein
- Versehentliche Taps frustrieren
- Großzügige Targets = weniger Stress
```

---

## 5. ANIMATIONEN & BEWEGUNG

### 5.1 Animation-Regeln

| Typ | HSP-freundlich | ADHS-freundlich | Empfehlung |
|-----|----------------|-----------------|------------|
| **Erfolgs-Animation** | Sanft | ✓ Dopamin-Boost | Kurz, subtil (200-300ms) |
| **Lade-Spinner** | Langsam rotierend | - | Skeleton bevorzugen |
| **Seitenwechsel** | Fade, kein Slide | - | 150-200ms Fade |
| **Auto-Play** | ❌ Nie | ❌ Ablenkend | Immer user-initiated |
| **Parallax** | ❌ Übelkeit | ❌ Ablenkend | Vermeiden |
| **Blinkende Elemente** | ❌ Überfordernd | ❌ Ablenkend | Nie verwenden |

### 5.2 Akzeptable Animationen

```css
/* Sanfte, akzeptable Animationen */

/* Fade-In für neue Elemente */
.fade-in {
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Sanftes Highlight bei Erfolg */
.success-highlight {
  animation: successPulse 300ms ease-out;
}

@keyframes successPulse {
  0% { background-color: transparent; }
  50% { background-color: #d4edda; }
  100% { background-color: transparent; }
}

/* Checkbox-Erfolg */
.checkbox-success {
  animation: checkmark 200ms ease-out;
}

@keyframes checkmark {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

### 5.3 Prefers-Reduced-Motion

```css
/* IMMER respektieren! */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. FORMULARE & INPUTS

### 6.1 Input-Design

```
╔═══════════════════════════════════════════════════════════════════╗
║                    NEURODIVERGENZ INPUT-DESIGN                     ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║   GUTES INPUT:                                                     ║
║   ┌────────────────────────────────────────────────────┐          ║
║   │ Label (immer sichtbar, nicht nur Placeholder)      │          ║
║   ├────────────────────────────────────────────────────┤          ║
║   │                                                    │          ║
║   │   [Input-Feld mit großem Padding]                 │          ║
║   │                                                    │          ║
║   ├────────────────────────────────────────────────────┤          ║
║   │ Hilfetext (optional, immer sichtbar)               │          ║
║   └────────────────────────────────────────────────────┘          ║
║                                                                    ║
║   SCHLECHTES INPUT:                                                ║
║   ┌────────────────────────────────────────────────────┐          ║
║   │ Placeholder als Label (verschwindet!)              │          ║
║   └────────────────────────────────────────────────────┘          ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 6.2 Formular-Regeln

| Regel | Begründung | Umsetzung |
|-------|------------|-----------|
| **Labels über Inputs** | Immer sichtbar | Floating Labels vermeiden |
| **Großes Padding** | Leichter zu treffen | min. 12px |
| **Klare Fokus-States** | Wissen wo man ist | Deutlicher Rahmen |
| **Inline-Validierung** | Sofortiges Feedback | Keine überraschenden Fehler |
| **Keine Auto-Korrektur** | Frustriert bei Eigennamen | autocorrect="off" |
| **Ein Feld pro Zeile** | Übersichtlichkeit | Horizontal nur bei kurzen Feldern |

### 6.3 Fehler-Kommunikation

```
❌ SCHLECHT:
   "Fehler in Zeile 3"
   (Rot, blinkend, oben auf der Seite)

✓ GUT:
   "Bitte gib einen Titel ein"
   (Sanftes Rosa, direkt unter dem Feld)
   
✓ NOCH BESSER:
   "Der Titel hilft dir, die Aufgabe später wiederzufinden."
   (Als Hilfetext VOR dem Fehler)
```

---

## 7. FEEDBACK & BESTÄTIGUNGEN

### 7.1 Erfolgs-Feedback (Dopamin!)

```
╔═══════════════════════════════════════════════════════════════════╗
║                    DOPAMIN-FREUNDLICHES FEEDBACK                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║   BEI TASK ERLEDIGT:                                              ║
║                                                                    ║
║   1. Checkbox animiert (kurzes Scale-Up)                          ║
║   2. Zeile bekommt grünen Highlight-Flash                         ║
║   3. Task wird durchgestrichen                                    ║
║   4. Optional: Sanfter Sound (user-konfigurierbar)                ║
║                                                                    ║
║   KEIN:                                                            ║
║   ✗ Konfetti-Explosion                                            ║
║   ✗ Lauter Fanfaren-Sound                                         ║
║   ✗ Popup "Super gemacht!"                                        ║
║                                                                    ║
║   WARUM?                                                           ║
║   → Zu viel Stimulation überfordert HSP                           ║
║   → Wird bei ADHS schnell ignoriert (Gewöhnung)                  ║
║   → Subtiles Feedback bleibt wirksam                              ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 7.2 Bestätigungs-Dialoge

```
WANN BESTÄTIGUNG NÖTIG:
✓ Löschen (unwiderruflich)
✓ Versenden (E-Mail, Nachricht)
✓ Veröffentlichen

WANN KEINE BESTÄTIGUNG:
✗ Speichern (Auto-Save besser)
✗ Verschieben (Undo besser)
✗ Markieren als erledigt (Undo besser)

DIALOG-DESIGN:
┌─────────────────────────────────────────┐
│                                         │
│   Aufgabe wirklich löschen?            │
│                                         │
│   Diese Aktion kann nicht rückgängig   │
│   gemacht werden.                       │
│                                         │
│   [Abbrechen]     [Ja, löschen]        │
│                                         │
└─────────────────────────────────────────┘

REGELN:
- Destruktive Aktion RECHTS (nicht primary-farbig!)
- Abbrechen immer möglich
- Klare Sprache, keine Doppelverneinung
```

---

## 8. KOGNITIVE LAST REDUZIEREN

### 8.1 Progressives Disclosure

```
STATT ALLES AUF EINMAL:

┌─────────────────────────────────────────┐
│ Neue Aufgabe                            │
│                                         │
│ Titel: [________________]               │
│ Beschreibung: [________________]        │
│ Fällig am: [________________]           │
│ Priorität: [________________]           │
│ Projekt: [________________]             │
│ Tags: [________________]                │
│ Erinnerung: [________________]          │
│ Wiederholung: [________________]        │
│ ... (noch 10 Felder)                    │
└─────────────────────────────────────────┘

BESSER - PROGRESSIV:

SCHRITT 1:
┌─────────────────────────────────────────┐
│ Neue Aufgabe                            │
│                                         │
│ Was möchtest du erledigen?              │
│ [________________]                      │
│                                         │
│ [Speichern]   [+ Mehr Optionen]        │
└─────────────────────────────────────────┘

SCHRITT 2 (nur wenn geklickt):
┌─────────────────────────────────────────┐
│ Weitere Details                         │
│                                         │
│ Quadrant: [Dropdown]                    │
│ Rolle: [Dropdown]                       │
│                                         │
└─────────────────────────────────────────┘
```

### 8.2 Sinnvolle Defaults

| Feld | Default | Begründung |
|------|---------|------------|
| Quadrant | Q1 (Dringend & Wichtig) | Sicherste Annahme |
| Status | Aktiv | Sofort sichtbar |
| Fälligkeitsdatum | Leer | Nicht jede Task braucht eins |
| Energie-Level | Medium | Neutrale Mitte |

### 8.3 Undo statt Bestätigung

```
STATT:
"Bist du sicher?" → [Ja] [Nein]

BESSER:
[Aktion ausgeführt]
┌─────────────────────────────────────────┐
│ ✓ Aufgabe verschoben     [Rückgängig]   │
└─────────────────────────────────────────┘
(Toast für 5 Sekunden, dann ausblenden)
```

---

## 9. EINSTELLUNGEN & PERSONALISIERUNG

### 9.1 Empfohlene Optionen

```
EINSTELLUNGEN FÜR NEURODIVERGENZ:

□ Reduzierte Animationen
□ Höherer Kontrast
□ Größere Schrift
□ Sounds aktivieren
  □ Bei Task erledigt
  □ Bei Erinnerung
□ Erledigte Tasks
  ○ Sofort ausblenden
  ○ Nach 1 Stunde ausblenden
  ○ Durchgestrichen anzeigen
□ Dark Mode (automatisch / manuell / aus)
```

### 9.2 Respektiere System-Einstellungen

```javascript
// System-Präferenzen abfragen

// Reduzierte Bewegung
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Dark Mode
const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;

// Hoher Kontrast
const prefersHighContrast = window.matchMedia(
  '(prefers-contrast: high)'
).matches;
```

---

## 10. CHECKLISTE FÜR NEURODIVERGENZ-DESIGN

### Vor dem Design

- [ ] Zielgruppe definiert (HSP, ADHS, beides?)
- [ ] Kern-Funktion identifiziert (was ist das Wichtigste?)
- [ ] Weniger Features = bessere UX

### Während des Designs

- [ ] Farben aus NEURO_COLORS Palette?
- [ ] Kein reines Weiß/Schwarz?
- [ ] Genug Whitespace?
- [ ] Touch-Targets min. 44px?
- [ ] Labels über Inputs?
- [ ] Klare visuelle Hierarchie?

### Animationen

- [ ] Keine Auto-Play Animationen?
- [ ] Alle Animationen < 300ms?
- [ ] prefers-reduced-motion respektiert?
- [ ] Erfolgs-Feedback subtil aber spürbar?

### Feedback

- [ ] Fehler sanft kommuniziert?
- [ ] Erfolge positiv verstärkt?
- [ ] Undo statt Bestätigung wo möglich?

### Kognitive Last

- [ ] Progressives Disclosure wo sinnvoll?
- [ ] Sinnvolle Defaults gesetzt?
- [ ] Nicht mehr als 3-5 Optionen gleichzeitig?

### Barrierefreiheit

- [ ] Keyboard-Navigation möglich?
- [ ] Kontrast mindestens 4.5:1?
- [ ] Focus-States sichtbar?

---

## 📚 REFERENZEN

- **P3 Design System:** `p3-design-system.js`
- **Task-Management PRD:** `Task_Management_System_PRD_v1.0.md`
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

*Version 1.0 | 25. Dezember 2025 | Für alle P3 Coaching & Task-Management Apps*
