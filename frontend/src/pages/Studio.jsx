import React, { useState, useEffect, useRef } from 'react';
import { useSummaries } from '../context/SummaryContext';
import KnowledgeGraph from '../components/KnowledgeGraph';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  ListChecks, 
  HelpCircle, 
  Network, 
  FileEdit,
  Save,
  CheckCircle,
  XCircle,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Studio = () => {
  const { 
    activeSummary, 
    setActiveSummary,
    summarizeText, 
    summarizeFile, 
    fetchNote, 
    saveNote,
    loading 
  } = useSummaries();

  // Input states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Workspace Viewer states
  const [activeTab, setActiveTab] = useState('summary'); // summary, highlights, quiz, graph, notes
  
  // Custom Notes state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Interactive Quiz states
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionIndex: chosenOptionText }

  // Load custom note whenever the active summary changes
  useEffect(() => {
    if (activeSummary) {
      const loadNoteData = async () => {
        const noteData = await fetchNote(activeSummary._id);
        if (noteData) {
          setNoteTitle(noteData.noteTitle);
          setNoteContent(noteData.noteContent);
        } else {
          setNoteTitle(`Study Guide - ${activeSummary.title}`);
          setNoteContent(activeSummary.studyNotes || '');
        }
      };
      loadNoteData();
      
      // Reset quiz responses
      setQuizAnswers({});
    }
  }, [activeSummary]);

  // File Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Submit generators
  const handleProcess = async (e) => {
    e.preventDefault();
    if (file) {
      await summarizeFile(title, file);
    } else {
      await summarizeText(title, content);
    }
  };

  // Save revision note
  const handleSaveNote = async () => {
    if (!activeSummary) return;
    setSavingNote(true);
    await saveNote(activeSummary._id, noteTitle, noteContent);
    setSavingNote(false);
  };

  // Grade Quiz handler
  const handleQuizSelect = (questionIdx, optionText) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIdx]: optionText
    }));
  };

  const handleResetWorkspace = () => {
    setActiveSummary(null);
    setTitle('');
    setContent('');
    setFile(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title bar */}
      <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyber-neonCyan" />
            AI SUMMARY STUDIO
          </h2>
          <p className="text-xs text-cyber-textMuted mt-0.5">
            Deploy cognitive networks to read, summarize, highlight, and quiz contents
          </p>
        </div>

        {activeSummary && (
          <button
            onClick={handleResetWorkspace}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-cyber-border hover:border-cyber-neonCyan hover:bg-slate-900/40 text-slate-300 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            New Summarization
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==================================================================
            1. LOADING SKELETON SCREEN
            ================================================================== */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card border border-cyber-border rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center space-y-8"
          >
            {/* Spinning Neon Core */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-t-4 border-cyber-neonCyan animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-b-4 border-cyber-neonPurple animate-spin duration-1500"></div>
              <div className="absolute inset-6 rounded-full border-r-4 border-cyber-neonPink animate-spin duration-3000"></div>
              <div className="absolute inset-9 rounded-full bg-slate-900 flex items-center justify-center text-xs font-extrabold text-cyber-neonCyan animate-pulse">
                AI
              </div>
            </div>

            <div className="text-center max-w-md">
              <h3 className="text-lg font-bold text-slate-100 tracking-tight">Compiling Cognitive Networks...</h3>
              <p className="text-xs text-cyber-textMuted mt-2 leading-relaxed animate-pulse">
                Parsing structures, indexing semantics, calculating sentiment matrices, mapping keyword graphs, and deploying revision quizes.
              </p>
            </div>

            {/* Simulated loading bars */}
            <div className="w-full max-w-sm space-y-3">
              <div className="h-2 w-full bg-slate-950/60 rounded-full overflow-hidden relative border border-cyber-border">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-cyber-neonCyan via-cyber-neonPurple to-cyber-neonPink"
                ></motion.div>
              </div>
              <div className="flex justify-between text-[9px] text-cyber-textMuted font-mono">
                <span>METRICS CALC</span>
                <span className="animate-pulse">SEMANTIC MATCHING</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================
            2. INPUT GATHERING SCREEN (No Summary loaded)
            ================================================================== */}
        {!loading && !activeSummary && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            
            {/* Input Form Column (Left 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleProcess} className="glass-card border border-cyber-border rounded-3xl p-6 md:p-8 space-y-5">
                
                {/* Custom Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Document Index Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cognitive Systems Research Blueprint"
                    className="w-full px-4 py-3 rounded-xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-sm"
                  />
                </div>

                {/* Upload or Paste Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Content Input Core</label>
                  
                  {!file ? (
                    /* Text Area */
                    <textarea
                      required={!file}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste your long-form articles, reports, books, or notes here (min 50 chars)..."
                      className="w-full h-80 px-4 py-3 rounded-xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-sm resize-none font-sans"
                    />
                  ) : (
                    /* Locked File Panel */
                    <div className="h-80 flex flex-col items-center justify-center border border-dashed border-cyber-neonCyan/40 rounded-xl bg-cyan-950/5 p-6">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-950/20 border border-cyber-neonCyan/20 flex items-center justify-center text-cyber-neonCyan mb-4">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-semibold text-slate-200">{file.name}</p>
                      <p className="text-xs text-cyber-textMuted mt-1">({(file.size / (1024 * 1024)).toFixed(2)} MB PDF/Text file ready)</p>
                      
                      <button
                        type="button"
                        onClick={() => { setFile(null); }}
                        className="mt-4 px-4 py-1.5 text-xs rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Remove Attachment
                      </button>
                    </div>
                  )}
                </div>

                {/* Submission button */}
                <button
                  type="submit"
                  disabled={!title || (!content && !file)}
                  className="w-full py-4 rounded-xl font-extrabold text-sm btn-neon-cyan flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>DECRYPT & SUMMARIZE</span>
                </button>
              </form>
            </div>

            {/* Drag Drop & Guidelines Column (Right 1/3) */}
            <div className="space-y-6">
              
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 p-6 text-center ${
                  dragOver 
                    ? 'border-cyber-neonPurple bg-purple-950/10 shadow-lg shadow-purple-500/5' 
                    : 'border-cyber-border hover:border-cyber-neonPurple hover:bg-slate-900/20'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.txt"
                  className="hidden"
                />
                
                <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-cyber-border flex items-center justify-center text-cyber-neonPurple mb-4 shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                
                <h4 className="text-sm font-bold text-slate-200">Import Document Buffer</h4>
                <p className="text-xs text-cyber-textMuted mt-2 max-w-xs leading-relaxed">
                  Drag and drop your PDF or Plain Text (.txt) file directly here, or click to browse local files.
                </p>
                <span className="text-[10px] font-mono text-cyber-neonPurple uppercase font-bold mt-4 tracking-widest">
                  Maximum 10MB Files
                </span>
              </div>

              {/* Unique Features Card */}
              <div className="glass-card border border-cyber-border rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-cyber-neonPink uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  AI Cognitive Matrix
                </h3>
                <ul className="space-y-3.5 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-neonCyan mt-1.5"></div>
                    <span>Instant multi-format context paragraphing and structural executive overviews.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-neonPurple mt-1.5"></div>
                    <span>Visual concentric semantic networks linking keywords and conceptual dependencies.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-neonPink mt-1.5"></div>
                    <span>Automatic sentence importance highlighting matching vocabulary definitions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-neonEmerald mt-1.5"></div>
                    <span>Self-grading flashcard review quizzes explaining logical citations.</span>
                  </li>
                </ul>
              </div>

            </div>

          </motion.div>
        )}

        {/* ==================================================================
            3. WORKSPACE VIEWER (Summary is loaded)
            ================================================================== */}
        {!loading && activeSummary && (
          <motion.div
            key="workspace-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            
            {/* Document Header Card */}
            <div className="glass-card border border-cyber-border rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-purple-950/10 via-slate-950/20 to-cyan-950/10">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 font-mono text-[9px] border border-cyber-border font-bold uppercase tracking-widest">
                    Complexity: {activeSummary.metrics.complexityScore}/100
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 font-mono text-[9px] border border-cyber-border font-bold uppercase tracking-widest">
                    Sentiment: {activeSummary.metrics.sentimentLabel} ({activeSummary.metrics.sentimentScore > 0 ? '+' : ''}{activeSummary.metrics.sentimentScore.toFixed(2)})
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 font-mono text-[9px] border border-cyber-border font-bold uppercase tracking-widest">
                    Est. Read: {activeSummary.metrics.readingTime} min
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {activeSummary.title}
                </h3>
                <div className="flex flex-wrap gap-1 text-xs text-cyber-textMuted">
                  {activeSummary.keywords.slice(0, 5).map((kw, i) => (
                    <span key={i} className="hover:text-cyber-neonCyan transition-colors">
                      #{kw}{i < 4 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side Stats block */}
              <div className="flex gap-4 border-l-0 md:border-l border-cyber-border pl-0 md:pl-6">
                <div className="text-center">
                  <p className="text-[10px] text-cyber-textMuted uppercase font-bold tracking-widest">Words Scanned</p>
                  <p className="text-2xl font-extrabold text-cyber-neonCyan mt-1">
                    {activeSummary.rawContent.split(/\s+/).length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-cyber-textMuted uppercase font-bold tracking-widest">Key Terms</p>
                  <p className="text-2xl font-extrabold text-cyber-neonPurple mt-1">
                    {activeSummary.keywords.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex bg-slate-950/40 p-1.5 rounded-2xl border border-cyber-border overflow-x-auto whitespace-nowrap scrollbar-none">
              {[
                { id: 'summary', name: 'AI Summary Studio', icon: BookOpen, color: 'hover:text-cyber-neonCyan' },
                { id: 'highlights', name: 'Highlight Detector', icon: ListChecks, color: 'hover:text-cyber-neonPink' },
                { id: 'quiz', name: 'Smart Questions', icon: HelpCircle, color: 'hover:text-cyber-neonEmerald' },
                { id: 'graph', name: 'Knowledge Graph', icon: Network, color: 'hover:text-cyber-neonPurple' },
                { id: 'notes', name: 'Saved Notes Editor', icon: FileEdit, color: 'hover:text-cyber-neonCyan' }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-slate-900 border border-cyber-border text-white shadow-inner shadow-cyan-500/5' 
                        : `text-slate-400 ${tab.color}`
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 ${isActive ? 'text-cyber-neonCyan' : ''}`} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* ==================================================================
                WORKSPACES RENDER
                ================================================================== */}
            <div className="min-h-96">
              <AnimatePresence mode="wait">
                
                {/* 3a. Summary Studio Workspace */}
                {activeTab === 'summary' && (
                  <motion.div
                    key="summary-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    
                    {/* Primary text content (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Deep Context Synthesis Paragraph */}
                      <div className="glass-card border border-cyber-border rounded-3xl p-6 md:p-8 space-y-4">
                        <h4 className="text-xs font-extrabold text-cyber-neonCyan uppercase tracking-widest flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Contextual Synthesis overview
                        </h4>
                        <p className="text-slate-200 text-sm leading-relaxed font-normal">
                          {activeSummary.summaryText}
                        </p>
                      </div>

                      {/* Executive summary pitch */}
                      <div className="glass-card border border-cyber-border rounded-3xl p-6 md:p-8 space-y-4 bg-gradient-to-tr from-cyan-950/5 via-slate-950/10 to-purple-950/5">
                        <h4 className="text-xs font-extrabold text-cyber-neonPurple uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          Actionable Executive Briefing
                        </h4>
                        <p className="text-slate-200 text-sm leading-relaxed font-normal">
                          {activeSummary.executiveSummary}
                        </p>
                      </div>

                    </div>

                    {/* Structural bullet keypoints (Right 1/3) */}
                    <div className="space-y-6">
                      <div className="glass-card border border-cyber-border rounded-3xl p-6 space-y-5 h-full">
                        <h4 className="text-xs font-extrabold text-cyber-neonPink uppercase tracking-widest flex items-center gap-2">
                          <ListChecks className="w-4 h-4" />
                          AI Key takeaways
                        </h4>
                        <ul className="space-y-4">
                          {activeSummary.bulletPoints.map((pt, idx) => (
                            <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-300 font-medium">
                              <span className="w-5 h-5 rounded-full bg-slate-900 border border-cyber-border flex items-center justify-center text-cyber-neonPink font-mono text-[9px] font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* 3b. Highlight Detector Workspace */}
                {activeTab === 'highlights' && (
                  <motion.div
                    key="highlights-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-card border border-cyber-border rounded-3xl p-6 md:p-8 space-y-6"
                  >
                    <div className="border-b border-cyber-border/40 pb-4">
                      <h4 className="text-xs font-extrabold text-cyber-neonPink uppercase tracking-widest flex items-center gap-2">
                        <ListChecks className="w-4 h-4" />
                        AI Highlight Scanner
                      </h4>
                      <p className="text-[10px] text-cyber-textMuted mt-1">
                        Highlighted crucial structural boundaries, vocabulary definitions, and analytical deductions
                      </p>
                    </div>

                    {/* Document display */}
                    <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 text-slate-300 text-sm leading-relaxed font-sans select-text">
                      {activeSummary.highlights && activeSummary.highlights.length > 0 ? (
                        <>
                          <p className="bg-slate-900/30 p-4 border border-cyber-border rounded-xl">
                            {activeSummary.rawContent.split(/[.!?]+/).map((sentence, idx) => {
                              const cleanSent = sentence.trim();
                              if (!cleanSent) return null;
                              
                              // Find if this sentence is matches one of the high-weight sentences
                              const isHighlight = activeSummary.highlights.find(
                                h => h.text.toLowerCase().includes(cleanSent.toLowerCase()) || 
                                     cleanSent.toLowerCase().includes(h.text.toLowerCase())
                              );

                              if (isHighlight) {
                                return (
                                  <span 
                                    key={idx} 
                                    className={`px-1.5 py-0.5 mx-0.5 rounded font-medium border text-white transition-all cursor-help ${
                                      isHighlight.type === 'vocabulary' 
                                        ? 'bg-purple-950/40 border-purple-500/30 hover:bg-purple-900/50' 
                                        : 'bg-cyan-950/40 border-cyan-500/30 hover:bg-cyan-900/50'
                                    }`}
                                    title={isHighlight.type === 'vocabulary' ? 'Key Concept/Vocabulary Definition' : 'AI Identified Critical Claim'}
                                  >
                                    {cleanSent}.
                                  </span>
                                );
                              }
                              return <span key={idx}>{cleanSent}. </span>;
                            })}
                          </p>
                        </>
                      ) : (
                        <p>{activeSummary.rawContent}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 3c. Quiz Questions Workspace */}
                {activeTab === 'quiz' && (
                  <motion.div
                    key="quiz-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {activeSummary.quizQuestions.map((quiz, qIdx) => {
                      const userChoice = quizAnswers[qIdx];
                      const isCorrect = userChoice === quiz.answer;
                      const hasAnswered = !!userChoice;

                      return (
                        <div 
                          key={qIdx}
                          className="glass-card border border-cyber-border rounded-3xl p-6 flex flex-col justify-between space-y-5 bg-slate-950/20"
                        >
                          {/* Question header */}
                          <div className="space-y-3">
                            <span className="px-3 py-1 rounded-full bg-slate-900 border border-cyber-border text-cyber-neonEmerald font-mono text-[9px] font-bold uppercase tracking-widest">
                              Review Item {qIdx + 1}
                            </span>
                            <h5 className="text-slate-200 text-sm font-bold leading-relaxed">
                              {quiz.question}
                            </h5>
                          </div>

                          {/* Options grid */}
                          <div className="space-y-2">
                            {quiz.options.map((opt, optIdx) => {
                              const isChosen = userChoice === opt;
                              const isThisCorrect = opt === quiz.answer;
                              
                              let optStyles = 'border-cyber-border bg-slate-900/20 text-slate-300 hover:border-slate-700';
                              
                              if (hasAnswered) {
                                if (isChosen) {
                                  optStyles = isCorrect 
                                    ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300' 
                                    : 'border-red-500 bg-red-950/20 text-red-300';
                                } else if (isThisCorrect) {
                                  // Reveal correct answer if user got it wrong
                                  optStyles = 'border-emerald-500/60 bg-emerald-950/10 text-emerald-400';
                                } else {
                                  optStyles = 'border-cyber-border/40 text-slate-500 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={hasAnswered}
                                  onClick={() => handleQuizSelect(qIdx, opt)}
                                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all duration-300 flex items-center justify-between ${optStyles}`}
                                >
                                  <span>{opt}</span>
                                  {hasAnswered && isChosen && (
                                    isCorrect 
                                      ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                      : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation block */}
                          <AnimatePresence>
                            {hasAnswered && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-3 border-t border-cyber-border/60 text-[11px] leading-relaxed text-cyber-textMuted"
                              >
                                <strong className="text-slate-300 uppercase tracking-widest text-[9px] block mb-1">
                                  AI Citations & Logic:
                                </strong>
                                {quiz.explanation}
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* 3d. Knowledge Graph Workspace */}
                {activeTab === 'graph' && (
                  <motion.div
                    key="graph-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full"
                  >
                    <KnowledgeGraph graph={activeSummary.knowledgeGraph} />
                  </motion.div>
                )}

                {/* 3e. Saved Notes Editor Workspace */}
                {activeTab === 'notes' && (
                  <motion.div
                    key="notes-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-card border border-cyber-border rounded-3xl p-6 md:p-8 space-y-6"
                  >
                    
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border/40 pb-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-cyber-neonCyan uppercase tracking-widest flex items-center gap-2">
                          <FileEdit className="w-4 h-4" />
                          Study blueprints & revisions editor
                        </h4>
                        <p className="text-[10px] text-cyber-textMuted mt-1">
                          Edit the AI-generated study blueprint below. Your changes will be locked in the Memory Vault.
                        </p>
                      </div>

                      <button
                        onClick={handleSaveNote}
                        disabled={savingNote}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs btn-neon-cyan flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {savingNote ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Lock Note into Vault</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Note title */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revision Title</label>
                      <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-sm font-bold"
                      />
                    </div>

                    {/* Editor core text area */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Markdown blueprint content</label>
                      <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full h-96 px-4 py-4 rounded-xl border border-cyber-border bg-slate-900/40 text-slate-100 cyber-input text-xs font-mono resize-none leading-relaxed"
                      />
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Studio;
