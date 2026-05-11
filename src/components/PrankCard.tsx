import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { MessageCircleHeart, HeartCrack, Info, ShieldAlert, Sparkles, Skull } from "lucide-react";
import { soundService } from "../lib/sounds";
import { useEffect } from "react";

const SAVAGE_REPLIES = [
  "Nice try 😭",
  "Wrong answer 💀",
  "Stop chasing me 😏",
  "L + ratio 💀",
  "Try again, buddy 😭",
  "Even AI said yes already",
  "You can’t escape destiny 😏",
  "Error: Rejection.exe stopped working",
  "Nice try, speedrunner",
  "My grandma taps faster than this",
  "Stay mad + stay single 🥱",
  "Your thumb is too slow 😭",
  "Missed me! 💨",
  "Screen too small? 🤏"
];

const SUCCESS_PHASES = [
  "FINAL BOSS: COMMITMENT",
  "Analyzing emotional stability...",
  "Compatibility: 99.9% confusion detected 💀",
  "Recalculating… result = YOU STILL LIKE ME 😏",
  "Processing relationship contract...",
  "Checking emotional stability (Fail)...",
  "Bypassing family approval...",
  "You are now officially trapped 😎💀",
  "No take-backs allowed.",
  "Congrats. You lost the game of love 😂"
];

const TERMS_CONTENT = [
  "You agree to unlimited emotional damage 💔",
  "No refunds for bad decisions 💀",
  "You accept eternal rizz exposure 😎",
  "Terms of Service: You are now a certified Simp.",
  "Privacy Policy: We know everything. We saw you trying to click NO."
];

const INITIAL_QUESTION = "I have something very important to ask you... 💌";
const DISTORTED_QUESTIONS = [
  "I have something very important to ask you... 💌",
  "You're going on a date with me, right? 😏",
  "I know you want to say yes... 💖",
  "Resistance is futile. 💀",
  "Just click the pink button already. 🥱",
  "Your webcam says you're smiling. 😏"
];

