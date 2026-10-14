import { useState, useEffect } from 'react';
import { TrendingUp, Search, Loader2, MapPin, BrainCircuit, Calendar, Layers } from 'lucide-react';
import Card from '../components/ui/Card';
import { api } from '../services/api';

export default function MandiPrices() {
  const [district, setDistrict] = useState('Rohtak');
  const [crop, setCrop] = useState('Wheat');
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIntelligence = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMandiPrices(district, crop);
      setIntelligence(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch market intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  return (
    <div className="space-y-6 py-4 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-amber-400" />
          Agri-Commodity Multi-Variety Intelligence
        </h1>
        <p className="text-sm text-slate-400">
          Compare APMC daily rates across different crop varieties with live AI sentiment analysis.
        </p>
      </div>

      <form onSubmit={fetchIntelligence} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="District (e.g., Rohtak, Indore)"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 px-4 text-sm text-white focus:border-amber-500 outline-none"
        />
        <input
          type="text"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Crop (e.g., Wheat, Paddy, Cotton)"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 px-4 text-sm text-white focus:border-amber-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Analyze Varieties
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
          <p className="text-sm">Fetching varieties and generating market sentiment forecast...</p>
        </div>
      )}

      {intelligence && !loading && (
        <div className="space-y-6">
          <Card className="border-emerald-900/30 bg-emerald-950/10 relative overflow-hidden p-6">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="h-24 w-24 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-3">
              <BrainCircuit className="h-5 w-5" /> AI Market Sentiment & Variety Forecast
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed relative z-10 whitespace-pre-wrap">
              {intelligence.aiAnalysis}
            </p>
          </Card>

          <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-800 pb-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <span>Available Varieties in {intelligence.district} ({intelligence?.varieties?.length || 0})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(intelligence?.varieties || []).map((v, idx) => (
              <Card key={idx} className="border-amber-900/30 bg-amber-950/10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-white">{v.variety}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {v.date}
                    </span>
                  </div>

                  <div className="text-3xl font-extrabold text-white mb-2">
                    ₹{v.modal} <span className="text-xs text-slate-400 font-normal">/ quintal</span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" /> {v.mandi}
                  </p>
                </div>

                <div className="flex justify-between border-t border-slate-800 pt-3 text-xs text-slate-300">
                  <span>Min Rate: <strong className="text-white">₹{v.min}</strong></span>
                  <span>Max Rate: <strong className="text-white">₹{v.max}</strong></span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}