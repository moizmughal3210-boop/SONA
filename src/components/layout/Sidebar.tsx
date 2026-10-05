"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Search, Folder, ShieldAlert, ShieldCheck, 
  FileText, Settings, HelpCircle, Zap, Activity
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Investigate", href: "/investigate", icon: Search },
    { name: "Investigations", href: "/investigations", icon: Folder },
    { name: "Threat Intelligence", href: "/threats", icon: ShieldAlert },
    { name: "Safety Center", href: "/safety", icon: ShieldCheck },
    { name: "Reports", href: "/reports", icon: FileText },
  ];

  return (
    <aside className="w-64 h-full border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        <div className="p-6 border-b border-white/5 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-widest text-white">🎙️ SONA 🇵🇰</span>
          </div>
          <span className="text-[10px] text-[#7C3AED] font-medium tracking-wide">Pakistan Ka AI Guardian</span>
        </div>
        
        <nav className="p-4 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3 px-3">Main Menu</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={16} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 space-y-1 mt-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3 px-3">Workspace</div>
          <Link href="/investigations" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-white/60 hover:text-white hover:bg-white/5">
             <Activity size={16} /> Recent Investigations
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-white/60 hover:text-white hover:bg-white/5">
           <Settings size={16} /> Settings
        </Link>
        <Link href="/help" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-white/60 hover:text-white hover:bg-white/5">
           <HelpCircle size={16} /> Help
        </Link>
      </div>
    </aside>
  );
}
