import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { Shield, LayoutDashboard, Search, FileText, Activity, Sun, Moon } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('fraudlens_theme') || 'dark');
  const [activeTab, setActiveTab] = useState('home');
  const [scanHistory, setScanHistory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalScans: 0,
    safeWallets: 0,
    suspiciousWallets: 0,
    highRiskContracts: 0,
    mediumRiskContracts: 0,
    avgRiskScore: 0,
    riskLevelDistribution: { low: 0, medium: 0, high: 0 }
  });

  // Share address and scanner type from Home/Dashboard to Analyzer
  const [analyzerTarget, setAnalyzerTarget] = useState({ address: '', type: 'wallet', triggerScan: false });

  // Fallback scanner state for when backend is offline
  const [backendStatus, setBackendStatus] = useState('checking');

  // Fetch scan history and statistics
  const fetchStatsAndHistory = async () => {
    try {
      // Check backend status
      const statusRes = await fetch('http://localhost:5000/').catch(() => null);
      if (statusRes && statusRes.ok) {
        setBackendStatus('online');

        // Fetch stats
        const statsRes = await fetch(`${API_BASE}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setDashboardStats(statsData);
        }

        // Fetch history
        const scansRes = await fetch(`${API_BASE}/scans`);
        if (scansRes.ok) {
          const scansData = await scansRes.json();
          setScanHistory(scansData);
        }
      } else {
        throw new Error('Backend offline');
      }
    } catch (err) {
      setBackendStatus('offline');
      // If backend is offline, compute client-side stats from local history
      // We will initialize the scan history with local storage if available, otherwise mock data
      const localHistory = localStorage.getItem('fraudlens_scans');
      let historyList = [];
      if (localHistory) {
        historyList = JSON.parse(localHistory);
      } else {
        // Import mock data to seed local history if empty
        const defaultSampleData = [
          {
            address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            type: "wallet",
            riskScore: 4,
            riskLevel: "low",
            summary: "Highly reputable long-standing Ethereum address associated with early development and major community contributions. Extremely active with zero suspicious connections.",
            details: {
              walletAge: "3,120 days (8.5 years)",
              transactionCount: 24905,
              activitySummary: "High activity (average 10-15 txs per day). Heavy interaction with top-tier liquidity pools, multi-sig vaults, and governance protocols.",
              suspiciousTx: 0,
              balanceEth: 1845.20,
              labels: ["Vip Investor", "Core Dev", "Whale"]
            },
            warnings: [],
            recommendations: ["No security actions required for this address.", "Address has high integrity; safe to interact with."],
            timestamp: new Date(Date.now() - 3600000 * 2)
          },
          {
            address: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
            type: "wallet",
            riskScore: 88,
            riskLevel: "high",
            summary: "This address has been flagged for phishing exploits, rapid asset drain distributions, and high interaction with coin mixing services. Suspicion of theft.",
            details: {
              walletAge: "14 days",
              transactionCount: 184,
              activitySummary: "Bursts of intense transfer activity followed by direct routing of incoming ERC-20 tokens to mixer protocols. Large inputs, immediate exits.",
              suspiciousTx: 22,
              balanceEth: 0.12,
              labels: ["Phishing Scam", "Asset Drainer", "Mixer Interaction"]
            },
            warnings: [
              "Flagged as 'Phishing Wallet' by multiple blockchain threat directories.",
              "Direct transfers to Tornado Cash totaling over 150 ETH in the past 7 days.",
              "High frequency of unauthorized 'approve' calls targeting vulnerable users."
            ],
            recommendations: ["IMMEDIATELY avoid sending funds or signing approvals for this address.", "Revoke any active contract approvals linked to tokens associated with this address."],
            timestamp: new Date(Date.now() - 3600000 * 5)
          },
          {
            address: "0x34567890abcdef1234567890abcdef1234567890",
            type: "contract",
            riskScore: 95,
            riskLevel: "high",
            summary: "Smart contract exhibits honeypot and rug-pull indicators. Buy tax is low, but sell functions are blocked for non-whitelist addresses. Developers hold hidden mint privileges.",
            details: {
              contractStatus: "Active",
              contractAge: "3 days",
              ownershipPrivileges: "Renounced (Owner has hidden backend multi-sig proxy control)",
              mintingFunctions: "Detected (hiddenMint() function can create unlimited tokens to non-public addresses)",
              blacklistFunctions: "Detected (blacklistAddress() block sell executions)",
              honeypotIndicators: "100% Sell Failure Rate during simulator execution",
              rugpullIndicators: "Liquidity is NOT locked. Developer holds 92% of the initial liquidity pool tokens in a non-multisig address.",
              compilerVersion: "Solidity v0.8.20"
            },
            warnings: [
              "SELL FUNCTION BLOCKED: Execution reverts for standard token holders (Honeypot).",
              "HIDDEN MINT PRIVILEGES: Owner or deployer can print tokens arbitrarily.",
              "UNLOCKED LIQUIDITY: 92% of Uniswap V2 LP tokens held in a personal address."
            ],
            recommendations: ["DO NOT purchase or exchange tokens minted by this contract.", "If you hold approvals for this contract, use a revoke tool immediately."],
            timestamp: new Date(Date.now() - 3600000 * 12)
          },
          {
            address: "0xe592427a0aece92de3edfdd007f96f9178557242",
            type: "contract",
            riskScore: 2,
            riskLevel: "low",
            summary: "Fully audited, standard Uniswap V3 router contract. Ownership is fully decentralized or locked. No hidden minting, backdoors, or malicious functions identified.",
            details: {
              contractStatus: "Verified & Audited",
              contractAge: "1,890 days",
              ownershipPrivileges: "No owner / Renounced",
              mintingFunctions: "None Detected",
              blacklistFunctions: "None Detected",
              honeypotIndicators: "None (Fully tested, millions of successful transactions)",
              rugpullIndicators: "Liquidity locked in verified smart contracts.",
              compilerVersion: "Solidity v0.7.6"
            },
            warnings: [],
            recommendations: ["Contract is safe to interact with. Normal protocol interactions verified."],
            timestamp: new Date(Date.now() - 3600000 * 24)
          }
        ];
        localStorage.setItem('fraudlens_scans', JSON.stringify(defaultSampleData));
        historyList = defaultSampleData;
      }

      setScanHistory(historyList);

      // Compute stats
      const total = historyList.length;
      const safe = historyList.filter(s => s.type === 'wallet' && s.riskLevel === 'low').length;
      const susp = historyList.filter(s => s.type === 'wallet' && s.riskLevel !== 'low').length;
      const highC = historyList.filter(s => s.type === 'contract' && s.riskLevel === 'high').length;
      const medC = historyList.filter(s => s.type === 'contract' && s.riskLevel === 'medium').length;
      const totalScore = historyList.reduce((acc, curr) => acc + curr.riskScore, 0);
      const avg = total > 0 ? Math.round(totalScore / total) : 0;

      const distribution = {
        low: historyList.filter(s => s.riskLevel === 'low').length,
        medium: historyList.filter(s => s.riskLevel === 'medium').length,
        high: historyList.filter(s => s.riskLevel === 'high').length,
      };

      setDashboardStats({
        totalScans: total,
        safeWallets: safe,
        suspiciousWallets: susp,
        highRiskContracts: highC,
        mediumRiskContracts: medC,
        avgRiskScore: avg,
        riskLevelDistribution: distribution
      });
    }
  };

  useEffect(() => {
    fetchStatsAndHistory();
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('fraudlens_theme', theme);
  }, [theme]);

  // Set target and switch view to Analyzer
  const handleQuickScan = (address, type) => {
    setAnalyzerTarget({ address, type, triggerScan: true });
    setActiveTab('analyzer');
  };

  // Callback when a new scan is successfully completed
  const handleScanCompleted = (newScan) => {
    // If backend is offline, update local storage history
    if (backendStatus === 'offline') {
      const updatedHistory = [newScan, ...scanHistory.filter(s => s.address.toLowerCase() !== newScan.address.toLowerCase())];
      localStorage.setItem('fraudlens_scans', JSON.stringify(updatedHistory));
      setScanHistory(updatedHistory);

      // Update statistics locally
      const total = updatedHistory.length;
      const safe = updatedHistory.filter(s => s.type === 'wallet' && s.riskLevel === 'low').length;
      const susp = updatedHistory.filter(s => s.type === 'wallet' && s.riskLevel !== 'low').length;
      const highC = updatedHistory.filter(s => s.type === 'contract' && s.riskLevel === 'high').length;
      const medC = updatedHistory.filter(s => s.type === 'contract' && s.riskLevel === 'medium').length;
      const totalScore = updatedHistory.reduce((acc, curr) => acc + curr.riskScore, 0);
      const avg = total > 0 ? Math.round(totalScore / total) : 0;

      setDashboardStats({
        totalScans: total,
        safeWallets: safe,
        suspiciousWallets: susp,
        highRiskContracts: highC,
        mediumRiskContracts: medC,
        avgRiskScore: avg,
        riskLevelDistribution: {
          low: updatedHistory.filter(s => s.riskLevel === 'low').length,
          medium: updatedHistory.filter(s => s.riskLevel === 'medium').length,
          high: updatedHistory.filter(s => s.riskLevel === 'high').length,
        }
      });
    } else {
      // Backend is online: refresh stats and history from API
      fetchStatsAndHistory();
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home onQuickScan={handleQuickScan} />;
      case 'analyzer':
        return (
          <Analyzer
            target={analyzerTarget}
            setTarget={setAnalyzerTarget}
            backendStatus={backendStatus}
            onScanCompleted={handleScanCompleted}
            apiBase={API_BASE}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            stats={dashboardStats}
            history={scanHistory}
            onRowClick={(address, type) => handleQuickScan(address, type)}
            backendStatus={backendStatus}
            onResetData={async () => {
              if (backendStatus === 'online') {
                await fetch(`${API_BASE}/seed`, { method: 'POST' });
              } else {
                localStorage.removeItem('fraudlens_scans');
              }
              fetchStatsAndHistory();
            }}
          />
        );
      case 'about':
        return <About />;
      default:
        return <Home onQuickScan={handleQuickScan} />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col justify-between selection:bg-cyber-purple selection:text-white">
      {/* SaaS Nav Header */}
      <header className="sticky top-0 z-40 w-full border-b border-cyber-border bg-cyber-bg/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple shadow-glow-purple flex items-center justify-center">
              <Shield className="h-6 w-6 text-cyber-bg" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-white">FRAUD<span className="text-cyber-cyan">LENS</span></span>
              <div className="text-[9px] font-mono tracking-widest text-cyber-purple uppercase font-bold">Agentic Threat Core</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2 bg-cyber-panel/50 border border-cyber-border p-1.5 rounded-full backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${activeTab === 'home'
                ? 'bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 shadow-glow-cyan'
                : 'text-cyber-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <Activity className="h-4 w-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setAnalyzerTarget(prev => ({ ...prev, triggerScan: false }));
                setActiveTab('analyzer');
              }}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${activeTab === 'analyzer'
                ? 'bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 shadow-glow-cyan'
                : 'text-cyber-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <Search className="h-4 w-4" />
              <span>Analyzer</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 shadow-glow-cyan'
                : 'text-cyber-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${activeTab === 'about'
                ? 'bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 shadow-glow-cyan'
                : 'text-cyber-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <FileText className="h-4 w-4" />
              <span>About Project</span>
            </button>
          </nav>

          {/* System status display */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-cyber-panel/80 border border-cyber-border text-cyber-cyan hover:text-white transition-all duration-300 shadow-glass cursor-pointer flex items-center justify-center"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <span className="hidden sm:inline-flex items-center space-x-2 bg-cyber-panel/80 border border-cyber-border px-3 py-1.5 rounded-lg text-xs font-mono text-cyber-muted">
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse-slow ${backendStatus === 'online' ? 'bg-cyber-green neon-glow-green' : (backendStatus === 'offline' ? 'bg-cyber-yellow neon-glow-yellow' : 'bg-cyber-cyan')}`} />
              <span>Core: {backendStatus === 'online' ? 'CONNECTED' : (backendStatus === 'offline' ? 'FALLBACK' : 'CONNECTING')}</span>
            </span>
            <button
              onClick={() => handleQuickScan("0x34567890abcdef1234567890abcdef1234567890", "contract")}
              className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-bg hover:opacity-90 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 shadow-glow-cyan"
            >
              LAUNCH MONITOR
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Nav Header (Fixed bottom for mobile accessibility) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-cyber-panel backdrop-blur-xl border border-cyber-border p-2 rounded-2xl flex items-center justify-around shadow-glass">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 text-xs ${activeTab === 'home' ? 'text-cyber-cyan' : 'text-cyber-muted'}`}>
          <Activity className="h-5 w-5" />
          <span>Home</span>
        </button>
        <button onClick={() => {
          setAnalyzerTarget(prev => ({ ...prev, triggerScan: false }));
          setActiveTab('analyzer');
        }} className={`flex flex-col items-center p-2 text-xs ${activeTab === 'analyzer' ? 'text-cyber-cyan' : 'text-cyber-muted'}`}>
          <Search className="h-5 w-5" />
          <span>Scan</span>
        </button>
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 text-xs ${activeTab === 'dashboard' ? 'text-cyber-cyan' : 'text-cyber-muted'}`}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('about')} className={`flex flex-col items-center p-2 text-xs ${activeTab === 'about' ? 'text-cyber-cyan' : 'text-cyber-muted'}`}>
          <FileText className="h-5 w-5" />
          <span>About</span>
        </button>
      </div>

      {/* Page Content Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {renderPage()}
      </main>

      {/* SaaS Footer */}
      <footer className="border-t border-cyber-border/40 bg-cyber-bg/30 py-6 mt-12 text-center text-xs text-cyber-muted font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div>
            &copy; 2026 FraudLens. By Zeeshan Mehdi (62616)
          </div>
          <div className="flex space-x-6 text-[10px]">
            <span className="flex items-center space-x-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyber-green inline-block animate-ping" /><span>Heuristic Database: v1.4.2</span></span>
            <span className="text-cyber-purple">Agentic Security Framework</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
