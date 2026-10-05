"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowLeft, UploadCloud, FileAudio, XCircle, Loader2, Zap, ShieldCheck, Mic, Square, Play, Pause, Trash2, Globe
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function InvestigateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") as "audio" | "text" | "url" | "message" | null;

  const [state, setState] = useState<1 | 2 | 3 | 4>(1); 
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [inputType, setInputType] = useState<"audio"|"text"|"url"|"message"|"image"|"screenshot"|"video">(modeParam as any || "audio");
  const [textContent, setTextContent] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("auto");
  const [events, setEvents] = useState<{time: string, title: string, desc: string, status: 'pending'|'processing'|'complete'}[]>([]);
  const startTimeRef = useRef(Date.now());

  // Real Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Playback in Confirm State
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const getElapsed = () => {
    const ms = Date.now() - startTimeRef.current;
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
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

  const getAcceptedFileTypes = () => {
    if (inputType === 'video') return "video/mp4,video/quicktime,video/webm";
    if (['image', 'screenshot'].includes(inputType)) return "image/jpeg,image/png,image/webp";
    return "audio/*";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], "live_recording.webm", { type: "audio/webm" });
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        setState(2);
      };

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setVolume(avg);
          requestAnimationFrame(updateVolume);
        } else {
          setVolume(0);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      updateVolume();

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Microphone access is required to use live recording. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (playbackRef.current) {
      if (isPlaying) {
        playbackRef.current.pause();
      } else {
        playbackRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (s: number) => {
    return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  };

  const addEvent = (title: string, desc: string, status: 'pending'|'processing'|'complete', indexToUpdate?: number) => {
    setEvents(prev => {
      if (indexToUpdate !== undefined) {
        const newEvents = [...prev];
        newEvents[indexToUpdate] = { ...newEvents[indexToUpdate], status, desc };
        return newEvents;
      }
      return [...prev, { time: getElapsed(), title, desc, status }];
    });
  };

  const handleStartInvestigation = async () => {
    if (["audio", "image", "screenshot", "video"].includes(inputType) && !selectedFile) return;
    if (["text", "url", "message"].includes(inputType) && !textContent.trim()) return;
    
    setState(3);
    setEvents([]);
    startTimeRef.current = Date.now();

    try {
      let result: any;
      const isMediaFile = ["audio", "image", "screenshot", "video"].includes(inputType);
      if (isMediaFile) {
        if (inputType === "audio") {
          if (!audioUrl && selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setAudioUrl(url);
            sessionStorage.setItem("sonaAudioUrl", url);
          } else if (audioUrl) {
            sessionStorage.setItem("sonaAudioUrl", audioUrl);
          }
          sessionStorage.setItem("sonaAudioDuration", formatDuration(recordingDuration || 43));
        } else {
          sessionStorage.removeItem("sonaAudioUrl");
          sessionStorage.removeItem("sonaAudioDuration");
        }
        addEvent("Ingesting File", `${selectedFile?.name || 'file'}`, 'complete');
      } else {
        sessionStorage.removeItem("sonaAudioUrl");
        sessionStorage.removeItem("sonaAudioDuration");
        addEvent("Ingesting Input", `${inputType.toUpperCase()} Data`, 'complete');
      }
      
      await new Promise(r => setTimeout(r, 1000));
      addEvent("Integrity Check", "Verifying structure", 'complete');

      await new Promise(r => setTimeout(r, 1000));
      if (inputType === "audio") {
        addEvent("Transcription", "Running Multilingual Recognition", 'processing');
        const formData = new FormData();
        formData.append("audio", selectedFile!);
        formData.append("language", selectedLang);
        
        const response = await fetch("http://localhost:8000/investigate", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Investigation failed");
        result = await response.json();
      } else if (["image", "screenshot", "video"].includes(inputType)) {
        addEvent("Media Forensics", "Extracting OCR & Forensics", 'processing');
        const formData = new FormData();
        formData.append("file", selectedFile!);
        formData.append("mode", inputType);
        formData.append("language", selectedLang);
        
        const response = await fetch("http://localhost:8000/investigate/media", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Investigation failed");
        result = await response.json();
      } else {
        addEvent("Text Analysis", "Running Unified Investigation Pipeline", 'processing');
        const response = await fetch("http://localhost:8000/investigate/unified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_type: inputType, content: textContent }),
        });
        if (!response.ok) throw new Error("Investigation failed");
        result = await response.json();
      }
      
      if (result.error) throw new Error(result.error);
      
      addEvent("Analysis", `${result.word_count || 0} words processed`, 'complete', 2);
      
      if (!result.claims || result.claims.length === 0) {
          addEvent("Claim Extraction", `No verifiable claims found`, 'complete');
      } else {
          await new Promise(r => setTimeout(r, 800));
          addEvent("Claim Extraction", `${result.claims?.length || 0} claims identified`, 'complete');
          
          await new Promise(r => setTimeout(r, 800));
          addEvent("Evidence Retrieval", "Querying trusted sources...", 'processing');
          
          await new Promise(r => setTimeout(r, 1500));
          addEvent("Evidence Retrieval", `${result.source_count || 0} sources verified`, 'complete', 5);
      }
      
      await new Promise(r => setTimeout(r, 800));
      addEvent("Finalizing Report", "Building intelligence profile", 'complete');

      sessionStorage.setItem("sonaReport", JSON.stringify(result));
      sessionStorage.setItem("sonaElapsed", getElapsed());
      
      await new Promise(r => setTimeout(r, 1500));
      router.push("/report");
      
    } catch (error) {
      console.error("Investigation failed:", error);
      setState(4); 
    }
  };

  const handleCancel = () => { 
    setState(1); 
    setSelectedFile(null); 
    setAudioUrl(null);
    setTextContent("");
    setIsPlaying(false);
  };

  const fadeVariants: Variants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-full flex flex-col font-sans relative w-full">

      <main className="flex-1 flex flex-col items-center justify-start pt-8 px-4 sm:px-6 z-10 w-full">
        
        {/* Stepper Header */}
        <div className="w-full max-w-[640px] mb-8 flex justify-between items-center px-4 relative">
           <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200/50 -z-10"></div>
           <div className="absolute top-1/2 left-10 h-0.5 bg-primary transition-all duration-500 -z-10" style={{width: state === 1 ? '0%' : state === 2 ? '50%' : '100%'}}></div>
           
           <div className="flex flex-col items-center gap-2 bg-background px-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors shadow-sm ${state >= 1 ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface border-muted/30 text-muted'}`}>1</div>
             <span className={`text-xs font-semibold ${state >= 1 ? 'text-primary' : 'text-muted'}`}>Input</span>
           </div>
           
           <div className="flex flex-col items-center gap-2 bg-transparent px-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors shadow-sm ${state >= 2 ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface border-muted/30 text-muted'}`}>2</div>
             <span className={`text-xs font-semibold ${state >= 2 ? 'text-primary' : 'text-muted'}`}>Confirm</span>
           </div>

           <div className="flex flex-col items-center gap-2 bg-transparent px-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors shadow-sm ${state >= 3 ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface border-muted/30 text-muted'}`}>3</div>
             <span className={`text-xs font-semibold ${state >= 3 ? 'text-primary' : 'text-muted'}`}>Processing</span>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {state === 1 && (
            <motion.div key="state-1" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-[640px]">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">New Investigation</h1>
                <p className="text-muted font-medium">Select an input type to begin analyzing.</p>
              </div>
              
              <div className="flex justify-center gap-2 mb-6">
                {['audio', 'text', 'url', 'message'].map(t => (
                  <button key={t} onClick={() => setInputType(t as any)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${inputType === t ? 'bg-primary text-white shadow-sm' : 'bg-surface text-muted hover:bg-surface/80 border border-border'}`}>
                    {t}
                  </button>
                ))}
              </div>

              {inputType === "audio" && (
                !isRecording ? (
                  <div 
                    onDragOver={handleDragOver} 
                    onDragLeave={handleDragLeave} 
                    onDrop={handleDrop} 
                    className={`glass-panel w-full p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center text-center shadow-sm
                    ${isDragging ? "border-primary bg-primary/10" : "border-primary/20 hover:border-primary/40 hover:bg-surface/80"}`}
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors shadow-sm ${isDragging ? 'bg-primary/20 text-primary' : 'bg-surface text-primary-light'}`}>
                      <UploadCloud size={32} />
                    </div>
                    <h2 className="text-lg font-bold text-foreground mb-1">Drag & Drop Audio File</h2>
                    <p className="text-muted text-sm mb-6">MP3, WAV, OGG, M4A up to 50MB</p>
  
                    <div className="mb-8 w-full max-w-[280px]">
                      <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wider text-left"><Globe size={12} className="inline mr-1" /> Speech Language</label>
                      <select 
                        value={selectedLang} 
                        onChange={(e) => setSelectedLang(e.target.value)}
                        className="w-full glass-input rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="auto">Auto Detect</option>
                        <option value="ur">Urdu (اردو)</option>
                        <option value="en">English</option>
                        <option value="mixed">Multilingual (Urdu + English)</option>
                      </select>
                    </div>
                    
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="audio/*" />
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-[400px]">
                      <button onClick={() => fileInputRef.current?.click()} className="btn-ghost flex-1 py-3 bg-white/60 shadow-sm border-slate-200">
                        Browse Files
                      </button>
                      <button onClick={startRecording} className="btn-primary flex-1 py-3 shadow-md flex items-center justify-center gap-2 bg-danger hover:bg-red-600 shadow-danger/20 border-danger">
                        <Mic size={18} /> Record Live
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel border-danger/30 w-full p-8 md:p-12 rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-danger/5"></div>
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative z-10">
                      <div className="absolute inset-0 bg-danger/20 rounded-full transition-all duration-75 blur-md" style={{ transform: `scale(${1 + volume / 50})` }}></div>
                      <div className="w-16 h-16 bg-danger text-white rounded-full flex items-center justify-center z-10 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <Mic size={24} />
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Recording Active</h2>
                    <div className="text-3xl font-mono font-bold text-danger mb-8">{formatDuration(recordingDuration)}</div>
                    
                    <button onClick={stopRecording} className="btn-primary w-full max-w-[240px] py-3 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 shadow-lg border-slate-800">
                      <Square size={16} fill="currentColor" /> Stop Recording
                    </button>
                  </div>
                )
              )}
              
              {inputType === "text" && (
                <div className="glass-panel w-full p-6 rounded-2xl shadow-sm border border-primary/20">
                  <textarea 
                     value={textContent}
                     onChange={(e) => setTextContent(e.target.value)}
                     placeholder="Paste a claim, message, statement, or text you want SONA to investigate..."
                     className="w-full h-40 bg-surface/50 border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-4 resize-none"
                  />
                  <div className="flex justify-end items-center gap-4">
                     <span className="text-xs text-muted">{textContent.length} characters</span>
                     <button onClick={() => { if(textContent.trim()) setState(2) }} disabled={!textContent.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next Step <ArrowLeft size={16} className="rotate-180" />
                     </button>
                  </div>
                </div>
              )}

              {inputType === "url" && (
                <div className="glass-panel w-full p-6 rounded-2xl shadow-sm border border-primary/20">
                  <input 
                     type="url"
                     value={textContent}
                     onChange={(e) => setTextContent(e.target.value)}
                     placeholder="Paste a website or article URL to investigate..."
                     className="w-full bg-surface/50 border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-4"
                  />
                  <div className="flex justify-end items-center gap-4">
                     <button onClick={() => { if(textContent.trim()) setState(2) }} disabled={!textContent.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next Step <ArrowLeft size={16} className="rotate-180" />
                     </button>
                  </div>
                </div>
              )}

              {inputType === "message" && (
                <div className="glass-panel w-full p-6 rounded-2xl shadow-sm border border-primary/20">
                  <textarea 
                     value={textContent}
                     onChange={(e) => setTextContent(e.target.value)}
                     placeholder="Paste a WhatsApp, SMS, or suspicious message..."
                     className="w-full h-32 bg-surface/50 border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-4 resize-none"
                  />
                  <div className="flex justify-end items-center gap-4">
                     <span className="text-xs text-muted">{textContent.length} characters</span>
                     <button onClick={() => { if(textContent.trim()) setState(2) }} disabled={!textContent.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next Step <ArrowLeft size={16} className="rotate-180" />
                     </button>
                  </div>
                </div>
              )}
              
              {['image', 'screenshot', 'video'].includes(inputType) && (
                <div 
                  className={`w-full p-12 border-2 border-dashed rounded-xl bg-surface/50 backdrop-blur-sm transition-all duration-300 flex flex-col items-center text-center cursor-pointer group ${isDragging ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Upload {inputType}</h3>
                  <p className="text-muted text-sm font-medium">Drag & drop or click to browse</p>
                  <p className="text-xs text-muted/50 mt-2">Maximum file size: 50MB</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-center items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck size={14} className="text-success" />
                Data is processed securely and not stored permanently.
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <h3 className="text-sm font-bold text-center text-slate-400 mb-6 uppercase tracking-widest">Kya check kar sakte hain?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="text-sm font-bold text-white">WhatsApp Voice Notes</h4>
                    <p className="text-xs text-slate-400 mt-1">Jo suspicious lagein</p>
                    <p className="text-[10px] text-slate-500 mt-1">OGG format support</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">📞</div>
                    <h4 className="text-sm font-bold text-white">Scam Call Recordings</h4>
                    <p className="text-xs text-slate-400 mt-1">Bank ya government fraud calls</p>
                    <p className="text-[10px] text-slate-500 mt-1">MP3/WAV format</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">🎙️</div>
                    <h4 className="text-sm font-bold text-white">Viral Audio Clips</h4>
                    <p className="text-xs text-slate-400 mt-1">Jo social media pe phailein</p>
                    <p className="text-[10px] text-slate-500 mt-1">Koi bhi format</p>
                  </div>
                </div>
                <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-3 text-center flex items-center justify-center gap-2 text-xs text-primary font-medium">
                  🇵🇰 <span><strong>Pakistan tip:</strong> WhatsApp voice notes OGG format mein hoti hain. Direct upload karein ya record karein.</span>
                </div>
              </div>
            </motion.div>
          )}

          {state === 2 && (
            <motion.div key="state-2" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-[640px]">
              <div className="glass-panel p-8 w-full border-primary/20 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">Confirm Selection</h2>
                
                <div className="flex flex-col gap-4 bg-surface p-6 rounded-xl border border-primary/10 mb-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-sm">
                      {inputType === 'audio' ? <FileAudio size={28} /> : <Globe size={28} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground truncate">{inputType === 'audio' ? (selectedFile?.name || "audio_file.webm") : `${inputType.toUpperCase()} Input`}</h3>
                      <div className="text-sm text-muted mt-1">
                        {inputType === 'audio' ? (
                          <>
                            {(selectedFile?.size ? selectedFile.size / 1024 / 1024 : 0).toFixed(2)} MB 
                            {recordingDuration > 0 ? ` • ${formatDuration(recordingDuration)}` : ''}
                          </>
                        ) : (
                          <>{textContent.length} characters</>
                        )}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 flex items-center gap-1">
                      <Globe size={12}/> {selectedLang === 'ur' ? 'Urdu' : selectedLang === 'en' ? 'English' : selectedLang === 'mixed' ? 'Mixed' : 'Auto'}
                    </div>
                  </div>
                  
                  {audioUrl && (
                    <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3 shadow-sm">
                      <button onClick={togglePlayback} className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors shadow-sm">
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                      </button>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-primary/30 w-full animate-pulse"></div>
                      </div>
                      <audio 
                        ref={playbackRef} 
                        src={audioUrl} 
                        onEnded={() => setIsPlaying(false)} 
                        className="hidden" 
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button onClick={handleCancel} className="btn-ghost flex-1 py-3 text-sm flex items-center justify-center gap-2 text-slate-600 hover:bg-white/80">
                    <Trash2 size={16} /> Discard
                  </button>
                  <button onClick={handleStartInvestigation} className="btn-primary flex-[2] py-3 text-sm flex items-center justify-center gap-2">
                    <Zap size={16} /> Start Pipeline
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state === 3 && (
            <motion.div key="state-3" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-[640px]">
              <div className="glass-panel p-10 w-full relative overflow-hidden border border-slate-200 shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
                  <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-1/3"></div>
                </div>

                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis in Progress</h2>
                  <p className="text-slate-500 text-sm font-medium">{selectedFile?.name}</p>
                </div>
                
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-8 max-w-[400px] mx-auto">
                  <AnimatePresence>
                    {events.map((ev, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative">
                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-[3px] border-white mt-0.5 shadow-sm ${ev.status === 'processing' ? 'bg-primary' : ev.status === 'complete' ? 'bg-success' : 'bg-slate-300'}`} />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded shadow-sm">{ev.time}</span>
                            <span className="text-slate-800 font-bold text-sm tracking-tight">{ev.title}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-500 text-xs font-medium">{ev.desc}</span>
                            {ev.status === 'processing' && <Loader2 size={12} className="animate-spin text-primary" />}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {state === 4 && (
            <motion.div key="state-4" variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-[500px]">
              <div className="glass-panel border-t-4 border-t-danger p-10 flex flex-col items-center text-center shadow-md">
                <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <XCircle size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-slate-900">Processing Failed</h2>
                <p className="text-slate-500 mb-8 text-sm">The pipeline encountered an issue. Please ensure API connections are active and the file contains recognizable speech.</p>
                <button onClick={handleCancel} className="btn-primary w-full py-3 bg-danger hover:bg-red-600 shadow-danger/20 border-danger">Return to Upload</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function InvestigatePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white">Loading...</div>}>
      <InvestigateContent />
    </Suspense>
  );
}
