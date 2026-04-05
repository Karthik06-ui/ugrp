import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, PlusCircle, Pencil } from 'lucide-react'
import { listReviews, createReview, updateReview } from '../../api/dashboard'
import { listProjects } from '../../api/projects'
import { getMentorDashboard } from '../../api/dashboard'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s} type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className={`text-2xl transition-colors ${(hover || value) >= s ? 'text-amber-400' : 'text-gray-200'} hover:scale-110 transition-transform`}
        >★</button>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600 self-center">
        {value ? `${value}/5` : 'Select rating'}
      </span>
    </div>
  )
}

export default function WriteReviews() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm] = useState({ project: '', student: '', rating: 0, comment: '' })

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects().then(r => r.data),
  })
  const myProjects = allProjects.filter(p => p.mentor_email === user?.email)

  const { data: dashData } = useQuery({
    queryKey: ['mentor-dashboard'],
    queryFn: () => getMentorDashboard().then(r => r.data),
  })

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['mentor-reviews'],
    queryFn: () => listReviews().then(r => r.data),
  })

  // Build student list from existing tasks (enrolled students proxy)
  const { data: tasks = [] } = useQuery({
    queryKey: ['mentor-tasks', ''],
    queryFn: () => import('../../api/dashboard').then(m => m.listTasks()).then(r => r.data),
  })
  const studentsByProject = tasks.reduce((acc, t) => {
    if (!acc[t.project]) acc[t.project] = []
    if (!acc[t.project].find(s => s.id === t.assigned_to)) {
      acc[t.project].push({ id: t.assigned_to, email: t.assigned_to_email, name: t.assigned_to_name })
    }
    return acc
  }, {})

  const availableStudents = form.project ? (studentsByProject[form.project] || []) : []

  function openCreate() {
    setForm({ project: '', student: '', rating: 0, comment: '' })
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(review) {
    setEditing(review)
    setForm({ project: review.project, student: review.student, rating: review.rating, comment: review.comment || '' })
    setModalOpen(true)
  }

  const createMut = useMutation({
    mutationFn: (d) => createReview({ project: d.project, student: d.student, rating: d.rating, comment: d.comment }),
    onSuccess: () => { toast.success('Review submitted'); setModalOpen(false); qc.invalidateQueries(['mentor-reviews']) },
    onError: e => {
      const err = e.response?.data
      toast.error(err?.student?.[0] || err?.project?.[0] || err?.non_field_errors?.[0] || 'Could not submit review')
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, ...d }) => updateReview(id, d),
    onSuccess: () => { toast.success('Review updated'); setModalOpen(false); qc.invalidateQueries(['mentor-reviews']) },
    onError: () => toast.error('Update failed'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="Write reviews"
      subtitle="Provide formal feedback on your enrolled students"
      actions={
        <button onClick={openCreate} className="btn-primary text-sm gap-2">
          <PlusCircle size={15} /> New review
        </button>
      }
    >
      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews written yet"
          description="Write a formal review to give your students structured feedback on their research contributions."
          action={<button onClick={openCreate} className="btn-primary">Write first review</button>}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.student_email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.project_title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-base ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <button onClick={() => openEdit(r)} className="btn-secondary text-xs flex items-center gap-1">
                    <Pencil size={11} /> Edit
                  </button>
                </div>
              </div>
              {r.comment && (
                <blockquote className="border-l-2 border-amber-300 pl-3 text-sm text-gray-600 italic leading-relaxed">
                  "{r.comment}"
                </blockquote>
              )}
              <p className="text-xs text-gray-400 mt-3">{format(new Date(r.updated_at), 'MMM d, yyyy')}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit review' : 'Write review'}>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!form.rating) { toast.error('Please select a rating'); return }
            if (editing) updateMut.mutate({ id: editing.id, rating: form.rating, comment: form.comment })
            else createMut.mutate(form)
          }}
          className="space-y-4"
        >
          {!editing && (
            <>
              <div>
                <label className="label">Project</label>
                <select value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value, student: '' }))} className="input" required>
                  <option value="">Select project…</option>
                  {myProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Student</label>
                <select value={form.student} onChange={e => setForm(f => ({ ...f, student: e.target.value }))} className="input" required disabled={!form.project}>
                  <option value="">Select enrolled student…</option>
                  {availableStudents.map(s => <option key={s.id} value={s.id}>{s.email}</option>)}
                </select>
                {form.project && availableStudents.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No enrolled students with tasks in this project.</p>
                )}
              </div>
            </>
          )}
          <div>
            <label className="label">Rating</label>
            <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
          </div>
          <div>
            <label className="label">Comments <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
            <textarea
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              className="input min-h-[110px] resize-y"
              placeholder="Describe the student's strengths, areas for improvement, and overall contribution…"
            />
          </div>
          <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn-primary w-full justify-center">
            {createMut.isPending || updateMut.isPending ? 'Saving…' : editing ? 'Update review' : 'Submit review'}
          </button>
        </form>
      </Modal>
    </PageWrapper>
  )
}