import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { ArrowLeft, TrendingUp, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock player prop data
const mockPlayerData = {
  "J. Giddey": {
    team: "OKC",
    position: "PG",
    props: {
      "1Q Points": {
        line: 4.5,
        overOdds: "+110",
        underOdds: "-154",
        overHitRate: 80,
        underHitRate: 20,
        overRecord: "8/10",
        underRecord: "2/10",
        average: 6.1,
        last10: [3, 5, 6, 13, 6, 6, 6, 6, 6, 3]
      },
      "Points": {
        line: 15.5,
        overOdds: "+100",
        underOdds: "-130",
        overHitRate: 70,
        underHitRate: 30,
        overRecord: "7/10",
        underRecord: "3/10",
        average: 17.8,
        last10: [18, 16, 19, 21, 15, 17, 14, 20, 16, 18]
      },
      "Assists": {
        line: 6.5,
        overOdds: "+105",
        underOdds: "-140",
        overHitRate: 75,
        underHitRate: 25,
        overRecord: "7/10",
        underRecord: "3/10",
        average: 7.2,
        last10: [7, 8, 6, 9, 7, 6, 8, 7, 5, 8]
      }
    },
    seasonStats: {
      gp: 45,
      pts: 12.3,
      ast: 6.4,
      reb: 4.8,
      min: 25.3
    }
  }
};

export default function PlayerPropDetailPage() {
  const [selectedProp, setSelectedProp] = useState("1Q Points");
  const [timeframe, setTimeframe] = useState("Last 10");
  const [splitFilter, setSplitFilter] = useState("Home+Away");
  
  const params = new URLSearchParams(window.location.search);
  const playerName = params.get('player') || "J. Giddey";
  const team = params.get('team') || "OKC";
  
  const playerData = mockPlayerData[playerName] || mockPlayerData["J. Giddey"];
  const propData = playerData.props[selectedProp];
  
  const chartData = propData.last10.map((value, index) => ({
    game: `G${10 - index}`,
    value: value,
    line: propData.line
  })).reverse();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <Link to={createPageUrl(`GameProps?game=OKC@GSW`)}>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Players
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {playerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{playerName}</h1>
                <p className="text-sm text-slate-400">{team} • {playerData.position}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="workstation" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 mb-6">
            <TabsTrigger value="workstation">Workstation</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="parlay">Parlay</TabsTrigger>
            <TabsTrigger value="sgp">SGP</TabsTrigger>
          </TabsList>

          <TabsContent value="workstation" className="space-y-6">
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={selectedProp} onValueChange={setSelectedProp}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(playerData.props).map(prop => (
                    <SelectItem key={prop} value={prop}>{prop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 10">Last 10</SelectItem>
                  <SelectItem value="Last 20">Last 20</SelectItem>
                  <SelectItem value="Season">Season</SelectItem>
                </SelectContent>
              </Select>

              <Select value={splitFilter} onValueChange={setSplitFilter}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home+Away">Home+Away</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Away">Away</SelectItem>
                  <SelectItem value="With All">With All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prop Betting Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Over */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm">Type</span>
                    <span className="text-slate-400 text-sm">Hit Rate</span>
                    <span className="text-slate-400 text-sm">Odds</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">Over</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-400 font-bold">
                        {propData.overHitRate}%
                      </Badge>
                      <span className="text-sm text-slate-400">{propData.overRecord}</span>
                    </div>
                    <span className="text-green-400 font-bold text-xl">{propData.overOdds}</span>
                  </div>

                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold">
                    Take Over
                  </Button>
                </CardContent>
              </Card>

              {/* Under */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm">Type</span>
                    <span className="text-slate-400 text-sm">Hit Rate</span>
                    <span className="text-slate-400 text-sm">Odds</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">Under</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500/20 text-red-400 font-bold">
                        {propData.underHitRate}%
                      </Badge>
                      <span className="text-sm text-slate-400">{propData.underRecord}</span>
                    </div>
                    <span className="text-red-400 font-bold text-xl">{propData.underOdds}</span>
                  </div>

                  <Button variant="outline" className="w-full mt-4 border-red-500 text-red-400 hover:bg-red-500/10 font-semibold">
                    Take Under
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Stats and Average */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Stat</span>
                    <span className="text-slate-400">Average</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white font-semibold text-lg">{selectedProp}</span>
                    <span className="text-blue-400 font-bold text-2xl">{propData.average}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{propData.line}</div>
                    <div className="text-sm text-slate-400">Current Line</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Last 10 Games Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="game" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Season Stats */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  Season Stats
                  <Badge className="bg-blue-500/20 text-blue-400">{playerData.position}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerData.seasonStats.gp}</div>
                    <div className="text-xs text-slate-400">GP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerData.seasonStats.pts}</div>
                    <div className="text-xs text-slate-400">PTS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerData.seasonStats.ast}</div>
                    <div className="text-xs text-slate-400">AST</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerData.seasonStats.reb}</div>
                    <div className="text-xs text-slate-400">REB</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerData.seasonStats.min}</div>
                    <div className="text-xs text-slate-400">MIN</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Trends analysis coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parlay">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-12 text-center">
                <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Parlay builder coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sgp">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-12 text-center">
                <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Same Game Parlay coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

