import { useState } from 'react'

export default function ProjectForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title:       initial.title       || '',
    description: initial.description || '',
    status:      initial.status      || 'open',
  })

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Project title</label>
        <input name="title" value={form.title} onChange={handle}
          className="input" placeholder="e.g. AI-powered literature review tool" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={handle}
          className="input min-h-[120px] resize-y" placeholder="Describe the project goals, scope, and what students will work on..." required />
      </div>
      <div>
        <label className="label">Status</label>
        <select name="status" value={form.status} onChange={handle} className="input">
          <option value="open">Open — accepting proposals</option>
          <option value="closed">Closed — not accepting proposals</option>
        </select>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Saving…' : initial.id ? 'Update project' : 'Create project'}
      </button>
    </form>
  )
}