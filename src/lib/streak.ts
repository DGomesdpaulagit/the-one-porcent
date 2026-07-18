export function computeStreak(timestamps: string[]): number {
  const days = new Set(timestamps.map((t) => t.slice(0, 10)));
  if (days.size === 0) return 0;

  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  const todayKey = cursor.toISOString().slice(0, 10);
  if (!days.has(todayKey)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
