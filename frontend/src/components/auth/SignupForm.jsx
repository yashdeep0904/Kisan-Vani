import { useState } from 'react';
import { User, Mail, Lock, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterForm({ onSuccess, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer', 
  });
  const [error, setError] = useState(null);

  // Consume the loading and register functions directly from context
  const { register, loading } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Pass the fully constructed formData object to the API
      await register(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create account');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">FULL NAME</label>
        <div className="relative">
          <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Yash Deep"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">EMAIL</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
          />
        </div>
      </div>

      
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">PASSWORD</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="password"
            name="password"
            required
            minLength="6" // Enforces the Mongoose requirement natively
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">ROLE</label>
        <div className="relative">
          <UserCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
          >
            <option value="Developer">Full Stack Developer</option>
            <option value="Student">CS / Engineering Student</option>
            <option value="Recruiter">Technical Recruiter</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 mt-2 transition-colors cursor-pointer"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
      </button>

      <p className="text-center text-xs text-slate-400 pt-2">
        Already have an account?{' '}
        <button type="button" onClick={switchToLogin} className="text-emerald-400 font-bold hover:underline cursor-pointer">
          Sign in instead
        </button>
      </p>
    </form>
  );
}