
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Brain, 
  Wand2, 
  Layout, 
  X, 
  Loader2, 
  MessageCircle, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeWhiteboard, generateMindmapStructure, generateAIAssistance } from '../services/geminiService';
import { Element } from '../types';

interface AIPanelProps {
  elements: Element[];
  setElements: (elements: Element[]) => void;
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ elements, setElements, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [report, suggestions]);

  const handleAudit = async () => {
    setLoading(true);
    setActiveTab('analysis');
    try {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error("Canvas not found");
      const imageData = canvas.toDataURL('image/png');
      
      const analysis = await analyzeWhiteboard(imageData, elements);
      setReport(analysis);
    } catch (error) {
      setReport("## Analysis Failed\nPlease ensure your API Key is valid and you have elements on the board.");
    } finally {
      setLoading(false);
    }
  };

  const handleSmartChat = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const aiResponse = await generateAIAssistance(prompt, elements);
      setSuggestions(aiResponse);
      setPrompt('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addSuggestionToBoard = (sug: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newEl: Element = {
      id,
      type: sug.type as any || 'sticky',
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 400,
      width: sug.type === 'sticky' ? 220 : 180,
      height: sug.type === 'sticky' ? 220 : 80,
      text: sug.label,
      color: sug.color || '#FFD541',
      strokeWidth: 2,
      opacity: 1
    };
    setElements([...elements, newEl]);
    // Remove suggestion from list
    setSuggestions(prev => prev.filter(s => s.label !== sug.label));
  };

  return (
    <motion.div 
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="w-[440px] bg-[#111] border-l border-white/10 flex flex-col h-full z-40 relative shadow-2xl"
    >
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 animate-pulse" />
             <Sparkles className="w-6 h-6 text-indigo-400 relative z-10" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg tracking-tight">Nexus AI Analyst</h2>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">v3.5 Enterprise</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
          <X className="w-5 h-5 text-white/40" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-8 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'chat' ? 'text-white' : 'text-white/20'}`}
        >
          Assistant
          {activeTab === 'chat' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'analysis' ? 'text-white' : 'text-white/20'}`}
        >
          Board Audit
          {activeTab === 'analysis' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'analysis' ? (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {!report && !loading && (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <TrendingUp className="w-10 h-10 text-white/10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-bold">No Audit Found</h3>
                    <p className="text-white/40 text-sm">Run a deep-scan to get architectural and strategic insights.</p>
                  </div>
                  <button 
                    onClick={handleAudit}
                    className="px-8 py-4 bg-white text-black font-black uppercase rounded-2xl hover:scale-105 transition-all shadow-xl"
                  >
                    Generate Board Audit
                  </button>
                </div>
              )}

              {loading && (
                <div className="py-12 flex flex-col items-center gap-6">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                  <div className="text-center space-y-2">
                    <p className="text-white font-bold animate-pulse">Consulting Gemini 3 Pro...</p>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Reasoning through visual nodes</p>
                  </div>
                </div>
              )}

              {report && (
                <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed font-medium">
                  {report.split('\n').map((line, i) => {
                    if (line.startsWith('##') || line.startsWith('**')) {
                       return <h3 key={i} className="text-white font-black mt-6 mb-2 uppercase text-xs tracking-widest text-indigo-400">{line.replace(/[#*]/g, '')}</h3>;
                    }
                    return <p key={i} className="mb-2">{line}</p>;
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-4">
                <div className="flex items-center gap-3">
                   <MessageCircle className="w-5 h-5 text-indigo-400" />
                   <h4 className="text-sm font-black uppercase tracking-widest text-white/60">Creative Prompt</h4>
                </div>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'Suggest 3 risks for this project' or 'Help me brainstorm hiring steps'..."
                  className="w-full bg-transparent border-none outline-none text-white text-lg font-bold placeholder:text-white/10 resize-none h-24"
                />
                <button 
                  onClick={handleSmartChat}
                  disabled={loading || !prompt}
                  className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/5 disabled:text-white/20 text-white font-black uppercase rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  Generate Ideas
                </button>
              </div>

              {/* Suggestions List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {suggestions.map((sug, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-[#1A1A1A] border border-white/5 p-5 rounded-[24px] hover:border-white/20 transition-all flex items-start justify-between"
                    >
                      <div className="space-y-2 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sug.color }} />
                           <h5 className="font-bold text-white leading-tight">{sug.label}</h5>
                        </div>
                        <p className="text-xs text-white/30 font-medium leading-relaxed">{sug.reason}</p>
                      </div>
                      <button 
                        onClick={() => addSuggestionToBoard(sug)}
                        className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-8 bg-[#0a0a0a] border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Neural Link Active</span>
          </div>
          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Model 3 Pro Flash</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AIPanel;
