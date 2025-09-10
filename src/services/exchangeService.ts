import { post } from '../plugins/request';
/**
 * 兑换请求
 *
 * ExchangeRequest
 */
export interface ExchangeRequest {
    /**
     * 国家编码
     */
    countryCode: string;
    /**
     * 兑换类型（DIRECT:直接兑换, CART:购物车兑换）
     */
    exchangeType: string;
    /**
     * 用户ID
     */
    memberId: string;
    /**
     * 商品兑换项列表
     */
    productItems: ProductExchangeItem[];
    /**
     * 门店ID
     */
    storeId: string;
    /**
     * 终端类型（APP:移动端, PAD:平板端）
     */
    terminalType: string;
}

/**
 * 商品兑换项DTO
 * 用于商品处理服务
 *
 * ProductExchangeItem
 */
export interface ProductExchangeItem {
    /**
     * 会员 ID
     */
    memberId: string;
    /**
     * 商品编码
     */
    productCode?: string;
    /**
     * 商品ID
     */
    productId: string;
    /**
     * 商品名称
     */
    productName?: string;
    /**
     * 商品类型（0:周边礼品, 1:代金券, 2:菜品券）
     * 对应product_info表的type_id字段
     */
    productType: string;
    /**
     * 兑换数量
     */
    quantity: number;
    /**
     * 门店ID
     */
    storeId: string;
    /**
     * 模板ID（券类型商品专用）
     * 用于营销系统发券时的templateId参数
     */
    templateId?: string;
    /**
     * 小计积分
     */
    totalPoints?: number;
    /**
     * 单价积分
     */
    unitPoints?: number;
}

/**
 * 兑换请求
 *
 * ExchangeRequest
 */
export interface ExchangeCartequest {
    /**
     * 国家编码
     */
    countryCode: string;
    /**
     * 兑换类型（DIRECT:直接兑换, CART:购物车兑换）
     */
    exchangeType: string;
    /**
     * 用户ID
     */
    memberId: string;
    /**
     * 商品兑换项列表
     */
    productItems: ProductExchangeCartItem[];
    /**
     * 门店ID
     */
    storeId: string;
    /**
     * 终端类型（APP:移动端, PAD:平板端）
     */
    terminalType: string;
    [property: string]: any;
}

/**
 * 商品兑换项DTO
 * 用于商品处理服务
 *
 * ProductExchangeItem
 */
export interface ProductExchangeCartItem {
    /**
     * 会员 ID
     */
    memberId: string;
    /**
     * 商品编码
     */
    productCode?: string;
    /**
     * 商品ID
     */
    productId: string;
    /**
     * 商品名称
     */
    productName?: string;
    /**
     * 商品类型（0:周边礼品, 1:代金券, 2:菜品券）
     * 对应product_info表的type_id字段
     */
    productType: string;
    /**
     * 兑换数量
     */
    quantity: number;
    /**
     * 门店ID
     */
    storeId: string;
    /**
     * 模板ID（券类型商品专用）
     * 用于营销系统发券时的templateId参数
     */
    templateId?: string;
    /**
     * 小计积分
     */
    totalPoints?: number;
    /**
     * 单价积分
     */
    unitPoints?: number;
}

export const exchangeRequest= async (data:ExchangeRequest): Promise<any[]> => {
  try { 
    const response = await post('/front/exchange/direct', data);
    return response.records || [];
  } catch (error) {
    console.error('发送失败:', error);
    throw error;
  }
};

export const exchangeCartRequest = async (data:ExchangeRequest): Promise<any[]> => {
  try {
    const response = await post('/front/exchange/cart', data);
    return response.items || [];
  } catch (error) {
   
    throw error;
  }
};
