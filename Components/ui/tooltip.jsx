import * as React from "react";

const TooltipProvider = ({ children }) => children;

const Tooltip = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return React.Children.map(children, child =>
    child ? React.cloneElement(child, { isOpen, setIsOpen }) : null
  );
};

const TooltipTrigger = React.forwardRef(({ children, isOpen, setIsOpen, ...props }, ref) => {
  return React.cloneElement(children, {
    ref,
    onMouseEnter: () => setIsOpen && setIsOpen(true),
    onMouseLeave: () => setIsOpen && setIsOpen(false),
    ...props
  });
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(({ className = "", children, isOpen, ...props }, ref) => {
  if (!isOpen) return null;
  
  return (
    <div
      ref={ref}
      className={`absolute z-50 overflow-hidden rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-50 shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
