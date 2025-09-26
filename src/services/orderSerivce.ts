import { get, post } from '../plugins/request';
export interface getOrderQuery {
    /**
     * 语言代码 语言代码（必传）
     */
    language: string;
    /**
     * 会员ID 会员ID（必传）
     */
    memberId: string;
    /**
     * 页码（可选，不传则查询所有数据） 页码（可选，不传则查询所有数据）
     */
    page?: number;
    /**
     * 商品类型 商品类型：0-周边礼品 1-代金券 2-菜品券（必传，且只能是0/1/2）
     */
    categoryType: number;
    /**
     * 每页数量（可选，不传则查询所有数据） 每页数量（可选，不传则查询所有数据）
     */
    size?: number;
    /**
     * 门店ID（必传）
     */
    storeId: string;

    countryCode?: string;
}

export interface submitOrderData {
    /**
     * 订单商品ID（主键） 订单商品ID（必传）
     */
    itemId: number;
}


/**
 * 订单商品记录响应DTO
 * 按OrderItem维度返回订单商品信息
 *
 * OrderItemRecordResponse
 */
export interface OrderItemRecordResponse {
    /**
     * 适用门店名称
     */
    applicableStoresName?: string;
    /**
     * 适用门店名称列表 前端使用
     */
    applicableStoresNameList?: string[];
    /**
     * 国家代码
     */
    countryCode?: string;
    /**
     * 使用规则
     */
    exclusionText?: string;
    /**
     * 商品明细ID
     */
    itemId?: number;
    /**
     * 会员ID
     */
    memberId?: string;
    /**
     * 订单ID
     */
    orderId?: number;
    /**
     * 订单号
     */
    orderNo?: string;
    /**
     * 订单状态
     */
    orderStatus?: string;
    /**
     * 订单状态描述
     */
    orderStatusDesc?: string;
    /**
     * 订单时间
     */
    orderTime?: string;
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
     * 商品类型
     */
    productType?: string;
    /**
     * 商品父分类类型
     */
    categoryType?: number;
    /**
     * 数量
     */
    quantity?: number;
    /**
     * 门店ID
     */
    storeId?: string;
    /**
     * 门店名称
     */
    storeName?: string;
    /**
     * 终端类型
     */
    terminalType?: string;
    /**
     * 总金额
     */
    totalAmount?: number;
    /**
     * 总记录数
     */
    totalCount?: number;
    /**
     * 总积分
     */
    totalPoints?: number;
    /**
     * 单价积分
     */
    unitPoints?: number;
    /**
     * 单价
     */
    unitPrice?: number;
    /**
     * 是否用保底语言
     */
    useBaseLanguage?: boolean;
    /**
     * 有效期
     */
    validityPeriod?: string;
    /**
     * 券核销状态：0-未核销，1-已核销
     */
    verificationStatus?: string;
}

export const getOrderRequest= async (data:getOrderQuery): Promise<any[]> => {
  try { 
    const response = await get('/front/order/items', data);
    return response.records || [];
  } catch (error) {
    console.error('发送失败:', error);
    throw error;
  }
};

export const submitOrderRequest = async (data:submitOrderData): Promise<any[]> => {
  try {
   const response = await post('/front/order/verify-coupon', data);
     if (response.success !== true) {
        throw new Error(response.msg || '兑换失败');
     }
    return response;
  } catch (error) {
    throw error;
  }
};


