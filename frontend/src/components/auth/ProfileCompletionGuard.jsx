import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getStudentProfile, getMentorProfile } from '../../api/profiles'
import { PageSpinner } from '../ui/Spinner'

export function isProfileComplete(profile, role) {
  if (!profile) return false
  if (role === 'student') {
    return !!(
      profile.name?.trim() &&
      profile.roll_number?.trim() &&
      profile.year &&
      profile.department?.trim()
    )
  }
  if (role === 'mentor') {
    return !!(
      profile.name?.trim() &&
      profile.department?.trim() &&
      profile.designation?.trim()
    )
  }
  return false
}

export default function ProfileCompletionGuard() {
  const { isLoggedIn, user, isStudent } = useAuth()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.role],
    queryFn: () => (isStudent ? getStudentProfile() : getMentorProfile()).then(r => r.data),
    enabled: isLoggedIn && !!user?.role,
    staleTime: 5 * 60 * 1000, // Cache for 5 mins to prevent extra queries on each navigation
  })

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return <PageSpinner />
  }

  const complete = isProfileComplete(profile, user?.role)

  if (!complete) {
    return <Navigate to="/profile" replace />
  }

  return <Outlet />
}
