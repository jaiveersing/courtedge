import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/src/contexts/ThemeContext';
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
  Sparkles,
  Zap,
  Star,
  CircleDot
} from 'lucide-react';

export default function Navigation({ collapsed, onToggleCollapse }) {
  const location = useLocation();
  const { theme } = useTheme();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/workstation', icon: Activity, label: 'Workstation', badge: 'Pro' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', badge: null },
    { path: '/player-trends', icon: TrendingUp, label: 'Player Trends', badge: 'Hot' },
    { path: '/players', icon: Users, label: 'Player Database', badge: null },
    { path: '/ml-workstation', icon: Sparkles, label: 'ML Workstation', badge: 'AI' },
    { path: '/portfolio', icon: Trophy, label: 'Portfolio', badge: null },
    { path: '/bets', icon: Target, label: 'Bets', badge: '3' },
    { path: '/bankroll', icon: Wallet, label: 'Bankroll', badge: null },
    { path: '/settings', icon: Settings, label: 'Settings', badge: null },
  ];

  // Theme-aware colors
  const bgColor = theme === 'dark' 
    ? 'rgba(15, 23, 42, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)';
  const borderColor = theme === 'dark' 
    ? 'rgba(51, 65, 85, 0.5)' 
    : 'rgba(226, 232, 240, 0.8)';
  const textColor = theme === 'dark' ? '#cbd5e1' : '#64748b';
  const textActiveColor = theme === 'dark' ? '#3b82f6' : '#2563eb';
  const textHoverColor = theme === 'dark' ? 'white' : '#1e293b';
  const hoverBg = theme === 'dark' 
    ? 'rgba(51, 65, 85, 0.5)' 
    : 'rgba(241, 245, 249, 0.8)';
  const activeBg = theme === 'dark' 
    ? 'rgba(59, 130, 246, 0.15)' 
    : 'rgba(59, 130, 246, 0.1)';
  const logoTextColor = theme === 'dark' ? 'white' : '#1e293b';
  const toggleBg = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const toggleBorder = theme === 'dark' ? '#334155' : '#e2e8f0';
  const toggleIconColor = theme === 'dark' ? 'text-white' : 'text-slate-600';

  const getBadgeStyle = (badge) => {
    if (!badge) return null;
    const styles = {
      'Pro': { bg: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.3)' },
      'Hot': { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
      'AI': { bg: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)' },
      'New': { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    };
    if (styles[badge]) return styles[badge];
    // Numeric badge (notification count)
    return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
  };

  return (
    <aside
      className="scrollbar-thin"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: collapsed ? '72px' : '280px',
        background: bgColor,
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${borderColor}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: theme === 'dark' 
          ? '4px 0 24px rgba(0, 0, 0, 0.3)' 
          : '4px 0 24px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Logo Section with Gradient Border */}
      <div 
        style={{ 
          padding: '1.5rem 1rem', 
          borderBottom: `1px solid ${borderColor}`,
          background: theme === 'dark' 
            ? 'linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, transparent 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                className="animate-pulse-glow"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: logoTextColor,
                  letterSpacing: '-0.025em',
                }}>
                  CourtEdge
                </h1>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#3b82f6',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Elite v3.0
                </span>
              </div>
            </div>
          ) : (
            <div 
              className="animate-float"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button with Enhanced Design */}
      <button
        onClick={onToggleCollapse}
        style={{
          position: 'absolute',
          top: '24px',
          right: '-14px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: toggleBg,
          border: `2px solid ${toggleBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#3b82f6';
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.querySelector('svg').style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = toggleBg;
          e.currentTarget.style.borderColor = toggleBorder;
          e.currentTarget.querySelector('svg').style.color = theme === 'dark' ? 'white' : '#475569';
        }}
      >
        {collapsed ? (
          <ChevronRight className={`h-4 w-4 ${toggleIconColor}`} style={{ transition: 'color 0.2s' }} />
        ) : (
          <ChevronLeft className={`h-4 w-4 ${toggleIconColor}`} style={{ transition: 'color 0.2s' }} />
        )}
      </button>

      {/* Quick Stats (when expanded) */}
      {!collapsed && (
        <div 
          className="animate-slide-in-up"
          style={{ 
            padding: '1rem',
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
          }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: theme === 'dark' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap className="w-3.5 h-3.5 text-green-500" />
                <span style={{ fontSize: '0.65rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today</span>
              </div>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: '#22c55e', marginTop: '0.25rem' }}>+$247</p>
            </div>
            <div style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: theme === 'dark' 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CircleDot className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span style={{ fontSize: '0.65rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live</span>
              </div>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: '#3b82f6', marginTop: '0.25rem' }}>8 Games</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items with Enhanced Design */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{ 
          padding: collapsed ? '0 0.5rem' : '0 0.75rem',
          marginBottom: '0.5rem',
        }}>
          {!collapsed && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '600',
              color: textColor,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0 0.5rem',
            }}>
              Navigation
            </span>
          )}
        </div>
        
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const badgeStyle = getBadgeStyle(item.badge);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`stagger-${index + 1} animate-slide-in-right`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? '0' : '0.75rem',
                padding: collapsed ? '0.875rem' : '0.75rem 1rem',
                margin: '0.25rem 0.5rem',
                borderRadius: '10px',
                color: isActive ? textActiveColor : textColor,
                background: isActive ? activeBg : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                opacity: 0,
                animationFillMode: 'forwards',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = hoverBg;
                  e.currentTarget.style.color = textHoverColor;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = textColor;
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon 
                className={`${collapsed ? '' : 'shrink-0'}`}
                style={{
                  width: '20px',
                  height: '20px',
                  transition: 'transform 0.2s',
                }}
              />
              {!collapsed && (
                <>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: isActive ? '600' : '500',
                    flex: 1,
                  }}>
                    {item.label}
                  </span>
                  {badgeStyle && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      background: badgeStyle.bg,
                      color: badgeStyle.color,
                      border: `1px solid ${badgeStyle.border}`,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Active indicator dot for collapsed state */}
              {collapsed && isActive && (
                <span 
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                  }}
                />
              )}
              
              {/* Badge indicator for collapsed state */}
              {collapsed && item.badge && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getBadgeStyle(item.badge).color,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with Version Info */}
      <div 
        style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: collapsed ? '1rem 0.5rem' : '1rem',
          borderTop: `1px solid ${borderColor}`,
          background: theme === 'dark' 
            ? 'linear-gradient(0deg, rgba(15, 23, 42, 1) 0%, transparent 100%)'
            : 'linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, transparent 100%)',
        }}
      >
        {!collapsed ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '10px',
            background: theme === 'dark' 
              ? 'rgba(168, 85, 247, 0.1)' 
              : 'rgba(168, 85, 247, 0.05)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
          }}>
            <Sparkles className="w-4 h-4 text-purple-500" />
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600',
                color: theme === 'dark' ? 'white' : '#1e293b',
              }}>
                Elite ML v3.0
              </p>
              <p style={{ 
                fontSize: '0.65rem', 
                color: textColor,
              }}>
                100 Improvements Active
              </p>
            </div>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
