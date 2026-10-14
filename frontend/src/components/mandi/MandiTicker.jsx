import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MandiTicker({ data = [] }) {
  if (!data.length) return null;

  return (
    <div className="w-full overflow-hidden bg-slate-950 border-y border-slate-800 py-2 flex items-center">
      <div className="animate-marquee whitespace-nowrap flex gap-8 px-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-300">{item.commodity} ({item.mandi}):</span>
            <span className="text-white">₹{item.modalPrice}</span>
            {item.trend === 'up' ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}