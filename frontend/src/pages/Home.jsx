import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { Stethoscope, TrendingUp, CloudSun, FileText } from 'lucide-react';

export default function Home() {
  const { t } = useLang();

  return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[100px] rounded-full"></div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="px-4 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-6 inline-block">
            {t('hero.badge')}
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-3xl leading-tight">
            {t('hero.title')}
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/diagnose" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Stethoscope className="h-5 w-5" /> {t('hero.startDiagnose')}
            </Link>
            
            <Link 
              to="/mandi" 
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {t('hero.exploreMandi')}
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Crop Doctor Card */}
        <Link to="/diagnose" className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors group cursor-pointer">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('card.doctor.title')}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{t('card.doctor.desc')}</p>
        </Link>

        {/* Mandi Rates Card */}
        <Link to="/mandi" className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-6 hover:border-blue-500/50 transition-colors group cursor-pointer">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('card.mandi.title')}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{t('card.mandi.desc')}</p>
        </Link>

        {/* Weather Card */}
        <Link to="/weather" className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-6 hover:border-amber-500/50 transition-colors group cursor-pointer">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CloudSun className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('card.weather.title')}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{t('card.weather.desc')}</p>
        </Link>

        {/* Government Schemes Card */}
        <Link to="/schemes" className="bg-purple-950/20 border border-purple-900/30 rounded-2xl p-6 hover:border-purple-500/50 transition-colors group cursor-pointer">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('card.schemes.title')}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{t('card.schemes.desc')}</p>
        </Link>

      </div>
    </div>
  );
}