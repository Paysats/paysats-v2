import { Bitcoin } from "lucide-react"
import type { FC } from "react"
import { MotionDiv, MotionH1, MotionP } from "../ui/MotionComponents"
import { staggerContainerVariants, staggerItemVariants } from "@/config/animationConfig"
import { FloatingIcon } from "../effects/FloatingIcon"

export const Hero: FC = () => {
    return (
        <MotionDiv
            className="text-center py-12 px-4 relative"
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
        >
            <MotionH1
                className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 tracking-tight"
                variants={staggerItemVariants}
            >
                Your everyday with <br />
                <span className="text-primary flex items-center justify-center">
                    <FloatingIcon duration={3} rotate={false}>
                        <Bitcoin className="text-primary p-0 font-extrabold -mr-5" size={90} />
                    </FloatingIcon>
                    itcoinCash
                </span>
            </MotionH1>
            <MotionP
                className="text-primary-700 text-base font-medium"
                variants={staggerItemVariants}
            >
                Pay for everyday services like airtime &amp; data instantly using Bitcoin Cash.
            </MotionP>
        </MotionDiv>
    )
}

