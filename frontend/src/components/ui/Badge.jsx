export default function Badge({ children, variant = 'success', className = '' }) {
    const variants = {
      success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
  
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${variants[variant]} ${className}`}>
        {children}
      </span>
    );
  }