import { useState, useEffect } from 'react'
import raikuHouse from '../img/raiku_house.jpg'
import './Navbar.css'

export default function Navbar({ onNavigate, currentPage }) {
  const [activeNav, setActiveNav] = useState(currentPage || 'home')

  useEffect(() => {
    if (currentPage) {
      setActiveNav(currentPage)
    }
  }, [currentPage])

  const handleNavigation = (page) => {
    setActiveNav(page)
    if (onNavigate) onNavigate(page)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <img src={raikuHouse} alt="Raiku" className="logo-image" />
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <a
              href="#home"
              className={`nav-link ${activeNav === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}
            >
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#learn"
              className={`nav-link ${activeNav === 'learn' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('learn'); }}
            >
              Study
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#quiz"
              className={`nav-link ${activeNav === 'quiz' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('quiz'); }}
            >
              Quiz
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#pfp"
              className={`nav-link ${activeNav === 'pfp' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('pfp'); }}
            >
              Card
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#games"
              className={`nav-link ${activeNav === 'games' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavigation('games'); }}
            >
              Games
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
