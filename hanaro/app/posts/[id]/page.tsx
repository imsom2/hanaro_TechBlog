// app/posts/[id]/page.tsx

import { notFound } from "next/navigation";
import { getPostDetail } from "@/app/posts/api/post.action";
import CommentForm from "@/components/post/CommentForm";
import CommentList from "@/components/post/CommentList";
import PostActions from "@/components/post/PostActions";
import PostHeader from "@/components/post/PostHeader";
import { auth } from "@/lib/auth";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (!postId) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  const userId = isLoggedIn ? Number(session!.user!.id) : null;

  const post = await getPostDetail(postId);
  if (!post) notFound();

  const tags = post.PostCategory.map((pc) => pc.Category.title);

  const likeCount = post.Likes.length;
  const commentCount = post.Comment.length;

  const isLiked = userId ? post.Likes.some((l) => l.user === userId) : false;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <PostHeader
        title={post.title}
        tags={tags}
        createdAt={post.createdAt}
        updatedAt={post.updatedAt}
        canEdit={!!session?.user?.isadmin} // 관리자만 수정 보이게(원하면 작성자 조건 추가)
      />

      {/* 본문 */}
      <article className="prose prose-neutral max-w-none">
        <p className="whitespace-pre-wrap">{post.content ?? ""}</p>
      </article>

      {/* 좋아요 + 댓글 */}
      <PostActions
        postId={post.id}
        likeCount={likeCount}
        commentCount={commentCount}
        isLoggedIn={isLoggedIn}
        isLiked={isLiked}
      />

      {/* 댓글 작성 */}
      <CommentForm postId={post.id} isLoggedIn={isLoggedIn} />

      {/* 댓글 목록 */}
      <CommentList
        postId={post.id}
        comments={post.Comment}
        sessionUserId={session?.user?.id}
        isAdmin={!!session?.user?.isadmin}
      />
    </div>
  );
}
