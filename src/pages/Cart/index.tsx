import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image as AntdImage, Space, Toast, Checkbox } from 'antd-mobile'
import { Trash2 } from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import AlertModal from '@/components/AlertModal'
import EmailVerificationModal from '@/components/EmailVerificationModal'
import { useAuthModel } from '@/model/useAuthModel'
import styles from './index.module.less'
import { useTranslation } from 'react-i18next'

const CartPage = () => {
  const swipeRefs = useRef<(HTMLDivElement | null)[]>([])
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
  const [itemToAdd, setItemToAdd] = useState<Omit<CartItem, 'id'> & { quantity?: number } | null>(null)
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false)
  const { t } = useTranslation('common');

  // 初始化时取消所有选中
  React.useEffect(() => {
    const selectedItems = items.filter(item => item.selected)
    if (selectedItems.length > 0) {
      selectedItems.forEach(item => toggleSelect(item.id))
    }
  }, [items.length]) // 依赖items.length确保购物车内容变化时重新检查

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
    const selectedItems = items.filter(item => item.selected)
    if (selectedItems.length === 0) {
      Toast.show('请选择要结算的商品')
      return;
    }

    // 检查购物车中是否有礼品类型的商品并存储状态
    const giftItemsExist = selectedItems.some(item => item.type === 'gift')
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
      // 这里可以添加实际的兑换逻辑
      console.log('Exchange with:', email, code)
      
      // 模拟API调用 - 在实际应用中替换为真实的API调用
      // const response = await api.exchange(email, code);
      
      // 假设验证成功
      const verificationSuccess = true; // 在实际应用中根据API响应设置
      
      if (verificationSuccess) {
        if (hasGiftItems) {
          // 有礼品商品，显示礼品成功弹窗
          setShowGiftSuccessModal(true)
        } else {
          // 没有礼品商品，显示成功toast
          Toast.show(t('modal.redeemSoon'))
        }
      } else {
        // 验证失败
        Toast.show(t('modal.requestFailed'))
      }
      
      setShowEmailModal(false)
      
    } catch (error) {
      // API调用失败
      console.error('Exchange failed:', error)
      Toast.show(t('modal.requestFailed'))
      setShowEmailModal(false)
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

  const handleAddItemWithConflictCheck = (product: Omit<CartItem, 'id'> & { quantity?: number }) => {
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
          <div className="flex flex-col  ">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center mt-1">
                <div className="ml-1 mr-1">
                  <Checkbox
                    checked={items.length > 0 && items.every(item => item.selected)}
                    onChange={(checked) => {
                      items.forEach(item => {
                        if (item.selected !== checked) {
                          toggleSelect(item.id)
                        }
                      })
                    }}

                  /></div>
                <div className="relative overflow-hidden bg-white rounded-[20px] w-full mr-1">
                  {/* Delete Button (shown on swipe) */}
                  <div
                    className="absolute rounded-[25px] right-0 top-0 h-full w-[100px] bg-[#E60012] flex items-center justify-center text-white z-10"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    {t('cart.delete')}
                  </div>

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
                      src={item.imgUrl}
                      width={150}
                      height={130}
                      fit="cover"
                    />
                    <div className="ml-3 flex-1 space-y-1">
                      <div className={styles.name}>{item.name}</div>
                      <div className="space-y-1">
                        <div className={`${styles['font']} ${styles['detail']}`}>{item.details}</div>
                        <div className={`${styles['font']} ${styles['rule']}`}>* {item.rules}</div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center mr-2">
                          <img
                            src="/star.svg"
                            className="h-2 w-2 mr-0.5"
                            alt="star"
                          />
                          <div className={`${styles['point']} mr-2`}>{item.points}</div>
                          <div className={`${styles['originalPrice']} mr-2`}>¥{item.price}</div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <div
                              className="w-[22px] h-[22px] rounded-full bg-gray-200 text-black text-xxs flex items-center justify-center"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </div>
                            <div className="text-xxxs">{item.quantity}</div>
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

                  {/* Fixed Delete Icon (保留原有删除图标) */}
                  <div
                    className="absolute right-[10px] top-1 w-2 h-2 flex items-center justify-center z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
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
                if (item.selected !== checked) {
                  toggleSelect(item.id)
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
        confirmText= {t('modal.continueRedemption')}
        cancelText= {t('modal.cancel')}
        userInfo={user || { email: undefined, mobile: undefined }}
      />
      <AlertModal
        visible={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onConfirm={itemToDelete ? handleConfirmDelete : handleConfirmVerification}
        title={alertContent.title}
        message={alertContent.message}
        confirmText= {t('modal.confirm')}
        cancelText= {t('modal.cancel')}
      />
      <AlertModal
        visible={showGiftSuccessModal}
        onClose={() => setShowGiftSuccessModal(false)}
        onConfirm={() => setShowGiftSuccessModal(false)}
        title = {t('modal.redemptionSuccessful')}
        message=  {t('modal.merchandiseContactStaff')}
        confirmText= {t('modal.gotIt')}
        showConfirmButton={false}
      />
      <AlertModal
        visible={showAddConfirmModal}
        onClose={handleCancelAdd}
        onConfirm={handleConfirmAdd}
        title={alertContent.title}
        message={alertContent.message}
        confirmText= {t('modal.confirm')}
        cancelText= {t('modal.cancel')}
      />
    </div>
  )
}

export default CartPage
