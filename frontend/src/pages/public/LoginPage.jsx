import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { login } from '../../api/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || null

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form)
      setAuth(
        { user_id: data.user_id, email: data.email, role: data.role },
        data.access,
        data.refresh
      )
      toast.success('Welcome back!')
      const dest =
        from ||
        (data.role === 'student'
          ? '/student/dashboard'
          : '/mentor/dashboard')
      navigate(dest, { replace: true })
    } catch (err) {
      toast.error(
        err.response?.data?.non_field_errors?.[0] || 'Invalid credentials'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">

        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap size={26} className="text-white" />
          </div>

          <h1 className="text-3xl font-semibold text-white">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to your UGRP account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Email address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              required
              autoFocus
              placeholder="you@university.edu"
              className="w-full bg-white/10 border border-white/10 text-white placeholder-gray-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={handle}
                required
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/10 text-white placeholder-gray-400 rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 my-6"></div>

        {/* Demo Credentials */}
        <div className="text-xs text-gray-400 space-y-1">
          <p className="text-gray-300 font-medium">Fyi</p>
          <p>Kindly use your institution credentials to login/signup</p>
        </div>
      </div>
    </div>
  )
}