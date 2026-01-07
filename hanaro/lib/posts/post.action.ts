"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요해요." as const };
  if (!session.user.isadmin) return { error: "권한이 없어요." as const };
  return { session };
}

function parseIntent(v: unknown): "save" | "delete" {
  return v === "delete" ? "delete" : "save";
}
function parseMode(v: unknown): "create" | "edit" {
  return v === "edit" ? "edit" : "create";
}

type State = { message?: string } | undefined;

export async function upsertOrDeletePost(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const authRes = await requireAdmin();
  if ("error" in authRes) return { message: authRes.error };

  const intent = parseIntent(formData.get("intent"));
  const mode = parseMode(formData.get("mode"));
  const postId = Number(formData.get("postId") ?? 0);

  // delete
  if (intent === "delete") {
    if (!postId) return { message: "postId가 없어요." };

    await prisma.$transaction(async (tx) => {
      await tx.postCategory.deleteMany({ where: { post: postId } });
      await tx.likes.deleteMany({ where: { post: postId } });
      await tx.comment.deleteMany({ where: { post: postId } });
      await tx.post.delete({ where: { id: postId } });
    });

    revalidatePath("/");
    redirect("/");
  }

  // save(create/update 공통 validation)
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categories = formData.getAll("categories").map(String).filter(Boolean);

  if (!title) return { message: "제목을 입력하세요." };
  if (categories.length === 0)
    return { message: "카테고리를 1개 이상 선택하세요." };

  // edit
  if (mode === "edit") {
    if (!postId) return { message: "postId가 없어요." };

    await prisma.$transaction(async (tx) => {
      await tx.postCategory.deleteMany({ where: { post: postId } });

      await tx.post.update({
        where: { id: postId },
        data: {
          title,
          content,
          PostCategory: {
            create: categories.map((t) => ({
              Category: { connect: { title: t } },
            })),
          },
        },
      });
    });

    revalidatePath(`/posts/${postId}`);
    revalidatePath(`/`);
    redirect(`/posts/${postId}`);
  }

  // create
  const post = await prisma.post.create({
    data: {
      title,
      content,
      PostCategory: {
        create: categories.map((t) => ({
          Category: { connect: { title: t } },
        })),
      },
    },
    select: { id: true },
  });

  revalidatePath(`/`);
  redirect(`/posts/${post.id}`);
}

/* -------------------------------------------------------------------------- */
/* 조회 API들                                                              */
/* -------------------------------------------------------------------------- */

export async function getCategoriesWithCount() {
  const [categories, postTotal] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        title: true,
        _count: { select: { PostCategory: true } },
      },
      orderBy: { title: "asc" },
    }),
    prisma.post.count(),
  ]);

  return {
    total: postTotal,
    categories: categories.map((c) => ({
      id: c.id,
      title: c.title,
      count: c._count.PostCategory,
    })),
  };
}

// 목록 조회
export async function getPostList(category: string = "all") {
  const where =
    category === "all"
      ? {}
      : {
          PostCategory: {
            some: {
              Category: { title: category },
            },
          },
        };

  // posts 먼저 가져오기
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      PostCategory: {
        select: { Category: { select: { id: true, title: true } } },
      },
      _count: { select: { Likes: true } },
    },
  });

  // commentCount(soft delete 제외)는 별도 count
  const counts = await prisma.comment.groupBy({
    by: ["post"],
    where: { post: { in: posts.map((p) => p.id) }, isDeleted: false },
    _count: { _all: true },
  });

  const countMap = new Map(counts.map((c) => [c.post, c._count._all]));

  return posts.map((p) => ({
    ...p,
    _count: {
      Likes: p._count.Likes,
      Comment: countMap.get(p.id) ?? 0,
    },
  }));
}

// 상세 조회
export async function getPostDetail(postId: number) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      PostCategory: { include: { Category: true } },
      Comment: {
        orderBy: { createdAt: "asc" },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              isadmin: true,
            },
          },
        },
      },
      Likes: true,
    },
  });
}
