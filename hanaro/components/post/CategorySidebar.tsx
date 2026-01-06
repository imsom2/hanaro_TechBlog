"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Prop = {
  total: number;
  categories: { id: number; title: string; count: number }[];
  activeCategory: string;
};
export default function CategorySidebar({
  total,
  categories,
  activeCategory,
}: Prop) {
  const router = useRouter();
  const params = useSearchParams();

  const go = (cat: string) => {
    const sp = new URLSearchParams(params.toString());
    if (cat === "all") sp.delete("category");
    else sp.set("category", cat);

    router.push(`/?${sp.toString()}`);
    router.refresh();
  };

  return (
    <aside className="space-y-4">
      <button
        type="button"
        onClick={() => go("all")}
        className={cn(
          "flex w-full items-center justify-between text-left text-sm",
          activeCategory === "all"
            ? "font-semibold text-green-600"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span>전체보기</span>
        <span>({total})</span>
      </button>

      <div className="space-y-3">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => go(c.title)}
            className={cn(
              "flex w-full items-center justify-between text-left",
              activeCategory === c.title
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{c.title}</span>
            <span>({c.count})</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
