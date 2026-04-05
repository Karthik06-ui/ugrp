import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../api/axios'

const contactInfo = [
  { icon: Mail,    label: 'Email',        value: 'student.research@kct.ac.in',      sub: 'We respond within 24 hours'  },
  { icon: Phone,   label: 'Phone',        value: '+91 9080553227',         sub: 'Mon–Fri, 9 am – 5 pm'       },
  { icon: MapPin,  label: 'Location',     value: 'D-Block, Room 201', sub: 'Ft BLock, Ground Floor'   },
  { icon: Clock,   label: 'Office hours', value: '9:00 AM – 5:00 PM',       sub: 'Monday to Friday'            },
]

const topics = [
  'General enquiry',
  'Student registration',
  'Mentor onboarding',
  'Project support',
  'Technical issue',
  'Blog / content',
  'Other',
]

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: '', email: '', topic: '', message: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [apiError, setApiError] = useState('')

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    // Clear field error on change
    if (errors[e.target.name]) setErrors(e => ({ ...e, [e.target.name]: '' }))
  }

  async function submit(e) {
    e.preventDefault()
    setApiError('')

    // Client-side validation
    const err = {}
    if (!form.name.trim())    err.name    = 'Name is required.'
    if (!form.email.trim())   err.email   = 'Email is required.'
    if (!form.message.trim()) err.message = 'Please write a message.'
    if (Object.keys(err).length) { setErrors(err); return }

    setLoading(true)
    try {
      await api.post('/contact/', form)
      setSent(true)
    } catch (ex) {
      const data = ex.response?.data
      if (data && typeof data === 'object' && !data.detail) {
        // Field-level errors from Django
        setErrors(data)
      } else {
        setApiError(
          data?.detail ||
          'Could not send your message. Please try again or email us directly.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 px-6 text-center">
        <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-3">Get in touch</p>
        <h1 className="text-4xl font-bold mb-4">Contact UGRP</h1>
        <p className="text-brand-100 max-w-md mx-auto text-lg leading-relaxed">
          Questions about the program, technical help, or just want to say hello — we're here.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* ── Left — contact info ─────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reach us directly</h2>
          <div className="space-y-5">
            {contactInfo.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">{value}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="mt-8 h-48 bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Campus map coming soon</p>
            </div>
          </div>
        </div>

        {/* ── Right — form ────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send a message</h2>

          {sent ? (
            /* ── Success state ──────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                <CheckCircle size={26} className="text-teal-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Message sent!</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Thank you, <strong>{form.name}</strong>. We'll reply to{' '}
                <strong>{form.email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSent(false)
                  setForm({ name: '', email: '', topic: '', message: '' })
                }}
                className="btn-secondary mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            /* ── Contact form ───────────────────────────────────────────── */
            <form onSubmit={submit} className="space-y-4" noValidate>
              {/* API-level error banner */}
              {apiError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Full name *</label>
                  <input
                    name="name" value={form.name} onChange={handle}
                    className={`input ${errors.name ? 'border-red-300 focus:ring-red-300' : ''}`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handle}
                    className={`input ${errors.email ? 'border-red-300 focus:ring-red-300' : ''}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="label">Topic</label>
                <select name="topic" value={form.topic} onChange={handle} className="input">
                  <option value="">Select a topic…</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Message *</label>
                <textarea
                  name="message" value={form.message} onChange={handle}
                  className={`input min-h-[140px] resize-y ${errors.message ? 'border-red-300 focus:ring-red-300' : ''}`}
                  placeholder="Tell us what's on your mind…"
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-2.5 gap-2"
              >
                {loading ? 'Sending…' : <><Send size={15} /> Send message</>}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Your message goes directly to the UGRP team. We never share your details.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}