import { getLevel } from "@/lib/date";
import { getMonthLabel } from "@/lib/month";

const COLORS = [
  "bg-neutral-200",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
];

export function ContributionGrid({
  days,
  data,
}: {
  days: string[];
  data: Record<string, number>;
}) {
  const weeks = chunk(days, 7);

  return (
    <div className="space-y-2">
      {/* ✅ Month labels */}
      <div className="grid grid-flow-col auto-cols-max gap-1 text-xs text-muted-foreground">
        {weeks.map((week) => {
          const firstDay = week[0];
          const day = new Date(firstDay).getDate();
          return (
            <div key={firstDay} className="w-3 text-center">
              {day <= 7 ? getMonthLabel(firstDay) : ""}
            </div>
          );
        })}
      </div>

      {/* ✅ Grass grid */}
      <div className="grid grid-flow-col auto-cols-max gap-1">
        {weeks.map((week) => (
          <div key={week[0]} className="grid grid-rows-7 gap-1">
            {week.map((day) => {
              const count = data[day] || 0;
              const level = getLevel(count);

              return (
                <div
                  key={day}
                  title={`${day}: ${count} contributions`}
                  className={`h-3 w-3 rounded-sm ${COLORS[level]}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function chunk<T>(arr: T[], size: number) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}
