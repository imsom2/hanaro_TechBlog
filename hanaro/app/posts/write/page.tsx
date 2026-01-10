import { redirect } from "next/navigation";
import PostWriteForm from "@/components/post/PostWriteForm";
import { auth } from "@/lib/auth/auth";
import { getAllCategories } from "@/lib/posts/category.action";

export default async function NewPostPage() {
  const session = await auth();

  // 로그인 안 했으면 로그인 페이지로
  if (!session?.user?.id) redirect("/auth/sign-in");

  // 관리자가 아니면 홈으로
  if (!session.user.isadmin) redirect("/");

  // 카테고리 목록 가져오기
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-4xl py-6">
      <h1 className="text-2xl font-bold">새 글 작성</h1>
      <PostWriteForm categories={categories} />
    </div>
  );
}
