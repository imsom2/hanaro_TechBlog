import { prisma } from "@/lib/prisma";

export async function getCategoriesWithCount() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      title: true,
      _count: { select: { PostCategory: true } },
    },
    orderBy: { title: "asc" },
  });

  const total = categories.reduce((sum, c) => sum + c._count.PostCategory, 0);

  return {
    total,
    categories: categories.map((c) => ({
      id: c.id,
      title: c.title,
      count: c._count.PostCategory,
    })),
  };
}

export async function getPostList() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      PostCategory: {
        select: {
          category: true,
          Category: { select: { id: true, title: true } },
        },
      },
      _count: {
        select: { Comment: true, Likes: true },
      },
    },
  });
}

export async function getPostDetail(postId: number) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      PostCategory: { include: { Category: true } },
      Comment: {
        include: { User: true },
        orderBy: { createdAt: "asc" },
      },
      Likes: true,
    },
  });

  return post;
}
