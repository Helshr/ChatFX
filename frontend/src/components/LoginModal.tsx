import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { sendVerificationCode, login } from '../services/api';
import { useUserStore } from '../store/userStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const loginUser = useUserStore((state) => state.login);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGetCode = async () => {
    if (phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await sendVerificationCode(phone);
      
      if (response.success) {
        setCountdown(60);
        console.log('✅ 验证码发送成功');
      } else {
        setError(response.message || '验证码发送失败');
      }
    } catch (err: any) {
      console.error('发送验证码失败:', err);
      setError(err.message || '验证码发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phone || !code) {
      setError('请输入手机号和验证码');
      return;
    }

    if (phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }

    if (code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await login(phone, code);
      
      // 保存用户信息到 store
      loginUser({
        userId: response.user_id,
        token: response.token,
        phone: response.phone,
      });
      
      console.log('✅ 登录成功:', response);
      onLogin();
      onClose();
      
      // Reset form
      setPhone('');
      setCode('');
      setCountdown(0);
    } catch (err: any) {
      console.error('登录失败:', err);
      setError(err.message || '登录失败，请检查验证码是否正确');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-8"
      >
        {/* Backdrop - lighter blur */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

        {/* Modal - centered, no banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Login Section */}
          <div className="bg-white flex items-center justify-center px-12 py-16">
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-center mb-12">
                  登录 / 注册
                </h2>

                 <div className="space-y-6">
                   {/* Error Message */}
                   {error && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="px-4 py-3 bg-red-50 text-red-600 rounded-2xl text-sm"
                     >
                       {error}
                     </motion.div>
                   )}

                   {/* Phone Input - aligned with button */}
                   <div className="flex gap-3">
                     <input
                       type="tel"
                       placeholder="请输入手机号"
                       value={phone}
                       onChange={(e) => {
                         setPhone(e.target.value);
                         setError('');
                       }}
                       maxLength={11}
                       disabled={loading}
                       className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed"
                     />
                   </div>

                   {/* Verification Code Input */}
                   <div className="flex gap-3">
                     <input
                       type="text"
                       placeholder="请输入验证码"
                       value={code}
                       onChange={(e) => {
                         setCode(e.target.value);
                         setError('');
                       }}
                       maxLength={6}
                       disabled={loading}
                       className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed"
                     />
                     <button
                       onClick={handleGetCode}
                       disabled={countdown > 0 || phone.length !== 11 || loading}
                       className="px-6 py-4 bg-gray-100 rounded-2xl text-gray-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                     >
                       {loading ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                     </button>
                   </div>

                   {/* Login Button */}
                   <button
                     onClick={handleLogin}
                     disabled={!phone || !code || loading}
                     className="w-full py-4 bg-[#FF6B6B] text-white rounded-2xl hover:bg-[#FF5252] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                   >
                     {loading ? '登录中...' : '登录'}
                   </button>

                  {/* Agreement */}
                  <p className="text-center text-gray-400 text-sm mt-8">
                    登录即表示同意 <span className="text-gray-600">用户协议</span> 和 <span className="text-gray-600">隐私政策</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}