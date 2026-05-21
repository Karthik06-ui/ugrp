import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user:   null,   // { user_id, email, role }
      access: null,
      refresh: null,

      setAuth: (user, access, refresh) => {
        localStorage.setItem('access_token',  access)
        localStorage.setItem('refresh_token', refresh)
        set({ user, access, refresh })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, access: null, refresh: null })
      },

      isAuthenticated: () => {
        const state = useAuthStore.getState()
        return !!state.access
      },
    }),
    {
      name: 'ugrp-auth',
      partialize: (s) => ({ user: s.user, access: s.access, refresh: s.refresh }),
    }
  )
)

export default useAuthStore