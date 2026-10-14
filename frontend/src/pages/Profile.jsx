import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../routes/ProtectedRoute';
import { User, MapPin, Phone, History } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 py-4">
      <ProtectedRoute>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6 max-w-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" /> {user?.location}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <span>{user?.identifier}</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
}