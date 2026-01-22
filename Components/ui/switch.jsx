import * as React from "react";

const Switch = React.forwardRef(({ className = "", checked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleClick = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleClick}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        isChecked ? 'bg-blue-600' : 'bg-slate-700'
      } ${className}`}
      ref={ref}
      {...props}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
});
Switch.displayName = "Switch";

export { Switch };
