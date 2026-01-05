"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleLike(postId: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = Number(session.user.id);

  const exists = await prisma.likes.findUnique({
    where: { user_post: { user: userId, post: postId } }, // 복합키 이름은 prisma에 맞게
  });

  if (exists) {
    await prisma.likes.delete({
      where: { user_post: { user: userId, post: postId } },
    });
  } else {
    await prisma.likes.create({
      data: { user: userId, post: postId },
    });
  }

  revalidatePath(`/posts/${postId}`);
}
