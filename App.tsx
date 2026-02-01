
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MousePointer2, 
  BrainCircuit,
  MessageSquare,
  X,
  Search as SearchIcon,
  Plus,
  Clock,
  Play,
  Calendar as CalendarIcon,
  Settings,
  Heart,
  ChevronRight,
  Smile,
  Frown,
  Meh,
  FolderClosed,
  Zap,
  ArrowLeft,
  Download,
  ExternalLink,
  Layers,
  Type as TypeIcon,
  Layout as LayoutIcon,
  Columns,
  Workflow,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Board from './components/Board';
import Toolbar from './components/Toolbar';
import Header from './components/Header';
import AIPanel from './components/AIPanel';
import Sidebar from './components/Sidebar';
import ArchitectureView from './components/ArchitectureView';
import AuthPage from './components/AuthPage';
import InfraDashboard from './components/InfraDashboard';
import SchedulePage from './components/SchedulePage';
import { Tool, Element, UserPresence, User } from './types';
import { syncEngine } from './services/SyncEngine';

// --- Mock Plugin Data ---
const VENDORS: Record<string, any[]> = {
  'Moodboards': [
    { id: 'm1', name: 'Desert Ethereal', vendor: 'MoodFlow', preview: 'bg-gradient-to-br from-orange-200 to-rose-300', type: 'mood' },
    { id: 'm2', name: 'Cyber Neon', vendor: 'MoodFlow', preview: 'bg-gradient-to-br from-indigo-900 to-purple-500', type: 'mood' },
    { id: 'm3', name: 'Organic Minimal', vendor: 'MoodFlow', preview: 'bg-gradient-to-br from-slate-100 to-emerald-100', type: 'mood' }
  ],
  'Color Systems': [
    { id: 'c1', name: 'Oceanic 2025', vendor: 'Palettize', preview: 'bg-blue-400', colors: ['#60a5fa', '#3b82f6', '#1d4ed8'], type: 'color' },
    { id: 'c2', name: 'Retro Sunset', vendor: 'Palettize', preview: 'bg-orange-400', colors: ['#fb923c', '#f97316', '#c2410c'], type: 'color' },
    { id: 'c3', name: 'Vibrant Mesh', vendor: 'Palettize', preview: 'bg-pink-400', colors: ['#f472b6', '#db2777', '#831843'], type: 'color' }
  ],
  'Editorial Layouts': [
    { id: 'l1', name: 'Zine Minimalist', vendor: 'GridMaster', preview: 'bg-zinc-900', icon: Columns, type: 'layout' },
    { id: 'l2', name: 'Modular Flow', vendor: 'GridMaster', preview: 'bg-zinc-800', icon: LayoutIcon, type: 'layout' },
    { id: 'l3', name: 'Editorial Spread', vendor: 'GridMaster', preview: 'bg-white', icon: Columns, dark: true, type: 'layout' }
  ],
  'UX Frameworks': [
    { id: 'f1', name: 'Double Diamond', vendor: 'FrameLogic', preview: 'bg-[#151515]', icon: Workflow, type: 'framework' },
    { id: 'f2', name: 'User Journey Map', vendor: 'FrameLogic', preview: 'bg-[#151515]', icon: BrainCircuit, type: 'framework' },
    { id: 'f3', name: 'Value Proposition', vendor: 'FrameLogic', preview: 'bg-[#151515]', icon: Layers, type: 'framework' }
  ],
  'Typography': [
    { id: 't1', name: 'Modern Serif Pair', vendor: 'FontFlow', preview: 'bg-amber-50', font: 'Playfair Display', type: 'typography', dark: true },
    { id: 't2', name: 'Swiss Grotesk', vendor: 'FontFlow', preview: 'bg-[#0F0F0F]', font: 'Inter', type: 'typography' },
    { id: 't3', name: 'Classic Editorial', vendor: 'FontFlow', preview: 'bg-rose-50', font: 'Playfair Display', type: 'typography', dark: true }
  ]
};

// --- Page Views ---

