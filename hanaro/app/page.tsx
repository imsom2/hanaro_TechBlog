import {
  getCategoriesWithCount,
  getPostList,
} from "@/app/post/api/post.server";
import { ContributionGrid } from "@/components/grass/ContributionGrid";
import { ContributionLegend } from "@/components/grass/ContributionLegend";
import CategorySidebar from "@/components/post/CategorySidebar";
import PostList from "@/components/post/PostList";
import { getYearDays } from "@/lib/contributions";
import { getContributions } from "@/lib/contributions.action";

export default async function HomePage() {
  const year = 2026;

  const data = await getContributions(year);
  const days = getYearDays(year);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const [{ total: categoryTotal, categories }, posts] = await Promise.all([
    getCategoriesWithCount(),
    getPostList(),
  ]);

  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{total} contributions in 2026</h2>

        <div className="flex items-start gap-6">
          <div className="w-full overflow-x-auto">
            <ContributionGrid days={days} data={data} />

            <div className="mt-2 flex justify-end">
              <ContributionLegend />
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-[minmax(140px,180px)_1fr] gap-10">
        <CategorySidebar total={categoryTotal} categories={categories} />
        <PostList posts={posts} />
      </section>
    </div>
  );
}
