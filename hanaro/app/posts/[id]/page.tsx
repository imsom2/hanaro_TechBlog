import { notFound } from "next/navigation";

import CommentForm from "@/components/post/comment/CommentForm";
import CommentList from "@/components/post/comment/CommentList";
import PostActions from "@/components/post/PostActions";
import PostHeader from "@/components/post/PostHeader";
import { auth } from "@/lib/auth";
import { getPostDetail } from "@/lib/posts/post.action";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) notFound();

  // 세션/DB 조회는 서로 독립이므로 병렬로 실행 (응답 속도 개선)
  const [session, post] = await Promise.all([auth(), getPostDetail(postId)]);

  if (!post) notFound();

  const userId = session?.user?.id ? Number(session.user.id) : null;
  const isLoggedIn = userId != null;

  const categories = post.PostCategory.map((pc) => pc.Category.title);

  // soft delete 반영된 댓글 수
  const commentCount = post.Comment.reduce(
    (acc, c) => acc + (c.isDeleted ? 0 : 1),
    0,
  );

  const likeCount = post.Likes.length;

  // 내가 좋아요 눌렀는지
  const isLiked = userId ? post.Likes.some((l) => l.user === userId) : false;

  const comments = post.Comment.map((c) => ({
    ...c,
    createdAt:
      typeof c.createdAt === "string" ? c.createdAt : c.createdAt.toISOString(),
    updatedAt:
      typeof c.updatedAt === "string" ? c.updatedAt : c.updatedAt.toISOString(),
    User: c.User
      ? {
          id: c.User.id,
          name: c.User.name,
          email: c.User.email,
          image: c.User.image,
          isadmin: c.User.isadmin,
        }
      : null,
  }));

  const isAdmin = !!session?.user?.isadmin;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <PostHeader
        postId={post.id}
        title={post.title}
        categories={categories}
        createdAt={post.createdAt}
        updatedAt={post.updatedAt}
        canEdit={isAdmin}
      />

      <article className="prose prose-neutral max-w-none">
        <p className="whitespace-pre-wrap">{post.content ?? ""}</p>
      </article>

      <PostActions
        postId={post.id}
        likeCount={likeCount}
        commentCount={commentCount}
        isLoggedIn={isLoggedIn}
        isLiked={isLiked}
      />

      <CommentForm postId={post.id} isLoggedIn={isLoggedIn} />

      <CommentList
        postId={post.id}
        comments={comments}
        sessionUserId={session?.user?.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
