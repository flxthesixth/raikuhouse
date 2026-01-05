// Debug utility untuk test Twitter API
// Buka browser console dan paste script ini

import { getTwitterProfile, getTwitterProfileWithBase64Avatar, tryFallbackProviders } from './utils/twitterApi'

// Test functions
window.testTwitterAPI = async (username) => {
  console.clear()
  console.log('🧪 Testing Twitter API for:', username)
  console.log('─'.repeat(50))
  
  try {
    // Test RapidAPI
    console.log('\n1️⃣ Testing RapidAPI...')
    const profile = await getTwitterProfileWithBase64Avatar(username)
    console.log('✅ RapidAPI Success:', profile)
    return profile
  } catch (error) {
    console.error('❌ RapidAPI Failed:', error.message)
    
    // Test fallback
    try {
      console.log('\n2️⃣ Testing Fallback Providers...')
      const avatar = await tryFallbackProviders(username)
      console.log('✅ Fallback Success! Avatar length:', avatar.length)
      return { avatarBase64: avatar }
    } catch (fallbackError) {
      console.error('❌ Fallback Failed:', fallbackError.message)
      throw fallbackError
    }
  }
}

// Quick test commands
window.testElonMusk = () => window.testTwitterAPI('elonmusk')
window.testGithub = () => window.testTwitterAPI('github')
window.testYourself = () => window.testTwitterAPI('flxthesixth')

console.log('✅ Debug utilities loaded!')
console.log('\nUsage:')
console.log('  testTwitterAPI("username")  - Test any username')
console.log('  testElonMusk()              - Quick test @elonmusk')
console.log('  testGithub()                - Quick test @github')
console.log('  testYourself()              - Test @flxthesixth')
