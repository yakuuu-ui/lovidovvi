
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Share2, Twitter, MessageSquare, Copy, Check } from "lucide-react";

export const SharePrank = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = "I found this romantic confession site... but something is WRONG 💀💖 #LoveExe #Prank";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Love.exe - Romantic Question",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareToDiscord = () => {
    // Discord doesn't have a direct "share to" URL API like Twitter, so we just copy link
    copyLink();
    alert("Share link copied! Paste it in Discord 💖");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass p-4 rounded-2xl shadow-2xl flex flex-col gap-2 border border-pink-500/30 w-48 mb-2"
          >
            <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest text-center mb-2">Spread the Trap</p>
            
            <button 
              onClick={shareToTwitter}
              className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/80"
            >
              <Twitter size={16} className="text-blue-400" />
              Twitter
            </button>
            <button 
              onClick={shareToDiscord}
              className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/80"
            >
              <MessageSquare size={16} className="text-indigo-400" />
              Discord
            </button>
            <button 
              onClick={copyLink}
              className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/80"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-12 h-12 glass rounded-full flex items-center justify-center text-pink-500 shadow-lg hover:shadow-pink-500/20 active:shadow-inner transition-all border border-pink-500/50"
      >
        <Share2 size={20} />
      </motion.button>
    </div>
  );
};
