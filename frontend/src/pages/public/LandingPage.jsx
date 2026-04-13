import { Link } from 'react-router-dom'
import { GraduationCap, Users, FolderOpen, CheckSquare, ArrowRight, Star, Menu, X } from 'lucide-react'
import { useState } from 'react'

const features = [
  { icon: FolderOpen,  title: 'Discover research projects', desc: 'Browse open research opportunities posted by faculty mentors across all departments.' },
  { icon: Users,       title: 'Connect with mentors',       desc: 'Apply directly to projects with a personalised proposal and hear back quickly.' },
  { icon: CheckSquare, title: 'Track your progress',        desc: 'Manage tasks, receive mentor reviews, and log milestones all in one place.' },
  { icon: Star,        title: 'Build your portfolio',       desc: 'Earn formal reviews from mentors that you can carry into your academic career.' },
]

const steps = [
  { num: '01', title: 'Create your account', desc: 'Register as a student or mentor in under a minute.' },
  { num: '02', title: 'Browse open projects', desc: 'Explore active research opportunities and filter by department.' },
  { num: '03', title: 'Submit a proposal',    desc: 'Write a personalised message to the mentor and hit apply.' },
  { num: '04', title: 'Start collaborating',  desc: 'Once accepted, get access to tasks, remarks, and reviews.' },
]

const NAV_LINKS = [
  { label: 'About',   to: '/about' },
  // { label: 'People',  to: '/people' },
  { label: 'Process', to: '/process' },
  { label: 'Explore', to: '/explore' },
  { label: 'Blogs',   to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

function LandingNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <GraduationCap size={15} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-sm">UGRP</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex-1 md:flex-none" />

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/login"    className="btn-secondary text-xs px-3 py-1.5">Log in</Link>
          <Link to="/register" className="btn-primary  text-xs px-3 py-1.5">Sign up</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 hover:bg-gray-50 rounded-lg px-3 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
            <Link to="/login"    onClick={() => setOpen(false)} className="btn-secondary text-xs px-3 py-1.5 flex-1 text-center">Log in</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="btn-primary  text-xs px-3 py-1.5 flex-1 text-center">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Public navigation ───────────────────────────────────── */}
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <GraduationCap size={15} />
            Undergraduate Research Program
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Research that <span className="text-brand-200">shapes</span><br />your future
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            UGRP connects undergraduate students with faculty mentors for meaningful academic collaboration. Discover projects, apply with one click, and build real research experience.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-brand-800 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors">
              Get started <ArrowRight size={16} />
            </Link>
            <Link to="/projects" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Browse projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[['500+','Active students'],['120+','Research projects'],['80+','Faculty mentors'],['95%','Satisfaction rate']].map(([n,l]) => (
            <div key={l}>
              <p className="text-2xl font-bold text-brand-600">{n}</p>
              <p className="text-sm text-gray-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to do great research</h2>
          <p className="text-gray-500 max-w-xl mx-auto">From discovery to delivery — UGRP handles the entire research collaboration lifecycle.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <Icon size={18} className="text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">From registration to research in four steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start your research journey?</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">Join hundreds of students who have turned research interest into real academic achievement through UGRP.</p>
        <Link to="/register" className="btn-primary px-8 py-3 text-base inline-flex items-center gap-2">
          Create free account <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} UGRP — Undergraduate Research Program. Built with Django + React.</p>
      </footer>
    </div>
  )
}