import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import './Quiz.css'

const quizData = {
  beginner: [
    { question: "What is Raiku's main mission?", options: ["To make Solana faster than Ethereum", "To transform blockspace into a guaranteed, programmable resource", "To create a new blockchain from scratch", "To replace validators with AI"], correct: 1, explanation: "Raiku's core mission is to transform blockspace from an unpredictable commodity into a guaranteed, programmable resource, providing enterprise-grade certainty for Solana infrastructure." },
    { question: "How much funding has Raiku raised in total?", options: ["$5 million", "$10 million", "$13.5 million", "$20 million"], correct: 2, explanation: "Raiku has raised a total of $13.5 million, including an $11.25M seed round led by Pantera Capital and a $2.25M pre-seed round." },
    { question: "What does JIT stand for in Raiku's technology?", options: ["Jump In Time", "Just-in-Time", "Join Instant Transfer", "Jitter-free Integration"], correct: 1, explanation: "JIT stands for Just-in-Time transactions, which provide guaranteed inclusion in the next available Solana slot for time-sensitive operations." },
    { question: "What is the pre-confirmation speed that Raiku offers?", options: ["Under 100ms", "Under 50ms", "Under 30ms", "Under 10ms"], correct: 2, explanation: "Raiku provides sub-30ms pre-confirmations with edge computing nodes placed close to transaction origin points." },
    { question: "Which of these is NOT a benefit Raiku provides?", options: ["Guaranteed transaction inclusion", "MEV protection", "Free transactions for everyone", "Deterministic execution"], correct: 2, explanation: "While Raiku provides guaranteed inclusion, MEV protection, and deterministic execution, it uses a fair auction-based pricing mechanism." },
    { question: "What does AOT stand for?", options: ["Ahead-of-Time", "Always On Target", "Automatic Order Transfer", "Advanced Operation Technology"], correct: 0, explanation: "AOT stands for Ahead-of-Time transactions, which allow users to pre-book guaranteed blockspace up to 60 seconds in advance." },
    { question: "How many lines of code does Raiku Lite Mode require for integration?", options: ["Two lines", "Five lines", "Ten lines", "Twenty lines"], correct: 0, explanation: "Raiku Lite Mode can be integrated with as little as two lines of code." },
    { question: "Which blockchain does Raiku build on?", options: ["Ethereum", "Solana", "Polygon", "Avalanche"], correct: 1, explanation: "Raiku is built specifically for Solana, using its validators to ensure guaranteed block inclusion." },
    { question: "What problem does Raiku solve for traders?", options: ["High gas fees", "Slow transaction speeds", "Unpredictable execution and missed opportunities", "Lack of trading pairs"], correct: 2, explanation: "Raiku provides consistent and fully predictable execution for traders, ensuring they never miss opportunities due to network issues." },
    { question: "Who led Raiku's seed funding round?", options: ["Andreessen Horowitz", "Pantera Capital", "Sequoia Capital", "Coinbase Ventures"], correct: 1, explanation: "Pantera Capital led Raiku's $11.25M seed funding round." }
  ],
  intermediate: [
    { question: "How far in advance can AOT transactions be booked?", options: ["Up to 30 seconds", "Up to 45 seconds", "Up to 60 seconds", "Up to 120 seconds"], correct: 2, explanation: "AOT transactions allow users to pre-book guaranteed blockspace up to 60 seconds in advance." },
    { question: "What does siQoS stand for?", options: ["Simple Quality of Service", "Slot-Inclusion Quality of Service", "Speed-Integrated QoS", "Stake-Inclusive QoS"], correct: 1, explanation: "siQoS stands for Slot-Inclusion Quality of Service, reserving blockspace for Raiku transactions." },
    { question: "What type of auction mechanism does JIT use?", options: ["Open-bid auction", "Dutch auction", "Sealed-bid auction", "English auction"], correct: 2, explanation: "JIT transactions use a sealed-bid auction mechanism for immediate execution." },
    { question: "Which validator clients is Raiku compatible with?", options: ["Only Agave", "Only Firedancer", "Both Anza (Agave) and Firedancer", "Only custom Raiku clients"], correct: 2, explanation: "Raiku offers seamless integration with both Anza (Agave) and Firedancer validator clients." },
    { question: "What is the main benefit of transactions bypassing the public mempool?", options: ["Faster confirmation times", "Lower fees", "MEV protection against front-running", "Better UX design"], correct: 2, explanation: "Bypassing the public mempool provides MEV protection against front-running and sandwich attacks." },
    { question: "What use case benefits most from scheduled oracle updates?", options: ["NFT marketplaces", "DeFi lending protocols requiring precise price feeds", "Gaming applications", "Social media dApps"], correct: 1, explanation: "DeFi lending protocols benefit from AOT's scheduled oracle updates at exact intervals to prevent manipulation." },
    { question: "How does Raiku help validators generate revenue?", options: ["By increasing staking rewards", "By selling tailored blockspace through the Raiku Sidecar", "By reducing operational costs", "By providing free infrastructure"], correct: 1, explanation: "Validators run the Raiku Sidecar to sell tailored blockspace directly to builders." },
    { question: "What percentage of each block does siQoS typically reserve?", options: ["10%", "25%", "50%", "75%"], correct: 1, explanation: "siQoS typically reserves around 25% of each block for Raiku transactions." },
    { question: "Which scenario is BEST suited for JIT transactions?", options: ["Scheduled monthly payroll", "High-frequency arbitrage opportunities", "Casual NFT browsing", "Reading blockchain data"], correct: 1, explanation: "JIT transactions are perfect for high-frequency arbitrage requiring immediate execution." },
    { question: "What makes AOT transactions have the strongest MEV protection?", options: ["They use encryption", "They're booked well in advance and never enter any mempool", "They have higher priority fees", "They use special smart contracts"], correct: 1, explanation: "AOT transactions are booked in advance and never enter mempools, remaining invisible until execution." }
  ],
  advanced: [
    { question: "In Raiku's architecture, what is the relationship between edge computing and latency reduction?", options: ["Edge nodes cache transactions for later processing", "Edge nodes are placed close to transaction origin points to minimize network hops", "Edge computing has no impact on latency", "Edge nodes only handle failed transactions"], correct: 1, explanation: "Raiku places edge nodes close to transaction origins to minimize network hops and achieve sub-30ms pre-confirmations." },
    { question: "How does Raiku's slot marketplace handle dynamic capacity allocation?", options: ["Fixed 50-50 allocation", "Shifts resources in real-time based on demand signals", "JIT always has priority", "Random allocation"], correct: 1, explanation: "The marketplace dynamically shifts resources between JIT and AOT based on real-time demand." },
    { question: "What is the primary architectural difference between swQoS and siQoS?", options: ["swQoS is faster", "siQoS provides slot-inclusion guarantees while swQoS allocates by validator stake", "swQoS is only for validators", "They are the same"], correct: 1, explanation: "siQoS reserves blockspace for auction winners with guarantees, while swQoS allocates bandwidth by validator stake." },
    { question: "Why does AOT use open auction while JIT uses sealed-bid?", options: ["To reduce computational complexity", "Open auctions enable price discovery for future slots, sealed-bids prevent gaming for immediate execution", "Random design choice", "Open auctions are always better"], correct: 1, explanation: "AOT's open auctions enable planning and price discovery, while JIT's sealed-bids prevent gaming during time-sensitive execution." },
    { question: "In DePIN applications, what makes Raiku's deterministic execution critical?", options: ["Makes transactions cheaper", "Physical infrastructure coordination requires precise timing that probabilistic systems can't provide", "DePIN doesn't need deterministic execution", "Only helps with data storage"], correct: 1, explanation: "DePIN requires microsecond-level coordination of real-world infrastructure, needing guarantees probabilistic systems can't provide." },
    { question: "What systemic risk does Raiku mitigate for DeFi lending protocols?", options: ["UI bugs", "Cascade failures from missed liquidations causing protocol insolvency", "Smart contract vulnerabilities", "Wallet connection issues"], correct: 1, explanation: "Raiku's guaranteed JIT execution prevents missed liquidations that could cascade into protocol insolvency." },
    { question: "How does Raiku address the MEV supply chain problem?", options: ["By eliminating all MEV", "By routing transactions privately and providing deterministic execution removing information asymmetry", "By making all transactions public", "It doesn't address MEV"], correct: 1, explanation: "Raiku routes transactions privately with deterministic execution, removing information asymmetry while enabling fair competition." },
    { question: "What makes Raiku's approach novel compared to other block building solutions?", options: ["First blockchain ever", "Transforms blockspace into programmable resource with guaranteed inclusion using existing validators", "Uses proof-of-work", "Completely centralized"], correct: 1, explanation: "Raiku leverages existing validator infrastructure to create a programmable blockspace market with guaranteed inclusion." },
    { question: "Why is cryptographic pre-confirmation important for institutional compliance?", options: ["Makes transactions private", "Provides auditable proof of guaranteed settlement timing before execution", "Reduces transaction fees", "Speeds up consensus"], correct: 1, explanation: "Cryptographic pre-confirmations provide auditable proof of guaranteed timing, critical for regulatory compliance." },
    { question: "What prevents validator centralization in Raiku's marketplace?", options: ["Only large validators can participate", "Transparent auctions and lightweight sidecar accessible to all validators regardless of stake", "Random selection", "Requires special hardware"], correct: 1, explanation: "Transparent auctions and lightweight Sidecar prevent centralization by being accessible to all validators." }
  ]
}

