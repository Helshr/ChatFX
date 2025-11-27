import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Send, User } from 'lucide-react';
import VideoCard from './VideoCard';
import DetailModal from './DetailModal';

const mockVideos = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1759267487608-23b5cffcb3a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwbW90aW9uJTIwZ3JhcGhpY3N8ZW58MXx8fHwxNzY0MTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '科技感流体动画，蓝紫色渐变',
    author: 'User A'
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1756908992987-54c948949b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhbmltYXRpb24lMjBkZXNpZ258ZW58MXx8fHwxNzY0MTU2MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '几何图形旋转动画，简约风格',
    author: 'User B'
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1759392658577-4324fb89b991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHVpZCUyMGdyYWRpZW50JTIwc2hhcGVzfGVufDF8fHx8MTc2NDE1NjIyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '液体渐变流动效果',
    author: 'User C'
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1714779573250-36242918e044?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFic3RyYWN0JTIwd2F2ZXN8ZW58MXx8fHwxNzY0MTU2MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '彩色波浪动态背景',
    author: 'User D'
  },
  {
    id: '5',
    thumbnail: 'https://images.unsplash.com/photo-1761433393656-9f0e4e024640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwbW90aW9uJTIwZGVzaWdufGVufDF8fHx8MTc2NDE1NjIyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '炫彩粒子爆炸效果',
    author: 'User E'
  },
  {
    id: '6',
    thumbnail: 'https://images.unsplash.com/photo-1565928472362-fe784a95fe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwZ2VvbWV0cmljJTIwcGF0dGVybnN8ZW58MXx8fHwxNzY0MTU2MjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '霓虹几何图案律动',
    author: 'User F'
  },
  {
    id: '7',
    thumbnail: 'https://images.unsplash.com/photo-1759267487608-23b5cffcb3a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwbW90aW9uJTIwZ3JhcGhpY3N8ZW58MXx8fHwxNzY0MTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '抽象艺术流动效果',
    author: 'User G'
  },
  {
    id: '8',
    thumbnail: 'https://images.unsplash.com/photo-1756908992987-54c948949b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhbmltYXRpb24lMjBkZXNpZ258ZW58MXx8fHwxNzY0MTU2MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '立体几何空间变换',
    author: 'User H'
  },
  {
    id: '9',
    thumbnail: 'https://images.unsplash.com/photo-1759392658577-4324fb89b991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHVpZCUyMGdyYWRpZW50JTIwc2hhcGVzfGVufDF8fHx8MTc2NDE1NjIyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '梦幻渐变球体动画',
    author: 'User I'
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<typeof mockVideos[0] | null>(null);

  const handleGenerate = () => {
    if (prompt.trim()) {
      navigate('/generating', { state: { prompt } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && prompt.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-12 py-6 flex items-center justify-between">
        <div className="text-2xl tracking-tight text-gray-900">MG Studio</div>
        <button 
          onClick={() => navigate('/my-works')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <User className="w-5 h-5" />
          <span>我的</span>
        </button>
      </header>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-12 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="mb-12">
            一句话生成你的专属动画
          </h1>

          {/* Input Area */}
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="描述你想要的动画效果，例如：科技感的粒子流动动画..."
              className="w-full px-8 py-6 pr-20 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-lg"
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Video Gallery */}
      <div className="max-w-7xl mx-auto px-12 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-3 gap-8"
        >
          {mockVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <VideoCard
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* More Button */}
        <div className="text-center mt-12">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            更多作品
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVideo && (
        <DetailModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
