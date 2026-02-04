// Test API-Sports.io Basketball API
import fetch from 'node-fetch';

const API_KEY = 'fc95e7c649750d9ee3308ecc31897ae2';
const BASE_URL = 'https://v1.basketball.api-sports.io';

async function testAPI() {
  try {
    console.log('🔍 Testing API-Sports.io Basketball API\n');
    
    // Test 1: Get NBA leagues
    console.log('1️⃣ Testing leagues endpoint...');
    const leaguesResp = await fetch(`${BASE_URL}/leagues`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v1.basketball.api-sports.io'
      }
    });
    const leagues = await leaguesResp.json();
    console.log('Leagues response:', JSON.stringify(leagues, null, 2).substring(0, 500));
    
    // Find NBA league
    const nbaLeague = leagues.response?.find(l => l.name?.includes('NBA'));
    if (nbaLeague) {
      console.log('\n✅ Found NBA:', nbaLeague.name, 'ID:', nbaLeague.id);
      
      // Test 2: Get teams
      console.log('\n2️⃣ Testing teams endpoint...');
      const teamsResp = await fetch(`${BASE_URL}/teams?league=${nbaLeague.id}&season=2024-2025`, {
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': 'v1.basketball.api-sports.io'
        }
      });
      const teams = await teamsResp.json();
      console.log('Teams found:', teams.response?.length);
      if (teams.response?.[0]) {
        console.log('First team:', teams.response[0].name, 'ID:', teams.response[0].id);
        
        // Test 3: Get games/statistics
        console.log('\n3️⃣ Testing games endpoint for player stats...');
        const gamesResp = await fetch(`${BASE_URL}/games?league=${nbaLeague.id}&season=2024-2025&team=${teams.response[0].id}`, {
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'v1.basketball.api-sports.io'
          }
        });
        const games = await gamesResp.json();
        console.log('Games response:', JSON.stringify(games, null, 2).substring(0, 800));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
