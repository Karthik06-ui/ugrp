import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle, Pencil, Trash2, FolderOpen } from 'lucide-react'
import { listProjects, updateProject, deleteProject } from '../../api/projects'
import { useAuth } from '../../hooks/useAuth'
import ProjectCard from '../../components/projects/ProjectCard'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import ProjectForm from '../../components/projects/ProjectForm'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function MyProjects() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [editing, setEditing]     = useState(null)
  const [deleting, setDeleting]   = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects().then(r => r.data),
  })

  const mine = (data || []).filter(p => p.mentor_email === user?.email)

  const updateMut = useMutation({
    mutationFn: ({ id, ...d }) => updateProject(id, d),
    onSuccess: () => { toast.success('Project updated'); setEditing(null); qc.invalidateQueries(['projects']) },
    onError: e => toast.error(e.response?.data?.detail || 'Update failed'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => { toast.success('Project deleted'); setDeleting(null); qc.invalidateQueries(['projects']); qc.invalidateQueries(['mentor-dashboard']) },
    onError: () => toast.error('Delete failed'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="My projects"
      subtitle={`${mine.length} project${mine.length !== 1 ? 's' : ''} created`}
      actions={
        <Link to="/mentor/projects/new" className="btn-primary text-sm gap-2">
          <PlusCircle size={15} /> New project
        </Link>
      }
    >
      {mine.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first research project and start accepting student proposals."
          action={<Link to="/mentor/projects/new" className="btn-primary">Create project</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mine.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              actions={
                <>
                  <button onClick={() => setEditing(p)} className="btn-secondary text-xs flex items-center gap-1.5">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleting(p)} className="btn-danger text-xs flex items-center gap-1.5 ml-auto">
                    <Trash2 size={12} /> Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit project">
        {editing && (
          <ProjectForm
            initial={editing}
            onSubmit={d => updateMut.mutate({ id: editing.id, ...d })}
            loading={updateMut.isPending}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete project?" size="sm">
        {deleting && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold">"{deleting.title}"</span>?
              This will also remove all proposals and enrollments for this project.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button
                onClick={() => deleteMut.mutate(deleting.id)}
                disabled={deleteMut.isPending}
                className="btn-danger flex-1 justify-center"
              >
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}