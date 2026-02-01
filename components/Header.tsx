
import React from 'react';
import { Share2, Users, Cpu, Download, Settings, Sparkles, LogOut, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../types';

interface HeaderProps {
  userCount: number;
  onShowArch: () => void;
  onShowAI: () => void;
  onLogout: () => void;
  user: User;
}

const Header: React.FC<HeaderProps> = ({ userCount, onShowArch, onShowAI, onLogout, user }) => {
  return (
    <header className="h-28 px-10 flex items-center justify-between z-40 shrink-0 relative bg-transparent">
      <div className="flex items-center gap-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Workspace Alpha</p>
          <h1 className="text-3xl font-serif italic text-white flex items-center gap-3">
            Hello, {user.name} A! 
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* User Presence Pill */}
        <div className="glass-dark h-14 pl-2 pr-6 rounded-full flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <img 
                key={i}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`}
                className="w-10 h-10 rounded-full border-2 border-[#121212] bg-indigo-500"
                alt="Presence"
              />
            ))}
          </div>
          <div className="w-1 h-6 bg-white/10 mx-1"></div>
          <span className="text-xs font-bold text-white/80">
            {userCount} Friends
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowAI}
            className="h-14 px-8 bg-[#FFD541] text-black text-sm font-black rounded-full shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Assist
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowArch}
            className="h-14 px-8 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-full hover:bg-white/10 transition-colors"
          >
            Spec
          </motion.button>
          
          <div className="relative group">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 bg-white/5 rounded-full border border-white/10 flex items-center justify-center overflow-hidden"
            >
              <img src={user.avatar} className="w-full h-full object-cover" />
            </motion.button>
            
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 shadow-2xl">
               <button onClick={onLogout} className="w-full px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3 transition-colors">
                 <LogOut className="w-4 h-4" />
                 Log out
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
