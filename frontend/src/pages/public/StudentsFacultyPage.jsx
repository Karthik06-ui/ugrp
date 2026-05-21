import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react'

export default function StudentsFacultyPage() {
  const studentBenefits = [
    {
      title: 'Foundational Research Literacy',
      desc: 'Understand methodology, ethics, literature engagement, documentation standards, and scholarly inquiry as practiced capability.',
    },
    {
      title: 'Genuine Research Experience',
      desc: 'Work on structured research problems through guided inquiry, evaluation, and documented research practice.',
    },
    {
      title: 'Faculty Mentorship',
      desc: 'Collaborate directly with faculty mentors through sustained academic engagement and milestone-based guidance.',
    },
    {
      title: 'Research Portfolio',
      desc: 'Develop papers, reports, datasets, prototypes, and documented outputs that demonstrate real scholarly work.',
    },
  ]

  const facultyBenefits = [
    {
      title: 'Prepared Researchers',
      desc: 'Students entering KRIP already understand research fundamentals, ethics, literature review, and documentation discipline.',
    },
    {
      title: 'Structured Mentoring',
      desc: 'Milestone-based progression ensures research mentorship remains focused, manageable, and academically productive.',
    },
    {
      title: 'Institutional Continuity',
      desc: 'KREST preserves research knowledge across student batches through stewardship and structured documentation.',
    },
    {
      title: 'Research Output Support',
      desc: 'Support faculty-led inquiry through committed student researchers capable of contributing meaningfully to active projects.',
    },
  ]

  return (
    <div className="bg-[#F7F9FC] text-[#0F172A] overflow-hidden">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-[#07111F] text-white">

        <div className="absolute inset-0">
          <div className="absolute top-[-180px] right-[-120px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />
          <div className="absolute bottom-[-200px] left-[-140px] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1650px] px-6 pb-28 pt-40 lg:px-16">

          <div className="grid items-center gap-20 xl:grid-cols-2">

            {/* LEFT */}
            <div>

              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-300">
                KREST Community
              </p>

              <h1 className="text-[clamp(4rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
                Your Research
                <br />
                Journey Starts
                <br />
                Here.
              </h1>

              <p className="mt-10 max-w-2xl text-[18px] leading-[2] text-slate-300">
                KREST brings together students, faculty mentors, and research
                ecosystems into one continuous framework for inquiry,
                experimentation, and scholarly growth at Kumaraguru Institutions.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">

                <a
                  href="/programs/reflect"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5"
                >
                  Begin with REFLECT
                  <ArrowRight size={18} />
                </a>

                <a
                  href="/about"
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  Explore KREST
                </a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">

              <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <GraduationCap className="mb-6 text-cyan-300" size={34} />

                  <h3 className="text-2xl font-semibold">
                    For Students
                  </h3>

                  <p className="mt-5 text-[15px] leading-[2] text-slate-300">
                    Structured research training, faculty mentorship, research
                    projects, scholarly development, and institutional recognition.
                  </p>
                </div>

                <div className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:mt-16">
                  <Users className="mb-6 text-indigo-300" size={34} />

                  <h3 className="text-2xl font-semibold">
                    For Faculty
                  </h3>

                  <p className="mt-5 text-[15px] leading-[2] text-slate-300">
                    Prepared student researchers, structured mentoring systems,
                    milestone tracking, and sustained institutional continuity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR STUDENTS */}
      <section className="relative py-32">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="mb-20 max-w-5xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-600">
              For Students
            </p>

            <h2 className="text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-slate-900">
              Curiosity becomes
              <br />
              structured inquiry.
            </h2>

            <p className="mt-10 max-w-4xl text-[18px] leading-[2] text-slate-600">
              KREST is designed for students who want to engage deeply with
              research, guided inquiry, and scholarly practice through a
              structured progression framework.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">

            {studentBenefits.map((item) => (
              <div
                key={item.title}
                className="group rounded-[34px] border border-black/5 bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
              >

                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
                  <BookOpen size={24} className="text-cyan-700" />
                </div>

                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-6 text-[15px] leading-[2] text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* PROCESS */}
          <div className="mt-28 rounded-[42px] border border-black/5 bg-white p-10 lg:p-16">

            <div className="max-w-5xl">

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-600">
                Student Journey
              </p>

              <h3 className="text-[clamp(2.5rem,4vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-slate-900">
                The KREST progression pathway.
              </h3>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">

              {[
                'Begin with REFLECT foundational training',
                'Complete the Nano Research Project',
                'Progress into KRIP guided research',
              ].map((step, i) => (
                <div
                  key={step}
                  className="rounded-[28px] bg-slate-50 p-8"
                >

                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    0{i + 1}
                  </div>

                  <p className="text-lg leading-[1.9] text-slate-700">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="/programs/reflect"
              className="group mt-14 inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:gap-5"
            >
              Apply to KREST
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FOR FACULTY */}
      <section className="relative bg-[#07111F] py-32 text-white">

        <div className="absolute inset-0">
          <div className="absolute top-[-160px] left-[10%] h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-16">

          <div className="mb-20 max-w-5xl">

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-300">
              For Faculty
            </p>

            <h2 className="text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Research mentorship
              <br />
              supported by structure.
            </h2>

            <p className="mt-10 max-w-4xl text-[18px] leading-[2] text-slate-300">
              KREST reduces the preparation burden on faculty by ensuring that
              students entering mentorship already possess foundational research
              capability, documentation discipline, and scholarly readiness.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">

            {facultyBenefits.map((item) => (
              <div
                key={item.title}
                className="rounded-[34px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
              >

                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck size={24} className="text-indigo-300" />
                </div>

                <h3 className="text-2xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-6 text-[15px] leading-[2] text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* MENTORSHIP BLOCK */}
          <div className="mt-28 grid gap-10 rounded-[42px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl lg:grid-cols-[1fr_0.8fr] lg:p-16">

            <div>

              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-300">
                Faculty Mentorship
              </p>

              <h3 className="text-[clamp(2.5rem,4vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                Built for sustained,
                meaningful research guidance.
              </h3>

              <p className="mt-8 max-w-3xl text-[17px] leading-[2] text-slate-300">
                Faculty mentors guide research scoping, review milestone
                progress, support scholarly writing, and contribute to the
                long-term development of Kumaraguru Institutions' research ecosystem.
              </p>
            </div>

            <div className="space-y-5">

              {[
                'Milestone-based research supervision',
                'Structured faculty review processes',
                'Institutional research continuity',
                'Support for publication and research outputs',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/5 p-6"
                >

                  <CheckCircle2
                    size={22}
                    className="mt-1 text-indigo-300"
                  />

                  <p className="text-[15px] leading-8 text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <a
            href="/faculty/apply"
            className="group mt-14 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-5"
          >
            Express Interest in Mentorship
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-32">

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-slate-900 shadow-2xl">
            <FlaskConical size={42} className="text-white" />
          </div>

          <h2 className="mt-12 text-[clamp(3rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-slate-900">
            Research culture
            <br />
            begins with people.
          </h2>

          <p className="mx-auto mt-10 max-w-4xl text-[18px] leading-[2] text-slate-600">
            KREST exists to create an ecosystem where students, faculty,
            mentors, and researchers collectively contribute to meaningful,
            structured, and lasting scholarly work.
          </p>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-5">

            <a
              href="/programs"
              className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:gap-5"
            >
              Explore Programs
              <ArrowRight size={18} />
            </a>

            <a
              href="/about"
              className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50"
            >
              About KREST
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}