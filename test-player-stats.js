// Check what player data API-Sports.io provides
import fetch from 'node-fetch';

const API_KEY = 'fc95e7c649750d9ee3308ecc31897ae2';
const BASE_URL = 'https://v1.basketball.api-sports.io';

async function checkPlayerData() {
  try {
    // Check if we can get player statistics endpoint
    console.log('Testing players/statistics endpoint...\n');
    const resp = await fetch(`${BASE_URL}/statistics/players?game=425083`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v1.basketball.api-sports.io'
      }
    });
    const data = await resp.json();
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 1500));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPlayerData();
