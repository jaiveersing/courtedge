import * as React from "react";

const Tabs = ({ children, defaultValue, value, onValueChange, className = '', ...props }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);
  
  React.useEffect(() => {
    if (value !== undefined) setActiveTab(value);
  }, [value]);
  
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };
  
  return (
    <div className={`w-full ${className}`} {...props}>
      {React.Children.map(children, child => 
        child ? React.cloneElement(child, { activeTab, onTabChange: handleTabChange }) : null
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, onTabChange, className = '', ...props }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-800 p-1 text-slate-400 ${className}`} {...props}>
    {React.Children.map(children, child => 
      child ? React.cloneElement(child, { activeTab, onTabChange }) : null
    )}
  </div>
);

const TabsTrigger = ({ children, value, activeTab, onTabChange, className = '', ...props }) => {
  const isActive = activeTab === value;
  return (
    <button 
      type="button" 
      onClick={() => onTabChange && onTabChange(value)} 
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 ${
        isActive ? 'bg-slate-900 text-slate-50 shadow-sm' : 'hover:bg-slate-700'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeTab, className = '', ...props }) => 
  activeTab === value ? (
    <div className={`mt-2 ring-offset-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${className}`} {...props}>
      {children}
    </div>
  ) : null;

export { Tabs, TabsList, TabsTrigger, TabsContent };
