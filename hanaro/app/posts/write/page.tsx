import { redirect } from "next/navigation";
import PostWriteForm from "@/components/post/PostWriteForm";
import { auth } from "@/lib/auth";
import { getAllCategories } from "@/lib/posts/category.action";

export default async function NewPostPage() {
  const session = await auth();

  // 로그인 체크
  if (!session?.user?.id) redirect("/sign/in");

  // 관리자만 글 작성
  if (!session.user.isadmin) redirect("/");

  // 카테고리 조회는 lib로 분리
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-4xl py-6">
      <h1 className="text-2xl font-bold">새 글 작성</h1>
      <PostWriteForm categories={categories} />
    </div>
  );
}
