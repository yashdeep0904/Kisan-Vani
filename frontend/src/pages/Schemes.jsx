import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Building2, Search, Sparkles, ExternalLink, ShieldCheck, 
  CheckCircle2, FileText, Loader2, Filter, Info, ChevronRight, Sprout 
} from 'lucide-react';
import Card from '../components/ui/Card';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState(null);

  // AI Advisor State
  const [advisorState, setAdvisorState] = useState({ state: 'Haryana', landSize: '2.5', crop: 'Wheat', farmerType: 'Small Farmer' });
  const [aiAdvice, setAiAdvice] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const categories = ['All', 'Income Support', 'Crop Insurance', 'Credit & Loans', 'Irrigation', 'Solar & Equipment', 'Organic Farming', 'Market Access'];

  const loadSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/schemes?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSchemes(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load government schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSchemes();
  };

  const handleRunAdvisor = async (e) => {
    e.preventDefault();
    setAdvisorLoading(true);
    setAiAdvice('');
    try {
      const res = await fetch('/api/schemes/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advisorState)
      });
      const data = await res.json();
      setAiAdvice(data.advice || 'Advisor recommendations ready.');
    } catch (err) {
      setAiAdvice('Unable to generate AI recommendations right now. Please explore the verified scheme list below.');
    } finally {
      setAdvisorLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Building2 className="h-8 w-8 text-emerald-400" />
          Government Schemes & Agricultural Welfare Portal
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore official Central & State agricultural initiatives, subsidies, insurance, and eligibility guidelines.
        </p>
      </div>

      {/* AI Eligibility Advisor Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="h-4 w-4" /> AI Personal Eligibility Advisor
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Find Which Schemes Apply To Your Farm</h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-2xl">
          Enter your farming details below. Our GenAI agent will evaluate official scheme guidelines and give you customized eligibility advice.
        </p>

        <form onSubmit={handleRunAdvisor} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            value={advisorState.state}
            onChange={(e) => setAdvisorState({ ...advisorState, state: e.target.value })}
            placeholder="State (e.g. Haryana)"
            className="rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 px-3.5 text-xs text-white focus:border-emerald-500 outline-none"
            required
          />
          <input
            type="text"
            value={advisorState.landSize}
            onChange={(e) => setAdvisorState({ ...advisorState, landSize: e.target.value })}
            placeholder="Land Size in Acres"
            className="rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 px-3.5 text-xs text-white focus:border-emerald-500 outline-none"
            required
          />
          <input
            type="text"
            value={advisorState.crop}
            onChange={(e) => setAdvisorState({ ...advisorState, crop: e.target.value })}
            placeholder="Primary Crop (e.g. Wheat)"
            className="rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 px-3.5 text-xs text-white focus:border-emerald-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={advisorLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {advisorLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Analyze Eligibility
          </button>
        </form>

        {aiAdvice && (
          <div className="mt-6 p-4 bg-slate-900/90 border border-emerald-500/40 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed animate-fadeIn">
            <strong className="text-emerald-400 block mb-1 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Recommended Scheme Strategy:
            </strong>
            <p className="whitespace-pre-wrap">{aiAdvice}</p>
          </div>
        )}
      </div>

      {/* Search Bar & Category Tabs */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scheme name, subsidy keyword, or benefit (e.g., Insurance, Solar, PM-KISAN)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            Filter
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                category === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Scheme Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          <p className="text-sm">Loading verified government welfare database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="border-slate-800 bg-slate-900/60 flex flex-col justify-between hover:border-emerald-500/40 transition-all p-6">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {scheme.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Govt Verified
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{scheme.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">{scheme.description}</p>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-4">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Key Financial Benefit</span>
                  <p className="text-xs text-slate-200 line-clamp-3">{scheme.benefit}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl transition-colors font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Info className="h-3.5 w-3.5 text-emerald-400" /> View Eligibility & Documents
                </button>

                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-1"
                >
                  Apply On Official Portal <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </Card>
          ))}

          {schemes.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-slate-400 text-sm">
              No government schemes match your filter. Try clearing your search or switching categories.
            </div>
          )}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{selectedScheme.category}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedScheme.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedScheme.ministry}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <strong className="text-emerald-400 block mb-1">Financial & Social Benefits:</strong>
                <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">{selectedScheme.benefit}</p>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-1">Eligibility Criteria:</strong>
                <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">{selectedScheme.eligibility}</p>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-2">Required Application Documents:</strong>
                <ul className="space-y-1.5">
                  {selectedScheme.documentsNeeded.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800/60">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
              <a
                href={selectedScheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 flex items-center gap-1.5"
              >
                Go to Official Application Portal <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}