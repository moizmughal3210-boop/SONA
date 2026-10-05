"use client";
import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";

export default function MicCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsVisible(true);
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                          target.tagName.toLowerCase() === 'button' ||
                          target.tagName.toLowerCase() === 'a' ||
                          target.closest('button') || target.closest('a');
      setIsHovering(!!isClickable);
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        body { cursor: none !important; }
        a, button, select, input, [role="button"] { cursor: none !important; }
      `}} />
      <motion.div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 0.1 }}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md" style={{ transform: isHovering ? 'scale(1.8)' : 'scale(1.2)' }}></div>
          <div className="absolute inset-0 bg-white/10 rounded-full blur-lg" style={{ transform: isHovering ? 'scale(2.5)' : 'scale(1.5)' }}></div>
          <Mic size={24} className="text-white drop-shadow-md" strokeWidth={isHovering ? 2.5 : 2} />
        </div>
      </motion.div>
    </>
  );
}
