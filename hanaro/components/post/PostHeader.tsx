import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export function fmtKST(isoOrDate: string | Date) {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// 초 단위 비교: createdAt === updatedAt 같은 "DB 기본값" 차이(밀리초/서버 세팅)를 줄이기 위함
export function isEdited(createdAt: Date, updatedAt: Date) {
  const c = Math.floor(createdAt.getTime() / 1000);
  const u = Math.floor(updatedAt.getTime() / 1000);
  return u > c;
}

type Prop = {
  postId: number;
  title: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
  canEdit: boolean;
};

export default function PostHeader({
  postId,
  title,
  categories,
  createdAt,
  updatedAt,
  canEdit,
}: Prop) {
  const edited = useMemo(
    () => isEdited(createdAt, updatedAt),
    [createdAt, updatedAt],
  );

  return (
    <header className="space-y-3">
      <h1 className="text-3xl font-extrabold leading-tight">{title}</h1>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{fmtKST(createdAt)}</span>
          {edited && (
            <>
              <span className="mx-2">·</span>
              <span>{fmtKST(updatedAt)}에 수정됨</span>
            </>
          )}
        </div>

        {canEdit && (
          <Link
            href={`/posts/${postId}/edit`}
            className="text-sm hover:underline"
          >
            수정
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge key={c} variant="secondary" className="rounded-full">
            {c}
          </Badge>
        ))}
      </div>
    </header>
  );
}