const HomeView: React.FC<{ onStartBoard: () => void, name: string }> = ({ onStartBoard, name }) => (
  <div className="p-16 max-w-5xl mx-auto space-y-16">
    <div className="space-y-4">
      <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-sm">Welcome Back</p>
      <h2 className="text-7xl font-serif italic text-white">Hello,<br/>{name} A!</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Recently Viewed</p>
        <div className="space-y-4">
          {[
            { title: "Quarterly Strategy", time: "Active now", color: "bg-gradient-to-r from-yellow-200 to-pink-200" },
            { title: "Purva's Moodboard", time: "2h ago", color: "bg-gradient-to-r from-blue-200 to-purple-200" },
            { title: "AI System Mesh", time: "Yesterday", color: "bg-gradient-to-r from-pink-300 to-red-400" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 10 }}
              className="glass-dark p-6 rounded-[32px] flex items-center justify-between group cursor-pointer border border-white/5"
            >
              <div className="flex gap-6 items-center">
                <div className={`w-24 h-16 rounded-2xl ${item.color} opacity-80 group-hover:opacity-100 transition-opacity shadow-lg`} />
                <div>
                  <h4 className="font-bold text-white text-lg">{item.title}</h4>
                  <p className="text-white/40 text-sm font-medium">{item.time}</p>
                </div>
              </div>
              <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all">
                <Play className="w-5 h-5 fill-current" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass-dark p-10 rounded-[48px] border border-white/10 space-y-8">
           <div className="flex justify-between items-start">
             <div className="w-16 h-16 bg-[#FFD541] rounded-3xl flex items-center justify-center">
               <Plus className="w-8 h-8 text-black" />
             </div>
             <div className="text-right">
               <p className="text-white/40 text-sm font-bold">{name}'s Space</p>
               <p className="text-white text-2xl font-black">Design Core</p>
             </div>
           </div>
           <div className="space-y-4">
             <h3 className="text-3xl font-serif italic">Start fresh?</h3>
             <p className="text-white/50 leading-relaxed font-medium">Your canvas is a clean slate. Use Gemini to spark your next big idea or jump into a project.</p>
           </div>
           <button 
             onClick={onStartBoard}
             className="w-full py-5 bg-white text-black font-black uppercase rounded-[32px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
           >
             New Whiteboard
           </button>
        </div>
      </div>
    </div>
  </div>
);

const SearchView: React.FC<{ onImport: (asset: any) => void }> = ({ onImport }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTagClick = (tag: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setSelectedTag(tag);
      setIsSyncing(false);
    }, 800);
  };

  return (
    <div className="p-16 max-w-5xl mx-auto space-y-12 h-full overflow-y-auto pb-40">
      <AnimatePresence mode="wait">
        {!selectedTag ? (
          <motion.div 
            key="search-main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <div className="relative">
              <SearchIcon className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-white/20" />
              <input 
                placeholder="Find boards, assets, or plugins..."
                className="w-full pl-20 pr-8 py-8 bg-[#1A1A1A] border border-white/10 rounded-[40px] text-2xl font-bold focus:bg-[#222] transition-all outline-none"
              />
            </div>
            <div className="space-y-6">
              <p className="text-white/30 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Layers className="w-4 h-4" /> Plugin Marketplace
              </p>
              <div className="flex flex-wrap gap-4">
                {Object.keys(VENDORS).map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => handleTagClick(tag)}
                    className="px-8 py-4 rounded-full border border-white/10 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all font-bold text-sm flex items-center gap-2"
                  >
                    {tag}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>
            </div>

            {isSyncing && (
              <div className="flex items-center gap-4 text-white/30 font-bold italic">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                />
                Connecting to {selectedTag} vendors...
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="search-plugin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <button 
              onClick={() => setSelectedTag(null)}
              className="flex items-center gap-2 text-white/40 hover:text-white font-bold transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Discover
            </button>

            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h2 className="text-5xl font-serif italic">{selectedTag}</h2>
                <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Connected to {VENDORS[selectedTag]?.[0]?.vendor} API</p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 rounded-full border border-white/10 text-xs font-black uppercase hover:bg-white/5">Settings</button>
                <button className="px-6 py-2 rounded-full bg-white text-black text-xs font-black uppercase">Refresh API</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(VENDORS[selectedTag] || []).map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -8 }}
                  className="glass-dark rounded-[48px] overflow-hidden border border-white/5 group relative"
                >
                  <div className={`h-64 ${item.preview} p-12 relative flex flex-col items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Visual representations based on type */}
                    {item.type === 'color' && item.colors && (
                      <div className="flex gap-4">
                        {item.colors.map((c: string) => (
                          <div key={c} style={{ backgroundColor: c }} className="w-12 h-12 rounded-full border-4 border-white shadow-2xl" />
                        ))}
                      </div>
                    )}
                    {item.type === 'layout' && item.icon && (
                      <item.icon className={`w-20 h-20 ${item.dark ? 'text-black/20' : 'text-white/20'}`} />
                    )}
                    {item.type === 'framework' && item.icon && (
                      <div className="space-y-4 w-full px-8">
                        <div className="h-2 w-full bg-white/10 rounded-full" />
                        <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        <div className="h-2 w-full bg-white/10 rounded-full" />
                      </div>
                    )}
                    {item.type === 'typography' && (
                      <p className={`text-4xl font-serif italic ${item.dark ? 'text-black' : 'text-white'}`} style={{ fontFamily: item.font }}>
                        Aa Bb Cc
                      </p>
                    )}

                    <motion.button 
                      onClick={() => onImport(item)}
                      whileHover={{ scale: 1.1 }}
                      className="absolute bottom-8 right-8 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <Plus className="w-8 h-8" />
                    </motion.button>
                  </div>
                  <div className="p-10 flex justify-between items-center">
                    <div>
                      <h4 className="text-2xl font-bold">{item.name}</h4>
                      <p className="text-white/30 font-medium">{item.vendor} Plugin</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                       <span className="text-[10px] font-black uppercase text-white/50">v1.2</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * ProfileView: Renders user profile information and account settings.
 */
const ProfileView: React.FC<{ user: User }> = ({ user }) => (
  <div className="p-16 max-w-5xl mx-auto space-y-12 h-full overflow-y-auto pb-40">
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-[#FFD541] rounded-full blur-3xl opacity-20 animate-pulse" />
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-48 h-48 rounded-[60px] border-4 border-white/10 relative z-10 shadow-2xl" 
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-6xl font-serif italic text-white">{user.name} A</h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
      {[
        { label: 'Boards Created', value: '42', color: 'text-indigo-400' },
        { label: 'Collaborators', value: '128', color: 'text-emerald-400' },
        { label: 'AI Tokens Used', value: '2.4M', color: 'text-rose-400' },
      ].map((stat, i) => (
        <div key={i} className="glass-dark p-10 rounded-[48px] border border-white/5 text-center space-y-2">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
          <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="glass-dark p-12 rounded-[60px] border border-white/10 space-y-8">
      <h3 className="text-2xl font-serif italic">Account Settings</h3>
      <div className="space-y-4">
        {['Security & Privacy', 'Integrations', 'Billing', 'Team Management'].map((item) => (
          <button key={item} className="w-full p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
            <span className="font-bold text-white/80">{item}</span>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'board' | 'search' | 'projects' | 'calendar' | 'profile' | 'infra'>('home');
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [elements, setElements] = useState<Element[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string>('room-101');
  
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [showAI, setShowAI] = useState(false);
  const [showArch, setShowArch] = useState(false);
  
  const [users, setUsers] = useState<UserPresence[]>([
    { id: 'u1', name: 'Yafie', color: '#FF7EB3', cursor: { x: 400, y: 300 }, lastActive: Date.now() },
    { id: 'u2', name: 'Alzea', color: '#84E1BC', cursor: { x: 600, y: 200 }, lastActive: Date.now() }
  ]);

  // Sync Engine Setup
  useEffect(() => {
    syncEngine.onElementsUpdate((remoteElements) => {
      setElements(remoteElements);
    });
    syncEngine.onCursorUpdate((userId, cursor) => {
      setUsers(prev => {
        const exists = prev.find(u => u.id === userId);
        if (exists) {
          return prev.map(u => u.id === userId ? { ...u, cursor } : u);
        }
        // If it's a new remote user we haven't seen yet
        return [...prev, { id: userId, name: 'Remote User', color: '#FFF', cursor, lastActive: Date.now() }];
      });
    });
  }, []);

  // Join Room when entering board view
  useEffect(() => {
    if (currentView === 'board' && currentUser) {
      syncEngine.joinRoom(currentRoomId, currentUser.name, '#FFD541');
    }
  }, [currentView, currentUser, currentRoomId]);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_user');
    if (saved) setCurrentUser(JSON.parse(saved));
    else {
      const defaultUser = {
        id: 'purva-001',
        name: 'Purva',
        email: 'purva@nexus.ai',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=purva'
      };
      setCurrentUser(defaultUser);
      localStorage.setItem('nexus_user', JSON.stringify(defaultUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_user', JSON.stringify(user));
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_user');
  };

  const commitElementsChange = useCallback((newElements: Element[]) => {
    setElements(newElements);
    syncEngine.broadcastElements(newElements);
    
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newElements);
    if (nextHistory.length > 50) nextHistory.shift();
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  }, [history, historyIndex]);

  const handleJoinScheduledRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setCurrentView('board');
  };

  const handleImportAsset = (asset: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    let newEl: Element;

    switch(asset.type) {
      case 'typography':
        newEl = {
          id, type: 'text', x: 200, y: 200, width: 300, height: 40,
          color: asset.dark ? '#000000' : '#FFFFFF',
          text: `${asset.name}\n${asset.font}`,
          strokeWidth: 2, opacity: 1
        };
        break;
      case 'color':
        newEl = {
          id, type: 'sticky', x: 200, y: 200, width: 250, height: 250,
          color: asset.colors ? asset.colors[0] : '#FFD541',
          text: `Palette: ${asset.name}\n${asset.colors?.join('\n')}`,
          strokeWidth: 2, opacity: 1
        };
        break;
      case 'layout':
      case 'framework':
        newEl = {
          id, type: 'rect', x: 200, y: 200, width: 800, height: 500,
          color: asset.dark ? '#000000' : '#FFFFFF',
          text: `Template: ${asset.name}\nPlugin: ${asset.vendor}`,
          strokeWidth: 2, opacity: 0.8
        };
        break;
      default:
        newEl = {
          id, type: 'sticky', x: 200, y: 200, width: 250, height: 250,
          color: '#FFD541',
          text: `Imported: ${asset.name}\nVendor: ${asset.vendor}`,
          strokeWidth: 2, opacity: 1
        };
    }
    
    commitElementsChange([...elements, newEl]);
    setCurrentView('board');
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#0F0F0F] overflow-hidden text-white selection:bg-white/20">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFD541] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FF7EB3] rounded-full blur-[180px] opacity-[0.03] pointer-events-none" />

      <Header 
        userCount={users.length} 
        onShowArch={() => setShowArch(true)}
        onShowAI={() => setShowAI(!showAI)}
        onLogout={handleLogout}
        user={currentUser}
      />
      
      <div className="flex-1 relative flex">
        <Sidebar 
          activeView={currentView}
          setView={(view: any) => setCurrentView(view)}
          userAvatar={currentUser.avatar} 
          onInfraClick={() => setCurrentView('infra')}
        />
        
        <main className="flex-1 relative overflow-hidden bg-[#151515] rounded-tl-[60px] border-t border-l border-white/5 shadow-2xl overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentView === 'board' ? (
              <motion.div 
                key="board"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative overflow-hidden"
              >
                <Board 
                  activeTool={activeTool} 
                  elements={elements} 
                  onLiveChange={setElements}
                  onCommit={commitElementsChange}
                  remoteUsers={users}
                  currentColor={selectedColor}
                  onCursorMove={(cursor) => syncEngine.broadcastCursor(cursor)}
                />
                
                <Toolbar 
                  activeTool={activeTool} 
                  setActiveTool={setActiveTool} 
                  selectedColor={selectedColor} 
                  setSelectedColor={setSelectedColor}
                  onUndo={() => {}}
                  onRedo={() => {}}
                  canUndo={historyIndex > 0}
                  canRedo={historyIndex < history.length - 1}
                />

                {users.map(user => (
                  <motion.div 
                    key={user.id}
                    animate={{ left: user.cursor.x, top: user.cursor.y }}
                    className="pointer-events-none absolute z-50 flex items-start gap-2"
                  >
                    <MousePointer2 className="w-5 h-5 drop-shadow-lg" style={{ color: user.color, fill: user.color }} />
                    <span 
                      className="px-3 py-1 text-[10px] font-bold rounded-full border border-white/10 shadow-2xl text-white whitespace-nowrap"
                      style={{ backgroundColor: `${user.color}cc` }}
                    >
                      {user.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full h-full"
              >
                {currentView === 'home' && <HomeView name={currentUser.name} onStartBoard={() => setCurrentView('board')} />}
                {currentView === 'search' && <SearchView onImport={handleImportAsset} />}
                {currentView === 'profile' && <ProfileView user={currentUser} />}
                {currentView === 'infra' && <InfraDashboard />}
                {currentView === 'calendar' && (
                  <SchedulePage onJoinSession={handleJoinScheduledRoom} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {showAI && (
            <AIPanel 
              elements={elements} 
              setElements={commitElementsChange} 
              onClose={() => setShowAI(false)} 
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showArch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-[#1A1A1A] rounded-[50px] border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-hidden relative shadow-2xl"
            >
              <button 
                onClick={() => setShowArch(false)}
                className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="overflow-y-auto max-h-full">
                <ArchitectureView />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
