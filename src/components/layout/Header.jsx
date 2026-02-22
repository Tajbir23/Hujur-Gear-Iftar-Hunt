"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Rocket, Menu, X } from "lucide-react";

const navLinks = [
    { href: "/iftar-crash", label: "ইফতার ক্র্যাশ", icon: MapPin, emoji: "🍛" },
    { href: "/rocket-hujur", label: "রকেট হুজুর", icon: Rocket, emoji: "🚀" },
];

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 glass-strong">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* লোগো */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="text-2xl"
                        >
                            🌙
                        </motion.span>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                            রমাদান রাডার
                        </span>
                    </Link>

                    {/* ডেস্কটপ ন্যাভ */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                    relative flex items-center gap-2 px-4 py-2
                    rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                                        }
                  `}
                                >
                                    <span>{link.emoji}</span>
                                    <span>{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* মোবাইল টগল */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* মোবাইল ন্যাভ */}
            {mobileOpen && (
                <motion.nav
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-border"
                >
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3
                    rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                                        }
                  `}
                                >
                                    <span className="text-lg">{link.emoji}</span>
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.nav>
            )}
        </header>
    );
}
