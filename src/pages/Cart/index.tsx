import React, { useRef, useState, useEffect } from 'react'
import { Image as AntdImage, Toast, Checkbox } from 'antd-mobile'
import { Trash2 } from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import AlertModal from '@/components/AlertModal'
import EmailVerificationModal from '@/components/EmailVerificationModal'
import { useAuthModel } from '@/model/useAuthModel'
import { shouldShowVerification } from '@/utils/bridge'
import styles from './index.module.less'
import detailStyles from '@/pages/ProductDetail/index.module.less';
import { useTranslation } from 'react-i18next'
import { cartAddOrUpdate } from '@/services/cartSerivce'
import { exchangeCartRequest } from '@/services/exchangeService'
import { useNavigate } from 'react-router-dom'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { formatNumberWithCommas } from '@/utils'

const CartPage = () => {
  const swipeRefs = useRef<(HTMLDivElement | null)[]>([])
  const navigate = useNavigate()
  const {
    items,
    removeItem,
    updateQuantity,
    toggleSelect,
    totalItems,
    totalPrice
  } = useCartStore()
  const { user } = useAuthModel()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showGiftSuccessModal, setShowGiftSuccessModal] = useState(false)
  const [alertContent, setAlertContent] = useState({ title: '', message: '' })
  const [hasGiftItems, setHasGiftItems] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(null)
  const [itemToAdd, setItemToAdd] = useState<CartItem & { quantity?: number } | null>(null)
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const { t } = useTranslation('common');
  const currencySymbol = getCurrencySymbol(user?.country || 'CN');

  const handleSwipe = (index: number, dx: number) => {
    const element = swipeRefs.current[index]
    if (element) {
      const translateX = Math.max(-100, dx)
      element.style.transform = `translateX(${translateX}px)`
    }
  }

  const handleSwipeEnd = (index: number) => {
    const element = swipeRefs.current[index]
    if (element) {
      const transform = window.getComputedStyle(element).transform
      const matrix = new DOMMatrix(transform)
      // 滑动超过一半时保持打开状态，否则恢复
      if (matrix.m41 < -50) {
        element.style.transform = 'translateX(-100px)'
      } else {
        element.style.transform = 'translateX(0)'
      }
    }
  }

  const handleCheckout = () => {
    // 购物车为空的情况
    if (items.length === 0) {
      Toast.show(t('redemptionRecord.noItemsRedeemed'));
      return;
    }

    const selectedItems = items.filter(item => item.isSelected);

    // 购物车有商品但没选中的情况
    if (selectedItems.length === 0) {
      Toast.show(t('supplementary.selectProduct'));
      return;
    }

    // 检查购物车中是否有礼品类型的商品并存储状态
    const giftItemsExist = selectedItems.some(item => item.productType === 0)
    setHasGiftItems(giftItemsExist)

    // 显示确认弹窗
    setAlertContent({
      title: t('modal.confirmRedemption'),
      message: t('modal.confirmCartRedemption')
    })
    setShowAlertModal(true)
  }

  const handleConfirmVerification = () => {
    // 关闭AlertModal
    setShowAlertModal(false)

    // 检查是否需要验证
    if (user && shouldShowVerification(user.loginStyle, user.verifyType, 'exchange')) {
      setShowEmailModal(true)
    } else {
      // 不需要验证，直接执行兑换操作（跳过验证码检查）
      exchange('', '', true)
    }
  }

  const exchange = async (email: string, code: string, skipCodeCheck = false) => {
    try {
      if (!skipCodeCheck && (!code || !code.trim())) {
        Toast.show({ content: t('modal.enterVerificationCode') });
        return;
      }

      if (!user) {
        Toast.show({ content: t('modal.requestFailed') });
        return;
      }

      const selectedItems = items.filter(item => item.isSelected);
      if (selectedItems.length === 0) {
        Toast.show(t('redemptionRecord.noItemsRedeemed'));
        return;
      }

      // 构建购物车兑换请求参数
      const exchangeData = {
        countryCode: user.country || 'CN',
        exchangeType: 'CART',
        memberId: user.customerKey || '',
        productItems: selectedItems.map(item => ({
          memberId: user.customerKey || '',
          productId: item.productId,
          productName: item.productName,
          productType: item.productType?.toString() || '0',
          quantity: item.quantity || 1,
          storeId: user.shopNo || '',
          unitPoints: item.unitPoints || 0,
          totalPoints: (item.unitPoints || 0) * (item.quantity || 1),
          templateId: (item.productType === 1 || item.productType === 2) ? item?.templateId : undefined,
          productCode: item.productCode || '',
          categoryType: item.categoryType || 0,
          categoryId: item.categoryId?.toString() || '0'
        })),
        storeId: user.shopNo || '',
        terminalType: 'PAD'
      };

      // 调用购物车兑换API
      await exchangeCartRequest(exchangeData);

      // 兑换成功
      if (hasGiftItems) {
        // 有礼品商品，显示礼品成功弹窗
        setShowGiftSuccessModal(true);
      } else {
        // 没有礼品商品，显示成功toast
        Toast.show({
          content: t('modal.redeemSoon'),
          position: 'center',
          duration: 3000
        });
      }

      // 清空已兑换的商品
      const selectedItemsToRemove = items.filter(item => item.isSelected);
      selectedItemsToRemove.forEach(item => {
        removeItem(item.productId);
      });

      setShowEmailModal(false);

    } catch (error: any) {
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
      setShowEmailModal(false);
    }
  }

  const handleDeleteItem = (id: string | number) => {
    setItemToDelete(id)
    setAlertContent({
      title: t('modal.confirmDeletion'),
      message: t('modal.confirmCartDeletion')
    })
    setShowAlertModal(true)
  }

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete)
      setItemToDelete(null)
    }
    setShowAlertModal(false)
    Toast.show(t('modal.deletedSuccessfully'))
  }

  const handleAddItemWithConflictCheck = (product: CartItem & { quantity?: number }) => {
    const result = useCartStore.getState().addItem(product)
    if (result.hasConflict) {
      // 显示互斥规则确认弹窗
      setItemToAdd(product)
      setAlertContent({
        title: t('productDetail.addToCart'),
        message: t('modal.similarCouponWarning')
      })
      setShowAddConfirmModal(true)
    } else {
      Toast.show(t('modal.addedToCart'))
    }
  }

  const handleConfirmAdd = () => {
    if (itemToAdd) {
      // 用户确认继续加购，强制添加商品（跳过冲突检查）
      useCartStore.getState().addItem(itemToAdd, true)
      setItemToAdd(null)
      Toast.show(t('modal.addedToCart'))
    }
    setShowAddConfirmModal(false)
  }

  const handleCancelAdd = () => {
    setItemToAdd(null)
    setShowAddConfirmModal(false)
  }

  // 页面离开时保存购物车数据
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const cartItems = useCartStore.getState().items;
      if (cartItems.length > 0) {
        try {
          const { user } = useAuthModel.getState();
          if (user) {
            const requestData = {
              memberId: user.customerKey,
              storeId: user.shopNo,
              countryCode: user.remoteCountry,
              products: cartItems.map(item => ({
                productType: item.productType,
                productId: item.productId,
                quantity: item.quantity || 1,
                isSelected: item.isSelected
              }))
            };
            const blob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
            navigator.sendBeacon('/front/cart/addOrUpdate', blob);
          }
        } catch (error) {
          Toast.show({
            content: t('modal.requestFailed'),
            position: 'center',
            duration: 3000
          })
          console.error('保存购物车失败:', error);
        }
      }
    };

    const saveOnRouteChange = async () => {
      const cartItems = useCartStore.getState().items;
      try {
        const { user } = useAuthModel.getState();
        if (user) {
          const requestData = {
            memberId: user.customerKey,
            storeId: user.shopNo,
            countryCode: user.country,
            products: cartItems.map(item => ({
              productType: item.productType,
              productId: item.productId,
              quantity: item.quantity || 1,
              isSelected: item.isSelected,
              categoryType: item.categoryType,
              categoryId: item.categoryId
            }))
          };

          // 路由切换使用常规 API 调用
          await cartAddOrUpdate(requestData);
        }
      } catch (error) {
          Toast.show({
            content: t('modal.requestFailed'),
            position: 'center',
            duration: 3000
          })
        console.error('保存购物车失败:', error);
      }
    };

    // 监听页面关闭
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 返回清理函数（路由切换时执行）
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveOnRouteChange(); // 路由切换时保存
    };
  }, []);

  const handleClick = (e: React.MouseEvent, product: any) => {
    e.preventDefault()

    // 检查是否在兑换时间
    if (product.productStatus === false) {
      Toast.show(t('supplementary.noProduct'));
      return;
    }

    navigate(`/product/${product.productId}`, {
      state: {
        disabled: false,
        product: { ...product }
      }
    })
  }

  // 检查商品是否无库存 - 只有周边礼品(categoryType=0)才有库存概念
  const isOutOfStock = (item: CartItem) =>
    item.categoryType === 0 &&
    item.remainingStock !== undefined &&
    item.remainingStock <= 0;

  // 检查商品是否可操作（无库存或不在兑换时间）
  const isItemDisabled = (item: CartItem) =>
    isOutOfStock(item) || item.productStatus === false;

  // 自动取消选中无库存或不在兑换时间的商品
  useEffect(() => {
    const hasDisabledSelected = items.some(item =>
      isItemDisabled(item) && item.isSelected
    );

    if (hasDisabledSelected) {
      // 自动取消选中所有禁用商品
      items.forEach(item => {
        if (isItemDisabled(item) && item.isSelected) {
          toggleSelect(item.productId);
        }
      });
    }
  }, [items]);

  // 分离有库存和无库存商品
  const inStockItems = items.filter(item => !isOutOfStock(item) && item.productStatus !== false);
  const outOfStockItems = items.filter(item => isOutOfStock(item) && item.productStatus !== false);
  const offShelfItems = items.filter(item => item.productStatus === false);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 w-full h-full overflow-y-auto">
        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <AntdImage src="/empty.svg" width={200} height={200} />
            <div className={styles['cart-msg']}>{t('cart.emptyCart')}</div>
          </div>
        )}
        {/* Cart Items */}
        {items.length > 0 && (
          <div className="flex flex-col ">
            {/* 有库存商品区域 */}
            {inStockItems.length > 0 && (
              <>
                <div className={`${styles['title-bar']} flex items-center justify-between`}>{t('home.shoppingCart')} ({inStockItems.length})</div>
                {inStockItems.map((item, index) => (
                  <React.Fragment key={item.productId}>
                    <div className="flex w-full space-y-1 items-center">
                      <div className="ml-1 mr-1">
                        <Checkbox
                          checked={item.isSelected}
                          onChange={(checked) => {
                            toggleSelect(item.productId)
                          }}
                        />
                      </div>
                      <div className="relative overflow-hidden bg-white rounded-[20px] w-full mr-1">
                        {/* Delete Button (shown on swipe) */}
                        <div
                          className="absolute rounded-[25px] right-0 top-0 h-full w-[80px] bg-[#E60012] flex items-center justify-center text-white z-10"
                          onClick={() => handleDeleteItem(item.productId)}
                        >
                          {t('cart.delete')}
                        </div>
                        <div onClick={(e) => handleClick(e, item)} className="w-full cursor-pointer">
                          {/* Swipeable Content */}
                          <div
                            ref={(el) => {
                              if (el) {
                                swipeRefs.current[index] = el
                              }
                            }}
                            className="flex items-center p-1  transition-transform duration-300 bg-white z-20 relative"
                            style={{ transform: 'translateX(0)' }}
                            onTouchStart={(e) => {
                              const touch = e.touches[0];
                              (swipeRefs.current[index] as any).startX = touch.clientX;
                            }}
                            onTouchMove={(e) => {
                              const touch = e.touches[0];
                              const startX = (swipeRefs.current[index] as any).startX;
                              const deltaX = touch.clientX - startX;
                              handleSwipe(index, Math.min(0, deltaX));
                            }}
                            onTouchEnd={() => handleSwipeEnd(index)}
                          >
                            <AntdImage
                              src={item.productImage || '/default.jpg'}
                              width={158}
                              height={133}
                              fit="cover"
                              className="rounded-[16px]"
                            />
                            <div className="ml-1 flex-1" style={{ minHeight: '133px' }}>
                              <div className={styles.name}>{item.productName}</div>
                              <div className="space-y-1 min-h-[18px]">
                                {item.totalExchangeCount !== null && item.totalExchangeCount !== undefined && (
                                  <div className={`${styles['font']}`}>
                                    {t('productDetail.itemsRedeemed')}&nbsp;{item.totalExchangeCount}&nbsp;
                                    {item.totalExchangeCount <= 1
                                      ? t('productDetail.countType')
                                      : t('productDetail.countsType')
                                    }
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex flex-col">
                                  {item.exclusionText && item.exclusionText.trim() !== '' && (
                                    <div className={`${styles['font']} ${styles['rule']} mb-[5px]`}>* {item.exclusionText}</div>
                                  )}
                                  {/* 积分和价格 */}
                                  <div className="flex items-center">
                                    <img
                                      src="/star.svg"
                                      className="h-[20px] w-[20px] mr-0.5"
                                      alt="star"
                                    />
                                    <div className={`${styles['point']} mr-2`}> {formatNumberWithCommas(item.unitPoints || 0)}</div>
                                    {item.productPrice && item.productPrice !== 0 ? (
                                      <div className={`${styles['originalPrice']} mr-2`}>{currencySymbol}{item.productPrice}</div>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-1">
                                    <div
                                      className={`w-[22px] h-[22px] rounded-full text-xxs flex items-center justify-center ${(item.quantity || 1) > 1
                                          ? 'bg-[#E60012] text-white cursor-pointer hover:bg-[#ff0018]'
                                          : 'bg-gray-200 text-black cursor-pointer hover:bg-gray-300'
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.productId, Math.max(1, (item.quantity || 1) - 1))
                                      }}
                                    >
                                      <img
                                        src={(item.quantity || 1) > 1 ? "/sub-l.svg" : "/sub.svg"}
                                        className=""
                                        alt="-"
                                      />
                                    </div>
                                    <div className={detailStyles.quantityDisplay}>
                                      {item.quantity ?? 0}
                                    </div>
                                    <div
                                      className={`w-[22px] h-[22px] rounded-full text-white text-xxs flex items-center justify-center ${(item.remainingStock !== null && (item.remainingStock || 0) > 0 &&
                                          (item.quantity || 0) >= (item.remainingStock || 0)) ||
                                          isOutOfStock(item)
                                          ? 'bg-gray-300 cursor-not-allowed'
                                          : 'bg-[#E60012] cursor-pointer'
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const hasStockLimit = item.remainingStock !== null && (item.remainingStock || 0) > 0;
                                        const isMaxQuantity = hasStockLimit ? (item.quantity || 0) >= (item.remainingStock || 0) : false;
                                        if (isMaxQuantity || isOutOfStock(item)) {
                                          return;
                                        }

                                        const productToAdd = {
                                          ...item,
                                          quantity: 1
                                        }
                                        handleAddItemWithConflictCheck(productToAdd)
                                      }}
                                    >
                                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                        <path
                                          d="M8 3V13M3 8H13"
                                          stroke={(item.remainingStock !== null && (item.remainingStock || 0) > 0 &&
                                            (item.quantity || 0) >= (item.remainingStock || 0)) ||
                                            isOutOfStock(item) ? "#6F6F72" : "#FFFFFF"}
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Fixed Delete Icon (保留原有删除图标) */}
                        <div
                          className="absolute right-[10px] top-1 w-2 h-2 flex items-center justify-center z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.productId);
                          }}
                        >
                          <Trash2 size={20} className="text-[#E60012]" />
                        </div>
                      </div>

                    </div>
                  </React.Fragment>
                ))}
              </>
            )}
            {outOfStockItems.length > 0 && (
              <>
                <div className={`${styles['title-bar']} flex items-center justify-between`}>{t('cart.outOfStock')} ({outOfStockItems.length})</div>
                {outOfStockItems.map((item, index) => (
                  <React.Fragment key={item.productId}>
                    <div className="flex w-full space-y-1 items-center opacity-50">
                      <div className="ml-1 mr-1">
                        <Checkbox
                          checked={false}
                          disabled={true}
                          onChange={() => { }}
                        />
                      </div>
                      <div className="relative overflow-hidden bg-white rounded-[20px] w-full mr-1">
                        <div
                          className="absolute rounded-[25px] right-0 top-0 h-full w-[80px] bg-[#E60012] flex items-center justify-center text-white z-10"
                          onClick={() => handleDeleteItem(item.productId)}
                        >
                          {t('cart.delete')}
                        </div>
                        <div onClick={(e) => handleClick(e, item)} className="w-full cursor-pointer">
                          {/* Swipeable Content */}
                          <div
                            ref={(el) => {
                              if (el) {
                                swipeRefs.current[index + inStockItems.length] = el
                              }
                            }}
                            className="flex items-center p-1 transition-transform duration-300 bg-white z-20 relative"
                            style={{ transform: 'translateX(0)' }}
                            onTouchStart={(e) => {
                              const touch = e.touches[0];
                              (swipeRefs.current[index + inStockItems.length] as any).startX = touch.clientX;
                            }}
                            onTouchMove={(e) => {
                              const touch = e.touches[0];
                              const startX = (swipeRefs.current[index + inStockItems.length] as any).startX;
                              const deltaX = touch.clientX - startX;
                              handleSwipe(index + inStockItems.length, Math.min(0, deltaX));
                            }}
                            onTouchEnd={() => handleSwipeEnd(index + inStockItems.length)}
                          >
                            <AntdImage
                              src={item.productImage || '/default.jpg'}
                              width={158}
                              height={133}
                              fit="cover"
                            />
                            <div className="ml-1 flex-1" style={{ minHeight: '133px' }}>
                              <div className={styles.name}>{item.productName}</div>
                              <div className="space-y-1 min-h-[18px]">
                                {item.totalExchangeCount !== null && item.totalExchangeCount !== undefined && (
                                  <div className={`${styles['font']}`}>
                                    {t('productDetail.itemsRedeemed')}&nbsp;{item.totalExchangeCount}&nbsp;
                                    {item.totalExchangeCount <= 1
                                      ? t('productDetail.countType')
                                      : t('productDetail.countsType')
                                    }
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex flex-col">
                                  {item.exclusionText && item.exclusionText.trim() !== '' && (
                                    <div className={`${styles['font']} ${styles['rule']} mb-[5px]`}>* {item.exclusionText}</div>
                                  )}
                                  <div className="flex items-center">
                                    <img
                                      src="/star.svg"
                                      className="h-[20px] w-[20px] mr-0.5"
                                      alt="star"
                                    />
                                    <div className={`${styles['point']} mr-2`}>{item.unitPoints || 0}</div>
                                    {item.productPrice && item.productPrice !== 0 ? (
                                      <div className={`${styles['originalPrice']} mr-2`}>{currencySymbol}{item.productPrice}</div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Fixed Delete Icon */}
                        <div
                          className="absolute right-[10px] top-1 w-2 h-2 flex items-center justify-center z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.productId);
                          }}
                        >
                          <Trash2 size={20} className="text-[#E60012]" />
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </>
            )}
            {offShelfItems.length > 0 && (
              <>
                <div className={`${styles['title-bar']} flex items-center justify-between`}>{t('supplementary.noProduct')} ({offShelfItems.length})</div>
                {offShelfItems.map((item, index) => (
                  <React.Fragment key={item.productId}>
                    <div className="flex w-full space-y-1 items-center opacity-50">
                      <div className="ml-1 mr-1">
                        <Checkbox
                          checked={false}
                          disabled={true}
                          onChange={() => { }}
                        />
                      </div>
                      <div className="relative overflow-hidden bg-white rounded-[20px] w-full mr-1">
                        {/* Delete Button (shown on swipe) */}
                        <div
                          className="absolute rounded-[25px] right-0 top-0 h-full w-[80px] bg-[#E60012] flex items-center justify-center text-white z-10"
                          onClick={() => handleDeleteItem(item.productId)}
                        >
                          {t('cart.delete')}
                        </div>
                        <div onClick={(e) => handleClick(e, item)} className="w-full cursor-pointer">
                          {/* Swipeable Content */}
                          <div
                            ref={(el) => {
                              if (el) {
                                swipeRefs.current[index + inStockItems.length + outOfStockItems.length] = el
                              }
                            }}
                            className="flex items-center p-1 transition-transform duration-300 bg-white z-20 relative"
                            style={{ transform: 'translateX(0)' }}
                            onTouchStart={(e) => {
                              const touch = e.touches[0];
                              (swipeRefs.current[index + inStockItems.length + outOfStockItems.length] as any).startX = touch.clientX;
                            }}
                            onTouchMove={(e) => {
                              const touch = e.touches[0];
                              const startX = (swipeRefs.current[index + inStockItems.length + outOfStockItems.length] as any).startX;
                              const deltaX = touch.clientX - startX;
                              handleSwipe(index + inStockItems.length + outOfStockItems.length, Math.min(0, deltaX));
                            }}
                            onTouchEnd={() => handleSwipeEnd(index + inStockItems.length + outOfStockItems.length)}
                          >
                            <AntdImage
                              src={item.productImage || '/default.jpg'}
                              width={158}
                              height={133}
                              fit="cover"
                            />
                            <div className="ml-1 flex-1" style={{ minHeight: '133px' }}>
                              <div className={styles.name}>{item.productName}</div>
                              <div className="space-y-1 min-h-[18px]">
                                {item.totalExchangeCount !== null && item.totalExchangeCount !== undefined && (
                                  <div className={`${styles['font']}`}>
                                    {t('productDetail.itemsRedeemed')}&nbsp;{item.totalExchangeCount}&nbsp;
                                    {item.totalExchangeCount <= 1
                                      ? t('productDetail.countType')
                                      : t('productDetail.countsType')
                                    }
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex flex-col">
                                  {/* 互斥文案 - 在积分上方 */}
                                  {item.exclusionText && item.exclusionText.trim() !== '' && (
                                    <div className={`${styles['font']} ${styles['rule']} mb-[5px]`}>* {item.exclusionText}</div>
                                  )}
                                  {/* 积分和价格 */}
                                  <div className="flex items-center">
                                    <img
                                      src="/star.svg"
                                      className="h-[20px] w-[20px] mr-0.5"
                                      alt="star"
                                    />
                                    <div className={`${styles['point']} mr-2`}>{item.unitPoints || 0}</div>
                                    {item.productPrice && item.productPrice !== 0 ? (
                                      <div className={`${styles['originalPrice']} mr-2`}>{currencySymbol}{item.productPrice}</div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Fixed Delete Icon */}
                        <div
                          className="absolute right-[10px] top-1 w-2 h-2 flex items-center justify-center z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.productId);
                          }}
                        >
                          <Trash2 size={20} className="text-[#E60012]" />
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      {/* Checkout Bar */}
      <div className={`${styles['checkout']} w-full rounded-b-none`}>
        <div className="flex items-center">
          <Checkbox
            checked={items.length > 0 && items.every(item => item.isSelected)}
            onChange={(checked) => {
              items.forEach(item => {
                if (item.isSelected !== checked) {
                  toggleSelect(item.productId)
                }
              })
            }}
            className="ml-2 mr-2"
          />
          <div className={styles['font']}>
            <div >
              {t('cart.totalPoints')}: <span >{formatNumberWithCommas(totalPrice())}</span>
            </div>
            <div className={styles['span'] + " flex items-center"}>
              <img src="/Group.svg" className="w-[10px] h-[10px] mr-[5px]" alt="group" />
              {t('cart.nonReturnable')}
            </div>
          </div>
        </div>
        <div
          onClick={handleCheckout}
          className={`${styles['font']} mr-5`}
        >
          {t('cart.redeemNow')}({totalItems()})
          <FontAwesomeIcon icon={faAngleRight} className={styles['arrow-icon']} />
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
        onConfirm={itemToDelete ? handleConfirmDelete : handleConfirmVerification}
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
        message={t('modal.merchandiseContactStaff')}
        confirmText={t('modal.gotIt')}
        showConfirmButton={false}
      />
      <AlertModal
        visible={showAddConfirmModal}
        onClose={handleCancelAdd}
        onConfirm={handleConfirmAdd}
        title={alertContent.title}
        message={alertContent.message}
        confirmText={t('modal.confirm')}
        cancelText={t('modal.cancel')}
      />
    </div>
  )
}

export default CartPage
