import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  ChevronDown,
  Shield,
  BarChart3
} from 'lucide-react';

export default function UserProfileDropdown() {
  // Mock user data - no auth required
  const user = { 
    name: 'Demo User', 
    email: 'demo@courtedge.com', 
    subscription: 'pro' 
  };
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // No logout needed - just refresh page
    window.location.reload();
  };

  const getSubscriptionBadge = () => {
    const badges = {
      free: { label: 'Free', color: 'bg-slate-600' },
      pro: { label: 'Pro', color: 'bg-blue-500' },
      elite: { label: 'Elite', color: 'bg-purple-500' }
    };
    return badges[user?.subscription] || badges.free;
  };

  const badge = getSubscriptionBadge();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-white">{user?.name || 'User'}</div>
          <div className="text-xs text-slate-400">{user?.email}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{user?.name || 'User'}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium text-white ${badge.color}`}>
                {badge.label}
              </span>
              {user?.subscription === 'free' && (
                <button
                  onClick={() => {
                    navigate('/settings?tab=subscription');
                    setIsOpen(false);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                navigate('/settings?tab=profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-white">Profile Settings</span>
            </button>
            
            <button
              onClick={() => {
                navigate('/analytics');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
            >
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-white">My Analytics</span>
            </button>

            <button
              onClick={() => {
                navigate('/settings?tab=subscription');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-white">Subscription</span>
            </button>

            <button
              onClick={() => {
                navigate('/settings?tab=security');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-white">Security</span>
            </button>

            <button
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-white">Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-700 py-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left group"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
              <span className="text-sm text-white group-hover:text-red-400">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
