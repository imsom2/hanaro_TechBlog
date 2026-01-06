"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useTransition } from "react";
import { toggleLike } from "@/lib/posts/like.action";

type Prop = {
  postId: number;
  likeCount: number;
  commentCount: number;
  isLoggedIn: boolean;
  isLiked: boolean;
};
export default function PostActions({
  postId,
  likeCount,
  commentCount,
  isLoggedIn,
  isLiked,
}: Prop) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center gap-6 border-t pt-4 text-sm text-muted-foreground">
      <button
        type="button"
        className="inline-flex items-center gap-2 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => start(() => toggleLike(postId))}
        disabled={!isLoggedIn || pending}
        title={!isLoggedIn ? "로그인 후 이용 가능합니다" : ""}
      >
        <Heart
          className={
            isLiked ? "h-4 w-4 text-red-500" : "h-4 w-4 text-muted-foreground"
          }
          fill={isLiked ? "currentColor" : "none"}
        />
        <span>{likeCount}</span>
      </button>

      <div className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4" />
        <span>{commentCount}</span>
      </div>
    </div>
  );
}
