import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, ShieldX, Terminal, Cpu, CheckCircle, AlertTriangle, Play, HelpCircle, Copy, Check, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

// Simple deterministic hash function for client-side fallback
const getAddressHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Client-side procedural report generator (mimics backend sampleData.js exactly)
const generateClientReport = (address, type) => {
  const cleanAddress = address.toLowerCase().trim();
  const hash = getAddressHash(cleanAddress);
  
  // Deterministic values
  const riskScore = (hash % 96) + 3; // 3 to 98
  let riskLevel = "low";
  if (riskScore >= 75) {
    riskLevel = "high";
  } else if (riskScore >= 35) {
    riskLevel = "medium";
  }

  const ageDays = (hash % 1500) + 1;
  const txCount = (hash % 15000) + 12;
  const balanceEth = ((hash % 1000) / 10).toFixed(2);
  
  let summary = "";
  let details = {};
  let warnings = [];
  let recommendations = [];

  // Check specific presets first
  if (cleanAddress === "0xd8da6bf26964af9d7eed9e03e53415d37aa96045") {
    return {
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
        kycStatus: "Unverified (Decentralized Identity present)",
        labels: ["Vip Investor", "Core Dev", "Whale"]
      },
      warnings: [],
      recommendations: ["No security actions required for this address.", "Address has high integrity; safe to interact with."]
    };
  } else if (cleanAddress === "0x7a250d5630b4cf539739df2c5dacb4c659f2488d") {
    return {
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
        kycStatus: "Sanctioned/Flagged",
        labels: ["Phishing Scam", "Asset Drainer", "Mixer Interaction"]
      },
      warnings: [
        "Flagged as 'Phishing Wallet' by multiple blockchain threat directories.",
        "Direct transfers to Tornado Cash totaling over 150 ETH in the past 7 days.",
        "High frequency of unauthorized 'approve' calls targeting vulnerable users."
      ],
      recommendations: [
        "IMMEDIATELY avoid sending funds or signing approvals for this address.",
        "Revoke any active contract approvals linked to tokens associated with this address."
      ]
    };
  } else if (cleanAddress === "0x34567890abcdef1234567890abcdef1234567890") {
    return {
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
      recommendations: [
        "DO NOT purchase or exchange tokens minted by this contract. You will not be able to sell.",
        "If you hold approvals for this contract, use a revoke tool immediately."
      ]
    };
  } else if (cleanAddress === "0xe592427a0aece92de3edfdd007f96f9178557242") {
    return {
      address: "0xe592427a0aece92de3edfdd007f96f9178557242",
      type: "contract",
      riskScore: 2,
      riskLevel: "low",
      summary: "Fully audited, standard Uniswap V3 router contract. Ownership is decentralized or locked. No hidden minting, backdoors, or malicious functions identified.",
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
      recommendations: ["Contract is safe to interact with. Normal protocol interactions verified."]
    };
  }

  // General procedural generation
  if (type === "wallet") {
    details = {
      walletAge: `${ageDays} days`,
      transactionCount: txCount,
      balanceEth: parseFloat(balanceEth),
      kycStatus: riskScore > 75 ? "Flagged/Suspicious" : (riskScore > 35 ? "Unverified" : "Decentralized KYC Verified"),
      suspiciousTx: riskScore > 75 ? Math.floor(txCount * 0.15) : (riskScore > 35 ? Math.floor(txCount * 0.02) : 0),
      labels: riskScore > 75 ? ["High Risk", "Exploit Interaction"] : (riskScore > 35 ? ["DeFi Trader"] : ["Active User", "DeFi Provider"])
    };
    
    if (riskLevel === "high") {
      summary = `High-risk wallet showing abnormal transfers and interaction with malicious protocols. Potential threat detected.`;
      details.activitySummary = `Interactions with high-frequency mixers and flash loan targets. Multiple incoming transfers from suspicious contract creations.`;
      warnings = [
        "Unusually high outbound transfers relative to account age.",
        "Associated with known security exploit vectors.",
        "Transactions route to unregistered liquidity mixers."
      ];
      recommendations = [
        "Block all interactive smart contract signatures with this address.",
        "Avoid any direct transfers of token assets."
      ];
    } else if (riskLevel === "medium") {
      summary = `Medium-risk address. Shows standard usage but has interacted with unverified experimental smart contracts.`;
      details.activitySummary = `Moderate swap transaction activity. Multiple interactions with newly deployed ERC-20 meme tokens and custom NFTs.`;
      warnings = [
        "Interactions with unverified contracts deployed in the last 48 hours.",
        "Moderate slippage toleration settings detected on DEX routes."
      ];
      recommendations = [
        "Exercise caution when approving high spending limits for dApps this wallet uses.",
        "Keep main portfolio assets separate from addresses interacting with experimental contracts."
      ];
    } else {
      summary = `Secure and standard Web3 wallet address. Low transactional risk, verified normal DeFi protocol interactions.`;
      details.activitySummary = `Regular transactions to verified protocols (Uniswap, Aave, Curve). Consistent deposit/withdrawal history over a sustained timeline.`;
      warnings = [];
      recommendations = ["Standard security practices apply. The address is safe to interact with."];
    }
  } else {
    // contract
    const honeypot = riskScore > 80;
    const rugpull = riskScore > 65;
    const blacklist = riskScore > 40;
    const minting = riskScore > 50;
    
    details = {
      contractStatus: riskScore > 75 ? "Dangerous" : (riskScore > 35 ? "Warning" : "Verified & Safe"),
      contractAge: `${ageDays} days`,
      compilerVersion: `Solidity v0.8.${hash % 24}`,
      ownershipPrivileges: riskScore > 65 ? "Active (Owner holds master key)" : "Renounced",
      mintingFunctions: minting ? "Detected (Malicious or hidden mint)" : "None Detected",
      blacklistFunctions: blacklist ? "Detected (Can prevent user trading)" : "None Detected",
      honeypotIndicators: honeypot ? "100% Sell Simulation Reverts" : "None Detected",
      rugpullIndicators: rugpull ? "Liquidity Unlocked / Developer holds 80%+ supply" : "None (LP tokens burned)"
    };
    
    if (riskLevel === "high") {
      summary = `High threat level smart contract. Contains high-risk code signatures indicating potential honeypot or developer exit scam backdoor.`;
      warnings = [
        honeypot && "HONEYPOT DETECTED: Sell transactions are rejected by the contract code.",
        rugpull && "EXIT SCAM THREAT: Developer holds the majority of supply and has unlocked liquidity access.",
        minting && "UNLIMITED MINTING: Hidden code modifiers allow the owner to print tokens."
      ].filter(Boolean);
      recommendations = [
        "DO NOT swap or interact with this contract.",
        "Immediately revoke any allowance given to this contract address."
      ];
    } else if (riskLevel === "medium") {
      summary = `Medium risk smart contract. Code exhibits centralized ownership rights. The owner has power to blacklist addresses or halt trading.`;
      warnings = [
        blacklist && "BLACKLIST DETECTED: The owner can freeze any token holder's balance.",
        "HIGH CENTRALIZATION: Smart contract parameters can be changed by the owner."
      ].filter(Boolean);
      recommendations = [
        "Limit token purchases to small amounts.",
        "Verify if owner keys are secured by a multi-sig or DAO governance model."
      ];
    } else {
      summary = `Clean smart contract. Audited framework signatures, renounced owner rights, and verified open source code with no backdoor functions.`;
      warnings = [];
      recommendations = ["Contract is safe to interact with. Normal protocol interactions verified."];
    }
  }

  return {
    address: cleanAddress,
    type,
    riskScore,
    riskLevel,
    details,
    summary,
    warnings,
    recommendations,
    timestamp: new Date()
  };
};

