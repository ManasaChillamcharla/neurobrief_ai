import React, { useState } from 'react';
import { useSummaries } from '../context/SummaryContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Cpu, 
  ArrowRight,
  Database,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SemanticSearch = () => {
  const { searchSemantic, fetchSummaryById, loading } = useSummaries();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const matches = await searchSemantic(query);
    setResults(matches || []);
    setHasSearched(true);
  };

  const handleLoadSummary = async (id) => {
    const loadedSummary = await fetchSummaryById(id);
    if (loadedSummary) {
      navigate('/dashboard/studio');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-cyber-border">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-cyber-neonPink" />
          SEMANTIC SEARCH
        </h2>
        <p className="text-xs text-cyber-textMuted mt-0.5">
          Query your historic document archives intelligently using bag-of-words cosine matching vectors
        </p>
      </div>

      {/* Modern Search bar Form */}
      <form onSubmit={handleSearch} className="glass-card border border-cyber-border rounded-3xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              required
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. quantum neural networks and deep cognitive synthesis patterns..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-2xl font-bold btn-neon-cyan flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-white animate-pulse" />
                <span>Execute Scan</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-cyber-textMuted font-medium ml-1">
          <Info className="w-3.5 h-3.5 text-cyber-neonCyan" />
          <span>Fuzzy text algorithms scan raw content, keywords, and titles to index relevancies.</span>
        </div>
      </form>

      {/* Results grid panel */}
      <div className="space-y-4">
        
        {/* Results title metadata */}
        {hasSearched && (
          <div className="flex items-center justify-between text-xs text-cyber-textMuted ml-1">
            <span>Query: <strong className="text-slate-300 font-bold">"{query}"</strong></span>
            <span>Total matches: <strong className="text-cyber-neonCyan font-bold">{results.length} files</strong></span>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* Skeleton Load */}
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card border border-cyber-border rounded-3xl p-6 h-40 space-y-4 animate-pulse">
                  <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
                  <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
                  <div className="h-3 w-2/3 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty search matches */}
          {!loading && hasSearched && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card border border-dashed border-cyber-border rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyber-border flex items-center justify-center text-cyber-neonPink mx-auto">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">No matching vectors found</h4>
                <p className="text-xs text-cyber-textMuted mt-1">
                  Try adjusting search phrase components (e.g. searching specific conceptual keywords like 'intelligence' or 'network').
                </p>
              </div>
            </motion.div>
          )}

          {/* Match listings */}
          {!loading && results.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {results.map((match) => (
                <motion.div
                  key={match._id}
                  onClick={() => handleLoadSummary(match._id)}
                  whileHover={{ x: 2 }}
                  className="glass-card glass-card-hover rounded-3xl p-6 border border-cyber-border/80 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                >
                  {/* Text details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      
                      {/* Glow similarity score pill */}
                      <span className="px-2.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyber-neonCyan font-mono text-[9px] font-bold uppercase tracking-widest">
                        Match Weight: {(match.score * 100).toFixed(1)}%
                      </span>

                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        {new Date(match.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-cyber-neonCyan transition-colors">
                      {match.title}
                    </h4>
                    
                    <p className="text-xs text-cyber-textMuted line-clamp-2 leading-relaxed">
                      {match.summaryText}
                    </p>
                  </div>

                  {/* Load/Redirect Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadSummary(match._id);
                    }}
                    className="p-3 rounded-2xl bg-slate-900 border border-cyber-border hover:border-cyber-neonCyan/30 text-slate-400 hover:text-cyber-neonCyan transition-all duration-300 self-end md:self-center flex items-center gap-1 text-xs font-bold shrink-0 shadow"
                  >
                    <span>Load Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                  </button>

                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
};

export default SemanticSearch;
