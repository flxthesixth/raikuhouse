import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKeyConfigured: !!process.env.RAPIDAPI_KEY });
});

// Twitter profile endpoint
app.get('/api/twitter/profile', async (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const cleanUsername = username.replace('@', '').trim();

  try {
    console.log('🔑 Using API key:', apiKey.substring(0, 10) + '...');
    console.log('📡 Fetching Twitter profile for:', cleanUsername);

    const response = await fetch(
      `https://twitter241.p.rapidapi.com/user?username=${cleanUsername}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'twitter241.p.rapidapi.com',
        },
      }
    );

    console.log('📊 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Twitter API error response:', errorData);

      if (response.status === 403) {
        return res.status(403).json({ 
          error: 'API Key tidak valid atau belum berlangganan. Pastikan Anda memasukkan API KEY yang benar (bukan Host) dan sudah klik "Subscribe" di dashboard RapidAPI.' 
        });
      }
      
      if (response.status === 404) {
        return res.status(404).json({ 
          error: `Username @${cleanUsername} not found` 
        });
      }

      if (response.status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        });
      }

      return res.status(response.status).json({ 
        error: 'Failed to fetch profile',
        details: errorData 
      });
    }

    const data = await response.json();
    console.log('✅ Profile data received');
    
    // twitter241 structure - handle different response formats
    const userResult = data.result?.data?.user?.result;
    
    if (!userResult) {
      console.error('❌ Could not find user data in response');
      return res.status(500).json({ error: 'Invalid response structure from Twitter API' });
    }
    
    // Get data from the response
    const core = userResult.core || {}; // Has name and screen_name
    const legacy = userResult.legacy || {}; // Has bio, stats, etc
    const avatar = userResult.avatar;
    const location = userResult.location;
    
    // Name and username are in core object
    const displayName = core.name || cleanUsername;
    const screenName = core.screen_name || cleanUsername;
    
    console.log('🔍 Display Name:', displayName);
    console.log('🔍 Screen Name:', screenName);
    
    // Get avatar URL
    let avatarUrl = '';
    if (avatar?.image_url) {
      avatarUrl = avatar.image_url.replace('_normal', '_400x400');
    } else if (legacy.profile_image_url_https) {
      avatarUrl = legacy.profile_image_url_https.replace('_normal', '_400x400');
    }
    
    // Combine data
    const profileData = {
      name: displayName,  // Display name from core (e.g., "GitHub", "Elon Musk")
      username: screenName,  // @username from core (e.g., "github", "elonmusk")
      bio: legacy.description || '',
      avatar: avatarUrl,
      banner: legacy.profile_banner_url || '',
      followers: legacy.followers_count || 0,
      following: legacy.friends_count || 0,
      location: location?.location || legacy.location || '',
      website: legacy.url || '',
      verified: legacy.verified || false,
    };

    console.log('✅ Returning profile:', profileData);
    return res.json(profileData);

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Twitter likes endpoint (bonus)
app.get('/api/twitter/likes', async (req, res) => {
  const { pid, count = 40 } = req.query;
  
  if (!pid) {
    return res.status(400).json({ error: 'Post ID (pid) is required' });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(
      `https://twitter241.p.rapidapi.com/likes?pid=${pid}&count=${count}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'twitter241.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: 'Failed to fetch likes',
        details: errorData 
      });
    }

    const data = await response.json();
    return res.json(data);

  } catch (error) {
    console.error('Twitter API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`🔑 API Key configured: ${!!process.env.RAPIDAPI_KEY}`);
});
