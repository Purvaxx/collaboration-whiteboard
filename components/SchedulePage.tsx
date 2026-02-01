
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  ChevronRight, 
  Video, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Play,
  ArrowUpRight
} from 'lucide-react';
import { ScheduledSession } from '../types';

interface SchedulePageProps {
  onJoinSession: (roomId: string) => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ onJoinSession }) => {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    description: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('nexus_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      // Mock Data for first load
      const mock: ScheduledSession[] = [
        {
          id: 's1',
          title: 'Quarterly Architecture Sync',
          startTime: new Date(Date.now() + 3600000).toISOString(),
          duration: 45,
          roomId: 'room-101',
          attendees: ['purva', 'alzea', 'yafie'],
          status: 'upcoming',
          description: 'Reviewing the new microservices mesh for the Q3 release.'
        },
        {
          id: 's2',
          title: 'Design Critique: Nexus Pro',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          duration: 30,
          roomId: 'room-design',
          attendees: ['yafie', 'emma'],
          status: 'upcoming',
          description: 'Visual audit of the new glassmorphism components.'
        }
      ];
      setSessions(mock);
      localStorage.setItem('nexus_sessions', JSON.stringify(mock));
    }
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = new Date(`${newSession.date}T${newSession.time}`).toISOString();
    const session: ScheduledSession = {
      id: Math.random().toString(36).substr(2, 9),
      title: newSession.title || 'Untitled Session',
      startTime,
      duration: newSession.duration,
      roomId: `room-${Math.random().toString(36).substr(2, 4)}`,
      attendees: ['purva', 'random-' + Math.random()],
      status: 'upcoming',
      description: newSession.description
    };

    const updated = [...sessions, session].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    setSessions(updated);
    localStorage.setItem('nexus_sessions', JSON.stringify(updated));
    setShowModal(false);
    setNewSession({ title: '', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 60, description: '' });
  };

  const getRelativeTime = (isoString: string) => {
    const diff = new Date(isoString).getTime() - Date.now();
    const mins = Math.floor(diff / 60000);
    if (mins < 0) return 'Session started';
    if (mins < 60) return `Starts in ${mins}m`;
    const hours = Math.floor(mins / 60);
    return `Starts in ${hours}h ${mins % 60}m`;
  };

  const nextSession = sessions.find(s => new Date(s.startTime).getTime() > Date.now());

  return (
    <div className="p-16 max-w-6xl mx-auto space-y-16 h-full overflow-y-auto pb-40 relative">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Session Manager</p>
          <h2 className="text-7xl font-serif italic text-white leading-tight">Your<br/>Collaborations.</h2>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="h-20 px-10 bg-white text-black rounded-[32px] font-black uppercase flex items-center gap-3 shadow-2xl hover:bg-yellow-300 transition-colors"
        >
          <Plus className="w-6 h-6" />
          Plan New Session
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Next Up Focus Card */}
        <div className="lg:col-span-5 space-y-8">
          <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Happening Next</p>
          {nextSession ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark p-10 rounded-[60px] border border-white/10 space-y-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="px-4 py-2 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {getRelativeTime(nextSession.startTime)}
                </div>
                <div className="flex -space-x-3">
                  {nextSession.attendees.map((seed, i) => (
                    <img 
                      key={i} 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                      className="w-10 h-10 rounded-full border-2 border-black bg-slate-800" 
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <h3 className="text-4xl font-serif italic text-white group-hover:text-yellow-300 transition-colors">{nextSession.title}</h3>
                <p className="text-white/40 font-medium leading-relaxed line-clamp-2">{nextSession.description}</p>
              </div>

              <div className="flex items-center gap-6 pt-4 relative z-10">
                 <div className="flex items-center gap-2 text-white/60">
                   <Clock className="w-5 h-5" />
                   <span className="text-sm font-bold">{new Date(nextSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                 <div className="flex items-center gap-2 text-white/60">
                   <Users className="w-5 h-5" />
                   <span className="text-sm font-bold">{nextSession.attendees.length} Members</span>
                 </div>
              </div>

              <button 
                onClick={() => onJoinSession(nextSession.roomId)}
                className="w-full py-6 bg-white text-black font-black uppercase rounded-[32px] flex items-center justify-center gap-3 group-hover:scale-[1.02] transition-all"
              >
                Launch Whiteboard <ArrowUpRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <div className="glass-dark p-12 rounded-[60px] border border-white/5 text-center space-y-4">
              <CalendarIcon className="w-12 h-12 text-white/10 mx-auto" />
              <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">No sessions found</p>
            </div>
          )}
        </div>

        {/* Chronological Timeline */}
        <div className="lg:col-span-7 space-y-8">
          <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Your Timeline</p>
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark p-6 rounded-[32px] flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer"
                onClick={() => onJoinSession(session.roomId)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/5">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                      {new Date(session.startTime).toLocaleDateString([], { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-white">
                      {new Date(session.startTime).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">{session.title}</h4>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration} mins
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {session.attendees.slice(0, 2).map((seed, i) => (
                      <img 
                        key={i} 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                        className="w-8 h-8 rounded-full border-2 border-black bg-slate-800" 
                      />
                    ))}
                    {session.attendees.length > 2 && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black border-2 border-black">
                        +{session.attendees.length - 2}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-[50px] p-12 w-full max-w-2xl relative z-10 shadow-2xl space-y-10"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-4xl font-serif italic text-white">Plan Session</h3>
                  <p className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Reserve your digital space</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Meeting Title</label>
                   <input 
                    required
                    type="text" 
                    placeholder="e.g. Brainstorming Session"
                    value={newSession.title}
                    onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[24px] text-white font-bold outline-none focus:border-indigo-500 transition-all"
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Date</label>
                    <input 
                      type="date" 
                      value={newSession.date}
                      onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                      className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[24px] text-white font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Start Time</label>
                    <input 
                      type="time" 
                      value={newSession.time}
                      onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                      className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[24px] text-white font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Description (Optional)</label>
                  <textarea 
                    placeholder="What's the goal of this meeting?"
                    value={newSession.description}
                    onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-[24px] text-white font-medium outline-none h-32 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-white text-black font-black uppercase rounded-[32px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create Session
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchedulePage;
