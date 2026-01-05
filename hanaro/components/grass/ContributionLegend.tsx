const COLORS = [
  "bg-neutral-200",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
];

export function ContributionLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Less</span>
      {COLORS.map((color) => (
        <div key={color} className={`h-3 w-3 rounded-sm ${color}`} />
      ))}
      <span>More</span>
    </div>
  );
}
