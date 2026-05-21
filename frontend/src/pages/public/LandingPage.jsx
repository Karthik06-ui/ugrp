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
    <nav className="fixed w-full top-0 z-50 bg-[#010103]/60 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500">
            <GraduationCap size={18} className="text-white group-hover:text-blue-400 transition-colors" />
          </div>
          <span className="font-semibold text-white tracking-widest text-sm uppercase">UGRP</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-2 flex-1 ml-8">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-white transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/5"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex-1 md:flex-none" />

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Log in</Link>
          <Link to="/register" className="relative group overflow-hidden rounded-full p-[1px]">
            {/* Spinning edge glow effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-70 group-hover:opacity-100 animate-[spin_3s_linear_infinite]" />
            <div className="relative bg-[#010103] px-5 py-2 rounded-full transition-all group-hover:bg-transparent">
              <span className="text-xs font-medium uppercase tracking-widest text-white">Sign up</span>
            </div>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#010103]/95 backdrop-blur-3xl px-6 py-6 flex flex-col gap-2">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="text-sm font-medium tracking-widest uppercase text-gray-400 hover:text-white py-3 hover:bg-white/5 rounded-xl px-4 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
            <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium tracking-widest uppercase text-gray-400 hover:text-white py-3 px-4 text-center border border-white/10 rounded-xl hover:bg-white/5 transition-colors">Log in</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium tracking-widest uppercase text-black bg-white py-3 px-4 rounded-xl text-center hover:bg-gray-200 transition-colors">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#010103] text-gray-200 font-sans selection:bg-blue-500/30">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 flex items-center justify-center min-h-[90vh]">
        {/* Futuristic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
          <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[128px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-indigo-600/20 rounded-full blur-[128px] mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-full px-5 py-2 text-xs font-medium uppercase tracking-widest text-blue-300 mb-10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors cursor-default">
            <GraduationCap size={16} />
            Undergraduate Research Program
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
            Research that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">shapes</span> your future
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            UGRP connects undergraduate students with faculty mentors for meaningful academic collaboration. Discover projects, apply with one click, and build real research experience.
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="group relative inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <span className="relative z-10 flex items-center gap-2">
                Get started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/projects" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md">
              Browse projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[['500+','Active students'],['120+','Research projects'],['80+','Faculty mentors'],['95%','Satisfaction rate']].map(([n,l]) => (
            <div key={l} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-1">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2">{n}</p>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-6 py-32">
        {/* Atmospheric glowing overlay */}
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">do great research</span></h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto font-light">From discovery to delivery — UGRP handles the entire research collaboration lifecycle.</p>
        </div>
        
        <div className="relative z-10 grid sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group relative p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)]">
              {/* Background gradient fade on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-500">
                  <Icon size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative border-y border-white/5 bg-[#030305]/50 py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">How it works</h2>
            <p className="text-lg text-gray-400 font-light">From registration to research in four steps.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="group relative text-center">
                {/* Connecting lines for desktop */}
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-white/20 to-transparent group-last:hidden" />
                
                <div className="relative z-10 w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500 backdrop-blur-xl">
                  <span className="font-mono text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 group-hover:from-blue-400 group-hover:to-indigo-400 transition-colors duration-500">{num}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-5xl mx-auto px-6 py-32 text-center overflow-hidden">
        {/* Core glowing orb behind the CTA box */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.05] backdrop-blur-xl hover:border-white/[0.1] transition-colors duration-500">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to start your <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">research journey?</span></h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto font-light">Join hundreds of students who have turned research interest into real academic achievement through UGRP.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300">
            Create free account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center bg-[#010103]">
        <p className="text-sm text-gray-600 font-light tracking-wide">© {new Date().getFullYear()} UGRP — Undergraduate Research Program. Built with Django + React.</p>
      </footer>
    </div>
  )
}
