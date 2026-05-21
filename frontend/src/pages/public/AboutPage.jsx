import { ArrowRight } from 'lucide-react'

const meaning = [
  {
    letter: 'K',
    word: 'Kumaraguru',
    desc: 'Institutional identity rooted in Kumaraguru Institutions and its long-term academic vision.',
  },
  {
    letter: 'R',
    word: 'Research',
    desc: 'Research as the central pursuit — inquiry, discovery, contribution, and knowledge creation.',
  },
  {
    letter: 'E',
    word: 'Exploration',
    desc: 'Curiosity-driven learning that encourages interdisciplinary thinking and intellectual openness.',
  },
  {
    letter: 'S',
    word: 'Science',
    desc: 'Scientific reasoning, evidence-based inquiry, and structured problem solving across domains.',
  },
  {
    letter: 'T',
    word: 'Technology',
    desc: 'The application of systems, tools, engineering, and innovation to create meaningful impact.',
  },
]

const principles = [
  {
    title: 'Structured Progression',
    desc: 'Students move through clearly designed stages that progressively build research capability, academic maturity, and scholarly confidence.',
  },
  {
    title: 'Faculty-Led Mentorship',
    desc: 'Every research journey is guided by mentors and domain experts who shape inquiry through rigorous academic direction.',
  },
  {
    title: 'Interdisciplinary Inquiry',
    desc: 'KREST encourages students to connect ideas across science, engineering, design, systems, and emerging technologies.',
  },
  {
    title: 'Institutional Continuity',
    desc: 'Research knowledge, documentation, and scholarly outputs are preserved and carried forward across student generations.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#F6F7FB] text-[#0F172A] overflow-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-white">

        <div className="absolute inset-0">
          <div className="absolute top-[-120px] right-[-120px] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[140px]" />
          <div className="absolute bottom-[-200px] left-[-100px] h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-40 pb-28 lg:px-16">

          {/* BREADCRUMB */}
          <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
            <span>Home</span>
            <span>→</span>
            <span className="text-slate-600">About KREST</span>
          </div>

          <div className="max-w-6xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-600">
              Institutional Research Framework
            </p>

            <h1 className="max-w-6xl text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-slate-900">
              About KREST
            </h1>

            <p className="mt-8 max-w-4xl text-[clamp(1.2rem,2vw,1.7rem)] leading-[1.9] text-slate-600">
              A structured institutional ecosystem designed to cultivate
              research capability, interdisciplinary exploration, scholarly
              thinking, and long-term academic contribution across Kumaraguru Institutions.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION — WHAT KREST MEANS */}
      <section className="relative py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="grid gap-20 xl:grid-cols-[0.9fr_1.1fr]">

            {/* LEFT */}
            <div>

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-600">
                The Name
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
                Every Letter
                <br />
                Carries Intent.
              </h2>

              <p className="mt-10 max-w-xl text-lg leading-[2] text-slate-600">
                KREST represents a long-term institutional commitment toward
                research culture, inquiry-driven education, and scholarly development.
                Each letter reflects a foundational pillar shaping the framework.
              </p>

              <div className="mt-14 rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
                <p className="text-lg leading-[2] text-slate-700">
                  The word <span className="font-semibold text-slate-900">KREST</span> evokes the idea of a summit —
                  a point of elevation reached through discipline, progression,
                  and sustained intellectual effort.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">

              {meaning.map((item) => (
                <div
                  key={item.letter}
                  className="group rounded-[34px] border border-black/5 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex gap-8">

                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-indigo-50 text-3xl font-bold text-indigo-600">
                      {item.letter}
                    </div>

                    <div>

                      <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                        {item.word}
                      </h3>

                      <p className="mt-3 text-[16px] leading-8 text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — HIERARCHY */}
      <section className="bg-[#0F172A] py-32 text-white">

        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">

          <div className="max-w-4xl">

            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-indigo-300">
              Institutional Structure
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
              KREST within the
              <br />
              Ré Research Ecosystem
            </h2>

            <p className="mt-10 text-lg leading-[2] text-slate-300">
              Ré serves as the institution-wide research initiative guiding
              research vision and scholarly advancement across Kumaraguru Institutions.
              KREST functions as its structured framework —
              translating institutional research ambition into guided pathways,
              mentorship systems, and sustained inquiry opportunities.
            </p>
          </div>

          {/* DIAGRAM */}
          <div className="mt-24 flex flex-col items-center">

            <div className="rounded-[30px] border border-white/10 bg-white/5 px-20 py-10 backdrop-blur-xl">
              <h3 className="text-5xl font-semibold tracking-[-0.04em]">
                Ré
              </h3>
            </div>

            <div className="h-20 w-[1px] bg-white/20" />

            <div className="rounded-[30px] border border-indigo-400/20 bg-indigo-500/10 px-20 py-10">
              <h3 className="text-5xl font-semibold tracking-[-0.04em]">
                KREST
              </h3>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">

              {['REFLECT', 'CORE', 'KRIP'].map((item) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-white/10 bg-white/5 px-12 py-10 text-center backdrop-blur-xl"
                >
                  <h4 className="text-2xl font-semibold">
                    {item}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — PRINCIPLES */}
      <section className="py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="mb-24 max-w-5xl">

            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-indigo-600">
              Core Principles
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
              Principles that Shape
              <br />
              Every Research Journey
            </h2>

            <p className="mt-10 max-w-4xl text-lg leading-[2] text-slate-600">
              Every mentorship structure, evaluation pathway, and research experience
              within KREST is guided by a common institutional philosophy focused on
              preparation, continuity, scholarly depth, and sustained contribution.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">

            {principles.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[36px] border border-black/5 bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(15,23,42,0.08)]"
              >

                <div className="mb-10 text-6xl font-bold leading-none text-indigo-100">
                  0{index + 1}
                </div>

                <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-6 text-[17px] leading-[2] text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL STATEMENT */}
      <section className="pb-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="relative overflow-hidden rounded-[44px] bg-[#0F172A] px-10 py-24 lg:px-20">

            <div className="absolute right-[-120px] top-[-120px] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[120px]" />

            <div className="relative z-10 max-w-5xl">

              <p className="mb-6 text-[11px] uppercase tracking-[0.35em] text-indigo-300">
                Institutional Vision
              </p>

              <h2 className="text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
                Building a research-first
                academic culture for the future.
              </h2>

              <p className="mt-10 max-w-4xl text-xl leading-[2] text-slate-300">
                KREST is designed to strengthen research capability across
                Kumaraguru Institutions through structured progression,
                interdisciplinary inquiry, faculty mentorship, and long-term
                scholarly continuity — creating an ecosystem where students
                evolve into capable contributors to meaningful research.
              </p>

              <button className="group mt-14 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5">
                Explore Research Pathways
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}