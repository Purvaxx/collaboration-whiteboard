
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Activity, Database, Shield, Zap, Terminal, HardDrive, Cpu } from 'lucide-react';

const InfraDashboard: React.FC = () => {
  const [latency, setLatency] = useState(12);
  const [traffic, setTraffic] = useState([40, 45, 30, 55, 70, 65, 80]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 5) + 8);
      setTraffic(prev => [...prev.slice(1), Math.floor(Math.random() * 40) + 40]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-16 max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">System Status: Operational</p>
          <h2 className="text-5xl font-serif italic text-white">Cloud Infrastructure</h2>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-bold text-white/60">Node Alpha-1 Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Latency', val: `${latency}ms`, icon: Zap, color: 'text-yellow-400' },
          { label: 'CRDT Conflict Res', val: '99.99%', icon: Activity, color: 'text-indigo-400' },
          { label: 'Encrypted Persistence', val: 'Active', icon: Shield, color: 'text-emerald-400' },
          { label: 'Storage Usage', val: '1.2 TB', icon: HardDrive, color: 'text-pink-400' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-dark p-8 rounded-[40px] border border-white/5 space-y-4"
          >
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-dark p-10 rounded-[50px] border border-white/10 space-y-8">
          <div className="flex justify-between items-center">
             <h3 className="text-2xl font-serif italic">Traffic Distribution</h3>
             <Cpu className="w-6 h-6 text-white/20" />
          </div>
          <div className="h-48 flex items-end gap-2">
            {traffic.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400 rounded-t-xl"
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest px-2">
             <span>12:00</span>
             <span>14:00</span>
             <span>16:00</span>
             <span>18:00</span>
             <span>Now</span>
          </div>
        </div>

        <div className="glass-dark p-10 rounded-[50px] border border-white/10 space-y-6 flex flex-col">
          <div className="flex items-center gap-3">
             <Terminal className="w-5 h-5 text-emerald-400" />
             <h3 className="text-xl font-bold">Runtime Logs</h3>
          </div>
          <div className="flex-1 font-mono text-[10px] text-white/40 space-y-3 overflow-hidden">
            <p className="text-emerald-400/60">[SYS] Sync engine initialized...</p>
            <p>[NET] Incoming gRPC connection from cluster-west</p>
            <p>[AUTH] Session validated for user: Purva</p>
            <p className="text-yellow-400/60">[AI] Gemini reasoning node warmup complete</p>
            <p>[DB] Snapshot persistent commit @ 0x88f2</p>
            <p className="text-emerald-400/60">[SYS] Heartbeat OK</p>
          </div>
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Export Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfraDashboard;
