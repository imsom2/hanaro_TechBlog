"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createComment(_: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { message: "로그인이 필요합니다." };

  const postId = Number(formData.get("postId"));
  const content = String(formData.get("content") ?? "").trim();

  if (!postId || !content) return { message: "내용을 입력해주세요." };

  const created = await prisma.comment.create({
    data: {
      content,
      user: Number(session.user.id),
      post: postId,
      comment: null,
    },
    select: { id: true },
  });

  await prisma.comment.update({
    where: { id: created.id },
    data: { comment: created.id },
  });

  revalidatePath(`/posts/${postId}`);
  return undefined;
}

export async function deleteComment(postId: number, commentId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Need Login");

  const me = Number(session.user.id);
  const isAdmin = !!session.user.isadmin;

  const c = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, user: true, content: true },
  });
  if (!c) return;

  const isMine = c.user === me;

  // ✅ 관리자 + 남의 댓글 => row 삭제 대신 "내용 마스킹"
  if (isAdmin && !isMine) {
    await prisma.comment.update({
      where: { id: commentId },
      data: { content: "삭제된 댓글입니다." },
    });
  } else {
    // ✅ 내 댓글(또는 관리자지만 내 댓글) => 진짜 삭제
    await prisma.comment.delete({ where: { id: commentId } });
  }

  revalidatePath(`/posts/${postId}`);
}

export async function updateComment(
  postId: number,
  commentId: number,
  content: string,
) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = Number(session.user.id);
  const isAdmin = !!session.user.isadmin;

  // 본인 댓글 아니면 막기(관리자는 가능)
  if (!isAdmin) {
    const c = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { user: true },
    });
    if (!c || c.user !== userId) return;
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  revalidatePath(`/posts/${postId}`);
}
