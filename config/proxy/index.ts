import { ProxyOptions } from 'vite';
/**
 * Generate proxy
 * @param list
 */
export default (target: string) => {
  // 添加空值检查，如果target为空则返回空代理配置
  if (!target) {
    console.warn('Proxy target is empty, proxy will be disabled');
    return {};
  }
  
  const ProxyList: Record<string, string | ProxyOptions> = {
    
    '/front': {
      target: target,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/front/, '/api/front'),
    },
  };
  return ProxyList;
};
