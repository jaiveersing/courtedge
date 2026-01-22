import base44 from '@/src/api/base44';

export const PlayerGameLog = {
  async filter(filters = {}, sort = '', limit = 100){
    try{
      const res = await base44.fetchEntities('PlayerGameLog', filters);
      return res.rows || res || [];
    }catch(err){
      console.error('PlayerGameLog.filter error', err);
      return [];
    }
  }
}

export default PlayerGameLog;
