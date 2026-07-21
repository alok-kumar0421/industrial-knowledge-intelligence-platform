import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, FileText, Bot } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#E8EAED] font-['Inter'] relative overflow-hidden">

      {/* Blueprint grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#5B9BD5 1px, transparent 1px), linear-gradient(90deg, #5B9BD5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Ambient amber glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#F2B705]/10 blur-[120px]" />

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-8 py-5 backdrop-blur-sm">
        <div className="flex flex-col leading-none">
          <h1 className="font-['Oswald'] text-2xl font-bold tracking-wide text-[#F2B705]">
            IKIP
          </h1>
          <span className="mt-1 font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] text-slate-500">
            REV&nbsp;2.4&nbsp;·&nbsp;INDUSTRIAL&nbsp;OS
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="group relative font-['JetBrains_Mono'] text-sm tracking-wide text-slate-300 transition hover:text-white"
          >
            Login
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#F2B705] transition-all duration-300 group-hover:w-full" />
          </Link>

          <Link
            to="/register"
            className="group relative overflow-hidden rounded-md bg-[#F2B705] px-5 py-2.5 font-['JetBrains_Mono'] text-sm font-semibold tracking-wide text-[#0B0E11] transition-all duration-300 hover:shadow-[0_0_20px_-2px_#F2B705]"
          >
            <span className="relative z-10">Register</span>
            <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-8 py-28 text-center">

        <span className="flex items-center gap-2 rounded-sm border border-[#F2B705]/40 bg-[#F2B705]/5 px-4 py-1.5 font-['JetBrains_Mono'] text-xs tracking-[0.15em] text-[#F2B705]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F2B705]" />
          AI-POWERED INDUSTRIAL INTELLIGENCE
        </span>

        <h1 className="mt-8 font-['Oswald'] text-6xl font-bold uppercase leading-tight tracking-tight text-white">
          Industrial Knowledge
          <br />
          <span className="text-[#5B9BD5]">Intelligence</span> Platform
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Upload SOPs, maintenance manuals and safety documents. Workers can ask
        AI questions directly, while owners manage the entire knowledge base
        from a single dashboard.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="group relative flex items-center gap-2 overflow-hidden rounded-md bg-[#F2B705] px-7 py-4 font-['JetBrains_Mono'] font-semibold tracking-wide text-[#0B0E11] transition-all duration-300 hover:shadow-[0_0_30px_-4px_#F2B705]"
          >
            <span className="relative z-10">Login</span>
            <ArrowRight
              size={18}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            />
            <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>

          <Link
            to="/register"
            className="rounded-md border border-white/15 px-7 py-4 font-['JetBrains_Mono'] tracking-wide text-slate-300 transition-all duration-300 hover:border-[#5B9BD5]/60 hover:bg-[#5B9BD5]/10 hover:text-white"
          >
            Create Worker Account
          </Link>
        </div>
      </section>

      {/* Status ticker strip — signature element */}
      <div className="relative z-10 flex overflow-hidden border-y border-white/10 bg-white/[0.02] py-3">
        <div className="flex shrink-0 animate-[scroll_22s_linear_infinite] gap-10 whitespace-nowrap font-['JetBrains_Mono'] text-xs tracking-[0.2em] text-slate-500">
          {Array(2).fill(0).map((_, i) => (
            <span key={i} className="flex items-center gap-10">
              <span>SOP&nbsp;LIBRARY</span>
              <span className="text-[#F2B705]">●</span>
              <span>MAINTENANCE&nbsp;LOGS</span>
              <span className="text-[#F2B705]">●</span>
              <span>SAFETY&nbsp;PROTOCOLS</span>
              <span className="text-[#F2B705]">●</span>
              <span>AI&nbsp;ASSISTANT</span>
              <span className="text-[#F2B705]">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features — nameplate cards */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-8 py-24 md:grid-cols-3">

        {[
          {
            icon: Bot,
            code: "MOD / AI-01",
            title: "AI Assistant",
            desc: "Ask maintenance, safety and equipment questions to AI — get instant answers.",
          },
          {
            icon: FileText,
            code: "MOD / DOC-02",
            title: "PDF Knowledge Base",
            desc: "Upload manuals and they instantly become searchable knowledge.",
          },
          {
            icon: ShieldCheck,
            code: "MOD / SEC-03",
            title: "Worker Management",
            desc: "Approve workers and monitor their AI queries.",
          },
        ].map(({ icon: Icon, code, title, desc }) => (
          <div
            key={code}
            className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F2B705]/50 hover:bg-white/[0.04] hover:shadow-[0_0_35px_-10px_#F2B705]"
          >
            {/* corner brackets */}
            <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[#F2B705]/0 transition-colors duration-300 group-hover:border-[#F2B705]/70" />
            <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[#F2B705]/0 transition-colors duration-300 group-hover:border-[#F2B705]/70" />
            <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#F2B705]/0 transition-colors duration-300 group-hover:border-[#F2B705]/70" />
            <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#F2B705]/0 transition-colors duration-300 group-hover:border-[#F2B705]/70" />

            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-slate-500">
                {code}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 transition group-hover:bg-[#F2B705]" />
            </div>

            <Icon
              className="mt-5 text-[#5B9BD5] transition-all duration-300 group-hover:scale-110 group-hover:text-[#F2B705]"
              size={28}
            />

            <h2 className="mt-4 font-['Oswald'] text-xl font-semibold uppercase tracking-wide text-white">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {desc}
            </p>
          </div>
        ))}

      </section>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}