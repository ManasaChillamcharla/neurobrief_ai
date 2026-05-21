import React, { useEffect } from 'react';
import { useSummaries } from '../context/SummaryContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  LayoutDashboard, 
  Clock, 
  FileText, 
  BookOpen, 
  Sparkles,
  BarChart3,
  PieChart as LucidePieChart
} from 'lucide-react';

const AnalyticsBoard = () => {
  const { analytics, fetchAnalytics } = useSummaries();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Set default demo data if no documents processed yet to avoid empty white spaces
  const hasData = analytics && analytics.totalSummariesCount > 0;
  
  const stats = hasData ? analytics : {
    totalWordsProcessed: 12450,
    totalSummariesCount: 4,
    readingTimeSaved: 48,
    sentimentDistribution: { positive: 2, neutral: 1, negative: 1 },
    topicFrequencies: [
      { topic: 'Intelligence', count: 8 },
      { topic: 'Network', count: 6 },
      { topic: 'Quantum', count: 5 },
      { topic: 'Synthesis', count: 3 },
      { topic: 'Logic', count: 2 }
    ],
    averageComplexity: 58
  };

  // Convert topics freq to Recharts format
  const topicData = stats.topicFrequencies.map(item => ({
    name: item.topic,
    Frequency: item.count
  }));

  // Convert sentiments to Recharts format
  const sentimentData = [
    { name: 'Positive', value: stats.sentimentDistribution.positive, color: '#10b981' }, // neon emerald
    { name: 'Neutral', value: stats.sentimentDistribution.neutral, color: '#06b6d4' },    // neon cyan
    { name: 'Negative', value: stats.sentimentDistribution.negative, color: '#ec4899' }  // neon pink
  ].filter(item => item.value > 0); // only map if values exist

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-cyber-border flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-cyber-neonEmerald" />
            ANALYTICS BOARD
          </h2>
          <p className="text-xs text-cyber-textMuted mt-0.5">
            Statistical aggregation dashboard measuring reading efficiency gains and cognitive densities
          </p>
        </div>

        {!hasData && (
          <span className="px-3.5 py-1 rounded-full bg-yellow-950/20 border border-yellow-500/20 text-yellow-500 font-mono text-[9px] font-bold uppercase tracking-widest animate-pulse">
            Demo Sandbox metrics Active
          </span>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Documents */}
        <div className="glass-card border border-cyber-border rounded-3xl p-6 flex items-center gap-4 bg-gradient-to-tr from-purple-950/10 via-slate-950/10 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/20 border border-cyber-neonPurple/20 flex items-center justify-center text-cyber-neonPurple shadow-inner">
            <FileText className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-cyber-textMuted font-bold uppercase tracking-widest">Documents Scanned</p>
            <p className="text-2xl font-extrabold text-slate-100 mt-0.5">{stats.totalSummariesCount}</p>
          </div>
        </div>

        {/* Total Words */}
        <div className="glass-card border border-cyber-border rounded-3xl p-6 flex items-center gap-4 bg-gradient-to-tr from-cyan-950/10 via-slate-950/10 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/20 border border-cyber-neonCyan/20 flex items-center justify-center text-cyber-neonCyan shadow-inner">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-cyber-textMuted font-bold uppercase tracking-widest">Total Words Count</p>
            <p className="text-2xl font-extrabold text-slate-100 mt-0.5">
              {stats.totalWordsProcessed.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Reading Time Saved */}
        <div className="glass-card border border-cyber-border rounded-3xl p-6 flex items-center gap-4 bg-gradient-to-tr from-emerald-950/10 via-slate-950/10 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/20 border border-cyber-neonEmerald/20 flex items-center justify-center text-cyber-neonEmerald shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-cyber-textMuted font-bold uppercase tracking-widest">Minutes Saved</p>
            <p className="text-2xl font-extrabold text-slate-100 mt-0.5">
              {stats.readingTimeSaved} min
            </p>
          </div>
        </div>

        {/* Complexity Index */}
        <div className="glass-card border border-cyber-border rounded-3xl p-6 flex items-center gap-4 bg-gradient-to-tr from-pink-950/10 via-slate-950/10 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-pink-950/20 border border-cyber-neonPink/20 flex items-center justify-center text-cyber-neonPink shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-cyber-textMuted font-bold uppercase tracking-widest">Complexity Average</p>
            <p className="text-2xl font-extrabold text-slate-100 mt-0.5">{stats.averageComplexity}/100</p>
          </div>
        </div>

      </div>

      {/* Visual Graphs layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Topic Frequency Bar Chart */}
        <div className="glass-card border border-cyber-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
            <BarChart3 className="w-4 h-4 text-cyber-neonCyan" />
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">Thematic Topic Frequency</h4>
          </div>
          
          <div className="h-72 w-full pt-4">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(17, 24, 39, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '11px',
                      fontFamily: 'Outfit, sans-serif'
                    }} 
                  />
                  <Bar dataKey="Frequency" radius={[4, 4, 0, 0]}>
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#a855f7' : '#06b6d4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-cyber-textMuted font-medium">
                Insufficient documents to plot topic frequency metrics.
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Ratios Pie Chart */}
        <div className="glass-card border border-cyber-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
            <LucidePieChart className="w-4 h-4 text-cyber-neonPink" />
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">Sentiment Profile distribution</h4>
          </div>

          <div className="h-72 w-full pt-4 flex flex-col items-center justify-center">
            {sentimentData.length > 0 ? (
              <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4">
                
                {/* Pie drawing */}
                <div className="w-1/2 h-full min-h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(17, 24, 39, 0.9)', 
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontSize: '11px',
                          fontFamily: 'Outfit, sans-serif'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Floating center tag */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-cyber-textMuted uppercase font-bold tracking-wider">Index Target</span>
                    <span className="text-lg font-extrabold text-slate-100">AI Tone</span>
                  </div>
                </div>

                {/* Custom list description legend */}
                <div className="flex flex-col gap-2 p-2">
                  {sentimentData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3 text-xs font-medium">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                      <span className="text-slate-300">{entry.name} Profiles:</span>
                      <span className="text-white font-extrabold">{entry.value} docs</span>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-cyber-textMuted font-medium">
                Insufficient documents to plot sentiment distribution.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsBoard;
