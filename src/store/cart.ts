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
   /**
     * 剩余库存
     */
   remainingStock?: number;
   /**
     * 是否在兑换时间
     * 0: 不在兑换时间, 1: 在可兑时间内
     */
   isInExchangeTime?: boolean;

   categoryType:number;

   categoryId:string;

  totalExchangeCount?: number;

  productStatus?: boolean;

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
        const state = get()
        const hasConflictRule = product.exclusionText && product.exclusionText.trim() !== ''
        
        if (hasConflictRule && !skipConflictCheck) {
          const existingConflictItem = state.items.find(
            item => item.exclusionText && item.exclusionText.trim() !== '' && item.exclusionText === product.exclusionText
          )
          if (existingConflictItem) {
            return { hasConflict: true, item: undefined }
          }
        }
        
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product.productId
          )
          
          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items]
            const newQuantity = (updatedItems[existingItemIndex].quantity || 0) + (product.quantity || 1)
            
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: newQuantity
            }
            return { items: updatedItems }
          } else {
            const newItem = {
              ...product,
              quantity: product.quantity || 1,
              isSelected: product.isSelected ?? true
            }
            return { items: [...state.items, newItem] }
          }
        })
        
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
