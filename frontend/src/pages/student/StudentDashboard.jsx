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
  const taskPct = tasksTotal > 0 ? Math.round((d.tasks_done / tasksTotal) * 100) : 0

  return (
    <PageWrapper
      title={`Welcome back${user?.email ? ', ' + user.email.split('@')[0] : ''} 👋`}
      subtitle="Here's your research activity at a glance"
    >
      {/* Ambient glow container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[40%] rounded-full bg-sky-400/5 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[45%] rounded-full bg-indigo-400/5 blur-[120px]" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Enrollments"       value={d.total_enrollments ?? 0}  icon={BookOpen}   color="teal"  />
        <StatCard label="Pending proposals" value={d.pending_proposals  ?? 0}  icon={FileText}   color="amber" />
        <StatCard label="Tasks in progress" value={d.tasks_in_progress  ?? 0}  icon={CheckSquare} color="brand" />
        <StatCard label="Tasks done"        value={d.tasks_done         ?? 0}  icon={Award}      color="green" />
      </div>

      {/* Task progress bar */}
      {tasksTotal > 0 && (
        <div className="relative overflow-hidden bg-white border border-slate-100/90 rounded-[24px] p-6.5 mb-10 shadow-[0_8px_30px_rgb(15,23,42,0.015)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Overall Task Completion</span>
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-xl">{taskPct}%</span>
          </div>
          <div className="h-3 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-650 rounded-full transition-all duration-1000 ease-out" style={{ width: `${taskPct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-xs font-semibold text-slate-400">{d.tasks_done} of {tasksTotal} tasks completed</p>
            <Link to="/student/tasks" className="text-xs font-bold text-indigo-650 hover:text-indigo-850 hover:underline flex items-center gap-0.5">
              Manage tasks →
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Active enrollments */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">Active enrollments</h2>
            <Link to="/student/enrollments" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-0.5 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {(d.enrollments || []).length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[22px] p-8 text-center text-sm text-slate-400 shadow-[0_6px_24px_rgba(15,23,42,0.01)]">
              <span>No enrollments yet. </span>
              <Link to="/projects" className="text-indigo-600 hover:underline font-bold">Browse projects →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {(d.enrollments || []).slice(0, 3).map(e => (
                <div key={e.id} className="group relative overflow-hidden rounded-[20px] bg-white border border-slate-100/80 p-5 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.04)] hover:-translate-y-0.5">
                  <div className="min-w-0">
                    <Link to={`/projects/${e.project}`} className="font-bold text-[14px] text-slate-900 hover:text-indigo-650 transition-colors leading-snug line-clamp-1">{e.project_title}</Link>
                    <p className="text-xs text-slate-400 font-semibold mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      <span>Mentor: {e.mentor_email}</span>
                    </p>
                  </div>
                  <Badge status={e.project_status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending proposals */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">Pending proposals</h2>
            <Link to="/student/proposals" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-0.5 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {(d.pending_proposal_list || []).length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[22px] p-8 text-center text-sm text-slate-400 shadow-[0_6px_24px_rgba(15,23,42,0.01)]">No pending proposals.</div>
          ) : (
            <div className="space-y-4">
              {(d.pending_proposal_list || []).slice(0, 3).map(p => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          )}
        </div>

        {/* My tasks */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">My tasks</h2>
            <Link to="/student/tasks" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-0.5 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {(d.assigned_tasks || []).length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[22px] p-8 text-center text-sm text-slate-400 shadow-[0_6px_24px_rgba(15,23,42,0.01)]">No tasks assigned yet.</div>
          ) : (
            <div className="space-y-4">
              {(d.assigned_tasks || []).filter(t => t.status !== 'done').slice(0, 3).map(t => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          )}
        </div>

        {/* Recent reviews */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">Reviews received</h2>
            <Link to="/student/reviews" className="text-xs font-bold text-indigo-600 hover:text-indigo-850 hover:underline flex items-center gap-0.5 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {(d.reviews_received || []).length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[22px] p-8 text-center text-sm text-slate-400 shadow-[0_6px_24px_rgba(15,23,42,0.01)]">No reviews yet.</div>
          ) : (
            <div className="space-y-4">
              {(d.reviews_received || []).slice(0, 2).map(r => (
                <div key={r.id} className="bg-white border border-slate-100/80 rounded-[22px] p-5.5 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.04)] hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-3 gap-3">
                    <span className="text-xs font-bold text-slate-500 truncate max-w-[220px]" title={r.project_title}>{r.project_title}</span>
                    <div className="flex gap-0.5 text-amber-400 flex-shrink-0">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className="text-sm">{s <= r.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-[13px] text-slate-650 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100/50 italic">"{r.comment}"</p>}
                  <p className="text-[11px] font-semibold text-slate-450 mt-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                    <span>Review by {r.mentor_email}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
