import request from './request';
import { saveAuthInfo, clearAuthInfo } from './auth';

// ==================== 类型定义 ====================

export interface SendCodeRequest {
  phone: string;
}

export interface SendCodeResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  phone: string;
  code: string;
}

export interface LoginResponse {
  user_id: string;
  token: string;
  phone?: string;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// ==================== API 接口 ====================

/**
 * 发送验证码
 */
export async function sendVerificationCode(phone: string): Promise<SendCodeResponse> {
  try {
    const response = await request.post<SendCodeResponse>('/send_code', {
      phone,
    });
    return response.data;
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    throw new Error(error.response?.data?.detail || '发送验证码失败，请稍后重试');
  }
}

/**
 * 用户登录
 */
export async function login(phone: string, code: string): Promise<LoginResponse> {
  try {
    const response = await request.post<LoginResponse>('/login', {
      phone,
      code,
    });

    const data = response.data;

    // 保存认证信息到本地存储
    saveAuthInfo({
      userId: data.user_id,
      token: data.token,
      phone: data.phone,
    });

    console.log('✅ 登录成功:', {
      userId: data.user_id,
      phone: data.phone,
    });

    return data;
  } catch (error: any) {
    console.error('登录失败:', error);
    throw new Error(error.response?.data?.detail || '登录失败，请检查验证码是否正确');
  }
}

/**
 * 用户退出登录
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await request.post<LogoutResponse>('/logout');
    
    // 清除本地存储的认证信息
    clearAuthInfo();

    console.log('✅ 退出登录成功');
    return response.data;
  } catch (error: any) {
    console.error('退出登录失败:', error);
    // 即使退出失败也清除本地认证信息
    clearAuthInfo();
    throw new Error(error.response?.data?.detail || '退出登录失败');
  }
}

// ==================== 其他业务 API ====================

/**
 * 获取用户作品列表（示例）
 */
export async function getUserWorks(): Promise<any> {
  try {
    const response = await request.get('/user/works');
    return response.data;
  } catch (error: any) {
    console.error('获取用户作品失败:', error);
    throw new Error(error.response?.data?.detail || '获取用户作品失败');
  }
}

/**
 * 生成视频（示例）
 */
export async function generateVideo(prompt: string): Promise<any> {
  try {
    const response = await request.post('/generate', {
      prompt,
    });
    return response.data;
  } catch (error: any) {
    console.error('生成视频失败:', error);
    throw new Error(error.response?.data?.detail || '生成视频失败');
  }
}

/**
 * 获取视频详情（示例）
 */
export async function getVideoDetail(videoId: string): Promise<any> {
  try {
    const response = await request.get(`/video/${videoId}`);
    return response.data;
  } catch (error: any) {
    console.error('获取视频详情失败:', error);
    throw new Error(error.response?.data?.detail || '获取视频详情失败');
  }
}

/**
 * 删除视频（示例）
 */
export async function deleteVideo(videoId: string): Promise<any> {
  try {
    const response = await request.delete(`/video/${videoId}`);
    return response.data;
  } catch (error: any) {
    console.error('删除视频失败:', error);
    throw new Error(error.response?.data?.detail || '删除视频失败');
  }
}
