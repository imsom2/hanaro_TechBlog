"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createCommentAction } from "@/lib/posts/comment.action";

type ActionState =
  | undefined
  | {
      message?: string; // 에러/안내 메시지
      ok?: boolean; // 성공 여부 (서버액션에서 세팅)
    };

export default function CommentForm({
  postId,
  isLoggedIn,
}: {
  postId: number;
  isLoggedIn: boolean;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);

  // 서버액션의 리턴을 화면에서 읽기 위한 state
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createCommentAction,
    undefined,
  );

  // 성공(ok=true)하면 폼 리셋(입력창 비우기)
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  if (!isLoggedIn) {
    return (
      <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
        댓글 작성은 로그인 후 이용할 수 있어요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form ref={formRef} action={action} className="space-y-2">
        <input type="hidden" name="postId" value={postId} />

        <Textarea
          name="content"
          placeholder="댓글을 작성하세요"
          className="min-h-28"
          required
          disabled={pending}
        />

        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            댓글 작성{pending ? "..." : ""}
          </Button>
        </div>
      </form>
    </div>
  );
}
