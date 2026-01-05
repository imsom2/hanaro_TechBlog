export function getLevel(count: number) {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

export function getYearDays(year: number) {
  const days: string[] = [];
  const date = new Date(`${year}-01-01`);

  while (date.getFullYear() === year) {
    days.push(date.toISOString().slice(0, 10));
    date.setDate(date.getDate() + 1);
  }

  return days;
}
