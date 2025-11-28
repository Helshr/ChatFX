import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getAuthInfo, saveAuthInfo, clearAuthInfo, isAuthenticated } from '../services/auth';

// 定义用户信息类型
export interface UserInfo {
  userId: string;
  token: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
}

// 定义 Store 状态类型
interface UserState {
  // 状态
  isLoggedIn: boolean;
  userInfo: UserInfo | null;

  // Actions
  setLoggedIn: (isLoggedIn: boolean) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  initAuth: () => void;
}

/**
 * 用户状态管理 Store
 * 使用 Zustand 进行状态管理，支持持久化
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isLoggedIn: false,
      userInfo: null,

      // 设置登录状态
      setLoggedIn: (isLoggedIn) => {
        set({ isLoggedIn });
        console.log('🔐 登录状态已更新:', isLoggedIn);
      },

      // 设置用户信息
      setUserInfo: (userInfo) => {
        set({ userInfo });
        console.log('👤 用户信息已更新:', userInfo);
      },

      // 用户登录
      login: (userInfo) => {
        // 保存到 localStorage（用于 axios 拦截器）
        saveAuthInfo(userInfo);
        
        // 更新 store 状态
        set({
          isLoggedIn: true,
          userInfo,
        });
        
        console.log('✅ 用户登录成功:', {
          userId: userInfo.userId,
          phone: userInfo.phone,
        });
      },

      // 用户退出
      logout: () => {
        // 清除 localStorage
        clearAuthInfo();
        
        // 清除 store 状态
        set({
          isLoggedIn: false,
          userInfo: null,
        });
        
        console.log('👋 用户已退出登录');
      },

      // 更新用户信息
      updateUserInfo: (updates) => {
        const currentUserInfo = get().userInfo;
        if (!currentUserInfo) {
          console.warn('⚠️ 用户未登录，无法更新信息');
          return;
        }

        const newUserInfo = { ...currentUserInfo, ...updates };
        
        // 更新 localStorage
        saveAuthInfo(newUserInfo);
        
        // 更新 store
        set({ userInfo: newUserInfo });
        
        console.log('✏️ 用户信息已更新:', updates);
      },

      // 初始化认证状态（从 localStorage 恢复）
      initAuth: () => {
        const authenticated = isAuthenticated();
        const authInfo = getAuthInfo();
        
        if (authenticated && authInfo) {
          set({
            isLoggedIn: true,
            userInfo: authInfo,
          });
          console.log('🔄 从本地存储恢复登录状态:', {
            userId: authInfo.userId,
            phone: authInfo.phone,
          });
        } else {
          set({
            isLoggedIn: false,
            userInfo: null,
          });
          console.log('🔒 用户未登录');
        }
      },
    }),
    {
      name: 'user-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 只持久化必要的状态
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
      }),
    }
  )
);

// 导出便捷的 Hooks
export const useIsLoggedIn = () => useUserStore((state) => state.isLoggedIn);
export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserId = () => useUserStore((state) => state.userInfo?.userId);
export const useUserPhone = () => useUserStore((state) => state.userInfo?.phone);
