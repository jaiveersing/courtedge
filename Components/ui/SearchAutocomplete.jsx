import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, TrendingUp, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlayerSeasonStats } from '@/Entities/all';

const SearchAutocomplete = ({ placeholder = "Search players, teams, bets...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // Mock team data
  const teams = [
    { id: 'atl', name: 'Atlanta Hawks', abbr: 'ATL' },
    { id: 'bos', name: 'Boston Celtics', abbr: 'BOS' },
    { id: 'bkn', name: 'Brooklyn Nets', abbr: 'BKN' },
    { id: 'cha', name: 'Charlotte Hornets', abbr: 'CHA' },
    { id: 'chi', name: 'Chicago Bulls', abbr: 'CHI' },
    { id: 'cle', name: 'Cleveland Cavaliers', abbr: 'CLE' },
    { id: 'dal', name: 'Dallas Mavericks', abbr: 'DAL' },
    { id: 'den', name: 'Denver Nuggets', abbr: 'DEN' },
    { id: 'det', name: 'Detroit Pistons', abbr: 'DET' },
    { id: 'gsw', name: 'Golden State Warriors', abbr: 'GSW' },
    { id: 'hou', name: 'Houston Rockets', abbr: 'HOU' },
    { id: 'ind', name: 'Indiana Pacers', abbr: 'IND' },
    { id: 'lac', name: 'LA Clippers', abbr: 'LAC' },
    { id: 'lal', name: 'Los Angeles Lakers', abbr: 'LAL' },
    { id: 'mem', name: 'Memphis Grizzlies', abbr: 'MEM' },
    { id: 'mia', name: 'Miami Heat', abbr: 'MIA' },
    { id: 'mil', name: 'Milwaukee Bucks', abbr: 'MIL' },
    { id: 'min', name: 'Minnesota Timberwolves', abbr: 'MIN' },
    { id: 'nop', name: 'New Orleans Pelicans', abbr: 'NOP' },
    { id: 'nyk', name: 'New York Knicks', abbr: 'NYK' },
    { id: 'okc', name: 'Oklahoma City Thunder', abbr: 'OKC' },
    { id: 'orl', name: 'Orlando Magic', abbr: 'ORL' },
    { id: 'phi', name: 'Philadelphia 76ers', abbr: 'PHI' },
    { id: 'phx', name: 'Phoenix Suns', abbr: 'PHX' },
    { id: 'por', name: 'Portland Trail Blazers', abbr: 'POR' },
    { id: 'sac', name: 'Sacramento Kings', abbr: 'SAC' },
    { id: 'sas', name: 'San Antonio Spurs', abbr: 'SAS' },
    { id: 'tor', name: 'Toronto Raptors', abbr: 'TOR' },
    { id: 'uta', name: 'Utah Jazz', abbr: 'UTA' },
    { id: 'was', name: 'Washington Wizards', abbr: 'WAS' }
  ];

  // Debounced search
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Search players
      const players = await PlayerSeasonStats.list('-points_per_game');
      const matchingPlayers = players
        .filter(p => 
          p.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
        .map(p => ({
          type: 'player',
          id: p.id,
          name: p.player_name,
          team: p.team_abbreviation,
          subtitle: `${p.team_abbreviation} • ${p.points_per_game?.toFixed(1)} PPG`,
          image: p.player_image_url
        }));

      // Search teams
      const matchingTeams = teams
        .filter(t => 
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.abbr.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3)
        .map(t => ({
          type: 'team',
          id: t.id,
          name: t.name,
          abbr: t.abbr,
          subtitle: `NBA Team • ${t.abbr}`
        }));

      // Combine and limit results
      const combined = [...matchingPlayers, ...matchingTeams].slice(0, 8);
      setResults(combined);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
return;
}

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultClick = (result) => {
    if (result.type === 'player') {
      navigate(`/player/${result.id}`);
    } else if (result.type === 'team') {
      navigate(`/analytics?team=${result.abbr}`);
    }
    
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {/* Icon/Image */}
              <div className="flex-shrink-0">
                {result.type === 'player' ? (
                  result.image ? (
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=random&size=40`;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                  )
                ) : (
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">{result.abbr}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{result.name}</div>
                <div className="text-xs text-slate-400 truncate">{result.subtitle}</div>
              </div>

              {/* Badge */}
              <div>
                {result.type === 'player' ? (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                    Player
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                    Team
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 p-4 text-center">
          <div className="text-slate-400 text-sm">No results found for "{query}"</div>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
