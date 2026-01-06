import { ContributionGrid } from "@/components/layout/grass/ContributionGrid";
import { ContributionLegend } from "@/components/layout/grass/ContributionLegend";
import CategorySidebar from "@/components/post/CategorySidebar";
import PostList from "@/components/post/PostList";
import { getYearDays } from "@/lib/contributions";
import { getContributions } from "@/lib/contributions.action";
import { getCategoriesWithCount, getPostList } from "@/lib/posts/post.action";

type SP = { year?: string; category?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const activeCategory = sp.category ?? "all";

  const currentYear = new Date().getFullYear();
  const year = Number(sp.year ?? currentYear);

  const [data, { total: categoryTotal, categories }, posts] = await Promise.all(
    [
      getContributions(year),
      getCategoriesWithCount(),
      getPostList(activeCategory),
    ],
  );

  const days = getYearDays(year);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-6 space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {total} contributions in {year}
        </h2>

        <div className="flex justify-center">
          <div className="w-full overflow-x-auto">
            <div className="inline-block">
              <ContributionGrid days={days} data={data} />
              <div className="mt-2 flex justify-end">
                <ContributionLegend />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[minmax(140px,180px)_1fr] gap-10">
        <CategorySidebar
          total={categoryTotal}
          categories={categories}
          activeCategory={activeCategory}
        />
        <PostList posts={posts} />
      </section>
    </div>
  );
}
