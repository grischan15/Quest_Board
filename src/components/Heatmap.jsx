import './Heatmap.css';

const COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

function getColor(count, maxCount) {
  if (count === 0 || maxCount === 0) return COLORS[0];
  const ratio = count / maxCount;
  if (ratio <= 0.25) return COLORS[1];
  if (ratio <= 0.5) return COLORS[2];
  if (ratio <= 0.75) return COLORS[3];
  return COLORS[4];
}

export default function Heatmap({ matrix, maxCount, timeSlots, weekdays }) {
  const cellW = 36;
  const cellH = 18;
  const gap = 2;
  const labelW = 44;
  const labelH = 18;
  const cols = weekdays.length;
  const rows = timeSlots.length;
  const w = labelW + cols * (cellW + gap);
  const h = labelH + rows * (cellH + gap);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="heatmap-svg">
      {/* Weekday labels */}
      {weekdays.map((day, col) => (
        <text
          key={day}
          x={labelW + col * (cellW + gap) + cellW / 2}
          y={labelH - 4}
          textAnchor="middle"
          fontSize="9"
          fill="#888"
        >
          {day}
        </text>
      ))}

      {/* Time slot labels + cells */}
      {timeSlots.map((slot, row) => (
        <g key={slot}>
          <text
            x={labelW - 4}
            y={labelH + row * (cellH + gap) + cellH / 2 + 3}
            textAnchor="end"
            fontSize="8"
            fill="#888"
          >
            {slot}
          </text>
          {weekdays.map((day, col) => {
            const count = matrix[row][col];
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={labelW + col * (cellW + gap)}
                  y={labelH + row * (cellH + gap)}
                  width={cellW}
                  height={cellH}
                  rx="3"
                  fill={getColor(count, maxCount)}
                >
                  <title>{`${day} ${slot}: ${count} Quest${count !== 1 ? 's' : ''}`}</title>
                </rect>
                {count > 0 && (
                  <text
                    x={labelW + col * (cellW + gap) + cellW / 2}
                    y={labelH + row * (cellH + gap) + cellH / 2 + 3}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="600"
                    fill={count / maxCount > 0.5 ? '#fff' : '#333'}
                  >
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
