import type { FC } from 'react';
import { motion } from 'framer-motion';
import { GlowEffect } from '../effects/GlowEffect';
import { Bitcoin } from 'lucide-react';

const NigeriaFlag = () => (
    <svg viewBox="0 0 6 3" className="w-full h-full shadow-inner">
        <rect width="2" height="3" fill="#008751" />
        <rect x="2" width="2" height="3" fill="#ffffff" />
        <rect x="4" width="2" height="3" fill="#008751" />
    </svg>
);

const GhanaFlag = () => (
    <svg viewBox="0 0 6 3" className="w-full h-full shadow-inner">
        <rect width="6" height="1" fill="#EF3340" />
        <rect y="1" width="6" height="1" fill="#FFD100" />
        <rect y="2" width="6" height="1" fill="#009739" />
        <path d="M 3 1.1 L 3.2 1.7 L 3.8 1.7 L 3.3 2.1 L 3.5 2.7 L 3 2.3 L 2.5 2.7 L 2.7 2.1 L 2.2 1.7 L 2.8 1.7 Z" fill="#000000" />
    </svg>
);

const KenyaFlag = () => (
    <svg viewBox="0 0 30 20" className="w-full h-full shadow-inner">
        <rect width="30" height="6" fill="#000000" />
        <rect y="6" width="30" height="0.5" fill="#ffffff" />
        <rect y="6.5" width="30" height="7" fill="#BB0000" />
        <rect y="13.5" width="30" height="0.5" fill="#ffffff" />
        <rect y="14" width="30" height="6" fill="#006600" />
        <path d="M 15 5 C 13 5 11 8.5 11 10 C 11 11.5 13 15 15 15 C 17 15 19 11.5 19 10 C 19 8.5 17 5 15 5 Z" fill="#000000" stroke="#ffffff" strokeWidth="0.2" />
        <circle cx="15" cy="10" r="1" fill="#ffffff" />
    </svg>
);

interface NodeProps {
    country: string;
    flag: React.ReactNode;
    status: 'active' | 'soon';
    delay: number;
    position: { x: number; y: number };
}

