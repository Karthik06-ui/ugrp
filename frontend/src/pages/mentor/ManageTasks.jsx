import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle, Pencil, Trash2, CheckSquare } from 'lucide-react'
import { listTasks, createTask, updateTask, deleteTask } from '../../api/dashboard'
import { listProjects } from '../../api/projects'
import { getMyEnrollments as getMentorEnrollments } from '../../api/enrollments'
import { getMentorDashboard } from '../../api/dashboard'
import TaskCard from '../../components/tasks/TaskCard'
import TaskForm from '../../components/tasks/TaskForm'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function ManageTasks() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [projectFilter, setProjectFilter] = useState('')

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects().then(r => r.data),
  })
  const myProjects = allProjects.filter(p => p.mentor_email === user?.email)

  // Get enrollments for task form (to know which students are in which project)
  const { data: dashData } = useQuery({
    queryKey: ['mentor-dashboard'],
    queryFn: () => getMentorDashboard().then(r => r.data),
  })

  // Build a flat enrollments-like list from dashboard project data
  const enrollmentsForForm = (dashData?.projects || []).flatMap(p =>
    // We don't have per-student detail from dashboard, so we use tasks list to infer
    []
  )

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['mentor-tasks', projectFilter],
    queryFn: () => listTasks(projectFilter ? { project: projectFilter } : {}).then(r => r.data),
  })

  // Collect all enrolled students from existing tasks (unique per project)
  const knownStudents = tasks.reduce((acc, t) => {
    const key = `${t.project}-${t.assigned_to}`
    if (!acc[key]) acc[key] = { student: t.assigned_to, project: t.project, student_email: t.assigned_to_email }
    return acc
  }, {})
  const enrollmentsProxy = Object.values(knownStudents)

  const createMut = useMutation({
    mutationFn: createTask,
    onSuccess: () => { toast.success('Task created'); setCreating(false); qc.invalidateQueries(['mentor-tasks']) },
    onError: e => {
      const err = e.response?.data
      toast.error(err?.assigned_to?.[0] || err?.project?.[0] || 'Could not create task')
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, ...d }) => updateTask(id, d),
    onSuccess: () => { toast.success('Task updated'); setEditing(null); qc.invalidateQueries(['mentor-tasks']) },
    onError: () => toast.error('Update failed'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => { toast.success('Task deleted'); setDeleting(null); qc.invalidateQueries(['mentor-tasks']) },
    onError: () => toast.error('Delete failed'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="Manage tasks"
      subtitle="Create and track tasks for your enrolled students"
      actions={
        <button onClick={() => setCreating(true)} className="btn-primary text-sm gap-2">
          <PlusCircle size={15} /> New task
        </button>
      }
    >
      {/* Project filter */}
      {myProjects.length > 1 && (
        <div className="mb-5">
          <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="input max-w-xs text-sm">
            <option value="">All projects</option>
            {myProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
      )}

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create tasks to assign work to your enrolled students."
          action={<button onClick={() => setCreating(true)} className="btn-primary">Create first task</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              actions={
                <>
                  <button onClick={() => setEditing(t)} className="btn-secondary text-xs flex items-center gap-1.5">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleting(t)} className="btn-danger text-xs flex items-center gap-1.5 ml-auto">
                    <Trash2 size={12} />
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Create new task">
        <TaskForm
          projects={myProjects}
          enrollments={enrollmentsProxy}
          onSubmit={d => createMut.mutate(d)}
          loading={createMut.isPending}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit task">
        {editing && (
          <TaskForm
            projects={myProjects}
            enrollments={enrollmentsProxy}
            initial={editing}
            onSubmit={d => updateMut.mutate({ id: editing.id, ...d })}
            loading={updateMut.isPending}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete task?" size="sm">
        {deleting && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Delete <span className="font-semibold">"{deleting.title}"</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={() => deleteMut.mutate(deleting.id)} disabled={deleteMut.isPending}
                className="btn-danger flex-1 justify-center">
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}    