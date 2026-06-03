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
      {/* Ambient glow container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[45%] rounded-full bg-sky-400/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]" />
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrollments yet"
          description="Submit a proposal and wait for a mentor to accept you into their project."
          action={
            <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-slate-800">
              Browse open projects
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 relative z-10">
          {enrollments.map(e => (
            <div key={e.id} className="group relative overflow-hidden rounded-[26px] bg-white border border-slate-100/80 p-6 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:-translate-y-1">
              {/* Decorative inner glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-emerald-600/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-[15px] text-slate-900 group-hover:text-indigo-650 transition-colors leading-snug line-clamp-1">{e.project_title}</h3>
                  <div className="flex-shrink-0">
                    <Badge status={e.project_status} />
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-550 font-semibold">
                  <p className="flex items-center gap-1.5">
                    <span className="text-slate-450">Mentor:</span>
                    <span className="font-bold text-slate-700">{e.mentor_email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-305" />
                    <span className="text-slate-450">Enrolled on {format(new Date(e.joined_at), 'MMM d, yyyy')}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-50 mt-1 relative z-10">
                <Link
                  to={`/projects/${e.project}`}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-150 hover:bg-slate-100 px-3.5 py-2.5 rounded-xl transition-all flex-1"
                >
                  <ExternalLink size={12} /> View project
                </Link>
                <Link
                  to={`/student/tasks?project=${e.project}`}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/60 border border-indigo-100/40 px-3.5 py-2.5 rounded-xl transition-all flex-1"
                >
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