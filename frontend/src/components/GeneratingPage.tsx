import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Send, Download, Upload } from 'lucide-react';
import LoginModal from './LoginModal';
import Logo from './Logo';
import { useIsLoggedIn } from '../store/userStore';

const aspectRatios = [
  { value: '16:9', label: '16:9', width: 100 },
  { value: '9:16', label: '9:16', width: 56.25 },
  { value: '4:3', label: '4:3', width: 133.33 },
  { value: '3:4', label: '3:4', width: 75 },
  { value: '1:1', label: '1:1', width: 100 },
];

export default function GeneratingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useIsLoggedIn();
  const initialPrompt = location.state?.prompt || '';
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>(
    initialPrompt ? [{ role: 'user', content: initialPrompt }] : []
  );
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(!!initialPrompt);
  const [progress, setProgress] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Parameters state
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [frameRate, setFrameRate] = useState('30');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgOpacity, setBgOpacity] = useState(100);
  const [editPrompt, setEditPrompt] = useState('');

  useEffect(() => {
    // 如果未登录，显示登录弹窗
    if (!isLoggedIn) {
      setShowLoginModal(true);
      setIsGenerating(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Simulate generation progress
    if (isGenerating && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + 2, 100));
      }, 100);
      return () => clearTimeout(timer);
    } else if (progress === 100) {
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  }, [isGenerating, progress]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: newMessage }]);
      setNewMessage('');
      setIsGenerating(true);
      setProgress(0);
    }
  };

  const handleRegenerate = () => {
    if (editPrompt.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: editPrompt }]);
      setEditPrompt('');
      setIsGenerating(true);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    console.log('Downloading video...');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get width percentage based on aspect ratio
  const getWidthPercentage = () => {
    const ratio = aspectRatios.find(r => r.value === aspectRatio);
    return ratio ? ratio.width : 100;
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    setIsGenerating(true);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - no border */}
      <header className="px-8 py-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
        <button 
          onClick={() => {
            setMessages([]);
            setNewMessage('');
            setEditPrompt('');
            setIsGenerating(false);
            setProgress(0);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新建</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center py-12">
        <div className="w-[70vw]">
          {/* Generation Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {/* Preview Card - fixed height container */}
            <div className="mb-8" style={{ 
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.div
                className="rounded-[40px] overflow-hidden relative"
                style={{ 
                  width: `${getWidthPercentage()}%`,
                  height: '100%',
                }}
                animate={{ width: `${getWidthPercentage()}%` }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {isGenerating ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B] via-[#FF8E53] to-[#FE6B8B] flex items-center justify-center">
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          'linear-gradient(45deg, #FF6B6B, #FF8E53, #FE6B8B)',
                          'linear-gradient(90deg, #FF8E53, #FE6B8B, #FF6B6B)',
                          'linear-gradient(135deg, #FE6B8B, #FF6B6B, #FF8E53)',
                          'linear-gradient(180deg, #FF6B6B, #FF8E53, #FE6B8B)',
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    />
                    <div className="relative text-center text-white z-10">
                      <motion.div
                        className="w-24 h-24 mx-auto mb-8 border-4 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <p className="text-2xl mb-4">生成中...</p>
                      <p className="text-lg text-white/80">{progress}%</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1759267487608-23b5cffcb3a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwbW90aW9uJTIwZ3JhcGhpY3N8ZW58MXx8fHwxNzY0MTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080)' }}
                  />
                )}
              </motion.div>
            </div>

            {/* Parameters Section - Same layout as DetailModal */}
            {!isGenerating && progress === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
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
                    {initialPrompt || messages.find(m => m.role === 'user')?.content}
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
              </motion.div>
            )}
           </motion.div>
         </div>
       </div>

       {/* Login Modal */}
       <LoginModal
         isOpen={showLoginModal}
         onClose={() => {
           setShowLoginModal(false);
           navigate('/');
         }}
         onLogin={handleLogin}
       />
     </div>
   );
 }
