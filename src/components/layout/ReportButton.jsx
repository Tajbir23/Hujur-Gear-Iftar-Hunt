"use client";

import { useState } from "react";
import { MessageSquareWarning, X, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ReportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        const formData = new FormData(e.target);
        const data = {
            type: formData.get("type"),
            message: formData.get("message"),
            contactInfo: formData.get("contactInfo"),
        };

        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to submit report");
            }

            setStatus("success");
            setTimeout(() => {
                setIsOpen(false);
                setStatus("idle");
            }, 3000);
        } catch (error) {
            setStatus("error");
            setErrorMsg(error.message);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-50 flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-surface border border-border text-text-muted hover:text-text-primary hover:border-text-muted hover:shadow-glow rounded-full glass transition-all"
                title="Report Issue to Admin"
            >
                <MessageSquareWarning size={18} />
                <span className="text-sm font-medium hidden sm:inline">Report Feature</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-bg-card border border-border rounded-xl shadow-elevated w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-bg-surface/50">
                            <h2 className="font-semibold text-text-primary flex items-center gap-2">
                                <MessageSquareWarning size={18} className="text-amber-500" />
                                Report to Admin
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-text-muted hover:text-text-primary p-1 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 relative">
                            {status === "success" ? (
                                <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-50">
                                    <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                                    <h3 className="text-lg font-bold text-text-primary mb-2">Report Submitted!</h3>
                                    <p className="text-text-muted text-sm">
                                        Thank you for your feedback. Our admins will look into it.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                            Report Type
                                        </label>
                                        <select
                                            name="type"
                                            required
                                            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                        >
                                            <option value="Bug">Bug Report</option>
                                            <option value="Feedback">Suggestions / Feedback</option>
                                            <option value="Other">Other Issues</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                            Message <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={4}
                                            placeholder="Please describe the issue or feedback in detail..."
                                            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                            Contact Info (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="contactInfo"
                                            placeholder="Email or Phone Number"
                                            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>

                                    {errorMsg && (
                                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg flex items-start gap-2">
                                            ⚠️ {errorMsg}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-black font-semibold py-2.5 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Submit Report
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
