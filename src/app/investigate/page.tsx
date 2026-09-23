"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  Plus,
  CheckCircle,
  FileAudio,
  Play,
  Pause,
  Settings,
  FileText,
  Search,
  Shield,
  Loader2,
  Lock,
  Zap,
  Globe,
  Check,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvestigatePage() {
  const router = useRouter();
  const [state, setState] = useState<1 | 2 | 3 | 4>(1); // 4 = error state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State 2 props
  const [isPlaying, setIsPlaying] = useState(false);

  // State 3 props
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(12);

  // Circular progress math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setState(2);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setState(2);
    }
  };

  // Mock a file if user clicks Record or Fetch for demo purposes
  const simulateFileSelect = () => {
    const dummyBlob = new Blob(["mock audio data"], { type: "audio/mp3" });
    const dummyFile = new File([dummyBlob], "voice_note_sample.mp3", { type: "audio/mp3" });
    setSelectedFile(dummyFile);
    setState(2);
  };

  const handleStartInvestigation = async () => {
    if (!selectedFile) return;
    
    setState(3);
    setProgress(0);
    setTimeLeft(12);
    setActiveStage(1);

    try {
      // Stage 1
      setProgress(15);
      await new Promise(r => setTimeout(r, 800));
      
      // Stage 2
      setActiveStage(2);
      setProgress(30);
      setTimeLeft(10);
      
      const formData = new FormData();
      formData.append("audio", selectedFile);
      
      const response = await fetch("/api/investigate", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Investigation failed");
      
      const result = await response.json();
      
      // Stage 3
      setProgress(60);
      setActiveStage(3);
      setTimeLeft(5);
      await new Promise(r => setTimeout(r, 1000));
      
      // Stage 4
      setProgress(85);
      setActiveStage(4);
      setTimeLeft(2);
      await new Promise(r => setTimeout(r, 800));
      
      setProgress(100);
      setActiveStage(5);
      setTimeLeft(0);
      
      // Store result and navigate
      sessionStorage.setItem("sonaReport", JSON.stringify(result));
      
      await new Promise(r => setTimeout(r, 1000));
      router.push("/report");
      
    } catch (error) {
      console.error("Investigation failed:", error);
      setState(4); // Error state
    }
  };

  const handleCancel = () => {
    setState(1);
    setProgress(0);
    setActiveStage(1);
    setSelectedFile(null);
  };

  const fadeVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8FAFC] flex flex-col font-sans pb-24 md:pb-0 relative overflow-x-hidden">
      {/* TOP BAR */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/10 h-16">
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <span className="text-xl">🎙️</span>
            <span className="text-xl font-bold">SONA</span>
          </div>

          <button
            onClick={handleCancel}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            New Investigation
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4 sm:px-6 relative z-10 w-full">
        <AnimatePresence mode="wait">
          {/* STATE 1: UPLOAD SCREEN */}
          {state === 1 && (
            <motion.div
              key="state-1"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-[600px] flex flex-col items-center"
            >
              <motion.div
                animate={
                  isDragging
                    ? { boxShadow: "0 0 40px rgba(124,58,237,0.5)" }
                    : { boxShadow: ["0 0 0px rgba(124,58,237,0)", "0 0 30px rgba(124,58,237,0.2)", "0 0 0px rgba(124,58,237,0)"] }
                }
                transition={{
                  boxShadow: {
                    duration: isDragging ? 0.2 : 3,
                    repeat: isDragging ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full p-8 rounded-2xl border-2 border-dashed transition-colors duration-300 flex flex-col items-center text-center ${
                  isDragging
                    ? "border-[#7C3AED] bg-[#7C3AED]/10"
                    : "border-[#7C3AED]/50 bg-white/5 backdrop-blur-md"
                }`}
              >
                <div className="w-20 h-20 bg-[#7C3AED]/10 rounded-full flex items-center justify-center mb-6">
                  <Mic className="text-[#7C3AED]" size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Drop your audio file here
                </h2>
                <p className="text-[#94A3B8] mb-8">
                  Supports MP3, WAV, OGG, M4A — up to 50MB
                </p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="audio/*" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary mb-8 min-h-[48px]"
                >
                  Browse Files
                </button>

                <div className="w-full flex items-center gap-4 mb-8">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-[#94A3B8] text-sm">— or —</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="w-full text-left mb-8">
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                    Paste an audio URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/audio.mp3"
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7C3AED] transition-colors min-h-[48px]"
                    />
                    <button
                      onClick={simulateFileSelect}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors font-medium min-h-[48px]"
                    >
                      Fetch
                    </button>
                  </div>
                </div>

                <div className="w-full flex items-center gap-4 mb-8">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-[#94A3B8] text-sm">— or —</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button
                  onClick={simulateFileSelect}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-white/10 hover:border-[#EF4444]/50 hover:bg-[#EF4444]/5 text-white transition-all group min-h-[48px]"
                >
                  <div className="w-3 h-3 bg-[#EF4444] rounded-full group-hover:animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                  <span className="font-medium">Record Live Audio</span>
                </button>
              </motion.div>

              {/* Info Pills */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[#94A3B8]">
                  <Lock size={14} className="text-white/70" />
                  Private by default
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[#94A3B8]">
                  <Zap size={14} className="text-[#F59E0B]" />
                  Results in ~12 seconds
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[#94A3B8]">
                  <Globe size={14} className="text-[#06B6D4]" />
                  Multilingual support
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 2: FILE SELECTED PREVIEW */}
          {state === 2 && (
            <motion.div
              key="state-2"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-[600px]"
            >
              <div className="glass-card p-6 md:p-8 w-full relative">
                <div className="absolute top-6 right-6">
                  <CheckCircle className="text-[#10B981]" size={24} />
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center border border-[#7C3AED]/30">
                    <FileAudio className="text-[#7C3AED]" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold truncate max-w-[200px] sm:max-w-[300px]">
                      {selectedFile?.name || "voice_note_sample.mp3"}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-[#94A3B8] mt-1">
                      <span>{selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(1) : "2.4"} MB</span>
                      <span className="w-1 h-1 bg-[#94A3B8] rounded-full"></span>
                      <span>Audio File</span>
                    </div>
                  </div>
                </div>

                {/* Audio Waveform Simulator */}
                <div className="w-full h-24 flex items-end gap-1 mb-4">
                  {[...Array(40)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#7C3AED] rounded-t-sm opacity-80"
                      initial={{ height: "10%" }}
                      animate={
                        isPlaying
                          ? {
                              height: [
                                `${Math.random() * 40 + 20}%`,
                                `${Math.random() * 80 + 20}%`,
                                `${Math.random() * 40 + 20}%`,
                              ],
                            }
                          : {
                              height: `${
                                Math.sin(i * 0.5) * 30 +
                                Math.cos(i * 0.2) * 20 +
                                30
                              }%`,
                            }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 0.8 + Math.random() * 0.4,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-2 mb-8">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-[#7C3AED]"
                      initial={{ width: "0%" }}
                      animate={{ width: isPlaying ? "100%" : "0%" }}
                      transition={{ duration: 43, ease: "linear" }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                    <span className="text-[#94A3B8] font-mono text-xs">
                      Ready to process
                    </span>
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-8"></div>

                <button
                  onClick={handleStartInvestigation}
                  className="w-full btn-primary flex justify-center items-center gap-2 py-4 text-lg font-bold mb-3 min-h-[56px]"
                >
                  Start Investigation &rarr;
                </button>
                <p className="text-center text-sm text-[#94A3B8] mb-6">
                  May take 30-60 seconds depending on file length
                </p>

                <button
                  onClick={handleCancel}
                  className="w-full btn-ghost py-3 min-h-[48px]"
                >
                  Choose Different File
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 3: ANALYSIS IN PROGRESS */}
          {state === 3 && (
            <motion.div
              key="state-3"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-[600px] relative"
            >
              <div className="glass-card p-6 md:p-10 w-full relative overflow-hidden">
                {/* Success Flash Overlay */}
                <AnimatePresence>
                  {progress === 100 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#10B981] pointer-events-none z-0"
                    />
                  )}
                </AnimatePresence>

                <div className="text-center mb-8 mt-2 relative z-10">
                  <motion.h2 
                    key={progress === 100 ? "complete" : "investigating"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-3xl font-bold mb-2 ${progress === 100 ? "text-[#10B981]" : "text-white"}`}
                  >
                    {progress === 100 ? "Investigation Complete!" : "Investigating..."}
                  </motion.h2>
                  <p className="text-[#94A3B8]">{selectedFile?.name || "voice_note_sample.mp3"}</p>
                </div>

                {/* Animated Circular Progress */}
                <div className="flex flex-col items-center mb-10 relative z-10">
                  <svg width="140" height="140" className="-rotate-90">
                    <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <motion.circle 
                      cx="70" cy="70" r={radius} 
                      fill="none" 
                      stroke={progress === 100 ? "#10B981" : "#7C3AED"} 
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.2, ease: "linear" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <AnimatePresence mode="wait">
                      {progress === 100 ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          <Check size={48} className="text-[#10B981]" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="percent"
                          className="text-3xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {Math.round(progress)}%
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex flex-col gap-6 mb-10 relative z-10">
                  {/* Stage 1 */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        activeStage > 1
                          ? "bg-[#10B981]/20 text-[#10B981]"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {activeStage > 1 ? <Check size={20} /> : <Settings size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${activeStage > 1 ? "text-[#10B981]" : "text-white"}`}>
                        Processing Audio
                      </h4>
                      <p className="text-[#94A3B8] text-sm mt-1">Audio cleaned and prepared</p>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        activeStage > 2 ? "bg-[#10B981]/20 text-[#10B981]" : activeStage === 2 ? "bg-[#7C3AED]/20 text-[#7C3AED]" : "bg-white/10 text-[#94A3B8]"
                      }`}
                    >
                      {activeStage > 2 ? <Check size={20} /> : activeStage === 2 ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${activeStage > 2 ? "text-[#10B981]" : activeStage === 2 ? "text-[#7C3AED]" : "text-[#94A3B8]"}`}>
                        Transcribing & Analyzing
                      </h4>
                      <p className="text-[#94A3B8] text-sm mt-1">Running via Whisper and Claude...</p>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        activeStage > 3 ? "bg-[#10B981]/20 text-[#10B981]" : activeStage === 3 ? "bg-[#7C3AED]/20 text-[#7C3AED]" : "bg-white/10 text-[#94A3B8]"
                      }`}
                    >
                      {activeStage > 3 ? <Check size={20} /> : activeStage === 3 ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${activeStage > 3 ? "text-[#10B981]" : activeStage === 3 ? "text-[#7C3AED]" : "text-[#94A3B8]"}`}>
                        Extracting Claims
                      </h4>
                      <p className="text-[#94A3B8] text-sm mt-1">Identifying verifiable statements</p>
                    </div>
                  </div>

                  {/* Stage 4 */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        activeStage > 4 ? "bg-[#10B981]/20 text-[#10B981]" : activeStage === 4 ? "bg-[#7C3AED]/20 text-[#7C3AED]" : "bg-white/10 text-[#94A3B8]"
                      }`}
                    >
                      {activeStage > 4 ? <Check size={20} /> : activeStage === 4 ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${activeStage > 4 ? "text-[#10B981]" : activeStage === 4 ? "text-[#7C3AED]" : "text-[#94A3B8]"}`}>
                        Investigating Evidence
                      </h4>
                      <p className="text-[#94A3B8] text-sm mt-1">Checking live web sources</p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-black/40 rounded-xl p-4 flex items-center justify-between border border-white/5 relative z-10">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-xl">⏱</span>
                    <span className="text-white/80">Estimated time remaining:</span>
                  </div>
                  <span className="font-bold text-lg text-white">{timeLeft} seconds</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 4: ERROR SCREEN */}
          {state === 4 && (
            <motion.div
              key="state-4"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-[600px]"
            >
              <div className="glass-card border-l-[4px] border-l-[#EF4444] p-8 flex flex-col items-center text-center">
                <XCircle size={64} className="text-[#EF4444] mb-6" />
                <h2 className="text-2xl font-bold mb-4 text-white">Investigation Failed</h2>
                <p className="text-[#94A3B8] mb-8 max-w-md">
                  We encountered an error communicating with the AI pipeline. Please check your audio file and try again.
                </p>
                <button
                  onClick={handleCancel}
                  className="btn-primary min-h-[48px] px-8"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 w-full bg-[#0A0A0F] border-t border-white/10 p-4 z-50 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎙️</span>
          <span className="font-bold text-white">SONA</span>
        </div>
        <div className="text-sm font-medium text-[#7C3AED]">
          {state === 1 && "1. Upload"}
          {state === 2 && "2. Review"}
          {state === 3 && "3. Investigating"}
          {state === 4 && "Failed"}
        </div>
      </div>
    </div>
  );
}
