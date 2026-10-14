import { useLang } from '../../context/LangContext';
import { Sprout, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">{t('brandName')}</span>
          <span className="text-xs text-slate-500">© 2026. All rights reserved.</span>
        </div>
        
        <p className="flex items-center gap-1 text-xs text-slate-500">
          Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for Indian Farmers
        </p>
      </div>
    </footer>
  );
}