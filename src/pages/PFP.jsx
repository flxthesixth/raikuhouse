import React from 'react'
import Navbar from '../components/Navbar'
import './PFP.css'

function PFP({ onNavigate, currentPage }) {
  return (
    <div className="pfp-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        <h1>PFP Page - Loading 3D...</h1>
      </div>
    </div>
  )
}

export default PFP
