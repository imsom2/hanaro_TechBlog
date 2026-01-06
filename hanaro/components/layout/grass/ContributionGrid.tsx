"use client";

import { useMemo } from "react";
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
import { formatDate } from "@/lib/contributions";
import { getColorClass } from "./constants";

type Props = {
  days: string[]; // 하루 단위 문자열 배열 2026-01-06
  data: Record<string, number>; // 날짜별 count {"2026-01-06": 3, ...}
  cellClassName?: string; // 칸 크기
  gapClassName?: string; // 칸 사이 간격
};

export function ContributionGrid({
  days,
  data,
  cellClassName = "h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3",
  gapClassName = "gap-0.5 md:gap-1",
}: Props) {
  // 날짜를 주 단위로 자르기
  const weeks = useMemo(() => chunk(days, 7), [days]);

  // 모바일에서는 popover/ 데스크탑에서는 hovercard
  const isMobile = useIsMobile();
  const Comp = isMobile
    ? { Root: Popover, Trigger: PopoverTrigger, Content: PopoverContent }
    : { Root: HoverCard, Trigger: HoverCardTrigger, Content: HoverCardContent };

  return (
    <div className={`grid grid-flow-col auto-cols-max ${gapClassName}`}>
      {weeks.map((week) => (
        <div key={week[0]} className={`grid grid-rows-7 ${gapClassName}`}>
          {week.map((day) => {
            const count = data[day] ?? 0;
            const colorClass = getColorClass(count);
            const ariaLabel = `${formatDate(day)}: ${
              count === 0
                ? "No contributions"
                : `${count} contribution${count > 1 ? "s" : ""}`
            }`;

            return (
              <Comp.Root key={day}>
                <Comp.Trigger asChild>
                  <button
                    type="button"
                    aria-label={ariaLabel}
                    className={`rounded-sm ${colorClass} ${cellClassName}`}
                  />
                </Comp.Trigger>

                <Comp.Content side="top" className="text-xs">
                  <p>
                    {formatDate(day)}:{" "}
                    <strong>
                      {count === 0
                        ? "No contributions"
                        : `${count} contribution${count > 1 ? "s" : ""}`}
                    </strong>
                  </p>
                </Comp.Content>
              </Comp.Root>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// 배열을 사이즈 단위로 자르기
function chunk<T>(arr: T[], size: number) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}
