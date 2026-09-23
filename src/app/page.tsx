"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, Variants } from "framer-motion";
import {
  Menu,
  X,
  FileText,
  Image as ImageIcon,
  Mic,
  Upload,
  Activity,
  CheckCircle,
  FileDown,
  ExternalLink,
  Music,
} from "lucide-react";
import Link from "next/link";

// Animated Counter Component
function AnimatedCounter({ from, to, duration = 2, suffix = "" }: { from: number, to: number, duration?: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [inView, from, to, duration, suffix]);

  return <span ref={ref}>{from}{suffix}</span>;
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Changed to 50px as requested
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Generate random particles for hero
  interface Particle {
    id: number;
    width: number;
    height: number;
    backgroundColor: string;
    left: string;
    top: string;
    animateX: number[];
    animateY: number[];
    duration: number;
  }

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        width: Math.random() * 4 + 2,
        height: Math.random() * 4 + 2,
        backgroundColor: Math.random() > 0.5 ? "#7C3AED" : "#06B6D4",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animateX: [0, Math.random() * 100 - 50],
        animateY: [0, Math.random() * 100 - 50],
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F8FAFC] selection:bg-purple-500/30">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <span className="text-2xl font-bold text-white">SONA</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              About
            </a>
            <Link href="/investigate" className="btn-primary">
              Investigate Audio &rarr;
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0A0F] border-b border-white/10 py-4 px-6 flex flex-col gap-4 shadow-xl">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2">
              How It Works
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2">
              About
            </a>
            <Link href="/investigate" className="btn-primary text-center w-full mt-2">
              Investigate Audio &rarr;
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Animated Radial Background */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] -z-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #7C3AED 0%, #06B6D4 50%, #0A0A0F 100%)",
          }}
        />

        {/* Particle Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {particles.length > 0 && particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full opacity-30"
              style={{
                width: p.width,
                height: p.height,
                backgroundColor: p.backgroundColor,
                left: p.left,
                top: p.top,
              }}
              animate={{
                x: p.animateX,
                y: p.animateY,
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Misinformation <br />
            <span className="gradient-text">travels by voice.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#94A3B8] mb-8 font-medium"
          >
            Now truth can too.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SONA investigates any audio clip — transcribing, fact-checking, and
            delivering evidence-backed investigation reports in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/investigate" className="btn-primary w-full sm:w-auto">
              Try SONA Free &rarr;
            </Link>
            <a href="#how-it-works" className="btn-ghost w-full sm:w-auto">
              See How It Works
            </a>
          </motion.div>
        </div>

        {/* Floating Stat Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4 relative z-10"
        >
          <motion.div variants={fadeUpVariant} className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span>🎙️</span> Audio-First
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Built specifically for voice content
            </p>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span>⚡</span> 12 Seconds
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Average investigation time
            </p>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span>🌍</span> Multilingual
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Urdu, English, Arabic and more
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* THE GAP SECTION */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Gap Nobody Fixed
            </h2>
            <p className="text-xl text-[#94A3B8]">
              Every format has fact-checkers. Except one.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={fadeUpVariant} className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="text-white/80" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Text Misinformation</h3>
              <p className="text-[#94A3B8] mb-8 flex-grow">
                100+ fact-checking tools exist
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 text-[#10B981] text-sm font-semibold border border-[#10B981]/20">
                <span>✓</span> COVERED
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeUpVariant} className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <ImageIcon className="text-white/80" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Image Misinformation</h3>
              <p className="text-[#94A3B8] mb-8 flex-grow">
                Reverse search tools available
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 text-[#10B981] text-sm font-semibold border border-[#10B981]/20">
                <span>✓</span> COVERED
              </div>
            </motion.div>

            {/* Card 3 (Highlighted) */}
            <motion.div 
              variants={fadeUpVariant} 
              className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden group"
              style={{
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.2), inset 0 0 20px rgba(124, 58, 237, 0.1)",
                borderColor: "rgba(124, 58, 237, 0.4)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/10 to-transparent opacity-50"></div>
              <div className="relative z-10 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-[#EF4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <Mic className="text-[#EF4444]" size={32} />
              </div>
              <h3 className="relative z-10 text-xl font-bold mb-3">Audio Misinformation</h3>
              <p className="relative z-10 text-[#94A3B8] mb-8 flex-grow">
                Zero consumer tools exist
              </p>
              <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-sm font-semibold border border-[#EF4444]/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                <span>✗</span> NOT COVERED
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold gradient-text pb-2">
              We built SONA for that gap.
            </h3>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Four Steps. One Investigation.
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 relative"
          >
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[44px] left-12 right-12 h-[2px] bg-white/10 -z-10"></div>

            {/* Step 1 */}
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center flex-1 w-full relative z-10">
              <div className="w-20 h-20 bg-[#0A0A0F] border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl relative">
                <Upload className="text-white/80" size={32} />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Audio</h3>
              <p className="text-[#94A3B8] text-sm px-4">
                Voice note, podcast, or any audio file
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center flex-1 w-full relative z-10">
              <div className="w-20 h-20 bg-[#0A0A0F] border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl relative">
                <Activity className="text-white/80" size={32} />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Transcribes</h3>
              <p className="text-[#94A3B8] text-sm px-4">
                Multilingual, noise-resistant transcription
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center flex-1 w-full relative z-10">
              <div className="w-20 h-20 bg-[#0A0A0F] border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl relative">
                <CheckCircle className="text-white/80" size={32} />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Claims Verified</h3>
              <p className="text-[#94A3B8] text-sm px-4">
                Each claim mapped to real evidence
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center flex-1 w-full relative z-10">
              <div className="w-20 h-20 bg-[#0A0A0F] border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl relative">
                <FileDown className="text-white/80" size={32} />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Report Generated</h3>
              <p className="text-[#94A3B8] text-sm px-4">
                Shareable, permanent, evidence-backed
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* LIVE DEMO PREVIEW SECTION */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See SONA In Action
            </h2>
            <p className="text-xl text-[#94A3B8]">
              A real investigation, live on screen
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-[700px] mx-auto"
          >
            {/* Subtle purple glow behind card */}
            <div className="absolute -inset-4 bg-[#7C3AED]/20 blur-2xl rounded-full z-0 pointer-events-none opacity-50" />

            <div className="glass-card p-6 md:p-8 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎙️</span>
                  <span className="font-semibold text-white">Sample Investigation</span>
                </div>
                <div className="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] font-bold px-4 py-1.5 rounded-lg text-sm">
                  HIGH RISK
                </div>
              </div>

              <div className="flex gap-4 mb-8 flex-wrap">
                <div className="flex items-center gap-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> 1 False
                </div>
                <div className="flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> 1 Misleading
                </div>
                <div className="flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" /> 1 Verified
                </div>
              </div>

              {/* Mini Claim Card */}
              <div className="bg-black/40 border border-white/5 border-l-[4px] border-l-[#EF4444] p-5 rounded-xl mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#94A3B8] text-xs font-semibold tracking-wider">CLAIM 01</span>
                  <div className="bg-[#EF4444]/15 border border-[#EF4444] text-[#EF4444] text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span>✗</span> FALSE
                  </div>
                </div>
                <p className="text-white font-medium mb-4 text-sm sm:text-base">
                  "Polio vaccine causes infertility in young children"
                </p>
                <div className="flex justify-between items-end gap-4">
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs text-white/70">
                    <ExternalLink size={12} /> WHO (2024)
                  </div>
                  <div className="w-24 sm:w-32">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-[#94A3B8]">Confidence</span>
                      <span className="text-[#EF4444] font-bold">92%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#EF4444] w-[92%]" />
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/investigate" className="btn-primary w-full flex items-center justify-center py-4 font-semibold text-lg">
                Investigate Your Own Audio &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-24 px-6 relative border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Who Uses SONA
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeUpVariant} className="glass-card p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="text-4xl mb-4">📰</div>
              <h3 className="text-xl font-bold mb-3">Journalists</h3>
              <p className="text-[#94A3B8] leading-relaxed">
                Verify politician speeches and press releases before publishing
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="glass-card p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3">Educators</h3>
              <p className="text-[#94A3B8] leading-relaxed">
                Help students identify misleading health and science audio content
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="glass-card p-8 hover:bg-white/10 transition-colors duration-300">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold mb-3">Citizens</h3>
              <p className="text-[#94A3B8] leading-relaxed">
                Fact-check WhatsApp voice notes received from family and friends
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ANIMATED NUMBER STATS SECTION */}
      <section className="py-24 px-6 relative border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <div className="text-5xl md:text-[64px] font-bold text-white mb-2">
                <AnimatedCounter from={0} to={2} suffix="M+" duration={2} />
              </div>
              <p className="text-[#94A3B8] font-medium text-lg">Voice notes analyzed daily</p>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <div className="text-5xl md:text-[64px] font-bold text-white mb-2">
                <AnimatedCounter from={0} to={12} suffix="s" duration={2} />
              </div>
              <p className="text-[#94A3B8] font-medium text-lg">Average investigation time</p>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <div className="text-5xl md:text-[64px] font-bold text-white mb-2">
                <AnimatedCounter from={0} to={94} suffix="%" duration={2} />
              </div>
              <p className="text-[#94A3B8] font-medium text-lg">Accuracy rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0F] border-t border-white/5 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎙️</span>
            <span className="text-2xl font-bold text-white">SONA</span>
          </div>
          <p className="text-[#F8FAFC] font-medium text-lg mb-8">
            Because truth shouldn't be hard to hear.
          </p>
          <p className="text-[#94A3B8] text-sm">
            © 2026 SONA. Audio Misinformation Investigation Platform.
          </p>
        </div>
      </footer>
    </main>
  );
}
