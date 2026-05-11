import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useCallback, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import confetti from "canvas-confetti";
import { MessageCircleHeart, HeartCrack, Info, ShieldAlert, Sparkles, Skull, Zap, Brain, TrendingUp } from "lucide-react";
import { soundService } from "../lib/sounds";

interface FloatingEffect {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

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
  "Congratulations, now you have a date with samrat! 💖"
];

const TERMS_CONTENT = [
  "You agree to unlimited emotional damage 💔",
  "No refunds for bad decisions 💀",
  "You accept eternal rizz exposure 😎",
  "Terms of Service: You are now a certified Simp.",
  "Privacy Policy: We know everything. We saw you trying to click NO."
];

const MEME_GALLERY = [
  { url: "https://i.imgflip.com/30zz5g.jpg", caption: "Task Failed Successfully" },
  { url: "https://i.imgflip.com/26shv5.jpg", caption: "It was at this moment she knew..." },
  { url: "https://i.imgflip.com/1ur9b0.jpg", caption: "Drake approved date" },
  { url: "https://i.imgflip.com/4/3lmzyx.jpg", caption: "Always has been (a trap)" },
  { url: "https://i.imgflip.com/2fm6x.jpg", caption: "The face you make after clicking YES" },
  { url: "https://i.imgflip.com/1otk96.jpg", caption: "Me waiting for the date like..." }
];

interface Meme {
  url: string;
  title: string;
}

const DISTORTED_QUESTIONS = [
  "I have something very important to ask you... 💌",
  "You're going on a date with me, right? 😏",
  "I know you want to say yes... 💖",
  "Resistance is futile. 💀",
  "Just click the pink button already. 🥱",
  "Your webcam says you're smiling. 😏"
];

