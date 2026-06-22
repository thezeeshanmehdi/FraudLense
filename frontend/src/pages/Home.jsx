import React, { useState } from 'react';
import { Shield, ShieldAlert, Cpu, Search, TrendingUp, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

const PRESETS = [
  {
    name: "Vitalik's Wallet",
    address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    type: "wallet",
    badge: "Low Risk",
    badgeColor: "text-cyber-green bg-cyber-green/10 border-cyber-green/30"
  },
  {
    name: "Flagged Scam Wallet",
    address: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    type: "wallet",
    badge: "High Risk",
    badgeColor: "text-cyber-red bg-cyber-red/10 border-cyber-red/30"
  },
  {
    name: "Honeypot Token Contract",
    address: "0x34567890abcdef1234567890abcdef1234567890",
    type: "contract",
    badge: "Rug-Pull / Honeypot",
    badgeColor: "text-cyber-red bg-cyber-red/10 border-cyber-red/30 animate-pulse"
  },
  {
    name: "Uniswap V3 Router",
    address: "0xe592427a0aece92de3edfdd007f96f9178557242",
    type: "contract",
    badge: "Safe / Audited",
    badgeColor: "text-cyber-green bg-cyber-green/10 border-cyber-green/30"
  }
];

function Home({ onQuickScan }) {
  const [addressInput, setAddressInput] = useState('');
  const [scanType, setScanType] = useState('wallet');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addressInput) {
      setValidationError('Please enter a wallet or smart contract address.');
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(addressInput)) {
      setValidationError('Invalid Ethereum address. Must start with 0x and be 40 hex characters.');
      return;
    }
    setValidationError('');
    onQuickScan(addressInput, scanType);
  };

  return (
    <div className="space-y-20 relative">
      {/* Background Decorative Neon Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto py-8 space-y-8 relative">
        <div className="inline-flex items-center space-x-2 bg-cyber-purple/10 border border-cyber-purple/30 px-4 py-2 rounded-full text-xs font-mono text-cyber-violet">
          <Cpu className="h-4 w-4 animate-spin-slow text-cyber-cyan" />
          <span>Agentic Blockchain Intelligence Engine v2.0</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-sans">
          Real-time AI Auditing for <br />
          <span className="cyber-text-gradient">Web3 Fraud Detection</span>
        </h1>

        <p className="text-lg text-cyber-muted max-w-2xl mx-auto leading-relaxed">
          Instantly evaluate wallets and smart contracts. Our AI engines trace transaction history, scan bytecode modifiers, and calculate threat levels.
        </p>

        {/* Search Analyzer Input */}
        <div className="max-w-2xl mx-auto pt-4">
          <form onSubmit={handleSubmit} className="glass-panel p-2 flex flex-col md:flex-row items-center gap-2 md:gap-0 border border-cyber-purple/40">
            {/* Type selector dropdown */}
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              className="bg-transparent text-white font-mono text-sm px-4 py-3 border-b md:border-b-0 md:border-r border-cyber-border focus:outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="wallet" className="bg-cyber-bg text-white">Wallet Address</option>
              <option value="contract" className="bg-cyber-bg text-white">Smart Contract</option>
            </select>

            {/* Address input */}
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-cyber-muted" />
              <input
                type="text"
                placeholder="Enter 0x address (e.g. 0xd8da6bf...)"
                value={addressInput}
                onChange={(e) => {
                  setAddressInput(e.target.value);
                  if (validationError) setValidationError('');
                }}
                className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-cyber-muted text-sm font-mono focus:outline-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-bg hover:opacity-90 font-bold text-sm shadow-glow-cyan flex items-center justify-center space-x-2 transition-all"
            >
              <span>Scan Address</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {validationError && (
            <div className="mt-3 flex items-center space-x-2 text-cyber-red text-xs font-mono justify-center">
              <AlertTriangle className="h-4 w-4" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Quick Scan / Preset Templates */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Quick-Scan Address Sandbox</h2>
          <p className="text-sm text-cyber-muted">Click any of these verified, high-risk, or audited test templates to instantly inspect detailed security reports.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRESETS.map((preset, idx) => (
            <div 
              key={idx}
              onClick={() => onQuickScan(preset.address, preset.type)}
              className="glass-panel p-5 space-y-4 hover:border-cyber-cyan cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-wider text-cyber-muted uppercase bg-cyber-bg px-2.5 py-1 border border-cyber-border rounded">
                    {preset.type}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border rounded-full ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                </div>
                <h3 className="font-bold text-white group-hover:text-cyber-cyan transition-colors">{preset.name}</h3>
                <p className="text-xs font-mono text-cyber-muted truncate">{preset.address}</p>
              </div>
              <div className="flex items-center text-xs text-cyber-cyan font-mono group-hover:translate-x-1 transition-transform">
                <span>Launch Analysis</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="glass-panel p-8 relative overflow-hidden border-cyber-border/40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/5 to-cyber-cyan/5 pointer-events-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-extrabold text-white font-mono">1,402,904</div>
            <div className="text-xs font-mono text-cyber-muted uppercase tracking-wider">Total Scans Performed</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-extrabold text-cyber-cyan font-mono">$4.2B+</div>
            <div className="text-xs font-mono text-cyber-muted uppercase tracking-wider">Asset Capital Monitored</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-extrabold text-cyber-pink font-mono">99.87%</div>
            <div className="text-xs font-mono text-cyber-muted uppercase tracking-wider">Threat Detection Accuracy</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-extrabold text-cyber-green font-mono">0.02s</div>
            <div className="text-xs font-mono text-cyber-muted uppercase tracking-wider">Mean Heuristic Compute Time</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Full-Spectrum Chain Protection</h2>
          <p className="text-sm text-cyber-muted">Three levels of automated auditing safeguarding your decentralized operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 space-y-4 hover:border-cyber-purple transition-all duration-300">
            <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-2xl w-fit">
              <Shield className="h-8 w-8 text-cyber-cyan" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Wallet Security Analyzer</h3>
            <p className="text-sm text-cyber-muted leading-relaxed">
              Verify wallets against transaction volume records, mixer usage history, malicious phishing tags, and contract deployment loops to assign a granular risk threat index.
            </p>
            <ul className="text-xs font-mono text-cyber-violet space-y-2 pt-2">
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-cyan" /> Wallet Age & Volume Auditing</li>
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-cyan" /> Malicious Mixer Correlation</li>
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-cyan" /> Automatic 0-100 Scoring</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 space-y-4 hover:border-cyber-purple transition-all duration-300">
            <div className="p-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded-2xl w-fit">
              <ShieldAlert className="h-8 w-8 text-cyber-purple" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Smart Contract Auditor</h3>
            <p className="text-sm text-cyber-muted leading-relaxed">
              Inspect compile-level modifiers of smart contracts to detect backdoor privileges, renouncement structures, minting loops, blocklists, and transaction-halting code.
            </p>
            <ul className="text-xs font-mono text-cyber-violet space-y-2 pt-2">
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-purple" /> Honeypot & Rugpull Indicators</li>
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-purple" /> Ownership & Proxy Audits</li>
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-purple" /> Bytecode Signature Diagnostics</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 space-y-4 hover:border-cyber-purple transition-all duration-300">
            <div className="p-3 bg-cyber-pink/10 border border-cyber-pink/30 rounded-2xl w-fit">
              <Cpu className="h-8 w-8 text-cyber-pink" />
            </div>
            <h3 className="text-lg font-bold text-white">3. AI Risk Assessment Engine</h3>
            <p className="text-sm text-cyber-muted leading-relaxed">
              Leverage natural language reasoning engines to translate abstract bytecode warnings and transaction logs into readable warnings and mitigation actions.
            </p>
            <ul className="text-xs font-mono text-cyber-violet space-y-2 pt-2">
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-pink" /> Actionable Mitigation Lists</li>
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-pink" /> Heuristic Behavior Synthesis</li>
              <li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-cyber-pink" /> 3-Tier Color-Coded Risk Levels</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="glass-panel p-10 border border-cyber-cyan/30 text-center relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyber-cyan/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyber-purple/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Secure Your Crypto Investments Today</h2>
          <p className="text-sm text-cyber-muted leading-relaxed">
            Protect your keys from malicious signatures, honeypots, and token drainers. Test any smart contract or transaction routing wallet instantly.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => onQuickScan("0x34567890abcdef1234567890abcdef1234567890", "contract")}
              className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-bg font-extrabold text-sm px-8 py-3.5 rounded-xl hover:opacity-95 shadow-glow-cyan flex items-center justify-center space-x-2 mx-auto transition-all"
            >
              <span>Scan Test Honeypot Contract</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
