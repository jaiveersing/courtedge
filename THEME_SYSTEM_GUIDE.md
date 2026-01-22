# 🎨 CourtEdge Theme System Guide v3.0

## Overview

CourtEdge now features a comprehensive **dual-theme system** that provides seamless light/dark mode support across all components. This guide documents the theme architecture and usage patterns.

---

## 📁 Theme Architecture

### Core Theme Context
**Location:** `src/contexts/ThemeContext.jsx`

```jsx
import { useTheme } from '@/src/contexts/ThemeContext';

// Inside your component
const { theme } = useTheme();  // Returns 'light' or 'dark'
```

### Design System Hook Pattern
For complex components, use a design system object:

```jsx
const ds = {
  bg: theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50',
  bgCard: theme === 'dark' ? 'bg-white/[0.02]' : 'bg-white/90',
  bgCardAlt: theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-100/80',
  border: theme === 'dark' ? 'border-white/[0.05]' : 'border-slate-200',
  borderAccent: theme === 'dark' ? 'border-white/10' : 'border-slate-300',
  text: theme === 'dark' ? 'text-white' : 'text-slate-900',
  textSecondary: theme === 'dark' ? 'text-slate-300' : 'text-slate-600',
  textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
  hover: theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-100',
  input: theme === 'dark' ? 'bg-slate-800/50' : 'bg-white',
  inputBorder: theme === 'dark' ? 'border-white/10' : 'border-slate-300',
  chartGrid: theme === 'dark' ? '#334155' : '#e2e8f0',
  chartText: theme === 'dark' ? '#94a3b8' : '#64748b',
  theme
};
```

---

## 🎯 Component Theme Patterns

### Page Components
All major pages now support themes:
- ✅ `Dashboard.jsx`
- ✅ `Workstation.jsx`
- ✅ `PlayerProfile.jsx`
- ✅ `Settings.jsx`
- ✅ `Analytics.jsx`
- ✅ `Bets.jsx`
- ✅ `BankrollManagement.jsx`

### Player Components
Pass theme as prop:
```jsx
<PlayerHeader player={player} theme={theme} />
<PerformanceChart data={data} theme={theme} />
<KeyStats stats={stats} theme={theme} />
<BettingInsights player={player} theme={theme} />
<HomeAwayComparison homeStats={home} awayStats={away} theme={theme} />
```

### Layout Components
- ✅ `Navigation.jsx` - Full theme support
- ✅ `TopBar.jsx` - Full theme support

### Chart Components
All Recharts components are theme-aware:
```jsx
<CartesianGrid stroke={ds.chartGrid} />
<XAxis stroke={ds.chartText} />
<YAxis stroke={ds.chartText} />
<Tooltip
  contentStyle={{
    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
    color: theme === 'dark' ? '#fff' : '#1e293b'
  }}
/>
```

---

## 🎨 Color Reference

### Background Colors
| Type | Dark Mode | Light Mode |
|------|-----------|------------|
| Primary BG | `bg-slate-950` | `bg-slate-50` |
| Card BG | `bg-white/[0.02]` | `bg-white` |
| Card Alt | `bg-slate-800/80` | `bg-slate-100` |
| Input BG | `bg-slate-800/50` | `bg-white` |

### Text Colors
| Type | Dark Mode | Light Mode |
|------|-----------|------------|
| Primary | `text-white` | `text-slate-900` |
| Secondary | `text-slate-300` | `text-slate-600` |
| Muted | `text-slate-400` | `text-slate-500` |

### Border Colors
| Type | Dark Mode | Light Mode |
|------|-----------|------------|
| Primary | `border-white/[0.05]` | `border-slate-200` |
| Accent | `border-white/10` | `border-slate-300` |
| Input | `border-white/10` | `border-slate-300` |

---

## 🎬 Animations (styles.css)

### Available Animations
```css
animation-float      /* Gentle floating effect */
animation-pulse-glow /* Pulsing glow effect */
animation-slide-in-up /* Slide in from bottom */
animation-slide-in-right /* Slide in from right */
animation-scale-in   /* Scale in effect */
animation-shimmer    /* Loading shimmer */
animation-bounce-in  /* Bouncy entrance */
animation-gradient-shift /* Background gradient animation */
```

### Stagger Delays
```css
animation-delay-100 through animation-delay-1000
```

---

## 🔧 CSS Utility Classes

### Cards
```css
.card-elevated  /* Standard elevated card */
.card-glass     /* Glassmorphism effect */
.card-glass-light /* Light mode glass */
.card-glass-dark  /* Dark mode glass */
.card-gradient  /* Gradient background */
.card-hover     /* Interactive hover states */
```

### Buttons
```css
.btn-primary    /* Primary action button */
.btn-secondary  /* Secondary action button */
.btn-ghost      /* Ghost/transparent button */
.btn-glow       /* Glowing effect button */
.btn-gradient   /* Gradient background */
.btn-neon       /* Neon effect button */
```

### Badges
```css
.badge-success  /* Green success badge */
.badge-error    /* Red error badge */
.badge-warning  /* Yellow warning badge */
.badge-info     /* Blue info badge */
.badge-purple   /* Purple badge */
.badge-pulse    /* Pulsing live badge */
```

### Text Effects
```css
.text-gradient  /* Rainbow gradient text */
.text-gradient-gold /* Gold gradient text */
.text-gradient-fire /* Fire gradient text */
.text-gradient-ice  /* Ice gradient text */
.text-gradient-nature /* Nature gradient text */
```

---

## 📱 Responsive Considerations

The theme system is fully responsive:
- Mobile breakpoints maintain theme consistency
- Touch interactions work in both themes
- Safe area insets properly handled

---

## 🚀 Performance Tips

1. **Use Design System Objects**: Create once at component level
2. **Avoid Inline Theme Checks**: Use pre-computed `ds` object
3. **Memoize Theme Values**: For complex components
4. **Batch Theme Updates**: ThemeContext handles this automatically

---

## 📝 Adding Theme Support to New Components

1. Import the theme hook:
```jsx
import { useTheme } from '@/src/contexts/ThemeContext';
```

2. Get theme value:
```jsx
const { theme } = useTheme();
```

3. Create design system object (optional for complex components):
```jsx
const ds = {
  // ... theme-aware values
};
```

4. Apply conditional classes:
```jsx
<div className={theme === 'dark' ? 'bg-slate-900' : 'bg-white'}>
```

---

## 🔄 Theme Toggle

The theme toggle is available in:
- `TopBar.jsx` - Main toggle location
- `Settings.jsx` - Theme settings section

Toggle component: `Components/settings/ThemeToggle.jsx`

---

*Last Updated: Session 2 - Theme System Enhancement*
