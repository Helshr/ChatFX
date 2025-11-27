import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, LogOut } from 'lucide-react';
import VideoCard from './VideoCard';
import DetailModal from './DetailModal';

const mockUserVideos = [
  {
    id: 'u1',
    thumbnail: 'https://images.unsplash.com/photo-1759267487608-23b5cffcb3a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwbW90aW9uJTIwZ3JhcGhpY3N8ZW58MXx8fHwxNzY0MTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '科技感流体动画，蓝紫色渐变',
  },
  {
    id: 'u2',
    thumbnail: 'https://images.unsplash.com/photo-1756908992987-54c948949b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhbmltYXRpb24lMjBkZXNpZ258ZW58MXx8fHwxNzY0MTU2MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '几何图形旋转动画，简约风格',
  },
  {
    id: 'u3',
    thumbnail: 'https://images.unsplash.com/photo-1759392658577-4324fb89b991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHVpZCUyMGdyYWRpZW50JTIwc2hhcGVzfGVufDF8fHx8MTc2NDE1NjIyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '液体渐变流动效果',
  },
  {
    id: 'u4',
    thumbnail: 'https://images.unsplash.com/photo-1714779573250-36242918e044?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFic3RyYWN0JTIwd2F2ZXN8ZW58MXx8fHwxNzY0MTU2MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '彩色波浪动态背景',
  },
  {
    id: 'u5',
    thumbnail: 'https://images.unsplash.com/photo-1761433393656-9f0e4e024640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwbW90aW9uJTIwZGVzaWdufGVufDF8fHx8MTc2NDE1NjIyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '炫彩粒子爆炸效果',
  },
  {
    id: 'u6',
    thumbnail: 'https://images.unsplash.com/photo-1565928472362-fe784a95fe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwZ2VvbWV0cmljJTIwcGF0dGVybnN8ZW58MXx8fHwxNzY0MTU2MjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prompt: '霓虹几何图案律动',
  },
];

interface MyWorksPageProps {
  onLogout: () => void;
}

export default function MyWorksPage({ onLogout }: MyWorksPageProps) {
  const navigate = useNavigate();
  const [videos, setVideos] = useState(mockUserVideos);
  const [selectedVideo, setSelectedVideo] = useState<typeof mockUserVideos[0] | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-12 py-6 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-12">我的作品</h1>

          {/* Video Grid */}
          {videos.length > 0 ? (
            <div className="grid grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <VideoCard
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                    showActions={true}
                    onDelete={() => handleDelete(video.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">还没有作品，去创作第一个吧！</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-8 py-4 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-colors"
              >
                开始创作
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Logout Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>

      {/* Detail Modal */}
      {selectedVideo && (
        <DetailModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-[40px] p-12 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-6">确认退出登录？</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-4 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-colors"
              >
                退出
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
