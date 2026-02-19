
import { slideDownVariants } from "@shared/config/animationConfig"
import { Logo } from "@shared/ui/Logo"
import { MotionDiv } from "@shared/ui/MotionComponents"

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

