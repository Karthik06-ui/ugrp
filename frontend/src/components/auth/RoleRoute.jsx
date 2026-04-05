import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function RoleRoute({ role, children }) {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role !== role) {
    return <Navigate to={user?.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'} replace />
  }
  return children
}