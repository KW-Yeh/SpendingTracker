export const AnalysisSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse">
      {/* Year/Month Filter Skeleton */}
      <div className="flex self-center rounded-lg border border-gray-200 bg-gray-100 p-2 shadow-sm h-10 w-64"></div>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        {/* Expense Pie Chart Skeleton */}
        <div className="bg-background flex flex-col items-center justify-center rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="mx-auto aspect-square size-72 rounded-full bg-gray-100 p-4">
            <div className="bg-background size-full rounded-full p-4">
              <div className="size-full rounded-full bg-gray-100 p-12">
                <div className="bg-background size-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Necessity Pie Chart Skeleton */}
        <div className="bg-background flex flex-col items-center justify-center rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="mx-auto aspect-square size-72 rounded-full bg-gray-100 p-4">
            <div className="bg-background size-full rounded-full p-4">
              <div className="size-full rounded-full bg-gray-100 p-12">
                <div className="bg-background size-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Table Skeleton */}
        <div className="bg-background flex flex-col rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Necessity Table Skeleton */}
        <div className="bg-background flex flex-col rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
