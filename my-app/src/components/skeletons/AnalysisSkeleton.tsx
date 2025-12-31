export const AnalysisSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse">
      {/* Year/Month Filter Skeleton */}
      <div className="flex self-center rounded-lg border border-gray-200 bg-gray-100 p-2 shadow-sm h-10 w-64"></div>

      {/* Chart Blocks - Income vs Expense */}
      <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="bg-background w-full rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
          <div className="flex w-full flex-wrap justify-center gap-4">
            {/* Pie Chart */}
            <div className="size-75">
              <div className="mx-auto aspect-square rounded-full bg-gray-100 p-1.5">
                <div className="bg-background size-full rounded-full p-1.5">
                  <div className="size-full rounded-full bg-gray-100 p-5">
                    <div className="bg-background size-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Necessity Chart Block */}
        <div className="bg-background w-full rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="flex w-full flex-wrap justify-center gap-4">
            {/* Pie Chart */}
            <div className="size-75">
              <div className="mx-auto aspect-square rounded-full bg-gray-100 p-1.5">
                <div className="bg-background size-full rounded-full p-1.5">
                  <div className="size-full rounded-full bg-gray-100 p-5">
                    <div className="bg-background size-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Analysis Section (optional) */}
      <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="bg-background w-full rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-56 bg-gray-200 rounded mb-4"></div>
          <div className="flex w-full flex-wrap justify-center gap-4">
            {/* Pie Chart */}
            <div className="size-75">
              <div className="mx-auto aspect-square rounded-full bg-gray-100 p-1.5">
                <div className="bg-background size-full rounded-full p-1.5">
                  <div className="size-full rounded-full bg-gray-100 p-5">
                    <div className="bg-background size-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
