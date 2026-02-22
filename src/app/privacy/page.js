"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import {
    Shield, Eye, Smartphone, MapPin, Clock, Server,
    UserX, AlertTriangle, Mail, RefreshCw
} from "lucide-react";

const sections = [
    {
        icon: Eye,
        title: "আমরা কি তথ্য সংগ্রহ করি",
        color: "text-blue-400",
        items: [
            {
                label: "ডিভাইস আইডি",
                desc: "আপনার ব্রাউজারে একটি র‍্যান্ডম ইউনিক আইডি (UUID) তৈরি হয়। এটি আপনাকে চিহ্নিত করার জন্য নয়, বরং স্প্যাম প্রতিরোধ ও রেট লিমিটিংয়ের জন্য ব্যবহার হয়।",
            },
            {
                label: "আইপি ঠিকানা",
                desc: "আপডেট ও ভোট দেওয়ার সময় আপনার আইপি ঠিকানা সংরক্ষিত হয়। এটি ডুপ্লিকেট ভোট ও অপব্যবহার ঠেকাতে ব্যবহৃত হয়।",
            },
            {
                label: "জিপিএস লোকেশন",
                desc: "আপনার ব্রাউজারের GPS লোকেশন শুধুমাত্র মসজিদ খোঁজা ও জিও-ফেন্স যাচাইয়ের জন্য ব্যবহৃত হয়। এটি সার্ভারে সংরক্ষিত হয় না।",
            },
        ],
    },
    {
        icon: UserX,
        title: "আমরা কি সংগ্রহ করি না",
        color: "text-green-400",
        items: [
            { label: "নাম", desc: "আপনার নাম কখনো জিজ্ঞাসা বা সংগ্রহ করা হয় না।" },
            { label: "ইমেইল", desc: "কোনো ইমেইল ঠিকানা সংগ্রহ করা হয় না।" },
            { label: "ফোন নম্বর", desc: "কোনো ফোন নম্বর সংগ্রহ করা হয় না।" },
            { label: "পাসওয়ার্ড", desc: "কোনো একাউন্ট বা পাসওয়ার্ড নেই। লগইন লাগে না।" },
            { label: "ব্রাউজিং হিস্ট্রি", desc: "আপনি কোন পেজ ভিজিট করেছেন তা ট্র্যাক করা হয় না।" },
        ],
    },
    {
        icon: Smartphone,
        title: "ডিভাইস আইডি কিভাবে কাজ করে",
        color: "text-purple-400",
        items: [
            {
                label: "স্বয়ংক্রিয় তৈরি",
                desc: "প্রথমবার অ্যাপ ওপেন করলে একটি র‍্যান্ডম UUID তৈরি হয় এবং আপনার ব্রাউজারের localStorage-এ সেভ হয়।",
            },
            {
                label: "শুধুমাত্র স্প্যাম প্রতিরোধ",
                desc: "এটি দিয়ে চেক করা হয় — আপনি দিনে কতবার আপডেট দিয়েছেন, একই জিনিসে দুইবার ভোট দিচ্ছেন কিনা।",
            },
            {
                label: "মুছে ফেলা যায়",
                desc: "ব্রাউজারের ডেটা মুছলে ডিভাইস আইডিও মুছে যায়। নতুন আইডি তৈরি হবে।",
            },
        ],
    },
    {
        icon: MapPin,
        title: "লোকেশন তথ্যের ব্যবহার",
        color: "text-amber-400",
        items: [
            {
                label: "মসজিদ খোঁজা",
                desc: "আপনার GPS লোকেশন ব্যবহার করে কাছের ৫ কিমি ব্যাসার্ধের মসজিদ দেখানো হয়।",
            },
            {
                label: "জিও-ফেন্স যাচাই",
                desc: "আপডেট দেওয়ার সময় চেক করা হয় আপনি মসজিদ থেকে ৫০০ মিটারের মধ্যে আছেন কিনা।",
            },
            {
                label: "সংরক্ষিত হয় না",
                desc: "আপনার GPS কোঅর্ডিনেট সার্ভারে সেভ হয় না। শুধু ক্লায়েন্ট-সাইডে ব্যবহৃত হয়।",
            },
        ],
    },
    {
        icon: Server,
        title: "ডেটা সংরক্ষণ ও নিরাপত্তা",
        color: "text-cyan-400",
        items: [
            {
                label: "MongoDB ডাটাবেস",
                desc: "মসজিদের তথ্য, ইফতার আপডেট ও তারাবির সময় MongoDB-তে সংরক্ষিত হয়।",
            },
            {
                label: "এনক্রিপ্টেড সংযোগ",
                desc: "সব API কল HTTPS এর মাধ্যমে এনক্রিপ্টেড।",
            },
            {
                label: "তৃতীয় পক্ষ",
                desc: "আমরা কোনো তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি বা শেয়ার করি না।",
            },
        ],
    },
    {
        icon: AlertTriangle,
        title: "কমিউনিটি নিয়ম",
        color: "text-red-400",
        items: [
            {
                label: "ভুয়া তথ্য",
                desc: "ইচ্ছাকৃতভাবে ভুল তথ্য দিলে কমিউনিটি ভোটের মাধ্যমে আপডেট লুকানো হবে।",
            },
            {
                label: "স্প্যাম",
                desc: "রেট লিমিটিং, জিও-ফেন্সিং ও ডিভাইস আইডি দিয়ে স্প্যাম প্রতিরোধ করা হয়।",
            },
            {
                label: "অপব্যবহার",
                desc: "গুরুতর অপব্যবহারের ক্ষেত্রে আইপি ব্লক করার অধিকার আমরা সংরক্ষণ করি।",
            },
        ],
    },
];

