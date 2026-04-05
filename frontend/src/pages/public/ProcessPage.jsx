import { Link } from 'react-router-dom'
import { UserPlus, Search, FileText, CheckCircle, BookOpen, Star, ArrowRight, ChevronRight } from 'lucide-react'

const studentSteps = [
  { icon: UserPlus,    num: '01', title: 'Register as a student',   desc: 'Create your account with your university email, select the student role, and fill in your profile — department, year, skills, and a short bio.' },
  { icon: Search,      num: '02', title: 'Browse open projects',    desc: 'Explore all research projects posted by faculty mentors. Filter by status or search by keyword to find the right fit for your interests.' },
  { icon: FileText,    num: '03', title: 'Submit a proposal',       desc: 'Write a personalised cover message explaining your motivation and relevant experience. Optionally attach your resume or transcript.' },
  { icon: CheckCircle, num: '04', title: 'Wait for a decision',     desc: 'The mentor reviews all proposals and either accepts or rejects. You will see the status update live on your proposals page.' },
  { icon: BookOpen,    num: '05', title: 'Start the research',      desc: 'Once accepted, you are enrolled. The mentor assigns tasks, you update their status, and progress is tracked in your dashboard.' },
  { icon: Star,        num: '06', title: 'Receive a review',        desc: 'At the end of the project, your mentor writes a formal review with a rating and comments — a permanent record in your UGRP profile.' },
]

const mentorSteps = [
  { num: '01', title: 'Register as a mentor',   desc: 'Create your account, choose the mentor role, and complete your faculty profile with your department and designation.' },
  { num: '02', title: 'Create a project',       desc: 'Post a research project with a title, description, and open/closed status. Students can immediately start discovering and applying.' },
  { num: '03', title: 'Review proposals',       desc: 'Browse all incoming proposals from students in your proposals inbox — filterable by project or status.' },
  { num: '04', title: 'Accept or reject',       desc: 'Accept a student to enroll them instantly, or reject to keep the project open for better matches. Rejected students may re-apply.' },
  { num: '05', title: 'Assign tasks',           desc: 'Break the project into tasks and assign them to enrolled students with due dates. Track completion from your dashboard.' },
  { num: '06', title: 'Review and remark',      desc: 'Post progress remarks for the team and write a formal review with a rating when the project concludes.' },
]

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 px-6 text-center">
        <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-3">How it works</p>
        <h1 className="text-4xl font-bold mb-4">The UGRP process</h1>
        <p className="text-brand-100 max-w-xl mx-auto text-lg leading-relaxed">
          A clear, step-by-step workflow for students and mentors — from registration to reviewed research output.
        </p>
      </section>

      {/* Student process */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">For students</h2>
            <p className="text-sm text-gray-400">From discovery to formal review in 6 steps</p>
          </div>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gray-100 hidden sm:block" />
          <div className="space-y-6">
            {studentSteps.map(({ icon: Icon, num, title, desc }) => (
              <div key={num} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-teal-50 border-2 border-white shadow-sm flex items-center justify-center z-10">
                  <Icon size={18} className="text-teal-600" />
                </div>
                <div className="pt-2 pb-4 border-b border-gray-50 flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-teal-500 uppercase tracking-widest">{num}</span>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Link to="/register" className="btn-primary gap-2 w-fit">
            Start as a student <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-gray-50 border-y border-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-coral-400 flex items-center justify-center">
              <Star size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">For mentors</h2>
              <p className="text-sm text-gray-400">Post, review, and guide student researchers</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mentorSteps.map(({ num, title, desc }) => (
              <div key={num} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
                <div className="w-8 h-8 rounded-xl bg-coral-50 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold text-coral-600">{num}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/register" className="btn-primary gap-2 w-fit">
              Start as a mentor <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ strip */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Common questions</h2>
        <div className="space-y-4">
          {[
            ['Can I apply to multiple projects?',        'Yes — you can apply to as many open projects as you want. However, you can only have one active proposal per project at a time.'],
            ['What happens if my proposal is rejected?', 'You can re-apply to the same project after a rejection, with a new and improved message.'],
            ['Can mentors see my contact details?',      'Mentors see your email and profile. Your proposal attachment (resume, etc.) is only shared when you include it.'],
            ['Is there a time limit for projects?',      'Project duration is set by the mentor. Check the project description for details on timelines.'],
          ].map(([q, a]) => (
            <div key={q} className="border border-gray-100 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                <ChevronRight size={14} className="text-brand-400 flex-shrink-0" /> {q}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed pl-5">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}