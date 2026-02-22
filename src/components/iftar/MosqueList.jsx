"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Badge from "@/components/ui/Badge";
import VoteButtons from "@/components/ui/VoteButtons";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MosqueList({ mosques, onSelectMosque }) {
    if (!mosques || mosques.length === 0) {
        return (
            <div className="text-center py-16 space-y-3">
                <span className="text-5xl">🕌</span>
                <p className="text-text-secondary text-lg">কাছাকাছি কোনো মসজিদ পাওয়া যায়নি</p>
                <p className="text-text-muted text-sm">
                    ম্যাপ ভিউ থেকে একটি মসজিদ যোগ করুন!
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {mosques.map((mosque, index) => (
                <MosqueCard
                    key={mosque._id}
                    mosque={mosque}
                    index={index}
                    onSelect={onSelectMosque}
                />
            ))}
        </div>
    );
}

function MosqueCard({ mosque, index, onSelect }) {
    const { data } = useSWR(
        `/api/iftar-updates/${mosque._id}`,
        fetcher,
        {
            refreshInterval: 60000,
            revalidateOnFocus: false,
        }
    );

    const updates = data?.updates || [];
    const latestUpdate = updates[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <Card hover className="cursor-pointer" onClick={() => onSelect?.(mosque)}>
                <div className="space-y-3">
                    {/* হেডার */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-text-primary text-sm">
                                🕌 {mosque.name}
                            </h3>
                            {mosque.address && (
                                <p className="text-xs text-text-muted mt-0.5">{mosque.address}</p>
                            )}
                        </div>
                        {latestUpdate && (
                            <Tag label={latestUpdate.status} />
                        )}
                    </div>

                    {/* সুবিধাসমূহ */}
                    {mosque.facilities?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {mosque.facilities.map((f) => (
                                <Tag key={f} label={f} />
                            ))}
                        </div>
                    )}

                    {/* আজকের মেনু */}
                    {latestUpdate ? (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-text-secondary">
                                আজকের মেনু:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {latestUpdate.menu.map((item) => (
                                    <Badge key={item} color="amber">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                            <VoteButtons
                                targetId={latestUpdate._id}
                                targetType="iftar"
                                initialFact={latestUpdate.factVotes}
                                initialFake={latestUpdate.fakeVotes}
                            />
                        </div>
                    ) : (
                        <p className="text-xs text-text-muted italic">
                            আজকে কোনো ইফতার আপডেট নেই। প্রথম আপডেট দিন!
                        </p>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
