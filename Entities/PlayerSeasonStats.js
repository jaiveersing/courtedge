import base44 from '@/src/api/base44';

export const PlayerSeasonStats = {
  async list(sort = '-points_per_game', limit = 100){
    try{
      const res = await base44.fetchEntities('PlayerSeasonStats', { limit });
      const data = res.rows || res.data || res || [];
      
      // Sort data based on sort parameter
      if (sort && data.length > 0) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        
        data.sort((a, b) => {
          const aVal = a[field] || 0;
          const bVal = b[field] || 0;
          return isDesc ? bVal - aVal : aVal - bVal;
        });
      }
      
      return data;
    }catch(err){
      console.error('PlayerSeasonStats.list error', err);
      return [];
    }
  },
  
  async filter(filters = {}, sort = '', limit = 100){
    try{
      const res = await base44.fetchEntities('PlayerSeasonStats', { ...filters, limit });
      const data = res.rows || res.data || res || [];
      
      // Apply filters
      let filtered = data;
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'limit') {
          filtered = filtered.filter(item => {
            if (typeof value === 'object' && value.$gte !== undefined) {
              return item[key] >= value.$gte;
            }
            return item[key] === value;
          });
        }
      });
      
      // Sort
      if (sort && filtered.length > 0) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        
        filtered.sort((a, b) => {
          const aVal = a[field] || 0;
          const bVal = b[field] || 0;
          return isDesc ? bVal - aVal : aVal - bVal;
        });
      }
      
      return filtered.slice(0, limit);
    }catch(err){
      console.error('PlayerSeasonStats.filter error', err);
      return [];
    }
  },
  
  async getById(id){
    try{
      const res = await base44.fetchEntities('PlayerSeasonStats', {});
      const data = res.rows || res.data || res || [];
      return data.find(p => p.id === id) || null;
    }catch(err){
      console.error('PlayerSeasonStats.getById error', err);
      return null;
    }
  }
}

export default PlayerSeasonStats;
