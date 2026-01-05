// components/post/PostHeader.tsx

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function fmt(d: Date) {
  return new Date(d).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
// ✅ 초 단위로 비교 (1초 이상 차이나면 수정됨)
function isEdited(createdAt: Date, updatedAt: Date) {
  const c = Math.floor(new Date(createdAt).getTime() / 1000);
  const u = Math.floor(new Date(updatedAt).getTime() / 1000);
  return u > c;
}

export default function PostHeader({
  title,
  tags,
  createdAt,
  updatedAt,
  canEdit,
}: {
  title: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  canEdit: boolean;
}) {
  const edited = (() => {
    if (!updatedAt) return false;

    const c = Math.floor(new Date(createdAt).getTime() / 1000);
    const u = Math.floor(new Date(updatedAt).getTime() / 1000);

    return u > c; // ✅ 1초 이상 차이날 때만 수정됨
  })();

  return (
    <header className="space-y-3">
      <h1 className="text-3xl font-extrabold leading-tight">{title}</h1>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{fmt(createdAt)}</span>
          {edited && (
            <>
              <span>·</span>
              <span>수정됨</span>
            </>
          )}
        </div>

        {canEdit && (
          <Link href="#" className="text-sm hover:underline">
            수정
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge key={t} variant="secondary" className="rounded-full">
            {t}
          </Badge>
        ))}
      </div>
    </header>
  );
}
