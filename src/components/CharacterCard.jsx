import './CharacterCard.css';

function getStrengthLevel(strength) {
  if (strength >= 80) return 5;
  if (strength >= 60) return 4;
  if (strength >= 40) return 3;
  if (strength >= 20) return 2;
  if (strength > 0) return 1;
  return 0;
}

export default function CharacterCard({
  categoryStrengths,
  totalLevel,
  totalXP,
  nextLevel1,
  nextLevel2,
  progress1,
  progress2,
  weakestCategory,
}) {
  return (
    <div className="character-card">
      <div className="character-card-header">
        <div className="character-level">Lv. {totalLevel}</div>
        <div className="character-xp">{totalXP} XP gesamt</div>
        <div className="character-level-hint">Durchschnitt deiner Kategorie-St&auml;rken</div>
      </div>

      <div className="character-next-levels">
        {nextLevel1 <= 5 && (
          <div className="character-next-level">
            <span className="character-next-label">&rarr; Lv. {nextLevel1}.0</span>
            <div className="character-next-bar">
              <div
                className="character-next-fill"
                style={{ width: `${Math.round(progress1)}%` }}
              />
            </div>
            <span className="character-next-pct">{Math.round(progress1)}%</span>
          </div>
        )}
        {nextLevel2 <= 5 && (
          <div className="character-next-level">
            <span className="character-next-label">&rarr; Lv. {nextLevel2}.0</span>
            <div className="character-next-bar">
              <div
                className="character-next-fill character-next-fill-far"
                style={{ width: `${Math.round(progress2)}%` }}
              />
            </div>
            <span className="character-next-pct">{Math.round(progress2)}%</span>
          </div>
        )}
        {weakestCategory && (
          <div className="character-lever-tip">
            St&auml;rkster Hebel: <strong>{weakestCategory.icon} {weakestCategory.label}</strong>
          </div>
        )}
      </div>

      <div className="character-attributes">
        {categoryStrengths.map((cat) => {
          const sLevel = getStrengthLevel(cat.strength);
          return (
            <div key={cat.catId} className="character-attr">
              <div className="character-attr-label">
                <span className="character-attr-rpg">{cat.rpgName}</span>
                <span className="character-attr-icon">{cat.icon}</span>
                <span className="character-attr-name">{cat.label}</span>
              </div>
              <div className="character-attr-bar-wrap">
                <div className="character-attr-bar">
                  <div
                    className={`character-attr-fill skill-level-bg-${sLevel}`}
                    style={{ width: `${cat.strength}%` }}
                  />
                </div>
                <span className={`character-attr-value skill-level-${sLevel}`}>
                  {Math.round(cat.strength)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