export default function Quiz({ onNavigate }) {
  const [screen, setScreen] = useState('start') // 'start', 'quiz', 'results'
  const [difficulty, setDifficulty] = useState('beginner')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const resultsRef = useRef(null)

  const getDifficultyLabel = () => {
    switch(difficulty) {
      case 'beginner': return '🐣 Newbie'
      case 'intermediate': return '⚡ Raiku Chad'
      case 'advanced': return '🐉 Son of Lawn'
      default: return difficulty
    }
  }

  const shareToTwitter = async () => {
    // First download the image
    if (resultsRef.current) {
      try {
        const canvas = await html2canvas(resultsRef.current, {
          backgroundColor: '#000000',
          scale: 2,
          useCORS: true,
        })
        
        const link = document.createElement('a')
        link.download = `raiku-quiz-${difficulty}-${score}pts.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch (err) {
        console.error('Error downloading results:', err)
      }
    }
    
    // Then open Twitter with pre-filled text
    const pct = Math.round((score / questions.length) * 100)
    const text = `🐉 I just scored ${score}/${questions.length} (${pct}%) on the Raiku Quiz!\n\n📊 Level: ${getDifficultyLabel()}\n\nTest your knowledge at https://raikuhouse.vercel.app 🚀\n\n`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, '_blank')
  }

  const startQuiz = () => {
    setQuestions([...quizData[difficulty]])
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScreen('quiz')
  }

  const selectOption = (index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    if (index === questions[currentIndex].correct) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setScreen('results')
    }
  }

  const retryQuiz = () => {
    setQuestions([...quizData[difficulty]])
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScreen('quiz')
  }

  const changeDifficulty = () => {
    setScreen('start')
  }

  const getOptionClass = (index) => {
    if (selectedAnswer === null) return 'option'
    const q = questions[currentIndex]
    let cls = 'option disabled'
    if (index === q.correct) cls += ' correct'
    if (index === selectedAnswer && index !== q.correct) cls += ' incorrect'
    return cls
  }

  const getPerformanceMessage = () => {
    const pct = Math.round((score / questions.length) * 100)
    if (pct >= 90) return "🏆 Outstanding! You're a Raiku expert!"
    if (pct >= 70) return "🎉 Great job! You have solid understanding!"
    if (pct >= 50) return "👍 Good effort! Review the material and try again!"
    return "📚 Keep learning! Review the guide and come back!"
  }

  return (
    <div className="quiz-page">
      <Particles
        particleCount={150}
        particleSpread={8}
        speed={0.08}
        particleColors={['#FFD700', '#FFA500', '#FFEB3B']}
        moveParticlesOnHover={true}
        particleHoverFactor={0.5}
        alphaParticles={true}
        particleBaseSize={80}
        sizeRandomness={0.8}
        cameraDistance={25}
      />
      <Navbar onNavigate={onNavigate} currentPage="quiz" />
      
      <div className="quiz-container">
        {/* Start Screen */}
        {screen === 'start' && (
          <div className="quiz-card">
            <div className="quiz-header">
              <h1>Raiku Quiz</h1>
              <p className="quiz-subtitle">Test your understanding of Raiku World</p>
            </div>
            
            <div className="difficulty-section">
              <h3>Select Difficulty Level</h3>
              <div className="difficulty-selector">
                <button 
                  className={`difficulty-btn ${difficulty === 'beginner' ? 'active' : ''}`}
                  onClick={() => setDifficulty('beginner')}
                >
                  🐣 Newbie
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'intermediate' ? 'active' : ''}`}
                  onClick={() => setDifficulty('intermediate')}
                >
                  ⚡ Raiku Chad
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'advanced' ? 'active' : ''}`}
                  onClick={() => setDifficulty('advanced')}
                >
                  🐉 Son of Lawn
                </button>
              </div>
            </div>
            
            <div className="start-button-container">
              <button className="btn btn-primary btn-large" onClick={startQuiz}>
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Screen */}
        {screen === 'quiz' && questions.length > 0 && (
          <div className="quiz-card">
            <div className="quiz-info">
              <div className="info-item">
                <div className="info-label">Question</div>
                <div className="info-value">{currentIndex + 1}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Score</div>
                <div className="info-value">{score}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Difficulty</div>
                <div className="info-value">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
              </div>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="question-container">
              <div className="question-number">
                Question {currentIndex + 1} of {questions.length}
              </div>
              <div className="question-text">
                {questions[currentIndex].question}
              </div>
              
              <div className="options">
                {questions[currentIndex].options.map((opt, i) => (
                  <div 
                    key={i}
                    className={getOptionClass(i)}
                    onClick={() => selectOption(i)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </div>
                ))}
              </div>
              
              {showExplanation && (
                <div className="explanation show">
                  <div className="explanation-title">💡 Explanation:</div>
                  <div className="explanation-text">
                    {questions[currentIndex].explanation}
                  </div>
                </div>
              )}
            </div>
            
            <div className="buttons">
              <button 
                className="btn btn-primary" 
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentIndex + 1 < questions.length ? 'Next Question' : 'See Results'}
              </button>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {screen === 'results' && (
          <div className="quiz-card results-card">
            <div className="results-content" ref={resultsRef}>
              <div className="quiz-header">
                <h1>🎉 Quiz Complete!</h1>
                <p className="difficulty-badge">{getDifficultyLabel()}</p>
              </div>
              
              <div className="score-circle">
                <div className="score-number">{score}</div>
                <div className="score-label">out of {questions.length}</div>
              </div>
              
              <div className="performance-message">
                {getPerformanceMessage()}
              </div>
              
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-value">{score}</div>
                  <div className="stat-label">Correct</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{questions.length - score}</div>
                  <div className="stat-label">Incorrect</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{Math.round((score / questions.length) * 100)}%</div>
                  <div className="stat-label">Percentage</div>
                </div>
              </div>
              
              <div className="results-branding">
                <span>⚡️ Raiku Quiz</span>
              </div>
            </div>
            
            <div className="share-buttons">
              <button className="btn btn-twitter" onClick={shareToTwitter}>
                Share  𝕏
              </button>
            </div>
            
            <div className="buttons center">
              <button className="btn btn-secondary" onClick={retryQuiz}>
                Try Again
              </button>
              <button className="btn btn-primary" onClick={changeDifficulty}>
                Change Difficulty
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
