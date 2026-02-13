import { useState, useRef } from 'react';
import { AI_PROMPT_TEMPLATE, EXAMPLE_TEMPLATES } from '../data/aiPromptTemplate';
import './AiSetupGuide.css';

export default function AiSetupGuide({ onImportJson }) {
  const [copied, setCopied] = useState(false);
  const [activeExample, setActiveExample] = useState(null);
  const [exampleCopied, setExampleCopied] = useState(null);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importPreview, setImportPreview] = useState(null);
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

  function parseImportJson(text) {
    try {
      const data = JSON.parse(text);

      if (!data.categories || !data.skills) {
        return { error: 'JSON muss mindestens "categories" und "skills" enthalten.' };
      }

      // Build skill ID map from SKILL_INDEX_N references
      const skillCount = data.skills.length;

      // Resolve SKILL_INDEX references in projects
      const projects = (data.projects || []).map((p) => ({
        ...p,
        requirements: (p.requirements || []).map((r) => ({
          ...r,
          skillId: resolveSkillRef(r.skillId, skillCount),
        })),
      }));

      // Resolve SKILL_INDEX references in tasks
      const tasks = (data.tasks || []).map((t) => ({
        ...t,
        linkedSkills: (t.linkedSkills || []).map((ref) => resolveSkillRef(ref, skillCount)),
      }));

      return {
        data: {
          meta: data.meta || {},
          categories: data.categories,
          skills: data.skills,
          projects,
          tasks,
        },
        error: null,
      };
    } catch (e) {
      return { error: `JSON-Parse-Fehler: ${e.message}` };
    }
  }

  function resolveSkillRef(ref, maxIndex) {
    if (typeof ref === 'string' && ref.startsWith('SKILL_INDEX_')) {
      const idx = parseInt(ref.replace('SKILL_INDEX_', ''), 10);
      if (idx >= 0 && idx < maxIndex) return `__idx_${idx}`;
    }
    return ref;
  }

  function handleImportTextChange(text) {
    setImportText(text);
    setImportError('');
    setImportPreview(null);

    if (!text.trim()) return;

    const result = parseImportJson(text);
    if (result.error) {
      setImportError(result.error);
    } else {
      setImportPreview(result.data);
    }
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
    if (!importPreview || !onImportJson) return;
    onImportJson(importPreview);
    setImportText('');
    setImportPreview(null);
    setImportError('');
  }

  return (
    <div className="ai-setup-wrapper">
      <div className="ai-setup-content">

        {/* Hero */}
        <div className="ai-setup-hero">
          <div className="ai-setup-hero-icon">{'\uD83E\uDD16'}</div>
          <h2 className="ai-setup-hero-title">Neuen Skill-Tree mit KI aufsetzen</h2>
          <p className="ai-setup-hero-text">
            Beschreibe dein Lernziel einer KI (ChatGPT, Claude, etc.) und erhalte einen
            kompletten Lernpfad: Skills, Projekte und Quests &ndash; bereit zum Import.
          </p>
        </div>

        {/* How it works */}
        <section className="ai-setup-section">
          <h3 className="ai-setup-section-title">So funktioniert&apos;s</h3>
          <div className="ai-setup-steps">
            <div className="ai-setup-step">
              <div className="ai-setup-step-num">1</div>
              <div className="ai-setup-step-content">
                <strong>Prompt kopieren</strong>
                <p>Kopiere den Prompt unten oder lade ihn als Markdown herunter.</p>
              </div>
            </div>
            <div className="ai-setup-step">
              <div className="ai-setup-step-num">2</div>
              <div className="ai-setup-step-content">
                <strong>In KI einfuegen + Lernziel beschreiben</strong>
                <p>Oeffne ChatGPT, Claude oder eine andere KI. Fuege den Prompt ein und beschreibe dein Lernziel.</p>
              </div>
            </div>
            <div className="ai-setup-step">
              <div className="ai-setup-step-num">3</div>
              <div className="ai-setup-step-content">
                <strong>JSON importieren</strong>
                <p>Kopiere die generierte JSON-Antwort und fuege sie unten ein. NeuroForge erledigt den Rest.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Prompt Template */}
        <section className="ai-setup-section">
          <h3 className="ai-setup-section-title">Der Prompt</h3>
          <p className="ai-setup-section-desc">
            Dieser Prompt erklaert der KI das NeuroForge-Datenmodell und die Regeln.
            Er erzeugt eine JSON-Datei mit Kategorien, Skills, Projekten und Quests.
          </p>
          <div className="ai-setup-prompt-actions">
            <button className="ai-setup-btn ai-setup-btn-primary" onClick={handleCopyPrompt}>
              {copied ? '\u2705 Kopiert!' : '\uD83D\uDCCB Prompt kopieren'}
            </button>
            <button className="ai-setup-btn ai-setup-btn-secondary" onClick={handleDownloadPrompt}>
              {'\u2B07\uFE0F'} Als .md herunterladen
            </button>
          </div>
          <details className="ai-setup-prompt-preview">
            <summary className="ai-setup-prompt-summary">Prompt-Vorschau anzeigen</summary>
            <pre className="ai-setup-prompt-code">{AI_PROMPT_TEMPLATE}</pre>
          </details>
        </section>

        {/* Example Templates */}
        <section className="ai-setup-section">
          <h3 className="ai-setup-section-title">Beispiel-Vorlagen</h3>
          <p className="ai-setup-section-desc">
            Starte mit einem fertigen Lernziel-Prompt. Klicke auf eine Vorlage um den
            kompletten Prompt (inklusive Lernziel) zu kopieren.
          </p>
          <div className="ai-setup-examples">
            {EXAMPLE_TEMPLATES.map((ex) => (
              <div
                key={ex.id}
                className={`ai-setup-example ${activeExample === ex.id ? 'ai-setup-example-active' : ''}`}
              >
                <div
                  className="ai-setup-example-header"
                  onClick={() => setActiveExample(activeExample === ex.id ? null : ex.id)}
                >
                  <span className="ai-setup-example-icon">{ex.icon}</span>
                  <div className="ai-setup-example-info">
                    <span className="ai-setup-example-name">{ex.name}</span>
                    <span className="ai-setup-example-desc">{ex.description}</span>
                  </div>
                  <span className="ai-setup-example-stats">
                    {ex.stats.skills} Skills &middot; {ex.stats.projects} Projekte
                  </span>
                </div>
                {activeExample === ex.id && (
                  <div className="ai-setup-example-detail">
                    <div className="ai-setup-example-prompt">
                      <strong>Lernziel-Beschreibung:</strong>
                      <p>{ex.prompt}</p>
                    </div>
                    <div className="ai-setup-example-actions">
                      <button
                        className="ai-setup-btn ai-setup-btn-primary ai-setup-btn-sm"
                        onClick={() => handleCopyExample(ex)}
                      >
                        {exampleCopied === ex.id ? '\u2705 Kopiert!' : '\uD83D\uDCCB Prompt + Lernziel kopieren'}
                      </button>
                      <button
                        className="ai-setup-btn ai-setup-btn-secondary ai-setup-btn-sm"
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
        </section>

        {/* Import Section */}
        <section className="ai-setup-section">
          <h3 className="ai-setup-section-title">JSON importieren</h3>
          <p className="ai-setup-section-desc">
            Fuege hier die JSON-Antwort der KI ein, oder lade eine .json-Datei hoch.
          </p>
          <div className="ai-setup-import">
            <textarea
              className="ai-setup-import-textarea"
              value={importText}
              onChange={(e) => handleImportTextChange(e.target.value)}
              placeholder='{"meta": {...}, "categories": [...], "skills": [...], "projects": [...], "tasks": [...]}'
              rows={8}
            />
            <div className="ai-setup-import-actions">
              <button
                className="ai-setup-btn ai-setup-btn-secondary"
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
              <div className="ai-setup-import-error">
                {'\u26A0\uFE0F'} {importError}
              </div>
            )}

            {importPreview && (
              <div className="ai-setup-import-preview">
                <div className="ai-setup-import-preview-title">
                  {'\u2705'} Vorschau: {importPreview.meta?.name || 'Lernpfad'}
                </div>
                <div className="ai-setup-import-preview-stats">
                  <span>{importPreview.categories.length} Kategorien</span>
                  <span>{importPreview.skills.length} Skills</span>
                  <span>{(importPreview.projects || []).length} Projekte</span>
                  <span>{(importPreview.tasks || []).length} Quests</span>
                </div>
                <button
                  className="ai-setup-btn ai-setup-btn-primary"
                  onClick={handleImport}
                >
                  {'\uD83D\uDE80'} Jetzt importieren
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Tips */}
        <section className="ai-setup-section">
          <h3 className="ai-setup-section-title">Tipps</h3>
          <div className="ai-setup-tips">
            <div className="ai-setup-tip">
              <span className="ai-setup-tip-icon">{'\uD83D\uDCA1'}</span>
              <div>
                <strong>Sei spezifisch.</strong> "Webentwicklung mit React und Supabase in 3 Monaten"
                liefert bessere Ergebnisse als "Programmieren lernen".
              </div>
            </div>
            <div className="ai-setup-tip">
              <span className="ai-setup-tip-icon">{'\uD83D\uDD04'}</span>
              <div>
                <strong>Iteriere.</strong> Du kannst die KI bitten, mehr Quests nachzugenerieren
                oder die Schwierigkeit anzupassen. Importiere einfach erneut.
              </div>
            </div>
            <div className="ai-setup-tip">
              <span className="ai-setup-tip-icon">{'\u270F\uFE0F'}</span>
              <div>
                <strong>Anpassen.</strong> Nach dem Import kannst du alles in NeuroForge
                bearbeiten &ndash; Skills umbenennen, Projekte aendern, Quests hinzufuegen.
              </div>
            </div>
            <div className="ai-setup-tip">
              <span className="ai-setup-tip-icon">{'\uD83D\uDCBE'}</span>
              <div>
                <strong>Backup machen.</strong> Exportiere vor dem Import deine aktuellen Daten
                ueber den Export-Button in der Kopfzeile.
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