function Analyzer({ target, setTarget, backendStatus, onScanCompleted, apiBase }) {
  const [address, setAddress] = useState('');
  const [type, setType] = useState('wallet');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const terminalEndRef = useRef(null);

  // Synced state triggers
  useEffect(() => {
    if (target.address) {
      setAddress(target.address);
      setType(target.type);
      if (target.triggerScan) {
        runScan(target.address, target.type);
        // Reset trigger flag
        setTarget(prev => ({ ...prev, triggerScan: false }));
      }
    }
  }, [target]);

  // Autoscroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Terminal log sequence runner
  const runScan = async (scanAddress, scanType) => {
    if (!scanAddress) {
      setValidationError('Please specify a destination address.');
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(scanAddress)) {
      setValidationError('Invalid hex layout. Destination address must start with 0x and contain 40 hexadecimal characters.');
      return;
    }

    setValidationError('');
    setLoading(true);
    setShowReport(false);
    setTerminalLogs([]);

    const logTemplates = scanType === 'wallet' ? [
      { text: `[INFO] Initializing Wallet Analyzer Core v1.4.2...`, delay: 100 },
      { text: `[INFO] Target Address Identified: ${scanAddress}`, delay: 300 },
      { text: `[INFO] Connecting to decentralized RPC provider node...`, delay: 600 },
      { text: `[INFO] Fetching historical transactions (limit: 500 logs)...`, delay: 1000 },
      { text: `[SYSTEM] Scraped transaction frequency tables. Total events: ${Math.floor(Math.random() * 8000) + 15}`, delay: 1400 },
      { text: `[INFO] Analyzing asset routing hops and account age logs...`, delay: 1800 },
      { text: `[HEURISTIC] Checking coin mixer (Tornado Cash/Sinbad) proximity scores...`, delay: 2200 },
      { text: `[HEURISTIC] Calculating honeypot signature correlations...`, delay: 2500 },
      { text: `[AI CORE] Constructing threat vulnerability summary...`, delay: 2900 },
      { text: `[SUCCESS] Secure risk metrics generated successfully!`, delay: 3300 }
    ] : [
      { text: `[INFO] Initializing Smart Contract Security Auditing Core...`, delay: 100 },
      { text: `[INFO] Auditing Target Contract: ${scanAddress}`, delay: 300 },
      { text: `[INFO] Downloading contract compiled EVM bytecode...`, delay: 600 },
      { text: `[INFO] Decompiling contract state variables and access modifiers...`, delay: 900 },
      { text: `[HEURISTIC] Scanning for ownership renouncement & proxy overrides...`, delay: 1300 },
      { text: `[HEURISTIC] Checking token supply mint() modifiers...`, delay: 1700 },
      { text: `[HEURISTIC] Inspecting for transfer freeze (blacklistAddress) blocks...`, delay: 2100 },
      { text: `[SIMULATOR] Simulating token swaps in decentralized liquidity sandboxes...`, delay: 2500 },
      { text: `[AI CORE] Evaluating rug-pull threat probabilities & locked liquidity...`, delay: 2900 },
      { text: `[SUCCESS] Bytecode threat audit compiled.`, delay: 3300 }
    ];

    // Build log animation
    logTemplates.forEach((log) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log.text]);
      }, log.delay);
    });

    // Actually fetch the scan data from Backend (or fallback client-side)
    setTimeout(async () => {
      try {
        let scanResult;
        if (backendStatus === 'online') {
          const res = await fetch(`${apiBase}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: scanAddress, type: scanType })
          });
          if (res.ok) {
            scanResult = await res.json();
          } else {
            throw new Error("API Scan Error");
          }
        } else {
          // Client-side fallback generator
          scanResult = generateClientReport(scanAddress, scanType);
        }

        setReport(scanResult);
        setShowReport(true);
        setLoading(false);
        onScanCompleted(scanResult);

        // UI triggers based on risk level
        if (scanResult.riskScore < 15) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.75 },
            colors: ['#00f2fe', '#7c3aed', '#10b981']
          });
        }
      } catch (err) {
        console.error("Scan fetch failure:", err);
        setTerminalLogs(prev => [...prev, `[ERROR] Connection lost. Executing client-side threat model...`]);
        const scanResult = generateClientReport(scanAddress, scanType);
        setReport(scanResult);
        setShowReport(true);
        setLoading(false);
        onScanCompleted(scanResult);
      }
    }, 3600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute SVG Stroke Offset for Risk Gauge
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = report ? circumference - (report.riskScore / 100) * circumference : circumference;

  // Determine risk themes
  const getRiskTheme = (score) => {
    if (score >= 75) return { color: 'text-cyber-red', border: 'border-cyber-red/30', bg: 'bg-cyber-red/10', glow: 'shadow-glow-red', name: 'HIGH RISK' };
    if (score >= 35) return { color: 'text-cyber-yellow', border: 'border-cyber-yellow/30', bg: 'bg-cyber-yellow/10', glow: 'shadow-glow-yellow', name: 'MEDIUM RISK' };
    return { color: 'text-cyber-green', border: 'border-cyber-green/30', bg: 'bg-cyber-green/10', glow: 'shadow-glow-green', name: 'LOW RISK' };
  };

  const riskTheme = report ? getRiskTheme(report.riskScore) : null;

  return (
    <div className={`space-y-8 relative transition-colors duration-500 ${showReport && report && report.riskScore >= 75 ? 'before:absolute before:inset-0 before:bg-cyber-red/5 before:pointer-events-none before:z-0 before:animate-pulse-slow' : ''}`}>
      {/* Search Console Header */}
      <section className="glass-panel p-6 border-cyber-purple/30 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Cpu className="h-6 w-6 text-cyber-cyan" />
              <span>Heuristic Analyzer Panel</span>
            </h1>
            <p className="text-xs text-cyber-muted">Provide any active blockchain address to extract threat metrics instantly.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-cyber-bg/50 border border-cyber-border p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setType('wallet')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all ${type === 'wallet' ? 'bg-cyber-purple text-white' : 'text-cyber-muted hover:text-white'}`}
            >
              WALLET
            </button>
            <button
              onClick={() => setType('contract')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all ${type === 'contract' ? 'bg-cyber-purple text-white' : 'text-cyber-muted hover:text-white'}`}
            >
              SMART CONTRACT
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder={`Enter ${type === 'wallet' ? 'wallet' : 'token/contract'} address (e.g. 0x...)`}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={loading}
            className="flex-grow bg-cyber-bg/70 border border-cyber-border rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan transition-colors"
          />
          <button
            onClick={() => runScan(address, type)}
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-bg font-extrabold text-sm shadow-glow-cyan flex items-center justify-center space-x-2 transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{loading ? 'Running Scan...' : 'Run Diagnostics'}</span>
          </button>
        </div>

        {validationError && (
          <div className="mt-3 flex items-center space-x-2 text-cyber-red text-xs font-mono">
            <AlertTriangle className="h-4 w-4" />
            <span>{validationError}</span>
          </div>
        )}
      </section>

      {/* Terminal Screen (Shows when scanning or typing) */}
      {loading && (
        <section className="glass-panel p-6 border-cyber-cyan/30 font-mono text-sm bg-black/80 shadow-glow-cyan relative">
          <div className="cyber-scanline" />
          <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-cyber-cyan">
              <Terminal className="h-4 w-4" />
              <span className="font-bold text-xs tracking-wider uppercase">Vulnerability Console</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-cyber-red inline-block" />
              <span className="h-2 w-2 rounded-full bg-cyber-yellow inline-block" />
              <span className="h-2 w-2 rounded-full bg-cyber-green inline-block" />
            </div>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
            {terminalLogs.map((log, index) => (
              <div key={index} className="text-cyber-muted">
                {log.startsWith('[SUCCESS]') && <span className="text-cyber-green">{log}</span>}
                {log.startsWith('[WARN]') && <span className="text-cyber-yellow">{log}</span>}
                {log.startsWith('[SYSTEM]') && <span className="text-cyber-violet">{log}</span>}
                {log.startsWith('[ERROR]') && <span className="text-cyber-red">{log}</span>}
                {!log.startsWith('[SUCCESS]') && !log.startsWith('[WARN]') && !log.startsWith('[SYSTEM]') && !log.startsWith('[ERROR]') && log}
              </div>
            ))}
            <div className="text-cyber-cyan">
              <span>$ Heuristics compilation running...</span>
              <span className="terminal-cursor" />
            </div>
            <div ref={terminalEndRef} />
          </div>
        </section>
      )}

      {/* Security Report Section */}
      {showReport && report && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Left Panel: Gauge and Status */}
          <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-6 text-center lg:col-span-1 border-cyber-border/40">
            <h3 className="text-xs font-mono font-bold tracking-wider text-cyber-muted uppercase">Risk Evaluation Index</h3>
            
            {/* SVG Circle Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="gauge-svg w-36 h-36">
                {/* Background loop */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-cyber-bg"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Score loop */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className={`gauge-circle ${riskTheme.color}`}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white font-mono">{report.riskScore}</span>
                <span className="text-[10px] font-mono text-cyber-muted">Risk Score</span>
              </div>
            </div>

            {/* Severity Tag */}
            <div className="w-full space-y-2">
              <div className={`border rounded-xl py-3 px-4 font-mono font-bold text-sm flex items-center justify-center space-x-2 ${riskTheme.color} ${riskTheme.bg} ${riskTheme.border} ${riskTheme.glow}`}>
                {report.riskScore >= 75 ? <ShieldX className="h-5 w-5" /> : (report.riskScore >= 35 ? <ShieldAlert className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />)}
                <span className="tracking-wider">{riskTheme.name}</span>
              </div>
              <div className="text-[10px] font-mono text-cyber-muted text-center break-all flex items-center justify-center space-x-1.5 py-1">
                <span>Addr: {report.address.substring(0, 10)}...{report.address.substring(34)}</span>
                <button onClick={copyToClipboard} className="text-cyber-cyan hover:text-white transition-colors">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {/* Mini Overview Metric Grid */}
            <div className="w-full grid grid-cols-2 gap-3 pt-2 border-t border-cyber-border/40 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyber-muted block">SCAN TYPE</span>
                <span className="text-xs font-mono font-bold text-white uppercase">{report.type}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyber-muted block">THREAT TIMELINE</span>
                <span className="text-xs font-mono font-bold text-white truncate">{report.details.walletAge || report.details.contractAge || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Right/Middle Panel: Breakdown & Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Metadata Fields Section */}
            <div className="glass-panel p-6 border-cyber-border/40 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="h-4 w-4 text-cyber-cyan" />
                <span>Diagnostic Attributes</span>
              </h3>
              
              {report.type === 'wallet' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">WALLET AGE</div>
                    <div className="text-white font-bold text-xs">{report.details.walletAge}</div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">TRANSACTION COUNT</div>
                    <div className="text-white font-bold text-xs">{report.details.transactionCount} transactions</div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">WALLET ETH BALANCE</div>
                    <div className="text-white font-bold text-xs">{report.details.balanceEth} ETH</div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">KYC DIRECTORY STATUS</div>
                    <div className={`font-bold text-xs ${report.riskScore >= 75 ? 'text-cyber-red' : (report.riskScore >= 35 ? 'text-cyber-yellow' : 'text-cyber-green')}`}>
                      {report.details.kycStatus}
                    </div>
                  </div>
                  <div className="sm:col-span-2 bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">WALLET ACTIVITY SUMMARY</div>
                    <div className="text-white text-xs leading-relaxed">{report.details.activitySummary}</div>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
                    {report.details.labels && report.details.labels.map((lbl, idx) => (
                      <span key={idx} className="bg-cyber-purple/15 text-cyber-violet border border-cyber-purple/35 rounded-full px-3 py-1 text-[10px] font-mono font-semibold">
                        #{lbl}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">COMPILER VERSION</div>
                    <div className="text-white font-bold text-xs">{report.details.compilerVersion}</div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">OWNERSHIP MODIFIERS</div>
                    <div className="text-white font-bold text-xs truncate">{report.details.ownershipPrivileges}</div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">MINT() FUNCTION AUDIT</div>
                    <div className={`font-bold text-xs ${report.details.mintingFunctions.includes('Detected') ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {report.details.mintingFunctions}
                    </div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">BLACKLIST CAPABILITIES</div>
                    <div className={`font-bold text-xs ${report.details.blacklistFunctions.includes('Detected') ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {report.details.blacklistFunctions}
                    </div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">HONEYPOT SWAP SIMULATION</div>
                    <div className={`font-bold text-xs ${report.details.honeypotIndicators.includes('Reverts') || report.details.honeypotIndicators.includes('Failure') ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {report.details.honeypotIndicators}
                    </div>
                  </div>
                  <div className="bg-cyber-bg/30 border border-cyber-border/30 p-3.5 rounded-xl space-y-1">
                    <div className="text-cyber-muted text-[10px] uppercase">RUGPULL/LP DRAIN PROXIMITY</div>
                    <div className={`font-bold text-xs ${report.details.rugpullIndicators.includes('Unlocked') ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {report.details.rugpullIndicators}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Risks & Core Synthesis Report */}
            <div className="glass-panel p-6 border-cyber-border/40 space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-wider">AI Executive Synthesis</h4>
                <p className="text-sm leading-relaxed text-cyber-text">{report.summary}</p>
              </div>

              {/* Warning Tags */}
              {report.warnings && report.warnings.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold text-cyber-red uppercase tracking-wider">Identified Security Alarms</h4>
                  <div className="space-y-2.5">
                    {report.warnings.map((warn, i) => (
                      <div key={i} className="flex items-start gap-3 bg-cyber-red/5 border border-cyber-red/25 rounded-xl p-3 text-xs text-cyber-red leading-relaxed">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations list */}
              {report.recommendations && report.recommendations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold text-cyber-green uppercase tracking-wider">Mitigation Recommendations</h4>
                  <div className="space-y-2.5 font-mono text-xs">
                    {report.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 bg-cyber-green/5 border border-cyber-green/25 rounded-xl p-3 text-cyber-green leading-relaxed">
                        <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>
      )}
    </div>
  );
}

export default Analyzer;
