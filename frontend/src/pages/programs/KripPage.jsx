import {
  ArrowRight,
  Microscope,
  CheckCircle2,
  FileText,
  Database,
  FlaskConical,
  Users,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const milestones = [
  {
    title: 'Milestone 1 — Research Scoping',
    desc:
      'Student and faculty mentor define the research problem, methodology, scope boundaries, and expected outputs.',
  },
  {
    title: 'Milestone 2 — Literature Foundation',
    desc:
      'A structured literature review establishes the scholarly foundation and situates the inquiry within existing research.',
  },
  {
    title: 'Milestone 3 — Research Execution',
    desc:
      'Core research work begins — experimentation, analysis, modelling, simulations, systems development, or investigation.',
  },
  {
    title: 'Milestone 4 — Synthesis & Documentation',
    desc:
      'Research findings are synthesised into formal outputs including papers, reports, datasets, frameworks, or prototypes.',
  },
  {
    title: 'Milestone 5 — Review & Completion',
    desc:
      'Faculty review, revisions, assessment, and formal KREST completion documentation. Exceptional outputs may proceed toward publication.',
  },
]

const outputs = [
  'Research papers and journal articles',
  'Technical reports and working papers',
  'Experimental and computational datasets',
  'Software systems and proof-of-concept prototypes',
  'Simulation studies and modelling frameworks',
  'Design systems and creative research outputs',
  'Applied policy recommendations and briefs',
]

const eligibility = [
  'Completion of REFLECT — the KREST foundational training program',
  'Successful submission of a Nano Research Project',
  'Selection through the KREST Evaluation Gate',
]

export default function KripPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F6F8FB] text-[#0F172A]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-[#0F172A] text-white">

        <div className="absolute inset-0">
          <div className="absolute left-[-120px] top-[-100px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-[140px]" />
          <div className="absolute bottom-[-160px] right-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1650px] px-6 pb-28 pt-40 lg:px-16">

          <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
            <span>Home</span>
            <span>→</span>
            <span>Programs</span>
            <span>→</span>
            <span className="text-white">KRIP</span>
          </div>

          <div className="max-w-6xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-300">
              KREST Research Internship Program
            </p>

            <h1 className="text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
              KRIP
            </h1>

            <p className="mt-8 max-w-4xl text-[clamp(1.3rem,2vw,1.65rem)] leading-[2] text-slate-300">
              This is where preparation meets contribution. Where trained,
              evaluated KREST scholars engage in sustained faculty-guided
              research within Kumaraguru Institutions' research ecosystem.
            </p>

            <p className="mt-8 max-w-4xl text-lg leading-[2] text-slate-400">
              KRIP is a structured research engagement designed around genuine
              inquiry, scholarly discipline, and meaningful research output —
              not a conventional internship or observational experience.
            </p>

            <div className="mt-10">
              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full bg-fuchsia-500 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-fuchsia-600 hover:gap-5"
              >
                Start KRIP
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STRUCTURE */}
      <section className="py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="mb-20 max-w-5xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-600">
              KRIP Structure
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              Research
              <br />
              as Progression
            </h2>

            <p className="mt-8 text-lg leading-[2] text-slate-600">
              KRIP follows a milestone-driven structure that guides students
              from problem scoping through execution, synthesis, review, and
              completion.
            </p>
          </div>

          <div className="space-y-8">

            {milestones.map((item, index) => (
              <div
                key={item.title}
                className="group grid gap-8 rounded-[36px] border border-black/5 bg-white p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[120px_1fr]"
              >

                <div>

                  <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-fuchsia-500 to-purple-500 text-2xl font-semibold text-white shadow-lg">
                    0{index + 1}
                  </div>
                </div>

                <div>

                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-5 max-w-4xl text-[17px] leading-[2] text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH OUTPUTS */}
      <section className="border-y border-black/5 bg-white py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="grid gap-20 lg:grid-cols-[0.8fr_1.2fr]">

            <div>

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-600">
                Research Domains
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
                What You
                <br />
                Can Research
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {outputs.map((item, index) => {
                const icons = [
                  FileText,
                  FileText,
                  Database,
                  Microscope,
                  FlaskConical,
                  Microscope,
                  ShieldCheck,
                ]

                const Icon = icons[index]

                return (
                  <div
                    key={item}
                    className="rounded-[30px] border border-black/5 bg-[#F8FAFC] p-8"
                  >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-50">
                      <Icon size={24} className="text-fuchsia-600" />
                    </div>

                    <p className="mt-6 text-[16px] leading-[1.9] text-slate-700">
                      {item}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MENTORSHIP */}
      <section className="py-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="overflow-hidden rounded-[42px] bg-[#0F172A] p-12 lg:p-20 text-white relative">

            <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

            <div className="relative z-10 grid gap-20 lg:grid-cols-[0.9fr_1.1fr]">

              <div>

                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-300">
                  Faculty Mentorship
                </p>

                <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                  Research is
                  <br />
                  guided.
                </h2>
              </div>

              <div>

                <p className="text-lg leading-[2] text-slate-300">
                  Every KRIP scholar works directly with an evaluated KREST
                  faculty mentor through a sustained research partnership built
                  around intellectual guidance, milestone review, and scholarly
                  development.
                </p>

                <div className="mt-10 space-y-5">

                  {[
                    'Research problem scoping and methodology guidance',
                    'Literature direction and scholarly framing',
                    'Milestone review and research supervision',
                    'Writing, documentation, and publication refinement',
                    'Formal research evaluation and scholarly assessment',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-4 rounded-[24px] border border-white/10 bg-white/5 p-6"
                    >

                      <Users
                        size={20}
                        className="mt-1 text-fuchsia-300"
                      />

                      <p className="text-[15px] leading-8 text-slate-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section className="pb-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="grid gap-20 lg:grid-cols-2">

            <div>

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-600">
                Eligibility
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
                Entry into KRIP
                <br />
                is Earned
              </h2>

              <p className="mt-8 text-lg leading-[2] text-slate-600">
                KRIP participation is reserved for students who demonstrate
                genuine readiness for sustained faculty-guided research.
              </p>
            </div>

            <div className="space-y-6">

              {eligibility.map((item) => (
                <div
                  key={item}
                  className="flex gap-5 rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
                >

                  <div className="mt-1">
                    <CheckCircle2
                      size={22}
                      className="text-fuchsia-600"
                    />
                  </div>

                  <p className="text-[16px] leading-[2] text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {/*
          <div className="mt-24 overflow-hidden rounded-[42px] bg-gradient-to-br from-fuchsia-600 to-purple-600 p-14 text-white shadow-[0_40px_100px_rgba(168,85,247,0.25)]">

            <div className="max-w-5xl">

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-100">
                Begin the Journey
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                Start with REFLECT.
              </h2>

              <p className="mt-8 max-w-3xl text-lg leading-[2] text-fuchsia-50">
                Every KRIP scholar begins with foundational preparation,
                structured training, and demonstrated research readiness.
              </p>

              <Link
                to="/programs/reflect"
                className="mt-12 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5"
              >
                Begin Your KRIP Journey
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          */}

          <div className="mt-16 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 rounded-full bg-fuchsia-600 px-10 py-5 text-base font-semibold text-white transition-all duration-300 hover:bg-fuchsia-700 hover:gap-5 shadow-lg shadow-fuchsia-500/20"
            >
              Start KRIP
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}