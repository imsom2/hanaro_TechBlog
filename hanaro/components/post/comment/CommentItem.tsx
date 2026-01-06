"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteComment, updateComment } from "@/lib/posts/comment.action";
import { cn } from "@/lib/utils";
import { fmtKST, isEdited } from "../PostHeader";

const DELETED_TEXT = "삭제된 댓글입니다.";

type CommentLike = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  User?: { name?: string | null } | null;
};

export default function CommentItem({
  comment,
  postId,
  canManage,
  isReply,
}: {
  comment: CommentLike;
  postId: number;
  canManage: boolean;
  isReply?: boolean;
}) {
  const [pending, start] = useTransition();

  const createdAt = useMemo(
    () => new Date(comment.createdAt),
    [comment.createdAt],
  );
  const updatedAt = useMemo(
    () => new Date(comment.updatedAt),
    [comment.updatedAt],
  );

  const deleted =
    Boolean(comment.isDeleted) || comment.content === DELETED_TEXT;

  const edited = useMemo(
    () => isEdited(createdAt, updatedAt),
    [createdAt, updatedAt],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(comment.content);

  if (deleted) {
    return (
      <div className={cn("space-y-2", isReply && "opacity-95")}>
        <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
          {DELETED_TEXT}
        </div>
      </div>
    );
  }

  const onSave = () => {
    const next = value.trim();
    if (!next) return;

    start(async () => {
      try {
        await updateComment(postId, comment.id, next);
        setIsEditing(false);
      } catch (e) {
        console.error("updateComment failed:", e);
      }
    });
  };

  const onDelete = () => {
    start(async () => {
      try {
        await deleteComment(postId, comment.id);
      } catch (e) {
        console.error("deleteComment failed:", e);
      }
    });
  };

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
                <span>{fmtKST(comment.updatedAt)}에 수정됨</span>
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
          disabled={pending}
        />
      )}
    </div>
  );
}
