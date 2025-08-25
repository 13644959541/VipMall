import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Image as AntdImage, Toast, Badge } from "antd-mobile"
import { useCartStore } from "@/store/cart"
import EmailVerificationModal from "@/components/EmailVerificationModal"
import AlertModal from "@/components/AlertModal"
import { useAuthModel } from "@/model/useAuthModel"
import styles from './index.module.less'

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
  redeemPeriod: string
  type: "coupon" | "meal" | "gift"
  details: string
  features: string[]
  usage: string
  exchangeDesc?: {
    validStore: string,
    validTime: string
  }
}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showGiftSuccessModal, setShowGiftSuccessModal] = useState(false)
  const [alertContent, setAlertContent] = useState({ title: '', message: '' })
  const [alertTriggerType, setAlertTriggerType] = useState<'addToCart' | 'redeem'>('addToCart')
  const { user } = useAuthModel()


  useEffect(() => {
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
      redeemPeriod: "周一至周五 11:00-22:00",
      rules: "不可与xx折扣同时使用",
      type: "gift",
      details: "海底捞火锅代金券，全国门店通用，享受正宗川渝火锅美味。本券面值100元，可在海底捞任意门店使用，节假日不加价。",
      features: ["全国门店通用", "节假日可用", "不限消费金额", "有效期12个月"],
      usage: "1. 到店出示兑换码即可使用\n2. 不可找零，不可转让\n3. 请在有效期内使用\n4. 如有疑问请联系客服",
      exchangeDesc: {
        "validStore": "全国门店",
        "validTime": "2025-09-01至2026-08-01"
      }
    }
    setProduct(mockProduct)
  }, [id])

  const addToCart = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  const handleAddToCart = () => {
    if (!product) return
    // 检查 rules 字段是否存在且有内容（不为空字符串）
    const hasRules = cartItems.some(item => {
      return item.rules && item.rules.trim() !== "";
    });
    if (hasRules) {
      setAlertTriggerType('addToCart');
      setAlertContent({
        title: '加入购物车',
        message: '购物车已有同类券,该类型券单次消费限用1张,是否继续加购?'
      })
      setShowAlertModal(true)
      return
    }

    // Condition 2: Adding multiple items (quantity > 1)
    if (quantity > 1) {
      setAlertTriggerType('addToCart');
      setAlertContent({
        title: '加入购物车',
        message: '该券单次消费限用1张,是否继续加购?'
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
        redeemPeriod: product.redeemPeriod || "",
        type: product.type,
        quantity: quantity,
        selected: true
      };
      console.log('Adding to cart:', cartItem);
      addToCart(cartItem);
      Toast.show({
        duration: 3000,
        icon: 'success',
        content: '已加入购物车',
        position: 'center',
      })
    } catch (error) {
      console.error('Failed to add to cart:', error);
      Toast.show({
        icon: 'fail',
        content: '请求失败',
        position: 'center',
        duration: 3000
      })
    }
  }

  const handleRedeem = () => {
    if (!product || !user) return;

    // 检查用户积分是否足够
    const userPoints = user.points || 0;
    const requiredPoints = product.points;
    // 积分不足，显示提示
    if (userPoints < requiredPoints) {
      Toast.show({
        icon: 'fail',
        content: '积分不足，请重新选择',
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
        title: '确认兑换',
        message: '该券单次消费限用1张,是否继续加购?'
      })
      setShowAlertModal(true)
      return
    }else{
      setAlertTriggerType('redeem');
      setAlertContent({
        title: '确认兑换',
        message: '您正在兑换 '+ product.type +'，是否确认兑换？'
      })
      setShowAlertModal(true)
    }

  }

  const exchange = async (email: string, code: string) => {
    try {
      // 验证输入
      if (!email || !email.trim()) {
        Toast.show({ icon: 'fail', content: '请输入邮箱地址' });
        return;
      }
      
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Toast.show({ icon: 'fail', content: '请输入有效的邮箱地址' });
        return;
      }
      
      if (!code || !code.trim()) {
        Toast.show({ icon: 'fail', content: '请输入验证码' });
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
            content: '兑换成功，请尽快到店使用',
            position: 'center',
            duration: 3000
          });
        }
      } else {
        throw new Error('兑换失败');
      }
    } catch (error) {
      console.error('兑换失败:', error);
      Toast.show({
        icon: 'fail',
        content: '请求失败',
        position: 'center',
        duration: 3000
      });
    }
  }
  const memberLevels = [
    { level: 1, name: "红海会员", color: "#E60012" },
    { level: 2, name: "银海会员", color: "#9B9B9E" },
    { level: 3, name: "金海会员", color: "#D3A24E" },
    { level: 4, name: "黑海会员", color: "#101820" }
  ]

  const contentRef = useRef<HTMLDivElement>(null)
  const [quantity, setQuantity] = useState(1)
  const TEXT = {
    ADD_TO_CART: "加入购物车",
    REDEEM_NOW: "立即兑换",
    PRODUCT_INFO: "商品详情",
    REDEMPTION_RULES: {
      TITLE: "兑换说明",
      ITEMS: [
        { key: "票券类型", value: "满100可用" },
        { key: "限购等级", value: "红海 银海 金海 黑海" },
        { key: "可用门店", value: "全部" },
        { key: "有效日期", value: "2023-12-31 23:59:59" },
        { key: "可用时间", value: "周一到周五" },
        { key: "捞币兑换", value: "红海会员:2000 银海会员:1500 金海会员:1000 黑海会员:500" },
        { key: "是否可转赠", value: "不可转赠(仅限本人使用)" },
        { key: "使用说明", value: "兑换成功后，请在有效期内使用" }
      ]
    },
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
                className="w-[22px] h-[22px] rounded-full bg-gray-200 text-black text-xxs flex items-center justify-center"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </div>
              <div className="text-xxxs">{quantity}</div>
              <div
                className="w-[22px] h-[22px] rounded-full bg-[#E60012] text-white text-xxs flex items-center justify-center"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </div>
            </div>
          </div>
          <div className={`${styles['font']}`} >{product.redeemPeriod} </div>
          <div className={`${styles['font']} ${styles['rule']}`} >* {product.rules}</div>
          <div className="flex items-end justify-end h-1 gap-1">
            <div
              className={styles['cartButton']}
              onClick={handleAddToCart}
            >
              {TEXT.ADD_TO_CART}
            </div>
            <div
              className={styles['redeemButton']}
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
            {TEXT.REDEMPTION_RULES.TITLE}
          </div>
          <div className="space-y-1">
            {TEXT.REDEMPTION_RULES.ITEMS.map((rule) => {
              const keyStr = rule.key?.toString() || '';
              const valueStr = rule.value?.toString() || '';
              return (
                <div key={`${keyStr}-${valueStr}`} className="flex space-y-1 flex-col text-xxxs">
                  <div className={styles['font']}>{keyStr}</div>
                  <div className={styles['value']}>{valueStr}</div>
                </div>
              );
            })}
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
        confirmText="继续兑换"
        cancelText="取消"
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
        confirmText="确认"
        cancelText="取消"
      />
      <AlertModal
        visible={showGiftSuccessModal}
        onClose={() => setShowGiftSuccessModal(false)}
        onConfirm={() => setShowGiftSuccessModal(false)}
        title="兑换成功"
        message="请联系服务员领取"
        confirmText="知道了"
        showConfirmButton={false}
      />
    </div>
  );
}

export default ProductDetail;
