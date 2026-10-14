import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Lock, LogIn } from 'lucide-react';

export default function ProtectedRoute({ children, fallbackMessage }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { t } = useLang();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto my-12 max-w-xl rounded-2xl border border-amber-500/20 bg-amber-950/10 p-8 text-center backdrop-blur-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-4">
          <Lock className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Sign In Required</h3>
        <p className="text-sm text-slate-300 mb-6">
          {fallbackMessage || t('auth.guestNotice')}
        </p>
        <button
          onClick={openAuthModal}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-950/50"
        >
          <LogIn className="h-4 w-4" />
          <span>{t('auth.loginBtn')}</span>
        </button>
      </div>
    );
  }

  return children;
}