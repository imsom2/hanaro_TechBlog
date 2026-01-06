"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("로그인이 필요해요.");
  return session;
}

// postId에 속했는가
async function getCommentInPost(postId: number, commentId: number) {
  const c = await prisma.comment.findFirst({
    where: { id: commentId, post: postId },
    select: {
      id: true,
      user: true,
      post: true,
      isDeleted: true,
      comment: true,
    },
  });
  if (!c) throw new Error("댓글이 없어요.");
  return c;
}

// 최상위 댓글
export async function createComment(postId: number, content: string) {
  const session = await requireSession();

  const text = content.trim();
  if (!text) throw new Error("댓글 내용을 입력해주세요.");

  await prisma.comment.create({
    data: {
      content: text,
      user: Number(session.user.id),
      post: postId,
      comment: null, // 최상위
    },
  });

  revalidatePath(`/posts/${postId}`);
}

// 답글 생성
export async function createReply(
  postId: number,
  parentCommentId: number,
  content: string,
) {
  const session = await requireSession();

  const text = content.trim();
  if (!text) throw new Error("답글 내용을 입력해주세요.");

  // 부모댓글이 해당 post의 댓글인지 검증
  const parent = await getCommentInPost(postId, parentCommentId);

  if (parent.isDeleted) throw new Error("삭제된 댓글에는 답글을 달 수 없어요.");

  await prisma.comment.create({
    data: {
      content: text,
      user: Number(session.user.id),
      post: postId,
      comment: parentCommentId,
    },
  });

  revalidatePath(`/posts/${postId}`);
}

// 댓글 수정
export async function updateComment(
  postId: number,
  commentId: number,
  content: string,
) {
  const session = await requireSession();

  const text = content.trim();
  if (!text) throw new Error("내용이 비어있어요.");

  const target = await getCommentInPost(postId, commentId);

  if (target.isDeleted) throw new Error("삭제된 댓글은 수정할 수 없어요.");

  const me = Number(session.user.id);
  const isMine = target.user === me;
  const isAdmin = !!session.user.isadmin;

  if (!isMine && !isAdmin) throw new Error("권한이 없어요.");

  await prisma.comment.update({
    where: { id: commentId },
    data: { content: text },
  });

  revalidatePath(`/posts/${postId}`);
}

// 댓글 삭제
export async function deleteComment(postId: number, commentId: number) {
  const session = await requireSession();

  const me = Number(session.user.id);
  const isAdmin = !!session.user.isadmin;

  const target = await getCommentInPost(postId, commentId);

  const isMine = target.user === me;

  // 관리자 - 남의 댓글 => soft delete
  if (isAdmin && !isMine) {
    if (!target.isDeleted) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { isDeleted: true },
      });
    }
    revalidatePath(`/posts/${postId}`);
    return;
  }

  // 본인 댓글 => hard delete
  if (!isMine && !isAdmin) throw new Error("권한이 없어요.");

  await prisma.comment.delete({ where: { id: commentId } });

  revalidatePath(`/posts/${postId}`);
}

type ActionState = { message?: string } | undefined;
export async function createCommentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const postId = Number(formData.get("postId"));
    const content = String(formData.get("content") ?? "");

    if (!postId) return { message: "postId가 올바르지 않아요." };

    await createComment(postId, content);
    return undefined;
  } catch (e) {
    return { message: e instanceof Error ? e.message : "댓글 작성 실패" };
  }
}
