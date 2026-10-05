"use client";
import { usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  
  // Format pathname to display title
  const title = pathname === '/' 
    ? "SONA Dashboard" 
    : pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ');

  return (
    <div className="flex flex-col shrink-0">
      <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold text-white tracking-wide uppercase">{title}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input 
              type="text" 
              placeholder="Search investigations..." 
              className="w-64 bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors placeholder:text-white/40"
            />
          </div>
          
          <div className="flex items-center gap-4 text-white/60">
            <button className="hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
              <User size={14} />
            </button>
          </div>
        </div>
      </header>
      {pathname === '/' && (
        <div className="w-full bg-[rgba(124,58,237,0.1)] py-1.5 text-center">
          <span className="text-[10px] text-[#7C3AED] font-medium">🇵🇰 Pakistan ka apna fact-checking platform · Urdu · Roman Urdu · English</span>
        </div>
      )}
    </div>
  );
}
