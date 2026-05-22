import { ArrowRight, CheckCircle2, BookOpen, ShieldCheck, Brain, FileText, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const curriculum = [
  {
    icon: Search,
    title: 'Research Methodology Foundations',
    desc: 'Understand research paradigms, inquiry models, methodologies, and how knowledge is structured across disciplines.',
  },
  {
    icon: ShieldCheck,
    title: 'Research Ethics & Academic Integrity',
    desc: 'Learn ethical research conduct, citation standards, data responsibility, and scholarly accountability.',
  },
  {
    icon: BookOpen,
    title: 'Reading & Engaging Research Literature',
    desc: 'Develop the ability to critically read, evaluate, compare, and synthesise scholarly work.',
  },
  {
    icon: FileText,
    title: 'Literature Review Fundamentals',
    desc: 'Build structured literature reviews using evidence mapping, source organisation, and contextual analysis.',
  },
  {
    icon: Brain,
    title: 'Problem Framing & Hypothesis Development',
    desc: 'Transform broad curiosity into precise research questions with scope, direction, and clarity.',
  },
]

export default function ReflectPage() {
  return (
    <div className="bg-[#F6F8FB] text-[#0F172A] overflow-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-white">

        {/* BG GLOWS */}
        <div className="absolute inset-0">
          <div className="absolute top-[-120px] left-[-80px] h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[120px]" />
          <div className="absolute bottom-[-180px] right-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1650px] px-6 pb-28 pt-40 lg:px-16">

          {/* BREADCRUMB */}
          <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
            <span>Home</span>
            <span>→</span>
            <span>Programs</span>
            <span>→</span>
            <span className="text-slate-600">REFLECT</span>
          </div>

          <div className="max-w-6xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600">
              Foundational Research Training
            </p>

            <h1 className="text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-slate-900">
              REFLECT
            </h1>

            <p className="mt-8 max-w-5xl text-[clamp(1.1rem,2vw,1.55rem)] leading-[2] text-slate-600">
              Research Foundations for Learning, Enquiry, Critical Thinking &
              Translation
            </p>

            <div className="mt-14 grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">

              {/* LEFT */}
              <div>

                <h2 className="max-w-3xl text-[clamp(2rem,3vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-slate-900">
                  Every KREST journey begins here.
                  <br />
                  Built before research begins.
                </h2>

                <p className="mt-8 max-w-4xl text-[17px] leading-[2.1] text-slate-600">
                  REFLECT is the mandatory foundational training program for all
                  KREST participants. Before engaging with research questions,
                  projects, or faculty-led inquiry, students build the intellectual
                  infrastructure required for serious scholarly work.
                </p>

                <p className="mt-6 max-w-4xl text-[17px] leading-[2.1] text-slate-600">
                  Through structured training, guided exercises, and rigorous
                  academic practice, REFLECT develops the habits, literacy,
                  ethics, and critical thinking capabilities that define prepared
                  researchers.
                </p>

                <div className="mt-12 flex flex-wrap gap-4">

                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:gap-5"
                  >
                    Apply to Begin REFLECT
                    <ArrowRight size={18} />
                  </Link>

                  <button className="rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
                    Explore Curriculum
                  </button>
                </div>
              </div>

              {/* RIGHT STAT CARD */}
              <div className="rounded-[36px] border border-black/5 bg-[#0F172A] p-10 text-white">

                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                  REFLECT Structure
                </p>

                <div className="mt-10 space-y-8">

                  {[
                    ['8', 'Core learning modules'],
                    ['100%', 'Mandatory for all entrants'],
                    ['Faculty-guided', 'Training & evaluation'],
                    ['Stage-gated', 'Progression framework'],
                  ].map(([num, label]) => (
                    <div
                      key={label}
                      className="border-b border-white/10 pb-6 last:border-none"
                    >
                      <div className="text-3xl font-semibold tracking-[-0.04em]">
                        {num}
                      </div>

                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="mb-20 max-w-5xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600">
              Curriculum
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              The REFLECT
              <br />
              Learning Framework
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-[2] text-slate-600">
              REFLECT progresses through carefully designed modules that build
              research capability step by step — combining methodology,
              scholarship, ethics, inquiry, and structured academic practice.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {curriculum.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="group rounded-[34px] border border-black/5 bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100">
                    <Icon size={28} className="text-sky-700" />
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold leading-[1.3] tracking-[-0.03em] text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-6 text-[15px] leading-[2] text-slate-600">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLE SECTION */}
      <section className="pb-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="overflow-hidden rounded-[42px] bg-[#0F172A]">

            <div className="grid xl:grid-cols-[0.9fr_1.1fr]">

              {/* LEFT */}
              <div className="relative border-b border-white/10 p-12 xl:border-b-0 xl:border-r">

                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full border border-white/10" />
                  <div className="absolute bottom-[-180px] right-[-180px] h-[420px] w-[420px] rounded-full border border-white/10" />
                </div>

                <div className="relative z-10">

                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-300">
                    Why REFLECT Exists
                  </p>

                  <h2 className="max-w-xl text-[clamp(2.5rem,4vw,4.5rem)] font-semibold leading-[1] tracking-[-0.05em] text-white">
                    Training before research.
                  </h2>

                  <p className="mt-8 max-w-xl text-[17px] leading-[2.1] text-slate-300">
                    REFLECT is built on a foundational KREST principle:
                    research readiness should never be assumed.
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="p-12 lg:p-16">

                <div className="space-y-8 text-[17px] leading-[2.1] text-slate-300">

                  <p>
                    Many research environments expect students to navigate
                    methodology, ethics, documentation, and scholarly practice
                    independently while already participating in research work.
                  </p>

                  <p>
                    REFLECT takes a different approach. It develops capability
                    systematically before deeper research engagement begins —
                    creating students who are intellectually prepared,
                    methodologically grounded, and capable of contributing with
                    clarity and discipline.
                  </p>

                  <p>
                    By the time students enter the Nano Research Project, they
                    already understand how to engage with literature, frame
                    inquiry, evaluate evidence, and document research responsibly.
                  </p>

                  <div className="pt-4">

                    <div className="inline-flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5">

                      <CheckCircle2
                        size={22}
                        className="mt-0.5 text-sky-300"
                      />

                      <p className="max-w-xl text-[15px] leading-8 text-slate-300">
                        REFLECT establishes the scholarly standard shared across
                        every KREST pathway and every future stage of research.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY + NEXT */}
      <section className="pb-32">

        <div className="mx-auto grid max-w-[1500px] gap-8 px-6 lg:grid-cols-2 lg:px-16">

          {/* ELIGIBILITY */}
          <div className="rounded-[36px] border border-black/5 bg-white p-12">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600">
              Eligibility
            </p>

            <h3 className="text-4xl font-semibold tracking-[-0.04em] text-slate-900">
              Who can join REFLECT?
            </h3>

            <div className="mt-10 space-y-5">

              {[
                'Students entering the KREST framework for the first time',
                'Students from any academic discipline',
                'Undergraduate and postgraduate students',
                'Students preparing for deeper research engagement',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-1 text-sky-600"
                  />

                  <p className="text-[15px] leading-8 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NEXT */}
          <div className="rounded-[36px] bg-gradient-to-br from-sky-500 to-indigo-600 p-12 text-white">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              What Comes Next
            </p>

            <h3 className="max-w-lg text-4xl font-semibold leading-[1.1] tracking-[-0.04em]">
              REFLECT opens the path toward real research contribution.
            </h3>

            <div className="mt-10 space-y-5">

              {[
                'Nano Research Project',
                'KREST Evaluation Gate',
                'KRIP — Faculty-Mentored Research',
                'Research stewardship & advanced contribution',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur"
                >
                  <p className="text-[15px] font-medium leading-8 text-white">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/login"
              className="group mt-12 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5"
            >
              Apply to Begin REFLECT
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}