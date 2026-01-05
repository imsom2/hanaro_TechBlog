import CategorySidebar from "@/components/CategotySidebar";
import { ContributionGrid } from "@/components/ContributionGrid";
import { ContributionLegend } from "@/components/ContributionLegend";
import PostList from "@/components/PostList";
import { getYearDays } from "@/lib/contributions";
import { getContributions } from "@/lib/contributions.action";
import { getCategoriesWithCount, getPostList } from "@/lib/post.server";

export default async function HomePage() {
  const year = 2026;
  const data = await getContributions(year);
  const days = getYearDays(year);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  // 카테고리/포스트
  const [{ total: categoryTotal, categories }, posts] = await Promise.all([
    getCategoriesWithCount(),
    getPostList(),
  ]);

  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {total} contributions in {year}
        </h2>

        <div className="w-full overflow-x-auto">
          <ContributionGrid days={days} data={data} />
        </div>

        <div className="flex justify-end">
          <ContributionLegend />
        </div>
      </section>
      <section className="grid grid-cols-[minmax(140px,180px)_1fr] gap-10">
        <CategorySidebar total={categoryTotal} categories={categories} />
        <PostList posts={posts} />
      </section>
    </div>
  );
}
