import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLogin: () => void;
}

const bannerImages = [
  'https://images.unsplash.com/photo-1759267487608-23b5cffcb3a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwbW90aW9uJTIwZ3JhcGhpY3N8ZW58MXx8fHwxNzY0MTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1756908992987-54c948949b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhbmltYXRpb24lMjBkZXNpZ258ZW58MXx8fHwxNzY0MTU2MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1759392658577-4324fb89b991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHVpZCUyMGdyYWRpZW50JTIwc2hhcGVzfGVufDF8fHx8MTc2NDE1NjIyNXww&ixlib=rb-4.1.0&q=80&w=1080',
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [progress, setProgress] = useState(0);

  const BANNER_DURATION = 5000; // 5 seconds per banner

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentBanner((curr) => (curr + 1) % bannerImages.length);
          return 0;
        }
        return prev + (100 / (BANNER_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGetCode = () => {
    if (phone.length === 11) {
      setCountdown(60);
    }
  };

  const handleLogin = () => {
    if (phone && code) {
      onLogin();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Banner Section - 70% */}
      <div className="relative w-[70%] bg-gray-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${bannerImages[currentBanner]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute top-8 left-8 right-8">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>
        </div>
      </div>

      {/* Right Login Section - 30% */}
      <div className="w-[30%] bg-white flex items-center justify-center px-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-center mb-16">
              一句话生成你的专属 MG 动画
            </h1>

            <div className="space-y-6">
              {/* Phone Input */}
              <div>
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={11}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>

              {/* Verification Code Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
                <button
                  onClick={handleGetCode}
                  disabled={countdown > 0 || phone.length !== 11}
                  className="px-6 py-4 bg-gray-100 rounded-2xl text-gray-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={!phone || !code}
                className="w-full py-4 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                登录
              </button>

              {/* Agreement */}
              <p className="text-center text-gray-400 text-sm mt-8">
                登录即表示同意 <span className="text-gray-600">用户协议</span> 和 <span className="text-gray-600">隐私政策</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
