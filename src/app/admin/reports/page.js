"use client";

import { useState } from "react";
import useSWR from "swr";
import { ArrowLeft, MessageSquareWarning, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AdminReports() {
    const { data, error, isLoading, mutate } = useSWR("/api/admin/reports", fetcher, {
        refreshInterval: 30000, // Refresh every 30 seconds
    });

    const [updatingId, setUpdatingId] = useState(null);

    const handleResolve = async (id) => {
        setUpdatingId(id);
        try {
            const res = await fetch("/api/admin/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: "Resolved" }),
            });
            if (res.ok) {
                mutate(); // Refresh the data
            } else {
                alert("Failed to update report status");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating report");
        }
        setUpdatingId(null);
    };

    return (
        <div className="min-h-screen bg-bg-base p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
                <Link
                    href="/admin"
                    className="p-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-all"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <MessageSquareWarning size={24} className="text-amber-500" />
                        User Reports
                    </h1>
                    <p className="text-text-muted text-sm mt-0.5">Manage user feedback and bug reports</p>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                    ⚠️ Failed to load reports — {error.message || "Unknown error"}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="text-center text-text-muted py-16">Loading reports...</div>
            ) : data && data.reports ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.reports.length === 0 ? (
                        <div className="col-span-full text-center text-text-muted py-16 bg-bg-card border border-border rounded-xl">
                            <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500 opacity-50" />
                            <p>No reports found. All good!</p>
                        </div>
                    ) : (
                        data.reports.map((report) => (
                            <div
                                key={report._id}
                                className={`bg-bg-card border rounded-xl p-5 shadow-card relative overflow-hidden transition-colors ${report.status === "Pending" ? "border-amber-500/30" : "border-border opacity-70"
                                    }`}
                            >
                                {/* Status Indicator Tape */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${report.status === "Pending" ? "bg-amber-500" : "bg-emerald-500"
                                    }`} />

                                <div className="flex justify-between items-start mb-3 pl-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${report.type === "Bug" ? "bg-red-500/20 text-red-400" :
                                            report.type === "Feedback" ? "bg-blue-500/20 text-blue-400" :
                                                "bg-gray-500/20 text-gray-400"
                                            }`}>
                                            {report.type}
                                        </span>
                                        <span className={`text-xs flex items-center gap-1 ${report.status === "Pending" ? "text-amber-400" : "text-emerald-400"
                                            }`}>
                                            {report.status === "Pending" ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                                            {report.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-text-muted flex flex-col items-end">
                                        <span>{new Date(report.createdAt).toLocaleDateString("en-BD")}</span>
                                        <span>{new Date(report.createdAt).toLocaleTimeString("en-BD")}</span>
                                    </div>
                                </div>

                                <div className="pl-2">
                                    <p className="text-text-primary text-sm whitespace-pre-wrap mb-4 bg-bg-surface p-3 rounded-lg border border-border/50">
                                        {report.message}
                                    </p>

                                    {(report.contactInfo || report.ip) && (
                                        <div className="flex flex-col gap-1 mb-4 text-xs text-text-muted bg-bg-deep p-2 rounded border border-border/30">
                                            {report.contactInfo && <div><strong>Contact:</strong> {report.contactInfo}</div>}
                                            {report.ip && <div><strong>IP:</strong> {report.ip}</div>}
                                            {report.deviceId && <div><strong>Device ID:</strong> {report.deviceId}</div>}
                                        </div>
                                    )}

                                    {report.status === "Pending" && (
                                        <button
                                            onClick={() => handleResolve(report._id)}
                                            disabled={updatingId === report._id}
                                            className="w-full flex justify-center items-center gap-2 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm transition-colors disabled:opacity-50"
                                        >
                                            {updatingId === report._id ? (
                                                "Updating..."
                                            ) : (
                                                <>
                                                    <CheckCircle2 size={16} /> Mark as Resolved
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : null}
        </div>
    );
}
