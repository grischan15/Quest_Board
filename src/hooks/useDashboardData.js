import { useMemo } from 'react';
import { QUEST_TYPES } from '../data/questTypes';

const TIME_SLOTS = [
  '04-06', '06-08', '08-10', '10-12', '12-14',
  '14-16', '16-18', '18-20', '20-22', '22-00',
];

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function getSlotIndex(hour) {
  if (hour < 4) return 9; // 22-00 bucket for very late night
  return Math.min(Math.floor((hour - 4) / 2), 9);
}

function getWeekdayIndex(date) {
  // JS: 0=Sun, 1=Mon ... 6=Sat -> we want 0=Mon ... 6=Sun
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getWeekLabel(date) {
  return `KW ${getISOWeek(date)}`;
}

function getMonthLabel(date) {
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  return months[date.getMonth()];
}

export function useDashboardData(tasks, viewMode) {
  return useMemo(() => {
    const doneTasks = (tasks || []).filter(
      (t) => t.kanbanColumn === 'done' && t.completedAt
    );

    // --- Heatmap data: 10 rows (time slots) x 7 cols (weekdays) ---
    const matrix = Array.from({ length: 10 }, () => Array(7).fill(0));
    let maxCount = 0;

    for (const task of doneTasks) {
      const d = new Date(task.completedAt);
      const slotIdx = getSlotIndex(d.getHours());
      const dayIdx = getWeekdayIndex(d);
      matrix[slotIdx][dayIdx]++;
      if (matrix[slotIdx][dayIdx] > maxCount) {
        maxCount = matrix[slotIdx][dayIdx];
      }
    }

    // --- Line chart data ---
    const now = new Date();
    const typeIds = QUEST_TYPES.map((t) => t.id);
    let periods = [];
    let periodKeys = [];

    if (viewMode === 'months') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periods.push(getMonthLabel(d));
        periodKeys.push(`${d.getFullYear()}-${d.getMonth()}`);
      }
    } else {
      // Last 12 weeks
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        periods.push(getWeekLabel(d));
        periodKeys.push(`${d.getFullYear()}-W${getISOWeek(d)}`);
      }
    }

    // Initialize series per quest type
    const series = {};
    for (const typeId of typeIds) {
      series[typeId] = Array(periods.length).fill(0);
    }
    const totalSeries = Array(periods.length).fill(0);

    for (const task of doneTasks) {
      const d = new Date(task.completedAt);
      let key;
      if (viewMode === 'months') {
        key = `${d.getFullYear()}-${d.getMonth()}`;
      } else {
        key = `${d.getFullYear()}-W${getISOWeek(d)}`;
      }
      const idx = periodKeys.indexOf(key);
      if (idx === -1) continue;

      totalSeries[idx]++;
      if (task.questType && series[task.questType]) {
        series[task.questType][idx]++;
      }
    }

    const maxY = Math.max(...totalSeries, 1);

    // --- Energy curve data: average completions per 2h block + type breakdown ---
    const slotCounts = Array(10).fill(0);
    const slotDays = new Set();
    // Per-slot breakdown by quest type
    const slotTypeCounts = Array.from({ length: 10 }, () => {
      const obj = {};
      for (const t of typeIds) obj[t] = 0;
      return obj;
    });

    for (const task of doneTasks) {
      const d = new Date(task.completedAt);
      const slotIdx = getSlotIndex(d.getHours());
      slotCounts[slotIdx]++;
      slotDays.add(d.toDateString());
      if (task.questType && slotTypeCounts[slotIdx][task.questType] !== undefined) {
        slotTypeCounts[slotIdx][task.questType]++;
      }
    }

    const numDays = Math.max(slotDays.size, 1);
    const energyCurveData = slotCounts.map((count, i) => ({
      slot: TIME_SLOTS[i],
      avg: count / numDays,
      typeCounts: slotTypeCounts[i],
      total: count,
    }));
    const maxAvg = Math.max(...energyCurveData.map((d) => d.avg), 0.1);

    return {
      heatmapData: { matrix, maxCount, timeSlots: TIME_SLOTS, weekdays: WEEKDAYS },
      lineChartData: { periods, series, totalSeries, maxY, viewMode },
      energyCurveData: { slots: energyCurveData, maxAvg },
      hasDoneTasks: doneTasks.length > 0,
    };
  }, [tasks, viewMode]);
}
