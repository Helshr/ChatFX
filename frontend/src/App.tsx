import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import GeneratingPage from './components/GeneratingPage';
import MyWorksPage from './components/MyWorksPage';
import { useUserStore } from './store/userStore';

export default function App() {
  const initAuth = useUserStore((state) => state.initAuth);
  const logout = useUserStore((state) => state.logout);

  // 初始化时检查登录状态
  useEffect(() => {
    // 从 localStorage 恢复登录状态
    initAuth();

    // 监听未授权事件（token 失效）
    const handleUnauthorized = () => {
      console.warn('检测到 401 未授权，清除登录状态');
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [initAuth, logout]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generating" element={<GeneratingPage />} />
        <Route path="/my-works" element={<MyWorksPage />} />
      </Routes>
    </Router>
  );
}