export const PrankCard = () => {
  const [stage, setStage] = useState<"ask" | "yes_loading" | "yes_final" | "no_final" | "cold_mode" | "meme_mode">("ask");
  const [successIndex, setSuccessIndex] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noButtonSize, setNoButtonSize] = useState(1);
  const [noClones, setNoClones] = useState<{ id: number; x: number; y: number }[]>([]);
  const [savageText, setSavageText] = useState("");
  const [noButtonText, setNoButtonText] = useState("No.");
  const [questionText, setQuestionText] = useState(DISTORTED_QUESTIONS[0]);
  const [showTerms, setShowTerms] = useState(false);
  const [rizz, setRizz] = useState(50);
  const [floatingTexts, setFloatingTexts] = useState<FloatingEffect[]>([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoadingMemes, setIsLoadingMemes] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Meme Fetching Logic
  const fetchMemes = useCallback(async () => {
    setIsLoadingMemes(true);
    try {
      // Fetching from multiple subreddits for variety
      const res = await fetch("https://meme-api.com/gimme/50");
      const data = await res.json();
      if (data && data.memes) {
        setMemes(prev => [...prev, ...data.memes.map((m: any) => ({ url: m.url, title: m.title }))]);
      }
    } catch (e) {
      console.error("Failed to fetch memes", e);
      // Fallback
      setMemes(prev => [...prev, { url: "https://i.imgflip.com/4/3lmzyx.jpg", title: "API went on a date too... (Error)" }]);
    } finally {
      setIsLoadingMemes(false);
    }
  }, []);

  useEffect(() => {
    if (stage === "meme_mode" && memes.length === 0) {
      fetchMemes();
    }
  }, [stage, memes.length, fetchMemes]);

  // Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const addFloatingText = (text: string, color: string, clientX?: number, clientY?: number) => {
    const id = Date.now();
    const newX = clientX || (window.innerWidth / 2 + (Math.random() * 200 - 100));
    const newY = clientY || (window.innerHeight / 2 + (Math.random() * 200 - 100));
    
    setFloatingTexts(prev => [...prev, { id, x: newX, y: newY, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

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
    setRizz(100);
    addFloatingText("MAX RIZZ ACHIEVED!", "text-yellow-400");
    soundService.playSuccess();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#d946ef", "#a855f7"]
    });

    let i = 0;
    const interval = setInterval(() => {
      if (i < SUCCESS_PHASES.length - 1) {
        i++;
        setSuccessIndex(i);
        // soundService.playTick(); // Removed sound
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
      }, 30000);
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [stage, handleYes]);

  const moveNoButton = useCallback((e: ReactMouseEvent | ReactTouchEvent) => {
    if (stage !== "ask") return;
    
    // Get mouse/touch pos for floating text
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as ReactMouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as ReactMouseEvent).clientY;

    if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            setSavageText("No response detected... assuming YES 😌");
            setTimeout(handleYes, 2000);
        }, 30000);
    }

    // soundService.playError(); // Removed "zap" sound
    setRizz(prev => Math.max(0, prev - 5));
    addFloatingText("-5 RIZZ", "text-red-500", clientX, clientY);
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const xPos = (Math.random() * (rect.width - 150)) - (rect.width / 2) + 75;
      const yPos = (Math.random() * (rect.height - 100)) - (rect.height / 2) + 50;
      
      setNoPosition({ x: xPos, y: yPos });
      setNoCount((prev) => prev + 1);
      setNoButtonText(SAVAGE_REPLIES[Math.floor(Math.random() * SAVAGE_REPLIES.length)]);

      if (noCount > 3) setNoButtonSize((prev) => Math.max(0.4, prev - 0.1));
      
      if (noCount > 8) {
        const newClones = Array.from({ length: 3 }).map((_, i) => ({
          id: Date.now() + i,
          x: (Math.random() * (rect.width - 150)) - (rect.width / 2) + 75,
          y: (Math.random() * (rect.height - 100)) - (rect.height / 2) + 50,
        }));
        setNoClones((prev) => [...prev, ...newClones].slice(-12));
        addFloatingText("GHOSTING DETECTED", "text-purple-400");
      }

      if (noCount === 12) {
          setStage("cold_mode");
          setTimeout(() => {
              setStage("ask");
              setNoCount(0);
              setNoClones([]);
              setNoPosition({ x: 0, y: 0 });
              setRizz(50);
              setSavageText("Just kidding 😂 NO is not allowed");
          }, 4000);
      }

      if (noCount > 20) setStage("no_final");

      setSavageText(SAVAGE_REPLIES[Math.floor(Math.random() * SAVAGE_REPLIES.length)]);
      setTimeout(() => setSavageText(""), 2000);
    }
  }, [noCount, stage, handleYes]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Interaction Text Layer */}
      <AnimatePresence>
        {floatingTexts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 1, y: t.y, x: t.x }}
            animate={{ opacity: 0, y: t.y - 100 }}
            exit={{ opacity: 0 }}
            className={`fixed z-[100] font-mono font-black text-xl pointer-events-none ${t.color}`}
            style={{ textShadow: "0 0 10px currentColor" }}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === "ask" && (
          <motion.div
            key="ask"
            style={{ rotateX, rotateY, perspective: 1000 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className={`glass w-full max-w-md p-8 rounded-3xl neon-border relative z-10 text-center ${noCount > 8 ? "animate-glitch" : ""}`}
          >
            {/* Rizz Meter */}
            <div className="absolute -top-12 left-0 right-0 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-pink-500">
                <TrendingUp size={12} />
                Current Rizz Meter
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full border border-white/10 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: `${rizz}%` }}
                  className={`h-full bg-gradient-to-r ${rizz > 70 ? "from-pink-500 to-yellow-400 shadow-[0_0_10px_#ec4899]" : "from-purple-500 to-pink-500"}`}
                />
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="bg-pink-500/20 p-4 rounded-full relative"
              >
                <MessageCircleHeart className="w-12 h-12 text-pink-500" />
                {rizz > 80 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-yellow-400 p-1 rounded-full text-black shadow-lg"
                  >
                    <Zap size={12} fill="currentColor" />
                  </motion.div>
                )}
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => {
                  setRizz(prev => Math.min(100, prev + 2));
                  addFloatingText("+2 RIZZ", "text-pink-400");
                }}
                onClick={handleYes}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all z-20 cursor-heart"
              >
                YES! 💖
              </motion.button>

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
                className="px-6 py-3 bg-slate-800 text-gray-400 rounded-2xl font-bold text-sm border border-white/10 hover:border-red-500/50 transition-all pointer-events-auto whitespace-nowrap overflow-hidden"
              >
                {noButtonText}
                <div className="absolute inset-0 bg-red-500/0 hover:bg-red-500/10 transition-colors" />
              </motion.button>

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
                className="fixed inset-0 z-[100] bg-blue-900/90 flex flex-col items-center justify-center text-center p-8 backdrop-blur-3xl glitch-overlay"
            >
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-[0_0_30px_#60a5fa]">
                    <ShieldAlert className="w-12 h-12 text-blue-300" />
                </div>
                <h2 className="text-3xl font-mono text-blue-200 mb-4 tracking-tighter">SYSTEM COLD REBOOT</h2>
                <div className="space-y-4 max-w-sm w-full">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.5 }}
                            className="h-full bg-blue-400"
                        />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-blue-400/60 font-mono">Installing sadness update: HEART_RIP.dmg</p>
                      <p className="text-[10px] text-blue-400/60 font-mono">Deleting confidence.sys... Permission Denied</p>
                      <p className="text-[10px] text-blue-400/60 font-mono">Error: Rejection threshold exceeded (9000+)</p>
                    </div>
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
            
            <div className={`glass max-w-md w-full p-10 rounded-3xl text-center shadow-2xl ${successIndex === 0 ? "border-4 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]" : "neon-border"} space-y-6 transition-all duration-500`}>
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: successIndex === 0 ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {successIndex === 0 ? (
                    <div className="relative">
                      <Skull className="w-24 h-24 text-red-500" />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="absolute inset-0 text-red-600 blur-md"
                      >
                         <Skull className="w-24 h-24" />
                      </motion.div>
                    </div>
                  ) : <Sparkles className="w-16 h-16 text-yellow-400" />}
                </motion.div>
              </div>

              <h2 className={`text-2xl font-mono ${successIndex === 0 ? "text-red-500 font-bold uppercase tracking-widest" : "text-pink-400"}`}>
                {SUCCESS_PHASES[successIndex]}
              </h2>

              {stage === "yes_final" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-6 border-t border-white/10"
                >
                  <div className="bg-red-500/20 p-4 rounded-xl flex items-start gap-3 text-left mb-6 border border-red-500/30">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                    <p className="text-sm text-red-200">
                      WARNING: Relationship status updated to LOCKED. Any attempt to modify will result in permanent emotional damage.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                        setStage("meme_mode");
                        addFloatingText("UNLOCKED MEMES", "text-yellow-400");
                    }}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg"
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
            className="glass max-w-md w-full p-10 rounded-3xl text-center neon-border space-y-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
            <div className="flex justify-center">
              <HeartCrack className="w-20 h-20 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold text-white shadow-sm">SYSTEM OVERLOAD</h2>
              <p className="text-xl font-mono text-red-400 animate-pulse font-black">
                "NO BUTTON has filed for resignation 🚪😂"
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl text-left border border-white/10 relative">
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
              className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all shadow-[0_0_20px_#ec489988]"
            >
              Try Again (If you dare)
            </button>
          </motion.div>
        )}

        {stage === "meme_mode" && (
          <motion.div
            key="meme_mode"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass max-w-md w-full p-6 rounded-3xl text-center neon-border space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-tighter">
                    <Sparkles size={14} />
                    Infinite Copium Gallery
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    {memeIndex + 1} / {memes.length || "?"}
                </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-square flex items-center justify-center">
                {memes.length > 0 ? (
                    <motion.img
                        key={memeIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={memes[memeIndex]?.url}
                        alt="Funny Meme"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://i.imgflip.com/4/3lmzyx.jpg";
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <Zap className="w-8 h-8 opacity-20" />
                        </motion.div>
                        <p className="text-xs font-mono">Summoning fresh memes...</p>
                    </div>
                )}
                {memes[memeIndex] && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-mono font-bold text-[10px] sm:text-xs line-clamp-2">
                          {memes[memeIndex].title}
                      </p>
                  </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    disabled={isLoadingMemes && memes.length === 0}
                    onClick={() => {
                        const nextIdx = (memeIndex + 1);
                        // If near the end, fetch more
                        if (nextIdx >= memes.length - 5 && !isLoadingMemes) {
                            fetchMemes();
                        }
                        
                        setMemeIndex(nextIdx % (memes.length || 1));
                        // soundService.playTick(); // Removed sound
                        addFloatingText("MORE COPIUM", "text-blue-400");
                    }}
                    className="py-3 bg-pink-500/20 hover:bg-pink-500/40 text-pink-400 rounded-xl font-bold transition-all border border-pink-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Zap size={16} />
                    {isLoadingMemes && memes.length > 0 ? "Loading More..." : "Next Meme"}
                </button>
                <button 
                    onClick={() => window.location.reload()}
                    className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
                >
                    Truly Exit
                </button>
            </div>
            
            <p className="text-[10px] text-gray-500 font-mono italic">
                * You have accepted the date. You've reached {memeIndex + 1} memes. {memeIndex > 1000 ? "Seek help." : "Keep scrolling."}
            </p>
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
                      className="glass p-8 rounded-2xl max-w-sm w-full space-y-4 border border-white/20"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <div className="flex items-center gap-2 mb-2">
                        <Brain size={18} className="text-pink-500" />
                        <h3 className="text-xl font-display font-bold text-pink-500">Terms of Eternal Simping</h3>
                      </div>
                      <div className="space-y-3">
                          {TERMS_CONTENT.map((term, i) => (
                              <p key={i} className="text-[11px] text-gray-400 flex gap-2 leading-tight">
                                  <span className="text-pink-500 shrink-0 font-bold">»</span>
                                  {term}
                              </p>
                          ))}
                      </div>
                      <button 
                        onClick={() => setShowTerms(false)}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-xs font-bold shadow-lg mt-4"
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
