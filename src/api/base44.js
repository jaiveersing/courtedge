import { generateMockEntities } from './mockData';

const USE_PROXY = import.meta.env.VITE_BASE44_USE_PROXY === 'true';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const BASE_URL = `${import.meta.env.VITE_BASE44_BASE_URL}/${import.meta.env.VITE_BASE44_APP_ID}`;

async function fetchJSON(url, opts = {}){
  const res = await fetch(url, opts);
  if(!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  try { return await res.json(); } catch(e) { return await res.text(); }
}

function buildUrl(entityName){
  if(USE_PROXY){
    // proxy endpoint will be under /api/base44/entities/:entity
    return `/api/base44/entities/${entityName}`;
  }
  return `${BASE_URL}/entities/${entityName}`;
}

export async function fetchEntities(entityName, filters = {}){
  // Use mock data if enabled
  if(USE_MOCK){
    console.log(`📊 Using mock data for ${entityName}`);
    const count = filters.limit || 100;
    return await generateMockEntities(entityName, count);
  }

  const base = buildUrl(entityName);
  if(USE_PROXY){
    const url = new URL(base, window.location.origin);
    Object.entries(filters).forEach(([k,v]) => {
      if(v !== undefined && v !== null) url.searchParams.append(k, v);
    });
    return fetchJSON(url.toString(), { headers: { 'Content-Type': 'application/json' } });
  }

  const url = new URL(base);
  Object.entries(filters).forEach(([k,v]) => {
    if(v !== undefined && v !== null) url.searchParams.append(k, v);
  });
  return fetchJSON(url.toString(), {
    headers: {
      'api_key': import.meta.env.VITE_BASE44_API_KEY,
      'Content-Type': 'application/json'
    }
  });
}

export async function updateEntity(entityName, entityId, updateData){
  // Mock updates just log and return success
  if(USE_MOCK){
    console.log(`📝 Mock update: ${entityName}/${entityId}`, updateData);
    return { success: true, id: entityId, ...updateData };
  }

  if(USE_PROXY){
    const url = `/api/base44/entities/${entityName}/${entityId}`;
    return fetchJSON(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
  }
  const url = `${BASE_URL}/entities/${entityName}/${entityId}`;
  return fetchJSON(url, {
    method: 'PATCH',
    headers: {
      'api_key': import.meta.env.VITE_BASE44_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
}

export default { fetchEntities, updateEntity };
