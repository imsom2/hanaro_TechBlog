import { notFound, redirect } from "next/navigation";
import PostWriteForm from "@/components/post/PostWriteForm";
import { auth } from "@/lib/auth";
import { getAllCategories } from "@/lib/posts/category.action";
import { getPostDetail } from "@/lib/posts/post.action";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostEditPage({ params }: PageProps) {
  const { id } = await params;

  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) notFound();

  const sessionPromise = auth();
  const postPromise = getPostDetail(postId);
  const categoriesPromise = getAllCategories();

  const [session, post, categories] = await Promise.all([
    sessionPromise,
    postPromise,
    categoriesPromise,
  ]);

  if (!session?.user?.id) redirect("/sign/in");

  if (!post) notFound();

  const selectedCategories = post.PostCategory.map((pc) => pc.Category.title);

  return (
    <div className="mx-auto max-w-5xl py-6">
      <h1 className="text-2xl font-bold">게시글 수정</h1>

      <PostWriteForm
        categories={categories}
        defaultValues={{
          postId,
          title: post.title,
          content: post.content ?? "",
          categories: selectedCategories,
        }}
        mode="edit"
      />
    </div>
  );
}
