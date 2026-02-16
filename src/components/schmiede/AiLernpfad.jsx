import { useState, useRef } from 'react';
import { AI_PROMPT_TEMPLATE, EXAMPLE_TEMPLATES } from '../../data/aiPromptTemplate';
import { getLevelLabel } from '../../data/questTypes';
import './AiLernpfad.css';

export default function AiLernpfad({ categories, skills, projects, isDemo, onImportJson, importReview }) {
  const [copied, setCopied] = useState(false);
  const [bestandCopied, setBestandCopied] = useState(false);
  const [activeExample, setActiveExample] = useState(null);
  const [exampleCopied, setExampleCopied] = useState(null);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const [mergeSkills, setMergeSkills] = useState(true);
  const [importStats, setImportStats] = useState(null);
  const fileInputRef = useRef(null);

  function handleCopyPrompt() {
    navigator.clipboard.writeText(AI_PROMPT_TEMPLATE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadPrompt() {
    const blob = new Blob([AI_PROMPT_TEMPLATE], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neuroforge-ki-prompt.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopyExample(example) {
    const fullPrompt = AI_PROMPT_TEMPLATE + '\n\n---\n\n## Mein Lernziel:\n\n' + example.prompt;
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setExampleCopied(example.id);
      setTimeout(() => setExampleCopied(null), 2000);
    });
  }

  function handleDownloadExample(example) {
    const fullPrompt = AI_PROMPT_TEMPLATE + '\n\n---\n\n## Mein Lernziel:\n\n' + example.prompt;
    const blob = new Blob([fullPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroforge-prompt-${example.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function generateBestandMarkdown() {
    const sortedCats = [...categories].sort((a, b) => a.order - b.order);
    let md = '## Mein aktueller NeuroForge-Bestand\n\n';

    md += '### Kategorien & Skills\n';
    for (const cat of sortedCats) {
      const catSkills = skills.filter((s) => s.category === cat.id && !s.hidden);
      if (catSkills.length === 0) continue;
      const skillList = catSkills
        .map((s) => `${s.name} (Lv.${s.level || 0})`)
        .join(', ');
      md += `- ${cat.icon} ${cat.label} (ID: ${cat.id}): ${skillList}\n`;
    }

    if (projects && projects.length > 0) {
      md += '\n### Projekte\n';
      for (const proj of projects) {
        const reqs = (proj.requirements || [])
          .map((r) => {
            const skill = skills.find((s) => s.id === r.skillId);
            return skill ? `${skill.name} Lv.${r.requiredLevel}` : null;
          })
          .filter(Boolean)
          .join(', ');
        md += `- ${proj.icon || '\uD83D\uDCCC'} ${proj.name}${reqs ? ` (braucht: ${reqs})` : ''}\n`;
      }
    }

    md += '\nBitte beruecksichtige diese existierenden Kategorien und Skills.\n';
    return md;
  }

  function handleCopyBestand() {
    const md = generateBestandMarkdown();
    navigator.clipboard.writeText(md).then(() => {
      setBestandCopied(true);
      setTimeout(() => setBestandCopied(false), 2000);
    });
  }

  function resolveIndexRef(prefix, placeholderPrefix, ref, maxIndex) {
    if (typeof ref === 'string' && ref.startsWith(prefix)) {
      const idx = parseInt(ref.replace(prefix, ''), 10);
      if (idx >= 0 && idx < maxIndex) return `${placeholderPrefix}${idx}`;
    }
    return ref;
  }

  function parseImportJson(text) {
    try {
      const data = JSON.parse(text);

      if (!data.categories || !data.skills) {
        return { error: 'JSON muss mindestens "categories" und "skills" enthalten.' };
      }

      const skillCount = data.skills.length;
      const taskCount = (data.tasks || []).length;

      const resolvedProjects = (data.projects || []).map((p) => ({
        ...p,
        requirements: (p.requirements || []).map((r) => ({
          ...r,
          skillId: resolveIndexRef('SKILL_INDEX_', '__idx_skill_', r.skillId, skillCount),
        })),
      }));

      const resolvedTasks = (data.tasks || []).map((t) => ({
        ...t,
        linkedSkills: (t.linkedSkills || []).map((ref) => resolveIndexRef('SKILL_INDEX_', '__idx_skill_', ref, skillCount)),
        dependsOn: (t.dependsOn || []).map((ref) => resolveIndexRef('TASK_INDEX_', '__idx_task_', ref, taskCount)),
      }));

      return {
        data: {
          meta: data.meta || {},
          categories: data.categories,
          skills: data.skills,
          projects: resolvedProjects,
          tasks: resolvedTasks,
        },
        error: null,
      };
    } catch (e) {
      return { error: `JSON-Parse-Fehler: ${e.message}` };
    }
  }

  function handleImportTextChange(text) {
    setImportText(text);
    setImportError('');
    setImportPreview(null);
    setImportSuccess(null);
    setImportStats(null);

    if (!text.trim()) return;

    const result = parseImportJson(text);
    if (result.error) {
      setImportError(result.error);
    } else {
      setImportPreview(result.data);
    }
  }

  function computeMergePreview(previewData) {
    if (!previewData) return null;
    let skillsMerged = 0;
    let skillsNew = 0;
    let categoriesSkipped = 0;
    let categoriesNew = 0;

    for (const cat of (previewData.categories || [])) {
      const catId = cat.id;
      if (categories.some((ec) => ec.id === catId)) {
        categoriesSkipped++;
      } else {
        categoriesNew++;
      }
    }

    for (const s of (previewData.skills || [])) {
      const existing = skills.find(
        (es) => es.name.trim().toLowerCase() === s.name.trim().toLowerCase()
      );
      if (existing) {
        skillsMerged++;
      } else {
        skillsNew++;
      }
    }

    return { skillsMerged, skillsNew, categoriesSkipped, categoriesNew };
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setImportText(text);
      handleImportTextChange(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleImport() {
    if (!importPreview || !onImportJson || importReview) return;
    onImportJson(importPreview, { mergeSkills });
    setImportText('');
    setImportPreview(null);
    setImportError('');
    setImportSuccess(null);
    setImportStats(null);
  }

  const hasBestand = skills.length > 0;

  return (
    <div className="ai-lernpfad">
      {/* How it works */}
      <div className="ai-lernpfad-steps">
        <div className="ai-lernpfad-step">
          <div className="ai-lernpfad-step-num">1</div>
          <div className="ai-lernpfad-step-text">
            <strong>Prompt kopieren</strong>
            <p>Kopiere den Prompt unten &ndash; er erklaert der KI das NeuroForge-Format.</p>
          </div>
        </div>
        <div className="ai-lernpfad-step">
          <div className="ai-lernpfad-step-num">2</div>
          <div className="ai-lernpfad-step-text">
            <strong>Alles in die KI einfuegen</strong>
            <p>
              Oeffne ChatGPT, Claude o.ae. und fuege <strong>zuerst den Prompt</strong> ein.
              {hasBestand && !isDemo && (
                <> Kopiere dann auch deinen <strong>aktuellen Bestand</strong> dazu (Button unten), damit die KI deine existierenden Skills kennt.</>
              )}
              {' '}Schreibe dann dein Lernziel dazu, z.B. "Ich will React lernen".
            </p>
          </div>
        </div>
        <div className="ai-lernpfad-step">
          <div className="ai-lernpfad-step-num">3</div>
          <div className="ai-lernpfad-step-text">
            <strong>JSON-Antwort hier importieren</strong>
            <p>Die KI antwortet mit JSON-Code. Kopiere diesen und fuege ihn unten im Import-Feld ein.</p>
          </div>
        </div>
      </div>

      {/* Prompt actions */}
      <div className="ai-lernpfad-section">
        <h4 className="ai-lernpfad-section-title">Schritt 1: Prompt kopieren</h4>
        <p className="ai-lernpfad-section-desc">
          Dieser Prompt erklaert der KI das NeuroForge-Datenmodell. Kopiere ihn und fuege ihn als erstes in die KI ein.
        </p>
        <div className="ai-lernpfad-prompt-actions">
          <button className="schmiede-btn schmiede-btn-primary schmiede-btn-sm" onClick={handleCopyPrompt}>
            {copied ? '\u2705 Kopiert!' : '\uD83D\uDCCB Prompt kopieren'}
          </button>
          <button className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm" onClick={handleDownloadPrompt}>
            {'\u2B07\uFE0F'} Als .md herunterladen
          </button>
        </div>
        <details className="ai-lernpfad-prompt-preview">
          <summary className="ai-lernpfad-prompt-summary">Prompt-Vorschau anzeigen</summary>
          <pre className="ai-lernpfad-prompt-code">{AI_PROMPT_TEMPLATE}</pre>
        </details>
      </div>

      {/* Bestand section */}
      {hasBestand && (
        <div className="ai-lernpfad-section">
          <h4 className="ai-lernpfad-section-title">Optional: Aktuellen Bestand mitschicken</h4>
          {isDemo ? (
            <div className="ai-lernpfad-demo-warning">
              Du hast aktuell <strong>Demo-Daten</strong> geladen. Loesche zuerst die Demo-Daten
              (ueber die Einstellungen), bevor du deinen Bestand an die KI schickst &ndash;
              sonst denkt die KI, du kennst die Demo-Skills bereits.
            </div>
          ) : (
            <>
              <p className="ai-lernpfad-section-desc">
                Damit die KI deine vorhandenen Skills kennt und keine Duplikate erstellt:
                Kopiere deinen Bestand und fuege ihn <strong>zusammen mit dem Prompt</strong> in die KI ein.
              </p>
              <button className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm" onClick={handleCopyBestand}>
                {bestandCopied ? '\u2705 Kopiert!' : '\uD83D\uDCCA Aktuellen Bestand kopieren'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Example Templates */}
      <div className="ai-lernpfad-section">
        <h4 className="ai-lernpfad-section-title">Beispiel-Vorlagen</h4>
        <div className="ai-lernpfad-examples">
          {EXAMPLE_TEMPLATES.map((ex) => (
            <div
              key={ex.id}
              className={`ai-lernpfad-example ${activeExample === ex.id ? 'ai-lernpfad-example-active' : ''}`}
            >
              <div
                className="ai-lernpfad-example-header"
                onClick={() => setActiveExample(activeExample === ex.id ? null : ex.id)}
              >
                <span className="ai-lernpfad-example-icon">{ex.icon}</span>
                <div className="ai-lernpfad-example-info">
                  <span className="ai-lernpfad-example-name">{ex.name}</span>
                  <span className="ai-lernpfad-example-desc">{ex.description}</span>
                </div>
                <span className="ai-lernpfad-example-stats">
                  {ex.stats.skills} Skills &middot; {ex.stats.projects} Projekte
                </span>
              </div>
              {activeExample === ex.id && (
                <div className="ai-lernpfad-example-detail">
                  <div className="ai-lernpfad-example-prompt">
                    <strong>Lernziel-Beschreibung:</strong>
                    <p>{ex.prompt}</p>
                  </div>
                  <div className="ai-lernpfad-example-actions">
                    <button
                      className="schmiede-btn schmiede-btn-primary schmiede-btn-sm"
                      onClick={() => handleCopyExample(ex)}
                    >
                      {exampleCopied === ex.id ? '\u2705 Kopiert!' : '\uD83D\uDCCB Prompt + Lernziel kopieren'}
                    </button>
                    <button
                      className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
                      onClick={() => handleDownloadExample(ex)}
                    >
                      {'\u2B07\uFE0F'} .md herunterladen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Import Section */}
      <div className="ai-lernpfad-section">
        <h4 className="ai-lernpfad-section-title">JSON importieren</h4>
        <p className="ai-lernpfad-section-desc">
          Fuege hier die JSON-Antwort der KI ein, oder lade eine .json-Datei hoch.
        </p>
        <div className="ai-lernpfad-import">
          <textarea
            className="ai-lernpfad-import-textarea"
            value={importText}
            onChange={(e) => handleImportTextChange(e.target.value)}
            placeholder='{"meta": {...}, "categories": [...], "skills": [...], "projects": [...], "tasks": [...]}'
            rows={6}
            disabled={!!importReview}
          />
          <div className="ai-lernpfad-import-actions">
            <button
              className="schmiede-btn schmiede-btn-secondary schmiede-btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              JSON-Datei hochladen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          {importError && (
            <div className="schmiede-error">
              {'\u26A0\uFE0F'} {importError}
            </div>
          )}

          {importPreview && (() => {
            const mergePreview = mergeSkills ? computeMergePreview(importPreview) : null;
            return (
              <div className="ai-lernpfad-import-preview">
                <div className="ai-lernpfad-import-preview-title">
                  {'\u2705'} Vorschau: {importPreview.meta?.name || 'Lernpfad'}
                </div>
                <div className="ai-lernpfad-import-preview-stats">
                  <span>{importPreview.categories.length} Kategorien</span>
                  <span>{importPreview.skills.length} Skills</span>
                  <span>{(importPreview.projects || []).length} Projekte</span>
                  <span>{(importPreview.tasks || []).length} Quests</span>
                </div>

                {mergePreview && (mergePreview.skillsMerged > 0 || mergePreview.categoriesSkipped > 0) && (
                  <div className="ai-lernpfad-merge-preview">
                    {mergePreview.skillsMerged > 0 && (
                      <span>{mergePreview.skillsMerged} Skills werden mit bestehenden verknuepft</span>
                    )}
                    {mergePreview.skillsNew > 0 && (
                      <span>{mergePreview.skillsNew} Skills werden neu angelegt</span>
                    )}
                    {mergePreview.categoriesSkipped > 0 && (
                      <span>{mergePreview.categoriesSkipped} Kategorien bereits vorhanden</span>
                    )}
                  </div>
                )}

                <label className="ai-lernpfad-merge-toggle">
                  <input
                    type="checkbox"
                    checked={mergeSkills}
                    onChange={(e) => setMergeSkills(e.target.checked)}
                  />
                  <span>Bestehende Skills wiederverwenden</span>
                </label>

                <button
                  className="schmiede-btn schmiede-btn-primary schmiede-btn-sm"
                  onClick={handleImport}
                  disabled={!!importReview}
                >
                  {importReview ? '\uD83D\uDD0D Import wird gepr\u00FCft...' : '\uD83D\uDE80 Jetzt importieren'}
                </button>
              </div>
            );
          })()}

          {importReview && (
            <div className="ai-lernpfad-review-hint">
              {'\uD83D\uDD0D'} <strong>{importReview.name}</strong> wurde probeweise importiert.
              Navigiere frei durch alle Tabs und pruefe die Daten.
              Nutze das Banner unten zum Uebernehmen oder Rueckgaengig machen.
            </div>
          )}

          {!importReview && importSuccess && (
            <div className="schmiede-success">
              {'\u2705'} "{importSuccess}" erfolgreich importiert!
              {importStats && (
                <div className="ai-lernpfad-import-stats">
                  <span>Kategorien: {importStats.categoriesNew} neu{importStats.categoriesSkipped > 0 && `, ${importStats.categoriesSkipped} uebersprungen`}</span>
                  <span>Skills: {importStats.skillsNew} neu{importStats.skillsMerged > 0 && `, ${importStats.skillsMerged} gemerged`}</span>
                  <span>Quests: {importStats.quests} importiert</span>
                  <span>Projekte: {importStats.projects} importiert</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="ai-lernpfad-section">
        <h4 className="ai-lernpfad-section-title">Tipps</h4>
        <div className="ai-lernpfad-tips">
          <div className="ai-lernpfad-tip">
            <span className="ai-lernpfad-tip-icon">{'\uD83D\uDCA1'}</span>
            <div>
              <strong>Sei spezifisch.</strong> "Webentwicklung mit React und Supabase in 3 Monaten"
              liefert bessere Ergebnisse als "Programmieren lernen".
            </div>
          </div>
          <div className="ai-lernpfad-tip">
            <span className="ai-lernpfad-tip-icon">{'\uD83D\uDD04'}</span>
            <div>
              <strong>Iteriere.</strong> Du kannst die KI bitten, mehr Quests nachzugenerieren
              oder die Schwierigkeit anzupassen. Importiere einfach erneut.
            </div>
          </div>
          <div className="ai-lernpfad-tip">
            <span className="ai-lernpfad-tip-icon">{'\u270F\uFE0F'}</span>
            <div>
              <strong>Anpassen.</strong> Nach dem Import kannst du alles in NeuroForge
              bearbeiten &ndash; Skills umbenennen, Projekte aendern, Quests hinzufuegen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
