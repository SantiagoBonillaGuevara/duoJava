import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,

      setAuth: (user, session) => set({ user, session }),

      logout: () => set({ user: null, session: null }),
    }),
    { name: 'auth-storage' }
  )
)