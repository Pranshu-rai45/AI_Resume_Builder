const Skeleton = ({ className = '', width, height }) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height: height || '1rem' }}
  />
);

export const SkeletonCard = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <Skeleton className="h-8 w-28 rounded-lg" />
  </div>
);

export const SkeletonLine = ({ count = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-4" style={{ width: `${85 - i * 10}%` }} />
    ))}
  </div>
);

export default Skeleton;
