export const DashboardSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse">
      {/* Year/Month Filter Skeleton */}
      <div className="flex justify-center rounded-lg border border-gray-200 bg-gray-100 p-2 shadow-sm h-10 w-64"></div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-5">
        {/* Overview Card Skeleton */}
        <div className="bg-background relative flex w-full items-center justify-between gap-4 rounded-2xl border border-solid border-gray-200 p-6 shadow-sm md:min-w-110">
          <div className="flex h-full min-h-35 flex-col gap-3 md:min-h-50">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-40 bg-gray-200 rounded"></div>
            <div className="h-6 w-36 bg-gray-200 rounded"></div>
          </div>
          <div className="size-32 rounded-full bg-gray-200"></div>
        </div>

        {/* Daily Cost Chart Skeleton */}
        <div className="bg-background relative flex w-full flex-col items-start rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="flex w-full items-center justify-between mb-2">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full h-48 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      {/* Quick Navigation Cards Skeleton */}
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-background flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-solid border-gray-200 p-4 shadow-sm"
          >
            <div className="size-8 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="bg-background flex w-full flex-col rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="size-6 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
