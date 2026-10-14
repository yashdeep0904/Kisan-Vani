import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { X, Sprout, Stethoscope, TrendingUp, CloudSun, FileText, User, LogOut } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useLang();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Sprout },
    { name: t('nav.diagnose'), path: '/diagnose', icon: Stethoscope },
    { name: t('nav.mandi'), path: '/mandi', icon: TrendingUp },
    { name: t('nav.weather'), path: '/weather', icon: CloudSun },
    { name: t('nav.schemes'), path: '/schemes', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative flex w-64 flex-col bg-slate-900 border-r border-slate-800 shadow-2xl transition-transform transform translate-x-0">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sprout className="h-6 w-6" />
            {t('brandName')}
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-emerald-600/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {isAuthenticated && (
          <div className="p-4 border-t border-slate-800 space-y-3">
            <Link to="/profile" onClick={onClose} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white">
              <User className="h-5 w-5 text-slate-500" />
              {user?.name}
            </Link>
            <button onClick={() => { logout(); onClose(); }} className="flex items-center gap-3 text-sm text-rose-400 hover:text-rose-300 w-full text-left">
              <LogOut className="h-5 w-5" />
              {t('nav.logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}