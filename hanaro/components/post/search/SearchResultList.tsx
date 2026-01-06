import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type SearchPost = {
  id: number;
  title: string;
  content: string | null;
  createdAt: string | Date;
  PostCategory?: { Category?: { title?: string | null } | null }[] | null;
  _count?: { Comment?: number; Likes?: number } | null;
};

function fmtKST(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function makeSnippet(content: string | null, max = 120) {
  const text = (content ?? "").trim();
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export default function SearchResultList({ posts }: { posts: SearchPost[] }) {
  if (!posts?.length) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        검색 결과가 없어요.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const tags =
          post.PostCategory?.map((pc) => pc.Category?.title).filter(Boolean) ??
          [];

        return (
          <div key={post.id} className="border-b pb-6">
            <Link
              href={`/posts/${post.id}`}
              className="text-2xl font-bold hover:underline"
            >
              {post.title}
            </Link>

            <p className="mt-2 text-muted-foreground">
              {makeSnippet(post.content)}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge
                  key={`${post.id}-${t}`}
                  variant="secondary"
                  className="rounded-full"
                >
                  {t}
                </Badge>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
              <span>{fmtKST(post.createdAt)}</span>
              <span>💬 {post._count?.Comment ?? 0}</span>
              <span>❤️ {post._count?.Likes ?? 0}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
