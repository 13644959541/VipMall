/**
 * WebViewJavascriptBridge 封装
 */

declare global {
  interface Window {
    WebViewJavascriptBridge?: any
    WVJBCallbacks?: any[]
  }
}

// 初始化Bridge
export function setupWebViewJavascriptBridge(callback: (bridge: any) => void) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  
  const WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

// 调用原生方法
export function callNativeHandler(
  handlerName: string,
  data: any,
  responseCallback?: (responseData: any) => void
) {
  setupWebViewJavascriptBridge((bridge) => {
    bridge.callHandler(handlerName, data, responseCallback)
  })
}

// 注册供原生调用的JS方法
export function registerHandler(
  handlerName: string,
  handler: (data: any, responseCallback: (responseData: any) => void) => void
) {
  setupWebViewJavascriptBridge((bridge) => {
    bridge.registerHandler(handlerName, handler)
  })
}

// 常用方法封装示例
export const NativeBridge = {
  // 获取用户信息
  getUserInfo: (callback: (userInfo: any) => void) => {
    callNativeHandler('getUserInfo', null, callback)
  },
  
  // 分享
  share: (params: {
    title: string
    content: string
    url: string
  }) => {
    callNativeHandler('share', params)
  },
  
  // 打开新页面
  openUrl: (url: string) => {
    callNativeHandler('openUrl', { url })
  },
  
  // 关闭WebView
  closeWebView: () => {
    callNativeHandler('closeWebView', null)
  }
}
