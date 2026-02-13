import './HelpPage.css';

function EnergyDayCurve() {
  // SVG energy curve for a typical neurodivergent day
  const w = 700;
  const h = 220;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  // Energy data points (hour, energy 0-100)
  const points = [
    [6, 20], [7, 35], [8, 55], [9, 80], [10, 90], [11, 85],
    [12, 60], [13, 40], [14, 45], [15, 55], [16, 65], [17, 60],
    [18, 45], [19, 35], [20, 25], [21, 15],
  ];

  const xScale = (hour) => pad.left + ((hour - 6) / 15) * cw;
  const yScale = (energy) => pad.top + ch - (energy / 100) * ch;

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p[0])} ${yScale(p[1])}`)
    .join(' ');

  // Smooth curve using quadratic bezier
  let smoothD = `M ${xScale(points[0][0])} ${yScale(points[0][1])}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (xScale(prev[0]) + xScale(curr[0])) / 2;
    smoothD += ` Q ${cpx} ${yScale(prev[1])}, ${xScale(curr[0])} ${yScale(curr[1])}`;
  }

  // Fill area
  const areaD = smoothD + ` L ${xScale(21)} ${yScale(0)} L ${xScale(6)} ${yScale(0)} Z`;

  // Zone labels with quest type recommendations
  const zones = [
    { x1: 8, x2: 11.5, label: 'Focus Zone', color: '#2196F3', y: 95 },
    { x1: 11.5, x2: 13, label: 'Input', color: '#4CAF50', y: 55 },
    { x1: 13, x2: 14.5, label: 'Routine', color: '#FF9800', y: 40 },
    { x1: 14.5, x2: 17, label: 'Create', color: '#9C27B0', y: 62 },
    { x1: 18, x2: 21, label: 'Reflect', color: '#00BCD4', y: 30 },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="energy-curve-svg">
      {/* Grid lines */}
      {[25, 50, 75].map((e) => (
        <line key={e} x1={pad.left} y1={yScale(e)} x2={w - pad.right} y2={yScale(e)}
          stroke="#e8e8e6" strokeWidth="1" strokeDasharray="4,4" />
      ))}

      {/* Zone backgrounds */}
      {zones.map((z, i) => (
        <rect key={i} x={xScale(z.x1)} y={pad.top}
          width={xScale(z.x2) - xScale(z.x1)} height={ch}
          fill={z.color} opacity="0.06" rx="4" />
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#energyGradient)" opacity="0.3" />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c60a0f" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c60a0f" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main curve */}
      <path d={smoothD} fill="none" stroke="#c60a0f" strokeWidth="2.5" strokeLinecap="round" />

      {/* Zone labels */}
      {zones.map((z, i) => (
        <text key={i} x={(xScale(z.x1) + xScale(z.x2)) / 2} y={yScale(z.y) - 10}
          textAnchor="middle" fontSize="10" fontWeight="600" fill={z.color}>
          {z.label}
        </text>
      ))}

      {/* Y axis label */}
      <text x={pad.left - 8} y={pad.top + 2} textAnchor="end" fontSize="9" fill="#999">Hoch</text>
      <text x={pad.left - 8} y={pad.top + ch} textAnchor="end" fontSize="9" fill="#999">Tief</text>

      {/* X axis: hours */}
      {[6, 8, 10, 12, 14, 16, 18, 20].map((hour) => (
        <g key={hour}>
          <line x1={xScale(hour)} y1={pad.top + ch} x2={xScale(hour)} y2={pad.top + ch + 5} stroke="#ccc" />
          <text x={xScale(hour)} y={pad.top + ch + 18} textAnchor="middle" fontSize="10" fill="#888">
            {hour}:00
          </text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={w / 2} y={h - 2} textAnchor="middle" fontSize="10" fill="#aaa">Tageszeit</text>
      <text x={12} y={h / 2} textAnchor="middle" fontSize="10" fill="#aaa"
        transform={`rotate(-90, 12, ${h / 2})`}>Energie</text>
    </svg>
  );
}

export default function HelpPage() {
  return (
    <div className="help-wrapper">
      <div className="help-content">
        <h2 className="help-title">Wie funktioniert NeuroForge?</h2>

        <section className="help-section">
          <h3 className="help-section-title">Das Konzept: Quest &ndash; Skill &ndash; Projekt</h3>
          <p className="help-text">
            NeuroForge basiert auf drei Bausteinen, die aufeinander aufbauen:
          </p>
          <div className="help-cards">
            <div className="help-card">
              <div className="help-card-icon">&#9889;</div>
              <div className="help-card-title">Quest</div>
              <div className="help-card-desc">
                Eine konkrete Aufgabe mit klarem Ergebnis.
                Dauert <strong>15&ndash;45 Minuten</strong>.
                Bringt XP f&uuml;r deine Skills.
              </div>
            </div>
            <div className="help-card">
              <div className="help-card-icon">&#127795;</div>
              <div className="help-card-title">Skill</div>
              <div className="help-card-desc">
                Eine F&auml;higkeit, die durch Quests w&auml;chst.
                Level 0&ndash;5 (Locked bis Master).
                XP sammeln sich automatisch.
              </div>
            </div>
            <div className="help-card">
              <div className="help-card-icon">&#127942;</div>
              <div className="help-card-title">Projekt</div>
              <div className="help-card-desc">
                Ein Endprodukt, das Skills auf bestimmtem Level
                voraussetzt. Wird freigeschaltet wenn
                die Anforderungen erf&uuml;llt sind.
              </div>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Der Workflow</h3>
          <div className="help-steps">
            <div className="help-step">
              <span className="help-step-num">1</span>
              <div>
                <strong>Backlog</strong> &ndash; Neue Quests landen hier.
                Ordne sie in die Eisenhower-Matrix ein:
                Q1 (dringend+wichtig), Q2 (wichtig), Q3 (dringend), Q4 (weder noch).
              </div>
            </div>
            <div className="help-step">
              <span className="help-step-num">2</span>
              <div>
                <strong>Kanban</strong> &ndash; Deine Hauptansicht. Links siehst du
                deinen priorisierten Backlog (Q1 + Q2), rechts den Arbeitsfluss.
                Starte Quests direkt und arbeite sie durch die Spalten.
                <br />
                <em>Covey-Prinzip: ~80% Q1 (dringende Arbeit) + ~20% Q2
                (&quot;S&auml;ge sch&auml;rfen&quot; &ndash; Prozesse verbessern, Skills aufbauen).</em>
              </div>
            </div>
            <div className="help-step">
              <span className="help-step-num">3</span>
              <div>
                <strong>Done</strong> &ndash; Wenn ein Quest fertig ist, ordnest du Skills zu.
                Die XP des Quests werden auf die Skills verteilt.
                Konfetti! &#127881;
              </div>
            </div>
            <div className="help-step">
              <span className="help-step-num">4</span>
              <div>
                <strong>Skill-Tree</strong> &ndash; Hier siehst du deinen Fortschritt.
                Skills leveln automatisch durch gesammelte XP.
              </div>
            </div>
          </div>
        </section>

        <section className="help-section help-section-covey">
          <h3 className="help-section-title">Das Prinzip: Covey &times; Eisenhower &times; Pareto</h3>
          <p className="help-text">
            NeuroForge basiert auf der Kombination von drei bew&auml;hrten Methoden,
            die zusammen ein extrem kraftvolles System f&uuml;r Selbstmanagement bilden.
          </p>

          <div className="covey-pillars">
            <div className="covey-pillar">
              <div className="covey-pillar-icon">&#128218;</div>
              <div className="covey-pillar-title">Covey: 7 Wege zur Effektivit&auml;t</div>
              <div className="covey-pillar-desc">
                Stephen R. Coveys &quot;The 7 Habits of Highly Effective People&quot;
                definiert Gewohnheiten f&uuml;r den Weg von Abh&auml;ngigkeit zu Unabh&auml;ngigkeit.
                F&uuml;r NeuroForge sind zwei Wege zentral:
              </div>
              <div className="covey-habits">
                <div className="covey-habit">
                  <strong>Weg 2:</strong> &quot;Beginne mit dem Ende im Sinn&quot; &ndash;
                  Definiert, was &uuml;berhaupt &quot;wichtig&quot; ist (deine langfristigen Ziele und dein Skill-Tree).
                </div>
                <div className="covey-habit">
                  <strong>Weg 3:</strong> &quot;Das Wichtigste zuerst&quot; (Put First Things First) &ndash;
                  Ordne Aufgaben nach <em>Wichtigkeit</em> statt Dringlichkeit.
                  Das ist der Kern des Zeitmanagements.
                </div>
              </div>
            </div>

            <div className="covey-pillar">
              <div className="covey-pillar-icon">&#128200;</div>
              <div className="covey-pillar-title">Eisenhower-Matrix (4 Quadranten)</div>
              <div className="covey-pillar-desc">
                Covey hat die Eisenhower-Matrix popul&auml;r gemacht, um Weg 3 umzusetzen.
                NeuroForge nutzt sie als Backlog:
              </div>
              <div className="covey-quadrants">
                <div className="covey-q covey-q1">
                  <strong>Q1: Wichtig &amp; Dringend</strong>
                  <span>Tun! Krisen, Deadlines, akute Probleme.</span>
                </div>
                <div className="covey-q covey-q2">
                  <strong>Q2: Wichtig &amp; Nicht dringend</strong>
                  <span>Planen! Pr&auml;vention, Weiterbildung, Beziehungen.
                  Der &quot;Quadrant der Qualit&auml;t&quot; &ndash; hier sollte dein Fokus liegen.</span>
                </div>
                <div className="covey-q covey-q3">
                  <strong>Q3: Dringend &amp; Nicht wichtig</strong>
                  <span>Delegieren. Unterbrechungen, unwichtige Meetings.</span>
                </div>
                <div className="covey-q covey-q4">
                  <strong>Q4: Weder noch</strong>
                  <span>Eliminieren. Zeitverschwender, triviale T&auml;tigkeiten.</span>
                </div>
              </div>
            </div>

            <div className="covey-pillar">
              <div className="covey-pillar-icon">&#127919;</div>
              <div className="covey-pillar-title">Pareto: Das 80/20-Prinzip</div>
              <div className="covey-pillar-desc">
                80% der Ergebnisse kommen durch 20% des Aufwands.
                Die entscheidende Frage:
              </div>
              <div className="covey-pareto-highlight">
                Welche 20% deiner Aufgaben bringen 80% deines Erfolgs?
                <br />
                <em>Diese Aufgaben findest du fast immer in Quadrant 2.</em>
              </div>
            </div>
          </div>

          <h4 className="help-subsection-title">Wie es in NeuroForge zusammenwirkt</h4>
          <div className="covey-flow">
            <div className="covey-flow-step">
              <span className="covey-flow-num">1</span>
              <div>
                <strong>Ziel setzen</strong> (Covey Weg 2) &ndash;
                Dein Skill-Tree definiert, wohin du willst.
                Was ist dein &quot;Ende im Sinn&quot;?
              </div>
            </div>
            <div className="covey-flow-step">
              <span className="covey-flow-num">2</span>
              <div>
                <strong>Identifizieren</strong> (80/20) &ndash;
                Welche 20% deiner Quests bringen 80% Skill-Wachstum?
                Das sind deine Q2-Quests: Skills aufbauen, Prozesse verbessern,
                Wissen vertiefen.
              </div>
            </div>
            <div className="covey-flow-step">
              <span className="covey-flow-num">3</span>
              <div>
                <strong>Einordnen</strong> (Eisenhower) &ndash;
                Neue Quests landen im Backlog.
                Q1 = die dringende Arbeit (~80% deiner Zeit).
                Q2 = &quot;S&auml;ge sch&auml;rfen&quot; (~20% deiner Zeit).
              </div>
            </div>
            <div className="covey-flow-step">
              <span className="covey-flow-num">4</span>
              <div>
                <strong>Umsetzen</strong> (Covey Weg 3) &ndash;
                Im Kanban siehst du Q1 + Q2 direkt links.
                Starte das Wichtigste zuerst.
                Die Covey-Ratio-Bar zeigt dein Verh&auml;ltnis.
              </div>
            </div>
          </div>

          <div className="covey-saw-box">
            <div className="covey-saw-icon">&#129690;</div>
            <div className="covey-saw-content">
              <div className="covey-saw-title">&quot;Die S&auml;ge sch&auml;rfen&quot; (Covey Weg 7)</div>
              <div className="covey-saw-text">
                Wer nur dringend arbeitet (Q1), brennt aus.
                Q2-Quests sind die Investition in dich selbst:
                Neues lernen, besser werden, Werkzeuge verbessern.
                <strong> Ohne Q2 wird Q1 immer gr&ouml;&szlig;er.</strong>
                <br /><br />
                Das Mini-Backlog im Kanban erinnert dich st&auml;ndig daran:
                Nimm dir 20% der Zeit f&uuml;r Q2 &ndash; auch wenn es nicht brennt.
              </div>
            </div>
          </div>

          <div className="covey-links">
            <div className="covey-links-title">Weiterlesen</div>
            <div className="covey-links-list">
              <a href="https://www.franklincovey.com/the-7-habits/" target="_blank" rel="noopener noreferrer">
                FranklinCovey &ndash; The 7 Habits
              </a>
              <a href="https://de.wikipedia.org/wiki/Eisenhower-Prinzip" target="_blank" rel="noopener noreferrer">
                Wikipedia &ndash; Eisenhower-Prinzip
              </a>
              <a href="https://de.wikipedia.org/wiki/Paretoprinzip" target="_blank" rel="noopener noreferrer">
                Wikipedia &ndash; Paretoprinzip (80/20)
              </a>
              <a href="https://www.landsiedel-seminare.de/coaching-welt/wissen/zeitmanagement/80-20-regel.html" target="_blank" rel="noopener noreferrer">
                Landsiedel &ndash; 80/20 Regel &amp; Eisenhower
              </a>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">XP &amp; Level-System</h3>
          <div className="help-table-wrap">
            <table className="help-table">
              <thead>
                <tr>
                  <th>XP-Stufe</th>
                  <th>Wert</th>
                  <th>Bedeutung</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Rezeptiv</td><td>30 XP</td><td>Lesen, anschauen, verstehen</td></tr>
                <tr><td>Reproduktiv</td><td>50 XP</td><td>Nachbauen, anwenden mit Vorlage</td></tr>
                <tr><td>Produktiv</td><td>80 XP</td><td>Selbst erstellen, eigene L&ouml;sung</td></tr>
              </tbody>
            </table>
          </div>
          <div className="help-table-wrap">
            <table className="help-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Name</th>
                  <th>Ben&ouml;tigte XP</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>0</td><td>Locked</td><td>0</td></tr>
                <tr><td>1</td><td>Novice</td><td>1</td></tr>
                <tr><td>2</td><td>Apprentice</td><td>100</td></tr>
                <tr><td>3</td><td>Journeyman</td><td>250</td></tr>
                <tr><td>4</td><td>Expert</td><td>500</td></tr>
                <tr><td>5</td><td>Master</td><td>800</td></tr>
              </tbody>
            </table>
          </div>
          <div className="help-table-wrap">
            <table className="help-table">
              <thead>
                <tr>
                  <th>Dauer</th>
                  <th>Typ</th>
                  <th>Wann</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>~15 Min</td><td>Sprint</td><td>Kurzes Zeitfenster, schneller Einstieg</td></tr>
                <tr><td>~30 Min</td><td>Kurz</td><td>Standard-Quest, ein Pomodoro</td></tr>
                <tr><td>~45 Min</td><td>Lang</td><td>Deep Work, komplexe Aufgaben</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Quest-Typen (Energie-Level)</h3>
          <p className="help-text">
            Jeder Quest hat einen Energie-Typ. Das hilft dir, passende Aufgaben
            f&uuml;r dein aktuelles Energielevel zu finden &ndash; egal ob du programmierst,
            lernst oder ganz andere Dinge tust:
          </p>
          <div className="help-types-grid">
            <div className="help-type-card" style={{ borderLeftColor: '#2196F3' }}>
              <div className="help-type-header">
                <span className="help-type-icon">&#9889;</span>
                <span className="help-type-name">Focus</span>
                <span className="help-type-energy">Hohe Energie, klarer Kopf</span>
              </div>
              <div className="help-type-examples">
                <span className="help-type-example-label">Coding:</span> Neue Features implementieren, Algorithmen schreiben
                <br />
                <span className="help-type-example-label">Schule:</span> Mathe-Aufgaben rechnen, Physik-Probleme l&ouml;sen
              </div>
            </div>
            <div className="help-type-card" style={{ borderLeftColor: '#4CAF50' }}>
              <div className="help-type-header">
                <span className="help-type-icon">&#128214;</span>
                <span className="help-type-name">Input</span>
                <span className="help-type-energy">Mittlere Energie, aufnehmen</span>
              </div>
              <div className="help-type-examples">
                <span className="help-type-example-label">Coding:</span> Dokumentation lesen, Tutorial anschauen
                <br />
                <span className="help-type-example-label">Schule:</span> Lehrbuch-Kapitel lesen, Erkl&auml;rvideo schauen
              </div>
            </div>
            <div className="help-type-card" style={{ borderLeftColor: '#9C27B0' }}>
              <div className="help-type-header">
                <span className="help-type-icon">&#127912;</span>
                <span className="help-type-name">Create</span>
                <span className="help-type-energy">Kreative Energie</span>
              </div>
              <div className="help-type-examples">
                <span className="help-type-example-label">Coding:</span> UI/UX Design, Architektur skizzieren
                <br />
                <span className="help-type-example-label">Schule:</span> Aufsatz schreiben, Plakat gestalten
              </div>
            </div>
            <div className="help-type-card" style={{ borderLeftColor: '#FF9800' }}>
              <div className="help-type-header">
                <span className="help-type-icon">&#128295;</span>
                <span className="help-type-name">Routine</span>
                <span className="help-type-energy">Niedrige Energie, mechanisch</span>
              </div>
              <div className="help-type-examples">
                <span className="help-type-example-label">Coding:</span> Dependencies updaten, Config anpassen, Dateien aufr&auml;umen
                <br />
                <span className="help-type-example-label">Schule:</span> Heft ordnen, Karteikarten sortieren, Vokabeln abschreiben
              </div>
            </div>
            <div className="help-type-card" style={{ borderLeftColor: '#00BCD4' }}>
              <div className="help-type-header">
                <span className="help-type-icon">&#9997;&#65039;</span>
                <span className="help-type-name">Reflect</span>
                <span className="help-type-energy">Ruhige Energie, reflektiv</span>
              </div>
              <div className="help-type-examples">
                <span className="help-type-example-label">Coding:</span> Code Review, Doku schreiben, Retro-Notizen
                <br />
                <span className="help-type-example-label">Schule:</span> Lerntagebuch, Zusammenfassung schreiben, Selbsttest
              </div>
            </div>
          </div>
          <p className="help-text">
            Im Backlog kannst du nach Typ filtern: &quot;Ich hab wenig Energie &ndash;
            was kann ich trotzdem machen?&quot; &rarr; Filter auf Routine.
          </p>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Energie-Tagesverlauf</h3>
          <p className="help-text">
            Ein typischer Tag hat Hoch- und Tiefphasen. Nutze die richtige
            Quest-Art zur richtigen Zeit &ndash; k&auml;mpfe nicht gegen dein Gehirn,
            arbeite mit ihm:
          </p>
          <div className="energy-curve-container">
            <EnergyDayCurve />
          </div>
          <div className="energy-legend">
            <span className="energy-legend-item" style={{ '--legend-color': '#2196F3' }}>
              &#9889; Focus &ndash; Vormittags-Peak
            </span>
            <span className="energy-legend-item" style={{ '--legend-color': '#4CAF50' }}>
              &#128214; Input &ndash; Sp&auml;tvormittag
            </span>
            <span className="energy-legend-item" style={{ '--legend-color': '#FF9800' }}>
              &#128295; Routine &ndash; Mittagstief
            </span>
            <span className="energy-legend-item" style={{ '--legend-color': '#9C27B0' }}>
              &#127912; Create &ndash; Nachmittagswelle
            </span>
            <span className="energy-legend-item" style={{ '--legend-color': '#00BCD4' }}>
              &#9997;&#65039; Reflect &ndash; Abend-Ausklang
            </span>
          </div>
          <p className="help-text help-text-hint">
            Tipp: Dein pers&ouml;nlicher Rhythmus kann anders aussehen!
            Das Dashboard (kommt bald) wird aus deinen echten Daten eine
            individuelle Energiekurve berechnen.
          </p>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Farb-Code der Quest-Karten</h3>
          <p className="help-text">
            Jede Quest-Karte zeigt dir auf einen Blick, was sie ist:
          </p>
          <div className="help-color-grid">
            <div className="help-color-item">
              <div className="help-color-demo help-color-demo-type" style={{ borderTopColor: '#2196F3' }}>
                <span>&#9889; Focus</span>
              </div>
              <div className="help-color-label">
                <strong>Farbiger Rand oben</strong> = Energie-Typ.
                Blau (Focus), Gr&uuml;n (Input), Lila (Create), Orange (Routine), Cyan (Reflect).
              </div>
            </div>
            <div className="help-color-item">
              <div className="help-color-demo help-color-demo-fastlane">
                <span>&#9889; Mein Quest</span>
              </div>
              <div className="help-color-label">
                <strong>Roter Rahmen + roter Schatten</strong> = Fast Lane.
                Der Quest wurde per Wildcard in die Fast Lane gezogen.
                Doppelte rote Umrandung = Achtung, Impuls-Quest!
              </div>
            </div>
            <div className="help-color-item">
              <div className="help-color-demo help-color-demo-done-fast">
                <span>&#10003; Erledigt</span>
              </div>
              <div className="help-color-label">
                <strong>Roter linker Rand</strong> im Done-Bereich = war ein Fast-Lane Quest.
                So siehst du im R&uuml;ckblick, welche Quests Impuls-Entscheidungen waren.
              </div>
            </div>
            <div className="help-color-item">
              <div className="help-color-demo">
                <span className="help-color-due help-color-due-soon">Bis: 15.02.</span>
                <span className="help-color-due help-color-due-overdue">Bis: 10.02.</span>
              </div>
              <div className="help-color-label">
                <strong>Gelb</strong> = bald f&auml;llig (unter 3 Tage).
                <strong>Rot</strong> = &uuml;berf&auml;llig.
              </div>
            </div>
            <div className="help-color-item">
              <div className="help-color-demo">
                <span className="help-color-xp">80 XP</span>
                <span className="help-color-skills">&#10003; 2 Skills</span>
              </div>
              <div className="help-color-label">
                <strong>Gr&uuml;n</strong> = XP-Wert und zugeordnete Skills.
              </div>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Kanban-Flow: Vom Start bis Done</h3>
          <p className="help-text">
            Die vier Spalten im Kanban bilden einen bew&auml;hrten Arbeitsfluss ab &ndash;
            egal ob du Software baust oder f&uuml;r eine Pr&uuml;fung lernst:
          </p>
          <div className="help-flow-grid">
            <div className="help-flow-card">
              <div className="help-flow-icon">&#128193;</div>
              <div className="help-flow-header">
                <span className="help-flow-name">Vorbereiten</span>
                <span className="help-flow-alt">Sammeln &amp; Planen</span>
              </div>
              <div className="help-flow-examples">
                <span className="help-type-example-label">Coding:</span> Anforderungen kl&auml;ren, Tickets aufteilen, Branch anlegen
                <br />
                <span className="help-type-example-label">Schule:</span> Lernstoff zusammenstellen, Kapitel markieren, Lernplan erstellen
              </div>
            </div>
            <div className="help-flow-card">
              <div className="help-flow-icon">&#128187;</div>
              <div className="help-flow-header">
                <span className="help-flow-name">Entwickeln</span>
                <span className="help-flow-alt">Aktiv bearbeiten</span>
              </div>
              <div className="help-flow-examples">
                <span className="help-type-example-label">Coding:</span> Code schreiben, Bugs fixen, Features implementieren
                <br />
                <span className="help-type-example-label">Schule:</span> Aufgaben l&ouml;sen, Zusammenfassung schreiben, Mind-Map erstellen
              </div>
            </div>
            <div className="help-flow-card">
              <div className="help-flow-icon">&#128269;</div>
              <div className="help-flow-header">
                <span className="help-flow-name">Testing Intern</span>
                <span className="help-flow-alt">Selbst pr&uuml;fen</span>
              </div>
              <div className="help-flow-examples">
                <span className="help-type-example-label">Coding:</span> Eigene Tests schreiben, Code Review vorbereiten, manuell testen
                <br />
                <span className="help-type-example-label">Schule:</span> Sich selbst abfragen, Karteikarten durchgehen, Probe-Aufgaben ohne Hilfe l&ouml;sen
              </div>
            </div>
            <div className="help-flow-card">
              <div className="help-flow-icon">&#129514;</div>
              <div className="help-flow-header">
                <span className="help-flow-name">Testing Extern</span>
                <span className="help-flow-alt">Fremd pr&uuml;fen</span>
              </div>
              <div className="help-flow-examples">
                <span className="help-type-example-label">Coding:</span> Code Review durch Kollegen, QA-Testing, Staging-Test
                <br />
                <span className="help-type-example-label">Schule:</span> Lernpartner fragt dich ab, Eltern pr&uuml;fen, Probetest unter Zeitdruck
              </div>
            </div>
          </div>
          <p className="help-text help-text-hint">
            Didaktik-Hintergrund: Die Phasen &quot;Selbst pr&uuml;fen&quot; und &quot;Fremd pr&uuml;fen&quot;
            basieren auf dem Prinzip der <em>Retrieval Practice</em> &ndash; aktives Abrufen
            ist nachweislich effektiver als passives Wiederholen.
          </p>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Fast Lane (Wildcards)</h3>
          <p className="help-text">
            F&uuml;r den ADHS-Moment: <em>&quot;Das will ich JETZT machen!&quot;</em>
          </p>
          <p className="help-text">
            Die Fast Lane ist eine Einbahnstrasse &ndash; ein Quest der dort landet,
            kann nicht mehr zur&uuml;ck. Du hast ein t&auml;gliches Limit an Wildcards
            (Standard: 2/Tag, einstellbar in den Settings).
            Das sch&uuml;tzt davor, den ganzen Tag nur Impulsen zu folgen.
          </p>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Universal einsetzbar</h3>
          <p className="help-text">
            NeuroForge funktioniert f&uuml;r jeden Lernkontext. Du kannst eigene
            Skill-Kategorien anlegen und Skills importieren &ndash; z.B.:
          </p>
          <div className="help-context-grid">
            <div className="help-context-card">
              <div className="help-context-icon">&#128187;</div>
              <div className="help-context-title">Softwareentwicklung</div>
              <div className="help-context-desc">
                Kategorien: Frontend, Backend, DevOps, Architektur
                <br />
                Skills: React, SQL, Git, CI/CD, ...
              </div>
            </div>
            <div className="help-context-card">
              <div className="help-context-icon">&#127891;</div>
              <div className="help-context-title">Schule (z.B. Physik Kl. 10)</div>
              <div className="help-context-desc">
                Kategorien: Mechanik, Optik, Elektrizit&auml;t, W&auml;rmelehre
                <br />
                Skills: Newtonsche Gesetze, Ohmsches Gesetz, ...
              </div>
            </div>
            <div className="help-context-card">
              <div className="help-context-icon">&#127760;</div>
              <div className="help-context-title">Sprachen lernen</div>
              <div className="help-context-desc">
                Kategorien: Grammatik, Wortschatz, H&ouml;rverstehen, Schreiben
                <br />
                Skills: Pr&auml;sens, Vergangenheitsformen, ...
              </div>
            </div>
          </div>
          <p className="help-text help-text-hint">
            Beim Skill-Import werden neue Kategorien automatisch angelegt.
            Einfach CSV/JSON mit einer &quot;category&quot;-Spalte importieren.
          </p>
        </section>

        <section className="help-section help-section-neuro">
          <h3 className="help-section-title">Warum dieses Design?</h3>
          <h4 className="help-subsection-title">Optimiert f&uuml;r neurodivergente Gehirne</h4>
          <p className="help-text">
            NeuroForge wurde speziell f&uuml;r Menschen mit ADHS und/oder
            Hochsensibilit&auml;t (HSP) entwickelt. Jede Designentscheidung folgt
            diesen Prinzipien:
          </p>
          <div className="help-neuro-grid">
            <div className="help-neuro-item">
              <div className="help-neuro-label">Fokus-Unterst&uuml;tzung</div>
              <div className="help-neuro-desc">
                WIP-Limits verhindern Overload. Maximal 2-3 aktive Quests
                gleichzeitig. Die Kanban-Ansicht zeigt nur das N&ouml;tigste.
              </div>
            </div>
            <div className="help-neuro-item">
              <div className="help-neuro-label">Dopamin-Feedback</div>
              <div className="help-neuro-desc">
                XP-System, Level-Ups, Konfetti bei Done, sichtbarer Fortschritt.
                Jeder kleine Schritt wird belohnt &ndash; nicht nur das gro&szlig;e Ziel.
              </div>
            </div>
            <div className="help-neuro-item">
              <div className="help-neuro-label">Reizreduktion</div>
              <div className="help-neuro-desc">
                Sanfte Farben, viel Whitespace, keine aggressiven Animationen.
                Das Board respektiert <code>prefers-reduced-motion</code>.
              </div>
            </div>
            <div className="help-neuro-item">
              <div className="help-neuro-label">Impulskontrolle</div>
              <div className="help-neuro-desc">
                Die Fast Lane gibt dem &quot;Das will ich JETZT!&quot; einen sicheren Raum &ndash;
                mit Tageslimit, damit du nicht den ganzen Tag nur Impulsen folgst.
              </div>
            </div>
            <div className="help-neuro-item">
              <div className="help-neuro-label">Externe Struktur</div>
              <div className="help-neuro-desc">
                Eisenhower-Matrix + Kanban geben dir die Struktur, die
                neurodivergente Gehirne oft nicht selbst erzeugen k&ouml;nnen.
              </div>
            </div>
            <div className="help-neuro-item">
              <div className="help-neuro-label">15&ndash;45 Min Quests</div>
              <div className="help-neuro-desc">
                Jede Aufgabe ist bewusst klein gehalten.
                Sprint (15 Min) f&uuml;r den schnellen Einstieg,
                gibt trotzdem ein Erfolgserlebnis.
              </div>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h3 className="help-section-title">Tastenkombinationen</h3>
          <div className="help-shortcuts">
            <div className="help-shortcut">
              <kbd>Esc</kbd>
              <span>Aktuelles Fenster schliessen</span>
            </div>
            <div className="help-shortcut">
              <kbd>Enter</kbd>
              <span>Formular absenden</span>
            </div>
          </div>
        </section>

        <div className="help-footer">
          NeuroForge v2.5 &middot; Deine Quest-Schmiede &middot; P3 Performance Partners
        </div>
      </div>
    </div>
  );
}
