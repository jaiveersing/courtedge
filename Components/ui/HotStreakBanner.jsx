import { useState, useEffect } from 'react';
import { Flame, TrendingUp, Target, Zap, X } from 'lucide-react';

export default function HotStreakBanner() {
  const [streak, setStreak] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkForHotStreak();
  }, []);

  const checkForHotStreak = () => {
    // Simulate checking user's recent performance
    const winStreak = Math.floor(Math.random() * 8) + 3; // 3-10 wins
    const accuracy = 65 + Math.random() * 25; // 65-90%
    const roi = 5 + Math.random() * 20; // 5-25%
    
    if (winStreak >= 5 || accuracy >= 75 || roi >= 15) {
      setStreak({
        winStreak,
        accuracy,
        roi,
        type: winStreak >= 7 ? 'fire' : winStreak >= 5 ? 'hot' : 'warm'
      });
      setVisible(true);
    }
  };

  if (!visible || !streak) return null;

  const getStreakConfig = () => {
    switch (streak.type) {
      case 'fire':
        return {
          gradient: 'from-orange-500 via-red-500 to-pink-500',
          icon: Flame,
          title: '🔥 ON FIRE!',
          subtitle: `${streak.winStreak} WIN STREAK`,
          animation: 'animate-pulse'
        };
      case 'hot':
        return {
          gradient: 'from-yellow-500 via-orange-500 to-red-500',
          icon: TrendingUp,
          title: '🚀 HOT STREAK',
          subtitle: `${streak.winStreak} WINS IN A ROW`,
          animation: ''
        };
      default:
        return {
          gradient: 'from-blue-500 via-purple-500 to-pink-500',
          icon: Target,
          title: '✨ GREAT RUN',
          subtitle: `${streak.accuracy.toFixed(1)}% ACCURACY`,
          animation: ''
        };
    }
  };

  const config = getStreakConfig();
  const Icon = config.icon;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.gradient} p-1 mb-6 ${config.animation}`}>
      <div className="bg-slate-950 rounded-xl p-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center ${config.animation}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {config.title}
              </h3>
              <p className="text-slate-400 font-medium">
                {config.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {streak.accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Accuracy
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                +{streak.roi.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                ROI
              </div>
            </div>

            <button
              onClick={() => setVisible(false)}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 relative">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-1000`}
              style={{ width: `${Math.min((streak.winStreak / 10) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Keep it going!</span>
            <span>{10 - streak.winStreak} more wins to reach Elite status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
