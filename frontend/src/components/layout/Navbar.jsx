import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { Sprout, Globe, User, LogOut, LogIn, Stethoscope, TrendingUp, CloudSun, FileText } from 'lucide-react';

export default function Navbar() {
  // FIXED: Destructured openAuthModal directly from context
  const { isAuthenticated, user, logoutUser, openAuthModal } = useAuth();
  const { lang, toggleLanguage, t } = useLang();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Sprout },
    { name: t('nav.diagnose'), path: '/diagnose', icon: Stethoscope },
    { name: t('nav.mandi'), path: '/mandi', icon: TrendingUp },
    { name: t('nav.weather'), path: '/weather', icon: CloudSun },
    { name: t('nav.schemes'), path: '/schemes', icon: FileText }
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-950/50">
            <Sprout className="h-6 w-6 text-slate-950" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">{t('brandName')}</span>
            <span className="block text-[10px] font-medium text-emerald-400">{t('tagline')}</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Bilingual Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition-all hover:bg-slate-700 cursor-pointer"
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* User State */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                <User className="h-4 w-4 text-emerald-400" />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={logoutUser}
                className="rounded-xl border border-rose-900/50 bg-rose-950/40 p-2 text-rose-400 hover:bg-rose-900/60 transition-colors cursor-pointer"
                title={t('nav.logout')}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{t('nav.login')}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}