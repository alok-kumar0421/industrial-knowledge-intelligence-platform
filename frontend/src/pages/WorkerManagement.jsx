import { useEffect, useState } from "react";
import { UserCheck, UserX, UserMinus, Users, Clock } from "lucide-react";
import api from "../lib/api";

export default function WorkerManagement() {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [approvedWorkers, setApprovedWorkers] = useState([]);

  const loadWorkers = async () => {
    const pending = await api.get("/users/pending");
    const approved = await api.get("/users/approved");

    setPendingWorkers(pending.data);
    setApprovedWorkers(approved.data);
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const approveWorker = async (id) => {
    await api.post(`/users/${id}/approve`);
    loadWorkers();
  };

  const disableWorker = async (id) => {
    await api.post(`/users/${id}/disable`);
    loadWorkers();
  };

  const rejectWorker = async (id) => {
    await api.delete(`/users/${id}`);
    loadWorkers();
  };

  return (
    <div className="relative space-y-6 font-['Inter']">

      {/* Blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#5B9BD5 1px, transparent 1px), linear-gradient(90deg, #5B9BD5 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div>
        <p className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] tracking-[0.25em] text-[#F2B705]">
          <Users size={14} />
          ACCESS CONTROL
        </p>
        <h1 className="mt-1 font-['Oswald'] text-3xl font-semibold uppercase tracking-wide text-white">
          Worker Management
        </h1>
        <p className="mt-2 text-slate-400">
          Approve or reject worker accounts.
        </p>
      </div>

      {/* Pending workers */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#F2B705]" />
            <h2 className="font-['Oswald'] text-xl font-semibold uppercase tracking-wide text-white">
              Pending Workers
            </h2>
          </div>

          <span className="rounded-full border border-[#F2B705]/30 bg-[#F2B705]/10 px-3 py-1 font-['JetBrains_Mono'] text-xs tracking-wide text-[#F2B705]">
            {pendingWorkers.length} PENDING
          </span>
        </div>

        {pendingWorkers.length === 0 ? (
          <p className="rounded-lg border border-white/5 bg-[#0B0E11] p-4 text-sm text-slate-500">
            No pending workers.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingWorkers.map((worker) => (
              <div
                key={worker.id}
                className="group flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0B0E11] p-4 transition-colors duration-200 hover:border-[#F2B705]/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-white">
                    {worker.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-400">{worker.email}</p>
                  <p className="font-['JetBrains_Mono'] text-xs text-slate-500">@{worker.username}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => approveWorker(worker.id)}
                    className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-['JetBrains_Mono'] text-xs font-semibold tracking-wide text-emerald-400 transition-all duration-200 hover:border-emerald-500/60 hover:bg-emerald-500/20"
                  >
                    <UserCheck size={14} />
                    APPROVE
                  </button>

                  <button
                    onClick={() => rejectWorker(worker.id)}
                    className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-['JetBrains_Mono'] text-xs font-semibold tracking-wide text-rose-400 transition-all duration-200 hover:border-rose-500/60 hover:bg-rose-500/20"
                  >
                    <UserX size={14} />
                    REJECT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved workers */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-[#5B9BD5]" />
            <h2 className="font-['Oswald'] text-xl font-semibold uppercase tracking-wide text-white">
              Approved Workers
            </h2>
          </div>

          <span className="rounded-full border border-[#5B9BD5]/30 bg-[#5B9BD5]/10 px-3 py-1 font-['JetBrains_Mono'] text-xs tracking-wide text-[#5B9BD5]">
            {approvedWorkers.length} APPROVED
          </span>
        </div>

        {approvedWorkers.length === 0 ? (
          <p className="rounded-lg border border-white/5 bg-[#0B0E11] p-4 text-sm text-slate-500">
            No approved workers.
          </p>
        ) : (
          <div className="space-y-4">
            {approvedWorkers.map((worker) => (
              <div
                key={worker.id}
                className="group flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0B0E11] p-4 transition-colors duration-200 hover:border-[#5B9BD5]/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-white">
                    {worker.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-400">{worker.email}</p>
                  <p className="font-['JetBrains_Mono'] text-xs text-slate-500">@{worker.username}</p>
                </div>

                <button
                  onClick={() => disableWorker(worker.id)}
                  className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-['JetBrains_Mono'] text-xs font-semibold tracking-wide text-amber-400 transition-all duration-200 hover:border-amber-500/60 hover:bg-amber-500/20"
                >
                  <UserMinus size={14} />
                  DISABLE ACCESS
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}