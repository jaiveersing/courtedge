import { Badge } from './badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function EVBadge({ ev, size = 'default' }) {
  if (ev === null || ev === undefined) return null;
  
  const evNum = parseFloat(ev);
  const isPositive = evNum > 0;
  const variant = isPositive ? 'default' : 'secondary';
  const colorClass = isPositive ? 'bg-green-600' : 'bg-red-600';
  
  return (
    <Badge variant={variant} className={`${colorClass} text-white`}>
      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
      {isPositive ? '+' : ''}{evNum.toFixed(1)}% EV
    </Badge>
  );
}
