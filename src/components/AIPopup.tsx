import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Brain, Skull, Laugh, Sparkles } from "lucide-react";

const AI_MESSAGES = [
  { text: "AI Prediction: 99.9% chance you say YES", icon: <Brain className="text-blue-400" /> },
  { text: "Your rejection attempt has been laughed at by the system", icon: <Laugh className="text-yellow-400" /> },
  { text: "Google: Just say yes bro", icon: <Sparkles className="text-pink-400" /> },
  { text: "Detecting low rizz environment... deploying support", icon: <Skull className="text-red-400" /> },
  { text: "Error: Logic not found in romantic sector", icon: <Brain className="text-purple-400" /> },
  { text: "NASA confirmed: this date is inevitable 🚀", icon: <Sparkles className="text-blue-500" /> },
  { text: "Even ChatGPT said YES 😏", icon: <Brain className="text-green-400" /> },
  { text: "Google recommends acceptance 💀", icon: <Laugh className="text-indigo-400" /> },
  { text: "Your crush is waiting... and so is the system", icon: <Sparkles className="text-yellow-400" /> },
];

export const AIPopup = () => {
  const [currentMessage, setCurrentMessage] = useState<typeof AI_MESSAGES[0] | null>(null);

  useEffect(() => {
    const trigger = () => {
      const msg = AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];
      setCurrentMessage(msg);
      
      setTimeout(() => setCurrentMessage(null), 3000);
    };

    const interval = setInterval(trigger, 8000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {currentMessage && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            className="glass p-4 rounded-xl shadow-2xl flex items-center gap-3 border-l-4 border-l-pink-500 max-w-[280px]"
          >
            <div className="bg-white/10 p-2 rounded-lg">
              {currentMessage.icon}
            </div>
            <p className="text-xs font-medium text-white/90 leading-tight">
              {currentMessage.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
