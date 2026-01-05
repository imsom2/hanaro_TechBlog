import { ContributionGrid } from "@/components/ContributionGrid";
import { ContributionLegend } from "@/components/ContributionLegend";
import { getContributions } from "@/lib/contributions";
import { getYearDays } from "@/lib/date";

export default async function HomePage() {
  const year = 2026;
  const data = await getContributions(year);
  const days = getYearDays(year);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {total} contributions in {year}
      </h2>

      <div className="overflow-x-auto">
        <ContributionGrid days={days} data={data} />
      </div>

      <div className="flex justify-end">
        <ContributionLegend />
      </div>
    </div>
  );
}
