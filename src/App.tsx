/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BootScreen } from "./components/BootScreen";
import { PrankCard } from "./components/PrankCard";
import { FloatingHearts, CursorChaos, StarryBackground } from "./components/BackgroundElements";
import { AIPopup } from "./components/AIPopup";
import { SharePrank } from "./components/SharePrank";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { soundService } from "./lib/sounds";

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundService.setMuted(nextMuted);
  };

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden selection:bg-pink-500 selection:text-white">
      <StarryBackground />
      
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <AnimatePresence>
        {!isBooted ? (
          <BootScreen onComplete={() => setIsBooted(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full min-h-screen"
          >
            <FloatingHearts />
            <CursorChaos />
            <AIPopup />
            <PrankCard />
            <SharePrank />
            
            {/* Sound Control */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="fixed top-4 left-4 z-[70] w-10 h-10 glass rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </motion.button>
            
            {/* Corner Info */}
            <div className="fixed bottom-4 left-4 z-50 pointer-events-none opacity-30 hover:opacity-100 transition-opacity">
              <p className="text-[10px] font-mono text-pink-500 uppercase tracking-widest">
                LoveOS v2.1.0-beta // Security Level: 0
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
