export const BudgetSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>

      <div className="flex w-full flex-col gap-5">
        {/* Annual Budget Section Skeleton */}
        <div className="bg-background flex w-full flex-col gap-4 rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2 rounded-lg bg-gray-50 p-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Budget Section Skeleton */}
        <div className="bg-background flex w-full flex-col gap-4 rounded-2xl border border-solid border-gray-200 p-6 shadow-sm">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>

          {/* Monthly Blocks Skeleton */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-100 rounded-full mt-1">
                  <div className="h-3 bg-gray-200 rounded-full" style={{ width: '60%' }}></div>
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
    </div>
  );
};
