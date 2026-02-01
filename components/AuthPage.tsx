
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, LogIn, Sparkles, Chrome, ChevronRight, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const BlobEmoji = ({ color, mood }: { color: string, mood: 'happy' | 'neutral' | 'grumpy' }) => (
  <motion.div 
    animate={{ 
      y: [0, -15, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative w-64 h-64 mx-auto"
  >
    <div className={`absolute inset-0 rounded-full blur-2xl opacity-40`} style={{ backgroundColor: color }}></div>
    <div className={`relative w-full h-full rounded-full flex items-center justify-center overflow-hidden border-4 border-black/10`} style={{ backgroundColor: color }}>
      {/* Eyes and Mouth based on mood */}
      {mood === 'happy' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-8">
            <div className="w-6 h-3 bg-black rounded-t-full rotate-[15deg]"></div>
            <div className="w-6 h-3 bg-black rounded-t-full -rotate-[15deg]"></div>
          </div>
          <div className="w-16 h-8 bg-white rounded-b-full border-t-4 border-black/20"></div>
        </div>
      )}
      {mood === 'neutral' && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-10">
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
          <div className="w-12 h-2 bg-black rounded-full"></div>
        </div>
      )}
      {mood === 'grumpy' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-8">
            <div className="w-6 h-4 bg-black rounded-b-full -rotate-[20deg]"></div>
            <div className="w-6 h-4 bg-black rounded-b-full rotate-[20deg]"></div>
          </div>
          <div className="w-10 h-1 bg-black rounded-full"></div>
        </div>
      )}
    </div>
  </motion.div>
);

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'welcome' | 'auth'>('welcome');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? 'Purva' : name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || 'purva'}`
    };
    onLogin(user);
  };

  const handleGoogleLogin = () => {
    const user: User = {
      id: 'google-user-123',
      name: 'Purva',
      email: 'purva@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=purva'
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'welcome' ? (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-lg text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-6xl font-serif italic tracking-tight">How are you</h1>
              <h1 className="text-6xl font-serif italic tracking-tight">feeling today?</h1>
            </div>

            <div className="flex justify-center gap-4">
              {['Joyful', 'Cheerful', 'Content'].map((mood, i) => (
                <button 
                  key={mood}
                  className={`px-8 py-3 rounded-full border border-white/20 text-sm font-medium transition-all hover:bg-white/10 ${i === 1 ? 'bg-[#FFD541] text-black border-none' : ''}`}
                >
                  {mood}
                </button>
              ))}
            </div>

            <BlobEmoji color="#FFD541" mood="happy" />

            <div className="space-y-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep('auth')}
                className="w-full py-5 bg-[#1A1A1A] rounded-3xl text-xl font-bold flex items-center justify-center gap-2 pill-shadow border border-white/5"
              >
                Get Started
              </motion.button>
              <button 
                onClick={() => { setIsLogin(true); setStep('auth'); }}
                className="text-white/50 text-sm font-medium hover:text-white transition-colors"
              >
                Already have an account? <span className="text-white font-bold">Log in</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md space-y-10"
          >
            <button 
              onClick={() => setStep('welcome')}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <div className="space-y-2">
              <h2 className="text-5xl font-serif italic">{isLogin ? 'Welcome Back!' : 'Join the Club'}</h2>
              <p className="text-white/40 font-medium">Please enter your details to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      placeholder="Full Name"
                      className="w-full pl-6 pr-4 py-5 bg-[#1A1A1A] border border-white/5 rounded-[24px] font-bold focus:bg-[#222] transition-all outline-none text-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <input 
                required
                type="email" 
                placeholder="Email Address"
                className="w-full pl-6 pr-4 py-5 bg-[#1A1A1A] border border-white/5 rounded-[24px] font-bold focus:bg-[#222] transition-all outline-none text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input 
                required
                type="password" 
                placeholder="Password"
                className="w-full pl-6 pr-4 py-5 bg-[#1A1A1A] border border-white/5 rounded-[24px] font-bold focus:bg-[#222] transition-all outline-none text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-white text-black font-black uppercase rounded-[32px] pill-shadow flex items-center justify-center gap-3"
              >
                {isLogin ? 'Login' : 'Create Account'}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs font-bold uppercase"><span className="bg-[#0F0F0F] px-4 text-white/20">or</span></div>
            </div>

            <motion.button 
              type="button"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              className="w-full py-5 bg-[#1A1A1A] border border-white/5 rounded-[32px] font-bold text-white flex items-center justify-center gap-3 transition-all"
            >
              <Chrome className="w-6 h-6" />
              Sign in with Google
            </motion.button>

            <p className="text-center text-white/40 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-bold underline"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
