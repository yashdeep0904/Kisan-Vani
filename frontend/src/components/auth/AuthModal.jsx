import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './SignupForm';
import { X, Sprout } from 'lucide-react';

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
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ... Rest of your existing AuthModal JSX ... */}
        
        {mode === 'login' ? (
          <LoginForm onSuccess={closeAuthModal} switchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSuccess={closeAuthModal} switchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}