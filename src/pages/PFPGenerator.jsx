import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import html2canvas from 'html2canvas'
import Navbar from '../components/Navbar'
import { getTwitterProfile, imageUrlToBase64, tryFallbackProviders } from '../utils/twitterApi'
import './PFPGenerator.css'

const roles = [
  'World Citizen',
  'Raiku Chad',
]

export default function PFPGenerator({ onNavigate, currentPage }) {
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [bio, setBio] = useState('')
  const [twitter, setTwitter] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [cardData, setCardData] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [cardBackgroundBase64, setCardBackgroundBase64] = useState(null)
  const frontCardRef = useRef(null)

  // Pre-load card background as base64 for reliable capture
  useEffect(() => {
    const loadCardBackground = async () => {
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = '/RaikuCard.png'
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const base64 = canvas.toDataURL('image/png')
          setCardBackgroundBase64(base64)
          console.log('✅ Card background loaded as base64')
        }
      } catch (error) {
        console.error('Failed to load card background:', error)
      }
    }
    loadCardBackground()
  }, [])

  const handleFetchTwitter = async () => {
    if (!twitter || !twitter.trim()) {
      alert('Please enter a Twitter ID first')
      return
    }
    
    setIsFetching(true)
    
    try {
      // Hapus @ jika ada
      const username = twitter.replace('@', '').trim()
      
      // Call backend API
      try {
        console.log('📡 Fetching from backend API...')
        const profile = await getTwitterProfile(username)
        
        console.log('✅ Profile received:', profile)
        
        // Set profile image if available
        if (profile.avatar) {
          // Convert avatar URL to base64 for CORS-free usage
          try {
            const base64Avatar = await imageUrlToBase64(profile.avatar)
            setProfileImage(base64Avatar)
          } catch (imgError) {
            console.warn('Failed to convert avatar to base64, using URL directly:', imgError)
            // Fallback: set URL directly (might have CORS issues)
            setProfileImage(profile.avatar)
          }
        }
        
        // Always update name and bio from fetched profile
        if (profile.name) {
          setName(profile.name)
        }
        if (profile.bio) {
          setBio(profile.bio)
        }
        
        alert(`✅ Successfully fetched profile for @${username}!\n\n` +
              `Name: ${profile.name}\n` +
              `Username: @${profile.username}\n` +
              `Followers: ${profile.followers.toLocaleString()}\n` +
              `${profile.verified ? '✓ Verified Account' : ''}`)
        
        return // Exit if successful
      } catch (apiError) {
        console.error('Backend API failed:', apiError)
        
        // Show specific error message
        if (apiError.message.includes('not configured')) {
          alert('❌ Backend API key not configured.\n\nPlease check server.js and .env file.')
          return
        }
        
        if (apiError.message.includes('404') || apiError.message.includes('not found')) {
          alert(`❌ User @${username} not found on Twitter.\n\nPlease check the username and try again.`)
          return
        }
        
        if (apiError.message.includes('403')) {
          alert('❌ API Key invalid or not subscribed.\n\nPlease check your RapidAPI subscription.')
          return
        }
        
        // Try fallback providers
        console.log('🔄 Trying fallback providers...')
        try {
          const base64Avatar = await tryFallbackProviders(username)
          setProfileImage(base64Avatar)
          
          alert(`⚠️ Used fallback provider for @${username}\n\n` +
                `Avatar loaded, but name/bio auto-fill not available.\n` +
                `Please fill them manually.`)
        } catch (fallbackError) {
          console.error('All methods failed:', fallbackError)
          alert(`❌ Could not fetch profile picture for @${username}.\n\n` +
                `Possible reasons:\n` +
                `• Backend server not running (check port 3001)\n` +
                `• Account is private or suspended\n` +
                `• Username not found\n` +
                `• Network connectivity issue\n\n` +
                `Please upload your profile picture manually.`)
        }
      }
      
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('❌ An unexpected error occurred. Please try again or upload manually.')
    } finally {
      setIsFetching(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    if (!name || !selectedRole) {
      alert('Please fill in your name and select a role')
      return
    }
    const data = {
      name,
      role: selectedRole,
      bio,
      profileImage,
      twitter,
    }
    setCardData(data)
    localStorage.setItem('cardData', JSON.stringify(data))
  }

  const handleDownload = async () => {
    if (!frontCardRef.current || !cardData) return
    
    // Ensure background is loaded
    if (!cardBackgroundBase64) {
      alert('Please wait for card template to load...')
      return
    }
    
    setIsDownloading(true)
    
    try {
      // Strategy 1: Ensure all images are loaded
      const images = frontCardRef.current.querySelectorAll('img')
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          // Reload jika belum load
          if (!img.complete && img.src) {
            const src = img.src
            img.src = ''
            img.src = src
          }
        })
      })
      
      await Promise.all(imagePromises)
      console.log('✅ All images loaded')
      
      // Strategy 2: Wait extra time untuk ensure render complete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let dataUrl
      
      try {
        // Try html-to-image first (better quality)
        console.log('🎨 Trying html-to-image...')
        dataUrl = await toPng(frontCardRef.current, {
          quality: 1,
          pixelRatio: 3,
          cacheBust: true,
          includeQueryParams: false,
          skipAutoScale: false,
          skipFonts: false,
          preferredFontFormat: 'woff2',
          filter: (node) => {
            return true
          },
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
        })
        console.log('✅ html-to-image success')
      } catch (htmlToImageError) {
        console.warn('⚠️ html-to-image failed, trying html2canvas...', htmlToImageError)
        
        // Fallback to html2canvas (better at handling images)
        const canvas = await html2canvas(frontCardRef.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: true,
          imageTimeout: 15000,
          removeContainer: true,
        })
        
        dataUrl = canvas.toDataURL('image/png', 1.0)
        console.log('✅ html2canvas success')
      }
      
      console.log('✅ Image captured, dataUrl length:', dataUrl.length)
      
      const link = document.createElement('a')
      link.download = `${cardData.name}-raiku-card.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ Download triggered')
    } catch (error) {
      console.error('Failed to download:', error)
      alert(`Failed to download: ${error.message}\n\nPlease try again or take a screenshot.`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShareTwitter = async () => {
    if (!frontCardRef.current || !cardData) return
    
    try {
      // Ensure all images loaded
      const images = frontCardRef.current.querySelectorAll('img')
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve
        })
      }))
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let dataUrl
      
      try {
        // Try html-to-image
        dataUrl = await toPng(frontCardRef.current, {
          quality: 1,
          pixelRatio: 3,
          backgroundColor: '#0B0B0B',
          cacheBust: true,
        })
      } catch (err) {
        // Fallback to html2canvas
        const canvas = await html2canvas(frontCardRef.current, {
          backgroundColor: '#0B0B0B',
          scale: 3,
          useCORS: true,
          allowTaint: false,
        })
        dataUrl = canvas.toDataURL('image/png', 1.0)
      }
      
      const link = document.createElement('a')
      link.download = `${cardData.name}-raiku-card.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Then open Twitter
      setTimeout(() => {
        const tweetText = `Check out my Raiku ID Card! I'm a ${cardData.role} at @RaikuCommunity 🏠\n\nGenerate yours at raiku.house`
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
        window.open(twitterUrl, '_blank')
      }, 500)
    } catch (error) {
      console.error('Failed to share:', error)
      alert('Failed to share. Please try again.')
    }
  }

  return (
    <div className="pfp-generator-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="pfp-generator-container">
        {/* Left Panel - Form */}
        <div className="form-panel">
          <div className="form-header">
            <div className="step-badge">1</div>
            <h2 className="form-title">Complete Your Raiku Card</h2>
          </div>

          <div className="form-fields">
            {/* Name Input */}
            <div className="form-field">
              <label className="form-label">
                YOUR NAME <span className="required">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Felix | Raiku"
                className="form-input"
              />
            </div>

            {/* Role Selection */}
            <div className="form-field">
              <label className="form-label">
                YOUR ROLE <span className="required">*</span>
              </label>
              <div className="role-grid">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`role-button ${selectedRole === role ? 'selected' : ''}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="form-field">
              <label className="form-label">
                UPLOAD PROFILE PICTURE <span className="required">*</span>
              </label>
              <label className="upload-area">
                {profileImage ? (
                  <img src={profileImage} alt="Preview" className="preview-image" />
                ) : (
                  <span className="upload-text">+ UPLOAD PROFILE PICTURE</span>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input" 
                />
              </label>
            </div>

            {/* Divider */}
            <div className="divider">
              <span className="divider-text">OR</span>
            </div>

            {/* Twitter Input */}
            <div className="form-field">
              <label className="form-label">TWITTER ID</label>
              <div className="twitter-input-group">
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@felixthesixth"
                  className="form-input twitter-input"
                />
                <button 
                  onClick={handleFetchTwitter}
                  disabled={isFetching}
                  className="fetch-button"
                >
                  {isFetching ? 'FETCHING...' : 'FETCH'}
                </button>
              </div>
            </div>

            {/* Bio Textarea */}
            <div className="form-field">
              <label className="form-label">BIO</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="form-textarea"
              />
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate} className="generate-button">
              GENERATE YOUR CARD
              <span className="button-corner"></span>
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="preview-panel">
          <div className="preview-header">
            <span className="step-badge">2</span>
            <h2 className="preview-title">Preview</h2>
          </div>

          <div className="cards-container">
            {cardData ? (
              <>
                {/* Front Card */}
                <div 
                  ref={frontCardRef} 
                  className="card front-card"
                  style={{
                    backgroundImage: cardBackgroundBase64 ? `url("${cardBackgroundBase64}")` : 'url("/RaikuCard.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  
                  <div className="card-content">
                    {cardData.profileImage ? (
                      <div className="profile-image">
                        <img 
                          src={cardData.profileImage} 
                          alt="Profile" 
                          crossOrigin="anonymous"
                          loading="eager"
                          decoding="sync"
                          style={{ 
                            imageRendering: '-webkit-optimize-contrast',
                            objectFit: 'cover',
                          }}
                          onLoad={(e) => {
                            console.log('✅ Card image loaded:', e.target.src.substring(0, 50))
                          }}
                          onError={(e) => {
                            console.error('❌ Card image failed to load')
                          }}
                        />
                      </div>
                    ) : (
                      <div className="profile-placeholder">
                        <span>{cardData.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    
                    <h3 className="card-name">{cardData.name}</h3>
                    <span className="card-role">{cardData.role}</span>
                    
                    {cardData.twitter && (
                      <span className="card-twitter">{cardData.twitter}</span>
                    )}
                    
                    {cardData.bio && (
                      <p className="card-bio">{cardData.bio}</p>
                    )}
                  </div>
                  
                  <div className="card-footer">
                    <span className="card-brand">RAIKU
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Placeholder Card */}
                <div className="card placeholder-card">
                  <div className="shimmer"></div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {cardData && (
            <div className="action-buttons">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="action-btn download-btn"
              >
                {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD'}
              </button>
              <button
                onClick={handleShareTwitter}
                className="action-btn twitter-btn"
              >
                SHARE ON X
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
