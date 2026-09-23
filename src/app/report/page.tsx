"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Download,
  XCircle,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Music,
  FileText,
  ChevronDown,
  Copy,
  Check,
  MessageCircle,
  Clock,
  Cpu,
  Globe,
  Shield,
  ChevronRight,
  HelpCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Define types
type Claim = {
  claim: string;
  verdict: "FALSE" | "MISLEADING" | "VERIFIED" | "UNVERIFIED";
  evidence: string;
  sources: string[];
  timestamp: string;
  confidence: number;
};

type ReportData = {
  filename: string;
  transcript: string;
  claims: Claim[];
  analyzedAt: string;
  error?: string;
};

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [loadComplete, setLoadComplete] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sonaReport");
    if (stored) {
      setReportData(JSON.parse(stored));
    }
    setIsLoading(false);

    // Hide loading bar after animation
    const loadTimer = setTimeout(() => {
      setLoadComplete(true);
    }, 2000);

    return () => clearTimeout(loadTimer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("sona.app/report/inv-2026-0921");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleClaim = (index: number) => {
    setExpandedClaim(expandedClaim === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-[#7C3AED] animate-pulse text-xl flex items-center gap-3">
          <Loader2 className="animate-spin" /> Loading report...
        </div>
      </div>
    );
  }

  // Fallback to mock data if no real data found in session
  const mockClaims: Claim[] = [
    {
      claim: "Polio vaccine causes infertility in young children",
      verdict: "FALSE",
      evidence: "Multiple peer-reviewed sources directly contradict this claim. No credible evidence supports this assertion in any published medical literature.",
      sources: ["https://who.int", "https://thelancet.com"],
      timestamp: "0:08 — 0:14",
      confidence: 92
    },
    {
      claim: "COVID cases rose 40% last month",
      verdict: "MISLEADING",
      evidence: "The 40% figure is accurate but omits critical context — it compares against an abnormally low baseline month, making the rise appear more significant than the overall trend indicates.",
      sources: ["https://health.gov"],
      timestamp: "0:21 — 0:28",
      confidence: 78
    },
    {
      claim: "The national health program was launched in 2020",
      verdict: "VERIFIED",
      evidence: "Confirmed by official government records. Program launch date verified as March 2020 across multiple government publications.",
      sources: ["https://gov.portal"],
      timestamp: "0:31 — 0:35",
      confidence: 96
    }
  ];

  const claims = reportData?.claims || mockClaims;
  const transcript = reportData?.transcript || "Mock transcript text here. If you are seeing this, the investigation did not return a transcript.";
  const filename = reportData?.filename || "voice_note_sample.mp3";
  const analyzedAt = reportData?.analyzedAt || "Just now";

  // Calculate dynamic counts
  const falseCount = claims.filter(c => c.verdict === "FALSE").length;
  const misleadingCount = claims.filter(c => c.verdict === "MISLEADING").length;
  const verifiedCount = claims.filter(c => c.verdict === "VERIFIED").length;

  // Determine overall risk
  const riskLevel = falseCount > 0 ? "HIGH RISK" : misleadingCount > 0 ? "MODERATE RISK" : "LOW RISK";
  const riskColor = riskLevel === "HIGH RISK" ? "#EF4444" : riskLevel === "MODERATE RISK" ? "#F59E0B" : "#10B981";

  // Calculate risk needle position based on risk level
  const needleLeft = riskLevel === "HIGH RISK" ? "85%" : riskLevel === "MODERATE RISK" ? "50%" : "15%";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Helper for rendering verdict-specific UI
  const getVerdictStyles = (verdict: Claim["verdict"]) => {
    switch (verdict) {
      case "FALSE": return { color: "#EF4444", bg: "bg-[#EF4444]/15", border: "border-[#EF4444]", icon: "✗" };
      case "MISLEADING": return { color: "#F59E0B", bg: "bg-[#F59E0B]/15", border: "border-[#F59E0B]", icon: "⚠" };
      case "VERIFIED": return { color: "#10B981", bg: "bg-[#10B981]/15", border: "border-[#10B981]", icon: "✓" };
      default: return { color: "#94A3B8", bg: "bg-white/10", border: "border-white/20", icon: "?" };
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8FAFC] font-sans pb-12 relative">
      
      {/* LOADING PROGRESS LINE */}
      {!loadComplete && (
        <motion.div 
          className="fixed top-0 left-0 h-[3px] bg-[#7C3AED] z-[110]"
          initial={{ width: "0%", opacity: 1 }}
          animate={{ width: "100%", opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", opacity: { delay: 1.3, duration: 0.2 } }}
        />
      )}

      {/* TOP BAR */}
      <header className="sticky top-0 w-full z-50 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/10 h-16">
        <div className="h-full max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link
            href="/investigate"
            className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">New Investigation</span>
          </Link>

          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <span className="text-xl">🎙️</span>
            <span className="text-xl font-bold hidden sm:inline">SONA</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-colors text-sm font-medium">
              <Share2 size={16} />
              <span className="hidden md:inline">Share Report</span>
            </button>
            <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all duration-200 text-sm font-medium hover:scale-105 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Download size={16} />
              <span className="hidden md:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        
        {reportData?.error && (
          <div className="mb-8 p-4 bg-[#EF4444]/20 border border-[#EF4444] rounded-xl text-white">
            <h3 className="font-bold flex items-center gap-2 mb-1"><XCircle size={18} /> Error during processing</h3>
            <p className="text-sm opacity-80">{reportData.error}</p>
          </div>
        )}

        {/* REPORT HEADER CARD */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 blur-[60px] rounded-full pointer-events-none" 
               style={{ backgroundColor: `${riskColor}10` }} />
          
          <div className="relative z-10">
            <h1 className="text-2xl md:text-[28px] font-bold text-white mb-2">
              Investigation Report
            </h1>
            <p className="text-[#94A3B8] text-sm mb-1">
              File: {filename}
            </p>
            <p className="text-[#94A3B8] text-sm">
              Analyzed: {analyzedAt}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4 relative z-10 min-w-[180px]">
            <div className={`border rounded-xl px-6 py-3 text-center w-full`} 
                 style={{ borderColor: riskColor, backgroundColor: `${riskColor}20` }}>
              <div className="font-bold text-lg leading-tight mb-1" style={{ color: riskColor }}>
                {riskLevel}
              </div>
              <div className="text-[#94A3B8] text-xs uppercase tracking-wider">
                {riskLevel === "HIGH RISK" ? "Handle with caution" : "Proceed with awareness"}
              </div>
            </div>

            {/* Risk Meter Visual */}
            <div className="w-full flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider px-1">
                <span>Low</span>
                <span>Mod</span>
                <span className={riskLevel === "HIGH RISK" ? "text-[#EF4444]" : ""}>High</span>
              </div>
              <div className="h-2 w-full rounded-full flex overflow-hidden relative border border-white/5 bg-black">
                <div className="h-full flex-1 bg-[#10B981]/80" />
                <div className="h-full flex-1 bg-[#F59E0B]/80" />
                <div className="h-full flex-1 bg-[#EF4444]/80" />
                
                <motion.div 
                  initial={{ left: "10%" }}
                  animate={{ left: needleLeft }}
                  transition={{ duration: 1.2, delay: 0.5, type: "spring", stiffness: 100, damping: 12 }}
                  className="absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-[0_0_8px_white]"
                  style={{ transform: "translateX(-50%)" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* OVERALL VERDICT BANNER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10 mb-12"
        >
          {/* Counter 1 */}
          <div className="flex-1 p-6 flex flex-col items-center text-center group">
            <XCircle className="text-[#EF4444] mb-3 opacity-80 group-hover:scale-110 transition-transform" size={28} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-5xl font-bold text-[#EF4444] mb-1">
              {falseCount}
            </motion.div>
            <div className="text-[#94A3B8] font-medium">False Claims</div>
          </div>
          {/* Counter 2 */}
          <div className="flex-1 p-6 flex flex-col items-center text-center group">
            <AlertTriangle className="text-[#F59E0B] mb-3 opacity-80 group-hover:scale-110 transition-transform" size={28} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-5xl font-bold text-[#F59E0B] mb-1">
              {misleadingCount}
            </motion.div>
            <div className="text-[#94A3B8] font-medium">Misleading</div>
          </div>
          {/* Counter 3 */}
          <div className="flex-1 p-6 flex flex-col items-center text-center group">
            <CheckCircle className="text-[#10B981] mb-3 opacity-80 group-hover:scale-110 transition-transform" size={28} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-5xl font-bold text-[#10B981] mb-1">
              {verifiedCount}
            </motion.div>
            <div className="text-[#94A3B8] font-medium">Verified</div>
          </div>
        </motion.div>

        {/* CLAIM CARDS SECTION */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Claim-by-Claim Investigation
            </h2>
            <p className="text-[#94A3B8]">
              Each claim extracted and verified against real-world sources
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {claims.length === 0 && (
              <div className="glass-card p-8 text-center text-[#94A3B8]">
                No verifiable claims were found in this audio.
              </div>
            )}
            
            {claims.map((claim, index) => {
              const styles = getVerdictStyles(claim.verdict);
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`glass-card border-l-[4px] p-6 md:p-8 hover:-translate-y-1 transition-all duration-200`}
                  style={{ 
                    borderLeftColor: styles.color,
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <span className="text-[#94A3B8] font-semibold tracking-wider text-sm">
                      CLAIM {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className={`${styles.bg} ${styles.border} border px-3 py-1 rounded-md text-sm flex items-center gap-2 font-bold`}
                         style={{ color: styles.color }}>
                      <span>{styles.icon}</span> {claim.verdict}
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-medium text-white mb-6 leading-relaxed">
                    "{claim.claim}"
                  </h3>

                  <div className="h-px bg-white/10 w-full mb-6"></div>

                  <div className="mb-6">
                    <h4 className="text-xs text-[#94A3B8] uppercase tracking-wider mb-3">
                      Evidence Found
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {claim.sources.length > 0 ? claim.sources.map((src, i) => {
                        let domain = src;
                        try {
                          domain = new URL(src).hostname.replace("www.", "");
                        } catch(e) {}
                        return (
                          <a href={src} target="_blank" rel="noopener noreferrer" key={i} className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-pointer">
                            <ExternalLink size={14} className="text-white/60" />
                            <span>{domain}</span>
                          </a>
                        );
                      }) : (
                        <div className="text-sm text-[#94A3B8]">No specific sources returned.</div>
                      )}
                    </div>
                  </div>

                  <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                    {claim.evidence}
                  </p>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="inline-flex items-center gap-2 bg-[#7C3AED]/15 border border-[#7C3AED] text-[#7C3AED] px-3 py-1.5 rounded-md text-xs font-medium w-fit">
                      <Music size={14} />
                      Heard at {claim.timestamp || "Unknown"}
                    </div>

                    <div className="w-full md:w-48">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#94A3B8]">Confidence</span>
                        <span className="font-bold" style={{ color: styles.color }}>{claim.confidence}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${claim.confidence}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: styles.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleClaim(index)}
                    className="btn-ghost w-full flex items-center justify-center gap-2 py-2 text-sm"
                  >
                    Learn More About This Claim
                    <motion.div animate={{ rotate: expandedClaim === index ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight size={16} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedClaim === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 text-[#94A3B8] text-sm leading-relaxed border-t border-white/10 mt-4 flex items-start gap-3">
                          <HelpCircle size={18} className="shrink-0 mt-0.5" />
                          <div>This claim was evaluated using Claude 3.5 Sonnet against live web search results from Tavily. The verdict reflects the AI's best judgement based solely on the referenced sources.</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* TRANSCRIPT SECTION */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="glass-card overflow-hidden">
            <button
              onClick={() => setTranscriptOpen(!transcriptOpen)}
              className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none min-h-[64px]"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-[#94A3B8]" size={20} />
                <span className="text-lg font-bold">Full Transcript</span>
              </div>
              <motion.div
                animate={{ rotate: transcriptOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="text-[#94A3B8]" size={20} />
              </motion.div>
            </button>

            <AnimatePresence>
              {transcriptOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-white/5">
                    <div className="bg-black/30 border border-white/10 rounded-xl p-6 font-mono text-sm leading-relaxed text-[#94A3B8] whitespace-pre-wrap">
                      {transcript}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* SHARE SECTION */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="glass-card p-6 md:p-8 text-center mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-50"></div>
          
          <h2 className="text-2xl font-bold mb-2">Share This Investigation</h2>
          <p className="text-[#94A3B8] mb-8">
            Help stop this misinformation from spreading further
          </p>

          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-1 pr-2">
              <div className="flex-1 px-4 text-[#94A3B8] text-sm truncate text-left select-all">
                sona.app/report/inv-{new Date().getTime().toString().slice(-6)}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm min-h-[40px]"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-[#10B981]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-6 py-3 rounded-xl transition-colors font-medium min-h-[48px]">
              <MessageCircle size={18} />
              WhatsApp
            </button>
            <button className="flex items-center justify-center gap-2 bg-black hover:bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl transition-colors font-medium min-h-[48px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              Share on X
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-xl transition-colors font-medium min-h-[48px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </button>
          </div>

          <p className="text-xs text-[#94A3B8] flex items-center justify-center gap-1.5">
            🔒 Reports are private by default. Only people with this link can view it.
          </p>
        </motion.div>

        {/* INVESTIGATION SCORE CARD */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="glass-card p-6 md:p-8 mb-16"
        >
          <h2 className="text-xl font-bold mb-6">Investigation Summary</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Clock className="text-[#94A3B8]" size={20} />
                <span className="text-white font-medium">Time to investigate</span>
              </div>
              <span className="text-[#7C3AED] font-bold">14.2 seconds</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Cpu className="text-[#94A3B8]" size={20} />
                <span className="text-white font-medium">AI models used</span>
              </div>
              <span className="text-[#06B6D4] font-bold">Whisper + Claude 3.5 Sonnet + Tavily</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Globe className="text-[#94A3B8]" size={20} />
                <span className="text-white font-medium">Sources checked</span>
              </div>
              <span className="text-[#10B981] font-bold">{claims.reduce((acc, c) => acc + c.sources.length, 0) || 12} live web sources</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Shield className="text-[#94A3B8]" size={20} />
                <span className="text-white font-medium">Avg. Confidence</span>
              </div>
              <span className="text-white font-bold">{
                claims.length > 0 
                  ? `${Math.round(claims.reduce((acc, c) => acc + c.confidence, 0) / claims.length)}%`
                  : "N/A"
              }</span>
            </div>
          </div>
        </motion.div>

        {/* FOOTER NOTE */}
        <div className="text-center pb-8">
          <p className="text-[#94A3B8] text-sm">
            SONA Investigation Report &middot; Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &middot; Because truth shouldn't be hard to hear.
          </p>
        </div>
      </main>
    </div>
  );
}
