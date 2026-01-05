import { useState } from 'react'
import Home from './pages/Home'
import PFP from './pages/PFP'
import Learn from './pages/Learn'
import Quiz from './pages/Quiz'
import PFPGenerator from './pages/PFPGenerator'
import Games from './pages/Games'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="app">
      {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
      {currentPage === 'pfp' && <PFPGenerator onNavigate={setCurrentPage} currentPage="pfp" />}
      {currentPage === 'learn' && <Learn onNavigate={setCurrentPage} />}
      {currentPage === 'quiz' && <Quiz onNavigate={setCurrentPage} />}
      {currentPage === 'games' && <Games onNavigate={setCurrentPage} currentPage="games" />}
    </div>
  )
}

export default App
