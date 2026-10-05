"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 scroll-smooth">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
            <Footer />
        </main>
      </div>
    </div>
  );
}
