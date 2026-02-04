// Quick test script to check API response
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('Testing http://localhost:3000/api/players?limit=3');
    const response = await fetch('http://localhost:3000/api/players?limit=3');
    const data = await response.json();
    
    console.log('\n✅ Response received:');
    console.log(`  Success: ${data.success}`);
    console.log(`  Players count: ${data.data?.length || 0}`);
    console.log(`  Total available: ${data.pagination?.total || 0}`);
    
    if (data.data && data.data.length > 0) {
      console.log(`\n📊 First player:`);
      console.log(`  Name: ${data.data[0].name}`);
      console.log(`  Team: ${data.data[0].team}`);
      console.log(`  PPG: ${data.data[0].ppg}`);
    }
    
    console.log('\n✅ API is working correctly!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
