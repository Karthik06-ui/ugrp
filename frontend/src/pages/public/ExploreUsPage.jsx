import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Microscope,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const programs = [
  {
    tag: 'FOUNDATIONAL TRAINING',
    title: 'REFLECT',
    subtitle:
      'Research Foundations for Learning, Enquiry, Critical Thinking & Translation',
    stage: 'Foundational Training',
    entry: 'All KREST participants',
    desc:
      'REFLECT establishes the intellectual and methodological foundations required before entering any structured research environment. It develops research literacy, scholarly discipline, and critical inquiry habits through guided training.',
    who:
      'Students entering the KREST ecosystem for the first time and beginning their research journey.',
    outcome:
      'Research literacy, scholarly discipline, methodological foundations, and readiness for deeper inquiry.',
    color: 'from-sky-500 to-cyan-400',
    icon: GraduationCap,
  },
  {
    tag: 'COURSE-EMBEDDED RESEARCH',
    title: 'CORE',
    subtitle: 'Course-embedded Research Exposure',
    stage: 'Integrated Research Exposure',
    entry: 'Coursework participants',
    desc:
      'CORE integrates research thinking directly into coursework environments — enabling students to engage with inquiry, exploration, and problem-solving within their existing academic structure.',
    who:
      'Students who want to experience research within their discipline without pursuing a standalone research pathway.',
    outcome:
      'Research exposure within coursework, inquiry-driven learning, and a foundation for future independent research.',
    color: 'from-indigo-500 to-violet-500',
    icon: BookOpen,
  },
  {
    tag: 'GUIDED RESEARCH CONTRIBUTION',
    title: 'KRIP',
    subtitle: 'KREST Research Internship Program',
    stage: 'Faculty-Mentored Research',
    entry: 'REFLECT completers who clear the Evaluation Gate',
    desc:
      'KRIP is the advanced guided research pathway where prepared students contribute to sustained faculty-led inquiry, research outputs, publications, and institutional research initiatives.',
    who:
      'Students who demonstrate research readiness through REFLECT and the Nano Research evaluation process.',
    outcome:
      'Research outputs, faculty endorsement, institutional recognition, and meaningful contribution to active research ecosystems.',
    color: 'from-fuchsia-500 to-purple-500',
    icon: Microscope,
  },
]

