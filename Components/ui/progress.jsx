import * as React from "react";

const Progress = React.forwardRef(({ className = "", value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative h-4 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}
    {...props}
  >
    <div
      className="h-full bg-blue-600 transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
