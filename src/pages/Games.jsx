import { useState } from 'react'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import PacmanGame from '../components/games/PacmanGame'
import './Games.css'

export default function Games({ onNavigate, currentPage }) {
  const [selectedGame, setSelectedGame] = useState(null)

  const games = [
    {
      id: 'pacman',
      name: 'RAC-MAN',
      description: 'Raiku-man always speedrun and avoid congestion!',
      icon: '🟡',
      component: PacmanGame
    },
 
    {
      id: 'kong',
      name: '?',
      description: 'Coming soon...',
      icon: '🦍',
      component: null
    },

    {
      id: 'run',
      name: '?',
      description: 'Coming soon...',
      icon: '🏃‍♂️',
      component: null
    },
  ]

  if (selectedGame) {
    const GameComponent = games.find(g => g.id === selectedGame)?.component
    return (
      <div className="game-page">
        <button 
          onClick={() => setSelectedGame(null)}
          className="back-button"
        >
          ← Back to Games
        </button>
        {GameComponent && <GameComponent />}
      </div>
    )
  }

  return (
    <div className="games-page">
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
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="games-container">
        <div className="games-header">
          <h1 className="games-title">RAIKU GAMES</h1>
          <p className="games-subtitle">Choose your game and speed-fun!</p>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <div 
              key={game.id}
              className={`game-card ${!game.component ? 'disabled' : ''}`}
              onClick={() => game.component && setSelectedGame(game.id)}
            >
              <div className="game-icon">{game.icon}</div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              {game.component && (
                <button className="play-button">
                  PLAY NOW
                </button>
              )}
              {!game.component && (
                <span className="coming-soon">COMING SOON</span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
