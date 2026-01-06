import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUsers(q?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("로그인이 필요해요.");
  if (!session.user.isadmin) throw new Error("관리자만 접근할 수 있어요.");

  const keyword = (q ?? "").trim();

  return prisma.user.findMany({
    where: keyword
      ? {
          OR: [
            { name: { contains: keyword } },
            { email: { contains: keyword } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      isadmin: true,
      image: true,
    },
    take: 100,
  });
}
