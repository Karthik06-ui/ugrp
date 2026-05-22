import Navbar from "../../components/layout/Navbar";
import heroVideo from "../../assets/hero.mp4";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Sparkles,
  FlaskConical,
  BrainCircuit,
  Globe,
} from "lucide-react";

import { motion } from "framer-motion";

const programs = [
  {
    title: "REFLECT",
    subtitle: "Foundational Research Training",
    desc: "Build academic research literacy, critical thinking, and scholarly discipline before entering structured research.",
    icon: BrainCircuit,
  },
  {
    title: "CORE",
    subtitle: "Course Embedded Research",
    desc: "Integrate inquiry-driven learning directly into coursework through guided faculty engagement.",
    icon: FlaskConical,
  },
  {
    title: "KRIP",
    subtitle: "Research Internship Program",
    desc: "Contribute to faculty-led research initiatives through long-term mentorship and milestone-based progression.",
    icon: Globe,
  },
];

const stats = [
  { value: "50+", label: "Researchers" },
  { value: "15+", label: "Live Projects" },
  { value: "10+", label: "Research Domains" },
  { value: "100+", label: "Students Engaged" },
];

export default function LandingPage() {
  return (
    <div className="bg-[#071019] text-white overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center border-b border-white/10">
        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* OVERLAY */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#071019]/80 to-[#071019]" /> */}

        {/* GLOW */}
        <div className="absolute top-[-120px] left-[-100px] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >


<h1 className="text-[clamp(3rem,7vw,7rem)] leading-[0.92] font-semibold tracking-[-0.06em]">
  Every question is a beginning.
  <br />

  <span className="text-cyan-400 text-[clamp(1.8rem,4vw,4rem)]">
    KREST is where it becomes research.
  </span>
</h1>

            <p className="mt-10 max-w-2xl text-lg leading-8 text-white/70">
              KREST unifies every research opportunity into a
              single structured ecosystem enabling students to move from
              curiosity to contribution through guided research pathways.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-cyan-300 transition"
              >
                Explore Research
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/about"
                className="border border-white/20 px-6 py-3 hover:bg-white/5 transition"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-white/10 bg-[#0A1622]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.label}>
              <h3 className="text-5xl font-semibold text-cyan-400">
                {s.value}
              </h3>

              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl mb-20">
            <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm mb-5">
              Structured Pathways
            </p>

            <h2 className="text-6xl leading-[0.95] tracking-[-0.05em] font-semibold">
              One ecosystem.
              <br />
              Three research journeys.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {programs.map((p) => {
              const Icon = p.icon;

              return (
                <div
                  key={p.title}
                  className="group border border-white/10 bg-white/[0.03] p-10 hover:bg-white/[0.05] transition duration-500"
                >
                  <Icon
                    size={40}
                    className="text-cyan-400 mb-10"
                  />

                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-3">
                    {p.subtitle}
                  </p>

                  <h3 className="text-4xl font-semibold tracking-[-0.04em]">
                    {p.title}
                  </h3>

                  <p className="mt-6 text-white/70 leading-8">
                    {p.desc}
                  </p>

                  <Link
                    to={`/programs/${p.title.toLowerCase()}`}
                    className="mt-10 inline-flex items-center gap-2 text-cyan-400"
                  >
                    Explore Program
                    <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RESEARCH PHILOSOPHY */}
      <section className="border-y border-white/10 bg-[#0A1622] py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-cyan-400 text-sm mb-6">
              Philosophy
            </p>

            <h2 className="text-6xl leading-[0.95] tracking-[-0.05em] font-semibold">
              Research should begin before graduation.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-9 text-white/70">
              KREST is designed around a simple belief:
              students should not wait until postgraduate education to
              experience meaningful research.
            </p>

            <p className="mt-8 text-lg leading-9 text-white/70">
              By combining structured training, curriculum integration,
              and faculty mentorship, KREST creates an environment where
              undergraduate students can contribute to real inquiry,
              innovation, and knowledge creation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Sparkles
            size={40}
            className="mx-auto text-cyan-400 mb-8"
          />

          <h2 className="text-6xl leading-[1] tracking-[-0.05em] font-semibold">
            Start your research journey.
          </h2>

          <p className="mt-8 text-lg text-white/70 leading-8 max-w-2xl mx-auto">
            Join a growing ecosystem of students, faculty mentors,
            and interdisciplinary researchers shaping the future
            of undergraduate research.
          </p>

          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-black px-8 py-4 font-medium hover:bg-cyan-300 transition"
            >
              Join KREST
            </Link>

            {/* <Link
              to="/projects"
              className="border border-white/20 px-8 py-4 hover:bg-white/5 transition"
            >
              Browse Projects
            </Link> */}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="font-semibold text-xl">KREST</h3>

            <p className="mt-3 text-white/50 text-sm max-w-sm">
              Kumaraguru Research and Exploration in Science and Technology.
            </p>
          </div>

          <div className="flex gap-10 text-sm text-white/50">
            <Link to="/about" className="hover:text-white">
              About
            </Link>

            <Link to="/projects" className="hover:text-white">
              Projects
            </Link>

            <Link to="/blog" className="hover:text-white">
              Blogs
            </Link>

            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}