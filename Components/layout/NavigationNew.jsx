import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Wallet, 
  BarChart3, 
  Settings,
  Gamepad2,
  Target,
  LineChart,
  Trophy,
  Activity,
  ChevronLeft,
  ChevronRight,
  Brain,
  Sparkles
} from 'lucide-react';

export default function Navigation({ collapsed, onToggleCollapse }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/workstation', icon: Target, label: 'Workstation', color: 'from-blue-500 to-purple-500' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'from-cyan-500 to-blue-500' },
    { path: '/player-trends', icon: TrendingUp, label: 'Player Trends', color: 'from-teal-500 to-green-500' },
    { path: '/players', icon: Users, label: 'Player Database', color: 'from-indigo-500 to-purple-500' },
    { path: '/ml-workstation', icon: Trophy, label: 'ML Workstation', color: 'from-violet-500 to-purple-500' },
    { path: '/bets', icon: Target, label: 'My Bets', color: 'from-blue-500 to-indigo-500' },
    { path: '/bankroll', icon: Wallet, label: 'Bankroll', color: 'from-green-500 to-teal-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'from-slate-500 to-gray-500' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card/95 backdrop-blur-xl border-r border-border transition-all duration-300 z-40 overflow-y-auto no-scrollbar ${
        collapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center glow-purple">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  CourtEdge
                </h1>
                <p className="text-xs text-muted-foreground">AI Sports Intel</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center glow-purple mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-all duration-200 z-50 hover:scale-110"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-foreground" />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="p-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`
                  group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${collapsed ? 'justify-center' : ''}
                  ${
                    isActive
                      ? 'bg-primary/20 text-primary shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                {/* Gradient background on hover */}
                {!isActive && !collapsed && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200`}></div>
                )}

                {/* Icon with gradient on active */}
                <div className={`relative z-10 ${isActive ? `bg-gradient-to-br ${item.color} p-2 rounded-lg` : 'p-2'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                </div>

                {/* Label */}
                {!collapsed && (
                  <span className="relative z-10 font-medium text-sm">
                    {item.label}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full"></div>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-card border border-border rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap text-sm font-medium transition-opacity duration-200 z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/50 backdrop-blur">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-sm text-foreground">AI Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
