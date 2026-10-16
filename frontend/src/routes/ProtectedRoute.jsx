import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Lock, LogIn, BrainCircuit } from 'lucide-react';

export default function ProtectedRoute({ children, fallbackMessage }) {
  const { user, openAuthModal } = useAuth();
  const { t } = useLang();

  // Derive authentication state directly from the user object
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return (
      <div className="mx-auto my-12 max-w-xl rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center backdrop-blur-md shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-slate-700/50 text-emerald-400 mb-4 shadow-inner">
          <Lock className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-extrabold text-white mb-2">Access Restricted</h3>
        <p className="text-sm text-slate-400 mb-6">
          {fallbackMessage || 'Please sign in to your GenAI Workspace to access this feature.'}
        </p>
        
        <button
          onClick={openAuthModal}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          <BrainCircuit className="h-4 w-4" />
          <span>Launch Workspace Login</span>
        </button>
      </div>
    );
  }

  return children;
}