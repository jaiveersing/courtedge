import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/src/contexts/ThemeContext';

export const ThemeToggle = ({ variant = 'button', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-slate-400" />
          ) : (
            <Sun className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light'
              ? 'rotate-0 scale-100 text-orange-400'
              : 'rotate-90 scale-0 text-slate-600'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 text-blue-400'
              : '-rotate-90 scale-0 text-slate-600'
          }`}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-sm text-slate-400 group-hover:text-slate-300">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

export const ThemeToggleWithOptions = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-colors"
        aria-label="Theme options"
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-blue-400" />
        ) : (
          <Sun className="w-5 h-5 text-orange-400" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 rounded-lg bg-slate-800 border border-slate-700 shadow-xl z-50 overflow-hidden">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    theme === option.value
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {theme === option.value && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