export default function ProgramsOverviewPage() {
  return (
    <div className="bg-[#F6F8FB] text-[#0F172A] overflow-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-white">

        <div className="absolute inset-0">
          <div className="absolute top-[-140px] right-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[140px]" />
          <div className="absolute bottom-[-140px] left-[-120px] h-[520px] w-[520px] rounded-full bg-sky-400/10 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1650px] px-6 pb-28 pt-40 lg:px-16">

          {/* BREADCRUMB */}
          <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
            <span>Home</span>
            <span>→</span>
            <span className="text-slate-600">Programs Overview</span>
          </div>

          <div className="max-w-6xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              KREST Research Pathways
            </p>

            <h1 className="text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-slate-900">
              Three Programs.
              <br />
              One Framework.
            </h1>

            <p className="mt-10 max-w-4xl text-[clamp(1.2rem,2vw,1.6rem)] leading-[2] text-slate-600">
              Every student enters KREST at the right stage for where they are.
              Each pathway is designed to cultivate research capability through
              structured progression, mentorship, inquiry, and scholarly practice.
            </p>
          </div>
        </div>
      </section>

      {/* DECISION SECTION */}
      <section className="relative py-28">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="mb-16 max-w-4xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              Program Selection
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              Which Pathway
              <br />
              Fits Your Journey?
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-[2] text-slate-600">
              KREST is designed as a progression framework. Students begin at
              the stage aligned with their readiness, academic context, and
              research intent.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">

            {/* CARD 1 */}
            <div className="group rounded-[36px] border border-black/5 bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)]">

              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100">
                <GraduationCap size={28} className="text-sky-600" />
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-600">
                Starting Point
              </p>

              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                New to structured research?
              </h3>

              <p className="mt-6 text-[16px] leading-[2] text-slate-600">
                Begin with foundational research literacy, scholarly habits,
                methodology, ethics, and inquiry practice through REFLECT.
              </p>

              <button className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold text-sky-700">
                Explore REFLECT
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* CARD 2 */}
            <div className="group rounded-[36px] border border-black/5 bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)]">

              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                <BookOpen size={28} className="text-indigo-600" />
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-600">
                Coursework Research
              </p>

              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                Want research integrated into learning?
              </h3>

              <p className="mt-6 text-[16px] leading-[2] text-slate-600">
                Experience research thinking directly within coursework through
                guided inquiry, discipline-aligned activities, and structured exploration.
              </p>

              <button className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold text-indigo-700">
                Explore CORE
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* CARD 3 */}
            <div className="group rounded-[36px] border border-black/5 bg-[#0F172A] p-10 text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.18)]">

              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <Microscope size={28} className="text-fuchsia-300" />
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-fuchsia-300">
                Advanced Research
              </p>

              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                Ready for sustained research contribution?
              </h3>

              <p className="mt-6 text-[16px] leading-[2] text-slate-300">
                Join faculty-mentored research environments and contribute to
                real inquiry, outputs, publications, and institutional research work.
              </p>

              <button className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold text-white">
                Explore KRIP
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM CARDS */}
      <section className="py-32">

        <div className="mx-auto max-w-[1650px] px-6 lg:px-16">

          <div className="space-y-12">

            {programs.map((program, index) => {
              const Icon = program.icon

              return (
                <div
                  key={program.title}
                  className="group relative overflow-hidden rounded-[42px] border border-black/5 bg-white p-10 lg:p-14 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_100px_rgba(15,23,42,0.08)]"
                >

                  <div className={`absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-gradient-to-br ${program.color} opacity-[0.08] blur-[80px]`} />

                  <div className="relative z-10 grid gap-14 xl:grid-cols-[0.8fr_1.2fr]">

                    {/* LEFT */}
                    <div>

                      <div className={`inline-flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br ${program.color} shadow-lg`}>

                        <Icon size={34} className="text-white" />
                      </div>

                      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {program.tag}
                      </p>

                      <h2 className="mt-5 text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-slate-900">
                        {program.title}
                      </h2>

                      <p className="mt-5 text-xl leading-[1.9] text-slate-600">
                        {program.subtitle}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div>

                      <div className="grid gap-6 md:grid-cols-2">

                        <div className="rounded-[28px] bg-slate-50 p-8">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Stage
                          </p>

                          <p className="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                            {program.stage}
                          </p>
                        </div>

                        <div className="rounded-[28px] bg-slate-50 p-8">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Entry Point
                          </p>

                          <p className="mt-4 text-lg leading-8 text-slate-700">
                            {program.entry}
                          </p>
                        </div>
                      </div>

                      <div className="mt-10">

                        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                          What this pathway offers
                        </h3>

                        <p className="mt-5 text-[17px] leading-[2] text-slate-600">
                          {program.desc}
                        </p>
                      </div>

                      <div className="mt-10 grid gap-6 lg:grid-cols-2">

                        <div className="rounded-[28px] border border-black/5 p-8">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Who it is for
                          </p>

                          <p className="mt-5 text-[15px] leading-8 text-slate-700">
                            {program.who}
                          </p>
                        </div>

                        <div className="rounded-[28px] border border-black/5 p-8">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                            What you leave with
                          </p>

                          <p className="mt-5 text-[15px] leading-8 text-slate-700">
                            {program.outcome}
                          </p>
                        </div>
                      </div>

<Link
  to={`/programs/${program.title.toLowerCase()}`}
  className="group mt-12 inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:gap-5"
>
  Learn More About {program.title}
  <ArrowRight size={18} />
</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="pb-32">

        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">

          <div className="mb-16 max-w-4xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              Comparison
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              Programs at
              <br />
              a Glance
            </h2>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-black/5 bg-white">

            <div className="grid grid-cols-3 border-b border-black/5 bg-slate-50">

              {['Program', 'Stage', 'Open To'].map((item) => (
                <div
                  key={item}
                  className="p-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  {item}
                </div>
              ))}
            </div>

            {[
              [
                'REFLECT',
                'Foundational Training',
                'All KREST entrants',
              ],
              [
                'CORE',
                'Embedded Research Exposure',
                'Students within coursework environments',
              ],
              [
                'KRIP',
                'Guided Research Contribution',
                'REFLECT completers who clear the Evaluation Gate',
              ],
            ].map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-3 border-b border-black/5 last:border-none"
              >

                <div className="flex items-center gap-4 p-8">

                  <div className="h-3 w-3 rounded-full bg-indigo-500" />

                  <span className="text-lg font-semibold text-slate-900">
                    {row[0]}
                  </span>
                </div>

                <div className="p-8 text-[15px] leading-8 text-slate-700">
                  {row[1]}
                </div>

                <div className="p-8 text-[15px] leading-8 text-slate-700">
                  {row[2]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}