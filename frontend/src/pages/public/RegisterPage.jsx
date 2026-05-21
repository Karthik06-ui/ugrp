import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Eye,
  EyeOff,
  User,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { register } from '../../api/auth'

import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    password2: '',
    role: 'student',
  })

  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setAuth } = useAuth()

  const navigate = useNavigate()

  function handle(e) {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }))
  }

  async function submit(e) {
    e.preventDefault()

    if (form.password !== form.password2) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { data } = await register(form)

      setAuth(
        {
          user_id: data.user_id,
          email: data.email,
          role: data.role,
        },
        data.access,
        data.refresh
      )

      toast.success('Account created successfully!')

      navigate(
        data.role === 'student'
          ? '/student/dashboard'
          : '/mentor/dashboard',
        { replace: true }
      )

    } catch (err) {
      const errors = err.response?.data
      const first = errors && Object.values(errors).flat()[0]

      toast.error(first || 'Registration failed')

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#06131F] relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-[-180px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />

      </div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-14 border-r border-white/5">

          {/* LOGO */}
          <div>

            <h1
              className="text-white"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '54px',
                letterSpacing: '8px',
                lineHeight: 1,
              }}
            >
              KREST
            </h1>

            <p className="text-cyan-200/60 text-xs uppercase tracking-[0.35em] mt-2">
              Research Ecosystem
            </p>

          </div>

          {/* HERO */}
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-sm mb-8">
              <Sparkles size={16} />
              Innovation Through Research
            </div>

            <h2 className="text-white text-6xl font-semibold leading-[1.02] tracking-[-0.06em]">
              Build ideas.
              <br />
              Collaborate deeply.
              <br />
              Research fearlessly.
            </h2>

            <p className="mt-8 text-slate-400 text-lg leading-relaxed">
              Join the KREST ecosystem to access mentorship,
              interdisciplinary projects, research programs,
              and academic innovation.
            </p>

            <div className="mt-10 flex items-center gap-8">

              <div>
                <h3 className="text-white text-3xl font-semibold">
                  250+
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Active Researchers
                </p>
              </div>

              <div className="w-px h-12 bg-white/10" />

              <div>
                <h3 className="text-white text-3xl font-semibold">
                  40+
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Research Domains
                </p>
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="text-sm text-slate-500">
            © 2026 KREST Research Ecosystem
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="lg:hidden text-center mb-10">

              <h1
                className="text-white"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '48px',
                  letterSpacing: '7px',
                  lineHeight: 1,
                }}
              >
                KREST
              </h1>

              <p className="text-cyan-200/60 text-[11px] uppercase tracking-[0.3em] mt-2">
                Research Ecosystem
              </p>

            </div>

            {/* CARD */}
            <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-[32px] p-8 shadow-2xl">

              {/* HEADER */}
              <div className="mb-8">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6">
                  <GraduationCap size={28} className="text-white" />
                </div>

                <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white">
                  Create account
                </h2>

                <p className="text-slate-400 mt-3 leading-relaxed">
                  Join KREST and start your research journey.
                </p>

              </div>

              {/* ROLE SELECTOR */}
              <div className="mb-6">

                <label className="text-sm text-slate-300 mb-3 block">
                  Select your role
                </label>

                <div className="grid grid-cols-2 gap-4">

                  {[
                    {
                      role: 'student',
                      label: 'Student',
                      desc: 'Explore projects',
                      icon: BookOpen,
                    },
                    {
                      role: 'mentor',
                      label: 'Mentor',
                      desc: 'Guide researchers',
                      icon: User,
                    },
                  ].map(item => {
                    const Icon = item.icon

                    const active = form.role === item.role

                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() =>
                          setForm(f => ({
                            ...f,
                            role: item.role,
                          }))
                        }
                        className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                          active
                            ? 'border-cyan-400/40 bg-cyan-400/10'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
                        }`}
                      >

                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                            active
                              ? 'bg-cyan-400 text-black'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          <Icon size={18} />
                        </div>

                        <h3
                          className={`font-semibold ${
                            active
                              ? 'text-white'
                              : 'text-slate-300'
                          }`}
                        >
                          {item.label}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {item.desc}
                        </p>

                      </button>
                    )
                  })}

                </div>

              </div>

              {/* FORM */}
              <form onSubmit={submit} className="space-y-5">

                {/* EMAIL */}
                <div>

                  <label className="text-sm text-slate-300 mb-2 block">
                    Institutional Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handle}
                    required
                    placeholder="researcher@university.edu"
                    className="w-full h-14 rounded-2xl bg-white/[0.05]
                    border border-white/10 px-5 text-white
                    placeholder:text-slate-500
                    focus:outline-none focus:ring-2
                    focus:ring-cyan-400/40 focus:border-cyan-400/30
                    transition-all"
                  />

                </div>

                {/* PASSWORD */}
                <div>

                  <label className="text-sm text-slate-300 mb-2 block">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      name="password"
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={handle}
                      required
                      minLength={8}
                      placeholder="Minimum 8 characters"
                      className="w-full h-14 rounded-2xl bg-white/[0.05]
                      border border-white/10 px-5 pr-14 text-white
                      placeholder:text-slate-500
                      focus:outline-none focus:ring-2
                      focus:ring-cyan-400/40 focus:border-cyan-400/30
                      transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2
                      text-slate-400 hover:text-white transition-colors"
                    >
                      {showPw ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}
                <div>

                  <label className="text-sm text-slate-300 mb-2 block">
                    Confirm Password
                  </label>

                  <input
                    name="password2"
                    type="password"
                    value={form.password2}
                    onChange={handle}
                    required
                    placeholder="Repeat your password"
                    className="w-full h-14 rounded-2xl bg-white/[0.05]
                    border border-white/10 px-5 text-white
                    placeholder:text-slate-500
                    focus:outline-none focus:ring-2
                    focus:ring-cyan-400/40 focus:border-cyan-400/30
                    transition-all"
                  />

                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl
                  bg-gradient-to-r from-cyan-500 to-blue-500
                  hover:scale-[1.01] active:scale-[0.99]
                  transition-all duration-300
                  text-white font-semibold
                  shadow-lg shadow-cyan-500/20
                  flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Creating account...'
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>

              {/* FOOTER */}
              <div className="mt-8 pt-6 border-t border-white/10">

                <p className="text-center text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Sign in
                  </Link>
                </p>

                <div className="mt-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 p-4">

                  <p className="text-xs font-medium text-cyan-300 mb-1">
                    Note
                  </p>

                  <p className="text-xs leading-relaxed text-slate-400">
                    Use your institutional email credentials
                    to access research programs and collaborations.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}