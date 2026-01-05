"use client";

import { useActionState } from "react";
import { createComment } from "@/app/posts/api/comment.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CommentForm({
  postId,
  isLoggedIn,
}: {
  postId: number;
  isLoggedIn: boolean;
}) {
  const [err, action, pending] = useActionState(createComment, undefined);
  if (!isLoggedIn) {
    return (
      <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
        댓글 작성은 로그인 후 이용할 수 있어요.{" "}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form action={action} className="space-y-2">
        <input type="hidden" name="postId" value={postId} />
        <Textarea
          name="content"
          placeholder="댓글을 작성하세요"
          className="min-h-28"
        />

        {err?.message && <p className="text-sm text-red-500">{err.message}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            댓글 작성{pending ? "..." : ""}
          </Button>
        </div>
      </form>
    </div>
  );
}
