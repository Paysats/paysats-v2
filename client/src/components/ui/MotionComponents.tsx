import { motion } from 'framer-motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
// fixing type issue... simple re-export with type assertion to fix className issue
export const MotionDiv = motion.div as any;
export const MotionHeader = motion.header as any;
export const MotionH1 = motion.h1 as any;
export const MotionH2 = motion.h2 as any;
export const MotionH3 = motion.h3 as any;
export const MotionH4 = motion.h4 as any;
export const MotionH5 = motion.h5 as any;
export const MotionH6 = motion.h6 as any;
export const MotionP = motion.p as any;
export const MotionButton = motion.button as any;
export const MotionA = motion.a as any;
export const MotionSection = motion.section as any;
/* eslint-enable @typescript-eslint/no-explicit-any */ 