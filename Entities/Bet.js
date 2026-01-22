import base44 from '@/src/api/base44';

// Mock bet data generator
const generateMockBets = (count = 20) => {
  const bets = [];
  const teams = ['LAL', 'BOS', 'GSW', 'MIA', 'DEN', 'PHX', 'DAL', 'MIL', 'PHI', 'NYK'];
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString());
  }

  for (let i = 0; i < count; i++) {
    const stake = Math.round(Math.random() * 200 + 25);
    const odds = parseFloat((Math.random() * 2 + 1.5).toFixed(2));
    const isWin = Math.random() > 0.44;
    const payout = isWin ? Math.round(stake * odds) : 0;
    
    bets.push({
      id: `bet_${i + 1}`,
      game_date: dates[Math.floor(Math.random() * dates.length)],
      type: ['Moneyline', 'Spread', 'Over/Under', 'Props'][Math.floor(Math.random() * 4)],
      description: `${teams[Math.floor(Math.random() * teams.length)]} vs ${teams[Math.floor(Math.random() * teams.length)]}`,
      odds: odds,
      stake: stake,
      payout: payout,
      actual_payout: payout,
      status: isWin ? 'won' : 'lost',
      profit: isWin ? payout - stake : -stake,
      sport: 'NBA',
      sportsbook: ['DraftKings', 'FanDuel', 'BetMGM'][Math.floor(Math.random() * 3)]
    });
  }
  return bets;
};

export const Bet = {
  async list(sort = '', limit = 100){
    try{
      const res = await base44.fetchEntities('Bet', { limit });
      const data = res.rows || res.data || res || [];
      
      // If no data, return mock bets
      if (data.length === 0) {
        return generateMockBets(limit);
      }
      
      return data;
    }catch(err){
      console.error('Bet.list error', err);
      return generateMockBets(20);
    }
  },

  async filter(filters = {}, sort = '', limit = 100){
    try{
      const res = await base44.fetchEntities('Bet', { ...filters, limit });
      const data = res.rows || res.data || res || [];
      
      // If no data, return mock bets
      if (data.length === 0) {
        return generateMockBets(limit);
      }
      
      return data;
    }catch(err){
      console.error('Bet.filter error', err);
      return generateMockBets(20);
    }
  },

  async getById(id){
    try{
      const res = await base44.fetchEntities('Bet', {});
      const data = res.rows || res.data || res || [];
      return data.find(b => b.id === id) || null;
    }catch(err){
      console.error('Bet.getById error', err);
      return null;
    }
  },

  async create(betData){
    try{
      const res = await base44.updateEntity('Bet', 'new', betData);
      return res;
    }catch(err){
      console.error('Bet.create error', err);
      return null;
    }
  },

  async update(id, updateData){
    try{
      const res = await base44.updateEntity('Bet', id, updateData);
      return res;
    }catch(err){
      console.error('Bet.update error', err);
      return null;
    }
  }
}

export default Bet;
