"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black/20 pt-12 pb-6 px-6 shrink-0 relative z-10">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-white">🎙️ SONA 🇵🇰</h2>
          <p className="text-sm text-primary font-bold mt-1">Pakistan Ka Apna AI Investigation Platform</p>
          <p className="text-xs text-white/60 mt-1 italic">"Kyunke sach sunna aasaan hona chahiye."</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60 font-medium">
          <Link href="/investigate" className="hover:text-white transition-colors">Investigate</Link>
          <Link href="/threats" className="hover:text-white transition-colors">Threats</Link>
          <Link href="/family" className="hover:text-white transition-colors">Family</Link>
          <Link href="/investigations" className="hover:text-white transition-colors">History</Link>
          <Link href="/shield" className="hover:text-white transition-colors">Shield</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
        
        <div className="text-xs text-white/40 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          Powered by: Gemini AI · Claude AI · Tavily <span className="mx-2">|</span> Made with ❤️ for Pakistan
        </div>
        
        <div className="text-[10px] text-white/30 pt-4 w-full border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
          <span>© 2026 SONA</span>
          <span>Pakistan ka digital guardian</span>
          <span>FIA Cybercrime Partner (Coming Soon)</span>
        </div>
      </div>
    </footer>
  );
}
