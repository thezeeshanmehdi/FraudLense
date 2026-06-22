import crypto from 'crypto';

// Predefined security database templates
export const sampleScans = [
  // 1. Safe Developer/Investor Wallet
  {
    address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // Vitalik.eth
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
    recommendations: [
      "No security actions required for this address.",
      "Address has high integrity; safe to interact with."
    ]
  },
  // 2. Suspicious Scam/Phishing Wallet
  {
    address: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", // Mock Scammer
    type: "wallet",
    riskScore: 88,
    riskLevel: "high",
    summary: "This address has been flagged for phishing exploits, rapid asset drain distributions, and high interaction with coin mixing services (e.g., Tornado Cash). Suspicion of theft.",
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
      "Flagged as 'Phishing Wallet' by multiple blockchain threat directories (Etherscan, Metamask).",
      "Direct transfers to Tornado Cash totaling over 150 ETH in the past 7 days.",
      "High frequency of unauthorized 'approve' calls targeting vulnerable users."
    ],
    recommendations: [
      "IMMEDIATELY avoid sending funds or signing approvals for this address.",
      "Revoke any active contract approvals linked to tokens associated with this address."
    ]
  },
  // 3. High-Risk Rug-pull/Honeypot Smart Contract
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
      rugpullIndicators: "Liquidity is NOT locked. Developer holds 92% of the initial liquidity pool tokens in a non-multisig wallet.",
      compilerVersion: "Solidity v0.8.20 (Unoptimized, contains debug backdoors)"
    },
    warnings: [
      "SELL FUNCTION BLOCKED: Execution reverts for standard token holders (Honeypot).",
      "HIDDEN MINT PRIVILEGES: Owner or deployer can print tokens arbitrarily.",
      "UNLOCKED LIQUIDITY: 92% of the Uniswap V2 LP tokens are held in a personal developer address, enabling instant withdrawal."
    ],
    recommendations: [
      "DO NOT purchase or exchange tokens minted by this contract. You will not be able to sell.",
      "If you hold approvals for this contract, use a revoke tool (e.g., Revoke.cash) immediately."
    ]
  },
  // 4. Safe/Verified Smart Contract (Uniswap Router example)
  {
    address: "0xe592427a0aece92de3edfdd007f96f9178557242", // Uniswap V3 Router
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
      compilerVersion: "Solidity v0.7.6 (Optimized, audited by Trail of Bits)"
    },
    warnings: [],
    recommendations: [
      "Highly secure system contract. Safe to interact, trade, and provide approvals."
    ]
  }
];

// Helper to generate deterministic simulated details based on address hash (procedural generator)
export function generateScanForAddress(addressStr, forcedType = null) {
  const cleanAddress = addressStr.toLowerCase().trim();
  
  // Use crypto to hash the address so the score is consistent for the same input
  const hash = crypto.createHash('sha256').update(cleanAddress).digest('hex');
  
  // Choose type: wallet or contract based on hash byte
  const typeByte = parseInt(hash.substring(0, 2), 16);
  const type = forcedType || (typeByte % 2 === 0 ? "wallet" : "contract");
  
  // Generate a deterministic risk score from 3 to 98
  const scoreByte = parseInt(hash.substring(2, 6), 16);
  const riskScore = (scoreByte % 96) + 3; // 3 to 98
  
  let riskLevel = "low";
  if (riskScore >= 75) {
    riskLevel = "high";
  } else if (riskScore >= 35) {
    riskLevel = "medium";
  }
  
  // Compute deterministic variables
  const ageDays = (scoreByte % 1500) + 1;
  const txCount = (parseInt(hash.substring(6, 12), 16) % 15000) + 12;
  const balanceEth = ((parseInt(hash.substring(12, 18), 16) % 1000) / 10).toFixed(2);
  
  let summary = "";
  let details = {};
  let warnings = [];
  let recommendations = [];
  
  if (type === "wallet") {
    details = {
      walletAge: `${ageDays} days`,
      transactionCount: txCount,
      balanceEth: parseFloat(balanceEth),
      kycStatus: riskScore > 75 ? "Flagged/Suspicious" : (riskScore > 35 ? "Unverified" : "Decentralized KYC Verified"),
      suspiciousTx: riskScore > 75 ? Math.floor(txCount * 0.15) : (riskScore > 35 ? Math.floor(txCount * 0.02) : 0)
    };
    
    if (riskLevel === "high") {
      summary = `High-risk wallet showing abnormal transfers and interaction with malicious protocols. Potential threat detected.`;
      details.activitySummary = `Interactions with high-frequency mixers and flash loan targets. Multiple incoming transfers from suspicious contract creations.`;
      details.labels = ["High Risk", "Exploit Interaction", "Mixer User"];
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
      details.labels = ["DeFi Trader", "Meme Speculator"];
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
      details.labels = ["Active User", "DeFi Liquidity Provider"];
      warnings = [];
      recommendations = [
        "Standard security practices apply. The address is safe to interact with."
      ];
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
      compilerVersion: `Solidity v0.8.${scoreByte % 24}`,
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
        rugpull && "EXIT SCAM THREAT: Developer holds the majority of token supply and has unlocked liquidity access.",
        minting && "UNLIMITED MINTING: Hidden code modifiers allow the owner to mint new tokens and dilute holders."
      ].filter(Boolean);
      recommendations = [
        "DO NOT swap or interact with this contract.",
        "Immediately revoke any allowance given to this contract address."
      ];
    } else if (riskLevel === "medium") {
      summary = `Medium risk smart contract. Code exhibits centralized ownership rights. The owner has power to blacklist addresses or halt trading.`;
      warnings = [
        blacklist && "BLACKLIST DETECTED: The owner can freeze any token holder's balance.",
        "HIGH CENTRALIZATION: Smart contract parameters can be changed by the owner without a timelock."
      ].filter(Boolean);
      recommendations = [
        "Limit token purchases to small amounts.",
        "Verify if owner keys are secured by a multi-sig or DAO governance model."
      ];
    } else {
      summary = `Clean smart contract. Audited framework signatures, renounced owner rights, and verified open source code with no backdoor functions.`;
      warnings = [];
      recommendations = [
        "Contract is safe to interact with. Normal protocol interactions verified."
      ];
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
}
