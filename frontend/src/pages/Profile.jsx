import { useAuth } from '../context/AuthContext';
import { User, Mail, LogOut, BrainCircuit, Lock, Terminal, Mic } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please sign in to access your developer profile and interview history.
          </p>
          <button
            onClick={openAuthModal}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
          >
            Sign In to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-slate-700 flex items-center justify-center rounded-2xl text-emerald-400 shadow-inner">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user.name || 'Developer'}</h1>
            <p className="text-sm text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
              <Terminal className="h-3.5 w-3.5" />
              {user.role || 'Full Stack Developer'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-rose-950/40 text-rose-400 border border-rose-900/50 hover:bg-rose-900/60 font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Account Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
              <div className="flex items-center gap-3 text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <Mail className="h-5 w-5 text-slate-500" />
                <span>{user.email}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Account Role</label>
              <div className="flex items-center gap-3 text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <BrainCircuit className="h-5 w-5 text-slate-500" />
                <span>{user.role || 'Standard Access'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Metrics Card with New Launch Button */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-1">
            <BrainCircuit className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Copilot Ready</h3>
            <p className="text-sm text-slate-400 max-w-xs mt-1">
              Your GenAI workspace is fully authenticated. You are ready to start technical interview simulations and architecture reviews.
            </p>
          </div>
          
          {/* 3. Button directing to the Interview Room */}
          <Link
            to="/interview"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-900/20"
          >
            <Mic className="h-4 w-4" /> Launch Voice Session
          </Link>
        </div>
      </div>
    </div>
  );
}