import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useLocation } from "react-router-dom"
import { Image as AntdImage, Toast, Badge } from "antd-mobile"
import { useCartStore } from "@/store/cart"
import EmailVerificationModal from "@/components/EmailVerificationModal"
import AlertModal from "@/components/AlertModal"
import { useAuthModel } from "@/model/useAuthModel"
import { shouldShowVerification } from "@/utils/bridge"
import styles from './index.module.less'
import { useTranslation } from "react-i18next"
import { ProductDetails, getProductDetails } from "@/services/productService"
import { exchangeRequest } from "@/services/exchangeService"
import i18n from "@/locales"
import { getCurrencySymbol } from "@/utils/currencySymbols"
import { formatNumberWithCommas } from "@/utils"


interface ExtendedProductDetails extends ProductDetails {
  disabled?: boolean;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [product, setProduct] = useState<ExtendedProductDetails | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showGiftSuccessModal, setShowGiftSuccessModal] = useState(false)
  const [alertContent, setAlertContent] = useState({ title: '', message: '' })
  const [alertTriggerType, setAlertTriggerType] = useState<'addToCart' | 'redeem'>('addToCart')
  const { user } = useAuthModel()
  const currentUserLevel = parseInt(user?.localLevel || "1")
  const { t } = useTranslation('common');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (id) {
        const product = location.state?.product;
        try {
          // 构建查询参数
          const params = {
            productType: product?.productType,
            language: i18n.language,
            storeId: user?.shopNo,
            localLevel: user?.localLevel,
            templateId: (product.productType === 1 || product.productType === 2) ? product?.templateId : undefined,
            countryCode: user?.country
          };
          const productData = await getProductDetails(id, params);
          // 合并API返回的数据和路由传递的disabled状态
          const productWithDisabled = {
            ...productData,
            disabled: location.state?.disabled ||
              (productData.remainingStock !== null && productData.remainingStock !== undefined && productData.remainingStock <= 0) ||
              false
          };
          setProduct(productWithDisabled);
        } catch (error) {
          console.error('获取商品详情失败:', error);
          Toast.show({
            content: t('modal.requestFailed'),
            position: 'center',
            duration: 3000
          })
        }
      }
    };

    fetchProductDetails();
  }, [id, location.state]);

  const addToCart = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  const handleAddToCart = () => {
    if (!product || !user || product.disabled) return;
    const isMutuallyExclusiveProduct = product.exclusionText && product.exclusionText.trim() !== "";
    if (isMutuallyExclusiveProduct) {
      const hasRules = cartItems.some(item => {
        return item.exclusionText && item.exclusionText.trim() !== "";
      });
      const userPoints = user.Points || 0;
      const requiredPoints = (product.currentLevelPoints ?? 0) * quantity;
      if (userPoints < requiredPoints) {
        Toast.show({
          content: t('modal.insufficientPoints'),
          position: 'center',
          duration: 3000
        });
        return;
      }

      if (hasRules) {
        setAlertTriggerType('addToCart');
        setAlertContent({
          title: t('productDetail.addToCart'),
          message: t('modal.similarCouponWarning')
        })
        setShowAlertModal(true)
        return
      }
      if (quantity > 1) {
        setAlertTriggerType('addToCart');
        setAlertContent({
          title: t('productDetail.addToCart'),
          message: t('modal.singleCouponWarning')
        })
        setShowAlertModal(true)
        return
      }
    }

    addToCartDirectly()
  }

  const addToCartDirectly = () => {
    try {
      if (!product) return
      const cartItem = {
        categoryType: product.categoryType || 0,
        categoryId: product.categoryId || "",
        productId: product.productId,
        productName: product.productName,
        productImage: product.mainImage || "",
        productPrice: product.productValue || 0,
        unitPoints: product.currentLevelPoints || 0,
        productCode: product.productDetail || "",
        exclusionText: product.exclusionText || "",
        applicableStores: product.applicableStoresNameList || [],
        productType: product.productType || 0,
        quantity: quantity,
        isSelected: false,
        templateId: (product.productType === 1 || product.productType === 2) ? product?.couponDetailDataByCountryCode?.templateId : undefined, 
        remainingStock: product.remainingStock || undefined, 
        isInExchangeTime: product.isInExchangeTime,
        totalExchangeCount: product.totalExchangeCount, 
      };
      addToCart(cartItem, true); //加入购物车
      Toast.show({
        duration: 3000,
        content: t('modal.addedToCart'),
        position: 'center',
      })
    } catch (error) {
      console.error('Failed to add to cart:', error);
      Toast.show({
        content: t('modal.requestFailed'),
        position: 'center',
        duration: 3000
      })
    }
  }

  const handleRedeem = () => {
    if (!product || !user || product.disabled) return;

    // 检查用户积分是否足够
    const userPoints = user.Points || 0;
    const requiredPoints = (product.currentLevelPoints ?? 0) * quantity;
    // 积分不足，显示提示
    if (userPoints < requiredPoints) {
      Toast.show({
        content: t('modal.insufficientPoints'),
        position: 'center',
        duration: 3000
      });
      return;
    }
    //检查 rules 字段是否存在且有内容（不为空字符串）
    const hasRules = product.exclusionText && product.exclusionText.trim() !== "";
    if (hasRules && quantity > 1) {
      setAlertTriggerType('redeem');
      setAlertContent({
        title: t('modal.confirmRedemption'),
        message: t('modal.singleCouponWarning')
      })

      setShowAlertModal(true)
      return
    } else {
      setAlertTriggerType('redeem');
      setAlertContent({
        title: t('modal.confirmRedemption'),
        message: getRedeemMessage(product.productType)
      })

      setShowAlertModal(true)
    }
  }
  const getRedeemMessage = (type: number) => {
    const messageMap = {
      1: t('modal.confirmVoucher'),
      2: t('modal.confirmDishCoupon'),
      0: t('modal.confirmMerchandise')
    };
    return messageMap[type as keyof typeof messageMap] || t('modal.confirmRedemption');
  };

  const exchange = async (email: string, code: string, skipCodeCheck = false) => {
    try {
      if (!skipCodeCheck && (!code || !code.trim())) {
        Toast.show({ content: t('modal.enterVerificationCode') });
        return;
      }

      if (!product || !user) {
        Toast.show({ content: t('modal.requestFailed') });
        return;
      }

      // 构建兑换请求参数
      const exchangeData = {
        countryCode: user.country || 'CN',
        exchangeType: 'DIRECT',
        memberId: user.customerKey || '',
        productItems: [
          {
            memberId: user.customerKey || '',
            productId: product.productId,
            productName: product.productName,
            productType: product.productType?.toString() || '0',
            quantity: quantity,
            storeId: user.shopNo || '',
            templateId: (product.productType === 1 || product.productType === 2) ? product?.couponDetailDataByCountryCode?.templateId : undefined,
            unitPoints: product.currentLevelPoints || 0,
            totalPoints: (product.currentLevelPoints || 0) * quantity,
            productCode: product.productCode || '',
            categoryId: product.categoryId || '',
            categoryType: product.categoryType || 0
          }
        ],
        storeId: user.shopNo || '',
        terminalType: 'PAD'
      };

      await exchangeRequest(exchangeData);

      // 兑换成功后重新获取商品数据
      const refreshParams = {
        productType: product?.productType,
        language: i18n.language,
        storeId: user?.shopNo,
        localLevel: user?.localLevel,
        templateId: (product.productType === 1 || product.productType === 2) ? product?.couponDetailDataByCountryCode?.templateId : undefined,
        countryCode: user?.country
      };

      const productData = await getProductDetails(id!, refreshParams);
      const productWithDisabled = {
        ...productData,
        disabled: location.state?.disabled ||
          (productData.remainingStock !== null && productData.remainingStock !== undefined && productData.remainingStock <= 0) ||
          false
      };
      setProduct(productWithDisabled);
      // 兑换成功
      if (product?.productType === 0) {
        setShowGiftSuccessModal(true);
      } else {
        Toast.show({
          content: t('modal.redeemSoon'),
          position: 'center',
          duration: 3000
        });
      }

    } catch (error: any) {
      console.error('兑换失败:', error);
      if (error.message.includes('库存')) {
        Toast.show({
          content: t('cart.outOfStock'),
          position: 'center',
          duration: 3000
        });
      }
      else {
        Toast.show({
          content: t('modal.requestFailed'),
          position: 'center',
          duration: 3000
        });
      }
    }
  }
  const memberLevels = [
    { level: 1, name: t('productDetail.redMemberPoints'), color: "#E60012" },
    { level: 2, name: t('productDetail.silverMemberPoints'), color: "#9B9B9E" },
    { level: 3, name: t('productDetail.goldMemberPoints'), color: "#D3A24E" },
    { level: 4, name: t('productDetail.premiumMemberPoints'), color: "#101820" }
  ]
  const levelMaps = [
    { level: 1, name: t('home.redMember'), color: "#E60012" },
    { level: 2, name: t('home.silverMember'), color: "#9B9B9E" },
    { level: 3, name: t('home.goldMember'), color: "#D3A24E" },
    { level: 4, name: t('home.premiumMember'), color: "#101820" }
  ]
  const contentRef = useRef<HTMLDivElement>(null)
  const [quantity, setQuantity] = useState(1)
  // 只在有库存时检查是否达到最大数量
  const hasStockLimit = product?.remainingStock !== null && (product?.remainingStock || 0) > 0;
  const isMaxQuantity = hasStockLimit ? quantity >= (product?.remainingStock || 0) : false;

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
    REDEMPTION_coinRedemption: t('productDetail.coinRedemption'),//積分兑换
    REDEMPTION_transferable: t('productDetail.transferable'),//是否可转赠
    REDEMPTION_usageInstructions: t('productDetail.usageInstructions'),//使用说明
    REDEEMED: t('productDetail.itemsRedeemed'),//已换购
    MEMBER_LEVEL: t('productDetail.purchaseRestrictionLevel'), //限购等级
    STOCK: t('productDetail.itemsRemaining'), //剩余库存
  };
  // 创建会员等级映射函数
  const getMemberLevelNames = (levelString: string | undefined): string[] => {
    if (!levelString) return [];

    const levelMap: Record<number, string> = {
      '1': t('home.redMember'),
      '2': t('home.silverMember'),
      '3': t('home.goldMember'),
      '4': t('home.premiumMember')
    };
    return levelString
      .split(',')
      .map(level => levelMap[parseInt(level.trim())] || '')
      .filter(Boolean);
  };

  // 解析 levelPointsMap 字符串
  const parseLevelPointsMap = (levelPointsString: string | undefined): Record<string, number> => {
    if (!levelPointsString) return {};

    return levelPointsString.split(',').reduce((result, item) => {
      const [level, points] = item.split(':');
      if (level && points) {
        result[level.trim()] = parseInt(points.trim(), 10);
      }
      return result;
    }, {} as Record<string, number>);
  };

  // 格式化兑换时间显示
  const formatExchangeTime = (startTime: string, endTime: string) => {
    const format = (dateString: string) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };
    return `${format(startTime)} - ${format(endTime)}`;
  };

  // 获取时间状态
  const isNotYetAvailable = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    // 未到开始时间 或 已经超过结束时间，都算不可兑换
    return now < start || now > end;
  };

  // 格式化可用时间显示（提取最多的周几 + 合并时间段）
  const formatAvailableTime = (availableTimeArray: any[]) => {
    if (!availableTimeArray || !Array.isArray(availableTimeArray)) return '';

    // 统计所有values的出现次数，找出最多的
    const valueCounts: Record<string, number> = {};
    availableTimeArray.forEach(item => {
      if (item?.values) {
        const valuesKey = item.values.split(',').sort().join(',');
        valueCounts[valuesKey] = (valueCounts[valuesKey] || 0) + 1;
      }
    });

    // 找出出现次数最多的values
    let mostCommonValues = '';
    let maxCount = 0;
    Object.entries(valueCounts).forEach(([valuesKey, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonValues = valuesKey;
      }
    });

    // 格式化周几显示
    let weekDisplay = '';
    if (mostCommonValues) {
      const dayNumbers = mostCommonValues.split(',').map((dayStr: string) => Number(dayStr.trim()));

      // 检查是否包含所有1-7的数字
      const allDays = [1, 2, 3, 4, 5, 6, 7];
      const hasAllDays = allDays.every(day => dayNumbers.includes(day));

      if (hasAllDays) {
        weekDisplay = t('product.all'); // 返回"全部"
      } else {
        // 原有逻辑
        const dayNames = dayNumbers.map((dayNum: number) => {
          const dayMap: Record<number, string> = {
            1: t('supplementary.monday'),
            2: t('supplementary.tuesday'),
            3: t('supplementary.wednesday'),
            4: t('supplementary.thursday'),
            5: t('supplementary.friday'),
            6: t('supplementary.saturday'),
            7: t('supplementary.sunday')
          };
          return dayMap[dayNum] || '';
        }).filter(Boolean);

        weekDisplay = dayNames.join(' ');
      }
    }

    // 提取所有的时间段
    const timeDisplays = availableTimeArray.map(item => {
      if (!item || typeof item !== 'object') return '';

      const { startTime, endTime, selectTrue } = item;

      // 处理时间显示 - 如果是次日时间，添加"次日"前缀
      return selectTrue === true
        ? `${startTime}-${endTime}(${t('supplementary.tomorrow')})`
        : `${startTime}-${endTime}`;
    }).filter(Boolean);

    // 合并显示：周几 + 所有时间段
    return weekDisplay ? `${weekDisplay}<br />${timeDisplays.join(' ')}` : timeDisplays.join(' ');
  };

  if (!product) {
    return null;
  }

  // 获取货币符号
  const currencySymbol = getCurrencySymbol(user?.country || 'CN');

  return (
    <div className="h-screen overflow-y-auto">
      <div
        ref={contentRef}
        className="bg-[#F4F4F5] px-1 relative min-h-[calc(100vh+1px)] pt-1 pb-8 "
      >
        <div className="relative bg-white rounded-[16px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center inset-0 opacity-60 z-10 "
            style={{
              backgroundImage: `url(${product.mainImage || '/default.jpg'})`,
              filter: 'blur(5px)'
            }}
          />
          <div className="relative z-20 flex items-center justify-center h-full">
            <AntdImage
              src={product.mainImage || '/default.jpg'}
              alt={product.productName}
              width="auto"
              height={250}
              fit="contain"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 py-2 px-1 rounded-[16px] space-y-1">
          <div className={`${styles['name']} w-[880px]`}>{product.productName}</div>
          <div className="flex items-center w-[102px] h-[30px]">
            <div className="flex items-center">
              <img
                src="/star.svg"
                className="h-[26px] w-[26px] mr-0.5"
                alt="star"
              />
              <div className={`${styles['point']} mr-1`}>{formatNumberWithCommas(product.currentLevelPoints ?? 0)}</div>
              {product.productValue !== 0 && (
                <div className={`${styles['originalPrice']} mr-3`}>{currencySymbol}{product.productValue}</div>
              )}
              {(() => {
                const nextLevelInfo = (product?.nextMemberLevel && product.nextLevelPoints !== null)
                  ? memberLevels.find(item => item.level === parseInt(product.nextMemberLevel || ""))
                  : null;

                const membershipLevels = product.membershipLevel?.split(',').map(Number) || [];
                const uniqueLevels = new Set(membershipLevels);
                const hasMultipleLevels = uniqueLevels.size > 1;
                const shouldShowNextLevelInfo = nextLevelInfo &&
                  product.nextLevelPoints !== product.currentLevelPoints && 
                  product.membershipLevel?.includes(currentUserLevel.toString()) && 
                  hasMultipleLevels; 
                return shouldShowNextLevelInfo ? (
                  <div className={`${styles['levelTap']}`}>
                    {`${nextLevelInfo.name} ${product.nextLevelPoints} `}{t('product.points')}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
          <div className={`${styles['detail-badge']} flex items-center gap-1`}>
            <div className={styles['font']}>{TEXT.MEMBER_LEVEL}:</div>
            {(() => {
              const applicableLevels = product.membershipLevel?.split(',').map(level => parseInt(level.trim())) || [];
              const applicableMemberLevels = levelMaps.filter(item =>
                applicableLevels.includes(item.level)
              );

              return applicableMemberLevels.map((item) => (
                <Badge
                  key={`member-level-${item.level}`}
                  content={item.name}
                  className={`${styles['adaptive-badge']}`}
                  color={
                    item.level === 1 ? '#E60012' :
                      item.level === 2 ? '#9B9B9E' :
                        item.level === 3 ? '#D3A24E' :
                          '#101820'
                  }
                />
              ));
            })()}
          </div>
          <div className="flex items-center justify-start space-x-4">
            {product.totalExchangeCount !== null && (
              <div className={styles['font']}>
                {TEXT.REDEEMED}&nbsp;{product.totalExchangeCount}&nbsp;
                {product.totalExchangeCount || 0 <= 1
                  ? t('productDetail.countType')
                  : t('productDetail.countsType')
                }
              </div>
            )}
            {product.remainingStock !== null && (
              <div className={styles.font}>
                {TEXT.STOCK}&nbsp;{product.remainingStock}&nbsp;
                {product.remainingStock || 0 <= 1
                  ? t('productDetail.countType')
                  : t('productDetail.countsType')
                }
              </div>
            )}
          </div>
          <div className={`relative`}>
            <div className="absolute right-0 -top-[50px] flex items-center gap-1">
              <div
                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors select-none active:scale-95 touch-manipulation ${
                  !product.disabled && quantity > 1
                    ? 'bg-[#E60012] text-white cursor-pointer hover:bg-[#ff0018]'
                    : !product.disabled && quantity === 1
                    ? 'bg-gray-200 text-black cursor-pointer hover:bg-gray-300'
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
                onClick={!product.disabled && quantity > 1 ? () => setQuantity(Math.max(1, quantity - 1)) : undefined}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13"
                    stroke={
                      !product.disabled && quantity > 1 
                        ? "#FFFFFF"
                        : !product.disabled && quantity === 1
                        ? "#101820"
                        : "#6F6F72"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className={`${styles.quantityDisplay} ${product.disabled ? 'opacity-50' : ''}`}>
                {quantity}
              </div>
              <div
                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors select-none active:scale-95 touch-manipulation ${!product.disabled && !isMaxQuantity
                  ? 'bg-[#E60012] text-white cursor-pointer hover:bg-[#ff0018]'
                  : 'bg-[#E60012] opacity-50 cursor-not-allowed'
                  }`}
                onClick={!product.disabled && !isMaxQuantity ? () => setQuantity(quantity + 1) : undefined}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3V13M3 8H13"
                    stroke={product.disabled || isMaxQuantity ? "#FFFFFF" : "#FFFFFF"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          {product.exchangeStartTime && product.exchangeEndTime && (
            <div className={`${styles['font']} ${isNotYetAvailable(product.exchangeStartTime, product.exchangeEndTime)
              ? 'text-[#E60012]'
              : ''
              }`}>
              [{t('productDetail.redeemableTime')}] {formatExchangeTime(product.exchangeStartTime, product.exchangeEndTime)}
            </div>
          )}
          {product.exclusionText && (
            <div className={`${styles['font']} ${styles['rule']}`} >* {product.exclusionText}</div>
          )}
          <div className="flex items-end justify-end h-1 gap-1 min-h-[50px]">
            <div
              className={`${styles['cartButton']} ${product.disabled ? styles['disabledButton'] : ''}`}
              onClick={!product.disabled ? () => handleAddToCart() : undefined}
            >
              {TEXT.ADD_TO_CART}
            </div>
            <div
              className={`${styles['redeemButton']} ${product.disabled ? styles['disabledButton'] : ''}`}
              onClick={!product.disabled ? () => handleRedeem() : undefined}
            >
              {TEXT.REDEEM_NOW}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 py-2 px-1 rounded-[16px] space-y-1">
          <div className={styles['name']} >{TEXT.PRODUCT_INFO}</div>
          <div className={`${styles['font']} ${styles['detail']}`} >{product.productDetail}</div>
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 py-2 px-1 rounded-[16px] space-y-1">
          <div className={`${styles['name']} mb-[30px]`}>
            {TEXT.REDEMPTION_TITLE}
          </div>
          <div>
            {product.couponDetailDataByCountryCode && (
              <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
                <div className={styles['font']}>{TEXT.REDEMPTION_couponType}</div>
                <div className={styles['value']}>{product.couponDetailDataByCountryCode.couponTypeName}({product.couponDetailDataByCountryCode.couponNote})</div>
              </div>
            )}
            {product.membershipLevel !== null && (
              <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
                <div className={styles['font']}>{TEXT.REDEMPTION_purchaseRestrictionLevel} :</div>
                <div className={styles['value']}>
                  {getMemberLevelNames(product.membershipLevel).map((levelName, index) => (
                    <div key={index}>{levelName}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
              <div className={styles['font']}>{TEXT.REDEMPTION_availableStores}</div>
              <div className={styles['value']}>
                {!product.applicableStoresNameList || product.applicableStoresNameList.length === 0 ? (
                  <div>{t('supplementary.allStores')}</div>
                ) : (
                  product.applicableStoresNameList.map((store, index) => (
                    <div key={index}>{store}</div>
                  ))
                )}
              </div>
            </div>
            {product.couponDetailDataByCountryCode && (
              <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
                <div className={styles['font']}>{TEXT.REDEMPTION_validityPeriod}</div>
                <div className={styles['value']}>{product.couponDetailDataByCountryCode.timeStrName}</div>
              </div>
            )}
            {product.availableTime && (
              <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
                <div className={styles['font']}>{TEXT.REDEMPTION_availableTime}</div>
                <div
                  className={styles['value']}
                  dangerouslySetInnerHTML={{ __html: formatAvailableTime(product.availableTime) }}
                />
              </div>
            )}

            <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
              <div className={styles['font']}>{TEXT.REDEMPTION_coinRedemption}</div>
              <div className={styles['value']}>
                {!product.levelPointsMap ? (
                  null
                ) : (
                  Object.entries(parseLevelPointsMap(product.levelPointsMap as string)).map(([levelKey, points], index) => {
                    const levelMap: Record<string, string> = {
                            '1': t('home.redMember'),
                            '2': t('home.silverMember'),
                            '3': t('home.goldMember'),
                            '4': t('home.premiumMember')
                    };
                    const levelName = levelMap[levelKey] || `${levelKey}`;
                    return <div key={index}>{levelName}: {points}</div>;
                  })
                )}
              </div>
            </div>
            {product.productType !== 0 && (
              <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
                <div className={styles['font']}>{TEXT.REDEMPTION_transferable}</div>
                <div className={styles['value']}> {product.isTransferable ? t('supplementary.transferable') : t('supplementary.noTransferable')}</div>
              </div>
            )}
            <div className="flex space-y-1 flex-col text-xxxs mb-[30px]">
              <div className={styles['font']}>{TEXT.REDEMPTION_usageInstructions}</div>
              <div
                className={styles['value']}
                dangerouslySetInnerHTML={{ 
                  __html: product.productType === 0 
                    ? product.exchangeDescription || '' 
                    : product.couponDetailDataByCountryCode?.useInstruction || '' 
                }}
              />
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
        verifyType="6"
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
            // 检查是否需要验证
            if (user && shouldShowVerification(user.loginStyle, user.verifyType, 'exchange')) {
              setShowEmailModal(true)
            } else {
              exchange('', '', true)
            }
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
        title={t('modal.redemptionSuccessful')}
        message={t('modal.contactStaff')}
        confirmText={t('modal.gotIt')}
        showConfirmButton={false}
      />
    </div>
  );
}

export default ProductDetail;
