export const DashboardSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse">
      {/* Year/Month Filter Skeleton */}
      <div className="flex h-10 w-64 justify-center rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-sm"></div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-start md:gap-5">
        {/* Overview Card Skeleton */}
        <div className="bg-background relative flex w-full flex-col gap-5 rounded-2xl border border-solid border-gray-700 p-6 shadow-sm md:min-w-110">
          {/* Header with primary metric */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="size-5 rounded bg-gray-700"></div>
              <div className="h-4 w-28 rounded bg-gray-700"></div>
            </div>
            <div className="h-10 w-48 rounded bg-gray-700"></div>
            <div className="h-2.5 w-full rounded-full bg-gray-800"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-gray-700"></div>
            </div>
          </div>

          {/* Financial breakdown grid */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-1 rounded-lg bg-gray-50 p-3"
              >
                <div className="h-3 w-12 rounded bg-gray-700"></div>
                <div className="h-5 w-20 rounded bg-gray-700"></div>
              </div>
            ))}
          </div>

          {/* Budget usage accordion header (collapsed) */}
          <div className="flex items-center justify-between rounded-lg px-2 py-2">
            <div className="h-3 w-24 rounded bg-gray-700"></div>
            <div className="size-4 rounded bg-gray-700"></div>
          </div>

          {/* Action button */}
          <div className="h-10 w-full rounded-lg bg-gray-700"></div>
        </div>

        {/* Daily Cost Chart Skeleton */}
        <div className="bg-background relative flex w-full flex-col items-start rounded-2xl border border-solid border-gray-700 p-6 shadow-sm">
          <div className="mb-2 flex w-full items-center justify-between">
            <div className="h-6 w-24 rounded bg-gray-700"></div>
            <div className="h-4 w-16 rounded bg-gray-700"></div>
          </div>
          <div className="h-48 w-full rounded-lg bg-gray-800"></div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-5">
        {/* Quick Navigation Cards Skeleton */}
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-background flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-solid border-gray-700 p-4 shadow-sm"
            >
              <div className="size-8 rounded-full bg-gray-700"></div>
              <div className="h-4 w-20 rounded bg-gray-700"></div>
            </div>
          ))}
        </div>

        {/* Recent Transactions Skeleton */}
        <div className="bg-background flex w-full flex-col rounded-2xl border border-solid border-gray-700 p-6 shadow-sm">
          <div className="mb-4 h-6 w-32 rounded bg-gray-700"></div>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
              >
                <div className="size-6 rounded bg-gray-700"></div>
                <div className="flex-1">
                  <div className="mb-1 h-4 w-32 rounded bg-gray-700"></div>
                  <div className="h-3 w-20 rounded bg-gray-700"></div>
                </div>
                <div className="h-5 w-16 rounded bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
