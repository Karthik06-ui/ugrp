import { useState, useRef } from 'react'
import { Paperclip, X, FileText, Image, File } from 'lucide-react'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]
const ALLOWED_EXT_LABEL = 'PDF, DOC, DOCX, JPG, PNG'
const MAX_MB = 5

function fileIcon(file) {
  if (!file) return File
  if (file.type === 'application/pdf') return FileText
  if (file.type.startsWith('image/')) return Image
  return File
}

function formatBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ProposalForm({ projectId, onSubmit, loading }) {
  const [message,    setMessage]    = useState('')
  const [attachment, setAttachment] = useState(null)   // File | null
  const [fileError,  setFileError]  = useState('')
  const [dragging,   setDragging]   = useState(false)
  const inputRef = useRef(null)

  function handleFile(file) {
    setFileError('')

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(`Unsupported file type. Allowed: ${ALLOWED_EXT_LABEL}.`)
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`File too large (${formatBytes(file.size)}). Maximum: ${MAX_MB} MB.`)
      return
    }

    setAttachment(file)
  }

  function onFileInput(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''   // allow re-selecting same file
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function removeFile() {
    setAttachment(null)
    setFileError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ project: projectId, message, attachment })
  }

  const FileIcon = fileIcon(attachment)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Cover message */}
      <div>
        <label className="label">Cover message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="input min-h-[140px] resize-y"
          placeholder="Introduce yourself, explain why you're interested in this project, and highlight relevant skills or experience..."
          required
        />
        <p className="text-xs text-gray-400 mt-1.5">{message.length} characters</p>
      </div>

      {/* File upload */}
      <div>
        <label className="label">
          Attachment
          <span className="ml-1 normal-case font-normal text-gray-400">(optional — resume, transcript, or recommendation)</span>
        </label>

        {attachment ? (
          /* ── File preview pill ─────────────────────────────────────────── */
          <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
              <FileIcon size={18} className="text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-900 truncate">{attachment.name}</p>
              <p className="text-xs text-brand-500 mt-0.5">{formatBytes(attachment.size)}</p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              aria-label="Remove file"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          /* ── Drop zone ─────────────────────────────────────────────────── */
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`
              relative flex flex-col items-center justify-center gap-2 px-4 py-8
              border-2 border-dashed rounded-xl cursor-pointer transition-all
              ${dragging
                ? 'border-brand-400 bg-brand-50'
                : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50'
              }
            `}
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
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={onFileInput}
              className="hidden"
              aria-label="Upload attachment"
            />
          </div>
        )}

        {/* Validation error */}
        {fileError && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X size={11} /> {fileError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="btn-primary w-full justify-center"
      >
        {loading ? 'Submitting…' : 'Submit proposal'}
      </button>
    </form>
  )
}