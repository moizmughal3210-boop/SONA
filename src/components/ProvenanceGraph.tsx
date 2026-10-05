"use client";
import { Link, Map, Activity, MessageSquare, Database, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProvenanceGraph({ claimData }: { claimData: any }) {
  if (!claimData) return null;
  
  return (
    <div className="w-full bg-surface/50 border border-border/50 rounded-2xl p-6 overflow-x-auto relative">
      <div className="min-w-[700px] flex flex-col items-center">
        
        {/* Origin Node */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm mb-2 z-10">
            <MessageSquare size={20} />
          </div>
          <div className="text-xs font-bold text-foreground">Extracted Statement</div>
          <div className="text-[10px] text-muted max-w-[250px] text-center mt-1 bg-surface px-2 py-1 rounded border border-border">
            "{claimData.original_claim}"
          </div>
        </div>

        {/* Vertical Line */}
        <div className="w-px h-8 bg-border/80 my-2"></div>

        {/* Claim Node */}
        <div className="flex flex-col items-center">
          <div className="px-4 py-2 rounded-xl bg-surface border-2 border-primary/40 text-foreground text-sm font-bold shadow-sm z-10 text-center max-w-[350px]">
            {claimData.claim}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1">
              <Map size={10}/> Canonical Claim
            </span>
          </div>
        </div>

        {/* Branching Lines */}
        <div className="w-full max-w-[500px] h-8 relative mt-2">
          <div className="absolute top-0 left-1/2 w-px h-full bg-border/80"></div>
          <div className="absolute top-4 left-1/4 right-1/4 h-px bg-border/80"></div>
          <div className="absolute top-4 left-1/4 w-px h-4 bg-border/80"></div>
          <div className="absolute top-4 right-1/4 w-px h-4 bg-border/80"></div>
        </div>

        {/* Evidence Nodes */}
        <div className="flex justify-between w-full max-w-[600px] mt-2">
          
          {/* Supporting Evidence */}
          <div className="flex flex-col items-center flex-1 px-4">
             <div className="w-10 h-10 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success shadow-sm mb-2 z-10">
               <CheckCircle size={16} />
             </div>
             <div className="text-xs font-bold text-success mb-2">Supporting Sources ({claimData.supporting_sources?.length || 0})</div>
             <div className="space-y-2 w-full">
               {claimData.supporting_sources?.map((s: any, i: number) => (
                 <a key={i} href={s.url} target="_blank" rel="noreferrer" className="block w-full bg-surface p-2 rounded border border-border text-[10px] text-muted hover:border-success/50 transition-colors">
                   <div className="font-bold text-foreground truncate mb-1">{new URL(s.url).hostname}</div>
                   <div className="truncate">{s.snippet}</div>
                 </a>
               ))}
               {(!claimData.supporting_sources || claimData.supporting_sources.length === 0) && (
                 <div className="text-[10px] text-muted italic text-center">No supporting evidence retrieved.</div>
               )}
             </div>
          </div>

          {/* Historical Origins */}
          <div className="flex flex-col items-center flex-1 px-4 border-l border-r border-border/50">
             <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm mb-2 z-10">
               <Database size={16} />
             </div>
             <div className="text-xs font-bold text-primary mb-2">Historical Footprints</div>
             <div className="space-y-2 w-full text-center">
               {claimData.historical_matches?.length > 0 ? (
                 <div className="text-[10px] text-muted">{claimData.historical_matches.length} prior occurrences found in SONA DB.</div>
               ) : (
                 <div className="text-[10px] text-muted italic">First occurrence (Novel Claim)</div>
               )}
             </div>
          </div>

          {/* Contradicting Evidence */}
          <div className="flex flex-col items-center flex-1 px-4">
             <div className="w-10 h-10 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger shadow-sm mb-2 z-10">
               <XCircle size={16} />
             </div>
             <div className="text-xs font-bold text-danger mb-2">Contradicting ({claimData.contradicting_sources?.length || 0})</div>
             <div className="space-y-2 w-full">
               {claimData.contradicting_sources?.map((s: any, i: number) => (
                 <a key={i} href={s.url} target="_blank" rel="noreferrer" className="block w-full bg-surface p-2 rounded border border-border text-[10px] text-muted hover:border-danger/50 transition-colors">
                   <div className="font-bold text-foreground truncate mb-1">{new URL(s.url).hostname}</div>
                   <div className="truncate">{s.snippet}</div>
                 </a>
               ))}
               {(!claimData.contradicting_sources || claimData.contradicting_sources.length === 0) && (
                 <div className="text-[10px] text-muted italic text-center">No contradicting evidence retrieved.</div>
               )}
             </div>
          </div>

        </div>

        {/* Bottom Connectors */}
        <div className="w-full max-w-[500px] h-12 relative mt-4">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-border/80"></div>
          <div className="absolute top-0 left-1/4 w-px h-6 bg-border/80"></div>
          <div className="absolute top-0 right-1/4 w-px h-6 bg-border/80"></div>
          <div className="absolute top-0 left-1/2 w-px h-12 bg-border/80"></div>
        </div>

        {/* Final Verdict Node */}
        <div className="flex flex-col items-center mt-[-1px]">
          <div className={`px-6 py-2 rounded-full border-2 text-sm font-bold shadow-sm z-10 
            ${claimData.verdict === 'VERIFIED' ? 'bg-success/10 border-success text-success' : 
              claimData.verdict === 'FALSE' ? 'bg-danger/10 border-danger text-danger' : 
              'bg-warning/10 border-warning text-warning'}`}>
            {claimData.verdict} (Confidence: {claimData.confidence}%)
          </div>
        </div>

      </div>
    </div>
  );
}
