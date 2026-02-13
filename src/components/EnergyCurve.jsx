import { QUEST_TYPES } from '../data/questTypes';
import './EnergyCurve.css';

const TYPE_COLORS = {};
for (const qt of QUEST_TYPES) {
  TYPE_COLORS[qt.id] = qt.color;
}
const TYPE_ORDER = QUEST_TYPES.map((t) => t.id);

export default function EnergyCurve({ slots, maxAvg }) {
  const w = 700;
  const h = 260;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const hasData = slots.some((s) => s.avg > 0);

  if (!hasData) {
    return (
      <div className="energy-curve-empty">
        <div className="energy-curve-empty-icon">&#128200;</div>
        <div className="energy-curve-empty-text">
          Noch keine Daten. Schliesse Quests ab, um deine persoenliche Energiekurve zu sehen.
        </div>
      </div>
    );
  }

  // Map slots to x positions (center of each 2h block, starting at 04)
  const slotHours = [5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
  const xScale = (hour) => pad.left + ((hour - 4) / 20) * cw;
  const yScale = (val) => pad.top + ch - (val / maxAvg) * ch;

  const points = slots.map((s, i) => [xScale(slotHours[i]), yScale(s.avg)]);

  // Smooth curve using quadratic bezier
  let smoothD = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1][0] + points[i][0]) / 2;
    smoothD += ` Q ${cpx} ${points[i - 1][1]}, ${points[i][0]} ${points[i][1]}`;
  }

  // Fill area
  const areaD = smoothD + ` L ${points[points.length - 1][0]} ${yScale(0)} L ${points[0][0]} ${yScale(0)} Z`;

  // Y grid lines
  const yTicks = [];
  const step = maxAvg <= 2 ? 0.5 : maxAvg <= 5 ? 1 : 2;
  for (let v = 0; v <= maxAvg; v += step) {
    yTicks.push(v);
  }

  // Stacked bars: find max total for bar scaling
  const maxTotal = Math.max(...slots.map((s) => s.total || 0), 1);
  const barW = 22;
  const barMaxH = ch * 0.6;

  // Time slot labels
  const xLabels = ['04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '00'];

  return (
    <div className="energy-curve-wrapper">
      <svg viewBox={`0 0 ${w} ${h}`} className="energy-curve-personal-svg">
        <defs>
          <linearGradient id="personalEnergyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c60a0f" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c60a0f" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={pad.left} y1={yScale(v)}
              x2={w - pad.right} y2={yScale(v)}
              stroke="#e8e8e6" strokeWidth="1" strokeDasharray="4,4"
            />
            <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" fontSize="9" fill="#999">
              {Number.isInteger(v) ? v : v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Stacked bars per time slot */}
        {slots.map((slot, i) => {
          if (!slot.total) return null;
          const cx = xScale(slotHours[i]);
          const totalH = (slot.total / maxTotal) * barMaxH;
          const baseY = pad.top + ch;
          let offsetY = 0;

          return (
            <g key={`bar-${i}`} opacity="0.45">
              {TYPE_ORDER.map((typeId) => {
                const count = slot.typeCounts?.[typeId] || 0;
                if (count === 0) return null;
                const segH = (count / maxTotal) * barMaxH;
                const y = baseY - offsetY - segH;
                offsetY += segH;
                return (
                  <rect
                    key={typeId}
                    x={cx - barW / 2}
                    y={y}
                    width={barW}
                    height={segH}
                    fill={TYPE_COLORS[typeId]}
                    rx="2"
                  >
                    <title>{`${slot.slot} ${typeId}: ${count}`}</title>
                  </rect>
                );
              })}
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#personalEnergyGradient)" opacity="0.3" />

        {/* Main curve */}
        <path d={smoothD} fill="none" stroke="#c60a0f" strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#c60a0f">
            <title>{`${slots[i].slot}: Ø ${slots[i].avg.toFixed(1)} Quests`}</title>
          </circle>
        ))}

        {/* X axis */}
        {xLabels.map((label, i) => {
          const hour = 4 + i * 2;
          return (
            <g key={label}>
              <line x1={xScale(hour)} y1={pad.top + ch} x2={xScale(hour)} y2={pad.top + ch + 5} stroke="#ccc" />
              <text x={xScale(hour)} y={pad.top + ch + 18} textAnchor="middle" fontSize="10" fill="#888">
                {label}:00
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={w / 2} y={h - 2} textAnchor="middle" fontSize="10" fill="#aaa">Tageszeit</text>
        <text x={12} y={h / 2} textAnchor="middle" fontSize="10" fill="#aaa"
          transform={`rotate(-90, 12, ${h / 2})`}>&Oslash; Quests</text>
      </svg>

      {/* Legend */}
      <div className="energy-curve-legend">
        {QUEST_TYPES.map((qt) => (
          <span key={qt.id} className="energy-curve-legend-item">
            <span className="energy-curve-legend-dot" style={{ background: qt.color }} />
            {qt.icon} {qt.label}
          </span>
        ))}
      </div>
    </div>
  );
}
