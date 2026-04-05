import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach JWT to every request ───────────────────────────────────────────────
api.interceptors.request.use((config) => {
  // Read from both locations — whichever is set
  const token =
    localStorage.getItem('access_token') ||
    (() => {
      try {
        const persisted = JSON.parse(localStorage.getItem('ugrp-auth') || '{}')
        return persisted?.state?.access || null
      } catch { return null }
    })()

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Handle 401 (expired) and 403 (wrong role / bad token) ────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status   = error.response?.status
    const original = error.config

    // ── 401: token expired — try silent refresh ──────────────────────────────
    if (status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token') ||
        (() => {
          try {
            const persisted = JSON.parse(localStorage.getItem('ugrp-auth') || '{}')
            return persisted?.state?.refresh || null
          } catch { return null }
        })()

      if (refresh) {
        try {
          // SimpleJWT token refresh endpoint
          const { data } = await axios.post('/api/token/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          clearAuthAndRedirect()
        }
      } else {
        clearAuthAndRedirect()
      }
    }

    // ── 403: authenticated but wrong role, OR stale/corrupted token ──────────
    // This happens when a student token hits a mentor endpoint (or vice versa),
    // or when the stored token belongs to a deleted/changed user.
    if (status === 403) {
      // Don't redirect — let the component handle it gracefully.
      // Just ensure the error propagates so React Query shows an error state.
      console.warn('UGRP 403 — permission denied:', original.url)
    }

    return Promise.reject(error)
  }
)

function clearAuthAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('ugrp-auth')
  window.location.href = '/login'
}

export default api