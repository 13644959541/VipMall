import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Image as AntdImage, Space, Toast, Checkbox } from 'antd-mobile'
import { ArrowLeft, Star, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import styles from './index.module.less'

const CartPage = () => {
  const navigate = useNavigate()
  const swipeRefs = useRef<(HTMLDivElement | null)[]>([])
  const {
    items,
    removeItem,
    updateQuantity,
    toggleSelect,
    clearCart,
    totalItems,
    totalPrice
  } = useCartStore()

  // 初始化时取消所有选中
  React.useEffect(() => {
    const selectedItems = items.filter(item => item.selected)
    if(selectedItems.length > 0) {
      selectedItems.forEach(item => toggleSelect(item.id))
    }
  }, [items.length]) // 依赖items.length确保购物车内容变化时重新检查

  const handleSwipe = (index: number, dx: number) => {
    const element = swipeRefs.current[index]
    if (element) {
      element.style.transform = `translateX(${dx}px)`
    }
  }

  const handleSwipeEnd = (index: number) => {
    const element = swipeRefs.current[index]
    if (element) {
      const transform = window.getComputedStyle(element).transform
      const matrix = new DOMMatrix(transform)
      if (matrix.m41 < -60) { // 滑动超过60px显示删除
        removeItem(items[index].id)
      }
      element.style.transform = 'translateX(0)'
    }
  }

  const handleCheckout = () => {
    const selectedItems = items.filter(item => item.selected)
    if (selectedItems.length === 0) {
      Toast.show('请选择要结算的商品')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 w-full h-full overflow-y-auto">
        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <AntdImage src="/empty-.svg" width={200} height={200} />
            <div className={styles['cart-msg']}>购物车还是空的，快去加购商品吧</div>
          </div>
        )}

        {/* Cart Items */}
        {items.length > 0 && (
          <div className="flex items-center mt-1">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
              <div className="ml-1 mr-1">
                <Checkbox
              checked={items.length > 0 && items.every(item => item.selected)}
              onChange={(checked) => {
                items.forEach(item => {
                  if(item.selected !== checked) {
                    toggleSelect(item.id)
                  }
                })
              }}
              
            /></div>
              <div
                className="relative overflow-hidden bg-white rounded-lg w-full mr-1"
                onTouchMove={(e) => handleSwipe(index, e.touches[0].clientX - e.touches[0].clientX)}
                onTouchEnd={() => handleSwipeEnd(index)}
              >
                {/* Swipeable Content */}
                <div
                  ref={(el) => {
                    if (el) {
                      swipeRefs.current[index] = el
                    }
                  }}
                  className="flex items-center p-1 transition-transform duration-300"
                  style={{ transform: 'translateX(0)' }}
                >
          
                  <AntdImage
                    src={item.image}
                    width={150}
                    height={130}
                    fit="cover"
                  />
                  <div className="ml-3 flex-1 space-y-1">
                    <div className={styles.name}>{item.name}</div>
                    <div className="space-y-1">
                       <div className={`${styles['font']} ${styles['detail']}`}>{item.details}</div>
                       <div className={`${styles['font']} ${styles['rule']}`}>* {item.conflictRule}</div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center mr-2">
                        <Star className="h-1 w-1 fill-orange-500 text-orange-500 mr-1" />
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
                              className="w-[22px] h-[22px] rounded-full bg-red-500 text-white text-xxs flex items-center justify-center"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Delete Action (shown on swipe) */}
                <div
                  className="absolute right-2 top-1 w-2 h-2 flex items-center justify-center"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={20} className="text-red-500" />
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
                  if(item.selected !== checked) {
                    toggleSelect(item.id)
                  }
                })
              }}
              className="ml-2 mr-2"
            />
            <div className={styles['font']}>
              <div >
                合计积分: <span >{totalPrice()}</span>
              </div>
              <div className={styles['span']} >
                积分所兑的商品不支持退换货
              </div>
          </div>
          </div>
          
          <div
            onClick={handleCheckout}
            className={`${styles['font']} mr-5`}
          >
            立即兑换({totalItems()})
             <FontAwesomeIcon icon={faAngleRight} className={styles['arrow-icon']}/>
          </div>
        </div>
    </div>
  )
}

export default CartPage
