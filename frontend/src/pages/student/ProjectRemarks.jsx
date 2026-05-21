import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Trash2 } from 'lucide-react'
import { listRemarks, createRemark, deleteRemark } from '../../api/dashboard'
import { getMyEnrollments } from '../../api/enrollments'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function ProjectRemarks() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [selectedProject, setSelectedProject] = useState('')
  const [content, setContent] = useState('')

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => getMyEnrollments().then(r => r.data),
  })

  const { data: remarks = [], isLoading } = useQuery({
    queryKey: ['remarks', selectedProject],
    queryFn: () => listRemarks(selectedProject ? { project: selectedProject } : {}).then(r => r.data),
  })

  const addMut = useMutation({
    mutationFn: createRemark,
    onSuccess: () => { toast.success('Remark posted'); setContent(''); qc.invalidateQueries(['remarks']) },
    onError: e => toast.error(e.response?.data?.detail || 'Could not post remark'),
  })

  const delMut = useMutation({
    mutationFn: deleteRemark,
    onSuccess: () => { toast.success('Remark deleted'); qc.invalidateQueries(['remarks']) },
    onError: () => toast.error('Could not delete remark'),
  })

  return (
    <PageWrapper title="Project remarks" subtitle="Progress notes and updates from your project teams">
      {/* Project filter */}
      <div className="mb-5">
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All enrolled projects</option>
          {enrollments.map(e => (
            <option key={e.project} value={e.project}>{e.project_title}</option>
          ))}
        </select>
      </div>

      {/* Post remark */}
      <div className="card p-4 mb-6">
        <label className="label">Post a remark</label>
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            {!selectedProject && enrollments.length > 1 && (
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="input text-sm"
              >
                <option value="">Select project for this remark…</option>
                {enrollments.map(e => (
                  <option key={e.project} value={e.project}>{e.project_title}</option>
                ))}
              </select>
            )}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="input min-h-[80px] resize-none"
              placeholder="Share a progress update, milestone, or question with your team…"
            />
          </div>
          <button
            onClick={() => {
              const proj = selectedProject || (enrollments.length === 1 ? String(enrollments[0].project) : '')
              if (!proj) { toast.error('Select a project first'); return }
              if (!content.trim()) return
              addMut.mutate({ project: proj, content })
            }}
            disabled={!content.trim() || addMut.isPending}
            className="btn-primary self-end px-4"
          >
            Post
          </button>
        </div>
      </div>

      {isLoading ? <PageSpinner /> : remarks.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No remarks yet" description="Be the first to post a progress note on this project." />
      ) : (
        <div className="space-y-3">
          {remarks.map(r => (
            <div key={r.id} className="card p-4 flex gap-3">
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                r.author_role === 'mentor' ? 'bg-coral-50 text-coral-700' : 'bg-teal-50 text-teal-700'
              }`}>
                {r.author_email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-gray-700">{r.author_email}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                    r.author_role === 'mentor'
                      ? 'bg-coral-50 text-coral-700 border-coral-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}>{r.author_role}</span>
                  <span className="text-[10px] text-gray-400">{r.project_title}</span>
                  <span className="text-[10px] text-gray-300">· {format(new Date(r.created_at), 'MMM d, h:mm a')}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{r.content}</p>
              </div>
              {r.author === user?.user_id && (
                <button
                  onClick={() => delMut.mutate(r.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors self-start mt-1 flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}