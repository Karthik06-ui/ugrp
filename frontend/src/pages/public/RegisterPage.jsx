import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, GraduationCap as StudentIcon, BookOpen } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { register } from '../../api/auth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm]       = useState({ email: '', password: '', password2: '', role: 'student' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate    = useNavigate()

  function handle(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    if (form.password !== form.password2) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const { data } = await register(form)
      setAuth({ user_id: data.user_id, email: data.email, role: data.role }, data.access, data.refresh)
      toast.success('Account created! Welcome to UGRP.')
      navigate(data.role === 'student' ? '/student/dashboard' : '/mentor/dashboard', { replace: true })
    } catch (err) {
      const errors = err.response?.data
      const first  = errors && Object.values(errors).flat()[0]
      toast.error(first || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join the Undergraduate Research Program</p>
        </div>

        <div className="card p-8">
          {/* Role selector */}
          <div className="mb-5">
            <label className="label">I am a…</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'student', label: 'Student', desc: 'Browse & apply to projects' },
                { role: 'mentor',  label: 'Mentor',  desc: 'Create & manage projects' },
              ].map(({ role, label, desc }) => (
                <button
                  key={role} type="button"
                  onClick={() => setForm(f => ({ ...f, role }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.role === role
                      ? role === 'student'
                        ? 'border-teal-400 bg-teal-50'
                        : 'border-coral-400 bg-coral-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold text-sm ${form.role === role ? (role === 'student' ? 'text-teal-800' : 'text-coral-800') : 'text-gray-700'}`}>{label}</p>
                  <p className={`text-xs mt-0.5 ${form.role === role ? (role === 'student' ? 'text-teal-600' : 'text-coral-600') : 'text-gray-400'}`}>{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                className="input" placeholder="you@university.edu" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={handle} className="input pr-10" placeholder="Min. 8 characters" required minLength={8} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input name="password2" type="password" value={form.password2} onChange={handle}
                className="input" placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}