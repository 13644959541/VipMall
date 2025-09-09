import { get } from '../plugins/request';

// 商品类型定义
export interface Product{
    /**
     * 可用门店ID
     */
    applicableStore?: string;
    /**
     * 适用门店名称
     */
    applicableStoresName?: string;
    /**
     * 可用门列表,给前端展示使用
     */
    applicableStoresNameList?: string[];
    /**
     * 兑换结束时间
     */
    exchangeEndTime?: string;
    /**
     * 兑换开始时间
     */
    exchangeStartTime?: string;
    /**
     * 兑换时间区间
     */
    exchangeTimeRange?: string;
    /**
     * 互斥规则
     */
    exclusionText?: string;
    /**
     * 是否过期：0-否 1-是
     */
    isExpired?: number;
    /**
     * 是否热销：0-否 1-是
     */
    isHot?: number;
    /**
     * 主图URL
     */
    mainImage?: string;
    /**
     * 会员等级
     */
    membershipLevel?: string;
    /**
     * 原价
     */
    originalPrice?: number;
    /**
     * 所需积分
     */
    pointsRequired?: string;
    /**
     * 商品编码
     */
    productCode?: string;
    /**
     * 商品ID
     */
    productId?: string;
    /**
     * 商品名称
     */
    productName?: string;
    /**
     * 商品类型：0-周边礼品 1-代金券 2-菜品券
     */
    productType?: number;
    /**
     * 销售数量
     */
    salesCount?: number;
    /**
     * 库存数量
     */
    stockQuantity?: number;
    /**
     * 券模版Id(券类型专属字段)
     */
    templateId?: string;
    /**
     * 总记录数（用于分页）
     */
    totalCount?: number;
    /**
     * 是否用保底语言
     */
    useBaseLanguage?: boolean;
}

/**
 * 响应数据
 *
 * StoreProductDetailResponse
 */
export interface ProductDetails{
    /**
     * 可用门店
     */
    applicableStores?: string[];
    /**
     * 可用时间
     */
    availableTime?: string;
    /**
     * 优惠券类商品专属信息（仅优惠券展示）
     * 票券类型
     */
    couponType?: string;
    /**
     * 当前用户等级所需积分
     */
    currentLevelPoints?: number;
    /**
     * 二、会员等级相关：兑换所需积分
     * 当前用户会员等级
     */
    currentMemberLevel?: string;
    /**
     * 兑换说明
     */
    exchangeDescription?: string;
    /**
     * 可兑换时间结束
     */
    exchangeEndTime?: string;
    /**
     * 四、状态与规则信息
     * 可兑换时间开始
     */
    exchangeStartTime?: string;
    /**
     * 使用规则（互斥文案）
     */
    exclusionText?: string;
    /**
     * 是否在可兑换时间内
     */
    isInExchangeTime?: boolean;
    /**
     * 是否在用户会员等级可兑范围内
     */
    isInUserRange?: boolean;
    /**
     * 是否可转增
     */
    isTransferable?: boolean;
    /**
     * 分会员等级积分详情
     */
    levelPointsMap?: MapInteger;
    /**
     * 商品图片URL
     */
    mainImage?: string;
    /**
     * 限购等级
     */
    membershipLevel?: string;
    /**
     * 下一级会员等级所需积分
     */
    nextLevelPoints?: number;
    /**
     * 下一级会员等级
     */
    nextMemberLevel?: string;
    /**
     * 商品编码
     */
    productCode?: string;
    /**
     * 商品详情
     */
    productDetail?: string;
    /**
     * 一、通用基础信息（所有商品均展示）
     * 商品ID
     */
    productId: string;
    /**
     * 商品名称
     */
    productName: string;
    /**
     * 三、场景化特殊信息
     * 商品类型：0-周边礼品 1-代金券 2-菜品券
     */
    productType: number;
    /**
     * 商品价值（仅菜品券、周边礼品展示）
     */
    productValue?: number;
    /**
     * 剩余库存量（仅周边礼品展示）
     */
    remainingStock?: number;
    /**
     * 商品状态：0-不可兑换 1-可兑换
     */
    status?: number;
    /**
     * 门店信息
     */
    storeInfo?: StoreInfo;
    /**
     * 累计兑换量
     */
    totalExchangeCount?: number;
    /**
     * 有效日期结束
     */
    validEndDate?: string;
    /**
     * 有效日期开始
     */
    validStartDate?: string;
   // [property: string]: any;
}

/**
 * 分会员等级积分详情
 *
 * MapInteger
 */
export interface MapInteger {
    key?: number;
}

/**
 * 门店信息
 *
 * StoreInfo
 */
export interface StoreInfo {
    /**
     * 营业时间
     */
    businessHours?: string;
    /**
     * 门店地址
     */
    storeAddress?: string;
    /**
     * 门店ID
     */
    storeId?: string;
    /**
     * 门店名称
     */
    storeName?: string;
}

// 商品查询参数接口
export interface ProductQueryParams {
  productType?: number;      // 0:周边礼品, 1:代金券, 2:菜品券
  language?: string;         // 'zh-CN', 'en-US'等
  storeId?: string;          // 门店ID
  localLevel?: string;       // 会员等级
  isHot?: boolean;           // 是否热销
}

/**
 * 构建查询参数字符串
 */
const buildQueryString = (params?: ProductQueryParams): string => {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  
  if (params.productType !== undefined) {
    queryParams.append('productType', params.productType.toString());
  }
  if (params.language) {
    queryParams.append('language', params.language);
  }
  if (params.storeId) {
    queryParams.append('storeId', params.storeId);
  }
  if (params.localLevel !== undefined) {
    queryParams.append('localLevel', params.localLevel.toString());
  }
  if (params.isHot !== undefined) {
    queryParams.append('isHot', params.isHot.toString());
  }
  
  return queryParams.toString();
};

/**
 * 获取商品列表
 */
export const getProductList = async (params?: ProductQueryParams): Promise<any[]> => {
  try {
     const queryParams: ProductQueryParams = {
      ...params,
      isHot: false
    };
    const queryString = buildQueryString(queryParams);
    const url = `/front/product/store/list${queryString ? `?${queryString}` : ''}`;
    const response = await get(url);
    return response.records || [];
  } catch (error) {
    console.error('获取商品列表失败:', error);
    throw error;
  }
};

export const getHotProductList = async (params?: ProductQueryParams): Promise<any[]> => {
  try {
    const queryParams: ProductQueryParams = {
      ...params,
      isHot: true
    };
    const queryString = buildQueryString(queryParams);
    const url = `/front/product/store/list${queryString ? `?${queryString}` : ''}`;
    const response = await get(url);
    return response.records || [];
  } catch (error) {
    console.error('获取热销商品列表失败:', error);
    throw error;
  }
};

export const getProductDetails = async (productId: string, params?: ProductQueryParams): Promise<ProductDetails> => {
  try {
    const queryString = buildQueryString(params);
    const url = `/front/product/store/${productId}${queryString ? `?${queryString}` : ''}`;
    const response = await get(url);
    return response || {} as ProductDetails;
  } catch (error) {
    console.error('获取商品详情失败:', error);
    throw error;
  }
};
