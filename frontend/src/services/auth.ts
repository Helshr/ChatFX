// 认证相关的工具函数

export interface UserInfo {
  userId: string;
  token: string;
  phone?: string;
}

/**
 * 保存用户认证信息到本地存储
 */
export function saveAuthInfo(userInfo: UserInfo): void {
  localStorage.setItem('auth_token', userInfo.token);
  localStorage.setItem('user_id', userInfo.userId);
  if (userInfo.phone) {
    localStorage.setItem('user_phone', userInfo.phone);
  }
  console.log('✅ 用户认证信息已保存:', {
    userId: userInfo.userId,
    phone: userInfo.phone,
  });
}

/**
 * 获取用户认证信息
 */
export function getAuthInfo(): UserInfo | null {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');
  const phone = localStorage.getItem('user_phone') || undefined;

  if (!token || !userId) {
    return null;
  }

  return {
    token,
    userId,
    phone,
  };
}

/**
 * 清除用户认证信息
 */
export function clearAuthInfo(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_phone');
  console.log('✅ 用户认证信息已清除');
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  const authInfo = getAuthInfo();
  return authInfo !== null;
}

/**
 * 获取当前用户 ID
 */
export function getCurrentUserId(): string | null {
  return localStorage.getItem('user_id');
}

/**
 * 获取当前用户 Token
 */
export function getCurrentToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * 获取当前用户手机号
 */
export function getCurrentUserPhone(): string | null {
  return localStorage.getItem('user_phone');
}
