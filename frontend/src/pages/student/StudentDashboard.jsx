import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CheckSquare, FileText, BookOpen, Award, TrendingUp, ArrowRight } from 'lucide-react'
import { getStudentDashboard } from '../../api/dashboard'
import StatCard from '../../components/ui/StatCard'
import TaskCard from '../../components/tasks/TaskCard'
import ProposalCard from '../../components/proposals/ProposalCard'
import PageWrapper from '../../components/layout/PageWrapper'
import { PageSpinner } from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => getStudentDashboard().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />

  const d = data || {}
  const tasksTotal = (d.tasks_todo || 0) + (d.tasks_in_progress || 0) + (d.tasks_done || 0)
  const taskPct    = tasksTotal > 0 ? Math.round((d.tasks_done / tasksTotal) * 100) : 0

  return (
    <PageWrapper
      title={`Welcome back${user?.email ? ', ' + user.email.split('@')[0] : ''} 👋`}
      subtitle="Here's your research activity at a glance"
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Enrollments"       value={d.total_enrollments ?? 0}  icon={BookOpen}   color="teal"  />
        <StatCard label="Pending proposals" value={d.pending_proposals  ?? 0}  icon={FileText}   color="amber" />
        <StatCard label="Tasks in progress" value={d.tasks_in_progress  ?? 0}  icon={CheckSquare} color="brand" />
        <StatCard label="Tasks done"        value={d.tasks_done         ?? 0}  icon={Award}      color="green" />
      </div>

      {/* Task progress bar */}
      {tasksTotal > 0 && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall task progress</span>
            <span className="text-sm font-bold text-brand-600">{taskPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full transition-all duration-700" style={{ width: `${taskPct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{d.tasks_done} of {tasksTotal} tasks completed</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active enrollments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">Active enrollments</h2>
            <Link to="/student/enrollments" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {(d.enrollments || []).length === 0 ? (
            <div className="card p-6 text-center text-sm text-gray-400">No enrollments yet. <Link to="/projects" className="text-brand-600 hover:underline">Browse projects →</Link></div>
          ) : (
            <div className="space-y-3">
              {(d.enrollments || []).slice(0, 3).map(e => (
                <div key={e.id} className="card p-4 flex items-center justify-between gap-3">
                  <div>
                    <Link to={`/projects/${e.project}`} className="font-medium text-sm text-gray-900 hover:text-brand-600">{e.project_title}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">{e.mentor_email}</p>
                  </div>
                  <Badge status={e.project_status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending proposals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">Pending proposals</h2>
            <Link to="/student/proposals" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {(d.pending_proposal_list || []).length === 0 ? (
            <div className="card p-6 text-center text-sm text-gray-400">No pending proposals.</div>
          ) : (
            <div className="space-y-3">
              {(d.pending_proposal_list || []).slice(0, 3).map(p => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          )}
        </div>

        {/* My tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">My tasks</h2>
            <Link to="/student/tasks" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {(d.assigned_tasks || []).length === 0 ? (
            <div className="card p-6 text-center text-sm text-gray-400">No tasks assigned yet.</div>
          ) : (
            <div className="space-y-3">
              {(d.assigned_tasks || []).filter(t => t.status !== 'done').slice(0, 3).map(t => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          )}
        </div>

        {/* Recent reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">Reviews received</h2>
            <Link to="/student/reviews" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {(d.reviews_received || []).length === 0 ? (
            <div className="card p-6 text-center text-sm text-gray-400">No reviews yet.</div>
          ) : (
            <div className="space-y-3">
              {(d.reviews_received || []).slice(0, 2).map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{r.project_title}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-sm ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 leading-relaxed">"{r.comment}"</p>}
                  <p className="text-xs text-gray-400 mt-1.5">— {r.mentor_email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}