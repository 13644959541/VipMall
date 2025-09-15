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
import { devNull } from "os"


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
            templateId: (product.productType === 1 || product.productType === 2) ? product?.templateId : undefined
          };
          const productData = await getProductDetails(id, params);
          // 合并API返回的数据和路由传递的disabled状态
          const productWithDisabled = {
            ...productData,
            disabled: location.state?.disabled || false
          };
          setProduct(productWithDisabled);
        } catch (error) {
          console.error('获取商品详情失败:', error);
          // 可以在这里添加错误处理，比如显示错误提示
        }
      }
    };

    fetchProductDetails();
  }, [id, location.state]);

  const addToCart = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  const handleAddToCart = () => {
    if (!product) return
    // 检查 rules 字段是否存在且有内容（不为空字符串）
    const hasRules = cartItems.some(item => {
      return item.exclusionText && item.exclusionText.trim() !== "";
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
        isSelected: true,
        templateId: (product.productType === 1 || product.productType === 2) ? product?.couponDetailDataByCountryCode?.templateId  : undefined, //券类型需要传入
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
    const requiredPoints = (product.currentLevelPoints ?? 0) * quantity;
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
        Toast.show({ icon: 'fail', content: t('modal.enterVerificationCode') });
        return;
      }

      if (!product || !user) {
        Toast.show({ icon: 'fail', content: t('modal.requestFailed') });
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
            templateId: (product.productType === 1 || product.productType === 2) ? product?.couponDetailDataByCountryCode?.templateId  : undefined,
            unitPoints: product.currentLevelPoints || 0,
            totalPoints: (product.currentLevelPoints || 0) * quantity,
            productCode:product.productCode || '',
            categoryId:product.categoryId || '',
            categoryType:product.categoryType || 0
          }
        ],
        storeId: user.shopNo || '',
        terminalType: 'PAD'
      };

      // 调用兑换API
      await exchangeRequest(exchangeData);

      // 兑换成功
      if (product?.productType === 0) {
        // 周边礼品显示成功弹窗
        setShowGiftSuccessModal(true);
      } else {
        // 券类商品显示成功提示
        Toast.show({
          content: t('modal.redeemSoon'),
          position: 'center',
          duration: 3000
        });
      }
      
    } catch (error) {
      console.error('兑换失败:', error);
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
    REDEEMED: t('productDetail.itemsRedeemed'),//已换购
    MEMBER_LEVEL: t('productDetail.purchaseRestrictionLevel'), //限购等级
    STOCK: t('productDetail.itemsRemaining'),
  };
  // 创建会员等级映射函数
  const getMemberLevelNames = (levelString: string | undefined): string[] => {
    if (!levelString) return [];

    const levelMap: Record<number, string> = {
      1: t('home.redMember'),
      2: t('home.silverMember'),
      3: t('home.goldMember'),
      4: t('home.premiumMember')
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
        {/* 背景图片 - 填满整个容器 */}
          <div 
            className="absolute inset-0 bg-cover bg-center inset-0 opacity-60 z-10 "
             style={{ 
                backgroundImage: `url(${product.mainImage || '/default.jpg'})`,
                filter: 'blur(5px)'
              }}
          />
          {/* 前景图片 - 保持原有比例居中显示 */}
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
        <div className="flex-1 min-w-0 bg-white mt-1 p-1 rounded-lg space-y-1">
          <div className={styles['name']}>{product.productName}</div>
          <div className="flex items-center w-[102px] h-[30px]">
            <div className="flex items-center mr-2">
              <img
                src="/star.svg"
                className="h-2 w-2 mr-0.5"
                alt="star"
              />
              <div className={`${styles['point']} mr-2`}>{product.currentLevelPoints ?? 0}</div>
              <div className={`${styles['originalPrice']} mr-2`}>¥{product.productValue}</div>
              {/* <div className={`${styles['levelTap']} mr-2`}>{`${product.nextMemberLevel}仅需${product.nextLevelPoints}捞币`} </div> */}

               {/* 修改这里 - 显示会员等级名称 */}
              {(() => {
                const nextLevelInfo = product?.nextMemberLevel !== undefined 
                  ? memberLevels.find(item => item.level === parseInt(product.nextMemberLevel || "1"))
                  : null;
                
                return nextLevelInfo ? (
                  <div className={`${styles['levelTap']} mr-2`}>
                    {`${nextLevelInfo.name}仅需${product.nextLevelPoints}捞币`}
                  </div>
                ) : product?.nextMemberLevel ? (
                  <div className={`${styles['levelTap']} mr-2`}>
                    {`等级${product.nextMemberLevel}仅需${product.nextLevelPoints}捞币`}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
          <div className={`${styles['detail-badge']} flex items-center gap-1`}>
            <div className={styles['font']}>{TEXT.MEMBER_LEVEL}</div>
            {(() => {
              // 解析适用的会员等级
              const applicableLevels = product.membershipLevel?.split(',').map(level => parseInt(level.trim())) || [];
              // 过滤出在memberLevels中存在的等级
              const applicableMemberLevels = memberLevels.filter(item =>
                applicableLevels.includes(item.level)
              );

              return applicableMemberLevels.map((item) => (
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
              ));
            })()}
          </div>
          <div className="flex items-center justify-start space-x-4">
            <div className={styles['font']}>
              {TEXT.REDEEMED} {product.totalExchangeCount}
            </div>
            {product.productType === 0 && product.remainingStock && (
              <div className={styles['font']}>
                {TEXT.STOCK} {product.remainingStock}
              </div>
            )}
          </div>
          <div className={`relative`}>
            <div className="absolute right-0 -top-[50px] flex items-center gap-1">
              <div
                className={`w-[22px] h-[22px] rounded-full ${ !product.disabled ? 'bg-gray-200 text-black cursor-pointer hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} flex items-center justify-center transition-colors select-none active:scale-95 touch-manipulation`}
                onClick={product.disabled ? () => setQuantity(Math.max(1, quantity - 1)) : undefined}
              >
                -
              </div>
              <div className="text-xxxs">{quantity}</div>
              <div
                className={`w-[22px] h-[22px] rounded-full ${!product.disabled  ? 'bg-[#E60012] text-white cursor-pointer hover:bg-[#ff0018]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} flex items-center justify-center transition-colors select-none active:scale-95 touch-manipulation`}
                onClick={product.disabled  ? () => setQuantity(quantity + 1) : undefined}
              >
                +
              </div>
            </div>
          </div>
          <div className={`${styles['font']}`} >{product.availableTime} </div>
          <div className={`${styles['font']} ${styles['rule']}`} >* {product.exclusionText}</div>
          <div className="flex items-end justify-end h-1 gap-1">
            <div
              className={`${styles['cartButton']} ${product.disabled ? styles['disabledButton'] : ''}`}
              //onClick={handleAddToCart}
              onClick={ !product.disabled  ? () => handleAddToCart() : undefined}
            >
              {TEXT.ADD_TO_CART}
            </div>
            <div
              className={`${styles['redeemButton']} ${product.disabled ? styles['disabledButton'] : ''}`}
              onClick={ !product.disabled  ? () => handleRedeem() : undefined}
            >
              {TEXT.REDEEM_NOW}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 p-1 rounded-lg space-y-1">
          <div className={styles['name']} >{TEXT.PRODUCT_INFO}</div>
          <div className={`${styles['font']} ${styles['detail']}`} >{product.productDetail}</div>
        </div>
        <div className="flex-1 min-w-0 bg-white mt-1 p-1 rounded-lg space-y-1">
          <div className={`${styles['name']} mb-1`}>
            {TEXT.REDEMPTION_TITLE}
          </div>
          <div className="space-y-1">
            {product.productType === 1 && (
              <div className="flex space-y-1 flex-col text-xxxs">
                <div className={styles['font']}>{TEXT.REDEMPTION_purchaseRestrictionLevel}</div>
                <div className={styles['value']}>
                  {getMemberLevelNames(product.membershipLevel).map((levelName, index) => (
                    <div key={index}>{levelName}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex space-y-1 flex-col text-xxxs">
              <div className={styles['font']}>{TEXT.REDEMPTION_purchaseRestrictionLevel}</div>
              <div className={styles['value']}>
                {getMemberLevelNames(product.membershipLevel).map((levelName, index) => (
                  <div key={index}>{levelName}</div>
                ))}
              </div>
            </div>
            <div className="flex space-y-1 flex-col text-xxxs">
              <div className={styles['font']}>{TEXT.REDEMPTION_availableStores}</div>
              <div className={styles['value']}>
                {!product.applicableStoresNameList || product.applicableStoresNameList.length === 0 ? (
                  <div>{t('product.all')}</div>
                ) : (
                  product.applicableStoresNameList.map((store, index) => (
                    <div key={index}>{store}</div>
                  ))
                )}
              </div>
            </div>
            <div className="flex space-y-1 flex-col text-xxxs">
              <div className={styles['font']}>{TEXT.REDEMPTION_validityPeriod}</div>
              <div className={styles['value']}>{product.validStartDate}{product.validEndDate}</div>
            </div>
            <div className="flex space-y-1 flex-col text-xxxs">
              <div className={styles['font']}>{TEXT.REDEMPTION_availableTime}</div>
              <div className={styles['value']}>{product.availableTime}</div>
            </div>
            <div className="flex space-y-1 flex-col text-xxxs">
              <div className={styles['font']}>{TEXT.REDEMPTION_coinRedemption}</div>
              <div className={styles['value']}>
                {!product.levelPointsMap ? (
                  <div>{/* 空对象时的显示内容 */}</div>
                ) : (
                  Object.entries(parseLevelPointsMap(product.levelPointsMap as string)).map(([levelKey, points], index) => {
                    // 创建会员等级映射
                    const levelMap: Record<string, string> = {
                      '1': t('home.redMember'),     // 红海会员
                      '2': t('home.silverMember'),  // 银海会员  
                      '3': t('home.goldMember'),    // 金海会员
                      '4': t('home.premiumMember')  // 黑海会员
                    };

                    const levelName = levelMap[levelKey] || `等级${levelKey}`;
                    return <div key={index}>{levelName}: {points}</div>;
                  })
                )}
              </div>
            </div>

            <div className="flex space-y-1 flex-col text-xxxs">
              <div className={styles['font']}>{TEXT.REDEMPTION_transferable}</div>
              <div className={styles['value']}> {product.isTransferable ? 'yes' : 'no'}</div>
            </div>
            <div className="flex space-y-1 flex-col text-xxxs">
              <div className={styles['font']}>{TEXT.REDEMPTION_usageInstructions}</div>
              <div className={styles['value']}>{product.exchangeDescription}</div>
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
        verifyType ="6"
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
              // 不需要验证，直接执行兑换操作（跳过验证码检查）
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
