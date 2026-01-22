import * as React from "react";
import { ChevronDown } from "lucide-react";

const Select = ({ children, value, onValueChange, defaultValue, ...props }) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "");
  
  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className="relative inline-block w-full" {...props}>
      {React.Children.map(children, child => {
        if (!child) return null;
        return React.cloneElement(child, { 
          value: selectedValue, 
          onValueChange: handleValueChange 
        });
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ className = "", children, value, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, value, children }) => {
  return <span className="block truncate">{value || children || placeholder}</span>;
};

const SelectContent = React.forwardRef(({ className = "", children, value, onValueChange, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-slate-700 bg-slate-800 text-slate-50 shadow-md ${className}`}
      {...props}
    >
      <div className="p-1 max-h-60 overflow-y-auto">
        {React.Children.map(children, child => {
          if (!child) return null;
          return React.cloneElement(child, { 
            currentValue: value,
            onValueChange 
          });
        })}
      </div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className = "", children, value, currentValue, onValueChange, ...props }, ref) => {
  const isSelected = currentValue === value;
  
  return (
    <div
      ref={ref}
      onClick={() => onValueChange && onValueChange(value)}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-slate-700 focus:bg-slate-700 ${isSelected ? 'bg-slate-700' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectGroup = ({ children, ...props }) => <div className="p-1" {...props}>{children}</div>;

const SelectLabel = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div ref={ref} className={`py-1.5 px-2 text-sm font-semibold text-slate-400 ${className}`} {...props}>
    {children}
  </div>
));
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`-mx-1 my-1 h-px bg-slate-700 ${className}`} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
