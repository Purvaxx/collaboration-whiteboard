
import React from 'react';
import { Database, ShieldCheck, Globe, Zap, Cpu, Code2, Network, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ArchitectureView: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-12 space-y-16">
      <div className="text-center space-y-6">
        <span className="bg-yellow-300 text-black px-4 py-1 rounded-full border-2 border-black font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Technical Specification v4.0
        </span>
        <h2 className="text-5xl font-black text-black tracking-tight uppercase">Infrastructure & Scale</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-xl font-medium">
          NexusBoard AI is built for massive enterprise scale, utilizing a hybrid CRDT engine and distributed AI nodes.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-600 font-black uppercase tracking-widest text-sm">
            <Globe className="w-6 h-6" /> Client Edge Tier
          </div>
          <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-indigo-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Code2 className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-black text-2xl text-black mb-4 uppercase">Web Engine</h3>
            <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
              React + WebGL engine for 120fps canvas rendering. Local-first CRDT logic handles sub-10ms conflict resolution.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">WebRTC</span>
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">WASM</span>
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">Y.js</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-sm">
            <Network className="w-6 h-6" /> Sync Mesh
          </div>
          <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-emerald-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-black text-2xl text-black mb-4 uppercase">Real-time Cluster</h3>
            <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
              Distributed WebSocket mesh scaled via Kubernetes. Redis Pub/Sub backplane for global state synchronization.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">Redis</span>
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">gRPC</span>
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">K8s</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center gap-3 text-rose-600 font-black uppercase tracking-widest text-sm">
            <Database className="w-6 h-6" /> Intelligence Hub
          </div>
          <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="bg-rose-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Cpu className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-black text-2xl text-black mb-4 uppercase">AI Reasoning</h3>
            <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
              Gemini 3 Pro integration for multimodal board analysis. Vector embeddings stored in pgvector for semantic retrieval.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">Gemini 3</span>
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">Pinecone</span>
              <span className="px-3 py-1 bg-slate-100 border-2 border-black rounded-lg text-[10px] font-black uppercase">Python</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="bg-black rounded-[40px] p-12 text-white border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4 text-emerald-400 font-black text-xl uppercase italic">
              <Lock className="w-8 h-8" /> Security Perimeter
            </div>
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              Military-grade AES-256 GCM encryption. NexusBoard supports Private Cloud Deployment (VPC) and BYOK (Bring Your Own Key) management via AWS KMS or Azure Key Vault.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-slate-800 px-6 py-3 rounded-2xl border-2 border-slate-700 text-sm font-black uppercase">SSO / SAML 2.0</div>
              <div className="bg-slate-800 px-6 py-3 rounded-2xl border-2 border-slate-700 text-sm font-black uppercase">GDPR Compliance</div>
              <div className="bg-slate-800 px-6 py-3 rounded-2xl border-2 border-slate-700 text-sm font-black uppercase">SOC2 Type II</div>
            </div>
          </div>
          <div className="w-64 h-64 bg-indigo-500 rounded-[32px] border-4 border-white flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] animate-pulse">
            <ShieldCheck className="w-32 h-32 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureView;
