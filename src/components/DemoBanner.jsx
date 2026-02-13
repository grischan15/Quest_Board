import './DemoBanner.css';

export default function DemoBanner({ onClearDemo }) {
  return (
    <div className="demo-banner">
      <span className="demo-banner-text">
        Du siehst Demo-Daten zum Ausprobieren.
      </span>
      <button className="demo-banner-btn" onClick={onClearDemo}>
        Eigene Daten starten
      </button>
    </div>
  );
}
