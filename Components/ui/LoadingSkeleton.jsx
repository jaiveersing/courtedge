import { Skeleton } from './skeleton';

export function LoadingSkeleton({ count = 3, height = 'h-20', className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={height} />
      ))}
    </div>
  );
}
