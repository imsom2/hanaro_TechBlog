import SearchBar from "@/components/post/search/SearchBar";
import SearchResultList from "@/components/post/search/SearchResultList";
import { searchPosts } from "@/lib/posts/search.action";

type SP = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const q = (sp.q ?? "").trim();

  const posts = q ? await searchPosts(q) : [];

  return (
    <div className="mx-auto max-w-3xl space-y-4 py-6">
      <SearchBar defaultValue={q} />
      <SearchResultList posts={posts} />
    </div>
  );
}
