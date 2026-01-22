import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Target,
  BarChart3,
  Activity,
  Zap,
  DollarSign,
  Flame,
  Shield,
  Brain,
  Trophy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  LineChart,
  TrendingDown
} from "lucide-react";
import MLServiceStatus from "@/Components/ml/MLServiceStatus";

export default function Dashboard() {
  const [stats, setStats] = useState({
    liveGames: 8,
    roiPercent: 12.4,
    totalEVProps: 23,
    todaysProfit: 247.50,
    growthPercent: 8.3,
    dayStreak: 5,
    accuracy: 76.3,
    disciplineScore: 82,
    avgCLV: 4.3,
    eliteOpportunities: 3,
    bankroll: 5420,
    weekProfit: 1250
  });

  const [recentBets, setRecentBets] = useState([
    { player: "LeBron James", stat: "Points", line: 25.5, result: "Over", profit: 45.50, odds: 1.91 },
    { player: "Stephen Curry", stat: "3PT Made", line: 4.5, result: "Under", profit: -25.00, odds: 1.85 },
    { player: "Giannis A.", stat: "Rebounds", line: 11.5, result: "Over", profit: 38.20, odds: 1.90 },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 mesh-gradient opacity-30"></div>
        <div className="absolute inset-0 grid-pattern"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Hero Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-3">
                <span className="gradient-text">CourtEdge</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                AI-Powered Sports Betting Intelligence
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Total Bankroll</div>
                <div className="text-3xl font-bold text-foreground">
                  ${stats.bankroll.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Profit */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Today's Profit</p>
                <h3 className={`text-4xl font-bold ${stats.todaysProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.todaysProfit >= 0 ? '+' : ''}${stats.todaysProfit.toFixed(2)}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {stats.growthPercent >= 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stats.growthPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(stats.growthPercent).toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Win Streak */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Win Streak</p>
                <h3 className="text-4xl font-bold text-blue-500">{stats.dayStreak} Days</h3>
                <div className="flex items-center gap-1 mt-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-500">
                    {stats.accuracy.toFixed(1)}% Accuracy
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Flame className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* ROI */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">ROI This Month</p>
                <h3 className="text-4xl font-bold text-purple-500">+{stats.roiPercent}%</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-500">
                    ${stats.weekProfit} this week
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Elite Props */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Elite Props Available</p>
                <h3 className="text-4xl font-bold text-cyan-500">{stats.eliteOpportunities}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <Brain className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm font-medium text-cyan-500">
                    AI-Verified Edges
                  </span>
                </div>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content - Recent Bets */}
          <div className="lg:col-span-2 animate-slide-in-up stagger-5">
            <div className="card-glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Recent Performance</h2>
                <Link to="/bets">
                  <button className="btn-ghost text-sm">View All</button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentBets.map((bet, i) => (
                  <div 
                    key={i} 
                    className="p-4 bg-card/50 border border-border rounded-xl hover:bg-card/80 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-foreground text-lg">{bet.player}</span>
                          <span className={`badge-${bet.profit >= 0 ? 'success' : 'error'}`}>
                            {bet.result}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {bet.stat} {bet.line} @ {bet.odds}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${bet.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Sharp Money Alert</p>
                    <p className="text-sm text-muted-foreground">
                      Heavy action detected on Lakers -3.5. Line may move soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="space-y-6 animate-slide-in-up stagger-6">
            {/* ML Service Status */}
            <MLServiceStatus />

            {/* Quick Actions */}
            <div className="card-glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/predictions">
                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <Brain className="w-4 h-4" />
                    Get AI Predictions
                  </button>
                </Link>
                <Link to="/player-props">
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" />
                    Browse Props
                  </button>
                </Link>
                <Link to="/analytics">
                  <button className="btn-ghost w-full flex items-center justify-center gap-2">
                    <LineChart className="w-4 h-4" />
                    View Analytics
                  </button>
                </Link>
              </div>
            </div>

            {/* Performance Score */}
            <div className="card-gradient p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-foreground mb-4">Discipline Score</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(stats.disciplineScore / 100) * 351.858} 351.858`}
                      className="text-purple-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{stats.disciplineScore}</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Excellent discipline! Keep following your strategy.
              </p>
            </div>
          </div>
        </div>

        {/* Live Games Banner */}
        <div className="animate-slide-in-up stagger-7">
          <div className="card-elevated p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-purple-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {stats.liveGames} Live Games Today
                  </h3>
                  <p className="text-muted-foreground">
                    {stats.totalEVProps} props with positive expected value detected
                  </p>
                </div>
              </div>
              <Link to="/todays-matchups">
                <button className="btn-primary">
                  View Matchups
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
