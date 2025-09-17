import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
   /**
     * 可用门店
     */
    applicableStores?: string[];
    /**
     * 券类型
     */
    couponType?: string;
    /**
     * 使用规则
     */
    exclusionText?: string;
    /**
     * 是否选中
     */
    isSelected: boolean;
    /**
     * 商品编码
     */
    productCode: string;
    /**
     * 商品productId
     */
    productId: string;
    /**
     * 商品图片
     */
    productImage?: string;
    /**
     * 商品名称
     */
    productName: string;
    /**
     * 商品价值（菜品券和周边礼品类型）
     */
    productPrice?: number;
    /**
     * 商品类型
     */
    productType: number;
    /**
     * 数量
     */
    quantity?: number;
    /**
     * 券模板productId
     */
    templateId?: string;
    /**
     * 单价积分
     */
    unitPoints?: number;
    /**
     * 是否用保底语言
     */
    useBaseLanguage?: boolean;

    categoryType:number;

    categoryId:string;
}

type CartState = {
  items: CartItem[]
  addItem: (product: CartItem & { quantity?: number }, skipConflictCheck?: boolean) => { hasConflict: boolean; item?: CartItem }
  removeItem: (productId: string | number) => void
  updateQuantity: (productId: string | number, quantity: number) => void
  toggleSelect: (productId: string | number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, skipConflictCheck = false) => {
        // 检查互斥规则：如果购物车中已有同类券（exclusionText不为空且相同），则返回冲突状态
        const state = get()
        const hasConflictRule = product.exclusionText && product.exclusionText.trim() !== ''
        
        if (hasConflictRule && !skipConflictCheck) {
          const existingConflictItem = state.items.find(
            item => item.exclusionText && item.exclusionText.trim() !== '' && item.exclusionText === product.exclusionText
          )
          
          console.log('Conflict check - hasConflictRule:', hasConflictRule)
          console.log('Conflict check - existingConflictItem:', existingConflictItem)
          
          if (existingConflictItem) {
            // 返回冲突状态，不实际添加商品
            console.log('Conflict detected, not adding item')
            return { hasConflict: true, item: undefined }
          }
        }
        
        console.log('No conflict, proceeding to add item')
        
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product.productId
          )
          
          console.log('Existing item index:', existingItemIndex)
          console.log('Current items:', state.items)
          console.log('Adding product:', product)
          
          if (existingItemIndex !== -1) {
            // 商品已存在，增加数量
            const updatedItems = [...state.items]
            const newQuantity = (updatedItems[existingItemIndex].quantity || 0) + (product.quantity || 1)
            console.log('Updating quantity from', updatedItems[existingItemIndex].quantity, 'to', newQuantity)
            
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: newQuantity
            }
            return { items: updatedItems }
          } else {
            // 商品不存在，创建新项
            const newItem = {
              ...product,
              quantity: product.quantity || 1,
              isSelected: product.isSelected ?? true
            }
            console.log('Creating new item:', newItem)
            return { items: [...state.items, newItem] }
          }
        })
        
        // 返回成功状态，这里需要重新获取状态来返回正确的item
        const updatedState = get()
        const updatedItem = updatedState.items.find(item => item.productId === product.productId )
        return { hasConflict: false, item: updatedItem }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),
      toggleSelect: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, isSelected: !item.isSelected } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, item) => sum + (item.isSelected ? (item.quantity || 0) : 0), 0),
      totalPrice: () => get().items.reduce((sum, item) => sum + (item.isSelected ? (item.unitPoints || 0) * (item.quantity || 0) : 0), 0),}),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        },
      },
    }
  )
)
