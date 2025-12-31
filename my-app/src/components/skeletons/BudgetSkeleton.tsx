export const BudgetSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse space-y-3 md:space-y-5">
      {/* Annual and Monthly Budget Cards */}
      <div className="grid w-full grid-cols-1 gap-3 md:max-w-250 md:grid-cols-2 md:gap-5">
        {/* Annual Budget Section Skeleton */}
        <div className="bg-background w-full rounded-xl p-6 shadow">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="mt-4">
            <div className="h-9 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded mt-1"></div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>

        {/* Monthly Budget Section Skeleton */}
        <div className="bg-background w-full rounded-xl p-6 shadow">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="mt-4">
            <div className="h-9 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-36 bg-gray-200 rounded mt-1"></div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Blocks Skeleton */}
      <div className="bg-background flex w-full flex-col gap-4 rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>

        {/* Monthly Blocks Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
              <div className="h-2 w-full bg-gray-100 rounded-full mt-1">
                <div className="h-2 bg-gray-200 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Items List Skeleton */}
        <div className="mt-4 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="size-6 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
