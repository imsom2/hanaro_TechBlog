export const CONTRIBUTION_COLORS = [
  "bg-neutral-200",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
] as const;

export function getLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

export function getColorClass(count: number) {
  return CONTRIBUTION_COLORS[getLevel(count)];
}
