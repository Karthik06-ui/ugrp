import { useState, useRef } from 'react'
import { Paperclip, X, FileText, Image, File, User, Phone, Mail, BookOpen, Hash } from 'lucide-react'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]
const ALLOWED_EXT_LABEL = 'PDF, DOC, DOCX, JPG, PNG'
const MAX_MB = 5

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Biotechnology',
  'Mathematics',
  'Physics',
  'Data Science & AI',
  'Chemical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Management Studies',
  'Environmental Science',
]

const YEARS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
]

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(file) {
  if (!file) return File
  if (file.type === 'application/pdf') return FileText
  if (file.type.startsWith('image/')) return Image
  return File
}

export default function ProposalForm({ projectId, onSubmit, loading }) {
  const [form, setForm] = useState({
    applicant_name:       '',
    applicant_roll_no:    '',
    applicant_contact:    '',
    applicant_email:      '',
    applicant_department: '',
    applicant_year:       '',
    message:              '',
  })
  const [attachment, setAttachment] = useState(null)
  const [fileError,  setFileError]  = useState('')
  const [dragging,   setDragging]   = useState(false)
  const [errors,     setErrors]     = useState({})
  const inputRef = useRef(null)

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(e => ({ ...e, [e.target.name]: '' }))
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
    setAttachment(file)
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

  function validate() {
    const e = {}
    if (!form.applicant_name.trim())       e.applicant_name       = 'Name is required.'
    if (!form.applicant_roll_no.trim())    e.applicant_roll_no    = 'Roll number is required.'
    if (!form.applicant_contact.trim())    e.applicant_contact    = 'Contact number is required.'
    else if (form.applicant_contact.replace(/\D/g, '').length < 10)
                                           e.applicant_contact    = 'Enter a valid 10-digit number.'
    if (!form.applicant_email.trim())      e.applicant_email      = 'Email is required.'
    if (!form.applicant_department.trim()) e.applicant_department = 'Department is required.'
    if (!form.applicant_year)              e.applicant_year       = 'Year is required.'
    if (!form.message.trim())              e.message              = 'Cover message is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ project: projectId, ...form, attachment })
  }

  const FileIcon = fileIcon(attachment)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Section: Applicant details ───────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <User size={11} /> Applicant details
        </p>
        <div className="space-y-3">

          {/* Name */}
          <div>
            <label className="label">Full name *</label>
            <input
              name="applicant_name" value={form.applicant_name} onChange={handle}
              className={`input ${errors.applicant_name ? 'border-red-300' : ''}`}
              placeholder="e.g. Arjun Sundaram"
            />
            {errors.applicant_name && <p className="text-xs text-red-500 mt-1">{errors.applicant_name}</p>}
          </div>

          {/* Roll no + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label flex items-center gap-1"><Hash size={10} /> Roll number *</label>
              <input
                name="applicant_roll_no" value={form.applicant_roll_no} onChange={handle}
                className={`input ${errors.applicant_roll_no ? 'border-red-300' : ''}`}
                placeholder="e.g. CS2024001"
              />
              {errors.applicant_roll_no && <p className="text-xs text-red-500 mt-1">{errors.applicant_roll_no}</p>}
            </div>
            <div>
              <label className="label">Year *</label>
              <select
                name="applicant_year" value={form.applicant_year} onChange={handle}
                className={`input ${errors.applicant_year ? 'border-red-300' : ''}`}
              >
                <option value="">Select year…</option>
                {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
              </select>
              {errors.applicant_year && <p className="text-xs text-red-500 mt-1">{errors.applicant_year}</p>}
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="label flex items-center gap-1"><BookOpen size={10} /> Department *</label>
            <select
              name="applicant_department" value={form.applicant_department} onChange={handle}
              className={`input ${errors.applicant_department ? 'border-red-300' : ''}`}
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.applicant_department && <p className="text-xs text-red-500 mt-1">{errors.applicant_department}</p>}
          </div>

          {/* Contact + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label flex items-center gap-1"><Phone size={10} /> Contact *</label>
              <input
                name="applicant_contact" value={form.applicant_contact} onChange={handle}
                className={`input ${errors.applicant_contact ? 'border-red-300' : ''}`}
                placeholder="+91 99999 99999"
              />
              {errors.applicant_contact && <p className="text-xs text-red-500 mt-1">{errors.applicant_contact}</p>}
            </div>
            <div>
              <label className="label flex items-center gap-1"><Mail size={10} /> Email *</label>
              <input
                name="applicant_email" value={form.applicant_email} onChange={handle}
                type="email"
                className={`input ${errors.applicant_email ? 'border-red-300' : ''}`}
                placeholder="you@college.edu"
              />
              {errors.applicant_email && <p className="text-xs text-red-500 mt-1">{errors.applicant_email}</p>}
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* ── Section: Proposal content ────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <FileText size={11} /> Proposal content
        </p>

        {/* Cover message */}
        <div className="mb-4">
          <label className="label">Cover message *</label>
          <textarea
            name="message" value={form.message} onChange={handle}
            className={`input min-h-[130px] resize-y ${errors.message ? 'border-red-300' : ''}`}
            placeholder="Introduce yourself, explain why you're interested in this project, and highlight relevant skills or experience..."
          />
          <div className="flex items-center justify-between mt-1">
            {errors.message
              ? <p className="text-xs text-red-500">{errors.message}</p>
              : <span />
            }
            <p className="text-xs text-gray-400 ml-auto">{form.message.length} characters</p>
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className="label">
            Attachment
            <span className="ml-1 normal-case font-normal text-gray-400">
              (optional — resume, transcript, or recommendation)
            </span>
          </label>

          {attachment ? (
            <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                <FileIcon size={18} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-900 truncate">{attachment.name}</p>
                <p className="text-xs text-brand-500 mt-0.5">{formatBytes(attachment.size)}</p>
              </div>
              <button
                type="button" onClick={() => { setAttachment(null); setFileError('') }}
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
      </div>

      <button
        type="submit" disabled={loading}
        className="btn-primary w-full justify-center py-2.5"
      >
        {loading ? 'Submitting…' : 'Submit proposal'}
      </button>
    </form>
  )
}