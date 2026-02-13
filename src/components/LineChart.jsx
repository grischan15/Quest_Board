import { QUEST_TYPES } from '../data/questTypes';
import './LineChart.css';

const TYPE_COLORS = {};
for (const t of QUEST_TYPES) {
  TYPE_COLORS[t.id] = t.color;
}

export default function LineChart({ periods, series, totalSeries, maxY, viewMode, onViewModeChange }) {
  const w = 700;
  const h = 280;
  const pad = { top: 30, right: 20, bottom: 50, left: 45 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const n = periods.length;

  const xScale = (i) => pad.left + (i / Math.max(n - 1, 1)) * cw;
  const yScale = (v) => pad.top + ch - (v / Math.max(maxY, 1)) * ch;

  // Grid lines for Y axis
  const yTicks = [];
  const step = maxY <= 5 ? 1 : maxY <= 20 ? 5 : 10;
  for (let v = 0; v <= maxY; v += step) {
    yTicks.push(v);
  }
  if (yTicks[yTicks.length - 1] < maxY) {
    yTicks.push(Math.ceil(maxY / step) * step);
  }

  // Build smooth path using quadratic bezier
  function buildPath(data) {
    if (data.length < 2) {
      if (data.length === 1) return `M ${xScale(0)} ${yScale(data[0])}`;
      return '';
    }
    let d = `M ${xScale(0)} ${yScale(data[0])}`;
    for (let i = 1; i < data.length; i++) {
      const cpx = (xScale(i - 1) + xScale(i)) / 2;
      d += ` Q ${cpx} ${yScale(data[i - 1])}, ${xScale(i)} ${yScale(data[i])}`;
    }
    return d;
  }

  // Check if a series has any data
  const activeTypes = QUEST_TYPES.filter((t) => series[t.id] && series[t.id].some((v) => v > 0));

  return (
    <div className="linechart-container">
      <div className="linechart-toggle">
        <button
          className={`linechart-toggle-btn ${viewMode !== 'months' ? 'active' : ''}`}
          onClick={() => onViewModeChange('weeks')}
        >
          Wochen
        </button>
        <button
          className={`linechart-toggle-btn ${viewMode === 'months' ? 'active' : ''}`}
          onClick={() => onViewModeChange('months')}
        >
          Monate
        </button>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="linechart-svg">
        {/* Grid lines */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={pad.left} y1={yScale(v)}
              x2={w - pad.right} y2={yScale(v)}
              stroke="#e8e8e6" strokeWidth="1" strokeDasharray="4,4"
            />
            <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" fontSize="9" fill="#999">
              {v}
            </text>
          </g>
        ))}

        {/* Type lines */}
        {activeTypes.map((t) => (
          <path
            key={t.id}
            d={buildPath(series[t.id])}
            fill="none"
            stroke={TYPE_COLORS[t.id]}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        ))}

        {/* Total line (thick) */}
        <path
          d={buildPath(totalSeries)}
          fill="none"
          stroke="#25313a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Data points on total line */}
        {totalSeries.map((v, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(v)}
            r="3"
            fill="#25313a"
          >
            <title>{`${periods[i]}: ${v} Quest${v !== 1 ? 's' : ''}`}</title>
          </circle>
        ))}

        {/* X axis labels */}
        {periods.map((label, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={h - pad.bottom + 20}
            textAnchor="middle"
            fontSize="9"
            fill="#888"
            transform={n > 8 ? `rotate(-30, ${xScale(i)}, ${h - pad.bottom + 20})` : ''}
          >
            {label}
          </text>
        ))}

        {/* Axis label */}
        <text x={w / 2} y={h - 2} textAnchor="middle" fontSize="10" fill="#aaa">
          {viewMode === 'months' ? 'Monat' : 'Kalenderwoche'}
        </text>
      </svg>

      {/* Legend */}
      <div className="linechart-legend">
        <span className="linechart-legend-item linechart-legend-total">
          Gesamt
        </span>
        {activeTypes.map((t) => (
          <span
            key={t.id}
            className="linechart-legend-item"
            style={{ '--legend-color': TYPE_COLORS[t.id] }}
          >
            {t.icon} {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
