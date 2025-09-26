import { getAuth} from './../utils/index';

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

  let fullUrl = `${API_BASE_URL ? API_BASE_URL : ''}/api${url}`;
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuth()}`,
    ...headers,
  };

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

const requestInterceptor = {
  use: (onFulfilled?: (config: RequestConfig) => RequestConfig) => {
    if (onFulfilled) {
      return (config: RequestConfig) => onFulfilled(config);
    }
    return (config: RequestConfig) => config;
  },
};

const responseInterceptor = {
  use: (
    onFulfilled?: (response: any) => any,
    onRejected?: (error: RequestError) => any
  ) => {
    if (onRejected) {
      const originalRequest = baseRequest;
      baseRequest = async (config: RequestConfig) => {
        try {
          const result = await originalRequest(config);
          return onFulfilled ? onFulfilled(result) : result;
        } catch (error) {
          console.error('请求失败: ', error);
          throw error;
        }
      };
    }
  },
};

responseInterceptor.use(
  (response) => response,
  (error: RequestError) => {
    if (error.message.includes('timeout')) {
      console.error('请求超时');
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
