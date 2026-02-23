"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { LogOut, RefreshCw, Server, Database, Cpu, Clock, Mosque } from "lucide-react";

const fetcher = (url) => fetch(url).then(r => r.json());

function StatCard({ icon, label, value, sub, color = "emerald" }) {
    const colors = {
        emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    };
    return (
        <div className={`border rounded-xl p-4 ${colors[color]}`}>
            <div className="flex items-center gap-2 mb-2 opacity-80 text-sm">{icon} {label}</div>
            <div className="text-2xl font-bold">{value}</div>
            {sub && <div className="text-xs opacity-70 mt-1">{sub}</div>}
        </div>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const { data, error, isLoading, mutate } = useSWR("/api/admin/stats", fetcher, {
        refreshInterval: 30000,
    });

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-bg-base p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">🖥️ Server Monitor</h1>
                    <p className="text-text-muted text-sm mt-0.5">Ramadan Radar Admin</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push("/admin/reports")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all text-sm cursor-pointer"
                    >
                        📝 User Reports
                    </button>
                    <button
                        onClick={() => mutate()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-all cursor-pointer"
                        title="Refresh"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm cursor-pointer disabled:opacity-60"
                    >
                        <LogOut size={14} /> {loggingOut ? "..." : "Logout"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                    ⚠️ Stats load করতে সমস্যা হয়েছে — {error.message}
                </div>
            )}

            {isLoading ? (
                <div className="text-text-muted text-center py-16">Loading stats...</div>
            ) : data && !data.error ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            icon={<Server size={14} />}
                            label="Uptime"
                            value={data.uptime?.formatted}
                            color="emerald"
                        />
                        <StatCard
                            icon={<Cpu size={14} />}
                            label="Heap Used"
                            value={`${data.memory?.heapUsedMB} MB`}
                            sub={`Total: ${data.memory?.heapTotalMB} MB`}
                            color="blue"
                        />
                        <StatCard
                            icon={<Database size={14} />}
                            label="RSS Memory"
                            value={`${data.memory?.rssMB} MB`}
                            color="amber"
                        />
                        <StatCard
                            icon={<Clock size={14} />}
                            label="Last Updated"
                            value={new Date(data.timestamp).toLocaleTimeString("bn-BD")}
                            color="purple"
                        />
                    </div>

                    {/* DB Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-text-primary">{data.db?.mosqueCount}</div>
                            <div className="text-text-muted text-sm mt-1">🕌 মসজিদ</div>
                        </div>
                        <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-text-primary">{data.db?.iftarCount}</div>
                            <div className="text-text-muted text-sm mt-1">🍛 ইফতার আপডেট</div>
                        </div>
                        <div className="bg-bg-card border border-border rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-text-primary">{data.db?.tarabiCount}</div>
                            <div className="text-text-muted text-sm mt-1">🌙 তারাবি আপডেট</div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Recent Mosques */}
                        <div className="bg-bg-card border border-border rounded-xl p-4">
                            <h3 className="font-semibold text-text-primary mb-3 text-sm">🕌 সাম্প্রতিক মসজিদ</h3>
                            {data.recent?.mosques?.length === 0 ? (
                                <p className="text-text-muted text-sm">কোনো মসজিদ নেই</p>
                            ) : (
                                <div className="space-y-2">
                                    {data.recent?.mosques?.map(m => (
                                        <div key={m._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                            <div>
                                                <div className="text-sm text-text-primary font-medium">{m.name}</div>
                                                <div className="text-xs text-text-muted">{m.address || "No address"}</div>
                                            </div>
                                            <div className="text-xs text-text-muted">
                                                {new Date(m.createdAt).toLocaleDateString("bn-BD")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Iftar Updates */}
                        <div className="bg-bg-card border border-border rounded-xl p-4">
                            <h3 className="font-semibold text-text-primary mb-3 text-sm">🍛 সাম্প্রতিক ইফতার আপডেট</h3>
                            {data.recent?.iftarUpdates?.length === 0 ? (
                                <p className="text-text-muted text-sm">কোনো আপডেট নেই</p>
                            ) : (
                                <div className="space-y-2">
                                    {data.recent?.iftarUpdates?.map(u => (
                                        <div key={u._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                            <div>
                                                <div className="text-sm text-text-primary font-medium">
                                                    {u.mosqueId?.name || "Unknown Mosque"}
                                                </div>
                                                <div className="text-xs text-text-muted">{u.menu?.join(", ")}</div>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === "Food Available"
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : u.status === "Very Crowded"
                                                    ? "bg-amber-500/20 text-amber-400"
                                                    : "bg-red-500/20 text-red-400"
                                                }`}>
                                                {u.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-text-muted text-xs mt-6">
                        Auto-refreshes every 30 seconds • {new Date(data.timestamp).toLocaleString("en-BD")}
                    </p>
                </>
            ) : (
                <div className="text-center text-text-muted py-16">No data available</div>
            )}
        </div>
    );
}
