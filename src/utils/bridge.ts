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

// 验证逻辑工具函数
export function shouldShowVerification(
  loginStyle: string, 
  verifyType: string, 
  operation: 'exchange' | 'verification'
): boolean {
  // 免密登录的特殊处理：verifyType "3" 等同于 "1"
  if (loginStyle === "1" && verifyType === "3") {
    verifyType = "1"; // 将 verifyType "3" 转换为 "1" 来处理
  }
  
  // 通用规则
  switch (verifyType) {
    case "1": // 仅核销时验证
      return operation === 'verification';
    case "2": // 兑换、核销时验证
      return true;
    case "3": // 无需验证
      return false;
    default:
      return false;
  }
}

// 常用方法封装示例
export const NativeBridge = {
  // 获取用户信息
  getUserInfo: (callback: (userInfo: any) => void) => {
    // Mock data for development/testing when native bridge is not available
    const mockUserInfo = {
      remoteCountry: "SG",
      nickname: "IWY5Sz6G",
      mobile: "13644959541",
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
      areaCode: "+86",
      localLevel: "1",
      unsubscribe: false,
      loginType: "1",//loginType	String	登录类型 1手机号，2邮箱
      loginStyle: "3", //loginStyle	String	登录方式 1:免密登录 2:账号密码 3:验证码登录
      verifyType:"",	//	802参数 1 仅核销时验证 2 兑换、核销时验证 3 无需验证
      isRemoteLogin: "false",
      customerKey: "n-149405263605600",
      posPushFlag: "false",
      points: 10,
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
      email: "120122190@qq.com",
      country: "HK",
      tableNo: "55",
      shopNo: "280104",
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
