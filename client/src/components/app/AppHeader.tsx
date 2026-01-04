import { MotionDiv } from "../ui/MotionComponents"
import { slideDownVariants } from "@/config/animationConfig"
import { Logo } from "../ui/Logo"

export const AppHeader = () => {
    return (
        <MotionDiv
            className="flex items-center justify-center w-full"
            variants={slideDownVariants}
            initial="initial"
            animate="animate"
        >
            <Logo withTitle />
        </MotionDiv>
    )
}

