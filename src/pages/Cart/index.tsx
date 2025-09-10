import React, { useRef, useState, useEffect } from 'react'
import { Image as AntdImage, Toast, Checkbox } from 'antd-mobile'
import { Trash2 } from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import AlertModal from '@/components/AlertModal'
import EmailVerificationModal from '@/components/EmailVerificationModal'
import { useAuthModel } from '@/model/useAuthModel'
import styles from './index.module.less'
import { useTranslation } from 'react-i18next'
import { cartAddOrUpdate, getCartDetails } from '@/services/cartSerivce'
import { exchangeCartRequest } from '@/services/exchangeService'
import { NativeBridge } from '@/utils/bridge'
import { useNavigate } from 'react-router-dom'

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


  const handleSwipe = (index: number, dx: number) => {
    const element = swipeRefs.current[index]
    if (element) {
      // 限制最大滑动距离为100px
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
    const selectedItems = items.filter(item => item.isSelected)
    if (selectedItems.length === 0) {
      Toast.show(t('redemptionRecord.noItemsRedeemed'))
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
    // 关闭AlertModal并显示EmailVerificationModal
    setShowAlertModal(false)
    setShowEmailModal(true)
  }

  const exchange = async (email: string, code: string) => {
    try {
      if (!code || !code.trim()) {
        Toast.show({ icon: 'fail', content: t('modal.enterVerificationCode') });
        return;
      }

      if (!user) {
        Toast.show({ icon: 'fail', content: t('modal.requestFailed') });
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

      setShowEmailModal(false);

    } catch (error) {
      console.error('购物车兑换失败:', error);
      Toast.show({
        icon: 'fail',
        content: t('modal.requestFailed'),
        position: 'center',
        duration: 3000
      });
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
    }
  }

  const handleConfirmAdd = () => {
    if (itemToAdd) {
      // 用户确认继续加购，强制添加商品（跳过冲突检查）
      useCartStore.getState().addItem(itemToAdd, true)
      setItemToAdd(null)
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

            // 使用 sendBeacon 确保页面关闭前完成
            const blob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
            navigator.sendBeacon('/front/cart/addOrUpdate', blob);

            console.log('页面关闭：购物车数据已保存');
          }
        } catch (error) {
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
            countryCode: user.remoteCountry,
            products: cartItems.map(item => ({
              productType: item.productType,
              productId: item.productId,
              quantity: item.quantity || 1,
              isSelected: item.isSelected
            }))
          };

          // 路由切换使用常规 API 调用
          await cartAddOrUpdate(requestData);
          console.log('路由切换：购物车数据已保存');
        }
      } catch (error) {
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
    navigate(`/product/${product.productId}`, {
        state: {
          disabled: true,
          product: {...product}
        }
      })
  }

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
            <div className={`${styles['title-bar']} flex items-center justify-between`}>{t('home.shoppingCart')} ({items.length})</div>
            {items.map((item, index) => (
              <React.Fragment key={item.productId}>
                <div className="flex w-full items-center">
                  <div className="ml-1 mr-1">
                    <Checkbox
                      checked={items.length > 0 && items.every(item => item.isSelected)}
                      onChange={(checked) => {
                        items.forEach(item => {
                          if (item.isSelected !== checked) {
                            toggleSelect(item.productId)
                          }
                        })
                      }}

                    />
                  </div>

                  <div className="relative overflow-hidden bg-white rounded-[20px] w-full mr-1">
                    {/* Delete Button (shown on swipe) */}
                    <div
                      className="absolute rounded-[25px] right-0 top-0 h-full w-[113px] bg-[#E60012] flex items-center justify-center text-white z-10"
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
                        className="flex items-center p-1 transition-transform duration-300 bg-white z-20 relative"
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
                          width={150}
                          height={130}
                          fit="cover"
                        />
                        <div className="ml-3 flex-1 space-y-1">
                          <div className={styles.name}>{item.productName}</div>
                          <div className="space-y-1">
                            <div className={`${styles['font']} ${styles['rule']}`}>* {item.exclusionText || ''}</div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center mr-2">
                              <img
                                src="/star.svg"
                                className="h-2 w-2 mr-0.5"
                                alt="star"
                              />
                              <div className={`${styles['point']} mr-2`}>{item.unitPoints || 0}</div>
                              <div className={`${styles['originalPrice']} mr-2`}>¥{item.productPrice || 0}</div>
                            </div>

                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-[30px] h-[30px] rounded-full bg-gray-200 text-black text-xxs flex items-center justify-center"
                                  onClick={() => updateQuantity(item.productId, Math.max(1, (item.quantity || 1) - 1))}
                                >
                                  -
                                </div>
                                <div className="text-xxxs">{item.quantity || 1}</div>
                                <div
                                  className="w-[22px] h-[22px] rounded-full bg-[#E60012] text-white text-xxs flex items-center justify-center"
                                  onClick={() => {
                                    // 创建要添加的商品对象（模拟增加数量的操作）
                                    const productToAdd = {
                                      ...item,
                                      quantity: 1 // 每次点击+按钮增加1个数量
                                    }
                                    handleAddItemWithConflictCheck(productToAdd)
                                  }}
                                >
                                  +
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
          </div>
        )}
      </div>
      {/* Checkout Bar */}
      <div className={`${styles['checkout']} w-full`}>
        <div className="flex items-center">
          <Checkbox
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
              {t('cart.totalPoints')}: <span >{totalPrice()}</span>
            </div>
            <div className={styles['span']} >
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
