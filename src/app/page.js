"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Rocket, Utensils, Clock, Users, Shield } from "lucide-react";
import Card from "@/components/ui/Card";

const modules = [
  {
    href: "/iftar-crash",
    emoji: "🍛",
    title: "ইফতার ক্র্যাশ",
    subtitle: "ব্যাচেলর এডিশন",
    description: "কাছাকাছি মসজিদে ইফতারের মেনু খুঁজুন। আজকের খাবার, ভিড়ের অবস্থা দেখুন এবং নিজেও আপডেট দিন।",
    icon: MapPin,
    gradient: "from-emerald-500 to-teal-600",
    features: ["📍 ম্যাপ ও লিস্ট ভিউ", "🍽️ লাইভ মেনু আপডেট", "👥 ভিড়ের অবস্থা"],
  },
  {
    href: "/rocket-hujur",
    emoji: "🚀",
    title: "রকেট হুজুর",
    subtitle: "ট্র্যাকার",
    description: "কোন মসজিদে ২০ রাকাত তারাবি সবচেয়ে দ্রুত শেষ হয়? রিয়েল-টাইম লিডারবোর্ড ও র‍্যাংকিং।",
    icon: Rocket,
    gradient: "from-amber-500 to-orange-600",
    features: ["🏆 লাইভ লিডারবোর্ড", "⏱️ তারাবি টাইমিং", "❄️ সুবিধার ট্যাগ"],
  },
];

const features = [
  {
    icon: Shield,
    title: "লগইন লাগবে না",
    desc: "সাথে সাথে শুরু করুন। রেজিস্ট্রেশন নেই, পাসওয়ার্ড নেই।",
  },
  {
    icon: MapPin,
    title: "জিপিএস ভেরিফাইড",
    desc: "আপডেট জিও-ফেন্সড — আপনাকে মসজিদের কাছে থাকতে হবে।",
  },
  {
    icon: Users,
    title: "কমিউনিটি ভেরিফাইড",
    desc: "ফ্যাক্ট-চেক সিস্টেম স্প্যাম ঠেকায়। প্রতিটি আপডেটে ভোট দিন।",
  },
  {
    icon: Clock,
    title: "সময় নিয়ন্ত্রিত",
    desc: "ইফতার আপডেট আসর–মাগরিবে। তারাবি আপডেট ইশার পরে।",
  },
];

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* ডেকোরেটিভ ব্যাকগ্রাউন্ড */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* হিরো সেকশন */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl sm:text-8xl mb-8"
          >
            🌙
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-extrabold">
            <span className="bg-gradient-to-r from-primary-light via-primary to-accent bg-clip-text text-transparent">
              রমাদান রাডার
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            ইফতারের দাওয়াত ও বাজ-গতির তারাবি নামাজ খুঁজে পেতে
            কমিউনিটি-চালিত আপনার গাইড। লগইন লাগবে না — শুধু আপনার লোকেশন দিন।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface border border-border">
              <Utensils size={14} className="text-primary" />
              ফ্রি ও ওপেন
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface border border-border">
              <Shield size={14} className="text-accent" />
              রেজিস্ট্রেশন নেই
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface border border-border">
              <MapPin size={14} className="text-blue-400" />
              জিপিএস ভেরিফাইড
            </span>
          </div>
        </motion.div>
      </section>

      {/* মডিউল কার্ড */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6"
        >
          {modules.map((mod) => (
            <motion.div key={mod.href} variants={stagger.item}>
              <Link href={mod.href} className="block group">
                <div className="relative rounded-2xl border border-border bg-bg-card p-8 overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-elevated group-hover:scale-[1.02]">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{mod.emoji}</span>
                      <div>
                        <h2 className="text-xl font-bold text-text-primary">
                          {mod.title}
                        </h2>
                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed">
                      {mod.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {mod.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2.5 py-1 rounded-lg bg-bg-surface border border-border text-text-muted"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      <span>দেখুন</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* কিভাবে কাজ করে */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            কিভাবে কাজ করে
          </h2>
          <p className="text-text-secondary mt-2">
            বিশ্বাসযোগ্যতা, গতি ও কমিউনিটির জন্য তৈরি
          </p>
        </motion.div>

        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={stagger.item}>
              <Card className="text-center h-full">
                <feature.icon
                  size={28}
                  className="mx-auto text-primary mb-3"
                />
                <h3 className="font-semibold text-text-primary text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
