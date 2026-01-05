import { prisma } from "@/lib/prisma";

export async function getContributions(year: number) {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);

  const posts = await prisma.post.findMany({
    where: {
      updatedAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      updatedAt: true,
    },
  });

  const map: Record<string, number> = {};

  for (const post of posts) {
    const key = post.updatedAt.toISOString().slice(0, 10); // YYYY-MM-DD
    map[key] = (map[key] || 0) + 1;
  }

  return map;
}
