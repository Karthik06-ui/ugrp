import { useState, useRef, useEffect } from 'react'
import {
  Paperclip, X, FileText, Image, File, User, Phone, Mail, BookOpen, Hash,
  Users, Check, Plus, Trash2, Loader2, CheckCircle2, AlertCircle,
  ArrowRight, ArrowLeft, Save, Send, GraduationCap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStudentInfo } from '../../api/proposals'
import { useAuth } from '../../hooks/useAuth'

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

const ROLES = [
  { value: 'lead_dev', label: 'Lead Developer' },
  { value: 'frontend_dev', label: 'Frontend Developer' },
  { value: 'backend_dev', label: 'Backend Developer' },
  { value: 'uiux_des', label: 'UI/UX Designer' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'other', label: 'Other' },
]

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(file) {
  if (!file) return File
  if (file.type === 'application/pdf') return FileText
  if (file.type?.startsWith('image/')) return Image
  return File
}

const STEPS = [
  { number: 1, label: 'Selection' },
  { number: 2, label: 'Basics' },
  { number: 3, label: 'Members', cond: (form) => form.application_type === 'team' },
  { number: 4, label: 'Content' },
  { number: 5, label: 'Review' }
]

export default function ProposalForm({ projectId, proposal, onSubmit, loading }) {
  const { user } = useAuth()
  const inputRef = useRef(null)

  // Initialize form state
  const [form, setForm] = useState(() => {
    if (proposal) {
      return {
        application_type:     proposal.application_type || 'individual',
        team_name:            proposal.team?.name || '',
        applicant_name:       proposal.applicant_name || '',
        applicant_roll_no:    proposal.applicant_roll_no || '',
        applicant_contact:    proposal.applicant_contact || '',
        applicant_email:      proposal.applicant_email || proposal.student_email || '',
        applicant_department: proposal.applicant_department || '',
        applicant_year:       proposal.applicant_year || '',
        message:              proposal.message || '',
        members:              proposal.team?.members?.map(m => ({
          name: m.name || '',
          email: m.email || '',
          roll_number: m.roll_number || '',
          department: m.department || '',
          role: m.role || 'other',
          profileFound: !!m.user,
        })) || [],
      }
    }
    return {
      application_type:     'individual',
      team_name:            '',
      applicant_name:       '',
      applicant_roll_no:    '',
      applicant_contact:    '',
      applicant_email:      user?.email || '',
      applicant_department: '',
      applicant_year:       '',
      message:              '',
      members:              [],
    }
  })

  const [step, setStep] = useState(1)
  const [attachment, setAttachment] = useState(null)
  const [fileError, setFileError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState({})
  const [checkingEmail, setCheckingEmail] = useState({}) // index -> bool
  const [existingAttachmentUrl, setExistingAttachmentUrl] = useState(proposal?.attachment_url || null)

  // Auto-fill logged-in student details if creating a new proposal
  useEffect(() => {
    if (!proposal && user?.email) {
      getStudentInfo(user.email)
        .then(res => {
          if (res.data) {
            setForm(f => ({
              ...f,
              applicant_name:       res.data.name || f.applicant_name,
              applicant_roll_no:    res.data.roll_number || f.applicant_roll_no,
              applicant_department: res.data.department || f.applicant_department,
              applicant_email:      res.data.email || f.applicant_email,
            }))
          }
        })
        .catch(() => {})
    }
  }, [user?.email, proposal])

  // Get active steps based on individual/team selection
  const activeSteps = STEPS.filter(s => !s.cond || s.cond(form))
  const currentVisualStep = activeSteps.findIndex(s => s.number === step) + 1
  const totalVisualSteps = activeSteps.length

  // Basic Form handlers
  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(errs => ({ ...errs, [name]: '' }))
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
    setExistingAttachmentUrl(null) // replace existing attachment
    if (errors.attachment) setErrors(errs => ({ ...errs, attachment: '' }))
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

  // Member Handlers
  function addMember() {
    setForm(f => ({
      ...f,
      members: [...f.members, { name: '', email: '', roll_number: '', department: '', role: 'other', profileFound: false }]
    }))
    // Clear members-level validation errors when adding a new item
    if (errors.members || errors.memberDetails) {
      setErrors(errs => ({ ...errs, members: '', memberDetails: null }))
    }
  }

  function removeMember(idx) {
    setForm(f => ({
      ...f,
      members: f.members.filter((_, i) => i !== idx)
    }))
    if (errors.memberDetails) {
      const updated = { ...errors.memberDetails }
      delete updated[idx]
      setErrors(errs => ({ ...errs, memberDetails: Object.keys(updated).length ? updated : null }))
    }
  }

  function handleMemberChange(idx, field, value) {
    setForm(f => {
      const updated = [...f.members]
      updated[idx] = { ...updated[idx], [field]: value }
      return { ...f, members: updated }
    })
    
    // Clear individual errors on change
    if (errors.memberDetails?.[idx]?.[field]) {
      const updatedDetails = { ...errors.memberDetails }
      updatedDetails[idx] = { ...updatedDetails[idx] }
      delete updatedDetails[idx][field]
      if (Object.keys(updatedDetails[idx]).length === 0) {
        delete updatedDetails[idx]
      }
      setErrors(errs => ({ ...errs, memberDetails: Object.keys(updatedDetails).length ? updatedDetails : null }))
    }
  }

  // Triggered on Email Input Blur for Team Members
  async function handleEmailBlur(idx) {
    const member = form.members[idx]
    const email = member.email?.trim().toLowerCase()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) return
    
    if (email === form.applicant_email?.trim().toLowerCase()) {
      // Set lead error inside member card
      const updatedDetails = { ...errors.memberDetails }
      updatedDetails[idx] = { ...(updatedDetails[idx] || {}), email: 'Cannot add yourself (Team Lead) as a member.' }
      setErrors(errs => ({ ...errs, memberDetails: updatedDetails }))
      return
    }

    setCheckingEmail(prev => ({ ...prev, [idx]: true }))
    try {
      const res = await getStudentInfo(email)
      if (res.data) {
        // Auto-fill member details
        setForm(f => {
          const updated = [...f.members]
          updated[idx] = {
            ...updated[idx],
            name: res.data.name || updated[idx].name,
            roll_number: res.data.roll_number || updated[idx].roll_number,
            department: res.data.department || updated[idx].department,
            profileFound: true
          }
          return { ...f, members: updated }
        })
      }
    } catch (err) {
      setForm(f => {
        const updated = [...f.members]
        updated[idx] = { ...updated[idx], profileFound: false }
        return { ...f, members: updated }
      })
    } finally {
      setCheckingEmail(prev => ({ ...prev, [idx]: false }))
    }
  }

  // Validation Logic per step
  function validateStep(s) {
    const e = {}

    if (s === 2) {
      if (!form.applicant_name?.trim()) e.applicant_name = 'Name is required'
      if (!form.applicant_roll_no?.trim()) e.applicant_roll_no = 'Roll number is required'
      if (!form.applicant_year) e.applicant_year = 'Year is required'
      if (!form.applicant_department) e.applicant_department = 'Department is required'
      
      if (!form.applicant_email?.trim()) {
        e.applicant_email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(form.applicant_email)) {
        e.applicant_email = 'Enter a valid email address'
      }
      
      if (!form.applicant_contact?.trim()) {
        e.applicant_contact = 'Contact is required'
      } else {
        const digits = form.applicant_contact.replace(/\D/g, '')
        if (digits.length < 10) {
          e.applicant_contact = 'Enter a valid 10-digit contact number'
        }
      }
      
      if (form.application_type === 'team') {
        if (!form.team_name?.trim()) e.team_name = 'Team name is required'
      }
    }

    if (s === 3 && form.application_type === 'team') {
      const totalSize = 1 + form.members.length
      if (totalSize < 2) {
        e.members = 'At least 1 additional team member is required (minimum team size is 2).'
      } else if (totalSize > 10) {
        e.members = 'Maximum team size is 10 (maximum 9 additional members).'
      }

      const memberErrors = {}
      form.members.forEach((m, idx) => {
        const mErr = {}
        if (!m.name?.trim()) mErr.name = 'Name is required'
        if (!m.roll_number?.trim()) mErr.roll_number = 'Roll number is required'
        if (!m.department) mErr.department = 'Department is required'
        if (!m.role) mErr.role = 'Role is required'
        
        if (!m.email?.trim()) {
          mErr.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(m.email)) {
          mErr.email = 'Enter a valid email'
        } else if (m.email.toLowerCase().trim() === form.applicant_email.toLowerCase().trim()) {
          mErr.email = 'Cannot add yourself (Team Lead) as a member'
        } else {
          const dupIdx = form.members.findIndex((other, oidx) => oidx < idx && other.email?.toLowerCase().trim() === m.email?.toLowerCase().trim())
          if (dupIdx !== -1) {
            mErr.email = 'Duplicate email inside the team'
          }
        }

        if (Object.keys(mErr).length > 0) {
          memberErrors[idx] = mErr
        }
      })

      if (Object.keys(memberErrors).length > 0) {
        e.memberDetails = memberErrors
      }
    }

    if (s === 4) {
      if (!attachment && !existingAttachmentUrl) {
        e.attachment = 'Proposal attachment file is required'
      }
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Validate the whole form for final submission
  function validateAll() {
    const e = {}
    
    // Submitter
    if (!form.applicant_name?.trim()) e.applicant_name = 'Name is required'
    if (!form.applicant_roll_no?.trim()) e.applicant_roll_no = 'Roll number is required'
    if (!form.applicant_year) e.applicant_year = 'Year is required'
    if (!form.applicant_department) e.applicant_department = 'Department is required'
    if (!form.applicant_email?.trim()) e.applicant_email = 'Email is required'
    
    if (!form.applicant_contact?.trim()) {
      e.applicant_contact = 'Contact is required'
    } else if (form.applicant_contact.replace(/\D/g, '').length < 10) {
      e.applicant_contact = 'Enter a valid 10-digit number'
    }

    if (form.application_type === 'team') {
      if (!form.team_name?.trim()) e.team_name = 'Team name is required'
      
      const totalSize = 1 + form.members.length
      if (totalSize < 2 || totalSize > 10) {
        e.members = `Team size must be between 2 and 10 members. Current: ${totalSize}.`
      }

      const memberErrors = {}
      form.members.forEach((m, idx) => {
        const mErr = {}
        if (!m.name?.trim()) mErr.name = 'Name is required'
        if (!m.roll_number?.trim()) mErr.roll_number = 'Roll number is required'
        if (!m.department) mErr.department = 'Department is required'
        if (!m.role) mErr.role = 'Role is required'
        if (!m.email?.trim()) mErr.email = 'Email is required'
        
        if (Object.keys(mErr).length > 0) {
          memberErrors[idx] = mErr
        }
      })
      if (Object.keys(memberErrors).length > 0) {
        e.memberDetails = memberErrors
      }
    }

    if (!attachment && !existingAttachmentUrl) {
      e.attachment = 'Proposal attachment file is required'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Submit Proposal
  function handleFinalSubmit(isDraftSubmit) {
    if (!isDraftSubmit && !validateAll()) {
      // Go to Review step if validation fails
      setStep(5)
      return
    }

    const payload = {
      project: projectId,
      application_type:     form.application_type,
      applicant_name:       form.applicant_name,
      applicant_roll_no:    form.applicant_roll_no,
      applicant_contact:    form.applicant_contact,
      applicant_email:      form.applicant_email,
      applicant_department: form.applicant_department,
      applicant_year:       form.applicant_year,
      message:              form.message,
      is_draft:             isDraftSubmit,
    }

    if (proposal?.id) {
      payload.id = proposal.id
    }

    if (form.application_type === 'team') {
      payload.team_name = form.team_name
      payload.members   = form.members.map(m => ({
        name: m.name,
        email: m.email,
        roll_number: m.roll_number,
        department: m.department,
        role: m.role,
      }))
    }

    if (attachment) {
      payload.attachment = attachment
    }

    onSubmit(payload)
  }

  // Navigation handlers
  function handleNext() {
    if (validateStep(step)) {
      if (step === 2 && form.application_type === 'individual') {
        setStep(4)
      } else {
        setStep(step + 1)
      }
    }
  }

  function handleBack() {
    if (step === 4 && form.application_type === 'individual') {
      setStep(2)
    } else {
      setStep(step - 1)
    }
  }

  const FileIcon = fileIcon(attachment)
  const allErrorsList = []
  
  if (errors.applicant_name) allErrorsList.push('Applicant Name is required.')
  if (errors.applicant_roll_no) allErrorsList.push('Applicant Roll Number is required.')
  if (errors.applicant_year) allErrorsList.push('Applicant Academic Year is required.')
  if (errors.applicant_department) allErrorsList.push('Applicant Department is required.')
  if (errors.applicant_contact) allErrorsList.push(errors.applicant_contact)
  if (errors.applicant_email) allErrorsList.push(errors.applicant_email)
  if (errors.team_name) allErrorsList.push('Team Name is required.')
  if (errors.members) allErrorsList.push(errors.members)
  if (errors.memberDetails) allErrorsList.push('Some team members have empty or invalid fields.')
  if (errors.attachment) allErrorsList.push(errors.attachment)

  return (
    <div className="flex flex-col h-full bg-slate-50/20 rounded-2xl">
      
      {/* ── Stepper Header ──────────────────────────────────────────────── */}
      <div className="mb-8 select-none p-4 pb-0 bg-white/40 border-b border-slate-100 rounded-t-2xl">
        <div className="flex items-center justify-between relative px-4 max-w-xl mx-auto pb-4">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-4 h-0.5 bg-brand-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: `${((currentVisualStep - 1) / (totalVisualSteps - 1)) * 100}%`
            }}
          />

          {activeSteps.map((s, idx) => {
            const isCompleted = s.number < step
            const isActive = s.number === step
            const stepNum = idx + 1

            return (
              <div key={s.number} className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    if (s.number < step) {
                      setStep(s.number)
                    } else if (s.number > step) {
                      let canJump = true
                      for (let i = step; i < s.number; i++) {
                        if (activeSteps.some(as => as.number === i) && !validateStep(i)) {
                          canJump = false
                          break
                        }
                      }
                      if (canJump) setStep(s.number)
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                    ${isCompleted
                      ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                      : isActive
                        ? 'bg-white border-brand-600 text-brand-600 shadow-md ring-4 ring-brand-100'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                >
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : stepNum}
                </button>
                <span className={`text-[9px] font-bold uppercase tracking-wider mt-1.5 transition-colors ${
                  isActive ? 'text-brand-600 font-extrabold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Main Form content panel with framer-motion transitions ──────────────── */}
      <div className="flex-1 p-5 min-h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="card p-6 border-slate-100 bg-white"
          >
            
            {/* ── STEP 1: Selection (Individual vs Team) ────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-800">Choose application type</h3>
                  <p className="text-xs text-slate-500 mt-1">Select whether you are applying individually or forming a collaborative squad.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Individual Card */}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, application_type: 'individual', members: [] }))}
                    className={`flex flex-col items-center text-center p-6 border-2 rounded-2xl transition-all duration-300 relative ${
                      form.application_type === 'individual'
                        ? 'border-brand-600 bg-brand-50/50 shadow-md shadow-brand-600/5'
                        : 'border-slate-100 hover:border-brand-200 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    {form.application_type === 'individual' && (
                      <div className="absolute top-3 right-3 bg-brand-600 text-white rounded-full p-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      form.application_type === 'individual' ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <User size={22} />
                    </div>
                    <span className="font-bold text-sm text-slate-800">Apply Individually</span>
                    <span className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      Submit a proposal on your own. You will be the sole contributor and researcher for this project.
                    </span>
                  </button>

                  {/* Team Card */}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, application_type: 'team' }))}
                    className={`flex flex-col items-center text-center p-6 border-2 rounded-2xl transition-all duration-300 relative ${
                      form.application_type === 'team'
                        ? 'border-brand-600 bg-brand-50/50 shadow-md shadow-brand-600/5'
                        : 'border-slate-100 hover:border-brand-200 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    {form.application_type === 'team' && (
                      <div className="absolute top-3 right-3 bg-brand-600 text-white rounded-full p-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      form.application_type === 'team' ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Users size={22} />
                    </div>
                    <span className="font-bold text-sm text-slate-800">Apply as a Team</span>
                    <span className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      Collaborate with up to 9 other students. Assign roles and coordinate your workloads together.
                    </span>
                  </button>

                </div>
              </div>
            )}

            {/* ── STEP 2: Basics (Applicant/Team Lead details & Team Name) ────── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                  <User size={18} className="text-brand-600" />
                  <h3 className="font-bold text-slate-850">
                    {form.application_type === 'team' ? 'Team Lead (You)' : 'Applicant Details'}
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Team Name (if Team chosen) */}
                  {form.application_type === 'team' && (
                    <div className="bg-brand-50/30 p-4 border border-brand-100/50 rounded-xl mb-4">
                      <label className="label text-brand-850 font-bold flex items-center gap-1.5">
                        <Users size={12} className="text-brand-600" /> Team Name *
                      </label>
                      <input
                        name="team_name" value={form.team_name} onChange={handle}
                        className={`input border-brand-200 focus:ring-brand-400/30 ${errors.team_name ? 'border-red-300' : ''}`}
                        placeholder="e.g. Quantum Pioneers"
                      />
                      {errors.team_name && <p className="text-xs text-red-500 mt-1.5">{errors.team_name}</p>}
                    </div>
                  )}

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <label className="label flex items-center gap-1"><GraduationCap size={11} /> Year *</label>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        name="applicant_email" value={form.applicant_email}
                        disabled
                        type="email"
                        className="input bg-slate-50 border-slate-200 text-slate-450 cursor-not-allowed"
                        placeholder="you@college.edu"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Pre-filled with your account email.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Team Members (Dynamic list of collapsible forms) ────── */}
            {step === 3 && form.application_type === 'team' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-brand-600" />
                    <div>
                      <h3 className="font-bold text-slate-850">Team Members</h3>
                      <p className="text-[10px] text-slate-450 mt-0.5">
                        Team Size: <span className="font-bold text-brand-600">{1 + form.members.length} / 10</span> (Lead + Members)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={form.members.length >= 9}
                    className="btn bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-800 text-xs py-1.5 px-3.5 rounded-xl shadow-none"
                  >
                    <Plus size={13} strokeWidth={2.5} /> Add member
                  </button>
                </div>

                {errors.members && (
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{errors.members}</span>
                  </div>
                )}

                {form.members.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200/80">
                    <Users size={28} className="text-slate-350 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-500">No members added yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Click the "Add member" button above to register team members by email.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {form.members.map((member, idx) => {
                      const memberErr = errors.memberDetails?.[idx] || {}
                      
                      return (
                        <div key={idx} className="relative p-5 border border-slate-150/60 rounded-2xl bg-slate-50/20 group hover:border-brand-200 transition-all">
                          {/* Trash Delete button */}
                          <button
                            type="button"
                            onClick={() => removeMember(idx)}
                            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100/40 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="text-xs font-bold text-brand-600/80 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="inline-flex h-5 w-5 bg-brand-100 text-brand-700 items-center justify-center rounded-full text-[10px]">
                              {idx + 1}
                            </span>
                            <span>Team Member details</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Email */}
                            <div className="sm:col-span-2">
                              <label className="label flex items-center gap-1">Email *</label>
                              <div className="relative">
                                <input
                                  type="email"
                                  value={member.email}
                                  onChange={e => handleMemberChange(idx, 'email', e.target.value)}
                                  onBlur={() => handleEmailBlur(idx)}
                                  className={`input pr-8 ${memberErr.email ? 'border-red-300' : ''}`}
                                  placeholder="member@college.edu"
                                />
                                {checkingEmail[idx] && (
                                  <Loader2 size={13} className="absolute right-3 top-3.5 text-brand-600 animate-spin" />
                                )}
                                {!checkingEmail[idx] && member.profileFound && member.email && (
                                  <CheckCircle2 size={13} className="absolute right-3 top-3.5 text-emerald-600" />
                                )}
                              </div>
                              {memberErr.email && <p className="text-[11px] text-red-500 mt-1">{memberErr.email}</p>}
                              
                              {/* Inline status messages for auto-fetch */}
                              {!memberErr.email && member.email && !checkingEmail[idx] && (
                                <p className={`text-[10px] mt-1 flex items-center gap-1 font-semibold ${
                                  member.profileFound ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                  {member.profileFound ? (
                                    <>
                                      <Check size={10} strokeWidth={3} /> Registered profile found & auto-filled
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle size={10} /> Profile not found (will invite to register on signup)
                                    </>
                                  )}
                                </p>
                              )}
                            </div>

                            {/* Name */}
                            <div>
                              <label className="label">Full Name *</label>
                              <input
                                value={member.name}
                                onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                                className={`input ${memberErr.name ? 'border-red-300' : ''}`}
                                placeholder="Member's full name"
                              />
                              {memberErr.name && <p className="text-[11px] text-red-500 mt-1">{memberErr.name}</p>}
                            </div>

                            {/* Roll number */}
                            <div>
                              <label className="label">Roll number *</label>
                              <input
                                value={member.roll_number}
                                onChange={e => handleMemberChange(idx, 'roll_number', e.target.value)}
                                className={`input ${memberErr.roll_number ? 'border-red-300' : ''}`}
                                placeholder="e.g. CS2024002"
                              />
                              {memberErr.roll_number && <p className="text-[11px] text-red-500 mt-1">{memberErr.roll_number}</p>}
                            </div>

                            {/* Department */}
                            <div>
                              <label className="label">Department *</label>
                              <select
                                value={member.department}
                                onChange={e => handleMemberChange(idx, 'department', e.target.value)}
                                className={`input ${memberErr.department ? 'border-red-300' : ''}`}
                              >
                                <option value="">Select department…</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                              {memberErr.department && <p className="text-[11px] text-red-500 mt-1">{memberErr.department}</p>}
                            </div>

                            {/* Role */}
                            <div>
                              <label className="label">Role *</label>
                              <select
                                value={member.role}
                                onChange={e => handleMemberChange(idx, 'role', e.target.value)}
                                className={`input ${memberErr.role ? 'border-red-300' : ''}`}
                              >
                                <option value="">Select role…</option>
                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                              </select>
                              {memberErr.role && <p className="text-[11px] text-red-500 mt-1">{memberErr.role}</p>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Content (Attachment & Message) ────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                  <FileText size={18} className="text-brand-600" />
                  <h3 className="font-bold text-slate-850">Proposal Content</h3>
                </div>

                {/* Cover message */}
                <div>
                  <label className="label">Cover message / Motivation (Optional)</label>
                  <textarea
                    name="message" value={form.message} onChange={handle}
                    className="input min-h-[120px] resize-y"
                    placeholder="Describe your motivation, explain why you're interested in this project, and highlight relevant skills..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1 text-right">{form.message?.length || 0} characters</p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="label flex items-center justify-between">
                    <span>Attachment *</span>
                    <span className="normal-case font-normal text-slate-400">(PDF, DOC, DOCX, JPG, PNG · Max 5MB)</span>
                  </label>

                  {/* Existing file display if editing */}
                  {existingAttachmentUrl && (
                    <div className="flex items-center justify-between p-3 border border-slate-150 rounded-xl bg-slate-50 mb-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-bold min-w-0">
                        <FileText size={14} className="text-brand-600 flex-shrink-0" />
                        <span className="truncate">Saved Draft Attachment</span>
                      </div>
                      <a
                        href={existingAttachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 font-extrabold hover:underline"
                      >
                        View current file
                      </a>
                    </div>
                  )}

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
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => inputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                      className={`flex flex-col items-center justify-center gap-2 px-4 py-8
                        border-2 border-dashed rounded-xl cursor-pointer transition-all
                        ${dragging
                          ? 'border-brand-600 bg-brand-50/50'
                          : 'border-slate-200 bg-slate-50/50 hover:border-brand-400 hover:bg-brand-50/20'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        dragging ? 'bg-brand-100' : 'bg-white border border-slate-150'
                      }`}>
                        <Paperclip size={18} className={dragging ? 'text-brand-600' : 'text-slate-400'} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-700">
                          {dragging ? 'Drop your file here' : 'Drag & drop or click to upload proposal'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Upload resume, cover document, or transcript</p>
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
                  {errors.attachment && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <X size={11} /> {errors.attachment}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 5: Review & Submit (Comprehensive Breakdown) ─────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <h3 className="font-bold text-slate-850">Review Application</h3>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  
                  {/* Validation warnings banner */}
                  {allErrorsList.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                        <AlertCircle size={15} />
                        <span>Validation Warnings (Cannot submit until fixed)</span>
                      </div>
                      <ul className="list-disc pl-5 text-[11px] text-amber-700 space-y-1">
                        {allErrorsList.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* General Box */}
                    <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Type & Project</p>
                      <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                        {form.application_type === 'team' ? (
                          <>
                            <Users size={12} className="text-brand-600" /> Team Application
                          </>
                        ) : (
                          <>
                            <User size={12} className="text-brand-600" /> Individual Application
                          </>
                        )}
                      </p>
                      {form.application_type === 'team' && (
                        <p className="text-xs text-slate-600 mt-1 font-semibold">
                          Team Name: <span className="text-brand-700 font-bold">{form.team_name}</span>
                        </p>
                      )}
                    </div>

                    {/* Attachment status */}
                    <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Proposal Document</p>
                      {attachment ? (
                        <p className="text-xs text-slate-800 mt-1 font-bold truncate flex items-center gap-1.5">
                          <FileText size={12} className="text-brand-600" /> {attachment.name}
                        </p>
                      ) : existingAttachmentUrl ? (
                        <p className="text-xs text-slate-800 mt-1 font-bold flex items-center gap-1.5">
                          <FileText size={12} className="text-brand-600" /> Previously attached file (saved draft)
                        </p>
                      ) : (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <X size={12} /> No file attached
                        </p>
                      )}
                    </div>

                    {/* Submitter Box */}
                    <div className="sm:col-span-2 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {form.application_type === 'team' ? 'Team Lead (Submitter)' : 'Applicant Details'}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-700 mt-2">
                        <p>Name: <span className="font-bold text-slate-900">{form.applicant_name}</span></p>
                        <p>Roll: <span className="font-bold text-slate-900">{form.applicant_roll_no}</span></p>
                        <p>Dept: <span className="font-semibold text-slate-850 truncate">{form.applicant_department}</span></p>
                        <p>Year: <span className="font-semibold text-slate-850">
                          {YEARS.find(y => y.value === form.applicant_year)?.label || `Year ${form.applicant_year}`}
                        </span></p>
                        <p>Contact: <span className="font-semibold text-slate-850">{form.applicant_contact}</span></p>
                        <p className="truncate">Email: <span className="font-semibold text-slate-850">{form.applicant_email}</span></p>
                      </div>
                    </div>

                    {/* Team Members List */}
                    {form.application_type === 'team' && (
                      <div className="sm:col-span-2 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Additional Members ({form.members.length})
                        </p>
                        {form.members.length === 0 ? (
                          <p className="text-xs text-slate-400 mt-1.5 italic">No additional team members added.</p>
                        ) : (
                          <div className="mt-2.5 divide-y divide-slate-150/40">
                            {form.members.map((m, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-800">{m.name || 'Unnamed Member'}</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-50 border border-brand-100 text-brand-700 uppercase tracking-wide">
                                      {ROLES.find(r => r.value === m.role)?.label || m.role}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    {m.roll_number} · {m.department}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate">{m.email}</p>
                                </div>
                                <div className="flex-shrink-0">
                                  {m.profileFound ? (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                                      Registered
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                      Linked later
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Motivation preview */}
                    {form.message && (
                      <div className="sm:col-span-2 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Motivation Preview</p>
                        <p className="text-xs text-slate-650 leading-relaxed italic mt-1.5 whitespace-pre-line border-l-2 border-slate-300 pl-3">
                          "{form.message}"
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer Navigation Actions Panel ────────────────────────────── */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
        
        {/* Back Button */}
        <div>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="btn-secondary text-xs px-4 py-2 font-bold shadow-sm"
            >
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            <span />
          )}
        </div>

        {/* Action button grouping */}
        <div className="flex items-center gap-2">
          {/* Save as Draft Button (only visible from basics page onwards) */}
          {step >= 2 && (
            <button
              type="button"
              onClick={() => handleSaveDraft(true)}
              disabled={loading}
              className="btn bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs px-4 py-2 font-bold shadow-sm flex items-center gap-1.5"
            >
              <Save size={13} /> Save Draft
            </button>
          )}

          {/* Next vs Final Submit */}
          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary text-xs px-4 py-2 font-bold shadow-sm flex items-center gap-1.5"
            >
              Next <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleFinalSubmit(false)}
              disabled={loading || allErrorsList.length > 0}
              className="btn bg-brand-600 hover:bg-brand-800 text-white text-xs px-5 py-2 font-bold shadow-md shadow-brand-600/10 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send size={13} /> Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  )
}