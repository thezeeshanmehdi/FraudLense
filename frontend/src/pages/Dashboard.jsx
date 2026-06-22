import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ShieldAlert, LayoutDashboard, Clock, Eye, AlertTriangle, 
  CheckCircle, Shield, Database, Trash2, ArrowUpRight, Copy, Check 
} from 'lucide-react';

function Dashboard({ stats, history, onRowClick, backendStatus, onResetData }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (e, addr, idx) => {
    e.stopPropagation(); // Stop row click trigger
    navigator.clipboard.writeText(addr);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 1. Prepare Chart Data for Area Chart (Scanner Activity Trends)
  // Let's create an array of last 7 scans or group them dynamically.
  // For visual consistency, if scan history is small, we will combine it with mock timeline logs
  const activityData = history.length > 0 
    ? [...history].reverse().slice(-7).map((scan, i) => ({
        name: `Scan #${i + 1}`,
        score: scan.riskScore,
        average: stats.avgRiskScore
      }))
    : [
        { name: 'Day 1', score: 20, average: 45 },
        { name: 'Day 2', score: 88, average: 45 },
        { name: 'Day 3', score: 4, average: 45 },
        { name: 'Day 4', score: 95, average: 45 },
        { name: 'Day 5', score: 12, average: 45 },
        { name: 'Day 6', score: 65, average: 45 },
        { name: 'Day 7', score: 48, average: 45 }
      ];

  // 2. Prepare Pie Chart Data (Risk Level Distribution)
  const pieData = [
    { name: 'Low Risk', value: stats.riskLevelDistribution.low || 1, color: '#10b981' },
    { name: 'Medium Risk', value: stats.riskLevelDistribution.medium || 0, color: '#fbbf24' },
    { name: 'High Risk', value: stats.riskLevelDistribution.high || 1, color: '#ef4444' }
  ];

  // Risk display helper
  const getRiskLabel = (score) => {
    if (score >= 75) return { text: 'High Risk', color: 'text-cyber-red bg-cyber-red/10 border-cyber-red/30' };
    if (score >= 35) return { text: 'Med Risk', color: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30' };
    return { text: 'Low Risk', color: 'text-cyber-green bg-cyber-green/10 border-cyber-green/30' };
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-cyber-purple" />
            <span>Threat Monitoring Dashboard</span>
          </h1>
          <p className="text-xs text-cyber-muted">Aggregated diagnostics, threat distribution analytics, and history feeds.</p>
        </div>
        
        <button 
          onClick={onResetData}
          className="flex items-center space-x-2 px-4 py-2 border border-cyber-border rounded-xl text-xs font-mono text-cyber-violet hover:text-white hover:bg-cyber-purple/15 transition-all"
        >
          <Database className="h-4 w-4" />
          <span>Reset/Seed Engine Data</span>
        </button>
      </section>

      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Total Scans */}
        <div className="glass-panel p-5 space-y-3 relative overflow-hidden border-cyber-border/40">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyber-muted tracking-wider uppercase">Scans Run</span>
            <div className="p-2 bg-cyber-cyan/15 border border-cyber-cyan/30 rounded-lg">
              <Database className="h-4 w-4 text-cyber-cyan" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-white font-mono">{stats.totalScans}</div>
            <div className="text-[10px] text-cyber-muted font-mono">Blockchain queries executed</div>
          </div>
        </div>

        {/* KPI 2: Average Risk */}
        <div className="glass-panel p-5 space-y-3 relative overflow-hidden border-cyber-border/40">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyber-muted tracking-wider uppercase">Average Risk Index</span>
            <div className="p-2 bg-cyber-purple/15 border border-cyber-purple/30 rounded-lg">
              <Shield className="h-4 w-4 text-cyber-purple" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-extrabold font-mono ${stats.avgRiskScore >= 75 ? 'text-cyber-red' : (stats.avgRiskScore >= 35 ? 'text-cyber-yellow' : 'text-cyber-green')}`}>
              {stats.avgRiskScore}/100
            </div>
            <div className="text-[10px] text-cyber-muted font-mono">Mean contract/wallet threat level</div>
          </div>
        </div>

        {/* KPI 3: Suspicious Wallets & High Risk Contracts */}
        <div className="glass-panel p-5 space-y-3 relative overflow-hidden border-cyber-border/40">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyber-muted tracking-wider uppercase">Vulnerabilities Detected</span>
            <div className="p-2 bg-cyber-pink/15 border border-cyber-pink/30 rounded-lg">
              <ShieldAlert className="h-4 w-4 text-cyber-pink" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-cyber-pink font-mono">
              {stats.suspiciousWallets + stats.highRiskContracts}
            </div>
            <div className="text-[10px] text-cyber-muted font-mono">Scams, honeypots & flags caught</div>
          </div>
        </div>

        {/* KPI 4: Safe Assets */}
        <div className="glass-panel p-5 space-y-3 relative overflow-hidden border-cyber-border/40">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyber-muted tracking-wider uppercase">Safe Audited Shields</span>
            <div className="p-2 bg-cyber-green/15 border border-cyber-green/30 rounded-lg">
              <CheckCircle className="h-4 w-4 text-cyber-green" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-cyber-green font-mono">{stats.safeWallets}</div>
            <div className="text-[10px] text-cyber-muted font-mono">Low-risk addresses logged</div>
          </div>
        </div>

      </section>

      {/* Analytics Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Scanner Threat History (Area Chart) */}
        <div className="glass-panel p-6 border-cyber-border/40 lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Threat Vector Activity Feed</h3>
            <p className="text-[10px] text-cyber-muted font-mono">Scan risk index progression compared to system average.</p>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 8, 28, 0.95)', 
                    borderColor: 'rgba(124, 58, 237, 0.4)', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: 'Fira Code',
                    fontSize: '11px'
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Risk Score" />
                <Area type="monotone" dataKey="average" stroke="#00f2fe" strokeWidth={1} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorAvg)" name="Overall Mean" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Threat segments distribution (Pie Chart) */}
        <div className="glass-panel p-6 border-cyber-border/40 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Risk Level Distribution</h3>
            <p className="text-[10px] text-cyber-muted font-mono">Distribution profile across low, medium, and high threats.</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 8, 28, 0.95)',
                    borderColor: 'rgba(124, 58, 237, 0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: 'Fira Code',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-mono text-cyber-muted uppercase">Scan Counts</span>
              <span className="text-xl font-extrabold text-white font-mono">{stats.totalScans}</span>
            </div>
          </div>

          {/* Pie Legends */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            {pieData.map((d, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-white font-bold">{d.value}</span>
                <span className="text-cyber-muted text-[9px]">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Scans History Table */}
      <section className="glass-panel border-cyber-border/40 overflow-hidden">
        <div className="p-6 border-b border-cyber-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cyber-panel/20">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyber-cyan" />
              <span>Recent Diagnostic Log Records</span>
            </h3>
            <p className="text-[10px] text-cyber-muted font-mono">The historical queue of scanning assessments run on FraudLens.</p>
          </div>
          <span className="text-[10px] font-mono text-cyber-muted self-start sm:self-center bg-cyber-bg px-2.5 py-1 border border-cyber-border rounded">
            DB Status: {backendStatus === 'online' ? 'LIVE MONGO' : 'RECOVERY BUFFER'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-cyber-border/40 text-cyber-muted bg-cyber-bg/30">
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[9px]">Timestamp</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[9px]">Blockchain Address</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[9px]">Analyzer Type</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[9px] text-center">Threat Index</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[9px]">Classification</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-[9px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/20">
              {history.length > 0 ? (
                history.map((scan, idx) => {
                  const labelStyle = getRiskLabel(scan.riskScore);
                  return (
                    <tr 
                      key={idx}
                      onClick={() => onRowClick(scan.address, scan.type)}
                      className="hover:bg-cyber-purple/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 text-cyber-muted text-[10px]">
                        {new Date(scan.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-semibold text-white group-hover:text-cyber-cyan transition-colors flex items-center space-x-2">
                        <span className="hidden sm:inline">{scan.address}</span>
                        <span className="sm:hidden">{scan.address.substring(0, 10)}...{scan.address.substring(34)}</span>
                        <button 
                          onClick={(e) => handleCopy(e, scan.address, idx)}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-cyber-muted hover:text-white"
                        >
                          {copiedIndex === idx ? <Check className="h-3.5 w-3.5 text-cyber-green" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-[9px] bg-cyber-bg border border-cyber-border rounded text-cyber-muted uppercase">
                          {scan.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold font-mono">
                        <span className={scan.riskScore >= 75 ? 'text-cyber-red' : (scan.riskScore >= 35 ? 'text-cyber-yellow' : 'text-cyber-green')}>
                          {scan.riskScore}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold ${labelStyle.color}`}>
                          {labelStyle.text}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-cyber-cyan group-hover:translate-x-1 transition-transform">
                        <ArrowUpRight className="h-4 w-4 ml-auto" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 px-6 text-center text-cyber-muted italic">
                    No scan telemetry records located. Input an address on the Analyzer panel to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
