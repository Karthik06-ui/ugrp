import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, Calendar, ExternalLink } from 'lucide-react'
import { getMyEnrollments } from '../../api/enrollments'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { PageSpinner } from '../../components/ui/Spinner'
import { format } from 'date-fns'

export default function MyEnrollments() {
  const { data, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => getMyEnrollments().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />
  const enrollments = data || []

  return (
    <PageWrapper
      title="My enrollments"
      subtitle={`You are enrolled in ${enrollments.length} project${enrollments.length !== 1 ? 's' : ''}`}
    >
      {enrollments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrollments yet"
          description="Submit a proposal and wait for a mentor to accept you into their project."
          action={<Link to="/projects" className="btn-primary">Browse open projects</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {enrollments.map(e => (
            <div key={e.id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 leading-snug">{e.project_title}</h3>
                <Badge status={e.project_status} />
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-400">Mentor:</span>
                  <span className="font-medium text-gray-700">{e.mentor_email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-gray-400" />
                  Enrolled on {format(new Date(e.joined_at), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex gap-2 pt-1 border-t border-gray-100">
                <Link to={`/projects/${e.project}`} className="btn-secondary text-xs flex items-center gap-1.5">
                  <ExternalLink size={12} /> View project
                </Link>
                <Link to={`/student/tasks?project=${e.project}`} className="btn-secondary text-xs">
                  My tasks
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}