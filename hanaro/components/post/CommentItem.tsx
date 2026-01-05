"use client";

import { useState, useTransition } from "react";
import { deleteComment, updateComment } from "@/app/posts/api/comment.action";
import { cn } from "@/lib/utils";

function fmtKST(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// ✅ 초 단위 비교
function isEdited(createdAt: Date, updatedAt: Date) {
  const c = Math.floor(createdAt.getTime() / 1000);
  const u = Math.floor(updatedAt.getTime() / 1000);
  return u > c;
}

export default function CommentItem({
  comment,
  postId,
  canManage,
  isReply,
}: {
  comment: any;
  postId: number;
  canManage: boolean;
  isReply?: boolean;
}) {
  const [pending, start] = useTransition();

  const createdAt = new Date(comment.createdAt);
  const updatedAt = new Date(comment.updatedAt);
  const edited = isEdited(createdAt, updatedAt);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(comment.content as string);

  // ✅ 서버에서 마스킹된 댓글 여부
  const isDeleted = comment.content === "삭제된 댓글입니다.";

  const onSave = () => {
    const content = value.trim();
    if (!content) return;

    start(async () => {
      await updateComment(postId, comment.id, content);
      setIsEditing(false);
    });
  };

  const onDelete = () => {
    start(async () => {
      await deleteComment(postId, comment.id);
      // ❌ setState 필요 없음 — 서버에서 상태 결정
    });
  };

  /** ================= 삭제된 댓글 ================= */
  if (isDeleted) {
    return (
      <div className={cn("space-y-2", isReply && "opacity-95")}>
        <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
          삭제된 댓글입니다.
        </div>
      </div>
    );
  }

  /** ================= 정상 댓글 ================= */
  return (
    <div className={cn("space-y-2", isReply && "opacity-95")}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm">
          <div>
            <span className="font-semibold">
              {comment.User?.name ?? "user"}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            <span>작성: {fmtKST(comment.createdAt)}</span>
            {edited && (
              <>
                <span className="mx-2">·</span>
                <span>수정: {fmtKST(comment.updatedAt)}</span>
              </>
            )}
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsEditing(true)}
                  disabled={pending}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={onDelete}
                  disabled={pending}
                >
                  삭제
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={onSave}
                  disabled={pending}
                >
                  저장
                </button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setValue(comment.content);
                    setIsEditing(false);
                  }}
                  disabled={pending}
                >
                  취소
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {!isEditing ? (
        <p className="whitespace-pre-wrap text-sm leading-6">
          {comment.content}
        </p>
      ) : (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border bg-background p-2 text-sm"
          rows={3}
        />
      )}
    </div>
  );
}
