import { Sprout } from 'lucide-react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <Sprout className="h-8 w-8 text-emerald-400 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/30 animate-ping" />
      </div>
      <p className="text-xs font-bold text-slate-400 animate-pulse">{text}</p>
    </div>
  );
}