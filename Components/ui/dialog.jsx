import * as React from "react";
import { X } from "lucide-react";

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);
  
  React.useEffect(() => {
    if (open !== undefined) {
setIsOpen(open);
}
  }, [open]);
  
  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onValueChange) {
onOpenChange(newOpen);
}
  };
  
  return React.Children.map(children, child =>
    child ? React.cloneElement(child, { isOpen, onOpenChange: handleOpenChange }) : null
  );
};

const DialogTrigger = ({ children, isOpen, onOpenChange, ...props }) => {
  return React.cloneElement(children, {
    onClick: () => onOpenChange && onOpenChange(true),
    ...props
  });
};

const DialogPortal = ({ children }) => children;

const DialogOverlay = React.forwardRef(({ className = "", onClick, ...props }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={`fixed inset-0 z-50 bg-black/80 ${className}`}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className = "", children, isOpen, onOpenChange, ...props }, ref) => {
  if (!isOpen) {
return null;
}
  
  return (
    <div className="fixed inset-0 z-50">
      <DialogOverlay onClick={() => onOpenChange && onOpenChange(false)} />
      <div
        ref={ref}
        className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-700 bg-slate-800 p-6 shadow-lg sm:rounded-lg md:w-full ${className}`}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange && onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className = "", ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h2 ref={ref} className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`text-sm text-slate-400 ${className}`} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
