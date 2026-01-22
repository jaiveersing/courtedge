import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PlayerHeader({ player, stats, theme = 'dark' }) {
  if (!player) return null;

  // Theme-aware styling
  const ds = {
    bgGradient: theme === 'dark' 
      ? 'bg-gradient-to-r from-slate-800 to-slate-900' 
      : 'bg-gradient-to-r from-white to-slate-50',
    border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    avatarBg: theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
  };

  return (
    <div className={`flex items-start gap-6 p-6 ${ds.bgGradient} rounded-lg border ${ds.border}`}>
      {/* Player Image */}
      <div className={`w-24 h-24 rounded-full ${ds.avatarBg} flex items-center justify-center text-3xl font-bold ${ds.text}`}>
        {player.name?.charAt(0) || '?'}
      </div>

      {/* Player Info */}
      <div className="flex-1">
        <h1 className={`text-3xl font-bold ${ds.text} mb-2`}>
          {player.name || 'Unknown Player'}
        </h1>
        <div className="flex items-center gap-4 mb-4">
          <Badge>{player.team || 'N/A'}</Badge>
          <Badge variant="outline">{player.position || 'N/A'}</Badge>
          <span className={ds.textMuted}>#{player.number || '--'}</span>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className={`${ds.textMuted} text-sm`}>PPG</p>
              <p className={`text-2xl font-bold ${ds.text}`}>
                {stats.points_per_game?.toFixed(1) || '0.0'}
              </p>
            </div>
            <div>
              <p className={`${ds.textMuted} text-sm`}>RPG</p>
              <p className={`text-2xl font-bold ${ds.text}`}>
                {stats.rebounds_per_game?.toFixed(1) || '0.0'}
              </p>
            </div>
            <div>
              <p className={`${ds.textMuted} text-sm`}>APG</p>
              <p className={`text-2xl font-bold ${ds.text}`}>
                {stats.assists_per_game?.toFixed(1) || '0.0'}
              </p>
            </div>
            <div>
              <p className={`${ds.textMuted} text-sm`}>FG%</p>
              <p className={`text-2xl font-bold ${ds.text}`}>
                {stats.field_goal_percentage?.toFixed(1) || '0.0'}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Trending Indicator */}
      <div className="text-right">
        <div className="flex items-center gap-2 text-green-400">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-semibold">Hot Streak</span>
        </div>
      </div>
    </div>
  );
}
