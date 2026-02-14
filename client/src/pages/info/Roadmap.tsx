import React from 'react';
import { AppLayout } from "@/layouts/AppLayout";
import { MotionDiv } from "@/components/ui/MotionComponents";
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItem {
    title: string;
    subtitle: string;
    description: string;
    phase: string;
    color: string;
    items: { label: string; completed: boolean }[];
}

const roadmapData: TimelineItem[] = [
    {
        phase: "Phase 1",
        title: "Foundation",
        subtitle: "MVP Launch",
        description: "Goal: Make BCH spendable on essential services. Prove that BCH can power real, high-frequency daily payments.",
        color: "bg-emerald-500",
        items: [
            { label: "Airtime & mobile data payments", completed: true },
            { label: "Electricity token purchases", completed: true },
            { label: "Mobile-first optimized experience", completed: true },
            { label: "Real-time fiat → BCH conversion", completed: true },
            { label: "On-chain payment verification", completed: true },
            { label: "Transaction persistence & expiration handling", completed: true },
            { label: "Payment retry & recovery logic", completed: true },
        ]
    },
    {
        phase: "Phase 2",
        title: "Reliability & Scale",
        subtitle: "Growth Infrastructure",
        description: "Goal: Make PaySats production-grade. Move from MVP to dependable infrastructure.",
        color: "bg-amber-500",
        items: [
            { label: "Improved non-custodial payment flow", completed: false },
            { label: "Merchant/service provider reporting", completed: false },
            { label: "Faster payment detection", completed: false },
            { label: "Multi-country service expansion", completed: false },
            { label: "Downloadable payment receipts", completed: false },
        ]
    },
    {
        phase: "Phase 3",
        title: "Embedded BCH Utility",
        subtitle: "Advanced Features",
        description: "Goal: Make PaySats infrastructure, not just an app. Let other products plug into BCH-powered services.",
        color: "bg-blue-500",
        items: [
            { label: "Public API for third-party apps", completed: false },
            { label: "Embeddable service widgets", completed: false },
            { label: "Recurring / subscription payments", completed: false },
            { label: "White-label service integrations", completed: false },
        ]
    },
    {
        phase: "Phase 4",
        title: "Everyday BCH Ecosystem",
        subtitle: "Mass Adoption Tools",
        description: "Goal: Turn BCH into a true daily-use currency. Make BCH usable for life's essential expenses.",
        color: "bg-purple-500",
        items: [
            { label: "Flight bookings", completed: false },
            { label: "School fee payments", completed: false },
            { label: "Healthcare bill payments", completed: false },
            { label: "Global service directory", completed: false },
            { label: "Partnerships with telecom & utility providers", completed: false },
        ]
    }
];

export const Roadmap: React.FC = () => {
    return (
        <AppLayout serviceTabs={false}>
            <MotionDiv
                className="max-w-4xl mx-auto w-full px-6 py-20"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Hero Header */}
                <MotionDiv variants={staggerItemVariants} className="mb-24">
                    <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                        We are not building another checkout tool. We are building the <span className="text-primary">spending layer</span> for Bitcoin Cash.
                    </h1>
                </MotionDiv>

                {/* timeline div */}
                <div className="relative border-l border-border/50 ml-3 md:ml-6 pl-10 md:pl-16 space-y-24">
                    {roadmapData.map((item, index) => (
                        <MotionDiv
                            key={index}
                            variants={staggerItemVariants}
                            className="relative"
                        >
                            {/* dot indicator */}
                            <div className={cn(
                                "absolute -left-[51px] md:-left-[77px] top-0 w-6 h-6 rounded-full border-4 border-background shadow-lg",
                                item.color
                            )} />

                            <div className="grid md:grid-cols-5 gap-8">
                                <div className="md:col-span-2 space-y-1">
                                    <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", item.color.replace('bg-', 'text-'))}>
                                        {item.phase}
                                    </p>
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm font-medium text-muted-foreground/60 uppercase tracking-wide">
                                        {item.subtitle}
                                    </p>
                                </div>

                                <div className="md:col-span-3 space-y-6">
                                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                        {item.description}
                                    </p>

                                    <ul className="space-y-3">
                                        {item.items.map((subItem, subIndex) => (
                                            <li key={subIndex} className="flex items-start gap-3 group">
                                                {subItem.completed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-muted-foreground/30 mt-0.5 shrink-0" />
                                                )}
                                                <span className={cn(
                                                    "text-sm font-medium transition-colors",
                                                    subItem.completed ? "text-foreground/80" : "text-muted-foreground group-hover:text-foreground/60"
                                                )}>
                                                    {subItem.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </MotionDiv>
                    ))}
                </div>
            </MotionDiv>
        </AppLayout>
    );
};

export default Roadmap;
