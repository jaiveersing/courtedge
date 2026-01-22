import { Badge } from './badge';

export function LiveIndicator({ isLive = true }) {
  if (!isLive) return null;
  
  return (
    <Badge className="bg-red-600 text-white animate-pulse">
      <span className="inline-block w-2 h-2 rounded-full bg-white mr-1"></span>
      LIVE
    </Badge>
  );
}
