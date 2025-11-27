import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Send, Square } from 'lucide-react';

export default function GeneratingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPrompt = location.state?.prompt || '';
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'user', content: initialPrompt }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);

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
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: '您的 MG 动画已生成完成！可以继续调整或查看效果。' 
        }]);
      }, 500);
    }
  }, [isGenerating, progress]);

  const handleStop = () => {
    setIsGenerating(false);
    setProgress(0);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: newMessage }]);
      setNewMessage('');
      setIsGenerating(true);
      setProgress(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
        <button 
          onClick={() => navigate('/generating', { state: { prompt: '' } })}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新建</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Generation Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 aspect-video mb-12"
          >
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
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

          {/* Conversation */}
          <div className="space-y-6 mb-8">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-3xl ${
                    message.role === 'user'
                      ? 'bg-[#FF6B6B] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-white px-8 py-6">
        <div className="max-w-4xl mx-auto flex gap-4 items-end">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="继续调整您的动画效果..."
              rows={1}
              className="w-full px-6 py-4 pr-32 bg-gray-50 border-none rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
          </div>
          
          {isGenerating ? (
            <button
              onClick={handleStop}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Square className="w-5 h-5" />
              <span>停止</span>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="px-8 py-4 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>发送</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
