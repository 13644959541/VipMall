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
  redeemPeriod:string
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
  totalPoints: () => number
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
          
          if (existingConflictItem) {
            // 返回冲突状态，不实际添加商品
            return { hasConflict: true, item: undefined }
          }
        }
        
        // 没有冲突，正常添加商品
        const newItem = {
          ...product,
          id: Date.now(),
          quantity: product.quantity || 1,
          selected: true
        }
        
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.productId
          )
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { 
                      ...item, 
                      quantity: product.quantity ? item.quantity + product.quantity : item.quantity + 1,
                    }
                  : item
              ),
            }
          }
          return {
            items: [...state.items, newItem],
          }
        })
        
        // 返回成功状态
        return { hasConflict: false, item: newItem }
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
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () => 
        get().items.reduce(
          (sum, item) => sum + (item.selected ? item.points * item.quantity : 0), 
          0
        ),
      totalPoints: () => 
        get().items.reduce(
          (sum, item) => sum + (item.selected ? item.points * item.quantity : 0), 
          0
        ),
    }),
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
