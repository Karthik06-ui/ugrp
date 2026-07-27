import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Mail,
  Building2,
  Hash,
  Phone,
  FileText,
  Lightbulb,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import { submitOwnStatement } from '../../api/proposals'

export default function OwnStatementPage() {
  const [form, setForm] = useState({
    roll_no: '',
    name: '',
    dept: '',
    phone_number: '',
    email: '',
    statement: '',
    description: '',
  })
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  function handleInputChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0]
    setApiError('')
    if (errors.detailed_document) {
      setErrors(prev => ({ ...prev, detailed_document: '' }))
    }

    if (!selectedFile) {
      setFile(null)
      return
    }

    // Size limit check (20 MB)
    const MAX_SIZE = 20 * 1024 * 1024
    if (selectedFile.size > MAX_SIZE) {
      setErrors(prev => ({
        ...prev,
        detailed_document: 'Document size exceeds the 20 MB limit.',
      }))
      setFile(null)
      return
    }

    // Format check
    const allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip']
    const ext = selectedFile.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) {
      setErrors(prev => ({
        ...prev,
        detailed_document: `Unsupported format. Allowed formats: ${allowed.join(', ')}`,
      }))
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')

    // Client-side validations
    const tempErrors = {}
    if (!form.name.trim()) tempErrors.name = 'Full name is required.'
    if (!form.email.trim()) {
      tempErrors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = 'Please enter a valid email address.'
    }
    if (!form.roll_no.trim()) tempErrors.roll_no = 'Roll number is required.'
    if (!form.dept.trim()) tempErrors.dept = 'Department is required.'
    if (!form.phone_number.trim()) {
      tempErrors.phone_number = 'Phone number is required.'
    } else if (!/^[0-9+\s-]{8,20}$/.test(form.phone_number.trim())) {
      tempErrors.phone_number = 'Please enter a valid phone number.'
    }
    if (!form.statement.trim()) tempErrors.statement = 'Research statement title is required.'
    if (!form.description.trim()) tempErrors.description = 'Project description is required.'

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors)
      // Scroll to first error
      const firstErrorKey = Object.keys(tempErrors)[0]
      const el = document.getElementsByName(firstErrorKey)[0]
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        detailed_document: file,
      }
      await submitOwnStatement(payload)
      setSuccess(true)
    } catch (err) {
      const respData = err.response?.data
      if (respData && typeof respData === 'object') {
        setErrors(respData)
      } else {
        setApiError(
          respData?.detail ||
          'Failed to submit your statement. Please verify your details and try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#071019] text-white flex flex-col relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Navbar space simulation */}
      <div className="h-16 border-b border-white/5 bg-[#071019]/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <span className="text-sm font-semibold tracking-wider text-cyan-400">KREST PROPOSE</span>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 relative z-10">
        {success ? (
          /* SUCCESS VIEW */
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-2xl animate-fade-in-up mt-10">
            <div className="w-20 h-20 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="text-cyan-400" size={40} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Submission Successful!</h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Thank you, <strong>{form.name}</strong>. Your research statement <strong>"{form.statement}"</strong> has been successfully recorded in our database. 
              <br />
              <span className="text-sm mt-3 block text-white/50">
                We'll review your proposal details and reach out to you at <strong>{form.email}</strong>.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/"
                className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-cyan-300 transition duration-300 text-center"
              >
                Go to Home
              </Link>
              <button
                onClick={() => {
                  setSuccess(false)
                  setForm({
                    roll_no: '',
                    name: '',
                    dept: '',
                    phone_number: '',
                    email: '',
                    statement: '',
                    description: '',
                  })
                  setFile(null)
                  setErrors({})
                }}
                className="border border-white/10 bg-white/5 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition duration-300 text-center"
              >
                Submit Another Statement
              </button>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <div className="animate-fade-in-up">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Lightbulb size={12} /> Custom Project Idea
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">
                Start with your own statement
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                Have a unique research interest? Fill out the details below to propose your own project statement and upload a supporting specification document.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {apiError && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-sm text-red-400">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* Section 1: Student Information */}
                <div>
                  <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
                    1. Student Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <User size={16} />
                        </div>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition ${
                            errors.name ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="Karthik S"
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-400 mt-2">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <Mail size={16} />
                        </div>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition ${
                            errors.email ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="karthik@kct.ac.in"
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-400 mt-2">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Roll Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <Hash size={16} />
                        </div>
                        <input
                          name="roll_no"
                          value={form.roll_no}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition ${
                            errors.roll_no ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="22BEC001"
                        />
                      </div>
                      {errors.roll_no && <p className="text-xs text-red-400 mt-2">{errors.roll_no}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Department / Branch *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <Building2 size={16} />
                        </div>
                        <input
                          name="dept"
                          value={form.dept}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition ${
                            errors.dept ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="Electronics and Communication Engineering"
                        />
                      </div>
                      {errors.dept && <p className="text-xs text-red-400 mt-2">{errors.dept}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <Phone size={16} />
                        </div>
                        <input
                          name="phone_number"
                          value={form.phone_number}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition ${
                            errors.phone_number ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      {errors.phone_number && (
                        <p className="text-xs text-red-400 mt-2">{errors.phone_number}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Statement Details */}
                <div>
                  <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
                    2. Proposal Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Research Statement / Project Title *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
                          <Lightbulb size={16} />
                        </div>
                        <input
                          name="statement"
                          value={form.statement}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition ${
                            errors.statement ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="e.g., IoT-based assistive technology for DHH students"
                        />
                      </div>
                      {errors.statement && <p className="text-xs text-red-400 mt-2">{errors.statement}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        Description *
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-4 text-white/30">
                          <FileText size={16} />
                        </div>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition min-h-[160px] resize-y ${
                            errors.description ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="Describe the research objective, methodology, social impact, and required timeline..."
                        />
                      </div>
                      {errors.description && (
                        <p className="text-xs text-red-400 mt-2">{errors.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Supporting Document */}
                <div>
                  <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
                    3. Supporting Document
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                      Detailed Document (PDF, Word, or ZIP - Max 20MB)
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition duration-300">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-10 w-10 text-white/40" />
                        <div className="flex text-sm text-white/60">
                          <label className="relative cursor-pointer rounded-md font-semibold text-cyan-400 hover:text-cyan-300 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-white/40">
                          PDF, DOC, DOCX, ZIP, JPG, PNG up to 20MB
                        </p>
                      </div>
                    </div>
                    {file && (
                      <div className="mt-3 flex items-center justify-between bg-cyan-400/10 border border-cyan-400/20 px-4 py-2.5 rounded-xl text-sm">
                        <span className="text-cyan-400 font-medium truncate max-w-[80%]">
                          {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-white/40 hover:text-white text-xs font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {errors.detailed_document && (
                      <p className="text-xs text-red-400 mt-2">{errors.detailed_document}</p>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-400 text-black font-semibold py-4 rounded-xl hover:bg-cyan-300 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 text-base shadow-lg shadow-cyan-400/10"
                  >
                    {loading ? 'Submitting proposal...' : <><Send size={18} /> Submit Statement</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
