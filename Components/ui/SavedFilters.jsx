import { useState, useEffect } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Save, Trash2, Filter } from 'lucide-react';

export default function SavedFilters({ onApplyFilter, currentFilters }) {
  const [savedFilters, setSavedFilters] = useState([]);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    // Load saved filters from localStorage
    const stored = localStorage.getItem('savedFilters');
    if (stored) {
      try {
        setSavedFilters(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load saved filters:', e);
      }
    }
  }, []);

  const saveCurrentFilter = () => {
    if (!filterName.trim()) {
      alert('Please enter a filter name');
      return;
    }

    const newFilter = {
      id: Date.now(),
      name: filterName,
      filters: currentFilters,
      createdAt: new Date().toISOString()
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
    setFilterName('');
  };

  const deleteFilter = (id) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
  };

  const applyFilter = (filter) => {
    if (onApplyFilter) {
      onApplyFilter(filter.filters);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg">
      <div className="flex gap-2">
        <input
          type="text"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Filter name..."
          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
        />
        <Button onClick={saveCurrentFilter} size="sm">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <Filter className="h-4 w-4" />
          <span>Saved Filters ({savedFilters.length})</span>
        </div>
        {savedFilters.map((filter) => (
          <div key={filter.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
            <button
              onClick={() => applyFilter(filter)}
              className="flex-1 text-left text-sm text-white hover:text-blue-400"
            >
              {filter.name}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteFilter(filter.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {savedFilters.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">No saved filters</p>
        )}
      </div>
    </div>
  );
}
