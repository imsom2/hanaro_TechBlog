"use client";

import { useMemo } from "react";
import CommentItem from "./CommentItem";
import ReplyForm from "./ReplyForm";

type Comment = {
  id: number;
  content: string;
  user: number;
  post: number;
  comment?: number | null; // 부모 댓글 id
  isDeleted?: boolean; // soft delete (없으면 false로 취급)
  createdAt: string;
  updatedAt: string;
  User?: { id: number; name?: string | null } | null;
};

function buildTree(comments: Comment[]) {
  const byParent = new Map<number, Comment[]>();
  const roots: Comment[] = [];

  for (const c of comments) {
    const parentId = c.comment;

    // parentId가 없으면 루트
    if (parentId == null) {
      roots.push(c);
      continue;
    }

    // parentId가 있으면 자식으로 저장
    const arr = byParent.get(parentId) ?? [];
    arr.push(c);
    byParent.set(parentId, arr);
  }

  const byCreatedAtAsc = (a: Comment, b: Comment) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  roots.sort(byCreatedAtAsc);
  for (const [pid, arr] of byParent) {
    arr.sort(byCreatedAtAsc);
    byParent.set(pid, arr);
  }

  return { roots, byParent };
}

export default function CommentList({
  postId,
  comments,
  sessionUserId,
  isAdmin,
}: {
  postId: number;
  comments: Comment[];
  sessionUserId?: string | number;
  isAdmin: boolean;
}) {
  const { roots, byParent } = useMemo(() => buildTree(comments), [comments]);

  const sessionIdStr = sessionUserId == null ? null : String(sessionUserId);
  const isLoggedIn = sessionIdStr != null;

  if (roots.length === 0) {
    return (
      <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
        아직 댓글이 없어요. 첫 댓글을 남겨보세요!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {roots.map((c) => {
        const replies = byParent.get(c.id) ?? [];

        const isDeleted = !!c.isDeleted;

        // 권한: 관리자 or 작성자
        const isMine = sessionIdStr != null && String(c.user) === sessionIdStr;
        const canManage = isAdmin || isMine;

        return (
          <div key={c.id} className="space-y-4">
            <CommentItem comment={c} postId={postId} canManage={canManage} />

            {/* 삭제된 댓글에는 답글 버튼/폼 자체를 노출하지 않음 */}
            {!isDeleted && (
              <div className="pl-6">
                <ReplyForm
                  postId={postId}
                  parentCommentId={c.id}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            )}

            {/* 대댓글 목록 */}
            {replies.length > 0 && (
              <div className="space-y-4 border-l pl-6">
                {replies.map((r) => {
                  const isMineReply =
                    sessionIdStr != null && String(r.user) === sessionIdStr;
                  const canManageReply = isAdmin || isMineReply;

                  return (
                    <CommentItem
                      key={r.id}
                      comment={r}
                      postId={postId}
                      canManage={canManageReply}
                      isReply
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
