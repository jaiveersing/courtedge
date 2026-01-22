import { useState, useEffect } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { PlayerSeasonStats, PlayerGameLog } from '@/Entities/all';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { ArrowLeft, TrendingUp, BarChart3, Home, Calendar, Target, Zap } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

import PlayerHeader from '../Components/player/PlayerHeader';
import PerformanceChart from '../Components/player/PerformanceChart';
import KeyStats from '../Components/player/KeyStats';
import BettingInsights from '../Components/player/BettingInsights';
import HomeAwayComparison from '../Components/player/HomeAwayComparison';
import Last30Games from '../Components/player/Last30Games';
import MatchupAnalysis from '../Components/player/MatchupAnalysis';
import PropsTrends from '../Components/player/PropsTrends';
import AIInsights from '../Components/ai/AIInsights';
import OddsComparison from '../Components/betting/OddsComparison';

export default function PlayerProfilePage() {
  const { theme } = useTheme();
  const [playerSeasons, setPlayerSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('2023-24');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameLogs, setGameLogs] = useState([]);
  const [last30Games, setLast30Games] = useState([]);
  const [homeAwayStats, setHomeAwayStats] = useState({ home: [], away: [] });
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Theme-aware styling
  const ds = {
    bg: theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50',
    bgCard: theme === 'dark' ? 'bg-slate-800' : 'bg-white',
    bgCardAlt: theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100',
    border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    hover: theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900',
  };

  useEffect(() => {
    const fetchPlayerData = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(location.search);
      const playerId = params.get('id');

      if (!playerId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get all seasons for this player
        const allPlayerSeasons = await PlayerSeasonStats.filter({ id: playerId });
        setPlayerSeasons(allPlayerSeasons);
        
        // Get current season data
        const currentSeasonData = allPlayerSeasons.find(p => p.season === selectedSeason) || allPlayerSeasons[0];
        if (currentSeasonData) {
          setCurrentPlayer(currentSeasonData);
          
          // Get game logs for selected season
          const seasonGameLogs = await PlayerGameLog.filter({ 
            player_id: playerId, 
            season: selectedSeason 
          }, '-game_date', 100);
          setGameLogs(seasonGameLogs);
          
          // Get last 30 games
          const recent30 = seasonGameLogs.slice(0, 30);
          setLast30Games(recent30);
          
          // Split home/away performance
          const homeGames = seasonGameLogs.filter(game => game.is_home_game === true);
          const awayGames = seasonGameLogs.filter(game => game.is_home_game === false);
          
          setHomeAwayStats({
            home: homeGames,
            away: awayGames
          });
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
      setIsLoading(false);
    };

    fetchPlayerData();
  }, [location.search, selectedSeason]);

  const availableSeasons = [...new Set(playerSeasons.map(p => p.season))].sort().reverse();

  if (isLoading) {
    return (
      <div className={`min-h-screen ${ds.bg} p-8`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className={`h-24 w-full ${ds.bgCard}`} />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className={`h-96 w-full ${ds.bgCard}`} />
              <Skeleton className={`h-64 w-full ${ds.bgCard}`} />
            </div>
            <div className="space-y-8">
              <Skeleton className={`h-80 w-full ${ds.bgCard}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className={`min-h-screen ${ds.bg} flex items-center justify-center ${ds.text}`}>
        <Card className={`${ds.bgCard} ${ds.border}`}>
          <CardContent className="p-8 text-center">
            <h2 className={`text-xl font-bold mb-4 ${ds.text}`}>Player Not Found</h2>
            <p className={`${ds.textMuted} mb-6`}>We couldn't find the player you're looking for.</p>
            <Link to={createPageUrl('Analytics')}>
              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${ds.bg} ${ds.text} p-6 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Analytics')} className={`inline-flex items-center gap-2 ${ds.textMuted} ${ds.hover}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to Analytics
          </Link>
          
          {availableSeasons.length > 1 && (
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className={`w-40 ${ds.bgCard} ${ds.border}`}>
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent className={`${ds.bgCard} ${ds.border}`}>
                {availableSeasons.map(season => (
                  <SelectItem key={season} value={season}>{season} Season</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <PlayerHeader player={currentPlayer} theme={theme} />
        
        {/* Season Comparison */}
        {availableSeasons.length > 1 && (
          <Card className={`${ds.bgCard} ${ds.border} mt-6`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-3 ${ds.text}`}>
                <TrendingUp className="w-5 h-5 text-green-400" />
                Career Overview
                <Badge className="bg-blue-500/20 text-blue-400">
                  {availableSeasons.length} Seasons
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {availableSeasons.slice(0, 4).map(season => {
                  const seasonData = playerSeasons.find(p => p.season === season);
                  return (
                    <div key={season} className={`p-4 rounded-lg border ${
                      season === selectedSeason 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : `${ds.border} ${ds.bgCardAlt}`
                    }`}>
                      <div className="text-center">
                        <div className={`text-sm ${ds.textMuted} mb-1`}>{season}</div>
                        <div className={`text-xl font-bold ${ds.text}`}>{seasonData?.points_per_game.toFixed(1)} PPG</div>
                        <div className={`text-sm ${ds.textMuted}`}>
                          {seasonData?.rebounds_per_game.toFixed(1)}R / {seasonData?.assists_per_game.toFixed(1)}A
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Enhanced Tabs System */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className={`grid w-full grid-cols-6 ${ds.bgCard} ${ds.border}`}>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="home-away" className="gap-2">
              <Home className="w-4 h-4" />
              Home/Away
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Calendar className="w-4 h-4" />
              Last 30
            </TabsTrigger>
            <TabsTrigger value="matchups" className="gap-2">
              <Target className="w-4 h-4" />
              Matchups
            </TabsTrigger>
            <TabsTrigger value="props" className="gap-2">
              <Zap className="w-4 h-4" />
              Props
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className={`${ds.bgCard} ${ds.border}`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-3 ${ds.text}`}>
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Performance Trends (Last 10 Games) - {selectedSeason}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PerformanceChart data={gameLogs.slice(0, 10)} theme={theme} />
                  </CardContent>
                </Card>

                <KeyStats player={currentPlayer} theme={theme} />
              </div>

              <div className="space-y-8">
                <AIInsights 
                  playerId={currentPlayer.id}
                  playerName={currentPlayer.player_name}
                  stat="points"
                  line={currentPlayer.points_per_game}
                  opponent="TBD"
                  isHome={true}
                  gameDate={new Date().toISOString().split('T')[0]}
                  theme={theme}
                />
                
                <BettingInsights player={currentPlayer} theme={theme} />
                
                <Card className={`${ds.bgCard} ${ds.border}`}>
                  <CardHeader>
                    <CardTitle className={ds.text}>Season Stats - {selectedSeason}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className={ds.textMuted}>Total Games</span>
                      <span className={`${ds.text} font-semibold`}>{currentPlayer.games_played}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.textMuted}>Home Games</span>
                      <span className={`${ds.text} font-semibold`}>{homeAwayStats.home.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.textMuted}>Away Games</span>
                      <span className={`${ds.text} font-semibold`}>{homeAwayStats.away.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ds.textMuted}>Avg Minutes</span>
                      <span className={`${ds.text} font-semibold`}>{currentPlayer.minutes_per_game.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceChart data={gameLogs.slice(0, 50)} theme={theme} />
          </TabsContent>

          <TabsContent value="home-away">
            <HomeAwayComparison homeStats={homeAwayStats.home} awayStats={homeAwayStats.away} theme={theme} />
          </TabsContent>

          <TabsContent value="recent">
            <Last30Games games={last30Games} theme={theme} />
          </TabsContent>

          <TabsContent value="matchups">
            <MatchupAnalysis player={currentPlayer} games={gameLogs} theme={theme} />
          </TabsContent>

          <TabsContent value="props">
            <PropsTrends player={currentPlayer} games={gameLogs} theme={theme} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


