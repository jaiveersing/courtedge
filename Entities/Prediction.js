import base44 from '@/src/api/base44';

export const Prediction = {
  async list(sort = '-game_date', limit = 100){
    try{
      const res = await base44.fetchEntities('Prediction', { limit });
      const data = res.rows || res.data || res || [];
      
      // Sort by date (most recent first by default)
      if (sort && data.length > 0) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        
        data.sort((a, b) => {
          if (field === 'game_date') {
            return isDesc 
              ? new Date(b[field]) - new Date(a[field])
              : new Date(a[field]) - new Date(b[field]);
          }
          const aVal = a[field] || 0;
          const bVal = b[field] || 0;
          return isDesc ? bVal - aVal : aVal - bVal;
        });
      }
      
      return data;
    }catch(err){
      console.error('Prediction.list error', err);
      return [];
    }
  },
  
  async filter(filters = {}, sort = '', limit = 100){
    try{
      const res = await base44.fetchEntities('Prediction', { ...filters, limit });
      let data = res.rows || res.data || res || [];
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'limit' && typeof value === 'object') {
          if (value.$gte !== undefined) {
            data = data.filter(item => (item[key] || 0) >= value.$gte);
          }
          if (value.$in !== undefined) {
            data = data.filter(item => value.$in.includes(item[key]));
          }
        }
      });
      
      // Sort
      if (sort && data.length > 0) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        
        data.sort((a, b) => {
          if (field === 'game_date') {
            return isDesc 
              ? new Date(b[field]) - new Date(a[field])
              : new Date(a[field]) - new Date(b[field]);
          }
          const aVal = a[field] || 0;
          const bVal = b[field] || 0;
          return isDesc ? bVal - aVal : aVal - bVal;
        });
      }
      
      return data.slice(0, limit);
    }catch(err){
      console.error('Prediction.filter error', err);
      return [];
    }
  }
}

export default Prediction;
