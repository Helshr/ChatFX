import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Send, Upload } from 'lucide-react';
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

const aspectRatios = [
  { value: '16:9', label: '16:9', width: 100 },
  { value: '9:16', label: '9:16', width: 56.25 },
  { value: '4:3', label: '4:3', width: 133.33 },
  { value: '3:4', label: '3:4', width: 75 },
  { value: '1:1', label: '1:1', width: 100 },
];

export default function DetailModal({ video, onClose }: DetailModalProps) {
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [frameRate, setFrameRate] = useState('30');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgOpacity, setBgOpacity] = useState(100);
  const [editPrompt, setEditPrompt] = useState('');

  const handleDownload = () => {
    console.log('Downloading video...');
  };

  const handleRegenerate = () => {
    if (editPrompt.trim()) {
      console.log('Regenerating with prompt:', editPrompt);
      setEditPrompt('');
    }
  };

  // Get width percentage based on aspect ratio
  const getWidthPercentage = () => {
    const ratio = aspectRatios.find(r => r.value === aspectRatio);
    return ratio ? ratio.width : 100;
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
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

        {/* Modal - hide scrollbar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-[70vw] bg-white rounded-[40px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Video Preview - fixed height container to prevent jumping */}
          <div className="px-12 pt-12 pb-8">
            <div className="relative mx-auto" style={{ 
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.div
                className="rounded-3xl overflow-hidden shadow-lg"
                style={{ 
                  width: `${getWidthPercentage()}%`,
                  height: '100%',
                }}
                animate={{ width: `${getWidthPercentage()}%` }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                />
              </motion.div>
            </div>
          </div>

          {/* Close Button - positioned outside preview area */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Parameters & Settings Section */}
          <div className="px-12 pb-12">
            {/* Title */}
            <h3 className="mb-6" style={{ fontWeight: 'bold' }}>作品参数</h3>
            
            {/* Single Row Layout for Parameters with 20px gap */}
            <div className="flex gap-5 mb-8">
              {/* Resolution Setting */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">尺寸</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-sm"
                >
                  {aspectRatios.map(ratio => (
                    <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                  ))}
                </select>
              </div>

              {/* Frame Rate */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">帧率</label>
                <select
                  value={frameRate}
                  onChange={(e) => setFrameRate(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-sm"
                >
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                  <option value="120">120 FPS</option>
                </select>
              </div>

              {/* Background Color */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">背景颜色</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-[48px] rounded-2xl cursor-pointer border-0"
                  style={{ border: 'none' }}
                />
              </div>

              {/* Background Opacity */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">透明度</label>
                <div className="flex items-center h-[48px] px-3 bg-gray-50 rounded-2xl">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-gray-700 text-sm ml-3 min-w-[3rem]">{bgOpacity}%</span>
                </div>
              </div>

              {/* Background Image Upload */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">背景图片</label>
                <button className="w-full h-[48px] px-3 py-3 bg-gray-50 border-none rounded-2xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Upload className="w-4 h-4" />
                  <span>上传</span>
                </button>
              </div>

              {/* Download Button */}
              <div className="flex-1">
                <label className="block text-gray-700 mb-2 text-sm">下载</label>
                <button
                  onClick={handleDownload}
                  className="w-full h-[48px] px-3 py-3 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>下载</span>
                </button>
              </div>
            </div>

            {/* Prompt & Edit Section */}
            <div className="mt-8">
              <h3 className="mb-4" style={{ fontWeight: 'bold' }}>提示词</h3>
              <p className="text-gray-700 mb-6 p-4 bg-gray-50 rounded-2xl">
                {video.prompt}
              </p>

              {/* Regenerate Input - single line, same border radius */}
              <div>
                <label className="block text-gray-500 mb-2">再次创作</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="可以尝试这样描述：让动画更快一点，或者加入更多粒子效果..."
                    className="w-full px-6 py-4 pr-20 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                  <button
                    onClick={handleRegenerate}
                    disabled={!editPrompt.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>生成</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
