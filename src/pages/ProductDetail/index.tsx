import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useLocation } from "react-router-dom"
import { Image as AntdImage, Toast, Badge } from "antd-mobile"
import { useCartStore } from "@/store/cart"
import EmailVerificationModal from "@/components/EmailVerificationModal"
import AlertModal from "@/components/AlertModal"
import { useAuthModel } from "@/model/useAuthModel"
import styles from './index.module.less'
import { useTranslation } from "react-i18next"

interface ProductDetailProps {
  id?: string
}

interface ProductInfo {
  id: number
  name: string
  description: string
  imgUrl: string
  points: number
  originalPrice: number
  sales: number
  stock: number
  storeId?: number
  level: number
  nextLevel: string
  nextPoints: number
  rules?: string
  availableTime: string
  type: "coupon" | "meal" | "gift"
  details: string
  features: string[]
  usage: string
  exchangeDesc?: {
    validStore: string,
    validTime: string
  }
  disabled?: boolean
  isAvailable?: boolean
  memberLevel?: string
  remainingStock?: number
}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showGiftSuccessModal, setShowGiftSuccessModal] = useState(false)
  const [alertContent, setAlertContent] = useState({ title: '', message: '' })
  const [alertTriggerType, setAlertTriggerType] = useState<'addToCart' | 'redeem'>('addToCart')
  const { user } = useAuthModel()
  const currentUserLevel = parseInt(user?.localLevel || "1")
  const { t } = useTranslation('common');

  useEffect(() => {
    // 优先使用从路由状态传递过来的product对象
    if (location.state?.product) {
      const passedProduct = location.state.product;
      
      // 计算禁用状态
      const isAvailable = passedProduct.isAvailable !== false;
      const memberLevel = parseInt(passedProduct.memberLevel || "1");
      const remainingStock = passedProduct.remainingStock;
      
      // 根据商品类型计算禁用状态
      let disabled = false;
      if (!isAvailable) {
        disabled = true;
      } else if (currentUserLevel < memberLevel) {
        disabled = true;
      } else if (passedProduct.type === "gift" && remainingStock !== undefined && remainingStock === 0) {
        disabled = true;
      }

      // 将传递的product转换为ProductInfo类型
      const productInfo: ProductInfo = {
        id: Number(passedProduct.id) || Number(id) || 1,
        name: passedProduct.name || "海底捞火锅代金券",
        description: passedProduct.description || "全国门店通用，节假日可用",
        imgUrl: passedProduct.image || "/hot-pot-banner.png",
        points: passedProduct.points || 5000,
        originalPrice: passedProduct.originalPrice || 100,
        sales: passedProduct.sales || 1234,
        stock: passedProduct.remainingStock || 99,
        level: passedProduct.level || 3,
        nextLevel: "银海会员",
        nextPoints: 1500,
        availableTime: passedProduct.availableTime || "周一至周五 11:00-22:00",
        rules: passedProduct.conflictRule || "不可与xx折扣同时使用",
        type: passedProduct.type as "coupon" | "meal" | "gift",
        details: "海底捞火锅代金券，全国门店通用，享受正宗川渝火锅美味。本券面值100元，可在海底捞任意门店使用，节假日不加价。",
        features: ["全国门店通用", "节假日可用", "不限消费金额", "有效期12个月"],
        usage: "1. 到店出示兑换码即可使用\n2. 不可找零，不可转让\n3. 请在有效期内使用\n4. 如有疑问请联系客服",
        exchangeDesc: {
          "validStore": "全国门店",
          "validTime": "2025-09-01至2026-08-01"
        },
        disabled,
        isAvailable: passedProduct.isAvailable,
        memberLevel: passedProduct.memberLevel,
        remainingStock: passedProduct.remainingStock
      }
      setProduct(productInfo);
    } else {
      // 如果没有传递product，使用mock数据
      const mockProduct: ProductInfo = {
        id: Number(id) || 1,
        name: "海底捞火锅代金券",
        description: "全国门店通用，节假日可用",
        imgUrl: "/hot-pot-banner.png",
        points: 5000,
        originalPrice: 100,
        sales: 1234,
        stock: 99,
        level: 3,
        nextLevel: "银海会员",
        nextPoints: 1500,
        availableTime: "周一至周五 11:00-22:00",
        rules: "不可与xx折扣同时使用",
        type: "gift",
        details: "海底捞火锅代金券，全国门店通用，享受正宗川渝火锅美味。本券面值100元，可在海底捞任意门店使用，节假日不加价。",
        features: ["全国门店通用", "节假日可用", "不限消费金额", "有效期12个月"],
        usage: "1. 到店出示兑换码即可使用\n2. 不可找零，不可转让\n3. 请在有效期内使用\n4. 如有疑问请联系客服",
        exchangeDesc: {
          "validStore": "全国门店",
          "validTime": "2025-09-01至2026-08-01"
        },
        isAvailable: true,
        memberLevel: "1"
      }
      setProduct(mockProduct)
    }
  }, [id, location.state, currentUserLevel])

  const addToCart = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  const handleAddToCart = () => {
    if (!product || product.disabled) return
    // 检查 rules 字段是否存在且有内容（不为空字符串）
    const hasRules = cartItems.some(item => {
      return item.rules && item.rules.trim() !== "";
    });
    if (hasRules) {
      setAlertTriggerType('addToCart');
      setAlertContent({
        title: t('productDetail.addToCart'),
        message: t('modal.similarCouponWarning')
      })
      setShowAlertModal(true)
      return
    }

    // Condition 2: Adding multiple items (quantity > 1)
    if (quantity > 1) {
      setAlertTriggerType('addToCart');
      setAlertContent({
        title: t('productDetail.addToCart'),
        message: t('modal.singleCouponWarning')
      })
      setShowAlertModal(true)
      return
    }

    // If no conditions met, add to cart directly
    addToCartDirectly()
  }

  const addToCartDirectly = () => {
    try {
      if (!product) return
      const cartItem = {
        productId: product.id,
        name: product.name,
        imgUrl: product.imgUrl,
        price: product.originalPrice,
        points: product.points,
        details: product.details,
        rules: product.rules || "",
        availableTime: product.availableTime || "",
        type: product.type,
        quantity: quantity,
        selected: true
      };
      console.log('Adding to cart:', cartItem);
      addToCart(cartItem, true); // 第二次添加时跳过冲突检查
      Toast.show({
        duration: 3000,
        icon: 'success',
        content: t('modal.addedToCart'),
        position: 'center',
      })
    } catch (error) {
      console.error('Failed to add to cart:', error);
      Toast.show({
        icon: 'fail',
        content: t('modal.requestFailed'),
        position: 'center',
        duration: 3000
      })
    }
  }

  const handleRedeem = () => {
    if (!product || !user || product.disabled) return;

    // 检查用户积分是否足够
    const userPoints = user.points || 0;
    const requiredPoints = product.points * quantity;
    // 积分不足，显示提示
    if (userPoints < requiredPoints) {
      Toast.show({
        icon: 'fail',
        content: t('modal.insufficientPoints'), 
        position: 'center',
        duration: 3000
      });
      return;
    }
    //检查 rules 字段是否存在且有内容（不为空字符串）
    const hasRules = product.rules && product.rules.trim() !== "";
    if (hasRules && quantity > 1) {
      setAlertTriggerType('redeem');
      setAlertContent({
        title: t('modal.confirmRedemption'),
        message: t('modal.singleCouponWarning')
      })
       
      setShowAlertModal(true)
      return
    }else{
      setAlertTriggerType('redeem');
      setAlertContent({
        title: t('modal.confirmRedemption'),
        message: getRedeemMessage(product.type)
      })
      
      setShowAlertModal(true)
    }
  }
  const getRedeemMessage = (type: string) => {
    const messageMap = {
      coupon: t('modal.confirmVoucher'),
      meal: t('modal.confirmDishCoupon'), 
      gift: t('modal.confirmMerchandise')
    };
    return messageMap[type as keyof typeof messageMap] || t('modal.confirmRedemption');
  };

  const exchange = async (email: string, code: string) => {
    try {
      // 验证输入
      // if (!email || !email.trim()) {
      //   Toast.show({ icon: 'fail', content: '请输入邮箱地址' });
      //   return;
      // }
      
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // if (!emailRegex.test(email)) {
      //   Toast.show({ icon: 'fail', content: '请输入有效的邮箱地址' });
      //   return;
      // }
      
      if (!code || !code.trim()) {
        Toast.show({ icon: 'fail', content: t('modal.enterVerificationCode') });
        return;
      }

      // 模拟 API 请求 - 这里应该替换为实际的 API 调用
      // 例如: const response = await api.post('/exchange', { email, code, productId: product?.id, quantity });
      
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功响应
      const success = Math.random() > 0.3; // 70% 成功率用于演示
      
      if (success) {
        if (product?.type === "gift") {
          // Show AlertModal for gifts
          setShowGiftSuccessModal(true);
        } else {
          // Show Toast for coupons and meals
          Toast.show({
            content: t('modal.redeemSoon'),
            position: 'center',
            duration: 3000
          });
        }
      } else {
        throw new Error(t('modal.requestFailed'));
      }
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: t('modal.requestFailed'),
        position: 'center',
        duration: 3000
      });
    }
  }
  const memberLevels = [
    { level: 1, name: t('home.redMember'), color: "#E60012" },
    { level: 2, name: t('home.silverMember'), color: "#9B9B9E" },
    { level: 3, name: t('home.goldMember'), color: "#D3A24E" },
    { level: 4, name: t('home.premiumMember'), color: "#101820" }
  ]

  const contentRef = useRef<HTMLDivElement>(null)
  const [quantity, setQuantity] = useState(1)

  // 计算数量按钮的禁用状态
  const canDecrease = quantity > 1 && !product?.disabled;
  const canIncrease = product && !product.disabled && quantity < (product.stock || 1);
  const TEXT = {
    ADD_TO_CART: t('productDetail.addToCart'),
    REDEEM_NOW: t('productDetail.redeemNow'),
    PRODUCT_INFO: t('productDetail.productDetails'),
    REDEMPTION_TITLE: t('productDetail.redemptionInstructions'),//兑换说明
    REDEMPTION_couponType: t('productDetail.couponType'),//票券类型
    REDEMPTION_purchaseRestrictionLevel: t('productDetail.purchaseRestrictionLevel'),//限购等级
    REDEMPTION_availableStores: t('productDetail.availableStores'),//可用门店
    REDEMPTION_validityPeriod: t('productDetail.validityPeriod'),//有效日期
    REDEMPTION_availableTime: t('productDetail.availableTime'),//可用日期
    REDEMPTION_coinRedemption: t('productDetail.coinRedemption'),//捞币兑换
    REDEMPTION_transferable: t('productDetail.transferable'),//是否可转赠
    REDEMPTION_usageInstructions: t('productDetail.usageInstructions'),//使用说明
  
    MEMBER_LEVEL: "限购等级",
    STOCK: "剩余库存",
    REDEEMED: "已换购",
    REMAINING: "剩余",
    VALID_DATE: "有效日期",
    AVAILABLE_TIME: "可用时间",
    POINTS_REDEEM: "捞币兑换",
    TRANSFERABLE: "是否可转赠",
    USAGE_GUIDE: "使用说明",
    NOT_READY_TO_REDEEM: "未到兑换时间 2025年10月30日起兑",
    RULE: "一桌只可使用一次",
    TICKET_TYPE: "票券类型",
    MIN_AMOUNT: "满100可用",
    PURCHASE_LIMIT: "限购等级",
    MEMBER_LEVELS: "红海 银海 金海 黑海",
    AVAILABLE_STORES: "可用门店",
    ALL_STORES: "全部",
    WEEKDAYS: "周一到周五",
    REDEEM_RATES: "红海会员:2000 银海会员:1500 金海会员:1000 黑海会员:500",
    NON_TRANSFERABLE: "不可转赠(仅限本人使用)",
    REDEEM_INSTRUCTION: "兑换成功后，请在有效期内使用",
    EXPIRATION_DATE: "2023-12-31 23:59:59"
  };

  if (!product) {
    return null;
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div
        ref={contentRef}
        className="bg-gray-50 px-1 relative min-h-[calc(100vh+1px)] pt-1 pb-8 "
      >
        <div className="relative bg-white rounded-lg overflow-hidden">
          <AntdImage src={product.imgUrl} alt={product.name} width="100%" height={250} fit="cover" />
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 p-1 rounded-lg space-y-1">
          <div className={styles['name']}>{product.name}</div>
          <div className="flex items-center w-[102px] h-[30px]">
            <div className="flex items-center mr-2">
              <img
                src="/star.svg"
                className="h-2 w-2 mr-0.5"
                alt="star"
              />
              <div className={`${styles['point']} mr-2`}>{product.points}</div>
              <div className={`${styles['originalPrice']} mr-2`}>¥{product.originalPrice}</div>
              <div className={`${styles['levelTap']} mr-2`}>{`${product.nextLevel}仅需${product.nextPoints}捞币`} </div>
            </div>
          </div>
          <div className={`${styles['detail-badge']} flex items-center gap-1`}>
            <div className={styles['font']}>{TEXT.MEMBER_LEVEL}</div>
            {memberLevels.map((item) => (
              <Badge
                key={`member-level-${item.level}`}
                content={item.name}
                color={
                  item.level === 1 ? '#E60012' : // 红色
                    item.level === 2 ? '#d9d9d9' : // 银色
                      item.level === 3 ? '#faad14' : // 金色
                        '#000000' // 黑色
                }
              />
            ))}
          </div>
          <div className="flex items-center justify-start space-x-4">
            <div className={styles['font']}>
              {TEXT.REDEEMED} {product.sales}
            </div>
            {product.type === "gift" && product.stock && (
              <div className={styles['font']}>
                {TEXT.STOCK} {product.stock}件
              </div>
            )}
          </div>
          <div className={`relative`}>
            <div className="absolute right-0 -top-[50px] flex items-center gap-1">
              <div
                className={`w-[22px] h-[22px] rounded-full ${canDecrease ? 'bg-gray-200 text-black cursor-pointer hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} flex items-center justify-center transition-colors select-none active:scale-95 touch-manipulation`}
                onClick={canDecrease ? () => setQuantity(Math.max(1, quantity - 1)) : undefined}
              >
                -
              </div>
              <div className="text-xxxs">{quantity}</div>
              <div
                className={`w-[22px] h-[22px] rounded-full ${canIncrease ? 'bg-[#E60012] text-white cursor-pointer hover:bg-[#ff0018]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} flex items-center justify-center transition-colors select-none active:scale-95 touch-manipulation`}
                onClick={canIncrease ? () => setQuantity(quantity + 1) : undefined}
              >
                +
              </div>
            </div>
          </div>
          <div className={`${styles['font']}`} >{product.availableTime} </div>
          <div className={`${styles['font']} ${styles['rule']}`} >* {product.rules}</div>
          <div className="flex items-end justify-end h-1 gap-1">
            <div
              className={`${styles['cartButton']} ${product.disabled ? styles['disabledButton'] : ''}`}
              onClick={handleAddToCart}
            >
              {TEXT.ADD_TO_CART}
            </div>
            <div
              className={`${styles['redeemButton']} ${product.disabled ? styles['disabledButton'] : ''}`}
              onClick={handleRedeem}
            >
              {TEXT.REDEEM_NOW}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 p-1 rounded-lg space-y-1">
          <div className={styles['name']} >{TEXT.PRODUCT_INFO}</div>
          <div className={`${styles['font']} ${styles['detail']}`} >{product.details}</div>
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 p-1 rounded-lg space-y-1">
          <div className={`${styles['name']} mb-1`}>
            {TEXT.REDEMPTION_TITLE}
          </div>
          <div className="space-y-1">
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_couponType}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_couponType}</div>
              </div>
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_purchaseRestrictionLevel}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_purchaseRestrictionLevel}</div>
              </div>
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_availableStores}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_availableStores}</div>
              </div>
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_validityPeriod}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_validityPeriod}</div>
              </div>
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_availableTime}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_availableTime}</div>
              </div>
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_coinRedemption}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_coinRedemption}</div>
              </div>
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_transferable}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_transferable}</div>
              </div>
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_usageInstructions}</div>
                <div className={styles['value']}>{TEXT.REDEMPTION_usageInstructions}</div>
              </div>
          </div>
        </div>
      </div>
      <EmailVerificationModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onConfirm={(email, code) => {
          exchange(email, code)
          setShowEmailModal(false)
        }}
        confirmText={t('modal.continueRedemption')}
        cancelText={t('modal.cancel')}
        userInfo={user || { email: undefined, mobile: undefined }}
      />
      <AlertModal
        visible={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onConfirm={() => {
          if (alertTriggerType === 'addToCart') {
            addToCartDirectly()
          } else if (alertTriggerType === 'redeem') {
            setShowEmailModal(true)
          }
          setShowAlertModal(false)
        }}
        title={alertContent.title}
        message={alertContent.message}
        confirmText={t('modal.confirm')}
        cancelText={t('modal.cancel')}
      />
      <AlertModal
        visible={showGiftSuccessModal}
        onClose={() => setShowGiftSuccessModal(false)}
        onConfirm={() => setShowGiftSuccessModal(false)}
        title= {t('modal.redemptionSuccessful')}
        message={t('modal.contactStaff')}
        confirmText={t('modal.gotIt')}
        showConfirmButton={false}
      />
    </div>
  );
}

export default ProductDetail;
