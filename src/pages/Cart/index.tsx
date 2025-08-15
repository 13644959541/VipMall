import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Image as AntdImage, Space, Toast, Checkbox } from 'antd-mobile'
import { ArrowLeft, Trash2 } from 'lucide-react'
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
      <div className="flex-1 overflow-y-auto">
        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <AntdImage src="/pad/empty-.svg" width={200} height={200} />
            <div className={styles['cart-msg']}>购物车还是空的，快去加购商品吧</div>
          </div>
        )}

        {/* Cart Items */}
        {items.length > 0 && (
          <div className="p-2 space-y-2 pb-20">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="relative overflow-hidden bg-white rounded-lg"
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
                  className="flex items-center p-3 transition-transform duration-300"
                  style={{ transform: 'translateX(0)' }}
                >
            <Checkbox
              checked={items.length > 0 && items.every(item => item.selected)}
              onChange={(checked) => {
                items.forEach(item => {
                  if(item.selected !== checked) {
                    toggleSelect(item.id)
                  }
                })
              }}
              className="ml-2 mr-2"
              indeterminate={false}
            />
                  <AntdImage
                    src={item.image}
                    width={80}
                    height={80}
                    fit="cover"
                    className="rounded-lg"
                  />
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-red-500 font-bold">¥{item.price}</span>
                      <div className="flex items-center border rounded-full">
                        <Button
                          size="mini"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8"
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          size="mini"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Action (shown on swipe) */}
                <div
                  className="absolute right-0 bottom-0 w-20 h-20 bg-red-500 flex items-center justify-center"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={20} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Bar */}
      <div className={styles['checkout']}>
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
                合计积分: <span >¥{totalPrice()}</span>
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
