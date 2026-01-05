// Quick test script to check Twitter API response structure
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const testUsername = 'github'; // or 'elonmusk' or 'flxthesixth'

async function testAPI() {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  console.log('🧪 Testing Twitter241 API');
  console.log('Username:', testUsername);
  console.log('API Key:', apiKey ? apiKey.substring(0, 15) + '...' : 'NOT FOUND');
  console.log('');
  
  try {
    const response = await fetch(
      `https://twitter241.p.rapidapi.com/user?username=${testUsername}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'twitter241.p.rapidapi.com',
        },
      }
    );
    
    console.log('Status:', response.status, response.statusText);
    
    const data = await response.json();
    
    // Navigate to user result
    const userResult = data.result?.data?.user?.result;
    
    if (!userResult) {
      console.log('❌ No userResult found');
      console.log('Full response:', JSON.stringify(data, null, 2));
      return;
    }
    
    console.log('\n📊 UserResult structure:');
    console.log('Keys:', Object.keys(userResult));
    
    console.log('\n🔍 Checking core.user_results.result:');
    const coreUserResult = userResult.core?.user_results?.result;
    if (coreUserResult) {
      console.log('Keys:', Object.keys(coreUserResult));
      console.log('ID:', coreUserResult.id);
      console.log('__typename:', coreUserResult.__typename);
      
      const coreLegacy = coreUserResult.legacy;
      if (coreLegacy) {
        console.log('\n✅ coreLegacy found!');
        console.log('name:', coreLegacy.name);
        console.log('screen_name:', coreLegacy.screen_name);
        console.log('description:', coreLegacy.description?.substring(0, 50) + '...');
        console.log('profile_image_url_https:', coreLegacy.profile_image_url_https);
        console.log('followers_count:', coreLegacy.followers_count);
      } else {
        console.log('❌ No coreLegacy');
      }
    } else {
      console.log('❌ No core.user_results.result');
    }
    
    console.log('\n🔍 Checking direct legacy:');
    const legacy = userResult.legacy;
    if (legacy) {
      console.log('Keys:', Object.keys(legacy));
      console.log('Has name?', 'name' in legacy);
      console.log('Has screen_name?', 'screen_name' in legacy);
      console.log('description:', legacy.description?.substring(0, 50));
    }
    
    console.log('\n🔍 Checking userResult.core:');
    const core = userResult.core;
    if (core) {
      console.log('Keys:', Object.keys(core));
      console.log('Full core:', JSON.stringify(core, null, 2));
    }
    
    console.log('\n🔍 Checking avatar object:');
    const avatar = userResult.avatar;
    if (avatar) {
      console.log('avatar:', avatar);
    }
    
    console.log('\n🔍 Checking location object:');
    const location = userResult.location;
    if (location) {
      console.log('location:', location);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
