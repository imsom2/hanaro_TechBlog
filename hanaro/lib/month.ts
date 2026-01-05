export function getMonthLabel(date: string) {
  return new Date(date).toLocaleString("en-US", { month: "short" });
}
