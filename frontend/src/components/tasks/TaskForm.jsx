import { useState } from 'react'

export default function TaskForm({ projects = [], enrollments = [], initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    project:     initial.project     || '',
    assigned_to: initial.assigned_to || '',
    title:       initial.title       || '',
    description: initial.description || '',
    status:      initial.status      || 'todo',
    due_date:    initial.due_date     || '',
  })

  // Filter enrolled students for the selected project
  const students = enrollments.filter(e => String(e.project) === String(form.project))

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value, ...(name === 'project' ? { assigned_to: '' } : {}) }))
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Project</label>
        <select name="project" value={form.project} onChange={handle} className="input" required>
          <option value="">Select project…</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Assign to (enrolled student)</label>
        <select name="assigned_to" value={form.assigned_to} onChange={handle} className="input" required disabled={!form.project}>
          <option value="">Select student…</option>
          {students.map(e => (
            <option key={e.student} value={e.student}>{e.student_email}</option>
          ))}
        </select>
        {form.project && students.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">No enrolled students in this project yet.</p>
        )}
      </div>
      <div>
        <label className="label">Task title</label>
        <input name="title" value={form.title} onChange={handle} className="input" placeholder="e.g. Literature review on NLP" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={handle} className="input min-h-[90px] resize-y" placeholder="Describe what needs to be done…" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={handle} className="input">
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="label">Due date (optional)</label>
          <input type="date" name="due_date" value={form.due_date} onChange={handle} className="input" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Saving…' : initial.id ? 'Update task' : 'Create task'}
      </button>
    </form>
  )
}