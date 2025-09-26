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
    isExpired?: boolean;
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
     * 可用门店ID
     */
    applicableStore?: string;
    /**
     * 可用门店
     */
    applicableStoresName?: string;
    /**
     * 可用门列表,给前端展示使用
     */
    applicableStoresNameList?: string[];
    /**
     * 可用时间
     */
    availableTime?: UseTime[];
    /**
     * 优惠券类商品专属信息（仅优惠券展示，从营销系统获取）对象
     * 优惠券类商品专属信息（仅优惠券展示，从营销系统获取）
     */
    couponDetail?: CouponDetailData;
    /**
     * 优惠券类商品专属信息(根据当地语言返回对应语言的信息)
     */
    couponDetailDataByCountryCode?: CouponDetailDataByCountryCode;
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
    levelPointsMap?: string;
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
     * 累计兑换量
     */
    totalExchangeCount?: number;
    /**
     * 是否用保底语言
     */
    useBaseLanguage?: boolean;
    /**
     * 有效日期结束
     */
    validEndDate?: string;
    /**
     * 有效日期开始
     */
    validStartDate?: string;

    categoryId?: string;

    categoryType?: number;
}


/**
 * 优惠券类商品专属信息（仅优惠券展示，从营销系统获取）对象
 * 优惠券类商品专属信息（仅优惠券展示，从营销系统获取）
 *
 * CouponDetailData
 */
export interface CouponDetailData {
    /**
     * 活动ID
     */
    activityId?: string;
    /**
     * 活动名称
     */
    activityName?: string;
    /**
     * 是否可转赠
     */
    canTransfer?: number;
    /**
     * 国家代码(根据这个countryCode来判断返回前端 本地语言还是中文)
     */
    countryCode?: string;
    /**
     * 券内容
     */
    couponContent?: string;
    /**
     * 券内容（英文）
     */
    couponContentEn?: string;
    /**
     * 券说明
     */
    couponNote?: string;
    /**
     * 券说明（英文）
     */
    couponNoteEn?: string;
    /**
     * 券类型
     */
    couponType?: string;
    /**
     * 券类型名称
     */
    couponTypeName?: string;
    /**
     * 商品信息列表
     */
    itemVoList?: ItemInfo[];
    /**
     * 券名称
     */
    name?: string;
    /**
     * 券名称当地语言
     */
    nameInt?: string;
    /**
     * 券备注
     */
    note?: string;
    /**
     * 适用门店ID列表
     */
    storeIds?: string[];
    /**
     * 模板ID
     */
    templateId?: string;
    /**
     * 时间段名称
     */
    timeStrName?: string;
    /**
     * 时间段名称（英文）
     */
    timeStrNameEn?: string;
    /**
     * 使用说明
     */
    useInstruction?: string[];
    /**
     * 使用说明（英文）
     */
    useInstructionEn?: string[];
    /**
     * 使用时间
     */
    useTime?: UseTime[];
}

/**
 * 商品信息内部类
 *
 * ItemInfo
 */
export interface ItemInfo {
    /**
     * 商品编码
     */
    itemCode?: string;
    /**
     * 商品名称
     */
    itemName?: string;
}

/**
 * 使用时间内部类
 *
 * UseTime
 */
export interface UseTime {
    /**
     * 时间维度
     */
    dimension?: string;
    /**
     * 结束时间
     */
    endTime?: string;
    /**
     * 选择状态
     */
    selectTrue?: string;
    /**
     * 开始时间
     */
    startTime?: string;
    /**
     * 值
     */
    values?: string;
}

/**
 * 优惠券类商品专属信息(根据当地语言返回对应语言的信息)
 *
 * CouponDetailDataByCountryCode
 */
export interface CouponDetailDataByCountryCode {
    /**
     * 活动ID
     */
    activityId?: string;
    /**
     * 活动名称
     */
    activityName?: string;
    /**
     * 是否可转赠
     */
    canTransfer?: number;
    /**
     * 优惠内容(优惠内容当地语言)
     */
    couponContent?: string;
    /**
     * 优惠说明(优惠说明当地语言)
     */
    couponNote?: string;
    /**
     * 券类型
     */
    couponType?: string;
    /**
     * 券类型名称
     */
    couponTypeName?: string;
    /**
     * 券名称(券名称当地语言)
     */
    name?: string;
    /**
     * 券备注
     */
    note?: string;
    /**
     * 适用门店ID列表
     */
    storeIds?: string[];
    /**
     * 模板ID
     */
    templateId?: string;
    /**
     * 有效期(有效期当地语言)
     */
    timeStrName?: string;
    /**
     * 使用说明(使用说明当地语言)
     */
    useInstruction?: string[];
}


// 商品查询参数接口
export interface ProductQueryParams {
  categoryIds?: string;      // 0:周边礼品, 1:代金券, 2:菜品券
  language?: string;         // 'zh-CN', 'en-US'等
  storeId?: string;          // 门店ID
  localLevel?: string;       // 会员等级
  isHot?: boolean;           // 是否热销
  templateId?:string;
  productType?:number;
  terminalType?:string;      //终端类型（APP和PAD
  countryCode?:string;        //国家代码
}

/**
 * 构建查询参数字符串
 */
const buildQueryString = (params?: ProductQueryParams): string => {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  
  if (params.categoryIds !== undefined) {
    queryParams.append('categoryIds', params.categoryIds.toString());
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
  if (params.templateId !== undefined) {
    queryParams.append('templateId', params.templateId.toString());
  } 
  if (params.productType !== undefined) {
    queryParams.append('productType', params.productType.toString());
  }
  if (params.terminalType !== undefined) {
    queryParams.append('terminalType', params.terminalType.toString());
  }
  if (params.countryCode !== undefined) {
    queryParams.append('countryCode', params.countryCode.toString());
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
      isHot: false,
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


export const getHotList = async (params?: ProductQueryParams):  Promise<any[]> => {
  try {
    const queryString = buildQueryString(params);
    const url = `/front/product/store/hot-list${queryString ? `?${queryString}` : ''}`;
    const response = await get(url);
    return response.records || [];
  } catch (error) {
    console.error('获取商品详情失败:', error);
    throw error;
  }
};