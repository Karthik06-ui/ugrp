import { useState, useRef } from 'react'
import { Building2, BookOpen, Paperclip, X, FileText, Image, File } from 'lucide-react'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]
const ALLOWED_EXT_LABEL = 'PDF, DOC, DOCX, JPG, PNG'
const MAX_MB = 20

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ProjectForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    status: initial.status || 'open',
    project_type: initial.project_type || 'academic',
    industry_name: initial.industry_name || '',
    deadline: initial.deadline || '',
  })

  const [document, setDocument] = useState(null)
  const [existingDocUrl, setExistingDocUrl] = useState(initial.document_url || '')
  const [deletedDoc, setDeletedDoc] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [fileError, setFileError] = useState('')
  const inputRef = useRef(null)

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: value,
      // Clear industry_name when switching back to academic
      ...(name === 'project_type' && value === 'academic' ? { industry_name: '' } : {}),
    }))
  }

  function handleFile(file) {
    setFileError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(`Unsupported file. Allowed: ${ALLOWED_EXT_LABEL}.`)
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`File too large (${formatBytes(file.size)}). Max: ${MAX_MB} MB.`)
      return
    }
    setDocument(file)
    setExistingDocUrl('')
    setDeletedDoc(false)
  }

  function onFileInput(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (fileError) return

    const payload = {
      ...form,
      ...(document ? { document } : (deletedDoc ? { document: null } : {}))
    }
    onSubmit(payload)
  }

  const isIndustry = form.project_type === 'industry'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Project type selector ──────────────────────────────────────── */}
      <div>
        <label className="label">Project type *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              type: 'academic',
              icon: BookOpen,
              label: 'Academic',
              desc: 'Internal research project',
              active: 'border-brand-400 bg-brand-50',
              icon_c: 'text-brand-600',
              label_c: 'text-brand-800',
              desc_c: 'text-brand-500',
            },
            {
              type: 'industry',
              icon: Building2,
              label: 'Industry',
              desc: 'Company-sponsored project',
              active: 'border-teal-400 bg-teal-50',
              icon_c: 'text-teal-600',
              label_c: 'text-teal-800',
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
              className={`p-4 rounded-xl border-2 text-left transition-all ${form.project_type === type
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
      {/* <div>
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
      </div> */}

      {/* ── Project details (file attachment) ─────────────────────────── */}
      <div>
        <label className="label">
          Project details
          <span className="ml-1 normal-case font-normal text-gray-400">
            (optional detailed document — PDF, DOC, DOCX, JPG, PNG up to 20 MB)
          </span>
        </label>

        {document || existingDocUrl ? (
          <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
              {document ? (
                document.type === 'application/pdf' ? <FileText size={18} className="text-brand-600" /> :
                document.type.startsWith('image/') ? <Image size={18} className="text-brand-600" /> :
                <File size={18} className="text-brand-600" />
              ) : (
                <FileText size={18} className="text-brand-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-900 truncate">
                {document ? document.name : existingDocUrl.split('/').pop()}
              </p>
              <p className="text-xs text-brand-500 mt-0.5">
                {document ? formatBytes(document.size) : 'Uploaded document'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDocument(null)
                setExistingDocUrl('')
                setDeletedDoc(true)
                setFileError('')
              }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-brand-400
                         hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-7
              border-2 border-dashed rounded-xl cursor-pointer transition-all
              ${dragging
                ? 'border-brand-400 bg-brand-50'
                : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'
              }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              dragging ? 'bg-brand-100' : 'bg-white border border-gray-200'
            }`}>
              <Paperclip size={18} className={dragging ? 'text-brand-600' : 'text-gray-400'} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {dragging ? 'Drop file here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{ALLOWED_EXT_LABEL} · Max {MAX_MB} MB</p>
            </div>
            <input
              ref={inputRef} type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={onFileInput} className="hidden"
            />
          </div>
        )}
        {fileError && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X size={11} /> {fileError}
          </p>
        )}
      </div>

      {/* ── Status ────────────────────────────────────────────────────── */}
      {initial.id && (
        <div>
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={handle} className="input">
            <option value="open">Open — accepting proposals</option>
            <option value="closed">Closed — not accepting proposals</option>
          </select>
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Saving…' : initial.id ? 'Update project' : 'Create project'}
      </button>
    </form>
  )
}