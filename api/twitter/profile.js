export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 403) {
        return res.status(403).json({
          error: 'API Key tidak valid atau belum berlangganan.',
        });
      }

      if (response.status === 404) {
        return res.status(404).json({
          error: `Username @${cleanUsername} not found`,
        });
      }

      if (response.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please try again later.',
        });
      }

      return res.status(response.status).json({
        error: 'Failed to fetch profile',
        details: errorData,
      });
    }

    const data = await response.json();

    const userResult = data.result?.data?.user?.result;

    if (!userResult) {
      return res.status(500).json({ error: 'Invalid response structure from Twitter API' });
    }

    const core = userResult.core || {};
    const legacy = userResult.legacy || {};
    const avatar = userResult.avatar;
    const location = userResult.location;

    const displayName = core.name || cleanUsername;
    const screenName = core.screen_name || cleanUsername;

    let avatarUrl = '';
    if (avatar?.image_url) {
      avatarUrl = avatar.image_url.replace('_normal', '_400x400');
    } else if (legacy.profile_image_url_https) {
      avatarUrl = legacy.profile_image_url_https.replace('_normal', '_400x400');
    }

    const profileData = {
      name: displayName,
      username: screenName,
      bio: legacy.description || '',
      avatar: avatarUrl,
      banner: legacy.profile_banner_url || '',
      followers: legacy.followers_count || 0,
      following: legacy.friends_count || 0,
      location: location?.location || legacy.location || '',
      website: legacy.url || '',
      verified: legacy.verified || false,
    };

    return res.json(profileData);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
