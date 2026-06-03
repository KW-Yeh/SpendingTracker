export const TransactionsSkeleton = () => {
  return (
    <div className="content-wrapper animate-pulse">
      {/* Year/Month Filter Skeleton */}
      <div className="flex h-10 w-64 self-center rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-sm"></div>

      {/* Sort and Search Controls Skeleton */}
      <div className="ml-auto flex items-center gap-3">
        <div className="h-9 w-24 rounded-lg border border-gray-700 bg-gray-800"></div>
        <div className="h-9 w-40 rounded-lg border border-gray-700 bg-gray-800"></div>
      </div>

      {/* Spending List Skeleton */}
      <div className="bg-background w-full rounded-2xl border border-solid border-gray-700 p-5 shadow-sm">
        {/* Spending Items Skeleton */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i}>
              <div className="mb-2 h-5 w-24 rounded bg-gray-700"></div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="flex items-center gap-2 rounded-lg bg-gray-800 p-3"
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
          ))}
        </div>
      </div>
    </div>
  );
};
