"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowLeft, Share2, Download, XCircle, CheckCircle, ExternalLink,
  Loader2, Check, MessageCircle, Clock, Globe, Shield, Play, Pause,
  FileText, Database, Network, BarChart2, Activity, Zap, Search, LayoutTemplate, Layers, ShieldCheck, Cpu, AlertTriangle, HelpCircle, AlertOctagon, MessageSquare
} from "lucide-react";
import Link from "next/link";
import ProvenanceGraph from "../../components/ProvenanceGraph";

type Source = { url: string; snippet: string };
type EvidenceStrength = { value: "High" | "Medium" | "Low" | "Insufficient"; explanation: string; };
type HistoricalMatch = { previous_filename: string; previous_claim: string; previous_verdict: string; date: string; };
type AudioEvent = { type: string; time: string; signal: string; explanation: string; severity: string; };

type Claim = {
  claim: string;
  original_claim: string;
  language: string;
  timestamp_start: string;
  timestamp_end: string;
  transcript_segment: string;
  verdict: "FALSE" | "MISLEADING" | "VERIFIED" | "UNVERIFIED";
  evidence: string;
  confidence: number;
  supporting_sources: Source[];
  contradicting_sources: Source[];
  context_sources: Source[];
  conflict_status: string;
  what_would_change: string[];
  context_status: "Context Intact" | "Missing Context" | "Outdated" | "Inconclusive";
  context_summary: string;
  missing_context: string[];
  original_source_candidates: string[];
  evidence_strength: {
    source_quality: EvidenceStrength;
    source_independence: EvidenceStrength;
    evidence_agreement: EvidenceStrength;
    evidence_recency: EvidenceStrength;
    directness_of_evidence: EvidenceStrength;
    context_completeness: EvidenceStrength;
  };
  historical_matches?: HistoricalMatch[];
};

