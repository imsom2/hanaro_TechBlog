import Link from "next/link";

export default function PostList({ posts }: { posts: any[] }) {
  return (
    <section className="space-y-8">
      {posts.map((post) => (
        <article key={post.id} className="border-b pb-8">
          <Link href={`/posts/${post.id}`}>
            <h3 className="text-lg font-semibold hover:underline">
              {post.title}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {post.content ?? ""}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {post.PostCategory.map((pc: any) => (
              <span
                key={pc.category}
                className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
              >
                {pc.Category.title}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
            <span>💬 {post._count.Comment}</span>
            <span>❤️ {post._count.Likes}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
