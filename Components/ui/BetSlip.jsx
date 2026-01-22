import { useState } from 'react';
import { X, Plus, Minus, DollarSign, TrendingUp, Target, Trash2, Calculator } from 'lucide-react';
import { Button } from './button';
import { AppCard } from './AppCard';

export default function BetSlip({ isOpen, onClose }) {
  const [bets, setBets] = useState([]);
  const [betAmount, setBetAmount] = useState('');
  const [betType, setBetType] = useState('straight'); // straight, parlay, round_robin

  const addBet = (bet) => {
    setBets(prev => [...prev, {
      id: Date.now().toString(),
      ...bet
    }]);
  };

  const removeBet = (id) => {
    setBets(prev => prev.filter(b => b.id !== id));
  };

  const calculatePayout = () => {
    if (bets.length === 0 || !betAmount) return 0;
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount)) return 0;

    if (betType === 'straight') {
      // For straight bets, sum individual payouts
      return bets.reduce((total, bet) => {
        const odds = bet.odds > 0 ? bet.odds / 100 : -100 / bet.odds;
        return total + (amount * odds);
      }, 0);
    } else if (betType === 'parlay') {
      // For parlay, multiply all odds together
      const totalOdds = bets.reduce((total, bet) => {
        const decimal = bet.odds > 0 ? (bet.odds / 100) + 1 : (100 / Math.abs(bet.odds)) + 1;
        return total * decimal;
      }, 1);
      return amount * totalOdds - amount;
    }
    
    return 0;
  };

  const potentialWin = calculatePayout();
  const totalRisk = betType === 'straight' ? parseFloat(betAmount || 0) * bets.length : parseFloat(betAmount || 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Bet Slip Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Bet Slip
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          {/* Bet Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setBetType('straight')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                betType === 'straight' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Straight
            </button>
            <button
              onClick={() => setBetType('parlay')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                betType === 'parlay' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Parlay
            </button>
          </div>
        </div>

        {/* Bets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bets.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">No bets added yet</p>
              <p className="text-sm text-slate-500">Click on odds to add bets</p>
            </div>
          ) : (
            bets.map(bet => (
              <div key={bet.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white mb-1">
                      {bet.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {bet.subtitle}
                    </div>
                  </div>
                  <button
                    onClick={() => removeBet(bet.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className="text-xs text-slate-500">{bet.type}</span>
                  <span className={`text-sm font-bold ${bet.odds > 0 ? 'text-green-400' : 'text-blue-400'}`}>
                    {bet.odds > 0 ? '+' : ''}{bet.odds}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bet Amount and Summary */}
        {bets.length > 0 && (
          <div className="p-4 border-t border-slate-700 space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                {betType === 'straight' ? 'Bet Amount (per bet)' : 'Total Bet Amount'}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount.toString())}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-2 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Risk</span>
                <span className="text-white font-semibold">${totalRisk.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Potential Win</span>
                <span className="text-green-400 font-bold">${potentialWin.toFixed(2)}</span>
              </div>
              {betType === 'parlay' && (
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700">
                  <span className="text-slate-400">Total Payout</span>
                  <span className="text-white font-bold">${(totalRisk + potentialWin).toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Place Bet Button */}
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all"
              disabled={!betAmount || bets.length === 0}
            >
              Place {betType === 'parlay' ? 'Parlay' : 'Bets'} (${totalRisk.toFixed(2)})
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

// Hook to use bet slip from anywhere
export function useBetSlip() {
  const [isOpen, setIsOpen] = useState(false);
  
  return {
    isOpen,
    openBetSlip: () => setIsOpen(true),
    closeBetSlip: () => setIsOpen(false),
    BetSlipComponent: (props) => <BetSlip isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />
  };
}
