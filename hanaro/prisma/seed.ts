import { prisma } from "@/lib/prisma";
import { encryptPassword } from "@/lib/validator";

const categories = ["JS", "TS", "DB", "React", "Next"];

const data = [
  {
    name: "hong",
    email: "hong@test.com",
    passwd: "1234",
    categories: ["JS", "TS"],
    post: {
      title: "post1",
      content: "첫 번째 게시글",
    },
  },
  {
    name: "kim",
    email: "kim@test.com",
    passwd: "1234",
    categories: ["Next"],
    post: {
      title: "post2",
      content: "두 번째 게시글",
    },
  },
];

async function main() {
  for (const title of categories) {
    const category = await prisma.category.upsert({
      where: { title },
      update: {},
      create: { title },
    });
    console.log("category", category);
  }

  // 2) 유저 + 포스트 + 카테고리 연결
  for (const item of data) {
    const hashed = await encryptPassword(item.passwd);
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: {
        passwd: hashed,
      },
      create: {
        name: item.name,
        email: item.email,
      },
    });
    console.log("user", user);

    const post = await prisma.post.create({
      data: {
        title: item.post.title,
        content: item.post.content,
        PostCategory: {
          create: item.categories.map((title) => ({
            Category: {
              connect: { title },
            },
          })),
        },
      },
    });
    console.log("post", post);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("PrismaError>>", e);
    await prisma.$disconnect();
    process.exit(1);
  });
