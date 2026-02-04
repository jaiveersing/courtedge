// Test ESPN athletes endpoint for stats
import fetch from 'node-fetch';

async function testESPNStats() {
  try {
    console.log('Testing ESPN athletes endpoint...\n');
    
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes?limit=5');
    const data = await response.json();
    
    if (data.athletes && data.athletes.length > 0) {
      const player = data.athletes[0];
      console.log('✅ First player:', player.displayName);
      console.log('   Position:', player.position?.displayName);
      console.log('   Team:', player.team?.displayName);
      console.log('   Stats available:', !!player.statistics);
      
      if (player.statistics && player.statistics.length > 0) {
        console.log('\n📊 Statistics structure:');
        console.log(JSON.stringify(player.statistics[0], null, 2));
      } else {
        console.log('\n⚠️ No statistics in bulk athletes endpoint');
        console.log('\n🔍 Trying individual player endpoint...');
        
        const playerResp = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes/${player.id}`);
        const playerData = await playerResp.json();
        
        if (playerData.statistics) {
          console.log('✅ Individual player endpoint has stats!');
          const stats = playerData.statistics[0];
          console.log('   Type:', stats.type);
          console.log('   Categories:', stats.splits?.categories?.map(c => c.name).join(', '));
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testESPNStats();
