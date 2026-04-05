const mentors = [
  { name: 'Dr. Priya Ramesh',   role: 'Professor of Computer Science',     dept: 'CSE',      research: 'Machine Learning, NLP',               initial: 'PR', color: 'bg-brand-50 text-brand-700' },
  { name: 'Dr. Karthik Menon',  role: 'Associate Professor',               dept: 'ECE',      research: 'Signal Processing, IoT',              initial: 'KM', color: 'bg-coral-50 text-coral-700' },
  { name: 'Dr. Anitha Suresh',  role: 'Assistant Professor',               dept: 'Maths',    research: 'Computational Mathematics',           initial: 'AS', color: 'bg-teal-50 text-teal-700'   },
  { name: 'Dr. Raj Vishwanath', role: 'Professor',                          dept: 'Physics',  research: 'Quantum Computing, Materials',        initial: 'RV', color: 'bg-amber-50 text-amber-700' },
  { name: 'Dr. Meena Pillai',   role: 'Associate Professor',               dept: 'Biotech',  research: 'Genomics, Bioinformatics',            initial: 'MP', color: 'bg-green-50 text-green-700' },
  { name: 'Dr. Suresh Kumar',   role: 'Assistant Professor',               dept: 'CSE',      research: 'Cybersecurity, Cloud Systems',        initial: 'SK', color: 'bg-purple-50 text-purple-700' },
]

const team = [
  { name: 'Arun Chandrasekaran', role: 'Program Director',     initial: 'AC', color: 'bg-brand-50 text-brand-700' },
  { name: 'Divya Nair',          role: 'Student Coordinator',  initial: 'DN', color: 'bg-teal-50 text-teal-700'   },
  { name: 'Ravi Shankar',        role: 'Tech Lead',            initial: 'RS', color: 'bg-coral-50 text-coral-700' },
  { name: 'Lakshmi Priya',       role: 'Outreach & Blog',      initial: 'LP', color: 'bg-amber-50 text-amber-700' },
]

function Avatar({ initial, color, size = 'lg' }) {
  const s = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-12 h-12 text-base'
  return (
    <div className={`${s} ${color} rounded-2xl flex items-center justify-center font-bold flex-shrink-0`}>
      {initial}
    </div>
  )
}

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 px-6 text-center">
        <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-3">Our community</p>
        <h1 className="text-4xl font-bold mb-4">The people behind UGRP</h1>
        <p className="text-brand-100 max-w-xl mx-auto text-lg leading-relaxed">
          Faculty mentors, dedicated students, and a passionate core team — together we make research collaboration happen.
        </p>
      </section>

      {/* Faculty mentors */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Faculty mentors</h2>
        <p className="text-gray-500 text-sm mb-10">Leading researchers who open their projects to undergraduate collaboration.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentors.map(m => (
            <div key={m.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar initial={m.initial} color={m.color} size="md" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.role}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Department:</span> {m.dept}</p>
                <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Research:</span> {m.research}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core team */}
      <section className="bg-gray-50 border-y border-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Core team</h2>
          <p className="text-gray-500 text-sm mb-10">The people who keep UGRP running every day.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map(t => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card text-center flex flex-col items-center gap-3">
                <Avatar initial={t.initial} color={t.color} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Want to be part of this?</h2>
        <p className="text-gray-500 mb-6 max-w-lg mx-auto">
          Faculty can create research projects. Students can apply and collaborate. Everyone can read and write on our blog.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="/register" className="btn-primary px-6 py-2.5">Join UGRP</a>
          <a href="/blogs"     className="btn-secondary px-6 py-2.5">Read the blog</a>
        </div>
      </section>
    </div>
  )
}