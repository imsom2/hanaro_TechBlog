import { prisma } from "@/lib/prisma";

export async function getContributions(year: number) {
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year}-12-31T23:59:59.999Z`);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { createdAt: { gte: start, lte: end } },
        { updatedAt: { gte: start, lte: end } },
      ],
    },
    select: { createdAt: true, updatedAt: true },
  });

  const map: Record<string, number> = {};

  for (const post of posts) {
    const createdKey = post.createdAt.toISOString().slice(0, 10);
    map[createdKey] = (map[createdKey] || 0) + 1;

    const updatedKey = post.updatedAt.toISOString().slice(0, 10);
    if (updatedKey !== createdKey) {
      map[updatedKey] = (map[updatedKey] || 0) + 1;
    }
  }

  return map;
}
