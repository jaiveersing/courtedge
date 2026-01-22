
import { useState, useEffect } from 'react';
import EnhancedPerformance from '../Components/analytics/EnhancedPerformance';
import { Button } from '@/Components/ui/button';
import { mockBetsDatabase, getDatabaseStats } from '@/src/data/mockBetsDatabase';

export default function PortfolioPage() {
  // State variables for time range and betting data
  const [timeRange, setTimeRange] = useState('all'); // Default to showing all data
  const [bets, setBets] = useState([]); // Raw betting data (would typically be fetched from an API)
  const [filteredBets, setFilteredBets] = useState([]); // Bets filtered by the selected time range

  // Load betting data from mock database
  useEffect(() => {
    // Use the comprehensive 200-bet database
    setBets(mockBetsDatabase);
    console.log('📊 Loaded betting database:', getDatabaseStats());
  }, []); // Run once on component mount

  // Effect to filter bets whenever 'bets' or 'timeRange' changes
  useEffect(() => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case 'all':
      default:
        // No date filtering needed for 'all'
        setFilteredBets(bets);
        return;
    }

    // Filter bets that occurred on or after the startDate
    const newFilteredBets = bets.filter(bet => bet.date >= startDate);
    setFilteredBets(newFilteredBets);
  }, [timeRange, bets]); // Dependencies for the effect

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Mobile-Responsive Header with Time Range Selection */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Performance Analytics</h1>
            <p className="text-sm sm:text-base text-slate-400">Deep dive into your betting performance and trends</p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7d')}
              className={timeRange === '7d' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              7D
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30d')}
              className={timeRange === '30d' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              30D
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90d')}
              className={timeRange === '90d' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              90D
            </Button>
            <Button
              variant={timeRange === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('all')}
              className={timeRange === 'all' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              All
            </Button>
          </div>
        </div>

        {/* Enhanced Performance Component now receives filtered bets */}
        <EnhancedPerformance data={filteredBets} />

        {/* No other components from the original file are retained here based on the outline */}
      </div>
    </div>
  );
}

