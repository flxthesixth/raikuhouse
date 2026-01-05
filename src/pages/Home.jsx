import { useState } from 'react'
import LiquidEther from '../components/LiquidEther'
import Navbar from '../components/Navbar'
import './Home.css'

export default function Home({ onNavigate }) {
  return (
    <div className="home">
      {/* Background Liquid Effect */}
      <div className="liquid-background">
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          dt={0.014}
          BFECC={true}
          resolution={0.5}
          isBounce={false}
          colors={['#FFD700', '#FFEB3B', '#FFC107']}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={1000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Navigation Bar */}
      <Navbar onNavigate={onNavigate} currentPage="home" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="main-title">Welcome to Raiku House</h1>
          <p className="main-subtitle">Experience the Raiku House by Raiku Community</p>
        </div>
      </main>
    </div>
  )
}
