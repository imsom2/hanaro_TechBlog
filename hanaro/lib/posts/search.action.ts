"use server";

import { prisma } from "@/lib/prisma";

export async function searchPosts(q: string) {
  const raw = q.trim();
  if (!raw) return [];

  // 검색어 분리
  const tokens = raw
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) return [];

  // 불용어 조회
  const stopWords = await prisma.stopWord.findMany({
    where: {
      value: { in: tokens },
    },
    select: { value: true },
  });

  const stopSet = new Set(stopWords.map((s) => s.value));

  // 불용어 제거
  const keywords = tokens.filter((t) => !stopSet.has(t));

  // 불용어만 입력한 경우
  if (keywords.length === 0) return [];

  // 검색 조건 생성
  return prisma.post.findMany({
    where: {
      OR: keywords.flatMap((k) => [
        { title: { contains: k } },
        { content: { contains: k } },
      ]),
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      PostCategory: {
        select: {
          Category: { select: { id: true, title: true } },
        },
      },
      _count: { select: { Comment: true, Likes: true } },
    },
  });
}
