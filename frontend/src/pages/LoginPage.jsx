import { useState } from 'react';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../lib/api';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      const user = { username: response.data.username, role: response.data.role, token: response.data.access_token };
      localStorage.setItem('ikip-user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0E11] px-4 py-10 font-['Inter']">

      {/* Blueprint grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#5B9BD5 1px, transparent 1px), linear-gradient(90deg, #5B9BD5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#F2B705]/10 blur-[120px]" />

      {/* Card wrapper: simple bordered card on mobile (like the registration screen), two-column panel on desktop */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-black/40 backdrop-blur-sm lg:max-w-5xl">

        {/* Corner brackets — only shown on the compact mobile card */}
        <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-[#F2B705]/70 lg:hidden" />
        <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-[#F2B705]/70 lg:hidden" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#F2B705]/70 lg:hidden" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#F2B705]/70 lg:hidden" />

        <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left info panel — hidden on mobile, visible from lg up */}
          <div className="relative hidden border-white/10 p-8 sm:p-10 lg:block lg:border-r">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5B9BD5]/10 via-transparent to-transparent" />

            <div className="relative mb-8 flex items-center gap-3">
              <ShieldCheck size={26} className="text-[#F2B705]" />
              <div>
                <p className="font-['JetBrains_Mono'] text-[11px] tracking-[0.25em] text-slate-500">
                  INDUSTRIAL KNOWLEDGE INTELLIGENCE PLATFORM
                </p>
                <h1 className="mt-1 font-['Oswald'] text-2xl font-semibold uppercase tracking-wide text-white">
                  Operational intelligence, every shift
                </h1>
              </div>
            </div>

            <div className="relative space-y-4">
              <p className="group rounded-lg border border-[#F2B705]/20 bg-[#F2B705]/[0.04] p-4 text-sm text-slate-300 transition-colors duration-300 hover:border-[#F2B705]/40">
                <span className="mb-2 block font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#F2B705]">
                  01 / INGEST
                </span>
                Upload SOPs, maintenance manuals, and safety documents to build a private retrieval layer for your plant.
              </p>
              <p className="group rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300 transition-colors duration-300 hover:border-[#5B9BD5]/40">
                <span className="mb-2 block font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#5B9BD5]">
                  02 / RETRIEVE
                </span>
                Ask natural-language questions and get answers with citations, confidence scores, and source context.
              </p>
            </div>

            <div className="relative mt-8 flex items-center gap-2 border-t border-white/10 pt-6 font-['JetBrains_Mono'] text-xs tracking-wide text-slate-500">
              <Sparkles size={16} className="text-[#F2B705]" />
              FastAPI · React · Chroma-ready retrieval · Groq reasoning
            </div>
          </div>

          {/* Right panel — the login form itself, always visible */}
          <div className="relative p-8 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="font-['JetBrains_Mono'] text-[11px] tracking-[0.25em] text-[#F2B705]">
                  SECURE ACCESS
                </p>
                <h2 className="mt-2 font-['Oswald'] text-2xl font-semibold uppercase tracking-wide text-white">
                  Sign in
                </h2>
              </div>
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-400">
                  USERNAME
                </span>
                <input
                  value={form.username}
                  required
                  placeholder="rkumar"
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B0E11] px-4 py-3 text-white outline-none transition-all duration-200 focus:border-[#F2B705]/60 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.12)]"
                />
              </label>

              <label className="block">
                <span className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-400">
                  PASSWORD
                </span>
                <input
                  type="password"
                  value={form.password}
                  required
                  placeholder="••••••••"
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B0E11] px-4 py-3 text-white outline-none transition-all duration-200 focus:border-[#F2B705]/60 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.12)]"
                />
              </label>

              {error ? (
                <p className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                  {error}
                </p>
              ) : null}

              <button
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#F2B705] px-4 py-3 font-['JetBrains_Mono'] font-semibold tracking-wide text-[#0B0E11] transition-all duration-300 hover:shadow-[0_0_25px_-4px_#F2B705] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Lock size={18} />
                  {loading ? 'Signing in...' : 'Access platform'}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
              </button>

              <div className="mt-6 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = "/register"}
                  className="group mt-2 inline-flex items-center gap-1 font-['JetBrains_Mono'] text-sm font-medium text-[#5B9BD5] transition hover:text-[#F2B705]"
                >
                  Create Worker Account
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}