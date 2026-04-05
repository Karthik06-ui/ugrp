import { Link } from 'react-router-dom'
import { Target, Eye, Heart, ArrowRight } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Mission-driven',
    desc:  'We exist to bridge the gap between undergraduate curiosity and real academic research — making meaningful collaboration accessible to every student.',
  },
  {
    icon: Eye,
    title: 'Transparent process',
    desc:  'Every step from proposal to enrollment is visible, trackable, and documented. No black boxes, no confusion.',
  },
  {
    icon: Heart,
    title: 'Student-first',
    desc:  'Everything we build is designed around the student experience — from discovering the right project to receiving a formal review from a mentor.',
  },
]

const timeline = [
  { year: '2025', event: 'Contacted multiple faculties and mentors to gauge interest and gather feedback.' },
  { year: '2026', event: 'Developed a full structured Research Program framework where students can discover opportunities and submit proposals.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-4">About UGRP</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Where undergraduate curiosity<br />meets real research
          </h1>
          <p className="text-brand-100 text-lg max-w-2xl mx-auto leading-relaxed">
            The Undergraduate Research Program connects students with faculty mentors for structured,
            meaningful academic collaboration — turning research interest into real-world experience.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              UGRP was founded on a simple observation: undergraduate students are brimming with curiosity,
              and faculty researchers are overflowing with questions that need fresh perspectives — yet
              connecting the two was always slow, manual, and opaque.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We built a structured program where students can discover open research opportunities,
              submit a personalised proposal, and — once accepted — collaborate directly with a mentor
              through tasks, reviews, and ongoing feedback.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today UGRP serves hundreds of students across multiple departments, helping them build
              portfolios, skills, and relationships that carry into their careers.
            </p>
          </div>
          <div className="space-y-4">
            {timeline.map(({ year, event }) => (
              <div key={year} className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-600">{year}</span>
                </div>
                <div className="pt-3">
                  <p className="text-sm text-gray-600 leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 border-y border-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What drives us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get involved?</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Whether you're a student looking for your first research experience or a faculty mentor with an open project — UGRP is built for you.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/register" className="btn-primary px-6 py-2.5 gap-2">Get started <ArrowRight size={15} /></Link>
          <Link to="/contact"  className="btn-secondary px-6 py-2.5">Contact us</Link>
        </div>
      </section>
    </div>
  )
}