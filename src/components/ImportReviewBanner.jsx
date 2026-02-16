import './ImportReviewBanner.css';

export default function ImportReviewBanner({ review, onConfirm, onUndo }) {
  if (!review) return null;

  const { stats, name } = review;

  const statParts = [];
  if (stats) {
    if (stats.categoriesNew > 0) statParts.push(`${stats.categoriesNew} Kategorien`);
    if (stats.skillsNew > 0) statParts.push(`${stats.skillsNew} Skills`);
    if (stats.skillsMerged > 0) statParts.push(`${stats.skillsMerged} wiederverwendet`);
    if (stats.quests > 0) statParts.push(`${stats.quests} Quests`);
    if (stats.projects > 0) statParts.push(`${stats.projects} Projekte`);
  }

  return (
    <div className="import-review-banner">
      <div className="import-review-banner-content">
        <div className="import-review-banner-top">
          <div className="import-review-banner-headline">
            <span className="import-review-banner-icon">{'\uD83D\uDD0D'}</span>
            <strong>Import-Vorschau: {name}</strong>
          </div>
          <div className="import-review-banner-actions">
            <button
              className="import-review-banner-btn import-review-banner-btn-confirm"
              onClick={onConfirm}
            >
              {'\u2705'} Alles passt &ndash; Uebernehmen
            </button>
            <button
              className="import-review-banner-btn import-review-banner-btn-undo"
              onClick={onUndo}
            >
              {'\u21A9\uFE0F'} Rueckgaengig machen
            </button>
          </div>
        </div>

        <div className="import-review-banner-guide">
          <div className="import-review-banner-guide-row">
            <span className="import-review-banner-color-sample" />
            <span>
              Neue Eintraege erkennst du am <strong>roten Rand</strong> &ndash;
              schau in den <strong>Skill-Tree</strong> (Kategorien, Skills, Projekte)
              und ins <strong>Backlog</strong> (Quests).
            </span>
          </div>
          {statParts.length > 0 && (
            <div className="import-review-banner-stats">
              {statParts.join(' \u00B7 ')}
            </div>
          )}
          <div className="import-review-banner-hint">
            Navigiere frei durch alle Tabs. Passt alles? Klicke &ldquo;Uebernehmen&rdquo;.
            Nicht zufrieden? &ldquo;Rueckgaengig&rdquo; stellt den alten Stand wieder her.
          </div>
        </div>
      </div>
    </div>
  );
}
