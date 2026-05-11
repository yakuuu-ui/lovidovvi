import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export const StarryBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (30 - 10) + 10,
      delay: Math.random() * 5,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ opacity: 0, y: "110vh", x: `${heart.x}vw` }}
          animate={{
            opacity: [0, 0.6, 0],
            y: "-10vh",
            x: [`${heart.x}vw`, `${heart.x + (Math.random() * 20 - 10)}vw`],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: heart.delay,
            ease: "easeInOut",
          }}
          className="absolute text-pink-500/40 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
        >
          <Heart size={heart.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

export const CursorChaos = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const id = Date.now();
      setTrail((prev) => [...prev.slice(-10), { id, x: e.clientX, y: e.clientY }]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              left: point.x,
              top: point.y,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <Heart size={16} className="text-pink-400 fill-pink-400" style={{ opacity: 1 - index * 0.1 }} />
          </motion.div>
        ))}
      </AnimatePresence>
      <div 
        className="fixed pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{ left: position.x - 10, top: position.y - 10 }}
      >
        <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>
    </>
  );
};
