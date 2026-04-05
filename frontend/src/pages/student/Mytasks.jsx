import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { CheckSquare } from 'lucide-react'
import { listTasks, updateTask } from '../../api/dashboard'
import TaskCard from '../../components/tasks/TaskCard'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const STATUS_TABS = [
  { key: 'all',         label: 'All' },
  { key: 'todo',        label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done',        label: 'Done' },
]

export default function MyTasks() {
  const [searchParams] = useSearchParams()
  const projectFilter  = searchParams.get('project') || ''
  const [tab, setTab]  = useState('all')
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: () => listTasks().then(r => r.data),
  })

  const mut = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: () => { toast.success('Task updated'); qc.invalidateQueries(['my-tasks']); qc.invalidateQueries(['student-dashboard']); setEditing(null) },
    onError: () => toast.error('Could not update task'),
  })

  if (isLoading) return <PageSpinner />

  const tasks = (data || []).filter(t => {
    const byProject = projectFilter ? String(t.project) === projectFilter : true
    const byStatus  = tab === 'all' ? true : t.status === tab
    return byProject && byStatus
  })

  const counts = (data || []).reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc }, {})

  return (
    <PageWrapper title="My tasks" subtitle="Tasks assigned to you by your mentors">
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
        {STATUS_TABS.map(({ key, label }) => {
          const count = key === 'all' ? (data || []).length : (counts[key] || 0)
          return (
            <button
              key={key} onClick={() => setTab(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                  tab === key ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks here"
          description={tab === 'all' ? 'Your mentor will assign tasks once you are enrolled in a project.' : `No ${tab.replace('_',' ')} tasks.`}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              actions={
                t.status !== 'done' && (
                  <>
                    {t.status === 'todo' && (
                      <button onClick={() => mut.mutate({ id: t.id, status: 'in_progress' })}
                        className="btn-secondary text-xs">Start</button>
                    )}
                    {t.status === 'in_progress' && (
                      <button onClick={() => mut.mutate({ id: t.id, status: 'done' })}
                        className="btn-success text-xs">Mark done</button>
                    )}
                    <button onClick={() => setEditing(t)} className="btn-secondary text-xs ml-auto">
                      Change status
                    </button>
                  </>
                )
              }
            />
          ))}
        </div>
      )}

      {/* Quick status change modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Update task status" size="sm">
        {editing && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">{editing.title}</p>
            {['todo', 'in_progress', 'done'].map(s => (
              <button
                key={s}
                onClick={() => mut.mutate({ id: editing.id, status: s })}
                disabled={editing.status === s || mut.isPending}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  editing.status === s
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {s === 'todo' ? 'To do' : s === 'in_progress' ? 'In progress' : 'Done'}
                {editing.status === s && <span className="ml-2 text-brand-400 text-xs">— current</span>}
              </button>
            ))}
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}