const stagger = {
    container: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    },
};

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* হেডার */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <Shield size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-text-primary">
                    গোপনীয়তা নীতি
                </h1>
                <p className="text-text-secondary mt-2 max-w-xl mx-auto">
                    আপনার তথ্য কিভাবে ব্যবহার ও সুরক্ষিত হয় — স্বচ্ছভাবে জানুন
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
                    <RefreshCw size={12} />
                    <span>সর্বশেষ আপডেট: ফেব্রুয়ারি ২০২৬</span>
                </div>
            </motion.div>

            {/* সারসংক্ষেপ */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="mb-8">
                    <div className="bg-green-500/10 border border-green-500/25 rounded-lg p-4 text-sm text-green-400 space-y-2">
                        <p className="font-semibold text-base">✅ সংক্ষেপে</p>
                        <ul className="space-y-1.5 text-text-secondary text-xs">
                            <li>• কোনো ব্যক্তিগত তথ্য (নাম, ইমেইল, ফোন) সংগ্রহ করা হয় না</li>
                            <li>• কোনো লগইন বা একাউন্ট তৈরি করতে হয় না</li>
                            <li>• আপনার GPS লোকেশন সার্ভারে সেভ হয় না</li>
                            <li>• শুধুমাত্র ডিভাইস আইডি ও আইপি স্প্যাম প্রতিরোধে ব্যবহৃত হয়</li>
                            <li>• তৃতীয় পক্ষের কাছে কোনো তথ্য বিক্রি বা শেয়ার করা হয় না</li>
                            <li>• কোনো বিজ্ঞাপন বা ট্র্যাকিং কুকি নেই</li>
                        </ul>
                    </div>
                </Card>
            </motion.div>

            {/* বিস্তারিত সেকশনস */}
            <motion.div
                variants={stagger.container}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                {sections.map((section) => (
                    <motion.div key={section.title} variants={stagger.item}>
                        <Card>
                            <div className="flex items-center gap-3 mb-4">
                                <section.icon size={22} className={section.color} />
                                <h2 className="text-lg font-bold text-text-primary">
                                    {section.title}
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {section.items.map((item) => (
                                    <div
                                        key={item.label}
                                        className="pl-4 border-l-2 border-border"
                                    >
                                        <h3 className="text-sm font-semibold text-text-primary">
                                            {item.label}
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* কুকি পলিসি */}
                <motion.div variants={stagger.item}>
                    <Card>
                        <div className="flex items-center gap-3 mb-4">
                            <Clock size={22} className="text-orange-400" />
                            <h2 className="text-lg font-bold text-text-primary">
                                কুকি ও localStorage
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <div className="pl-4 border-l-2 border-border">
                                <h3 className="text-sm font-semibold text-text-primary">
                                    localStorage
                                </h3>
                                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                                    শুধুমাত্র ডিভাইস আইডি (UUID) localStorage-এ সেভ করা হয়। ব্রাউজারের ডেটা মুছলে এটিও মুছে যায়।
                                </p>
                            </div>
                            <div className="pl-4 border-l-2 border-border">
                                <h3 className="text-sm font-semibold text-text-primary">
                                    কুকিজ
                                </h3>
                                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                                    এই অ্যাপ কোনো ট্র্যাকিং কুকি, বিজ্ঞাপন কুকি বা তৃতীয় পক্ষের কুকি ব্যবহার করে না।
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* যোগাযোগ */}
                <motion.div variants={stagger.item}>
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <Mail size={22} className="text-primary" />
                            <h2 className="text-lg font-bold text-text-primary">
                                যোগাযোগ
                            </h2>
                        </div>
                        <p className="text-sm text-text-secondary">
                            গোপনীয়তা সম্পর্কিত কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:{" "}
                            <a
                                href="https://github.com/Tajbir23/Hujur-Gear-Iftar-Hunt/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                GitHub Issues
                            </a>
                        </p>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
