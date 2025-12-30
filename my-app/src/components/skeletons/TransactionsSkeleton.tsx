export const TransactionsSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse">
      {/* Year/Month Filter Skeleton */}
      <div className="flex self-center rounded-lg border border-gray-200 bg-gray-100 p-2 shadow-sm h-10 w-64"></div>

      <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
        {/* Spending List Skeleton */}
        <div className="bg-background flex w-full flex-col rounded-2xl border border-solid border-gray-200 p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="ml-auto h-9 w-40 bg-gray-100 rounded-lg border border-gray-200"></div>
          </div>

          {/* Spending Items Skeleton */}
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <div className="mb-2 h-5 w-24 bg-gray-200 rounded"></div>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 rounded-lg bg-gray-50 p-3"
                    >
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
