export function createPageUrl(name){
  const map = {
    Dashboard: '/dashboard',
    Bets: '/bets',
    Predictions: '/predictions',
    Analytics: '/analytics',
    BankrollManagement: '/bankroll',
    LineShop: '/lineshop',
    Community: '/community',
    Settings: '/settings',
    Portfolio: '/portfolio'
  };
  return map[name] || '/';
}

export default { createPageUrl };
