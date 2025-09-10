import { Toast } from 'antd-mobile';
import { getAuth, setAuth } from './../utils/index';

const API_BASE_URL = import.meta.env.VITE_HTTP_API;

interface RequestConfig {
  method: string;
  url: string;
  data?: object;
  params?: object;
  headers?: Record<string, string>;
}

interface ResponseData<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class RequestError extends Error {
  constructor(
    message: string,
    public config: RequestConfig,
    public response?: Response
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new RequestError(
      errorData.message || response.statusText,
      {} as RequestConfig,
      response
    );
  }

  const data = await response.json();
  return data.data || data;
};

let baseRequest = async (config: RequestConfig): Promise<any> => {
  const { method, url, data, params, headers = {} } = config;

  // 构建完整URL
  let fullUrl = `${API_BASE_URL ? API_BASE_URL : ''}/api${url}`;
  
  // 处理查询参数
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  // 设置请求头
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuth()}`,
    ...headers,
  };

  // 准备请求体
  const body = data ? JSON.stringify(data) : undefined;

  try {
    const response = await fetch(fullUrl, {
      method: method.toUpperCase(),
      headers: requestHeaders,
      body,
      credentials: 'same-origin',
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof RequestError) {
      throw error;
    }
    throw new RequestError(
      error instanceof Error ? error.message : '网络请求失败',
      config
    );
  }
};

// 请求拦截器（模拟axios拦截器）
const requestInterceptor = {
  use: (onFulfilled?: (config: RequestConfig) => RequestConfig) => {
    if (onFulfilled) {
      // 简单的拦截器实现
      return (config: RequestConfig) => onFulfilled(config);
    }
    return (config: RequestConfig) => config;
  },
};

// 响应拦截器（模拟axios拦截器）
const responseInterceptor = {
  use: (
    onFulfilled?: (response: any) => any,
    onRejected?: (error: RequestError) => any
  ) => {
    // 全局错误处理
    if (onRejected) {
      const originalRequest = baseRequest;
      baseRequest = async (config: RequestConfig) => {
        try {
          const result = await originalRequest(config);
          return onFulfilled ? onFulfilled(result) : result;
        } catch (error) {
          if (error instanceof RequestError) {
            // 处理401未授权
            if (error.response?.status === 401) {
              setAuth('');
              window.location.assign(`${window.location.origin}/login`);
              return;
            }

            // 显示错误消息
            if (error.response) {
              error.response.json().then((errorData: any) => {
                Toast.show({ 
                  icon: 'fail', 
                  content: errorData.message || '请求失败' 
                });
              }).catch(() => {
                Toast.show({ icon: 'fail', content: '网络错误' });
              });
            } else {
              Toast.show({ icon: 'fail', content: error.message });
            }
          }
          throw error;
        }
      };
    }
  },
};

// 设置全局拦截器
responseInterceptor.use(
  (response) => response,
  (error: RequestError) => {
    if (error.message.includes('timeout')) {
      Toast.show({ icon: 'fail', content: '网络超时' });
    }
    return Promise.reject(error);
  }
);

export const get = (
  url: string,
  params?: object,
  config?: Omit<RequestConfig, 'method' | 'url' | 'params'>
) =>
  baseRequest({
    method: 'get',
    params,
    url,
    ...config,
  });

export const post = (
  url: string,
  data: object,
  config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
) => {
  return baseRequest({
    data,
    method: 'post',
    url,
    ...config,
  });
};

export const patch = (
  url: string,
  data: object,
  config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
) => {
  return baseRequest({
    data,
    method: 'patch',
    url,
    ...config,
  });
};

export const put = (
  url: string,
  data?: object,
  config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
) => {
  return baseRequest({
    data,
    method: 'put',
    url,
    ...config,
  });
};

export const remove = (
  url: string,
  data?: object,
  config?: Omit<RequestConfig, 'method' | 'url' | 'data'>
) => {
  return baseRequest({
    data,
    method: 'delete',
    url,
    ...config,
  });
};

// 导出拦截器用于其他地方的定制
export const interceptors = {
  request: requestInterceptor,
  response: responseInterceptor,
};
