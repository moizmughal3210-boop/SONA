"use client";
import { motion } from "framer-motion";
import { Mic, FileText, Link as LinkIcon, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleInputSelect = (type: string) => {
    router.push(`/investigate?mode=${type}`);
  };

  return (
    <div className="min-h-full flex flex-col justify-center items-center px-6 py-12 lg:py-24 max-w-5xl mx-auto">
      
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
          🇵🇰 Built for Pakistan · Made for Urdu
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 tracking-tight text-white drop-shadow-md max-w-4xl mx-auto">
          <span className="block">Pakistan Ka Apna</span>
          <span className="block text-primary">AI Investigation Platform</span>
        </h1>
        
        <p className="text-xl font-medium text-white/90 mb-4 leading-relaxed max-w-2xl mx-auto">
          Jo Pakistani families ko scams aur misinformation se bachata hai — Urdu mein, Roman Urdu mein, aur Pakistani context ke saath.
        </p>

        <p className="text-base text-white/60 mb-8 leading-relaxed max-w-2xl mx-auto">
          SONA investigates suspicious voice notes, political audio, and viral WhatsApp clips using Pakistani sources, Pakistani context, and delivers reports in Urdu and English — in under 12 seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/investigate" className="bg-primary hover:bg-primary-light text-white text-sm font-bold px-8 py-3 rounded transition-colors shadow-lg shadow-primary/20">
            Start Investigation
          </Link>
          <Link href="/investigations" className="text-sm px-6 py-3 flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors font-medium border border-white/10 rounded hover:bg-white/5">
            View Investigations <ArrowRight size={14}/>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-2xl mb-1">🇵🇰</div>
            <div className="font-bold text-white text-sm">Pakistan-First</div>
            <div className="text-xs text-white/60">Built for Pakistani families</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-2xl mb-1">🗣️</div>
            <div className="font-bold text-white text-sm">Roman Urdu</div>
            <div className="text-xs text-white/60">Reports in your language</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-bold text-white text-sm">12 Seconds</div>
            <div className="text-xs text-white/60">Full investigation instantly</div>
          </div>
        </div>
      </motion.div>

      {/* SONA Samajhta Hai Pakistan Ko */}
      <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="w-full mb-20">
        <h2 className="text-2xl font-bold text-center text-white mb-8">SONA Samajhta Hai Pakistan Ko</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-surface/50 border border-white/10 shadow-sm">
            <div className="text-3xl mb-4">🗣️</div>
            <h3 className="text-lg font-bold text-white mb-2">Urdu + Roman Urdu</h3>
            <p className="text-sm text-white/60">Urdu, English, aur mixed code-switching — sab samajhta hai</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface/50 border border-white/10 shadow-sm">
            <div className="text-3xl mb-4">🏦</div>
            <h3 className="text-lg font-bold text-white mb-2">Pakistani Sources</h3>
            <p className="text-sm text-white/60">Dawn, Geo, PBS, SBP, PTA — Pakistani sources se verify karta hai</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface/50 border border-white/10 shadow-sm">
            <div className="text-3xl mb-4">🚔</div>
            <h3 className="text-lg font-bold text-white mb-2">FIA + PTA Direct</h3>
            <p className="text-sm text-white/60">Scam confirm hone par seedha FIA aur PTA se connect karta hai</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} className="w-full mt-8">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest text-center mb-6">Quick Investigation</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <button onClick={() => handleInputSelect('audio')} className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Mic size={20}/></div>
             <div className="font-bold text-sm text-white mb-1">Audio Analysis</div>
             <div className="text-[10px] text-white/40 text-center">Record or upload voice notes</div>
          </button>
          
          <button onClick={() => handleInputSelect('text')} className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><FileText size={20}/></div>
             <div className="font-bold text-sm text-white mb-1">Text Analysis</div>
             <div className="text-[10px] text-white/40 text-center">Paste suspicious text or claims</div>
          </button>

          <button onClick={() => handleInputSelect('screenshot')} className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><path d="m9 16 3-3 3 3"/></svg></div>
             <div className="font-bold text-sm text-white mb-1">Screenshot Scan</div>
             <div className="text-[10px] text-white/40 text-center">Check fake receipts & UI</div>
          </button>
          
          <button onClick={() => handleInputSelect('url')} className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><LinkIcon size={20}/></div>
             <div className="font-bold text-sm text-white mb-1">URL Verification</div>
             <div className="text-[10px] text-white/40 text-center">Check suspicious links</div>
          </button>
          
          <button onClick={() => handleInputSelect('message')} className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><MessageSquare size={20}/></div>
             <div className="font-bold text-sm text-white mb-1">Message Trace</div>
             <div className="text-[10px] text-white/40 text-center">Analyze chat messages & texts</div>
          </button>

          <button onClick={() => handleInputSelect('image')} className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>
             <div className="font-bold text-sm text-white mb-1">Image Forensics</div>
             <div className="text-[10px] text-white/40 text-center">Detect visual manipulation</div>
          </button>

          <button onClick={() => handleInputSelect('video')} className="group flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:-translate-y-1">
             <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg></div>
             <div className="font-bold text-sm text-white mb-1">Video Analysis</div>
             <div className="text-[10px] text-white/40 text-center">Analyze frames & audio track</div>
          </button>
        </div>
      </motion.div>

      {/* Pakistan Story Section */}
      <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="w-full max-w-3xl mx-auto p-8 rounded-2xl bg-[#002B15]/40 border border-[#005128] shadow-lg mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#005128]/30 blur-3xl rounded-full"></div>
        <div className="text-4xl mb-6 relative z-10">🇵🇰</div>
        <div className="text-white/90 text-lg leading-relaxed space-y-6 relative z-10">
          <p className="font-bold text-xl">Ek voice note ne sab badal diya.</p>
          <p>
            2023 mein Pakistan mein ek 40-second WhatsApp voice note ne claim kiya ke ek common medicine dangerous hai. 48 ghante mein 2 million logon ne yeh suna. Sirf haath se check kiya tab pata chala ke yeh jhoot tha.
          </p>
          <p className="font-bold">Tab humne SONA banaya.</p>
          <p>
            Kyunke Pakistan mein misinformation text se nahi — voice se failti hai. Aur ab uska jawab bhi voice mein hai.
          </p>
        </div>
        <div className="mt-8 relative z-10">
          <Link href="/investigate" className="inline-flex items-center gap-2 bg-[#008A45] hover:bg-[#007038] text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg">
            🎙️ SONA Azmaiye — Free Hai
          </Link>
        </div>
      </motion.div>
      
    </div>
  );
}
