import { Skeleton } from "pec/components/ui/skeleton";

const DashboardLoading = () => {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 dark:text-white">
      {/* Tools Section */}
      <SectionTitle title="Tools" />
      <GridContainer>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={`tool-${i}`} lines={[150, 200, 120]} />
        ))}
      </GridContainer>

      {/* Validators Section */}
      <SectionTitle title="My Validators" />
      <GridContainer>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={`stat-${i}`} lines={[140, 180]} />
        ))}
      </GridContainer>

      {/* Validator Table */}
      <SectionTitle title="List of Validators" />
      <div className="rounded-xl border p-4">
        <Skeleton className="h-12 w-full mb-4 bg-gray-200 dark:bg-gray-800" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`row-${i}`} className="h-16 w-full mb-3 bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-2xl font-semibold">{title}</h2>
);

const GridContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
);

const SkeletonCard = ({ lines }: { lines: number[] }) => (
  <div className="rounded-xl border p-4 space-y-3">
    {lines.map((width, i) => (
      <Skeleton key={i} className={`h-${i === 0 ? 8 : 4} w-[${width}px] bg-gray-200 dark:bg-gray-800`} />
    ))}
  </div>
);

export default DashboardLoading;
