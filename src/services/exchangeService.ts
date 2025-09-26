import { useAuthModel } from '@/model/useAuthModel';
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
    categoryType:number;

    categoryId:string;
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

/**
 * 响应数据
 *
 * ExchangeResponse
 */
export interface ExchangeResponse {
    /**
     * 补偿结果（失败时）
     */
    compensateResult?: CompensateResult;
    /**
     * 券码信息（券类商品）
     */
    couponCodes?: string[];
    /**
     * 兑换商品明细
     */
    exchangeItems?: ExchangeItemResult[];
    /**
     * 兑换状态（SUCCESS:成功, FAILED:失败, PROCESSING:处理中）
     */
    exchangeStatus?: string;
    /**
     * 兑换时间
     */
    exchangeTime?: string;
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 错误码
     */
    frontResultCode?: FrontResultCode;
    /**
     * 会员积分信息
     */
    memberPointsInfo?: MemberPointsInfo;
    /**
     * 订单号
     */
    orderNo?: string;
    /**
     * 订单状态
     */
    orderStatus?: string;
    /**
     * 积分操作结果
     */
    pointsResult?: PointsOperationResult;
    /**
     * 商品处理结果
     */
    productResult?: ProductProcessResult;
    /**
     * 总积分
     */
    totalPoints?: number;
    /**
     * 总数量
     */
    totalQuantity?: number;
    
}

/**
 * 补偿结果（失败时）
 *
 * CompensateResult
 */
export interface CompensateResult {
    /**
     * 补偿状态（SUCCESS/PARTIAL_SUCCESS/FAILED）
     */
    compensateStatus?: string;
    /**
     * 补偿策略（GIFT_ONLY/COUPON_ONLY/MIXED）
     */
    compensateStrategy?: string;
    /**
     * 补偿时间
     */
    compensateTime?: number;
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 是否需要人工处理
     */
    needManualProcess?: boolean;
    /**
     * 补偿操作列表
     */
    operations?: CompensateOperation[];
    /**
     * 订单号
     */
    orderNo?: string;
    /**
     * 重试次数
     */
    retryCount?: number;
    
}

/**
 * 补偿操作DTO
 * 用于记录单个补偿操作的执行情况
 *
 * CompensateOperation
 */
export interface CompensateOperation {
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 操作详情
     */
    operationDetail?: string;
    /**
     * 操作状态（SUCCESS/FAILED）
     */
    operationStatus?: string;
    /**
     * 操作时间
     */
    operationTime?: number;
    /**
     * 操作类型（INVENTORY_ROLLBACK/LOCK_RELEASE/POINTS_ROLLBACK）
     */
    operationType?: string;
    
}

/**
 * 兑换商品明细结果DTO
 *
 * ExchangeItemResult
 */
