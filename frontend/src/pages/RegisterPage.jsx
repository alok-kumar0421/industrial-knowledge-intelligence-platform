import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, KeyRound, Lock, UserPlus } from "lucide-react";
import api from "../lib/api";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const register = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            await api.post("/auth/register", {
                ...form,
                role: "worker",
            });

            alert("Registration Successful. Please Login.");

            navigate("/");

        } catch (err) {

            setError(
                err.response?.data?.detail ||
                "Registration failed."
            );

        }

        setLoading(false);

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
            <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#F2B705]/10 blur-[120px]" />

            <div className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-10">

                {/* corner brackets */}
                <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[#F2B705]/40" />
                <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[#F2B705]/40" />
                <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[#F2B705]/40" />
                <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[#F2B705]/40" />

                <div className="mb-8">
                    <p className="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] tracking-[0.25em] text-[#F2B705]">
                        <UserPlus size={14} />
                        NEW OPERATOR
                    </p>
                    <h1 className="mt-2 font-['Oswald'] text-3xl font-semibold uppercase tracking-wide text-white">
                        Worker Registration
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Once your account is created, it will be sent to the plant admin for approval.
                    </p>
                </div>

                <form onSubmit={register} className="space-y-4">

                    <label className="block">
                        <span className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-400">
                            FULL NAME
                        </span>
                        <div className="relative mt-2">
                            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                placeholder="Ramesh Kumar"
                                required
                                className="w-full rounded-lg border border-white/10 bg-[#0B0E11] py-3 pl-10 pr-3 text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-[#F2B705]/60 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.12)]"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-400">
                            EMAIL
                        </span>
                        <div className="relative mt-2">
                            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                placeholder="you@company.com"
                                required
                                type="email"
                                className="w-full rounded-lg border border-white/10 bg-[#0B0E11] py-3 pl-10 pr-3 text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-[#F2B705]/60 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.12)]"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-400">
                            USERNAME
                        </span>
                        <div className="relative mt-2">
                            <KeyRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                placeholder="rkumar"
                                required
                                className="w-full rounded-lg border border-white/10 bg-[#0B0E11] py-3 pl-10 pr-3 text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-[#F2B705]/60 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.12)]"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="font-['JetBrains_Mono'] text-xs tracking-wide text-slate-400">
                            PASSWORD
                        </span>
                        <div className="relative mt-2">
                            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                minLength={6}
    onInvalid={(e) =>
        e.target.setCustomValidity("Password must be at least 6 characters long.")
    }
    onInput={(e) => e.target.setCustomValidity("")}
                                className="w-full rounded-lg border border-white/10 bg-[#0B0E11] py-3 pl-10 pr-3 text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-[#F2B705]/60 focus:shadow-[0_0_0_3px_rgba(242,183,5,0.12)]"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                    </label>

                    {error && (
                        <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                            {error}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#F2B705] p-3 font-['JetBrains_Mono'] font-semibold tracking-wide text-[#0B0E11] transition-all duration-300 hover:shadow-[0_0_25px_-4px_#F2B705] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="relative z-10">
                            {loading ? "Creating..." : "Create Account"}
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
                    </button>

                </form>

            </div>

        </div>

    );
}