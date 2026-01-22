import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Zap, DollarSign, Users } from 'lucide-react';
import { AppCard } from './AppCard';

export default function LiveAlerts({ maxAlerts = 5 }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    generateInitialAlerts();
    
    // Add new alert every 15-30 seconds
    const interval = setInterval(() => {
      addRandomAlert();
    }, Math.random() * 15000 + 15000);

    return () => clearInterval(interval);
  }, []);

  const generateInitialAlerts = () => {
    const initialAlerts = [
      {
        id: '1',
        type: 'line_movement',
        icon: TrendingUp,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        title: 'Significant Line Movement',
        message: 'LAL vs GSW spread moved from -3.5 to -5.5',
        details: '67% of bets on Lakers',
        timestamp: Date.now()
      },
      {
        id: '2',
        type: 'sharp_money',
        icon: DollarSign,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        title: 'Sharp Money Alert',
        message: 'Heavy action on DEN -4.5',
        details: '82% of money, 45% of bets',
        timestamp: Date.now() - 60000
      },
      {
        id: '3',
        type: 'value_bet',
        icon: Zap,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        title: 'High Value Prop Found',
        message: 'Luka Doncic O29.5 pts at +105',
        details: '+7.2% EV vs fair odds',
        timestamp: Date.now() - 120000
      }
    ];
    
    setAlerts(initialAlerts);
  };

  const addRandomAlert = () => {
    const alertTemplates = [
      {
        type: 'line_movement',
        icon: TrendingUp,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        getMessage: () => {
          const teams = ['LAL vs GSW', 'BOS vs MIA', 'PHX vs DAL', 'MIL vs DEN'];
          const team = teams[Math.floor(Math.random() * teams.length)];
          const oldLine = (Math.random() * 4 + 2).toFixed(1);
          const newLine = (parseFloat(oldLine) + (Math.random() * 3 - 1)).toFixed(1);
          return {
            title: 'Line Movement Detected',
            message: `${team} spread moved from -${oldLine} to -${newLine}`,
            details: `${Math.floor(Math.random() * 30 + 55)}% of bets on favorite`
          };
        }
      },
      {
        type: 'sharp_money',
        icon: DollarSign,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        getMessage: () => {
          const teams = ['LAL', 'GSW', 'BOS', 'MIA', 'PHX', 'DAL'];
          const team = teams[Math.floor(Math.random() * teams.length)];
          const line = (Math.random() * 8 + 1).toFixed(1);
          return {
            title: 'Sharp Money Alert',
            message: `Professional bettors on ${team} -${line}`,
            details: `${Math.floor(Math.random() * 20 + 70)}% of money, ${Math.floor(Math.random() * 20 + 35)}% of bets`
          };
        }
      },
      {
        type: 'value_bet',
        icon: Zap,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        getMessage: () => {
          const players = ['Luka Doncic', 'Giannis Antetokounmpo', 'Joel Embiid', 'Steph Curry'];
          const player = players[Math.floor(Math.random() * players.length)];
          const line = (Math.random() * 10 + 25).toFixed(1);
          const ev = (Math.random() * 8 + 3).toFixed(1);
          return {
            title: 'Value Bet Opportunity',
            message: `${player} O${line} pts at favorable odds`,
            details: `+${ev}% Expected Value`
          };
        }
      },
      {
        type: 'reverse_line_movement',
        icon: TrendingDown,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        getMessage: () => {
          const teams = ['MIA', 'BOS', 'CHI', 'CLE'];
          const team = teams[Math.floor(Math.random() * teams.length)];
          return {
            title: 'Reverse Line Movement',
            message: `${team} line moving against public money`,
            details: 'Sharp action likely driving the move'
          };
        }
      },
      {
        type: 'public_fade',
        icon: Users,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        getMessage: () => {
          const teams = ['LAL', 'GSW', 'BOS', 'MIA'];
          const team = teams[Math.floor(Math.random() * teams.length)];
          const percentage = Math.floor(Math.random() * 15 + 75);
          return {
            title: 'Heavy Public Betting',
            message: `${percentage}% of bets on ${team}`,
            details: 'Consider fading the public'
          };
        }
      }
    ];

    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const content = template.getMessage();
    
    const newAlert = {
      id: Date.now().toString(),
      type: template.type,
      icon: template.icon,
      color: template.color,
      bgColor: template.bgColor,
      ...content,
      timestamp: Date.now()
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, maxAlerts));
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="space-y-3">
      {alerts.map(alert => {
        const Icon = alert.icon;
        
        return (
          <div
            key={alert.id}
            className={`p-4 rounded-lg ${alert.bgColor} border border-white/5 hover:border-white/10 transition-all cursor-pointer`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${alert.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-white">
                    {alert.title}
                  </h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-slate-300 mb-1">
                  {alert.message}
                </p>
                
                <p className="text-xs text-slate-500">
                  {alert.details}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
