// prisma/seed.ts
import { prisma } from "@/lib/prisma";
import { encryptPassword } from "@/lib/validator";

const CATEGORIES = ["JS", "TS", "DB", "React", "Next"];
const USER_COUNT = 50;
const POSTS_PER_USER = 5;
const PASSWORD = "1234";

const rand = (n: number) => Math.floor(Math.random() * n);

function randomDateIn2026() {
  const start = new Date("2026-01-01T00:00:00Z").getTime();
  const end = new Date("2026-12-31T23:59:59Z").getTime();
  return new Date(start + Math.random() * (end - start));
}

function pickOne<T>(arr: T[]) {
  return arr[rand(arr.length)];
}

async function main() {
  // 1) 카테고리
  await prisma.category.createMany({
    data: CATEGORIES.map((title) => ({ title })),
    skipDuplicates: true,
  });

  const categoryRows = await prisma.category.findMany({
    select: { id: true },
  });

  // 2) 유저
  const hashed = await encryptPassword(PASSWORD);

  await prisma.user.createMany({
    data: Array.from({ length: USER_COUNT }, (_, i) => ({
      name: `user${i + 1}`,
      email: `user${i + 1}@test.com`,
      passwd: hashed,
      isadmin: false,
      image: null,
    })),
    skipDuplicates: true,
  });

  const users = await prisma.user.findMany({
    where: { email: { endsWith: "@test.com" } },
    select: { id: true, name: true, email: true },
    orderBy: { id: "asc" },
  });

  let postCount = 0;
  let commentCount = 0;
  let likeCount = 0;

  // 3) 글 + 댓글/좋아요
  for (const u of users) {
    for (let i = 0; i < POSTS_PER_USER; i++) {
      const createdAt = randomDateIn2026();

      // 카테고리 1~2개(중복 방지)
      const picked = new Set<number>();
      picked.add(pickOne(categoryRows).id);
      if (Math.random() < 0.3) picked.add(pickOne(categoryRows).id);

      // 글 생성
      const post = await prisma.post.create({
        data: {
          title: `${u.name}의 글 ${i + 1}`,
          content: `seed content - ${u.email} - #${i + 1}`,
          createdAt,
          updatedAt: createdAt,
          PostCategory: {
            create: [...picked].map((categoryId) => ({
              Category: { connect: { id: categoryId } },
            })),
          },
        },
        select: { id: true },
      });
      postCount++;

      // 댓글
      const topCommentN = rand(4);
      const topCommentIds: number[] = [];

      for (let c = 0; c < topCommentN; c++) {
        const writer = pickOne(users);
        const cAt = randomDateIn2026();

        const top = await prisma.comment.create({
          data: {
            post: post.id,
            user: writer.id,
            comment: null,
            content: `댓글 ${c + 1} - post#${post.id}`,
            createdAt: cAt,
            updatedAt: cAt,
            isDeleted: false,
          },
          select: { id: true },
        });

        topCommentIds.push(top.id);
        commentCount++;
      }

      // 답글
      if (topCommentIds.length > 0 && Math.random() < 0.4) {
        const parentId = pickOne(topCommentIds);
        const writer = pickOne(users);
        const rAt = randomDateIn2026();

        await prisma.comment.create({
          data: {
            post: post.id,
            user: writer.id,
            comment: parentId,
            content: `대댓글 - parent#${parentId}`,
            createdAt: rAt,
            updatedAt: rAt,
            isDeleted: false,
          },
        });
        commentCount++;
      }

      // 좋아요
      const likeN = rand(6);
      const likedUsers = new Set<number>();

      for (let l = 0; l < likeN; l++) {
        likedUsers.add(pickOne(users).id);
      }

      if (likedUsers.size > 0) {
        await prisma.likes.createMany({
          data: [...likedUsers].map((userId) => ({
            user: userId,
            post: post.id,
          })),
          skipDuplicates: true,
        });
        likeCount += likedUsers.size;
      }
    }
  }

  console.log(
    `seed done: users=${users.length}, posts=${postCount}, comments=${commentCount}, likes=${likeCount}`,
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error("seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
