import {
  ArrowRight,
  Compass,
  Search,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  Microscope,
  Landmark,
} from 'lucide-react'

const stages = [
  {
    number: '01',
    icon: Compass,
    title: 'Discovery & Entry',
    short: 'The first deliberate step into research.',
    desc:
      'Students discover KREST, understand the framework, explore pathways, and consciously choose to begin their research journey.',
    color: 'from-sky-500 to-cyan-400',
  },
  {
    number: '02',
    icon: Search,
    title: 'Problem Identification',
    short: 'Defining the question worth exploring.',
    desc:
      'Students collaborate with faculty mentors to identify, refine, and scope meaningful areas of inquiry.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    number: '03',
    icon: BookOpen,
    title: 'REFLECT',
    short: 'Foundational research training.',
    desc:
      'Students develop research literacy, critical inquiry, ethics, documentation discipline, and scholarly practice.',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    number: '04',
    icon: FlaskConical,
    title: 'Nano Research Project',
    short: 'The first real research experience.',
    desc:
      'Students execute a scoped research exercise focused on process quality, consistency, and intellectual engagement.',
    color: 'from-orange-500 to-amber-400',
  },
  {
    number: '05',
    icon: ShieldCheck,
    title: 'Evaluation Gate',
    short: 'Readiness evaluated with rigour.',
    desc:
      'Faculty panels assess documentation quality, inquiry discipline, and research readiness for sustained research.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    number: '06',
    icon: Microscope,
    title: 'Full Guided Research',
    short: 'Long-duration faculty-mentored inquiry.',
    desc:
      'Selected students engage in milestone-driven research contributing to institutional research circles.',
    color: 'from-fuchsia-500 to-purple-500',
  },
  {
    number: '07',
    icon: Landmark,
    title: 'Stewardship & Continuity',
    short: 'Giving back to the ecosystem.',
    desc:
      'Experienced scholars mentor future cohorts and preserve institutional research continuity.',
    color: 'from-slate-700 to-slate-900',
  },
]

