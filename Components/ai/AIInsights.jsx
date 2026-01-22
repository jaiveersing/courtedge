import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

export default function AIInsights({ player, insights, theme = 'dark' }) {
  // Theme-aware styling
  const ds = {
    bgCard: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
    bgCardAlt: theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50',
    border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    borderHover: theme === 'dark' ? 'hover:border-slate-600' : 'hover:border-slate-300',
    text: theme === 'dark' ? 'text-white' : 'text-slate-900',
    textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
    iconBg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100',
  };

  const mockInsights = insights || [
    {
      type: 'prediction',
      title: 'Strong Over Prediction',
      description: 'AI model predicts 78% chance player exceeds 25.5 points tonight',
      confidence: 'high',
      icon: Brain,
    },
    {
      type: 'trend',
      title: 'Hot Streak Detected',
      description: 'Player has exceeded points line in 8 of last 10 games',
      confidence: 'medium',
      icon: TrendingUp,
    },
    {
      type: 'alert',
      title: 'Matchup Advantage',
      description: 'Opponent ranks 28th in defensive rating vs player position',
      confidence: 'high',
      icon: AlertCircle,
    },
  ];

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <Card className={`${ds.bgCard} ${ds.border}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${ds.text}`}>
          <Brain className="h-5 w-5 text-purple-400" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockInsights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div
              key={idx}
              className={`p-4 ${ds.bgCardAlt} rounded border ${ds.border} ${ds.borderHover} transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 ${ds.iconBg} rounded`}>
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${ds.text}`}>{insight.title}</h4>
                    <Badge className={getConfidenceColor(insight.confidence)}>
                      {insight.confidence}
                    </Badge>
                  </div>
                  <p className={`text-sm ${ds.textSecondary}`}>{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
