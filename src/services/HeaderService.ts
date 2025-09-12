import { get, post } from '../plugins/request';

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

export interface CategoryResponse {
    /**
     * 分类ID
     */
    categoryId?: number;
    /**
     * 分类名称（根据语言返回对应文本）
     */
    categoryName?: string;
    /**
     * 子分类列表
     */
    children?: CategoryResponse[];
    /**
     * 适用国家代码
     */
    countryCode?: string;
    /**
     * 是否有子分类
     */
    hasChildren?: boolean;
    /**
     * 父分类ID
     */
    parentId?: number;
    /**
     * 状态（1-启用，0-禁用）
     */
    status?: number;
    /**
     * 适用终端类型（1-APP，2-小程序，3-H5）
     */
    terminalType?: string;
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

export const getCategoryTree = async (params: {
    "countryCode": string,
    "terminalType": string,
    "language": string
}): Promise<CategoryResponse[]> => {
  try {
    const response = await post('/front/category/tree', params);
    return response || [];
  } catch (error) {
    console.error('获取分类失败:', error);
    throw error;
  }
};

