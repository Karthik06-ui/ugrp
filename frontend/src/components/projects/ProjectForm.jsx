import { useState } from 'react'
import { Building2, BookOpen } from 'lucide-react'

export default function ProjectForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title:        initial.title        || '',
    description:  initial.description  || '',
    status:       initial.status       || 'open',
    project_type: initial.project_type || 'academic',
    industry_name:initial.industry_name|| '',
    deadline:     initial.deadline     || '',
  })

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: value,
      // Clear industry_name when switching back to academic
      ...(name === 'project_type' && value === 'academic' ? { industry_name: '' } : {}),
    }))
  }

  const isIndustry = form.project_type === 'industry'

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-5">

      {/* ── Project type selector ──────────────────────────────────────── */}
      <div>
        <label className="label">Project type *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              type:  'academic',
              icon:  BookOpen,
              label: 'Academic',
              desc:  'Internal research project',
              active:'border-brand-400 bg-brand-50',
              icon_c:'text-brand-600',
              label_c:'text-brand-800',
              desc_c: 'text-brand-500',
            },
            {
              type:  'industry',
              icon:  Building2,
              label: 'Industry',
              desc:  'Company-sponsored project',
              active:'border-teal-400 bg-teal-50',
              icon_c:'text-teal-600',
              label_c:'text-teal-800',
              desc_c: 'text-teal-500',
            },
          ].map(({ type, icon: Icon, label, desc, active, icon_c, label_c, desc_c }) => (
            <button
              key={type} type="button"
              onClick={() => setForm(f => ({
                ...f,
                project_type: type,
                ...(type === 'academic' ? { industry_name: '' } : {}),
              }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                form.project_type === type
                  ? active
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Icon size={18} className={`mb-2 ${form.project_type === type ? icon_c : 'text-gray-400'}`} />
              <p className={`font-semibold text-sm ${form.project_type === type ? label_c : 'text-gray-700'}`}>
                {label}
              </p>
              <p className={`text-xs mt-0.5 ${form.project_type === type ? desc_c : 'text-gray-400'}`}>
                {desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Industry name (only for industry type) ─────────────────────── */}
      {isIndustry && (
        <div>
          <label className="label">Industry / company name *</label>
          <input
            name="industry_name"
            value={form.industry_name}
            onChange={handle}
            className="input"
            placeholder="e.g. TCS, Infosys, ISRO, Bosch"
            required={isIndustry}
          />
        </div>
      )}

      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div>
        <label className="label">Project title *</label>
        <input
          name="title" value={form.title} onChange={handle}
          className="input"
          placeholder={isIndustry
            ? 'e.g. Predictive Maintenance using IoT'
            : 'e.g. AI-powered literature review tool'}
          required
        />
      </div>

      {/* ── Description ───────────────────────────────────────────────── */}
      <div>
        <label className="label">Description *</label>
        <textarea
          name="description" value={form.description} onChange={handle}
          className="input min-h-[120px] resize-y"
          placeholder={isIndustry
            ? 'Describe the industry problem, scope, expected deliverables, and what students will gain...'
            : 'Describe the project goals, scope, and what students will work on...'}
          required
        />
      </div>

      {/* ── Deadline (recommended for industry) ───────────────────────── */}
      <div>
        <label className="label">
          Deadline
          {isIndustry
            ? <span className="ml-1 normal-case font-normal text-gray-400">(recommended for industry projects)</span>
            : <span className="ml-1 normal-case font-normal text-gray-400">(optional)</span>
          }
        </label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handle}
          className="input"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* ── Status ────────────────────────────────────────────────────── */}
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