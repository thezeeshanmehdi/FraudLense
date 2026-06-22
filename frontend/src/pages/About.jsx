import React from 'react';
import { Shield, ShieldCheck, Eye, Compass, User, Cpu } from 'lucide-react';

const TEAM = [
  {
    name: "Dr. Elena Vance",
    role: "Chief AI Heuristic Architect",
    desc: "Specialize in machine learning behavioral modeling for token transactional graphs. Previously security lead at core layer-1 nodes.",
    accent: "border-cyber-cyan/30 text-cyber-cyan bg-cyber-cyan/5 hover:border-cyber-cyan"
  },
  {
    name: "Marcus Thorne",
    role: "Lead Smart Contract Auditor",
    desc: "White-hat Solidity debugger. Discovered and reported over 12 high-severity zero-day bugs in leading DeFi protocols.",
    accent: "border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5 hover:border-cyber-purple"
  },
  {
    name: "Aria Sterling",
    role: "Blockchain Data Engineer",
    desc: "Expert in low-latency indexing of Ethereum and EVM-compatible chain events. Designing fast memory caching structures.",
    accent: "border-cyber-pink/30 text-cyber-pink bg-cyber-pink/5 hover:border-cyber-pink"
  }
];

function About() {
  return (
    <div className="space-y-16">
      {/* Overview Block */}
      <section className="glass-panel p-8 md:p-12 border-cyber-purple/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center space-x-1.5 text-cyber-cyan bg-cyber-cyan/10 px-3 py-1 rounded-full text-xs font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>Project Abstract</span>
            </span>
            <h2 className="text-3xl font-extrabold text-white">About FraudLens Project</h2>
            <p className="text-sm leading-relaxed text-cyber-muted">
              Web3 protocols are growing at unprecedented speeds, yet developers and traders face constant hazards. Smart contract backdoors, malicious airdrop wallets, and token exit scams cost blockchain participants billions annually. 
            </p>
            <p className="text-sm leading-relaxed text-cyber-muted">
              <strong>FraudLens</strong> was conceptualized as an Agentic AI Fraud Detection system. By combining deterministic bytecode pattern matching with predictive transaction-graph AI heuristics, FraudLens translates complex machine data into actionable, readable threat assessments.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20 border border-cyber-border relative group shadow-glow-purple">
              <div className="absolute inset-0 bg-cyber-bg/50 rounded-3xl pointer-events-none" />
              <Cpu className="h-32 w-32 text-cyber-cyan animate-pulse-slow relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Core Threat Containment Principles</h2>
          <p className="text-sm text-cyber-muted">Our core development aims to establish safer decentralized rails.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <div className="glass-panel p-6 border-cyber-border/40 space-y-4">
            <div className="p-2.5 bg-cyber-cyan/15 border border-cyber-cyan/30 rounded-xl w-fit">
              <Compass className="h-5 w-5 text-cyber-cyan" />
            </div>
            <h3 className="text-white font-bold text-sm">Automated Auditing</h3>
            <p className="text-xs text-cyber-muted leading-relaxed font-sans">
              Removing human bottlenecks in auditing. Our scanner is designed to instantly parse compiler targets, detecting logic holes and rugpull modifiers in milliseconds.
            </p>
          </div>

          <div className="glass-panel p-6 border-cyber-border/40 space-y-4">
            <div className="p-2.5 bg-cyber-purple/15 border border-cyber-purple/30 rounded-xl w-fit">
              <Eye className="h-5 w-5 text-cyber-purple" />
            </div>
            <h3 className="text-white font-bold text-sm">Actionable Summaries</h3>
            <p className="text-xs text-cyber-muted leading-relaxed font-sans">
              Providing clear explanations. Instead of dumping abstract transaction logs, we use structured summaries and risk ratings to empower even non-technical investors.
            </p>
          </div>

          <div className="glass-panel p-6 border-cyber-border/40 space-y-4">
            <div className="p-2.5 bg-cyber-pink/15 border border-cyber-pink/30 rounded-xl w-fit">
              <Shield className="h-5 w-5 text-cyber-pink" />
            </div>
            <h3 className="text-white font-bold text-sm">Adaptive Intelligence</h3>
            <p className="text-xs text-cyber-muted leading-relaxed font-sans">
              Evolving alongside hackers. Our heuristic models are continuously trained on newly discovered exploit payloads, such as flash loans, governance takeovers, and cross-chain bridges.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8 pb-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Heuristic Threat Research Team</h2>
          <p className="text-sm text-cyber-muted font-mono">The cybersecurity minds developing the FraudLens framework.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.map((member, idx) => (
            <div 
              key={idx}
              className={`glass-panel p-6 border transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between space-y-4 ${member.accent}`}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-cyber-bg border border-cyber-border rounded-xl">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{member.name}</h3>
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-80">{member.role}</div>
                  </div>
                </div>
                <p className="text-xs text-cyber-muted leading-relaxed font-sans">{member.desc}</p>
              </div>
              <span className="text-[10px] font-mono hover:underline cursor-pointer block pt-2 text-right">Research Portfolio &rarr;</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