type ReportData = {
  filename: string;
  transcript: string;
  language: string;
  language_confidence: number;
  word_count: number;
  source_count: number;
  analyzedAt: string;
  claims: Claim[];
  error?: string;
  profile?: {
    claim_accuracy: number;
    context_completeness: number;
    source_quality: number;
    evidence_consistency: number;
  };
  audio_integrity?: AudioEvent[];
  language_intelligence?: {
    detected_language: string;
    script: string;
    is_code_switching: boolean;
    normalized_text: string;
    social_engineering_signals: { signal: string; evidence_text: string; confidence: number }[];
    scam_patterns: string[];
    risk_level: string;
    explanation: string;
  };
  risk_indicators?: any[];
  recommended_actions?: string[];
  attack_reconstruction?: {
    attack_summary: string;
    attack_type: string;
    attack_confidence: number;
    timeline: {
      event_id: string;
      sequence_number: number;
      title: string;
      description: string;
      event_type: string;
      timestamp: string;
      confidence: string;
      evidence: string;
    }[];
    techniques: string[];
    predicted_next_steps: { step: string; confidence: string }[];
    impact_assessment: Record<string, { level: string; explanation: string }>;
    recommended_actions: string[];
  };
  incident_response?: {
    incident_state: string;
    prevention_mode: boolean;
    user_checkpoint_questions: { id: string; question: string; options: string[] }[];
    prevention_guidance: string[];
    immediate_actions: { priority: string; action: string }[];
    recovery_checklist: { id: string; step: string; completed: boolean }[];
    contact_warning_message: string;
    post_incident_risk: Record<string, { level: string; explanation: string }>;
  };
  community_threat_match?: {
    pattern_key: string;
    category: string;
    description: string;
    indicators: string[];
    confidence: number;
    status: string;
    occurrences: number;
  };
  copilot?: any;
};

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportLang, setReportLang] = useState<'english'|'urdu'>('urdu');
  
  // Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const steps = [
    { id: 1, name: reportLang === 'urdu' ? "Context Ki Tafseel" : "Context Analysis", icon: Search },
    { id: 2, name: reportLang === 'urdu' ? "Source Ki Talaash" : "Source Tracing", icon: Network },
    { id: 3, name: reportLang === 'urdu' ? "Saboot Aur Nateeja" : "Evidence & Results", icon: Shield },
    { id: 4, name: "Attack Reconstruction", icon: Activity },
    { id: 5, name: "Investigation Copilot", icon: Cpu },
    { id: 6, name: "Final Report", icon: FileText }
  ];

  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activePlayIndex, setActivePlayIndex] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState("12s");
  
  // Ask SONA
  const [askQuery, setAskQuery] = useState("");
  const [askHistory, setAskHistory] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sonaReport");
    if (stored) {
      const parsed = JSON.parse(stored);
      setReportData(parsed);
      if (parsed.incident_response) {
        setIncidentResponse(parsed.incident_response);
      }
    }
    const storedUrl = sessionStorage.getItem("sonaAudioUrl");
    if (storedUrl) setAudioUrl(storedUrl);
    const storedElapsed = sessionStorage.getItem("sonaElapsed");
    if (storedElapsed) setElapsedTime(storedElapsed);
    setIsLoading(false);
  }, []);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [incidentResponse, setIncidentResponse] = useState<any>(null);
  const [isUpdatingIncident, setIsUpdatingIncident] = useState(false);
  const [isCommunityOptIn, setIsCommunityOptIn] = useState(false);
  const [hasContributed, setHasContributed] = useState(false);

  const handleCommunityOptInToggle = async () => {
    const newState = !isCommunityOptIn;
    setIsCommunityOptIn(newState);
    if (newState && reportData && !hasContributed) {
       setHasContributed(true);
       try {
         const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
         await fetch(`${apiUrl}/investigate/community-contribute`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              investigation_id: reportData.filename,
              transcript: reportData.transcript,
              language_intelligence: reportData.language_intelligence
           })
         });
       } catch (e) {
         console.error("Failed to contribute", e);
       }
    }
  };

  const handleAnswer = async (questionId: string, answer: string) => {
    if (!reportData) return;
    const newAnswers = { ...userAnswers, [questionId]: answer };
    setUserAnswers(newAnswers);
    setIsUpdatingIncident(true);
    
    try {
       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
       const res = await fetch(`${apiUrl}/investigate/incident-update`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            transcript: reportData.transcript,
            language_intelligence: reportData.language_intelligence,
            user_answers: newAnswers
         })
       });
       if (res.ok) {
          const data = await res.json();
          setIncidentResponse(data);
          
          // Optionally merge back to reportData
          setReportData(prev => prev ? { ...prev, incident_response: data } : prev);
       }
    } catch (e) {
       console.error("Failed to update incident", e);
    } finally {
       setIsUpdatingIncident(false);
    }
  };

  const playTimestamp = (startTime: string, endTime: string, index: number) => {
    if (!audioRef.current || !audioUrl) return;
    const toSeconds = (t: string) => {
      const parts = t.split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1] || "0");
    };
    const start = toSeconds(startTime);
    const end = toSeconds(endTime) || start + 5;
    
    audioRef.current.currentTime = start;
    audioRef.current.play();
    setActivePlayIndex(index);
    
    setTimeout(() => {
      audioRef.current?.pause();
      setActivePlayIndex(null);
    }, (end - start) * 1000);
  };

  const handleAskSona = async () => {
    if (!askQuery.trim() || !reportData) return;
    const q = askQuery;
    setAskQuery("");
    setAskHistory(prev => [...prev, {role: 'user', text: q}]);
    setIsAsking(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, report: reportData })
      });
      const data = await res.json();
      setAskHistory(prev => [...prev, {role: 'assistant', text: data.answer || data.error || "Failed to respond."}]);
    } catch {
      setAskHistory(prev => [...prev, {role: 'assistant', text: "Connection error."}]);
    }
    setIsAsking(false);
  };

  const exportJSON = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sona_investigation_${reportData.filename}.json`; a.click();
  };

  const exportMarkdown = () => {
    if (!reportData) return;
    let md = `# SONA Investigation Report\n\n`;
    md += `**File:** ${reportData.filename}\n`;
    reportData.claims.forEach((c, i) => {
      md += `### Claim ${i+1}: ${c.claim}\n- Verdict: **${c.verdict}**\n- Evidence: ${c.evidence}\n\n`;
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sona_investigation_${reportData.filename}.md`; a.click();
  };

  const hasUrduCharacters = (text: string) => {
    const urduRegex = /[\u0600-\u06FF]/;
    return urduRegex.test(text || "");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <div className="text-slate-500 font-medium tracking-tight">Finalizing intelligence report...</div>
      </div>
    );
  }

  const claims = reportData?.claims || [];
  const filename = reportData?.filename || "voice_note.mp3";
  
  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "FALSE": return { color: "text-danger", bg: "bg-danger/10", border: "border-danger/30", icon: "✗" };
      case "MISLEADING": return { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", icon: "⚠" };
      case "VERIFIED": return { color: "text-success", bg: "bg-success/10", border: "border-success/30", icon: "✓" };
      default: return { color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200", icon: "?" };
    }
  };

  const getVerdictText = (verdict: string) => {
    if (reportLang === 'english') return verdict;
    switch (verdict) {
      case "FALSE": return "JHOOT";
      case "MISLEADING": return "GUMRAHKUN";
      case "VERIFIED": return "SACH";
      default: return verdict;
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen text-foreground bg-background font-sans relative pb-24 overflow-x-hidden selection:bg-primary-light selection:text-primary print-content">
      {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}

      {/* HEADER */}
      <header className="sticky top-0 w-full z-50 glass-nav h-16 shadow-sm no-print border-b border-white/60">
        <div className="h-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/investigate" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Workspace</span>
          </Link>
          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
             <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
              <Zap size={14} fill="currentColor" />
             </div>
             <span className="text-lg font-bold tracking-tight text-foreground drop-shadow-sm">SONA Intelligence</span>
          </div>
        </div>
      </header>

      {/* LANGUAGE TOGGLE */}
      <div className="w-full bg-black/40 border-b border-white/10 py-2">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-end items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Report Language:</span>
          <div className="bg-white/5 p-1 rounded-lg flex items-center">
            <button 
              onClick={() => setReportLang('english')} 
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${reportLang === 'english' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              English
            </button>
            <button 
              onClick={() => setReportLang('urdu')} 
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${reportLang === 'urdu' ? 'bg-[#008A45] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Roman Urdu 🇵🇰
            </button>
          </div>
        </div>
      </div>

      {/* PAKISTAN RECOVERY COMPANION */}
      {incidentResponse && incidentResponse.incident_state !== "NO_RISK" && incidentResponse.incident_state !== "UNKNOWN" && (
        <div className="max-w-[1000px] mx-auto px-4 md:px-6 my-8 z-20 relative">
          <div className="glass-panel border-l-4 border-l-danger p-6 overflow-hidden relative shadow-lg bg-[#2E0B10]/80 backdrop-blur-xl border border-danger/30">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl pointer-events-none">🇵🇰</div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={28} className="text-danger" />
                 <h2 className="text-2xl font-bold text-white">Pakistan Recovery Guide</h2>
              </div>
              <div className="bg-danger text-white px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
                HIGH RISK
              </div>
            </div>
            
            <div className="mb-6 border-b border-white/10 pb-6">
               <div className="text-sm text-slate-300 font-bold mb-2 flex items-center gap-2">
                 <AlertTriangle size={16} className="text-warning" />
                 Fauri Actions (Immediate Steps)
               </div>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                   <div className="font-bold text-white text-sm mb-1">1. Block the Number</div>
                   <p className="text-xs text-slate-400">WhatsApp par number ko report aur block karein. Kisi link par click na karein.</p>
                 </div>
                 <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                   <div className="font-bold text-white text-sm mb-1">2. Warn Family</div>
                   <p className="text-xs text-slate-400">Apne ghar walon ko batayen ke aap ke naam se call ya message aa sakta hai.</p>
                 </div>
               </div>
            </div>

            <div className="mb-6 border-b border-white/10 pb-6">
               <div className="text-sm text-slate-300 font-bold mb-4 flex items-center gap-2">
                 <Shield size={16} className="text-success" />
                 Official Helplines (Tap to call)
               </div>
               <div className="flex flex-col gap-3">
                 <a href="tel:9911" className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 transition-colors">
                   <div>
                     <div className="font-bold text-white text-sm">FIA Cybercrime Helpline</div>
                     <div className="text-xs text-slate-400">Financial fraud ya harassment ke liye</div>
                   </div>
                   <div className="bg-primary/20 text-primary px-3 py-1 rounded font-bold">9911</div>
                 </a>
                 <a href="tel:0800-55055" className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 transition-colors">
                   <div>
                     <div className="font-bold text-white text-sm">State Bank of Pakistan (SBP)</div>
                     <div className="text-xs text-slate-400">Bank account compromise hone par</div>
                   </div>
                   <div className="bg-primary/20 text-primary px-3 py-1 rounded font-bold">0800-55055</div>
                 </a>
                 <a href="tel:0800-55055" className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 transition-colors">
                   <div>
                     <div className="font-bold text-white text-sm">PTA Complaint Center</div>
                     <div className="text-xs text-slate-400">Fake/Scam numbers report karne ke liye</div>
                   </div>
                   <div className="bg-primary/20 text-primary px-3 py-1 rounded font-bold">0800-55055</div>
                 </a>
               </div>
            </div>

            <div>
              <div className="text-sm text-slate-300 font-bold mb-2">Warning Message Copy Karein</div>
              <div className="bg-black/60 p-3 rounded-lg border border-white/10 relative">
                <p className="text-sm text-slate-300 pr-10">
                  "Asalam o Alaikum, mera account/number compromise ho gaya hai ya mere naam se fake message aa rahe hain. Agar mere number se koi paise maange ya link bheje to please click na karein. Mai theek hoon. Shukriya."
                </p>
                <button className="absolute top-3 right-3 text-primary hover:text-white transition-colors" title="Copy">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* WIZARD STEPPER HIDDEN */}
      <div className="hidden">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center py-4 relative">
             <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200/50 -z-10 transform -translate-y-1/2"></div>
             
             {steps.map(step => {
               const isActive = currentStep === step.id;
               const isPast = currentStep > step.id;
               return (
                 <button key={step.id} onClick={() => setCurrentStep(step.id)} className="flex flex-col items-center gap-2 group bg-transparent px-2">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${isActive ? 'bg-primary border-primary text-white scale-110 shadow-md' : isPast ? 'bg-surface border-primary/50 text-primary' : 'bg-surface border-muted/20 text-muted group-hover:border-primary/30'}`}>
                     <step.icon size={16} />
                   </div>
                   <span className={`text-xs font-semibold hidden md:block ${isActive ? 'text-primary' : isPast ? 'text-muted/80' : 'text-muted/50'}`}>{step.name}</span>
                 </button>
               )
             })}
          </div>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-4 md:px-6 pt-10">
        
        <AnimatePresence mode="wait">
          
          {/* URDU SUMMARY CARD */}
          {reportLang === 'urdu' && reportData && (
            <motion.div variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="mb-6">
              <div className="glass-panel p-6 border border-[#008A45]/30 bg-[#002B15]/20 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-6xl opacity-10">🎙️</div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">🇵🇰</span> SONA Samajhta Hai
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  Is audio message mein <span className="font-bold text-white">{reportData.claims.filter(c => c.verdict === 'FALSE' || c.verdict === 'MISLEADING').length}</span> galat ya gumrahkun baatein hain. Fake calls aur messages se mohtat rahein aur hamesha official sources (jaise SBP ya FIA) se tasdeeq karein.
                </p>
              </div>
            </motion.div>
          )}
          
          {/* STEP 1: CONTEXT ANALYSIS */}
          {true && (
            <motion.div key="step-1" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Context Analysis</h2>
                <p className="text-muted">Evaluating the framing, missing information, and audio integrity of the source file.</p>
              </div>

              {reportData?.audio_integrity && reportData.audio_integrity.length > 0 && (
                <div className="glass-panel p-6 border-l-4 border-l-warning">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Activity size={18} className="text-warning"/> Audio Integrity Anomalies</h3>
                  <div className="space-y-4">
                    {reportData.audio_integrity.map((ev, i) => (
                      <div key={i} className="glass-card p-4 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-foreground text-sm">{ev.type}</span>
                          <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-md border border-warning/20">{ev.time}</span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed"><span className="font-semibold text-foreground">Signal:</span> {ev.signal} &mdash; {ev.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MEDIA FORENSICS */}
              {reportData?.media_forensics && (
                <div className="glass-panel p-6 shadow-sm border border-primary/40 mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    Media Forensics & Manipulation Intelligence
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Manipulation Assessment</div>
                        <div className="text-sm font-semibold text-foreground">
                          {reportData.media_forensics.manipulation_assessment}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-surface p-3 rounded-lg border border-border">
                        <div>
                          <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Status</div>
                          <div className={`text-sm font-bold ${
                             reportData.media_forensics.status === 'LIKELY_MANIPULATED' ? 'text-danger' : 
                             reportData.media_forensics.status === 'POSSIBLY_MANIPULATED' ? 'text-warning' : 
                             reportData.media_forensics.status === 'NO_CLEAR_MANIPULATION' ? 'text-success' : 
                             'text-muted'
                           }`}>
                             {reportData.media_forensics.status.replace(/_/g, ' ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Confidence</div>
                          <div className="text-sm font-bold text-foreground">{reportData.media_forensics.confidence}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Evidence Found</div>
                      <div className="bg-surface p-4 rounded-xl border border-border">
                        <ul className="list-disc ml-5 space-y-2 text-sm text-foreground">
                          {reportData.media_forensics.evidence?.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {reportData.media_forensics.limitations && (
                    <div className="bg-warning/5 p-4 rounded-xl border border-warning/20">
                      <div className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1">Limitations</div>
                      <p className="text-sm text-foreground leading-relaxed">{reportData.media_forensics.limitations}</p>
                    </div>
                  )}
                </div>
              )}

              {/* LANGUAGE & SCAM INTELLIGENCE */}
              {reportData?.language_intelligence && (
                <div className="glass-panel p-6 shadow-sm border border-white/60 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Activity size={18} className="text-primary"/> Language & Scam Intelligence
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Detected Language</div>
                        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                          {reportData.language_intelligence.detected_language} 
                          {reportData.language_intelligence.is_code_switching && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">Code-Switching</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Script</div>
                        <div className="text-sm text-foreground">{reportData.language_intelligence.script}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Level</div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                           reportData.language_intelligence.risk_level === 'HIGH' ? 'bg-danger/10 text-danger border border-danger/20' : 
                           reportData.language_intelligence.risk_level === 'MEDIUM' ? 'bg-warning/10 text-warning border border-warning/20' : 
                           reportData.language_intelligence.risk_level === 'LOW' ? 'bg-success/10 text-success border border-success/20' : 
                           'bg-slate-100 text-slate-500 border border-slate-200'
                         }`}>
                           {reportData.language_intelligence.risk_level}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detected Patterns</div>
                      <div className="flex flex-wrap gap-2">
                        {reportData.language_intelligence.scam_patterns?.map((pattern, i) => (
                           <span key={i} className="px-3 py-1 bg-warning/10 text-warning text-xs font-bold rounded-full border border-warning/20">{pattern}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {reportData.language_intelligence.social_engineering_signals?.length > 0 && (
                    <div className="mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Social Engineering Signals</div>
                      <div className="space-y-2">
                        {reportData.language_intelligence.social_engineering_signals.map((signal, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                             <div className="flex items-center gap-2">
                               <span className="font-bold text-primary text-xs">{signal.signal}</span>
                               <span className="text-[10px] text-muted">({signal.confidence}%)</span>
                             </div>
                             <div className="text-xs text-slate-600 italic">"{signal.evidence_text}"</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Why SONA Flagged This</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{reportData.language_intelligence.explanation}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Search size={18} className="text-primary"/> Claim Context Extraction</h3>
                {claims.map((c, i) => {
                  const isUrdu = hasUrduCharacters(c.original_claim || c.claim);
                  return (
                  <div key={i} className="glass-panel p-6 border border-white/60 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">Claim {String(i+1).padStart(2,'0')}</span>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/10">{c.language}</span>
                    </div>
                    <div className="mb-4">
                      {isUrdu ? (
                        <p className="font-semibold text-slate-800 text-lg leading-loose urdu-text shadow-sm rounded-lg p-2 bg-white/40">"{c.original_claim || c.claim}"</p>
                      ) : (
                        <p className="font-semibold text-slate-800 text-base leading-relaxed">"{c.original_claim || c.claim}"</p>
                      )}
                      {c.original_claim && c.original_claim !== c.claim && (
                        <p className="text-sm text-slate-500 mt-3 border-l-2 border-slate-200 pl-3">Translated: "{c.claim}"</p>
                      )}
                    </div>
                    <div className="bg-white/50 border border-slate-100 p-4 rounded-xl shadow-sm">
                       <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Context Status: <span className="text-primary">{c.context_status}</span></div>
                       <p className="text-sm text-slate-600 leading-relaxed mb-3">{c.context_summary}</p>
                       {c.missing_context && c.missing_context.length > 0 && (
                         <div className="text-sm text-slate-600">
                           <span className="font-semibold text-warning">Missing Context:</span>
                           <ul className="list-disc ml-5 mt-1 space-y-1">
                             {c.missing_context.map((m, j) => <li key={j}>{m}</li>)}
                           </ul>
                         </div>
                       )}
                    </div>
                  </div>
                )})}
              </div>
            </motion.div>
          )}

          {/* STEP 2: SOURCE TRACING */}
          {true && (
            <motion.div key="step-2" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Original Source Tracing</h2>
                <p className="text-muted">Mapping claims back to their likely origins and detecting historical footprints.</p>
              </div>

              {claims.map((c, i) => (
                <div key={i} className="glass-panel p-6 shadow-sm">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-1 rounded inline-block mb-3">Claim {String(i+1).padStart(2,'0')}</div>
                  <p className="font-semibold text-foreground mb-6 leading-relaxed">"{c.claim}"</p>
                  
                  {/* Historical Match */}
                  {c.historical_matches && c.historical_matches.length > 0 && (
                    <div className="mb-6 bg-warning/5 border border-warning/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-warning font-bold text-sm mb-3"><Database size={16}/> Known Historical Footprint</div>
                      {c.historical_matches.map((hm, hi) => (
                        <div key={hi} className="bg-white border border-slate-200 p-3 rounded-lg text-sm text-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                           <div>
                             <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">Found in: {hm.previous_filename}</span>
                             <span className="italic">"{hm.previous_claim}"</span>
                           </div>
                           <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded">{hm.previous_verdict}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Provenance Map */}
                  <div className="bg-white/50 border border-slate-100 rounded-xl p-6 relative overflow-hidden shadow-sm">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2"><Network size={14}/> Lineage Graph</h4>
                     <div className="flex flex-col items-center gap-3 relative z-10 max-w-sm mx-auto">
                        <div className="bg-white border border-success/30 text-success px-4 py-2 rounded-lg text-xs font-bold shadow-sm w-full text-center">
                          {c.original_source_candidates?.[0] || "Unknown Origin"}
                        </div>
                        <div className="h-6 w-px bg-slate-300"></div>
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-medium text-slate-600 w-full text-center shadow-sm">
                          Intermediate Sources / References
                        </div>
                        <div className="h-6 w-px bg-slate-300"></div>
                        <div className="bg-primary/5 border border-primary/20 text-primary px-4 py-3 rounded-lg text-sm font-bold shadow-sm w-full text-center">
                          Extracted Claim
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* STEP 3: EVIDENCE & RESULTS */}
          {true && (
            <motion.div key="step-3" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Evidence & Results</h2>
                <p className="text-muted">Cross-referenced evidence, confidence scores, and final verdicts for each claim.</p>
              </div>

              {claims.map((c, i) => {
                const styles = getVerdictStyles(c.verdict);
                return (
                  <div key={i} className="glass-panel p-6 overflow-hidden relative shadow-sm">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.bg.replace('/10','')} opacity-50`}></div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-1 rounded inline-block mb-3">Claim {String(i+1).padStart(2,'0')}</div>
                        <h3 className="text-xl font-bold text-foreground leading-snug">"{c.claim}"</h3>
                      </div>
                      <div className={`${styles.bg} ${styles.border} border px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 tracking-wider shadow-sm whitespace-nowrap`}>
                        <span className={styles.color}>{styles.icon} {getVerdictText(c.verdict)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <button onClick={() => playTimestamp(c.timestamp_start, c.timestamp_end, i)} className="flex items-center gap-2 glass-card hover:border-primary/50 px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground transition-colors shadow-sm">
                        {activePlayIndex === i ? <Pause size={14}/> : <Play size={14}/>} {c.timestamp_start}
                      </button>
                    </div>

                    {/* Evidence Breakdowns */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-primary/10">
                       <div className="bg-success/5 border border-success/10 rounded-xl p-4">
                          <h4 className="text-success font-bold mb-3 flex items-center gap-2 text-sm"><CheckCircle size={16}/> {reportLang === 'urdu' ? 'Verified Saboot' : 'Supporting'} ({c.supporting_sources.length})</h4>
                          <div className="space-y-3">
                            {c.supporting_sources.map((s, idx) => {
                              const isPakistani = s.url.includes('.pk') || s.url.includes('pakistan') || s.url.includes('dawn.com') || s.url.includes('geo.tv') || s.url.includes('tribune.com.pk');
                              return (
                              <div key={idx} className={`glass-card p-3 rounded-lg shadow-sm ${isPakistani ? 'border border-[#008A45]/50 bg-[#008A45]/5' : 'border-0 bg-surface/50'}`}>
                                <div className="flex justify-between items-start mb-1">
                                  <div className="text-[10px] text-muted font-bold truncate flex items-center gap-1 uppercase"><Globe size={10}/> {isPakistani ? '🇵🇰 ' : ''}{new URL(s.url).hostname}</div>
                                  {isPakistani && <div className="text-[8px] bg-[#008A45] text-white px-2 py-0.5 rounded-full font-bold">Pakistani Source Verified</div>}
                                </div>
                                <div className="text-xs text-muted/90 leading-relaxed">{s.snippet}</div>
                              </div>
                              );
                            })}
                            {c.supporting_sources.length === 0 && <div className="text-xs text-muted italic p-2">None found.</div>}
                          </div>
                       </div>
                       <div className="bg-danger/5 border border-danger/10 rounded-xl p-4">
                          <h4 className="text-danger font-bold mb-3 flex items-center gap-2 text-sm"><XCircle size={16}/> {reportLang === 'urdu' ? 'Galat Saboot' : 'Contradicting'} ({c.contradicting_sources.length})</h4>
                          <div className="space-y-3">
                            {c.contradicting_sources.map((s, idx) => {
                              const isPakistani = s.url.includes('.pk') || s.url.includes('pakistan') || s.url.includes('dawn.com') || s.url.includes('geo.tv') || s.url.includes('tribune.com.pk');
                              return (
                              <div key={idx} className={`glass-card p-3 rounded-lg shadow-sm ${isPakistani ? 'border border-[#008A45]/50 bg-[#008A45]/5' : 'border-0 bg-surface/50'}`}>
                                <div className="flex justify-between items-start mb-1">
                                  <div className="text-[10px] text-muted font-bold truncate flex items-center gap-1 uppercase"><Globe size={10}/> {isPakistani ? '🇵🇰 ' : ''}{new URL(s.url).hostname}</div>
                                  {isPakistani && <div className="text-[8px] bg-[#008A45] text-white px-2 py-0.5 rounded-full font-bold">Pakistani Source Verified</div>}
                                </div>
                                <div className="text-xs text-muted/90 leading-relaxed">{s.snippet}</div>
                              </div>
                              );
                            })}
                            {c.contradicting_sources.length === 0 && <div className="text-xs text-muted italic p-2">None found.</div>}
                          </div>
                       </div>
                    </div>

                    {/* Interactive Provenance Graph */}
                    <div className="mt-8">
                       <h4 className="text-foreground font-bold mb-4 flex items-center gap-2 text-sm border-t border-border pt-6"><Network size={16} className="text-primary"/> Evidence Provenance Graph</h4>
                       <ProvenanceGraph claimData={c} />
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* STEP 4: ATTACK RECONSTRUCTION */}
          {true && (
            <motion.div key="step-4" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2"><Activity className="text-primary"/> Attack Reconstruction</h2>
                <p className="text-muted">AI-supported inference of potential attack vectors and manipulation techniques.</p>
              </div>

              {!reportData?.attack_reconstruction || reportData.attack_reconstruction.attack_type === "No Attack Detected" ? (
                <div className="glass-panel p-12 text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4"><CheckCircle size={32} /></div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">No Attack Detected</h3>
                   <p className="text-slate-500">Based on the available evidence, no malicious manipulation or attack patterns were found in this investigation.</p>
                </div>
              ) : (
                <>
                  {/* Status & Summary */}
                  <div className="glass-panel p-6 border-l-4 border-l-warning shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <div className="text-xs font-bold text-warning uppercase tracking-wider mb-1">Attack Status</div>
                           <h3 className="text-xl font-bold text-foreground">{reportData.attack_reconstruction.attack_type}</h3>
                        </div>
                        <div className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-bold border border-warning/20">
                           {reportData.attack_reconstruction.attack_confidence}% Confidence
                        </div>
                     </div>
                     <p className="text-muted leading-relaxed">{reportData.attack_reconstruction.attack_summary}</p>
                     
                     {reportData.attack_reconstruction.techniques && reportData.attack_reconstruction.techniques.length > 0 && (
                       <div className="mt-4 flex flex-wrap gap-2">
                         {reportData.attack_reconstruction.techniques.map((t, i) => (
                           <span key={i} className="px-2 py-1 bg-surface text-foreground text-xs rounded border border-border">{t}</span>
                         ))}
                       </div>
                     )}
                  </div>

                  {/* Interactive Timeline */}
                  <div className="glass-panel p-6 shadow-sm">
                     <h3 className="text-lg font-bold text-foreground mb-6">Attack Timeline</h3>
                     <div className="relative pl-6 border-l-2 border-primary/30 space-y-8">
                        {reportData.attack_reconstruction.timeline?.map((evt, i) => (
                           <div key={i} className="relative">
                              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              </div>
                              <div className="glass-card p-4 rounded-xl shadow-sm border border-white/50 cursor-pointer hover:border-primary/40 transition-colors group">
                                 <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                       {evt.title} 
                                       <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{evt.event_type}</span>
                                    </h4>
                                    <span className="text-xs text-muted font-mono bg-white px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                       <Clock size={12}/> {evt.timestamp}
                                    </span>
                                 </div>
                                 <p className="text-sm text-slate-600 mb-3">{evt.description}</p>
                                 <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 text-xs">
                                    <span className="font-semibold text-primary block mb-1">Detected Evidence:</span>
                                    <span className="text-slate-600 italic">"{evt.evidence}"</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     {/* Risk Assessment */}
                     <div className="glass-panel p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground mb-4">Impact Assessment</h3>
                        <div className="space-y-3">
                           {Object.entries(reportData.attack_reconstruction.impact_assessment || {}).map(([key, val], i) => (
                              <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-surface/50 border border-border">
                                 <div>
                                   <div className="font-semibold text-sm text-foreground">{key}</div>
                                   <div className="text-[10px] text-muted">{val.explanation || "No explanation provided"}</div>
                                 </div>
                                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                   val.level === 'HIGH' ? 'bg-danger/10 text-danger border border-danger/20' : 
                                   val.level === 'MEDIUM' ? 'bg-warning/10 text-warning border border-warning/20' : 
                                   val.level === 'LOW' ? 'bg-success/10 text-success border border-success/20' : 
                                   'bg-slate-100 text-slate-500 border border-slate-200'
                                 }`}>
                                    {val.level}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        {/* What Could Happen Next */}
                        <div className="glass-panel p-6 shadow-sm border-l-4 border-l-primary">
                           <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2"><Zap size={18} className="text-primary"/> What Could Happen Next?</h3>
                           <ul className="space-y-2">
                              {reportData.attack_reconstruction.predicted_next_steps?.map((step, i) => (
                                 <li key={i} className="text-sm text-slate-600 flex items-start gap-2 bg-primary/5 p-2 rounded border border-border">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0"></span>
                                    <span>{step.step} <span className="text-[10px] text-muted ml-1">({step.confidence})</span></span>
                                 </li>
                              ))}
                              {(!reportData.attack_reconstruction.predicted_next_steps || reportData.attack_reconstruction.predicted_next_steps.length === 0) && (
                                 <li className="text-sm text-slate-500 italic">No clear predictive patterns detected.</li>
                              )}
                           </ul>
                        </div>

                        {/* What Should You Do Now */}
                        <div className="glass-panel p-6 shadow-sm border-l-4 border-l-primary">
                           <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-primary"/> What Should You Do Now?</h3>
                           <ul className="space-y-2">
                              {reportData.attack_reconstruction.recommended_actions?.map((action, i) => (
                                 <li key={i} className="text-sm text-slate-600 flex items-start gap-2 bg-primary/5 p-2 rounded">
                                    <CheckCircle size={14} className="text-primary mt-0.5 shrink-0"/>
                                    {action}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 5: INVESTIGATION COPILOT */}
          {true && (
            <motion.div key="step-5" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              {reportData?.copilot ? (
                <>
                  <div className="glass-panel p-6 shadow-sm border-l-4 border-l-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                       <h3 className="text-xl font-bold text-foreground flex items-center gap-2"><Cpu size={22} className="text-primary"/> Investigation Copilot</h3>
                       <p className="text-sm text-slate-500 max-w-2xl mt-1">{reportData.copilot.current_assessment}</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="glass-card p-3 rounded-lg text-center shadow-sm">
                           <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Risk</div>
                           <div className={`font-bold ${reportData.copilot.risk_level === 'HIGH' ? 'text-danger' : reportData.copilot.risk_level === 'MEDIUM' ? 'text-warning' : 'text-success'}`}>{reportData.copilot.risk_level}</div>
                        </div>
                        <div className="glass-card p-3 rounded-lg text-center shadow-sm">
                           <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Confidence</div>
                           <div className="font-bold text-primary">{reportData.copilot.confidence}%</div>
                        </div>
                        <div className="glass-card p-3 rounded-lg text-center shadow-sm bg-primary/5 border border-primary/20">
                           <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Status</div>
                           <div className="font-bold text-foreground text-xs">{reportData.copilot.investigation_status}</div>
                        </div>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="glass-panel p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-success mb-3 flex items-center gap-2 uppercase tracking-wider"><ShieldCheck size={16}/> Strongest Evidence</h3>
                        <ul className="space-y-2">
                           {reportData.copilot.strongest_evidence?.map((ev: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-success/5 p-2 rounded border border-success/10">
                                 <CheckCircle size={14} className="text-success mt-0.5 shrink-0"/> {ev}
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className="glass-panel p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-warning mb-3 flex items-center gap-2 uppercase tracking-wider"><AlertTriangle size={16}/> What Is Still Unknown?</h3>
                        <ul className="space-y-2">
                           {reportData.copilot.missing_information?.map((info: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-warning/5 p-2 rounded border border-warning/10">
                                 <HelpCircle size={14} className="text-warning mt-0.5 shrink-0"/> {info}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="glass-panel p-6 shadow-sm border border-danger/20">
                        <h3 className="text-sm font-bold text-danger mb-3 flex items-center gap-2 uppercase tracking-wider"><AlertOctagon size={16}/> Contradictions</h3>
                        <ul className="space-y-2">
                           {reportData.copilot.contradictions?.map((contradiction: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-danger bg-danger/5 p-2 rounded">
                                 <XCircle size={14} className="text-danger mt-0.5 shrink-0"/> {contradiction}
                              </li>
                           ))}
                           {(!reportData.copilot.contradictions || reportData.copilot.contradictions.length === 0) && (
                              <li className="text-sm text-slate-500 italic">No evidence contradictions detected.</li>
                           )}
                        </ul>
                     </div>
                     <div className="glass-panel p-6 shadow-sm border border-primary/20 bg-primary/5">
                        <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2 uppercase tracking-wider"><Zap size={16}/> Next Best Actions</h3>
                        <ul className="space-y-3">
                           {reportData.copilot.next_best_actions?.map((act: any, i: number) => (
                              <li key={i} className="text-sm">
                                 <div className="font-bold text-foreground mb-1">{act.action} <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">{act.priority}</span></div>
                                 <div className="text-xs text-slate-600">{act.reason}</div>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  <div className="glass-panel p-6 shadow-sm">
                     <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wider"><MessageSquare size={16} className="text-primary"/> Questions We Still Need Answered</h3>
                     <ul className="space-y-2">
                        {reportData.copilot.smart_questions?.map((q: string, i: number) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-foreground bg-surface p-3 rounded-lg border border-border shadow-sm">
                              <span className="font-bold text-primary mr-1">{i+1}.</span> {q}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <div className="glass-card p-4 text-sm text-slate-500 italic text-center rounded-xl shadow-sm">
                     <span className="font-bold text-foreground block mb-1">What would change this verdict?</span>
                     {reportData.copilot.what_would_change_verdict}
                  </div>
                </>
              ) : (
                <div className="glass-panel p-12 text-center text-slate-500 shadow-sm">
                  <Cpu size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Copilot intelligence is not available for this investigation.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 6: FINAL REPORT */}
          {true && (
            <motion.div key="step-6" variants={itemVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              
              <div className="glass-panel p-8 md:p-12 border-t-4 border-t-primary text-center">
                 <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <FileText size={32} />
                 </div>
                 <h2 className="text-3xl font-bold text-foreground mb-2">Investigation Complete</h2>
                 <p className="text-muted mb-8 max-w-md mx-auto">The intelligence pipeline has successfully processed {filename} and extracted {claims.length} claims.</p>
                 
                 <div className="flex flex-wrap justify-center gap-4 text-sm mb-10">
                    <div className="px-4 py-2 glass-card rounded-lg font-medium text-foreground flex items-center gap-2 shadow-sm"><Globe size={16} className="text-primary"/> {reportData?.language || "Unknown"}</div>
                    <div className="px-4 py-2 glass-card rounded-lg font-medium text-foreground flex items-center gap-2 shadow-sm"><Clock size={16} className="text-primary"/> {elapsedTime}</div>
                 </div>

                 <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
                   {[
                     { l: "Accuracy", v: reportData?.profile?.claim_accuracy || 0 },
                     { l: "Completeness", v: reportData?.profile?.context_completeness || 0 },
                     { l: "Quality", v: reportData?.profile?.source_quality || 0 },
                     { l: "Consistency", v: reportData?.profile?.evidence_consistency || 0 }
                   ].map((m, i) => (
                     <div key={i} className="glass-card p-4 rounded-xl shadow-sm border-primary/10">
                       <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">{m.l}</div>
                       <div className="text-xl font-bold text-foreground">{m.v}%</div>
                     </div>
                   ))}
                 </div>

                 <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-primary/10 pt-10">
                    <button onClick={exportJSON} className="btn-ghost flex items-center justify-center gap-2"><Download size={16}/> Export JSON</button>
                    <button onClick={exportMarkdown} className="btn-ghost flex items-center justify-center gap-2"><Download size={16}/> Export Markdown</button>
                    <button onClick={() => window.print()} className="btn-primary flex items-center justify-center gap-2"><FileText size={16}/> Save as PDF</button>
                 </div>
              </div>
              
              {/* RISK INDICATORS & ACTIONS */}
              {((reportData?.risk_indicators?.length ?? 0) > 0 || (reportData?.recommended_actions?.length ?? 0) > 0) && (
                 <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {(reportData?.risk_indicators?.length ?? 0) > 0 && (
                       <div className="glass-panel p-6 border-l-4 border-l-danger">
                          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                             <Activity size={18} className="text-danger"/> Risk Indicators
                          </h3>
                          <div className="space-y-3">
                             {reportData!.risk_indicators!.map((risk: any, i: number) => (
                                <div key={i} className="glass-card p-3 rounded-lg border-0 bg-danger/5 shadow-sm">
                                   <div className="font-bold text-danger text-sm mb-1">{risk.indicator}</div>
                                   <div className="text-xs text-muted/90 leading-relaxed">{risk.description}</div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                    {(reportData?.recommended_actions?.length ?? 0) > 0 && (
                       <div className="glass-panel p-6 border-l-4 border-l-primary">
                          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                             <ShieldCheck size={18} className="text-primary"/> Recommended Actions
                          </h3>
                          <div className="space-y-2">
                             {reportData!.recommended_actions!.map((action: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 bg-surface/50 p-2 rounded text-sm text-foreground">
                                   <CheckCircle size={16} className="text-primary mt-0.5 shrink-0"/> {action}
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              )}

              {/* THREAT INTELLIGENCE & PRIVACY UI */}
              <div className="glass-panel p-6 shadow-sm border border-border mt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-border">
                   <div>
                     <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><ShieldCheck className="text-success" size={20} /> Community Threat Intelligence</h3>
                     <p className="text-sm text-slate-500 max-w-lg mt-1">Help SONA identify recurring scam patterns by contributing anonymized threat indicators.</p>
                   </div>
                   <label className="flex items-center cursor-pointer">
                     <div className="relative">
                       <input type="checkbox" className="sr-only" checked={isCommunityOptIn} onChange={handleCommunityOptInToggle} />
                       <div className={`block w-14 h-8 rounded-full transition-colors ${isCommunityOptIn ? 'bg-success' : 'bg-surface border border-border'}`}></div>
                       <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isCommunityOptIn ? 'transform translate-x-6' : ''}`}></div>
                     </div>
                     <span className="ml-3 font-bold text-sm text-foreground">{isCommunityOptIn ? 'ON' : 'OFF'}</span>
                   </label>
                </div>
                
                {reportData?.community_threat_match ? (
                  <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                     <div className="flex items-center gap-2 mb-3">
                        <Globe className="text-primary" size={18} />
                        <h4 className="font-bold text-foreground">Community Threat Match</h4>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div>
                           <div className="text-xs uppercase tracking-wider text-muted font-bold mb-1">Current Match</div>
                           <div className="text-sm font-bold text-foreground">{reportData.community_threat_match.category}</div>
                           <p className="text-xs text-muted mt-1">{reportData.community_threat_match.description}</p>
                        </div>
                        <div className="flex gap-4">
                           <div>
                              <div className="text-xs uppercase tracking-wider text-muted font-bold mb-1">Confidence</div>
                              <div className="text-lg font-bold text-foreground">{reportData.community_threat_match.confidence}%</div>
                           </div>
                           <div>
                              <div className="text-xs uppercase tracking-wider text-muted font-bold mb-1">Status</div>
                              <div className="text-xs font-bold text-primary mt-1">{reportData.community_threat_match.status}</div>
                           </div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl bg-surface/50 border border-border border-dashed text-center">
                     <Globe className="text-muted mx-auto mb-2 opacity-50" size={24} />
                     <h4 className="text-sm font-bold text-foreground mb-1">No Known Community Patterns</h4>
                     <p className="text-xs text-muted">This investigation does not currently match any established threat clusters.</p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                   <div>
                      <div className="font-bold text-success mb-2 uppercase tracking-wider text-xs">Shared Anonymously</div>
                      <ul className="list-disc pl-5 text-slate-500 space-y-1">
                         <li>Anonymized scam patterns</li>
                         <li>Non-sensitive behavioral indicators</li>
                         <li>Pattern category (e.g., Delivery Scam)</li>
                      </ul>
                   </div>
                   <div>
                      <div className="font-bold text-danger mb-2 uppercase tracking-wider text-xs">Never Shared</div>
                      <ul className="list-disc pl-5 text-slate-500 space-y-1">
                         <li>Original audio or exact transcripts</li>
                         <li>Phone numbers or OTP codes</li>
                         <li>Passwords or personal identifiers</li>
                      </ul>
                   </div>
                </div>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEPPER NAVIGATION CONTROLS HIDDEN */}
        <div className="hidden">
          <button 
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} 
            disabled={currentStep === 1}
            className="btn-ghost py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50"
          >
            Previous
          </button>
          
          <button 
            onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))} 
            disabled={currentStep === 6}
            className="btn-primary py-2 px-8 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next Stage <ArrowLeft size={16} className="rotate-180" />
          </button>
        </div>

      </main>

      {/* FLOATING ASK SONA WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 no-print">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{opacity: 0, y: 20, scale: 0.95}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 20, scale: 0.95}} className="absolute bottom-20 right-0 w-[360px] sm:w-[420px] h-[550px] glass-panel border border-white/80 shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-white/60 border-b border-slate-200/50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-800 font-bold tracking-tight"><Zap className="text-primary" size={18} /> Ask SONA</div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5"><XCircle size={18}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white/30 scrollbar-hide">
                <div className="bg-[#008A45]/10 border border-[#008A45]/30 rounded-xl p-4 text-sm text-slate-600 font-medium leading-relaxed shadow-sm">
                  Hi, I'm SONA. Aap mujhse is audio/message ke baare mein sawal kar sakte hain. Agar aap ko fraud ka khatra hai to poochein ke kya karna chahiye.
                </div>
                {askHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAsking && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-500 flex items-center gap-2 font-medium shadow-sm">
                      <Loader2 size={14} className="animate-spin text-primary" /> Analyzing...
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-200/50 bg-white/80 flex gap-2">
                <input 
                  type="text" 
                  value={askQuery} 
                  onChange={e => setAskQuery(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleAskSona()}
                  placeholder="Ask about this investigation..."
                  className="flex-1 glass-input bg-white/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white"
                  disabled={isAsking}
                />
                <button onClick={handleAskSona} disabled={isAsking || !askQuery.trim()} className="btn-primary p-3 rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center shadow-md">
                  <ArrowLeft className="rotate-180" size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="btn-primary rounded-full p-4 shadow-lg shadow-primary/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group">
          {isChatOpen ? <XCircle size={24} /> : <MessageCircle size={24} />}
          {!isChatOpen && <span className="font-bold hidden sm:block pr-2">Ask SONA</span>}
        </button>
      </div>
      
    </div>
  );
}
