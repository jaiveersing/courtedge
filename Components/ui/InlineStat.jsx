export function InlineStat({ label, value, icon: Icon, trend, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{value}</span>
        {trend && (
          <span className={`text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}
