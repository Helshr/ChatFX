import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 定义响应数据结构
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token 和 user_id
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');

    // 如果存在 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 如果存在 user_id，添加到请求头
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }

    console.log('请求配置:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('响应数据:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error) => {
    console.error('响应错误:', error);

    // 处理不同的错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // token 失效，清除本地存储并触发事件
          console.warn('Token 失效，需要重新登录');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_phone');
          // 触发全局事件通知应用重新显示登录弹窗
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          break;
        case 403:
          console.error('没有权限访问该资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求失败: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('请求配置错误:', error.message);
    }

    return Promise.reject(error);
  }
);

export default request;
