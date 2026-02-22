"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("Network error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🔐</div>
                    <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
                    <p className="text-text-muted text-sm mt-1">Ramadan Radar Server Monitor</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-2xl p-6 space-y-4 shadow-elevated">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Username</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                                placeholder="tajbir23"
                                required
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type={showPass ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                required
                                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
