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
    // Mock data for development/testing when native bridge is not available
    const mockUserInfo = {
      remoteCountry: "SG",
      nickname: "IWY5Sz6G",
      mobile: "13681637520",
      scoreExpire: 0,
      smsFlg: "1",
      levelUpGrowth: 1094,
      nextMonthLevel: 2,
      totalShopCount: "1",
      expireGrowth: 0,
      growthValue: 0,
      isCompleteMemberInfo: false,
      pwd: "",
      isWeakPwd: false,
      monthGrowth: 106,
      loginType: "1",
      areaCode: "+86",
      localLevel: "4",
      unsubscribe: false,
      loginStyle: "3",
      isRemoteLogin: "false",
      customerKey: "n-148281478871424",
      posPushFlag: "false",
      points: 10600,
      sex: "",
      RealName: "",
      memberLevelConfigList: [
        {
          level: 4,
          growthValueMin: 5400,
          country: "SG",
          growthValueMax: 999999999
        },
        {
          level: 3,
          country: "SG",
          growthValueMax: 5400,
          growthValueMin: 2700
        },
        {
          growthValueMin: 1200,
          level: 2,
          country: "SG",
          growthValueMax: 2700
        },
        {
          growthValueMin: 0,
          country: "SG",
          growthValueMax: 1200,
          level: 1
        }
      ],
      defaultLoginType: "3",
      solarBirth: "",
      email: "123456789@qq.com",
      country: "",
      tableNo: "",
      shopNo: "",
      avatar: "/user.svg" // Added avatar field for UI compatibility
    };
    
    // Check if native bridge is available, otherwise use mock data
    if (window.WebViewJavascriptBridge) {
      callNativeHandler('getUserInfo', null, callback);
    } else {
      // Use mock data for development
      console.log('Using mock user data for development');
      callback(mockUserInfo);
    }
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
  closePage: () => {
    console.log('关闭页面');
    callNativeHandler('closePage', null)
  }
}
