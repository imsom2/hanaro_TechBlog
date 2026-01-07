"use client";

import { CONTRIBUTION_COLORS } from "@/lib/contributions";

export function ContributionLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Less</span>

      {CONTRIBUTION_COLORS.map((cls) => (
        <div key={cls} className={`h-3 w-3 rounded-sm ${cls}`} />
      ))}

      <span>More</span>
    </div>
  );
}
