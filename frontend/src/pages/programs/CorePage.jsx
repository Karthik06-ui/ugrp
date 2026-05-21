import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers3,
  FileSearch,
  BrainCircuit,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const coreFeatures = [
  {
    icon: Layers3,
    title: 'Embedded within coursework',
    desc:
      'Research inquiry is integrated directly into existing academic structures — making exploration part of learning itself.',
  },
  {
    icon: FileSearch,
    title: 'Faculty-guided inquiry',
    desc:
      'Students engage with research tasks under faculty mentorship, ensuring clarity, rigour, and academic relevance.',
  },
  {
    icon: BrainCircuit,
    title: 'Research habit formation',
    desc:
      'CORE develops scholarly thinking gradually through repeated exposure to inquiry, analysis, and structured reflection.',
  },
]

const activities = [
  'Literature review and source evaluation',
  'Research-integrated assignments and case studies',
  'Data collection and introductory analysis',
  'Inquiry-driven learning modules',
  'Problem framing and analytical exploration',
  'Research documentation within coursework',
]

export default function CorePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F6F8FB] text-[#0F172A]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-white">

        <div className="absolute inset-0">
          <div className="absolute left-[-120px] top-[-100px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[130px]" />
          <div className="absolute bottom-[-140px] right-[-120px] h-[520px] w-[520px] rounded-full bg-sky-400/10 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1650px] px-6 pb-28 pt-40 lg:px-16">

          <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
            <span>Home</span>
            <span>→</span>
            <span>Programs</span>
            <span>→</span>
            <span className="text-slate-600">CORE</span>
          </div>

          <div className="max-w-6xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              Course-embedded Research Exposure
            </p>

            <h1 className="text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-slate-900">
              CORE
            </h1>

            <p className="mt-8 max-w-4xl text-[clamp(1.3rem,2vw,1.65rem)] leading-[2] text-slate-600">
              Research doesn't have to wait for a separate track. It begins
              within the academic work students are already doing — through
              guided inquiry, contextual exploration, and structured exposure.
            </p>

            <p className="mt-8 max-w-4xl text-lg leading-[2] text-slate-500">
              CORE integrates research thinking directly into coursework
              environments, enabling students across disciplines to engage with
              scholarly inquiry naturally within their learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT CORE IS */}
      <section className="py-32">

        <div className="mx-auto grid max-w-[1650px] gap-20 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-16">

          <div>

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              The CORE Model
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              Research
              <br />
              in Context
            </h2>
          </div>

          <div>

            <p className="text-[18px] leading-[2] text-slate-600">
              CORE is built on the principle that research capability develops
              most effectively when inquiry emerges naturally within academic
              learning environments. Rather than separating research from
              coursework, CORE embeds investigation, analysis, and scholarly
              thinking directly into the subjects students are already studying.
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-3">

              {coreFeatures.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[30px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
                  >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                      <Icon size={24} className="text-indigo-600" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-[15px] leading-8 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section className="border-y border-black/5 bg-white py-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="grid gap-20 lg:grid-cols-2">

            <div>

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
                Eligibility & Context
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
                Who CORE
                <br />
                is Designed For
              </h2>
            </div>

            <div className="space-y-6">

              {[
                'Students across disciplines seeking research exposure within regular academic environments',
                'Students interested in developing inquiry habits before entering advanced research pathways',
                'Course structures identified by faculty as suitable for research-integrated learning',
                'Learners exploring whether deeper research engagement aligns with their academic interests',
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-5 rounded-[28px] border border-black/5 bg-[#F8FAFC] p-7"
                >

                  <div className="mt-1">
                    <CheckCircle2
                      size={22}
                      className="text-indigo-600"
                    />
                  </div>

                  <p className="text-[16px] leading-[2] text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="mb-20 max-w-5xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              The CORE Experience
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              What Participation
              <br />
              Looks Like
            </h2>

            <p className="mt-8 text-lg leading-[2] text-slate-600">
              CORE activities are intentionally integrated into academic
              environments — allowing students to experience research through
              structured coursework engagement and guided intellectual practice.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {activities.map((activity) => (
              <div
                key={activity}
                className="group rounded-[32px] border border-black/5 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 transition-all duration-300 group-hover:scale-110">
                  <BookOpen size={24} className="text-indigo-600" />
                </div>

                <p className="mt-8 text-[17px] leading-[1.9] text-slate-700">
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PATHWAY */}
      <section className="pb-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="overflow-hidden rounded-[42px] bg-[#0F172A] p-12 lg:p-20 text-white relative">

            <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-[120px]" />

            <div className="relative z-10 max-w-5xl">

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-300">
                The Wider KREST Pathway
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                CORE strengthens
                <br />
                research readiness.
              </h2>

              <p className="mt-8 text-lg leading-[2] text-slate-300">
                CORE can function as an independent research exposure
                experience, complement REFLECT training, or support students
                preparing for advanced guided research pathways such as KRIP.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  to="/programs/reflect"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5"
                >
                  Explore REFLECT
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/programs/krip"
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  Explore KRIP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}