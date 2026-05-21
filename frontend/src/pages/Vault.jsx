import React, { useEffect } from 'react';
import { useSummaries } from '../context/SummaryContext';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Trash2, 
  ChevronRight, 
  Clock, 
  Brain,
  MessageSquareWarning,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const Vault = () => {
  const { summaries, fetchSummaries, fetchSummaryById, removeSummary, loading } = useSummaries();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  const handleLoadSummary = async (summary) => {
    const loadedSummary = await fetchSummaryById(summary._id);
    if (loadedSummary) {
      navigate('/dashboard/studio');
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // prevent card click triggers
    if (window.confirm('Are you sure you want to permanently remove this summary from your local vaults?')) {
      removeSummary(id);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-cyber-border">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-cyber-neonPurple" />
          MEMORY VAULT
        </h2>
        <p className="text-xs text-cyber-textMuted mt-0.5">
          Review, analyze, and manage historically indexed knowledge records
        </p>
      </div>

      {loading && summaries.length === 0 ? (
        /* Loading grid skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card border border-cyber-border rounded-3xl p-6 h-56 space-y-4 animate-pulse">
              <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
              <div className="h-3 w-1/3 bg-slate-800 rounded"></div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-slate-800 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : summaries.length === 0 ? (
        /* Empty vault alert */
        <div className="glass-card border border-dashed border-cyber-border rounded-3xl p-12 text-center max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyber-border flex items-center justify-center text-cyber-neonPurple mx-auto">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">Memory Vaults are Empty</h3>
            <p className="text-xs text-cyber-textMuted mt-1 leading-relaxed">
              No content summaries have been indexed yet. Navigate back to the AI Summary Studio to paste texts or upload PDF publications.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/studio')}
            className="px-6 py-2.5 rounded-xl font-bold text-xs btn-neon-purple inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            Open Summary Studio
          </button>
        </div>
      ) : (
        /* History Archive grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((sum) => (
            <motion.div
              key={sum._id}
              onClick={() => handleLoadSummary(sum)}
              whileHover={{ y: -2 }}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-cyber-border/80 flex flex-col justify-between h-64 cursor-pointer relative overflow-hidden group"
            >
              
              {/* Top Meta info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 font-mono">
                    {formatDate(sum.createdAt)}
                  </span>
                  
                  <div className="flex gap-1.5 text-[9px] font-bold uppercase tracking-wider font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-cyber-border text-cyber-neonCyan">
                      {sum.metrics.readingTime}m
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-cyber-border text-cyber-neonPurple">
                      C:{sum.metrics.complexityScore}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-200 group-hover:text-cyber-neonCyan transition-colors line-clamp-2 leading-snug">
                  {sum.title}
                </h3>

                <p className="text-xs text-cyber-textMuted line-clamp-3 leading-relaxed">
                  {sum.summaryText}
                </p>
              </div>

              {/* Card Footer tags and actions */}
              <div className="pt-4 border-t border-cyber-border/40 mt-4 flex items-center justify-between">
                <div className="flex gap-1 overflow-hidden max-w-[70%]">
                  {sum.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[9px] font-bold bg-slate-950/45 px-2 py-0.5 border border-cyber-border/60 rounded-md text-slate-400">
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDelete(e, sum._id)}
                    className="p-2 rounded-xl bg-slate-900 border border-cyber-border hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all duration-300"
                    title="Purge Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadSummary(sum);
                    }}
                    className="p-2 rounded-xl bg-slate-900 border border-cyber-border hover:border-cyber-neonCyan/30 text-slate-400 hover:text-cyber-neonCyan transition-all duration-300"
                    title="Inspect Workspace"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Vault;
