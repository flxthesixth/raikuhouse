// Twitter API Helper using Express Backend (which calls RapidAPI)

/**
 * Fetch Twitter profile data from our Express backend
 * @param {string} username - Twitter username (without @)
 * @returns {Promise<Object>} Profile data
 */
export async function getTwitterProfile(username) {
  try {
    const cleanUsername = username.replace('@', '').trim()
    const url = `http://localhost:3001/api/twitter/profile?username=${cleanUsername}`
    
    console.log(`📡 Fetching from backend: ${url}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`📊 Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Error response:', errorData)
      
      // Specific error messages
      if (response.status === 403) {
        throw new Error('API Key tidak valid. Pastikan API key sudah benar dan sudah subscribe di RapidAPI')
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later')
      }
      if (response.status === 404) {
        throw new Error(`User @${cleanUsername} not found`)
      }
      if (response.status === 500 && errorData.error?.includes('not configured')) {
        throw new Error('Backend server: API key not configured in .env')
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const profile = await response.json()
    console.log('✅ Profile received:', profile)
    
    return profile
    
  } catch (error) {
    console.error('❌ Error fetching Twitter profile:', error.message)
    throw error
  }
}

/**
 * Convert image URL to base64 for CORS-free usage
 * @param {string} imageUrl - Image URL
 * @returns {Promise<string>} Base64 data URL
 */
export async function imageUrlToBase64(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const base64 = canvas.toDataURL('image/png')
        resolve(base64)
      } catch (error) {
        reject(new Error('Failed to convert image to base64'))
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error('Image load timeout'))
    }, 10000)
    
    img.src = imageUrl
  })
}

/**
 * Fetch Twitter profile with avatar as base64
 * @param {string} username - Twitter username (without @)
 * @returns {Promise<Object>} Profile data with base64 avatar
 */
export async function getTwitterProfileWithBase64Avatar(username) {
  const profile = await getTwitterProfile(username)
  
  if (profile.avatar) {
    try {
      console.log('Converting avatar to base64...')
      const base64Avatar = await imageUrlToBase64(profile.avatar)
      profile.avatarBase64 = base64Avatar
    } catch (error) {
      console.warn('Failed to convert avatar to base64:', error)
      // Keep original URL if conversion fails
    }
  }
  
  return profile
}

/**
 * Fallback providers (free, no API key needed)
 */
export const fallbackProviders = [
  (username) => `https://unavatar.io/twitter/${username}`,
  (username) => `https://avatars.io/twitter/${username}`,
  (username) => `https://ui-avatars.com/api/?name=${username}&size=200&background=FFD700&color=000&bold=true`,
]

/**
 * Try loading image from fallback providers
 * @param {string} username - Twitter username
 * @returns {Promise<string>} Base64 image data
 */
export async function tryFallbackProviders(username) {
  console.log(`🔄 Trying fallback providers for @${username}...`)
  
  for (let i = 0; i < fallbackProviders.length; i++) {
    const provider = fallbackProviders[i]
    try {
      const url = provider(username)
      console.log(`📡 Provider ${i + 1}/${fallbackProviders.length}: ${url}`)
      const base64 = await imageUrlToBase64(url)
      console.log(`✅ Provider ${i + 1} succeeded!`)
      return base64
    } catch (error) {
      console.warn(`❌ Provider ${i + 1} failed:`, error.message)
      continue
    }
  }
  
  console.error('❌ All fallback providers failed')
  throw new Error('All fallback providers failed')
}
