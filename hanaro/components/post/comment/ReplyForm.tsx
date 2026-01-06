"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReply } from "@/lib/posts/comment.action";

type Prop = {
  postId: number;
  parentCommentId: number;
  isLoggedIn: boolean;
  isDeleted?: boolean;
};

export default function ReplyForm({
  postId,
  parentCommentId,
  isLoggedIn,
  isDeleted = false,
}: Prop) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();

  if (isDeleted) return null;

  const submit = () => {
    const text = value.trim();
    if (!text) return;

    start(async () => {
      await createReply(postId, parentCommentId, text);
      setValue("");
      setOpen(false);
    });
  };

  if (!open) {
    if (!isLoggedIn) return null;

    return (
      <Button
        type="button"
        variant="ghost"
        className="h-8 px-2 text-xs text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        답글 달기
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="답글을 작성하세요"
        disabled={pending}
        className="min-h-[80px]"
      />
      <div className="flex gap-2">
        <Button type="button" onClick={submit} disabled={pending} size="sm">
          답글 작성
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={pending}
          size="sm"
        >
          취소
        </Button>
      </div>
    </div>
  );
}
