
import React from 'react';
import { 
  Home, 
  Search, 
  Calendar, 
  User as UserIcon,
  FolderClosed,
  Plus,
  Layout,
  Server
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  userAvatar: string;
  activeView: string;
  setView: (view: string) => void;
  onInfraClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userAvatar, activeView, setView }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'board', icon: Layout, label: 'Board' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'infra', icon: Server, label: 'Backend Infra' },
    { id: 'calendar', icon: Calendar, label: 'Schedule' },
    { id: 'profile', icon: UserIcon, label: 'Profile' },
  ];

  return (
    <aside className="w-28 flex flex-col items-center py-10 gap-8 z-40 shrink-0 relative">
      {/* Navigation Cluster */}
      <div className="glass-dark py-6 px-3 rounded-[40px] flex flex-col items-center gap-6 border border-white/5">
        {navItems.map((item, i) => (
          <motion.button 
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(item.id)}
            className={`p-4 rounded-full transition-all group relative ${
              activeView === item.id 
                ? 'bg-white text-black shadow-2xl' 
                : 'text-white/30 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-6 h-6" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-4 bg-[#1A1A1A] text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none border border-white/10 shadow-2xl z-[100]">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Quick Add */}
      <motion.button 
        whileHover={{ rotate: 90, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setView('board')}
        className="w-16 h-16 bg-[#FF7EB3] text-white rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20 active:shadow-inner"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </aside>
  );
};

export default Sidebar;