const CountryNode: FC<NodeProps> = ({ country, flag, status, delay, position }) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: 'spring', damping: 15 }}
            className="absolute flex flex-col items-center gap-3 z-20 group"
            style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
        >
            <div className="relative ">
                <GlowEffect
                    color={status === 'active' ? '#0AC18E' : '#94a3b8'}
                    intensity={status === 'active' ? 'high' : 'low'}
                    pulse={status === 'active'}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 p-1.5 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-primary/50"
                >
                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl ring-1 ring-white/20">
                        {flag}
                    </div>
                </GlowEffect>

                {/* status indicator dot */}
                <div className={`absolute -top-0 -right-0.5 w-4 h-4 rounded-full border-2 border-background z-30 ${status === 'active' ? 'bg-primary' : 'bg-zinc-600'}`}>
                    {status === 'active' && <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />}
                </div>
            </div>

            <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-black tracking-[0.2em] uppercase text-foreground/90 mb-1">{country}</span>
                {status === 'soon' && (
                    <span className="text-[9px] font-bold bg-zinc-800/80 text-zinc-100 px-2 md:px-3 py-1 rounded-full border border-white/5 opacity-80 backdrop-blur-md">
                        Coming Soon
                    </span>
                )}
                {status === 'active' && (
                    <span className="text-[9px] font-black bg-primary/20 text-primary px-2 md:px-3 py-1 rounded-full border border-primary/30 uppercase tracking-tighter backdrop-blur-md">
                        Live Region
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export const RegionalExpansion: FC = () => {
    return (
        <section className="w-full py-32 relative overflow-hidden bg-background">
            {/* grids */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative">
                
                <div className="flex flex-col items-center text-center  max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-primary/5 text-primary px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-primary/10 backdrop-blur-sm"
                    >
                        Regional Expansion mission
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8"
                    >
                        Scaling Local Utility, <br />
                        <span className="text-muted-foreground/60">Global Connectivity.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-sm md:text-xl leading-relaxed max-w-lg font-medium opacity-80"
                    >
                        Bringing high-speed financial infrastructure to Africa.
                        Nigeria is live, with Ghana and Kenya on the near horizon.
                    </motion.p>
                </div>

                <div className="relative w-full h-[550px] md:h-[650px] flex items-center justify-center">

                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                        <motion.path
                            d="M 500 300 L 250 300"
                            stroke="var(--primary)"
                            strokeWidth="1.5"
                            fill="none"
                            strokeDasharray="4 4"
                            className="opacity-20"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5 }}
                        />

                        <motion.path
                            d="M 500 300 L 620 300 Q 640 300 640 280 L 640 170 Q 640 150 660 150 L 750 150"
                            stroke="var(--primary)"
                            strokeWidth="10.5"
                            fill="none"
                            strokeDasharray="4 4"
                            className="opacity-10"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, delay: 0.2 }}
                        />

                        <motion.path
                            d="M 500 300 L 620 300 Q 640 300 640 320 L 640 430 Q 640 450 660 450 L 750 450"
                            stroke="var(--primary)"
                            strokeWidth="1.5"
                            fill="none"
                            strokeDasharray="4 4"
                            className="opacity-10"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, delay: 0.4 }}
                        />

                        {/* util flow - pulsing particles */}
                        {/* To Nigeria */}
                        {[0, 1.5].map((delay) => (
                            <motion.circle key={`n-${delay}`} r="3" fill="var(--primary)" initial={{ opacity: 0 }}>
                                <animateMotion
                                    dur="3s"
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                    path="M 500 300 L 250 300"
                                />
                                <motion.animate
                                    attributeName="opacity"
                                    values="0;1;0"
                                    dur="3s"
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                />
                                <motion.animate
                                    attributeName="r"
                                    values="0;4;0"
                                    dur="3s"
                                    begin={`${delay}s`}
                                    repeatCount="indefinite"
                                />
                            </motion.circle>
                        ))}

                        {/* to Ghana */}
                        <circle r="5" fill="var(--primary)" className="opacity-0">
                            <animateMotion
                                dur="4s"
                                repeatCount="indefinite"
                                path="M 500 300 L 620 300 Q 640 300 640 280 L 640 170 Q 640 150 660 150 L 750 150"
                            />
                            <animate attributeName="opacity" values="0;0.5;0" dur="4s" repeatCount="indefinite" />
                        </circle>

                        <circle r="5" fill="var(--primary)" className="opacity-0">
                            <animateMotion
                                dur="4.5s"
                                repeatCount="indefinite"
                                path="M 500 300 L 620 300 Q 640 300 640 320 L 640 430 Q 640 450 660 450 L 750 450"
                            />
                            <animate attributeName="opacity" values="0;0.5;0" dur="4.5s" repeatCount="indefinite" />
                        </circle>
                    </svg>

                    {/* Nodes Grid Layer */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto group"
                        >
                            <GlowEffect color="#0AC18E" intensity="high" pulse className="rounded-full bg-white dark:bg-zinc-950 p-2 border-2.5 md:border-4 border-primary/10 shadow-[0_0_80px_rgba(10,193,142,0.2)] transition-all duration-700 hover:scale-110">
                                <div className="w-18 h-18 md:w-30 md:h-30 rounded-full bg-primary flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
                                    <Bitcoin className="text-white drop-shadow-lg" size={80} strokeWidth={2.5} />
                                </div>
                            </GlowEffect>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-40"
                            >
                                <span className="bg-foreground text-background px-3.5 md:px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl border border-white/10">
                                    Source of Utility
                                </span>
                            </motion.div>
                        </motion.div>

                        <CountryNode
                            country="Nigeria"
                            flag={<NigeriaFlag />}
                            status="active"
                            delay={0.6}
                            position={{ x: 15, y: 50 }}
                        />

                        <CountryNode
                            country="Ghana"
                            flag={<GhanaFlag />}
                            status="soon"
                            delay={1.1}
                            position={{ x: 75, y: 24 }}
                        />

                        <CountryNode
                            country="Kenya"
                            flag={<KenyaFlag />}
                            status="soon"
                            delay={1.4}
                            position={{ x: 75, y: 76 }}
                        />
                    </div>
                </div>

                {/* social proof */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.8 }}
                    className="flex flex-col items-center mt-20"
                >
                    <div className="flex -space-x-3 mb-8">
                        {[1, 2, 3, 4].map(idx => (
                            <div key={idx} className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${idx + 10}`} alt="user" className="opacity-80" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-white flex items-center justify-center text-[10px] font-black">
                            +5K
                        </div>
                    </div>
                    <p className="font-bold text-foreground/40 tracking-wider uppercase text-[10px] text-center max-w-sm mb-12">
                        Trusted by thousands across West Africa <br />
                        <span className="text-primary/60 italic font-black">Building for the continent.</span>
                    </p>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                </motion.div> */}
            </div>
        </section>
    );
};
