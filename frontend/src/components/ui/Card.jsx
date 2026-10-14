export default function Card({ children, className = '', hoverEffect = false }) {
    const baseStyle = "rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-6";
    const hoverStyle = hoverEffect ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/20" : "";
    
    return (
      <div className={`${baseStyle} ${hoverStyle} ${className}`}>
        {children}
      </div>
    );
  }