export interface ExchangeItemResult {
    /**
     * 券码（券类商品）
     */
    couponCode?: string;
    /**
     * 预计发货时间（周边礼品）
     */
    estimatedDeliveryTime?: string;
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 处理状态（SUCCESS:成功, FAILED:失败, PROCESSING:处理中）
     */
    processStatus?: string;
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
     * 商品类型（0:周边礼品, 1:代金券, 2:菜品券）
     */
    productType?: string;
    /**
     * 兑换数量
     */
    quantity?: number;
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
 * 错误码
 */
export enum FrontResultCode {
    ActivityConditionNotMet = "ACTIVITY_CONDITION_NOT_MET",
    ActivityEnded = "ACTIVITY_ENDED",
    ActivityNotFound = "ACTIVITY_NOT_FOUND",
    ActivityNotStarted = "ACTIVITY_NOT_STARTED",
    ActivityParticipationLimitExceeded = "ACTIVITY_PARTICIPATION_LIMIT_EXCEEDED",
    AddressCannotDelete = "ADDRESS_CANNOT_DELETE",
    AddressFormatInvalid = "ADDRESS_FORMAT_INVALID",
    AddressLimitExceeded = "ADDRESS_LIMIT_EXCEEDED",
    AddressNotFound = "ADDRESS_NOT_FOUND",
    CouponExpired = "COUPON_EXPIRED",
    CouponNotAvailable = "COUPON_NOT_AVAILABLE",
    CouponNotFound = "COUPON_NOT_FOUND",
    CouponReceiveFailed = "COUPON_RECEIVE_FAILED",
    CouponReceiveLimitExceeded = "COUPON_RECEIVE_LIMIT_EXCEEDED",
    CouponUsed = "COUPON_USED",
    ExchangeCartProcessException = "EXCHANGE_CART_PROCESS_EXCEPTION",
    ExchangeCartProcessFailed = "EXCHANGE_CART_PROCESS_FAILED",
    ExchangeCouponFailed = "EXCHANGE_COUPON_FAILED",
    ExchangeCouponProcessException = "EXCHANGE_COUPON_PROCESS_EXCEPTION",
    ExchangeDuplicateRequest = "EXCHANGE_DUPLICATE_REQUEST",
    ExchangeException = "EXCHANGE_EXCEPTION",
    ExchangeFailed = "EXCHANGE_FAILED",
    ExchangeGiftProcessException = "EXCHANGE_GIFT_PROCESS_EXCEPTION",
    ExchangeInsufficientStock = "EXCHANGE_INSUFFICIENT_STOCK",
    ExchangeLimitExceeded = "EXCHANGE_LIMIT_EXCEEDED",
    ExchangeOrderCannotCancel = "EXCHANGE_ORDER_CANNOT_CANCEL",
    ExchangeOrderNotFound = "EXCHANGE_ORDER_NOT_FOUND",
    ExchangePointsDeductFailed = "EXCHANGE_POINTS_DEDUCT_FAILED",
    ExchangePointsFreezeFailed = "EXCHANGE_POINTS_FREEZE_FAILED",
    ExchangeProductOffline = "EXCHANGE_PRODUCT_OFFLINE",
    ExchangeProductProcessException = "EXCHANGE_PRODUCT_PROCESS_EXCEPTION",
    ExchangeProductProcessFailed = "EXCHANGE_PRODUCT_PROCESS_FAILED",
    ExchangeProductsProcessFailed = "EXCHANGE_PRODUCTS_PROCESS_FAILED",
    FrontDataFormatError = "FRONT_DATA_FORMAT_ERROR",
    FrontNetworkError = "FRONT_NETWORK_ERROR",
    FrontOperationFailed = "FRONT_OPERATION_FAILED",
    FrontParamValidationFailed = "FRONT_PARAM_VALIDATION_FAILED",
    FrontRequestTooFrequent = "FRONT_REQUEST_TOO_FREQUENT",
    MemberLevelInvalid = "MEMBER_LEVEL_INVALID",
    MemberScoreInvalid = "MEMBER_SCORE_INVALID",
    MemberStatusBanned = "MEMBER_STATUS_BANNED",
    MemberStatusInvalid = "MEMBER_STATUS_INVALID",
    MemberStatusPotential = "MEMBER_STATUS_POTENTIAL",
    OrderCreateFailed = "ORDER_CREATE_FAILED",
    OrderCreateSuccessButSubCreateFailed = "ORDER_CREATE_SUCCESS_BUT_SUB_CREATE_FAILED",
    OrderIDInvalid = "ORDER_ID_INVALID",
    OrderMemberIDInvalid = "ORDER_MEMBER_ID_INVALID",
    OrderProductIDInvalid = "ORDER_PRODUCT_ID_INVALID",
    OrderProductTypeInvalid = "ORDER_PRODUCT_TYPE_INVALID",
    PointsInsufficient = "POINTS_INSUFFICIENT",
    ProductCategoryNotFound = "PRODUCT_CATEGORY_NOT_FOUND",
    ProductDetailNotFound = "PRODUCT_DETAIL_NOT_FOUND",
    ProductExchangeLevelNotMatch = "PRODUCT_EXCHANGE_LEVEL_NOT_MATCH",
    ProductExchangeTimeNotValid = "PRODUCT_EXCHANGE_TIME_NOT_VALID",
    ProductImageLoadFailed = "PRODUCT_IMAGE_LOAD_FAILED",
    ProductNotAvailable = "PRODUCT_NOT_AVAILABLE",
    ProductNotFound = "PRODUCT_NOT_FOUND",
    ProductSearchFailed = "PRODUCT_SEARCH_FAILED",
    ProductStockInsufficient = "PRODUCT_STOCK_INSUFFICIENT",
    ProductStoreDetailFailed = "PRODUCT_STORE_DETAIL_FAILED",
    ShareLinkExpired = "SHARE_LINK_EXPIRED",
    ShareLinkInvalid = "SHARE_LINK_INVALID",
    ShareRewardAlreadyReceived = "SHARE_REWARD_ALREADY_RECEIVED",
    UserInfoNotFound = "USER_INFO_NOT_FOUND",
    UserLoginExpired = "USER_LOGIN_EXPIRED",
    UserLoginFailed = "USER_LOGIN_FAILED",
    UserNotLogin = "USER_NOT_LOGIN",
    UserOrderQueryFailed = "USER_ORDER_QUERY_FAILED",
    UserPhoneNotVerified = "USER_PHONE_NOT_VERIFIED",
    UserPointsQueryFailed = "USER_POINTS_QUERY_FAILED",
    UserProfileUpdateFailed = "USER_PROFILE_UPDATE_FAILED",
    UserSMSCodeError = "USER_SMS_CODE_ERROR",
    UserSMSCodeExpired = "USER_SMS_CODE_EXPIRED",
    UserTokenInvalid = "USER_TOKEN_INVALID",
}

/**
 * 会员积分信息
 *
 * MemberPointsInfo
 */
export interface MemberPointsInfo {
    /**
     * 本次兑换消耗的积分
     */
    consumedPoints?: number;
    /**
     * 当前积分余额
     */
    currentPoints?: number;
    /**
     * 会员等级
     */
    level?: number;
    /**
     * 会员ID
     */
    memberId?: string;
    /**
     * 会员昵称
     */
    nickName?: string;
    /**
     * 会员状态
     */
    status?: number;
    
}

/**
 * 积分操作结果
 *
 * PointsOperationResult
 */
export interface PointsOperationResult {
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 失败阶段（FREEZE/DEDUCT）
     */
    failureStage?: string;
    /**
     * 订单号（outId）
     */
    orderNo?: string;
    /**
     * 操作积分数
     */
    points?: number;
    /**
     * 剩余积分余额
     */
    remainingPoints?: number;
    /**
     * 冻结积分ID（成功时返回，供后续回滚使用）
     */
    scoreId?: string;
    /**
     * 操作是否成功
     */
    success?: boolean;
    /**
     * 用户ID
     */
    userId?: string;
    
}

/**
 * 商品处理结果
 *
 * ProductProcessResult
 */
export interface ProductProcessResult {
    /**
     * 券处理结果
     */
    couponResult?: CouponProcessResult;
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 失败阶段（GIFT_PROCESS/COUPON_PROCESS）
     */
    failureStage?: string;
    /**
     * 礼品处理结果
     */
    giftResult?: GiftProcessResult;
    /**
     * 订单号
     */
    orderNo?: string;
    /**
     * 是否已触发积分回滚
     */
    pointsRollbacked?: boolean;
    /**
     * 已处理的分布式锁列表
     */
    processedLocks?: string[];
    /**
     * 处理策略（GIFT_ONLY/COUPON_ONLY/MIXED）
     */
    processStrategy?: string;
    /**
     * 处理时间戳
     */
    processTime?: number;
    /**
     * 处理是否成功
     */
    success?: boolean;
    
}

/**
 * 券处理结果
 *
 * CouponProcessResult
 */
export interface CouponProcessResult {
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 已发放的券ID列表
     */
    issuedCouponIds?: string[];
    /**
     * 营销系统交易ID
     */
    marketingTransactionId?: string;
    /**
     * 处理是否成功
     */
    success?: boolean;
    /**
     * 总券数
     */
    totalCoupons?: number;
    
}

/**
 * 礼品处理结果
 *
 * GiftProcessResult
 */
export interface GiftProcessResult {
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 商品明细列表（多个商品时使用）
     */
    giftItems?: GiftItemDetail[];
    /**
     * 分布式锁键
     */
    lockKey?: string;
    /**
     * 锁是否已释放
     */
    lockReleased?: boolean;
    /**
     * 商品ID
     */
    productId?: string;
    /**
     * 扣减数量
     */
    quantity?: number;
    /**
     * 剩余库存
     */
    remainingStock?: number;
    /**
     * 门店ID
     */
    storeId?: string;
    /**
     * 处理是否成功
     */
    success?: boolean;
    
}

/**
 * 礼品商品明细
 *
 * GiftItemDetail
 */
export interface GiftItemDetail {
    /**
     * 失败原因
     */
    failureReason?: string;
    /**
     * 分布式锁键
     */
    lockKey?: string;
    /**
     * 锁是否已释放
     */
    lockReleased?: boolean;
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
     * 扣减数量
     */
    quantity?: number;
    /**
     * 剩余库存
     */
    remainingStock?: number;
    /**
     * 处理是否成功
     */
    success?: boolean;
    
}


export const exchangeRequest= async (data:ExchangeRequest): Promise<ExchangeResponse> => {
  try { 
    const response = await post('/front/exchange/direct', data);
    if (response.exchangeStatus !== 'SUCCESS') {
      throw new Error(response.failureReason || '兑换失败');
    }
    const { updateUserPoints } = useAuthModel.getState();
    if (response.memberPointsInfo?.currentPoints !== undefined) {
      updateUserPoints(response.memberPointsInfo.currentPoints);
    }
    return response ;
  } catch (error) {
    console.error('发送失败:', error);
    throw error;
  }
};

export const exchangeCartRequest = async (data:ExchangeRequest): Promise<ExchangeResponse> => {
  try {
    const response = await post('/front/exchange/cart', data);
    if (response.exchangeStatus !== 'SUCCESS') {
      throw new Error(response.failureReason || '购物车兑换失败');
    }
    const { updateUserPoints } = useAuthModel.getState();
    if (response.memberPointsInfo?.currentPoints !== undefined) {
      updateUserPoints(response.memberPointsInfo.currentPoints);
    }
    
    return response ;
  } catch (error) {
   
    throw error;
  }
};
