import { useState } from 'react'
import Navbar from '../components/Navbar'
import Particles from '../components/Particles'
import raikuLogo from '../img/raiku.jpg'
import './Learn.css'

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'problem', label: 'The Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'technology', label: 'Technology' },
  { id: 'usecases', label: 'Use Cases' },
  { id: 'components', label: 'Components' },
]

export default function Learn({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('intro')

  return (
    <div className="learn-page">
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
      <Navbar onNavigate={onNavigate} currentPage="learn" />
      
      <div className="learn-container">
        {/* Header */}
        <header className="learn-header">
          <img src={raikuLogo} alt="Raiku" className="learn-logo" />
          <h1> RAIKU STUDY </h1>
          <p className="learn-subtitle">Enterprise-Grade Certainty for Solana Infrastructure</p>
          <p className="learn-description">Complete Guide Book for Developers, Traders & Raiku Community</p>
          
          <div className="nav-pills">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-pill ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </header>

        {/* INTRODUCTION SECTION */}
        <div className={`content-section ${activeSection === 'intro' ? 'active' : ''}`}>
          <h2>📖 What is Raiku?</h2>
          
          <div className="highlight-box">
            <p><strong>Raiku is a high-performance infrastructure protocol on Solana that transforms blockspace into a programmable, guaranteed resource.</strong> It delivers enterprise-grade certainty, enabling businesses to build and operate on-chain with unprecedented reliability, speed, and efficiency.</p>
          </div>

          <h3>Core Mission</h3>
          <p>Raiku's mission is to <strong>make transactions never fail again</strong>. It reengineers blockchain infrastructure from first principles to deliver deterministic execution and low-latency performance for enterprise-level businesses.</p>

          <h3>Key Statistics</h3>
          <div className="stats-container">
            <span className="stat-box">$13.5M Raised</span>
            <span className="stat-box">&lt;30ms Pre-confirmations</span>
            <span className="stat-box">60s Advance Booking</span>
            <span className="stat-box">~20 Team Members</span>
          </div>

          <h3>Why Raiku Matters</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>🎯 For Developers</h4>
              <p>Build for users, not infrastructure failures. Focus on creating great products without worrying about transaction reliability.</p>
            </div>
            <div className="feature-card">
              <h4>⚡ For Traders</h4>
              <p>Consistent and fully predictable execution. Never miss opportunities due to network congestion or failed transactions.</p>
            </div>
            <div className="feature-card">
              <h4>🏢 For Institutions</h4>
              <p>Operate with certainty at scale. Meet compliance requirements with guaranteed transaction timing and settlement.</p>
            </div>
            <div className="feature-card">
              <h4>🔐 For Validators</h4>
              <p>Scale revenue through plugins. Generate new income streams by selling predictable blockspace.</p>
            </div>
          </div>

          <h3>Funding & Backing</h3>
          <p>Raiku has raised a total of <strong>$13.5 million</strong>:</p>
          <ul>
            <li><strong>$11.25M Seed Round</strong> led by Pantera Capital</li>
            <li><strong>$2.25M Pre-seed Round</strong> co-led by Figment Capital and Big Brain Holdings</li>
            <li>Notable investors: Jump Crypto, Lightspeed Faction, HashKey Capital</li>
            <li>Angel investors: Anatoly Yakovenko (Solana co-founder), Austin Federa, Kash Dhanda, Julien Bouteloup</li>
          </ul>
        </div>

        {/* PROBLEM SECTION */}
        <div className={`content-section ${activeSection === 'problem' ? 'active' : ''}`}>
          <h2>📖 The Problem Raiku Solves</h2>

          <h3>Current Blockchain Infrastructure Challenges</h3>
          
          <div className="highlight-box">
            <p><strong>While Solana is fast, existing infrastructure remains fragile and unreliable under stress for enterprise-level businesses.</strong> Applications fail when it matters most, transactions don't land on time, and performance collapses under load.</p>
          </div>

          <h4>1. Unpredictable Transaction Inclusion</h4>
          <ul>
            <li>Transactions can fail, be dropped, or reordered during network congestion</li>
            <li>No guarantee when or if a transaction will be included</li>
            <li>Critical operations (liquidations, arbitrage) miss their execution windows</li>
            <li>Users face uncertainty and slippage</li>
          </ul>

          <h4>2. Performance Degradation Under Load</h4>
          <ul>
            <li>Network congestion leads to failed transactions and delays</li>
            <li>Priority fee bidding wars create unpredictable costs</li>
            <li>Well-connected bots get fast-lane access while regular users struggle</li>
            <li>Centralization concerns with opaque transaction ordering</li>
          </ul>

          <h4>3. Lack of Deterministic Execution</h4>
          <ul>
            <li>Applications requiring atomicity and determinism face challenges</li>
            <li>No ability to schedule transactions for specific future slots</li>
            <li>Automated strategies (liquidations, rebalancing) become unreliable</li>
            <li>Capital inefficiency from missed opportunities</li>
          </ul>

          <h4>4. MEV Exposure</h4>
          <ul>
            <li>Public mempool exposes transactions to front-running and sandwich attacks</li>
            <li>Market makers and traders lose value to MEV extractors</li>
            <li>No native protection against transaction reordering</li>
          </ul>

          <h3>Impact on Different Stakeholders</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>Developers</h4>
              <p>Spend time patching around infrastructure issues instead of building features. Cannot guarantee user experience during peak times.</p>
            </div>
            <div className="feature-card">
              <h4>Traders & Market Makers</h4>
              <p>Cancel-and-replace orders fail. Arbitrage opportunities disappear. Liquidation bots miss critical executions.</p>
            </div>
            <div className="feature-card">
              <h4>Institutions</h4>
              <p>Cannot meet compliance requirements. Settlement windows become unreliable. Risk management strategies fail.</p>
            </div>
            <div className="feature-card">
              <h4>DeFi Protocols</h4>
              <p>Oracle updates miss deadlines. Protocol parameters can't be updated reliably. User funds at risk during volatility.</p>
            </div>
          </div>

          <div className="highlight-box">
            <p><strong>Bottom Line:</strong> Without infrastructure that service providers can depend on, Solana cannot become the future of finance. No business can succeed without a great product, and no great product can be built on an unreliable foundation.</p>
          </div>
        </div>

        {/* SOLUTION SECTION */}
        <div className={`content-section ${activeSection === 'solution' ? 'active' : ''}`}>
          <h2>📖 Raiku's Solution</h2>

          <div className="highlight-box">
            <p><strong>Raiku establishes a fair and efficient market for blockspace, transforming it from an unpredictable commodity into a guaranteed, programmable resource.</strong></p>
          </div>

          <h3>Core Innovation: Guaranteed Block Inclusion</h3>
          <p>Raiku's performant block building architecture uses the same validators that already secure Solana to ensure <span className="key-term">guaranteed block inclusion</span>, offering certainty for app developers and users that their transactions will land even in times of high stress.</p>

          <h3>Key Features</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>🎯 Deterministic Execution</h4>
              <p>Guaranteed outcomes with predictable transaction timing. Your transactions land exactly when and where you specify.</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Ultra-Low Latency</h4>
              <p>Sub-30ms pre-confirmations with edge computing nodes placed close to transaction origin points.</p>
            </div>
            <div className="feature-card">
              <h4>📅 Advanced Scheduling</h4>
              <p>Reserve compute units up to 60 seconds in advance or execute with sub-second timing.</p>
            </div>
            <div className="feature-card">
              <h4>🛡️ MEV Protection</h4>
              <p>Transactions bypass public mempool, preventing front-running and sandwich attacks.</p>
            </div>
          </div>

          <h3>Two-Sided Execution Marketplace</h3>
          <p>Raiku introduces a blockspace market that aligns incentives for developers, validators, and institutions:</p>

          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Supply Side (Validators)</h4>
              <p>Validators run the lightweight Raiku Sidecar to sell tailored blockspace directly to builders, generating new revenue streams beyond inflation and MEV.</p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Demand Side (Builders)</h4>
              <p>Developers access just-in-time blockspace for immediate execution or reserve compute units in advance through ahead-of-time bookings.</p>
            </div>
          </div>

          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Market Mechanism</h4>
              <p>Fair auction-based pricing ensures transparent cost discovery. No hidden queues or off-chain favoritism.</p>
            </div>
          </div>

          <h3>System Reliability Guarantees</h3>
          <ul>
            <li><strong>Never fails under extreme pressure:</strong> System designed to handle peak stress</li>
            <li><strong>Guaranteed outcomes:</strong> Deterministic execution with cryptographic pre-confirmations</li>
            <li><strong>Millisecond precision:</strong> Control over compute timing where every millisecond matters</li>
            <li><strong>Developer freedom:</strong> Shape low-level application logic with unparalleled control</li>
          </ul>

          <h3>Easy Integration</h3>
          <div className="highlight-box">
            <p><strong>Raiku Lite Mode:</strong> Integrate with as little as <span className="key-term">two lines of code</span>. No structural changes required to your existing applications.</p>
            <p><strong>Full Compatibility:</strong> Seamless integration with Anza (Agave) and Firedancer clients. Compatible with all application logic deployed on Solana.</p>
          </div>
        </div>

        {/* TECHNOLOGY SECTION */}
        <div className={`content-section ${activeSection === 'technology' ? 'active' : ''}`}>
          <h2>📖 Core Technology</h2>

          <h3>1. Just-in-Time (JIT) Transactions</h3>
          <div className="highlight-box">
            <p><strong>JIT transactions provide guaranteed inclusion in the next available Solana slot for time-sensitive operations requiring sub-second execution.</strong></p>
          </div>

          <h4>How JIT Works:</h4>
          <ol>
            <li>User submits high-priority transaction through Raiku</li>
            <li>Transaction enters sealed-bid auction for next slot</li>
            <li>Raiku immediately locks space in the leader's next block</li>
            <li>Winner receives instant pre-confirmation (~30ms)</li>
            <li>Transaction bypasses public mempool (MEV protection)</li>
            <li>Execution happens within seconds with deterministic ordering</li>
          </ol>

          <h4>Perfect For:</h4>
          <ul>
            <li>High-frequency trading and arbitrage</li>
            <li>Liquidation protection</li>
            <li>NFT mints and competitive drops</li>
            <li>Cancel-and-replace orders for market makers</li>
            <li>Emergency protocol actions</li>
          </ul>

          <div className="feature-card single">
            <h4>💡 Key Benefit</h4>
            <p>No matter how congested the network gets, if you win the JIT bid, your transaction is guaranteed to execute in the next slot. No random drops, no waiting in queues.</p>
          </div>

          <h3>2. Ahead-of-Time (AOT) Transactions</h3>
          <div className="highlight-box">
            <p><strong>AOT transactions allow users to pre-book guaranteed blockspace for specific future slots up to 60 seconds in advance.</strong></p>
          </div>

          <h4>How AOT Works:</h4>
          <ol>
            <li>User requests reservation for specific future slot (e.g., 35+ slots ahead)</li>
            <li>Transaction enters open auction for that time window</li>
            <li>Raiku books the transaction into requested slot</li>
            <li>Issues cryptographic pre-confirmation guaranteeing placement</li>
            <li>Transaction executes at exact scheduled time</li>
            <li>Highest bidder executes first within the slot</li>
          </ol>

          <h4>Perfect For:</h4>
          <ul>
            <li>Institutional settlements at specific times</li>
            <li>Scheduled oracle updates (e.g., every 30 seconds)</li>
            <li>Vault rebalancing without execution risk</li>
            <li>Batch processing during optimal fee windows</li>
            <li>Compliance-critical operations with hard deadlines</li>
            <li>Staking reward claims during low-fee periods</li>
          </ul>

          <div className="feature-card single">
            <h4>🛡️ Strongest MEV Protection</h4>
            <p>AOT provides the strongest MEV protection since transactions are booked well in advance and never enter any mempool. They're invisible to other actors until execution.</p>
          </div>

          <h3>3. Slot Marketplace (siQoS)</h3>
          <div className="highlight-box">
            <p><strong>The Slot Marketplace is a programmable blockspace market that transforms Solana's probabilistic fee model into a deterministic, auction-based system.</strong></p>
          </div>

          <h4>How It Works:</h4>
          <ul>
            <li><strong>Slot-Inclusion QoS (siQoS):</strong> Reserves configurable portion (e.g., 25%) of each block for Raiku transactions</li>
            <li><strong>Transparent Auctions:</strong> Both JIT and AOT use fair auction mechanisms with no hidden queues</li>
            <li><strong>Dynamic Capacity:</strong> Shifts resources in real-time between JIT and AOT based on demand</li>
            <li><strong>No Starvation:</strong> System ensures both transaction types always have available capacity</li>
          </ul>

          <h4>Pricing Mechanism:</h4>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>JIT Pricing</h4>
              <p>Sealed-bid auction for immediate execution. Higher bids get priority within the next slot.</p>
            </div>
            <div className="feature-card">
              <h4>AOT Pricing</h4>
              <p>Open auction model where users can see and compete for future slots. Rewards planning ahead.</p>
            </div>
          </div>

          <h3>4. Quality of Service (QoS) System</h3>
          <p>Raiku implements a layered QoS system ensuring reliable performance even under high demand:</p>

          <table className="comparison-table">
            <thead>
              <tr>
                <th>QoS Type</th>
                <th>Description</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>siQoS</strong></td>
                <td>Slot-Inclusion QoS - Reserved blockspace for auction winners</td>
                <td>High-priority, time-sensitive transactions</td>
              </tr>
              <tr>
                <td><strong>swQoS</strong></td>
                <td>Stake-Weighted QoS - Bandwidth allocated by validator stake</td>
                <td>Lower-priority, cost-sensitive operations</td>
              </tr>
            </tbody>
          </table>

          <h3>Technical Architecture Comparison</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Traditional Solana</th>
                <th>Raiku</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Transaction Inclusion</td>
                <td>Probabilistic, best-effort</td>
                <td>Guaranteed with pre-confirmation</td>
              </tr>
              <tr>
                <td>Execution Timing</td>
                <td>Unpredictable</td>
                <td>Deterministic scheduling</td>
              </tr>
              <tr>
                <td>Confirmation Speed</td>
                <td>~400ms average</td>
                <td>&lt;30ms pre-confirmation</td>
              </tr>
              <tr>
                <td>MEV Protection</td>
                <td>Limited</td>
                <td>Built-in via private routing</td>
              </tr>
              <tr>
                <td>Future Booking</td>
                <td>Not available</td>
                <td>Up to 60 seconds ahead (AOT)</td>
              </tr>
              <tr>
                <td>Priority System</td>
                <td>Fee-based bidding war</td>
                <td>Fair auction with QoS tiers</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* USE CASES SECTION */}
        <div className={`content-section ${activeSection === 'usecases' ? 'active' : ''}`}>
          <h2>📖 Real-World Use Cases</h2>

          <h3>1. DeFi Trading & Market Making</h3>
          <div className="usecase-card">
            <h4>Challenge</h4>
            <p>Market makers need to rapidly update quotes and execute cancel-and-replace orders. Failed transactions mean lost opportunities and exposure to adverse price movements.</p>
            <h4>Raiku Solution</h4>
            <p>Use JIT transactions to guarantee order execution with sub-second timing. Pre-confirmations let market makers confidently update positions knowing transactions will land.</p>
            <h4>Result</h4>
            <p>Reliable quote updates, protected against network congestion, tighter spreads, better capital efficiency.</p>
          </div>

          <h3>2. Liquidation Bots</h3>
          <div className="usecase-card">
            <h4>Challenge</h4>
            <p>Lending protocols depend on timely liquidations to maintain solvency. A missed liquidation can cascade into protocol insolvency.</p>
            <h4>Raiku Solution</h4>
            <p>JIT transactions ensure liquidation transactions execute immediately when triggered, regardless of network conditions.</p>
            <h4>Result</h4>
            <p>Protocol safety maintained, liquidators earn reliable fees, reduced systemic risk.</p>
          </div>

          <h3>3. Oracle Updates</h3>
          <div className="usecase-card">
            <h4>Challenge</h4>
            <p>Oracles must update price feeds on strict schedules (e.g., every 30 seconds). Late updates create arbitrage opportunities and risk protocol manipulation.</p>
            <h4>Raiku Solution</h4>
            <p>AOT transactions schedule oracle updates in advance, guaranteeing on-time delivery at predictable intervals.</p>
            <h4>Result</h4>
            <p>Deterministic price feeds, reduced manipulation risk, protocol reliability.</p>
          </div>

          <h3>4. Institutional Settlement</h3>
          <div className="usecase-card">
            <h4>Challenge</h4>
            <p>Institutions require precise settlement windows for compliance and reconciliation. Missed settlements create regulatory issues and operational chaos.</p>
            <h4>Raiku Solution</h4>
            <p>AOT reservations guarantee settlement at exact required times (e.g., 14:03 UTC daily). Cryptographic pre-confirmations provide audit trail.</p>
            <h4>Result</h4>
            <p>Regulatory compliance, predictable operations, enterprise-grade reliability.</p>
          </div>

          <h3>5. DePIN (Decentralized Physical Infrastructure)</h3>
          <div className="highlight-box">
            <p><strong>Raiku unlocks DePIN's $3.5 trillion potential by enabling reliable coordination of real-world infrastructure.</strong></p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <h4>⚡ Energy Networks</h4>
              <p>Coordinate distributed power sources with microsecond-level trading. Enable real-time demand response matching traditional grid reliability.</p>
            </div>
            <div className="feature-card">
              <h4>🌐 Telecommunications</h4>
              <p>Trade cellular and WiFi bandwidth capacity with instant allocation. Dynamic pricing ensures efficient resource utilization.</p>
            </div>
            <div className="feature-card">
              <h4>🚗 Smart Cities</h4>
              <p>Coordinate traffic systems and IoT devices with guaranteed transaction timing. Enable adaptive infrastructure response.</p>
            </div>
            <div className="feature-card">
              <h4>💾 Data Networks</h4>
              <p>Reliable storage and compute coordination. Guaranteed data availability commitments.</p>
            </div>
          </div>
        </div>

        {/* COMPONENTS SECTION */}
        <div className={`content-section ${activeSection === 'components' ? 'active' : ''}`}>
          <h2>📖 System Components</h2>

          <h3>1. Raiku Sidecar</h3>
          <div className="highlight-box">
            <p><strong>A lightweight plugin that validators install alongside their Solana node.</strong> It enables validators to participate in the Raiku marketplace without modifying their core validator software.</p>
          </div>
          <ul>
            <li>Minimal resource overhead</li>
            <li>No changes to validator core logic</li>
            <li>Opt-in participation in blockspace marketplace</li>
            <li>Additional revenue stream for validators</li>
          </ul>

          <h3>2. Raiku Gateway</h3>
          <div className="highlight-box">
            <p><strong>Edge computing nodes positioned globally to minimize latency.</strong> The gateway receives transactions and routes them to the appropriate validators.</p>
          </div>
          <ul>
            <li>Sub-30ms pre-confirmations</li>
            <li>Global distribution for low latency</li>
            <li>Handles JIT and AOT transaction routing</li>
            <li>Cryptographic pre-confirmation issuance</li>
          </ul>

          <h3>3. Auction Engine</h3>
          <div className="highlight-box">
            <p><strong>Fair, transparent auction mechanism for blockspace allocation.</strong></p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>JIT Auctions</h4>
              <p>Sealed-bid auctions for immediate execution. Results revealed only after slot closes.</p>
            </div>
            <div className="feature-card">
              <h4>AOT Auctions</h4>
              <p>Open auction model for future slots. Users can see current bids and compete.</p>
            </div>
          </div>

          <h3>4. Pre-Confirmation System</h3>
          <div className="highlight-box">
            <p><strong>Cryptographic guarantees that transactions will be included.</strong> Pre-confirmations are issued within ~30ms and serve as binding commitments.</p>
          </div>
          <ul>
            <li>Cryptographically signed by validators</li>
            <li>Legally binding commitment to include transaction</li>
            <li>Enables confident execution before on-chain finality</li>
            <li>Audit trail for compliance purposes</li>
          </ul>

          <h3>Architecture Overview</h3>
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Transaction Submission</h4>
              <p>User submits transaction to nearest Raiku Gateway with JIT or AOT preference.</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Auction & Routing</h4>
              <p>Gateway runs auction and routes winning transaction to appropriate validator sidecar.</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Pre-Confirmation</h4>
              <p>Validator issues cryptographic pre-confirmation guaranteeing inclusion.</p>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Execution</h4>
              <p>Transaction executes in guaranteed slot with deterministic ordering.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="learn-footer">
          <p>"The journey of a thousand miles begins with a single step"</p>
          <div className="footer-buttons">
            <button 
              className="cta-button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              ↑ Back to Top
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
