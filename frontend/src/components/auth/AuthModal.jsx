import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './SignupForm';
import { X, BrainCircuit } from 'lucide-react'; // Swapped Sprout for GenAI theme

export default function AuthModal() {
  // Consume global state from context
  const { isModalOpen, closeAuthModal } = useAuth();
  const [mode, setMode] = useState('login');

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors z-10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header: GenAI Developer Workspace */}
        <div className="flex flex-col items-center justify-center mb-6 pt-2 text-center">
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-slate-700/50 rounded-2xl mb-3 shadow-inner">
            <BrainCircuit className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            GenAI Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Sign in to access your technical interview copilot
          </p>
        </div>
        
        {/* Dynamic Form Rendering */}
        {mode === 'login' ? (
          <LoginForm onSuccess={closeAuthModal} switchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSuccess={closeAuthModal} switchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}