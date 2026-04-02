import { create } from 'zustand'

export interface Selection {
  choiceId: string
  nameEs: string
  nameEn: string
  priceAdd: number
}

export interface CartItem {
  id: string
  cartKey: string
  nameEs: string
  nameEn: string
  price: number
  qty: number
  selections: Selection[]
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  step: 1 | 2
  addItem: (item: Omit<CartItem, 'qty' | 'cartKey'> & { cartKey?: string }) => void
  removeItem: (cartKey: string) => void
  updateQty: (cartKey: string, qty: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  setStep: (step: 1 | 2) => void
  getTotal: () => number
  getCount: () => number
}

function buildCartKey(id: string, selections: Selection[]): string {
  if (selections.length === 0) return id
  return id + '::' + selections.map((s) => s.choiceId).join('::')
}

function itemTotal(item: CartItem): number {
  const selAdd = item.selections.reduce((s, sel) => s + sel.priceAdd, 0)
  return (item.price + selAdd) * item.qty
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  step: 1,

  addItem: (item) => {
    const cartKey = item.cartKey || buildCartKey(item.id, item.selections)
    set((state) => {
      const existing = state.items.find((i) => i.cartKey === cartKey)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...item, cartKey, qty: 1 }] }
    })
  },

  removeItem: (cartKey) =>
    set((state) => ({
      items: state.items.filter((i) => i.cartKey !== cartKey),
    })),

  updateQty: (cartKey, qty) =>
    set((state) => {
      if (qty <= 0) {
        return { items: state.items.filter((i) => i.cartKey !== cartKey) }
      }
      return {
        items: state.items.map((i) =>
          i.cartKey === cartKey ? { ...i, qty } : i
        ),
      }
    }),

  clear: () => set({ items: [], step: 1 }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false, step: 1 }),
  setStep: (step) => set({ step }),

  getTotal: () => get().items.reduce((sum, i) => sum + itemTotal(i), 0),
  getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}))