export const PrankCard = () => {
  const [stage, setStage] = useState<"ask" | "yes_loading" | "yes_final" | "no_final" | "cold_mode">("ask");
  const [successIndex, setSuccessIndex] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noButtonSize, setNoButtonSize] = useState(1);
  const [noClones, setNoClones] = useState<{ id: number; x: number; y: number }[]>([]);
  const [savageText, setSavageText] = useState("");
  const [noButtonText, setNoButtonText] = useState("No.");
  const [questionText, setQuestionText] = useState(INITIAL_QUESTION);
  const [showTerms, setShowTerms] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reality Distortion Effect
  useEffect(() => {
    let j = 0;
    const interval = setInterval(() => {
      j = (j + 1) % DISTORTED_QUESTIONS.length;
      setQuestionText(DISTORTED_QUESTIONS[j]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleYes = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setStage("yes_loading");
    soundService.playSuccess();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#d946ef", "#a855f7"]
    });

    // Cycle through messages
    let i = 0;
    const interval = setInterval(() => {
      if (i < SUCCESS_PHASES.length - 1) {
        i++;
        setSuccessIndex(i);
        soundService.playTick();
      } else {
        setStage("yes_final");
        clearInterval(interval);
      }
    }, 1500);
  }, []);

  // Auto Simp Mode
  useEffect(() => {
    if (stage === "ask") {
      idleTimerRef.current = setTimeout(() => {
        setSavageText("No response detected... assuming YES 😌");
        setTimeout(handleYes, 2000);
      }, 30000); // 30 seconds idle
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [stage, handleYes]);

  const moveNoButton = useCallback(() => {
    if (stage !== "ask") return;
    
    if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            setSavageText("No response detected... assuming YES 😌");
            setTimeout(handleYes, 2000);
        }, 30000);
    }

    soundService.playError();
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (Math.random() * (rect.width - 150)) - (rect.width / 2) + 75;
      const y = (Math.random() * (rect.height - 100)) - (rect.height / 2) + 50;
      
      setNoPosition({ x, y });
      setNoCount((prev) => prev + 1);
      
      // Randomize text
      setNoButtonText(SAVAGE_REPLIES[Math.floor(Math.random() * SAVAGE_REPLIES.length)]);

      // Effects based on count
      if (noCount > 3) {
        setNoButtonSize((prev) => Math.max(0.4, prev - 0.1));
      }
      
      if (noCount > 8) {
        // Clone mode
        const newClones = Array.from({ length: 3 }).map((_, i) => ({
          id: Date.now() + i,
          x: (Math.random() * (rect.width - 150)) - (rect.width / 2) + 75,
          y: (Math.random() * (rect.height - 100)) - (rect.height / 2) + 50,
        }));
        setNoClones((prev) => [...prev, ...newClones].slice(-12));
      }

      if (noCount === 12) {
          setStage("cold_mode");
          setTimeout(() => {
              setStage("ask");
              setNoCount(0);
              setNoClones([]);
              setNoPosition({ x: 0, y: 0 });
              setSavageText("Just kidding 😂 NO is not allowed");
          }, 4000);
      }

      if (noCount > 20) {
        setStage("no_final");
      }

      setSavageText(SAVAGE_REPLIES[Math.floor(Math.random() * SAVAGE_REPLIES.length)]);
      setTimeout(() => setSavageText(""), 2000);
    }
  }, [noCount, stage, handleYes]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" ref={containerRef}>
      <AnimatePresence mode="wait">
        {stage === "ask" && (
          <motion.div
            key="ask"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="glass w-full max-w-md p-8 rounded-3xl neon-border relative z-10 text-center"
          >
            <div className="mb-6 flex justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="bg-pink-500/20 p-4 rounded-full"
              >
                <MessageCircleHeart className="w-12 h-12 text-pink-500" />
              </motion.div>
            </div>

            <motion.h1 
                key={questionText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-display font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
            >
              {questionText}
            </motion.h1>
            
            <p className="text-gray-300 mb-8 text-lg">
              Will you go on a date with me?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center min-h-[160px] relative">
              {/* YES BUTTON */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYes}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all z-20 cursor-heart"
              >
                YES! 💖
              </motion.button>

              {/* NO BUTTON (The Star) */}
              <motion.button
                animate={{ 
                  x: noPosition.x, 
                  y: noPosition.y,
                  scale: noButtonSize,
                  rotate: noCount > 5 ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  type: "spring", 
                  damping: 10, 
                  stiffness: 100,
                  rotate: { repeat: Infinity, duration: 0.2 } 
                }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                className="px-6 py-3 bg-slate-800 text-gray-400 rounded-2xl font-bold text-sm border border-white/10 hover:border-red-500/50 transition-all pointer-events-auto whitespace-nowrap"
              >
                {noButtonText}
              </motion.button>

              {/* CLONES */}
              {noClones.map((clone) => (
                <motion.div
                  key={clone.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.4, scale: noButtonSize, x: clone.x, y: clone.y }}
                  className="absolute px-6 py-3 bg-slate-800/50 text-gray-400/50 rounded-2xl font-bold text-sm border border-white/5 pointer-events-none"
                >
                  No.
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {savageText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 text-red-400 font-mono text-xs"
                >
                  {savageText}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
                onClick={() => setShowTerms(true)}
                className="mt-8 text-[9px] text-gray-600 underline hover:text-gray-400 transition-colors"
            >
                Read Terms & Conditions
            </button>
          </motion.div>
        )}

        {stage === "cold_mode" && (
            <motion.div
                key="cold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-blue-900/90 flex flex-col items-center justify-center text-center p-8 backdrop-blur-3xl"
            >
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <ShieldAlert className="w-12 h-12 text-blue-300" />
                </div>
                <h2 className="text-3xl font-mono text-blue-200 mb-4">SYSTEM COLD REBOOT</h2>
                <div className="space-y-4 max-w-sm">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.5 }}
                            className="h-full bg-blue-400"
                        />
                    </div>
                    <p className="text-xs text-blue-400 font-mono">Installing sadness update...</p>
                    <p className="text-xs text-blue-400 font-mono">Deleting confidence.sys...</p>
                    <p className="text-xs text-blue-400 font-mono">Error: Rejection threshold exceeded.</p>
                </div>
            </motion.div>
        )}

        {(stage === "yes_loading" || stage === "yes_final") && (
          <motion.div
            key="yes"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              animate={{ backgroundColor: ["rgba(0,0,0,0.9)", "rgba(236,72,153,0.2)", "rgba(168,85,247,0.2)", "rgba(0,0,0,0.9)"] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 z-[-1]"
            />
            
            <div className={`glass max-w-md w-full p-10 rounded-3xl text-center ${successIndex === 0 ? "border-4 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]" : "neon-border"} space-y-6 transition-all duration-500`}>
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: successIndex === 0 ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {successIndex === 0 ? <Skull className="w-20 h-20 text-red-500" /> : <Sparkles className="w-16 h-16 text-yellow-400" />}
                </motion.div>
              </div>

              <h2 className={`text-2xl font-mono ${successIndex === 0 ? "text-red-500 font-bold" : "text-pink-400"}`}>
                {SUCCESS_PHASES[successIndex]}
              </h2>

              {stage === "yes_final" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-6 border-t border-white/10"
                >
                  <div className="bg-red-500/20 p-4 rounded-xl flex items-start gap-3 text-left mb-6">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                    <p className="text-sm text-red-200">
                      WARNING: Relationship status updated to LOCKED. Any attempt to modify will result in permanent emotional damage.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                  >
                    Accept My Fate
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {stage === "no_final" && (
          <motion.div
            key="no_final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass max-w-md w-full p-10 rounded-3xl text-center neon-border space-y-8"
          >
            <div className="flex justify-center">
              <HeartCrack className="w-20 h-20 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold">SYSTEM OVERLOAD</h2>
              <p className="text-xl font-mono text-red-400 animate-pulse">
                "NO BUTTON has filed for resignation 🚪😂"
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl text-left border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Info size={14} className="text-blue-400" />
                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">Resignation Letter</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "Dear User, I've had enough of running away. You're clearly too desperate. I'm moving to an app that actually has standards. Peace out."
              </p>
              <div className="mt-2 text-right text-[10px] text-gray-500 font-mono">— The No Button</div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors"
            >
              Try Again (If you dare)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
          {showTerms && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                  onClick={() => setShowTerms(false)}
              >
                  <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="glass p-8 rounded-2xl max-w-sm w-full space-y-4"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <h3 className="text-xl font-display font-bold text-pink-500">Terms of Eternal Simping</h3>
                      <div className="space-y-2">
                          {TERMS_CONTENT.map((term, i) => (
                              <p key={i} className="text-xs text-gray-400 flex gap-2">
                                  <span className="text-pink-500 shrink-0">•</span>
                                  {term}
                              </p>
                          ))}
                      </div>
                      <button 
                        onClick={() => setShowTerms(false)}
                        className="w-full py-2 bg-pink-500 rounded-lg text-xs font-bold"
                      >
                        I Accept (No Choice)
                      </button>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
