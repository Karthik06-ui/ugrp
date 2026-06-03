import {
  ArrowRight,
  Microscope,
  CheckCircle2,
  FileText,
  Database,
  FlaskConical,
  Users,
  ShieldCheck,
  Brain,
  Globe2,
  Sparkles,
  Clock3,
  Target,
  Layers3,
  Rocket,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const milestones = [
  {
    number: '01',
    title: 'Research Scoping',
    desc:
      'Define the real-world problem, identify research gaps, map uncertainty, and establish the scope of inquiry.',
  },
  {
    number: '02',
    title: 'Literature Foundation',
    desc:
      'Build scholarly grounding through literature review, domain understanding, and theoretical exploration.',
  },
  {
    number: '03',
    title: 'Research Execution',
    desc:
      'Conduct experimentation, system development, analysis, simulations, field studies, or investigations.',
  },
  {
    number: '04',
    title: 'Synthesis & Documentation',
    desc:
      'Transform findings into structured outputs including reports, datasets, frameworks, papers, and prototypes.',
  },
  {
    number: '05',
    title: 'Review & Completion',
    desc:
      'Faculty assessment, refinement cycles, evaluation, and completion under KREST research standards.',
  },
]

const outputs = [
  {
    icon: FileText,
    title: 'Research Insights',
    desc: 'Evidence-backed findings that reveal how systems, people, and processes interact in the real world.',
  },
  {
    icon: Users,
    title: 'Stakeholder Understanding',
    desc: 'Meaningful perspectives gathered through engagement, observation, and field exploration.',
  },
  {
    icon: Layers3,
    title: 'System Maps',
    desc: 'Visual and analytical representations that uncover relationships, dependencies, and influencing factors.',
  },
  {
    icon: Target,
    title: 'Future Opportunities',
    desc: 'Research-backed directions that can inform innovation projects, advanced studies, and solution development.',
  },

  // {
  //   icon: ShieldCheck,
  //   title: 'Policy & Applied Research',
  //   desc: 'Impact-driven recommendations, studies, and solution frameworks.',
  // },
  // {
  //   icon: Layers3,
  //   title: 'Creative Research',
  //   desc: 'Design systems, interdisciplinary outputs, and exploratory artefacts.',
  // },
]

const benefits = [
  {
    icon: Brain,
    title: 'Think Like a Researcher',
    desc:
      'Learn how real research begins — identifying ambiguity, asking meaningful questions, and investigating deeply.',
  },
  {
    icon: Globe2,
    title: 'Work on Real Problems',
    desc:
      'Move beyond classroom exercises and explore systems, institutions, behaviour, technology, and society.',
  },
  {
    icon: Users,
    title: 'Guided Mentorship',
    desc:
      'Work directly with mentors through structured research guidance and milestone reviews.',
  },
  {
    icon: Rocket,
    title: 'Build Research Portfolio',
    desc:
      'Develop papers, datasets, frameworks, prototypes, and outputs valuable for higher studies and careers.',
  },
]

const eligibility = [
  '2029 Batch Undergraduate students with strong academic performance',
  'Interest in research and willingness to engage with complex problems',
  'Commitment to collaborative learning',
]

export default function KripPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F6F8FB] text-[#0F172A]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5 bg-[#0F172A] text-white">

        <div className="absolute inset-0">
          <div className="absolute left-[-120px] top-[-100px] h-[520px] w-[520px] rounded-full bg-teal-600/20 blur-[140px]" />
          <div className="absolute bottom-[-160px] right-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1650px] px-6 pb-32 pt-40 lg:px-16">

          {/* BREADCRUMB */}
          <div className="mb-10 flex items-center gap-3 text-sm text-slate-400">
            <span>Home</span>
            <span>→</span>
            <span>Programs</span>
            <span>→</span>
            <span className="text-white">KRIP</span>
          </div>

          <div className="max-w-6xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-300">
              Kumaraguru Research Internship Program
            </p>

            <h1 className="text-[clamp(4rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
              KRIP
            </h1>

            <p className="mt-10 max-w-4xl text-[clamp(1.05rem,1.4vw,1.5rem)] leading-[2] text-slate-300">
Discover What Lies Beneath the Obvious.              <br />
              <br />
              KRIP is a research-first internship programme where students
              investigate real-world systems, behaviours, institutions, and
              challenges before attempting solutions.
            </p>

            {/* HIGHLIGHT POINTS */}
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              {[
                'Explore beyond classrooms',
                'Investigate meaningful problems',
                'Work with uncertainty',
                'Learn how real research begins',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-1 text-fuchsia-300"
                    />

                    <p className="text-sm leading-7 text-slate-200">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-12 max-w-4xl text-lg leading-[2] text-slate-400">
Learn to Observe. Investigate. Understand.            </p>

            {/* CTA */}
            <div className="mt-12 flex flex-wrap gap-5">

              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full bg-teal-600 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-fuchsia-600 hover:gap-5"
              >
                Apply Now
                <ArrowRight size={18} />
              </Link>

              {/* <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                Submit Your Own Problem Statement
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT KRIP */}
<section className="relative overflow-hidden bg-white py-32">

  <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

    <div className="grid gap-20 lg:grid-cols-[0.9fr_1.1fr]">

      {/* LEFT */}
      <div>

        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
          About KRIP
        </p>

        <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
          Research Begins
          <br />
          with Curiosity.
        </h2>
      </div>

      {/* RIGHT */}
      <div>

        <p className="text-xl leading-[2] text-slate-700">
          The <strong>Kumaraguru Research Internship Programme (KRIP)</strong> is
          an immersive research experience that introduces students to the
          process of inquiry, investigation, and evidence-based understanding.
        </p>

        <p className="mt-8 text-lg leading-[2] text-slate-600">
          Through KRIP, students explore research opportunities emerging from
          industry, communities, institutions, public systems, and faculty-led
          initiatives. Working in collaborative teams under expert mentorship,
          participants engage with real-world contexts to uncover insights,
          understand systems, and contribute to meaningful knowledge creation.
        </p>

        <p className="mt-8 text-lg leading-[2] text-slate-600">
          More than an internship, KRIP is an opportunity to experience how
          research shapes innovation, informs decisions, and creates pathways
          for future impact.
        </p>

      </div>
    </div>

  </div>
</section>

      {/* WHY KRIP */}
      <section className="py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="mb-20 max-w-5xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
              Why KRIP
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              An Internship
              <br />
              Built Around Research
            </h2>

            <p className="mt-8 text-lg leading-[2] text-slate-600">
              KRIP is not a task-based internship. It is an immersive research
              environment where students investigate complex realities, work
              with uncertainty, and build meaningful scholarly outputs.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">

            {benefits.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-50">
                    <Icon size={28} className="text-teal-700" />
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-[15px] leading-8 text-slate-600">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* KRIP STRUCTURE */}
      <section className="overflow-hidden border-y border-black/5 bg-white py-32">

        <div className="mx-auto max-w-[1700px] px-6 lg:px-16">

          <div className="mb-20 max-w-5xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
              KRIP Structure
            </p>

            <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
              Research
              <br />
              as Progression
            </h2>

            <p className="mt-8 text-lg leading-[2] text-slate-600">
              KRIP follows a milestone-driven structure guiding students from
              research scoping to execution, synthesis, and scholarly
              completion.
            </p>
          </div>

          {/* INFINITE HORIZONTAL SCROLL */}
          <div className="relative overflow-hidden">

            <div className="flex w-max animate-[scroll_35s_linear_infinite] gap-8">

              {[...milestones, ...milestones].map((item, index) => (
                <div
                  key={index}
                  className="w-[430px] flex-shrink-0 rounded-[36px] border border-black/5 bg-[#F8FAFC] p-10"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-teal-600 to-emerald-600 text-2xl font-semibold text-white shadow-lg">
                      {item.number}
                    </div>

                    <Clock3
                      size={28}
                      className="text-slate-300"
                    />
                  </div>

                  <h3 className="mt-10 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-[16px] leading-[2] text-slate-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      {/* RESEARCH OUTPUTS */}
      <section className="py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="grid gap-20 lg:grid-cols-[0.8fr_1.2fr]">

            <div>

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
                Research Outcomes
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
                What You
                <br />
                Can Build
              </h2>

              <p className="mt-8 text-lg leading-[2] text-slate-600">
                KRIP encourages interdisciplinary research outputs ranging from
                scholarly publications to applied systems and simulations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {outputs.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[30px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.04)]"
                  >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-50">
                      <Icon size={24} className="text-teal-700" />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
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

      {/* FACULTY MENTORSHIP */}
      <section className="py-32">

        <div className="mx-auto max-w-[1500px] px-6 lg:px-16">

          <div className="relative overflow-hidden rounded-[42px] bg-[#0F172A] p-12 text-white lg:p-20">

            <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-teal-600/20 blur-[120px]" />

            <div className="relative z-10 grid gap-20 lg:grid-cols-[0.9fr_1.1fr]">

              <div>

                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-300">
                  Mentorship
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
                   mentor through a sustained research partnership built
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

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
                Eligibility
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
                Entry into KRIP
                <br />
                is Earned
              </h2>

              <p className="mt-8 text-lg leading-[2] text-slate-600">
                KRIP participation is reserved for students who demonstrate
                readiness for sustained faculty-guided research.
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
                      className="text-teal-700"
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
{/* TIMELINE */}{/* TIMELINE */}
<section className="border-t border-black/5 bg-white py-24">

  <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

    <div className="mb-16 max-w-4xl">

      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
        Timeline
      </p>

      <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-semibold tracking-[-0.05em] text-slate-900">
        KRIP 2026
      </h2>

    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

      {[
        {
          month: '5th June 2026',
          title: 'Applications Open',
        },
        {
          month: '10th June 2026 ',
          title: 'Selection Process',
        },
        {
          month: '15th June 2026',
          title: 'Shortlist Announcement',
        },
        {
          month: '20th June 2026',
          title: 'Orientation and Internship Kickoff ',
        },
        {
          month: '5th July 2026',
          title: 'Research Showcase and Internship Completion',
        },
      ].map((item) => (
        <div
          key={item.title}
          className="rounded-[24px] border border-black/5 bg-[#F8FAFC] p-6"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            {item.month}
          </p>

          <h3 className="mt-3 text-lg font-medium text-slate-900">
            {item.title}
          </h3>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* APPLICATION PROCESS */}
<section className="border-t border-black/5 bg-white py-32">

  <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

    <div className="mb-20 max-w-5xl">

      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
        Application Process
      </p>

      <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
        Your Pathway
        <br />
        into KRIP
      </h2>

      <p className="mt-8 text-lg leading-[2] text-slate-600">
        A structured selection process designed to identify students who are
        curious, committed, and ready to explore research through guided
        inquiry and collaboration.
      </p>
    </div>

    <div className="grid gap-8 lg:grid-cols-3">

      {[
        {
          number: '01',
          title: 'Submit Application',
          desc:
            'Complete the KRIP application form and upload your handwritten Statement of Purpose.',
        },
        {
          number: '02',
          title: 'Interaction Round',
          desc:
            'Participate in a short conversation with the KRIP team to share your interests, motivations, and aspirations.',
        },
        {
          number: '03',
          title: 'Selection & Onboarding',
          desc:
            'Selected applicants receive onboarding details and begin their KRIP research journey.',
        },
      ].map((item) => (
        <div
          key={item.title}
          className="rounded-[32px] border border-black/5 bg-[#F8FAFC] p-10"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-xl font-semibold text-white">
            {item.number}
          </div>

          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            {item.title}
          </h3>

          <p className="mt-4 text-[15px] leading-8 text-slate-600">
            {item.desc}
          </p>
        </div>
      ))}
    </div>

              {/* FINAL CTA */}
          <div className="mt-24 overflow-hidden rounded-[42px] bg-gradient-to-br from-fuchsia-600 to-purple-600 p-14 text-white shadow-[0_40px_100px_rgba(168,85,247,0.25)]">

            <div className="max-w-5xl">

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-fuchsia-100">
                Begin the Journey
              </p>

              <h2 className="text-[clamp(3rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                Start Your Research Journey.
              </h2>

              <p className="mt-8 max-w-3xl text-lg leading-[2] text-fuchsia-50">
                KRIP is designed for students who want to explore deeply,
                question meaningfully, and contribute through research-driven
                thinking.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5"
                >
                  Apply for KRIP
                  <ArrowRight size={18} />
                </Link>

                {/* <Link
                  to="/login"
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20"
                >
                  Submit Problem Statement
                  <Target size={18} />
                </Link> */}
              </div>
            </div>
          </div>

  </div>
</section>
    </div>
  )
}