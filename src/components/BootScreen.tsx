import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { soundService } from "../lib/sounds";

const BOOT_LOGS = [
  "Initializing love.exe...",
  "Loading hardware drivers: HEART_V8.3",
  "Checking storage: 0% capacity for logic",
  "Scanning current relationship status...",
  "Status: TERMINALLY_SINGLE",
  "Rizz module V2.1 loading...",
  "Warning: High cringe levels detected 💀",
  "Bypassing common sense filters...",
  "Connecting to destiny.srv...",
  "Ready to launch."
];

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === 0) {
        soundService.playBoot();
    }

    if (currentIndex < BOOT_LOGS.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, BOOT_LOGS[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
        soundService.playTick();
      }, 300 + Math.random() * 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6 font-mono overflow-hidden">
      <div className="max-w-lg w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-500 text-sm ml-2">Terminal — LoveOS</span>
        </div>
        
        <div className="space-y-1">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-sm ${log.includes("Warning") ? "text-yellow-400" : log.includes("Ready") ? "text-green-400 font-bold" : "text-pink-500"}`}
            >
              <span className="text-gray-600 mr-2">[{index.toString().padStart(2, '0')}]</span>
              {log}
            </motion.div>
          ))}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-2 h-4 bg-pink-500 inline-block ml-1 align-middle"
          />
        </div>
      </div>
    </div>
  );
};
