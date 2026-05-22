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
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
]

export default function MyTasks() {
  const [searchParams] = useSearchParams()
  const projectFilter = searchParams.get('project') || ''
  const [tab, setTab] = useState('all')
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: () => listTasks().then(r => r.data),
  })

  const mut = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onSuccess: () => {
      toast.success('Task updated')
      qc.invalidateQueries(['my-tasks'])
      qc.invalidateQueries(['student-dashboard'])
      setEditing(null)
    },
    onError: () => toast.error('Could not update task'),
  })

  if (isLoading) return <PageSpinner />

  const tasks = (data || []).filter(t => {
    const byProject = projectFilter ? String(t.project) === projectFilter : true
    const byStatus = tab === 'all' ? true : t.status === tab
    return byProject && byStatus
  })

  const counts = (data || []).reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  }, {})

  return (
    <PageWrapper title="My tasks" subtitle="Tasks assigned to you by your mentors">
      {/* Ambient glow container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[45%] rounded-full bg-sky-400/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-8 bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit shadow-[0_2px_8px_rgba(15,23,42,0.01)] relative z-10">
        {STATUS_TABS.map(({ key, label }) => {
          const count = key === 'all' ? (data || []).length : (counts[key] || 0)
          const isActive = tab === key

          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${isActive
                  ? 'bg-white text-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100/50'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/30'}
              `}
            >
              {label}
              {count > 0 && (
                <span className={`
                  inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                  rounded-full text-[10px] font-extrabold transition-colors
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200/80 text-slate-550'}
                `}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks here"
          description={tab === 'all' ? 'Your mentor will assign tasks once you are enrolled in a project.' : `No ${tab.replace('_', ' ')} tasks.`}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {tasks.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              actions={
                t.status !== 'done' && (
                  <>
                    {t.status === 'todo' && (
                      <button
                        onClick={() => mut.mutate({ id: t.id, status: 'in_progress' })}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-650 bg-indigo-50 hover:bg-indigo-100/60 border border-indigo-100/40 px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Start
                      </button>
                    )}
                    {t.status === 'in_progress' && (
                      <button
                        onClick={() => mut.mutate({ id: t.id, status: 'done' })}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 border border-emerald-100/40 px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Mark done
                      </button>
                    )}
                    <button
                      onClick={() => setEditing(t)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-150 hover:bg-slate-100 px-3.5 py-1.5 rounded-xl transition-all ml-auto"
                    >
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
          <div className="space-y-4 pt-1">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Task Title</p>
              <p className="text-[14px] text-slate-900 font-extrabold leading-snug">{editing.title}</p>
            </div>
            <div className="h-px bg-slate-100 my-4" />
            <div className="space-y-2.5">
              {['todo', 'in_progress', 'done'].map(s => (
                <button
                  key={s}
                  onClick={() => mut.mutate({ id: editing.id, status: s })}
                  disabled={editing.status === s || mut.isPending}
                  className={`w-full text-left px-5 py-4 rounded-[18px] border text-xs font-bold transition-all relative ${editing.status === s
                      ? 'bg-indigo-50/70 border-indigo-200 text-indigo-700 shadow-sm'
                      : 'bg-white border-slate-150 text-slate-750 hover:bg-slate-50'
                    }`}
                >
                  {s === 'todo' ? 'To do' : s === 'in_progress' ? 'In progress' : 'Done'}
                  {editing.status === s && (
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-500 text-[10px] font-bold uppercase tracking-wider">
                      current
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}