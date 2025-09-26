// 货币符号映射工具函数
export const getCurrencySymbol = (countryCode: string): string => {
  const currencyMap: Record<string, string> = {
    'SG': 'S$',      // 新加坡
    'US': '$',       // 美国
    'KR': '₩',       // 韩国
    'JP': '¥',       // 日本
    'AU': '$',       // 澳大利亚
    'CA': '$',       // 加拿大
    'GB': '£',       // 英国
    'VN': '₫',       // 越南
    'MY': 'RM',      // 马来西亚
    'ID': 'Rp',      // 印度尼西亚
    'TH': '฿',       // 泰国
    'AE': 'AED',     // 阿拉伯联合酋长国
    'PH': '₱',       // 菲律宾
    'KH': '$',       // 柬埔寨
    'HK': 'HK$',     // 香港
    'MO': 'MOP$',    // 澳门
    'TW': 'NT$',     // 台湾
    'CN': '¥',       // 中国大陆
  };
  
  return currencyMap[countryCode.toUpperCase()] || '$'; // 默认返回美元符号
};
