import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FolderOpen, Users, FileText, CheckSquare, ArrowRight, TrendingUp, PlusCircle } from 'lucide-react'
import { getMentorDashboard } from '../../api/dashboard'
import StatCard from '../../components/ui/StatCard'
import ProposalCard from '../../components/proposals/ProposalCard'
import PageWrapper from '../../components/layout/PageWrapper'
import { PageSpinner } from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'

export default function MentorDashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['mentor-dashboard'],
    queryFn: () => getMentorDashboard().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />
  const d = data || {}

  return (
    <PageWrapper
      title={`Welcome back${user?.email ? ', ' + user.email.split('@')[0] : ''} 👋`}
      subtitle="Here's your research program activity"
      actions={
        <Link to="/mentor/projects/new" className="btn-primary text-sm gap-2">
          <PlusCircle size={15} /> New project
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total projects"      value={d.total_projects            ?? 0} icon={FolderOpen} color="brand" />
        <StatCard label="Open projects"       value={d.open_projects             ?? 0} icon={TrendingUp} color="teal"  />
        <StatCard label="Pending proposals"   value={d.total_pending_proposals   ?? 0} icon={FileText}   color="amber" />
        <StatCard label="Enrolled students"   value={d.total_enrolled_students   ?? 0} icon={Users}      color="coral" />
      </div>

      {/* Projects overview table */}
      <div className="card mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Projects overview</h2>
          <Link to="/mentor/projects" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
            Manage <ArrowRight size={11} />
          </Link>
        </div>
        {(d.projects || []).length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">
            No projects yet. <Link to="/mentor/projects/new" className="text-brand-600 hover:underline">Create your first →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Project', 'Status', 'Students', 'Proposals', 'Tasks done'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(d.projects || []).map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/projects/${p.id}`} className="font-medium text-gray-900 hover:text-brand-600 transition-colors">{p.title}</Link>
                    </td>
                    <td className="px-5 py-3"><Badge status={p.status} /></td>
                    <td className="px-5 py-3 text-gray-700">{p.enrolled_students}</td>
                    <td className="px-5 py-3">
                      {p.pending_proposals > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                          {p.pending_proposals} pending
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {p.tasks_done}/{p.tasks_total}
                      {p.tasks_total > 0 && (
                        <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-teal-400 rounded-full" style={{ width: `${Math.round(p.tasks_done / p.tasks_total * 100)}%` }} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent proposals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">Pending proposals</h2>
            <Link to="/mentor/proposals" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {(d.recent_proposals || []).length === 0 ? (
            <div className="card p-5 text-center text-sm text-gray-400">No pending proposals.</div>
          ) : (
            <div className="space-y-3">
              {(d.recent_proposals || []).slice(0, 3).map(p => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          )}
        </div>

        {/* Recent remarks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">Recent remarks</h2>
            <Link to="/mentor/remarks" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {(d.recent_remarks || []).length === 0 ? (
            <div className="card p-5 text-center text-sm text-gray-400">No remarks yet.</div>
          ) : (
            <div className="space-y-3">
              {(d.recent_remarks || []).slice(0, 4).map(r => (
                <div key={r.id} className="card p-4 flex gap-3 items-start">
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    r.author_role === 'mentor' ? 'bg-coral-50 text-coral-700' : 'bg-teal-50 text-teal-700'
                  }`}>{r.author_email?.[0]?.toUpperCase()}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-600 truncate">{r.author_email} <span className="text-gray-400 font-normal">· {r.project_title}</span></p>
                    <p className="text-sm text-gray-700 mt-0.5 line-clamp-2">{r.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}