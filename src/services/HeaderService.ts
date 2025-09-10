import { get } from '../plugins/request';

// 国家请求参数
export interface CountryRequest {
      /**
     * 国家代码 国家代码
     */
    countryCode: string;
}
export interface BannerResponse {
    /**
     * 图片在aws S3的存放地址
     */
    appImageUrl?: string;
    /**
     * 国家代码
     */
    countryCode?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 展示结束时间
     */
    displayEndDate?: string;
    /**
     * 展示开始时间
     */
    displayStartDate?: string;
    /**
     * 启用状态
     */
    enabled?: boolean;
    /**
     * Banner ID
     */
    id?: number;
    /**
     * 图片在aws S3的存放地址
     */
    padImageUrl?: string;
    /**
     * 排序序号
     */
    sortOrder?: number;
    /**
     * 终端类型
     */
    terminalType?: string;
    /**
     * 标题
     */
    title?: string;
}

export interface LanguageOption {
    /**
     * 语言显示名称
     */
    label?: string;
    /**
     * 语言代码
     */
    value?: string;
}


// 获取国家语言列表
export const getCountryLanguages = async (params?: CountryRequest): Promise<LanguageOption[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.countryCode) {
      queryParams.append('countryCode', params.countryCode);
    }
    const queryString = queryParams.toString();
    const url = `/front/country/languages${queryString ? `?${queryString}` : ''}`;
    
    const response = await get(url);
    return response || [];
  } catch (error) {
    console.error('获取国家语言列表失败:', error);
    throw error;
  }
};

// 获取横幅列表
export const getCountryBanners = async (params?: CountryRequest): Promise<BannerResponse[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.countryCode) {
      queryParams.append('countryCode', params.countryCode);
    }
    
    const queryString = queryParams.toString();
    const url = `/front/country/banners${queryString ? `?${queryString}` : ''}`;
    
    const response = await get(url);
    return response || [];
  } catch (error) {
    console.error('获取横幅列表失败:', error);
    throw error;
  }
};
