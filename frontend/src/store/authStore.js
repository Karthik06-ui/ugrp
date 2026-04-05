import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user:    null,   // { user_id, email, role }
      access:  null,
      refresh: null,

      setAuth: (user, access, refresh) => {
        // Write to both named keys AND Zustand persist so axios always finds the token
        // whether reading from 'access_token' or from the persisted 'ugrp-auth' state.
        localStorage.setItem('access_token',  access)
        localStorage.setItem('refresh_token', refresh)
        set({ user, access, refresh })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('ugrp-auth')
        set({ user: null, access: null, refresh: null })
      },
    }),
    {
      name: 'ugrp-auth',
      // Persist the full auth state so a hard refresh rehydrates everything
      partialize: (s) => ({ user: s.user, access: s.access, refresh: s.refresh }),
      // After rehydration, sync the named localStorage keys so axios can always find the token
      onRehydrateStorage: () => (state) => {
        if (state?.access)  localStorage.setItem('access_token',  state.access)
        if (state?.refresh) localStorage.setItem('refresh_token', state.refresh)
      },
    }
  )
)

export default useAuthStore