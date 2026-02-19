import type { FC } from "react"
import { Link } from "react-router-dom"
import { MotionFooter, MotionP, MotionDiv } from "@shared/ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants, fadeInVariants } from "@shared/config/animationConfig"

export const Footer: FC = () => {
    return (
        <MotionFooter
            className="mt-auto pb-6 text-center"
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
        >
            <MotionP
                className="text-[#A0B9B6] mb-22 text-sm font-medium tracking-wide"
                variants={staggerItemVariants}
            >
                Simple. Secure. Stateless.
            </MotionP>
            <MotionDiv
                className="flex items-center justify-center gap-8"
                variants={staggerItemVariants}
            >
                <Link to="/roadmap" className="text-primary-600 hover:text-primary transition-colors">Roadmap</Link>
                <Link to="/terms" className="text-primary-600 hover:text-primary transition-colors">Terms</Link>
                <Link to="/privacy" className="text-primary-600 hover:text-primary transition-colors">Privacy</Link>
                <Link to="/support" className="text-primary-600 hover:text-primary transition-colors">Support</Link>
            </MotionDiv>
            <MotionP
                className="text-secondary-text mt-2 text-sm"
                variants={fadeInVariants}
            >
                &copy; {new Date().getFullYear()} PaySats. All rights reserved.
            </MotionP>
        </MotionFooter>
    )
}
