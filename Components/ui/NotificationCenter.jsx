import { useState, useEffect } from 'react';
import { Bell, X, TrendingUp, AlertTriangle, CheckCircle, Info, Flame, DollarSign } from 'lucide-react';
import { AppCard } from './AppCard';
import { Button } from './button';

const notificationTypes = {
  success: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' },
  info: { icon: Info, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  hot: { icon: Flame, color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
  profit: { icon: DollarSign, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' }
};

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
    // Simulate new notifications every 30 seconds
    const interval = setInterval(() => {
      addRandomNotification();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'hot',
        title: 'Hot Streak Alert',
        message: "You've won 5 bets in a row! Your win rate is climbing.",
        timestamp: Date.now() - 300000,
        read: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Line Movement',
        message: 'LAL vs GSW spread moved from -3.5 to -5.0 (2 point move)',
        timestamp: Date.now() - 600000,
        read: false
      },
      {
        id: '3',
        type: 'info',
        title: 'New Props Available',
        message: '12 new high-value player props added for tonight\'s games',
        timestamp: Date.now() - 900000,
        read: true
      },
      {
        id: '4',
        type: 'profit',
        title: 'Daily Goal Reached',
        message: 'You\'ve hit your $200 daily profit target. Great job!',
        timestamp: Date.now() - 3600000,
        read: true
      },
      {
        id: '5',
        type: 'success',
        title: 'Bet Won',
        message: 'Luka Doncic Over 28.5 points hit! +$115 profit',
        timestamp: Date.now() - 7200000,
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const addRandomNotification = () => {
    const randomNotifications = [
      { type: 'hot', title: 'Value Bet Alert', message: 'Found 3 props with +EV over 5%' },
      { type: 'warning', title: 'Sharp Money Detected', message: 'Heavy betting on DEN -4.5 (78% of money)' },
      { type: 'info', title: 'Injury Update', message: 'Jayson Tatum listed as questionable for tonight' },
      { type: 'profit', title: 'Weekly Target', message: 'You\'re 85% toward your $1000 weekly goal' }
    ];
    
    const random = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
    const newNotification = {
      id: Date.now().toString(),
      type: random.type,
      title: random.title,
      message: random.message,
      timestamp: Date.now(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
return 'Just now';
}
    if (diff < 3600000) {
return `${Math.floor(diff / 60000)}m ago`;
}
    if (diff < 86400000) {
return `${Math.floor(diff / 3600000)}h ago`;
}
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2">
                {['all', 'hot', 'profit', 'warning', 'info'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filter === type 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[450px]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <>
                  {unreadCount > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                  
                  {filteredNotifications.map(notification => {
                    const config = notificationTypes[notification.type];
                    const Icon = config.icon;
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                          !notification.read ? 'bg-slate-800/20' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} ${config.borderColor} border flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-white">
                                {notification.title}
                              </h4>
                              <button
                                onClick={() => dismissNotification(notification.id)}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-slate-400 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
