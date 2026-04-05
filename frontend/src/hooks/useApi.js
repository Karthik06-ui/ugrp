// Instead of this (raw, repeated in every page):
const { data } = useQuery({
  queryKey: ['projects'],
  queryFn: () => listProjects().then(r => r.data),
})

// You write this anywhere in the app:
import { useProjects } from '../hooks/useApi'
const { data: projects, isLoading } = useProjects()