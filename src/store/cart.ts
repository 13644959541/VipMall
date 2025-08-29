import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string | number
  productId: string | number
  name: string
  imgUrl: string
  price: number
  quantity: number
  selected: boolean
  points: number
  details: string
  rules:string
  availableTime:string
  type:string
}

type CartState = {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'id'> & { quantity?: number }, skipConflictCheck?: boolean) => { hasConflict: boolean; item?: CartItem }
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  toggleSelect: (id: string | number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, skipConflictCheck = false) => {
        // 检查互斥规则：如果购物车中已有同类券（rules不为空且相同），则返回冲突状态
        const state = get()
        const hasConflictRule = product.rules && product.rules.trim() !== ''
        
        if (hasConflictRule && !skipConflictCheck) {
          const existingConflictItem = state.items.find(
            item => item.rules && item.rules.trim() !== '' && item.rules === product.rules
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
            const newQuantity = updatedItems[existingItemIndex].quantity + (product.quantity || 1)
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
              id: Date.now(),
              quantity: product.quantity || 1,
              selected: true
            }
            console.log('Creating new item:', newItem)
            return { items: [...state.items, newItem] }
          }
        })
        
        // 返回成功状态，这里需要重新获取状态来返回正确的item
        const updatedState = get()
        const updatedItem = updatedState.items.find(item => item.productId === product.productId)
        return { hasConflict: false, item: updatedItem }
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      toggleSelect: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, item) => sum + (item.selected ? item.quantity : 0), 0),
      totalPrice: () => get().items.reduce((sum, item) => sum + (item.selected ? item.points * item.quantity : 0), 0),}),
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
