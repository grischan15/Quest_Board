import './RadarChart.css';

const CHART_SIZE = 400;
const CENTER = CHART_SIZE / 2;
const RADIUS = 145;
const LABEL_OFFSET = 24;
const REFERENCE_LEVELS = [0.25, 0.5, 0.75, 1.0];

function polarToCartesian(angle, radius) {
  // Start from top (-90deg), go clockwise
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function buildPolygonPoints(values, maxRadius) {
  const n = values.length;
  if (n === 0) return '';
  if (n === 1) {
    const val = values[0];
    const top = CENTER - maxRadius * val;
    return `${CENTER},${top}`;
  }
  const step = 360 / n;
  return values
    .map((val, i) => {
      const pt = polarToCartesian(i * step, maxRadius * val);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

export default function RadarChart({ categoryStrengths }) {
  const n = categoryStrengths.length;

  if (n === 0) return null;

  const step = n > 1 ? 360 / n : 0;

  // Reference polygons
  const refPolygons = REFERENCE_LEVELS.map((level) => {
    if (n === 1) {
      const y = CENTER - RADIUS * level;
      return { level, points: null, y };
    }
    if (n === 2) {
      const top = CENTER - RADIUS * level;
      const bottom = CENTER + RADIUS * level;
      return { level, points: `${CENTER},${top} ${CENTER},${bottom}`, y: null };
    }
    const pts = Array.from({ length: n }, (_, i) => {
      const pt = polarToCartesian(i * step, RADIUS * level);
      return `${pt.x},${pt.y}`;
    }).join(' ');
    return { level, points: pts, y: null };
  });

  // Data polygon
  const dataValues = categoryStrengths.map((c) => c.strength / 100);
  const dataPoints = buildPolygonPoints(dataValues, RADIUS);

  // Axis lines + labels
  const axes = categoryStrengths.map((cat, i) => {
    const angle = n > 1 ? i * step : 0;
    const end = polarToCartesian(angle, RADIUS);
    const labelPt = polarToCartesian(angle, RADIUS + LABEL_OFFSET);
    return { ...cat, end, labelPt, angle };
  });

  return (
    <div className="radar-chart">
      <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} className="radar-svg">
        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d8a4e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2196F3" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Reference shapes */}
        {refPolygons.map((ref) =>
          n === 1 ? (
            <line
              key={ref.level}
              x1={CENTER - 20}
              y1={ref.y}
              x2={CENTER + 20}
              y2={ref.y}
              className="radar-ref-line"
            />
          ) : n === 2 ? (
            <polyline
              key={ref.level}
              points={ref.points}
              className="radar-ref"
              fill="none"
            />
          ) : (
            <polygon
              key={ref.level}
              points={ref.points}
              className="radar-ref"
            />
          )
        )}

        {/* Axis lines */}
        {axes.map((axis) => (
          <line
            key={axis.catId}
            x1={CENTER}
            y1={CENTER}
            x2={axis.end.x}
            y2={axis.end.y}
            className="radar-axis"
          />
        ))}

        {/* Data shape */}
        {n === 1 ? (
          <line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER - RADIUS * dataValues[0]}
            className="radar-data-line"
            strokeWidth="4"
          />
        ) : n === 2 ? (
          <polyline
            points={dataPoints}
            className="radar-data-line"
            fill="none"
            strokeWidth="3"
          />
        ) : (
          <polygon
            points={dataPoints}
            className="radar-data"
          />
        )}

        {/* Data points */}
        {categoryStrengths.map((cat, i) => {
          const val = dataValues[i];
          let cx, cy;
          if (n === 1) {
            cx = CENTER;
            cy = CENTER - RADIUS * val;
          } else {
            const pt = polarToCartesian(i * step, RADIUS * val);
            cx = pt.x;
            cy = pt.y;
          }
          return (
            <circle
              key={cat.catId}
              cx={cx}
              cy={cy}
              r="4"
              className="radar-dot"
            />
          );
        })}

        {/* Labels: white bg circle + Icon + RPG short name */}
        {axes.map((axis) => (
          <g key={`label-${axis.catId}`}>
            <circle
              cx={axis.labelPt.x}
              cy={axis.labelPt.y + 2}
              r="18"
              className="radar-label-bg"
            />
            <text
              x={axis.labelPt.x}
              y={axis.labelPt.y - 4}
              className="radar-label-icon"
              textAnchor="middle"
              dominantBaseline="auto"
            >
              {axis.icon}
            </text>
            <text
              x={axis.labelPt.x}
              y={axis.labelPt.y + 10}
              className="radar-label-text"
              textAnchor="middle"
              dominantBaseline="hanging"
            >
              {axis.rpgName}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
