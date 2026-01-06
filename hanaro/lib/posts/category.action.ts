// lib/posts/category.action.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });
}
