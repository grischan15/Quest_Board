import p3Logo from '../assets/P3_Logo_RZ_WortBild_mClaim_hell.svg';
import './Header.css';

const tabs = [
  { id: 'kanban', label: 'Kanban', icon: '\uD83C\uDFC3' },
  { id: 'eisenhower', label: 'Backlog', icon: '\uD83D\uDCCB' },
  { id: 'skills', label: 'Skills', icon: '\uD83C\uDF33' },
  { id: 'dashboard', label: 'Dashboard', icon: '\uD83D\uDCC8' },
  { id: 'schmiede', label: 'Schmiede', icon: '\uD83D\uDD28' },
  { id: 'help', label: 'Hilfe', icon: '\u2753' },
];

export default function Header({
  activeTab,
  onTabChange,
  onNewQuest,
  onSettingsClick,
}) {
  return (
    <header className="header">
      <div className="header-left">
        <img src={p3Logo} alt="P3" className="header-p3-logo" />
        <h1 className="header-logo">NeuroForge<span className="header-subtitle">Deine Quest-Schmiede</span></h1>
      </div>
      <nav className="header-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button className="new-quest-btn" onClick={onNewQuest}>
          + Neue Quest
        </button>
        <button className="settings-btn" onClick={onSettingsClick} title="Einstellungen">
          &#9881;
        </button>
      </div>
    </header>
  );
}
