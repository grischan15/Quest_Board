import './CharacterCard.css';

function getStrengthLevel(strength) {
  if (strength >= 80) return 5;
  if (strength >= 60) return 4;
  if (strength >= 40) return 3;
  if (strength >= 20) return 2;
  if (strength > 0) return 1;
  return 0;
}

export default function CharacterCard({ categoryStrengths, totalLevel, totalXP }) {
  return (
    <div className="character-card">
      <div className="character-card-header">
        <div className="character-level">Lv. {totalLevel}</div>
        <div className="character-xp">{totalXP} XP gesamt</div>
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
