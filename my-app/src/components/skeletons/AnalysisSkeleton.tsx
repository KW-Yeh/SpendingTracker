export const AnalysisSkeleton = () => (
  <div className="content-wrapper animate-pulse !items-stretch lg:max-w-7xl">
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-3 w-28 rounded bg-gray-700" />
        <div className="h-8 w-52 rounded bg-gray-700" />
      </div>
      <div className="hidden h-11 w-64 rounded-xl bg-gray-700 sm:block" />
    </div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="card h-32 bg-gray-800" />
      ))}
    </div>
    <div className="card h-96 bg-gray-800" />
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="card h-96 bg-gray-800" />
      <div className="card h-96 bg-gray-800" />
    </div>
  </div>
);
