import useAuthStore from '../store/authStore'

export function useAuth() {
  const { user, access, setAuth, logout } = useAuthStore()
  return {
    user,
    isLoggedIn:  !!access,
    isStudent:   user?.role === 'student',
    isMentor:    user?.role === 'mentor',
    setAuth,
    logout,
  }
}