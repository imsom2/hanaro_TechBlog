"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatDate, getLevel } from "@/lib/contributions";

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
  cellClassName = "h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3",
  gapClassName = "gap-0.5 md:gap-1",
}: {
  days: string[];
  data: Record<string, number>;
  cellClassName?: string;
  gapClassName?: string;
}) {
  const weeks = chunk(days, 7);
  const isMobile = useIsMobile();

  const Comp = isMobile
    ? {
        comp: Popover,
        trigger: PopoverTrigger,
        content: PopoverContent,
      }
    : {
        comp: HoverCard,
        trigger: HoverCardTrigger,
        content: HoverCardContent,
      };

  return (
    <div className="space-y-2">
      <div className={`grid grid-flow-col auto-cols-max ${gapClassName}`}>
        {weeks.map((week) => {
          const firstDay = week[0];
          const d = new Date(firstDay);
          const dayOfMonth = d.getUTCDate();

          // 한 달의 초반(1~7일)에 해당하는 week에만 월 표시
          const label =
            dayOfMonth <= 7
              ? d.toLocaleString("en-US", { month: "short" })
              : "";

          return (
            <div
              key={`m-${firstDay}`}
              className={`${cellClassName} text-xs text-muted-foreground flex items-center justify-center`}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className={`grid grid-flow-col auto-cols-max ${gapClassName}`}>
        {weeks.map((week) => (
          <div key={week[0]} className={`grid grid-rows-7 ${gapClassName}`}>
            {week.map((day) => {
              const count = data[day] || 0;
              const level = getLevel(count);

              return (
                <Comp.comp key={day}>
                  <Comp.trigger asChild>
                    <div
                      className={`rounded-sm cursor-pointer ${COLORS[level]} ${cellClassName}`}
                    />
                  </Comp.trigger>

                  <Comp.content side="top" className="text-xs">
                    <p>
                      {formatDate(day)}:{" "}
                      <strong>
                        {count === 0
                          ? "No contributions"
                          : `${count} contribution${count > 1 ? "s" : ""}`}
                      </strong>
                    </p>
                  </Comp.content>
                </Comp.comp>
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
