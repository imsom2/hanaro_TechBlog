import Link from "next/link";

type Category = { id: number; title: string; count: number };

export default function CategorySidebar({
  total,
  categories,
}: {
  total: number;
  categories: Category[];
}) {
  return (
    <aside className="space-y-2 text-sm">
      <Link href="/" className="block font-semibold text-green-600">
        전체보기 ({total})
      </Link>

      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/category/${c.id}`}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <span>{c.title}</span>
          <span>({c.count})</span>
        </Link>
      ))}
    </aside>
  );
}
