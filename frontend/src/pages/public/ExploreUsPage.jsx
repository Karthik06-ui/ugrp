import { Link } from 'react-router-dom'
import { BarChart2, Users, FolderOpen, CheckSquare, Star, ArrowRight } from 'lucide-react'

const stats = [
  { icon: Users,       value: '50+',  label: 'Active students',     color: 'text-teal-600 bg-teal-50'   },
  { icon: FolderOpen,  value: '10+',  label: 'Research projects',   color: 'text-brand-600 bg-brand-50' },
  { icon: BarChart2,   value: '150+',   label: 'Faculty mentors',     color: 'text-coral-600 bg-coral-50' },
  { icon: CheckSquare, value: '30+',label: 'Tasks completed',     color: 'text-green-600 bg-green-50' },
  { icon: Star,        value: '4.7/5', label: 'Average review',      color: 'text-amber-600 bg-amber-50' },
  { icon: FolderOpen,  value: '12',    label: 'Departments covered',  color: 'text-purple-600 bg-purple-50'},
]

const departments = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Biotechnology',
  'Data Science & AI',
  'Civil Engineering',
  'Information Technology',
  'Environmental Science',
]

const highlights = [
  { title: 'AI & Machine Learning',    desc: '5 projects · 20 students',   tag: 'CSE'     },
  { title: 'BioScience Research', desc: '6 projects · 18 students',    tag: 'Biotech'     },
  { title: 'Genomics & Bioinformatics',    desc: '8 projects · 28 students',    tag: 'Biotech' },
  { title: 'Sustainable Systems Design',   desc: '5 projects · 16 students',    tag: 'Civil'   },
  { title: 'Computational Maths',          desc: '3 projects · 10 students',    tag: 'Maths'   },
]

export default function ExploreUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 px-6 text-center">
        <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-3">Explore UGRP</p>
        <h1 className="text-4xl font-bold mb-4">Research in numbers</h1>
        <p className="text-brand-100 max-w-xl mx-auto text-lg">
          A snapshot of what's happening across the UGRP ecosystem right now.
        </p>
      </section>

      {/* Stats grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card text-center">
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="bg-gray-50 border-y border-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Departments we serve</h2>
          <p className="text-gray-400 text-sm mb-8">Research collaboration spans the full breadth of the university.</p>
          <div className="flex flex-wrap gap-2.5">
            {departments.map(d => (
              <span key={d} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium shadow-sm">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Research highlights */}
      {/* <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Research highlights</h2>
        <p className="text-gray-400 text-sm mb-8">Active research clusters with the most student engagement.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map(({ title, desc, tag }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 mb-3">
                {tag}
              </span>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* CTA */}
      <section className="bg-brand-600 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Find your research project</h2>
        <p className="text-brand-100 mb-6 max-w-md mx-auto">Browse all open projects and submit your proposal today.</p>
        <Link to="/projects" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors">
          Browse projects <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  )
}