export default function JourneyPage() {
  return (
    <div className="bg-[#F6F8FB] text-[#0F172A] overflow-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-white">

        <div className="absolute inset-0">
          <div className="absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[140px]" />
          <div className="absolute left-[-120px] bottom-[-120px] h-[520px] w-[520px] rounded-full bg-sky-400/10 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1700px] px-6 pb-28 pt-40 lg:px-16">

          {/* BREADCRUMB */}
          <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
            <span>Home</span>
            <span>→</span>
            <span className="text-slate-600">The KREST Journey</span>
          </div>

          <div className="max-w-6xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              Research Progression Framework
            </p>

            <h1 className="text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-slate-900">
              The KREST
              <br />
              Journey
            </h1>

            <p className="mt-10 max-w-4xl text-[clamp(1.2rem,2vw,1.6rem)] leading-[2] text-slate-600">
              Seven interconnected stages guiding students from first curiosity
              toward sustained research contribution, scholarly growth,
              mentorship, and institutional stewardship.
            </p>
          </div>

          {/* JOURNEY MAP */}
          <div className="relative mt-28 overflow-x-auto pb-10">

            <div className="absolute left-0 top-[68px] h-[2px] w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-slate-700" />

            <div className="relative flex min-w-[1500px] items-start justify-between gap-10">

              {stages.map((stage, index) => {
                const Icon = stage.icon

                return (
                  <a
                    key={stage.number}
                    href={`#stage-${stage.number}`}
                    className="group relative flex w-[190px] flex-col items-center text-center"
                  >

                    <div className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br ${stage.color} shadow-[0_20px_60px_rgba(79,70,229,0.18)] transition-all duration-500 group-hover:scale-105`}>

                      <div className="absolute inset-[8px] rounded-full bg-white/10 backdrop-blur-xl" />

                      <div className="relative z-10 flex flex-col items-center text-white">
                        <Icon size={30} />
                        <span className="mt-2 text-sm font-semibold tracking-[0.2em]">
                          {stage.number}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                      {stage.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {stage.short}
                    </p>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED STAGES */}
      <section className="relative py-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="space-y-28">

            {stages.map((stage, index) => {
              const Icon = stage.icon

              return (
                <div
                  key={stage.number}
                  id={`stage-${stage.number}`}
                  className="group grid gap-16 border-b border-black/5 pb-24 xl:grid-cols-[220px_1fr]"
                >

                  {/* LEFT */}
                  <div>

                    <div className={`flex h-28 w-28 items-center justify-center rounded-[32px] bg-gradient-to-br ${stage.color} shadow-lg`}>

                      <Icon size={34} className="text-white" />
                    </div>

                    <div className="mt-8 text-7xl font-bold leading-none tracking-[-0.06em] text-slate-200">
                      {stage.number}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div>

                    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-600">
                      Stage {stage.number}
                    </p>

                    <h2 className="text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
                      {stage.title}
                    </h2>

                    <p className="mt-8 max-w-5xl text-xl leading-[2] text-slate-600">
                      {stage.desc}
                    </p>

                    {/* CUSTOM CONTENT */}
                    {stage.number === '01' && (
                      <div className="mt-12 grid gap-6 md:grid-cols-3">

                        {[
                          'Explore the KREST ecosystem and pathways',
                          'Understand expectations and progression structure',
                          'Submit application aligned to interest and readiness',
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-[28px] border border-black/5 bg-white p-8"
                          >
                            <div className="mb-5 h-3 w-3 rounded-full bg-sky-500" />

                            <p className="text-[15px] leading-8 text-slate-700">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {stage.number === '03' && (
                      <div className="mt-14 grid gap-6 md:grid-cols-2">

                        {[
                          'Research methodology fundamentals',
                          'Academic integrity & ethics',
                          'Literature review & citation practice',
                          'Critical inquiry & evidence evaluation',
                          'Problem framing & hypothesis development',
                          'Research documentation standards',
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-4 rounded-[24px] bg-white p-6"
                          >
                            <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />

                            <p className="text-[15px] leading-8 text-slate-700">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {stage.number === '05' && (
                      <div className="mt-14 overflow-hidden rounded-[32px] border border-black/5 bg-white">

                        <div className="grid grid-cols-3 border-b border-black/5 bg-slate-50">

                          <div className="p-6 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Outcome
                          </div>

                          <div className="col-span-2 p-6 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                            Meaning
                          </div>
                        </div>

                        {[
                          {
                            title: 'Selected',
                            desc: 'Progresses into full guided research.',
                          },
                          {
                            title: 'Deferred',
                            desc: 'Encouraged for future intake cycles after further preparation.',
                          },
                          {
                            title: 'Redirected',
                            desc: 'Guided toward skill development or alternative pathways.',
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className="grid grid-cols-3 border-b border-black/5 last:border-none"
                          >

                            <div className="p-6 text-lg font-semibold text-slate-900">
                              {item.title}
                            </div>

                            <div className="col-span-2 p-6 text-[15px] leading-8 text-slate-600">
                              {item.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {stage.number === '06' && (
                      <div className="mt-14 grid gap-6 md:grid-cols-2">

                        {[
                          'Research papers & journal submissions',
                          'Technical reports & working papers',
                          'Datasets & experimental findings',
                          'Prototypes & proof-of-concept systems',
                          'Simulation frameworks & models',
                          'Applied research recommendations',
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-[24px] border border-black/5 bg-white p-7"
                          >
                            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-fuchsia-600">
                              Research Output
                            </div>

                            <p className="text-[15px] leading-8 text-slate-700">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {stage.number === '07' && (
                      <div className="relative mt-16 overflow-hidden rounded-[36px] bg-[#0F172A] p-10 text-white">

                        <div className="absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[100px]" />

                        <div className="relative z-10">

                          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-indigo-300">
                            KREST Fellowship
                          </p>

                          <h3 className="text-4xl font-semibold tracking-[-0.04em]">
                            Stewardship becomes legacy.
                          </h3>

                          <p className="mt-6 max-w-3xl text-lg leading-[2] text-slate-300">
                            Exceptional contributors may be recognised as
                            KREST Fellows — scholars who demonstrate research
                            excellence, mentorship capability, and long-term
                            contribution toward institutional research culture.
                          </p>

                          <button className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5">
                            Explore Fellowship
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}