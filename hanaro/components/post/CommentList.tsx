// components/post/CommentList.tsx
import CommentItem from "./CommentItem";

type CommentRow = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: number;
  post: number;
  comment: number;
  User: { id: number; name: string; email: string; image: string | null };
};

export default function CommentList({
  postId,
  comments,
  sessionUserId,
  isAdmin,
}: {
  postId: number;
  comments: CommentRow[];
  sessionUserId?: string;
  isAdmin: boolean;
}) {
  // 부모: comment === id 라고 가정
  const parents = comments.filter((c) => c.comment === c.id);
  const childrenByParent = new Map<number, CommentRow[]>();

  for (const c of comments) {
    if (c.comment !== c.id) {
      const arr = childrenByParent.get(c.comment) ?? [];
      arr.push(c);
      childrenByParent.set(c.comment, arr);
    }
  }

  return (
    <section className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {comments.length}개의 댓글
      </div>

      <div className="space-y-6">
        {parents.map((p) => (
          <div key={p.id} className="space-y-3 border-b pb-6">
            <CommentItem
              comment={p}
              postId={postId}
              canManage={isAdmin || String(p.user) === String(sessionUserId)}
            />

            {/* 대댓글 */}
            <div className="space-y-3 pl-8">
              {(childrenByParent.get(p.id) ?? []).map((ch) => (
                <CommentItem
                  key={ch.id}
                  comment={ch}
                  postId={postId}
                  canManage={isAdmin || String(ch.user) === sessionUserId}
                  isReply
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
