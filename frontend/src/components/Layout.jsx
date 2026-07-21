import { LogOut, Cpu, FileText, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ownerNav = [
  { to: "/", label: "Overview", icon: Cpu },
  { to: "/workers", label: "Worker Management", icon: FileText },
  { to: "/assistant", label: "Assistant", icon: MessageCircle },
];

const workerNav = [
  { to: "/assistant", label: "Assistant", icon: MessageCircle },
];

export default function Layout({ children, user, onLogout }) {
  const location = useLocation();
  const navItems = user.role === "owner" ? ownerNav : workerNav;

  return (
    <div className="relative min-h-screen bg-[#0B0E11] text-slate-100 font-['Inter']">

      {/* Blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#5B9BD5 1px, transparent 1px), linear-gradient(90deg, #5B9BD5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col lg:flex-row">

        {/* Sidebar */}
        <aside className="w-full border-b border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">

          {/* Brand */}
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl border border-[#F2B705]/30 bg-[#F2B705]/10 p-3 text-[#F2B705]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-['JetBrains_Mono'] text-[10px] tracking-[0.25em] text-slate-500">
                IKIP
              </p>
              <h1 className="font-['Oswald'] text-lg font-semibold uppercase tracking-wide text-white">
                Industrial AI
              </h1>
            </div>
          </div>

          {/* Signed-in card */}
          <div className="mb-8 rounded-xl border border-white/10 bg-[#0B0E11] p-4">
            <p className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-slate-500">
              SIGNED IN AS
            </p>
            <p className="mt-1.5 font-semibold text-white">{user.username}</p>
            <p className="mt-0.5 flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs uppercase tracking-wide text-[#F2B705]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F2B705]" />
              {user.role}
            </p>
          </div>

          {/* Nav */}
          <nav className="space-y-1.5">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-3 overflow-hidden rounded-lg px-4 py-3 font-['JetBrains_Mono'] text-sm tracking-wide transition-all duration-200 ${
                    active
                      ? 'bg-[#F2B705]/10 text-[#F2B705]'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-0.5 bg-[#F2B705] transition-opacity duration-200 ${
                      active ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0B0E11] px-4 py-3 font-['JetBrains_Mono'] text-sm tracking-wide text-slate-400 transition-all duration-200 hover:border-rose-500/40 hover:text-rose-400"
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        </aside>

        {/* Main content */}
        <main className="relative flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}