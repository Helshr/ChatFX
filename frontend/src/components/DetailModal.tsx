import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface DetailModalProps {
  video: {
    id: string;
    thumbnail: string;
    prompt: string;
    author?: string;
  };
  onClose: () => void;
}

export default function DetailModal({ video, onClose }: DetailModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(video.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-white rounded-[40px] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Video Preview */}
          <div className="relative aspect-video w-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${video.thumbnail})` }}
            />
          </div>

          {/* Prompt Section */}
          <div className="p-12">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <p className="text-gray-500 mb-2">提示词</p>
                <p className="text-gray-900 text-lg">{video.prompt}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
