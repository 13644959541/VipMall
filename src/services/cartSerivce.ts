import { get , post } from '../plugins/request';


/**
 * 购物车商品项响应DTO
 *
 * CartItemResponse
 */
export interface CartItemResponse {
    /**
     * 可用门店名称列表 前端使用
     */
    applicableStoreList?: string[];
    /**
     * 可用门店
     */
    applicableStores?: string;
    /**
     * 商品分类ID
     */
    categoryId?: string;
    /**
     * 分类类型
     */
    categoryType?: number;
    /**
     * 券类型
     */
    couponType?: string;
    /**
     * 兑换结束时间
     */
    exchangeEndTime?: string;
    /**
     * 兑换开始时间
     */
    exchangeStartTime?: string;
    /**
     * 使用规则
     */
    exclusionText?: string;
    /**
     * 是否在兑换时间
     */
    isInExchangeTime?: boolean;
    /**
     * 是否选中
     */
    isSelected?: boolean;
    /**
     * 商品编码
     */
    productCode?: string;
    /**
     * 商品ID
     */
    productId?: string;
    /**
     * 商品图片
     */
    productImage?: string;
    /**
     * 商品名称
     */
    productName?: string;
    /**
     * 商品价值（菜品券和周边礼品类型）
     */
    productPrice?: number;
    /**
     * 商品状态
     */
    productStatus?: string;
    /**
     * 商品类型
     */
    productType?: number;
    /**
     * 数量
     */
    quantity?: number;
    /**
     * 剩余库存
     */
    remainingStock?: number;
    /**
     * 库存状态
     */
    stockStatus?: boolean;
    /**
     * 券模板ID
     */
    templateId?: string;
    /**
     * 总兑换次数
     */
    totalExchangeCount?: number;
    /**
     * 单价积分
     */
    unitPoints?: number;
    /**
     * 是否用保底语言
     */
    useBaseLanguage?: boolean;
  
}



export const cartAddOrUpdate = async (data: {
    memberId: string;
    storeId: string;
    countryCode: string;
    products: Array<{
    productType: number;
    productId: string;
    quantity: number;
    isSelected: boolean;
    templateId?:string;
    categoryType:number;
    categoryId:string;
    }>;
}): Promise<any[]> => {
  try {
    const response = await post('/front/cart/addOrUpdate', data);
    return response.records || [];
  } catch (error) {
    console.error('保存购物车失败:', error);
    throw error;
  }
};

export const getCartDetails = async (params: {
  memberId: string;
  countryCode: string;
  language: string;
  storeId: string;
  localLevel: string;
}): Promise<any[]> => {
  try {
    const response = await get('/front/cart/detail', params);
    return response.items || [];
  } catch (error) {
    console.error('获取购物车详情失败:', error);
    throw error;
  }
};
