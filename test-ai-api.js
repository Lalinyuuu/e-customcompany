// Quick test script for AI Address API
// Run with: node test-ai-api.js

const testCompanyName = process.argv[2] || 'บริษัท ปตท. จำกัด (มหาชน)';

async function testAIAPI() {
  try {
    console.log(`\n🧪 Testing AI Address API with: "${testCompanyName}"\n`);
    
    const response = await fetch('http://localhost:3000/api/ai-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyName: testCompanyName }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
      
      // Check if it's real AI data or mock data
      if (data.subDistrict && data.district && data.province && data.zipCode) {
        console.log('\n📊 Address Data:');
        console.log(`   Sub-district: ${data.subDistrict}`);
        console.log(`   District: ${data.district}`);
        console.log(`   Province: ${data.province}`);
        console.log(`   Zip Code: ${data.zipCode}`);
        console.log(`   Address: ${data.address || '(empty)'}`);
      }
    } else {
      console.error('❌ API Error:', data);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Dev server is running (npm run dev)');
    console.log('   2. Server is on http://localhost:3000');
  }
}

testAIAPI();

