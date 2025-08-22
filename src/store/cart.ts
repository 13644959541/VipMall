import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
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
  addItem: (product: Omit<CartItem, 'id'> & { quantity?: number }) => void
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
      addItem: (product) => 
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
            items: [
              ...state.items,
              { 
                ...product, 
                id: Date.now(), 
                quantity: product.quantity || 1, 
                selected: true 
              },
            ],
          }
        }),
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
